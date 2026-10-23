<script setup lang="ts">
import {labelVisibleCheck, loadProp, validMsg,} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, ModelRef, nextTick, onBeforeUnmount, onMounted, ref, watch,} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

import {i18n} from "@/lang";
import {isMobile} from "@/api/device";
import {ArrowDown, ArrowRight} from "@element-plus/icons-vue";
import {
  extractCheckItem,
  useCheckMatrixItemState,
} from "@/components/comp/checkmatrix/useCheckMatrixItemState";
import {getMergeBlocks} from "@/components/comp/checkmatrix/useCheckMatrixState";
import CheckMatrixGroupNode from "@/components/comp/checkmatrix/CheckMatrixGroupNode.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  dataIndex: -1,
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",
  compSize: "default",
  source: 1,
});
const dataForm: ModelRef<any> = defineModel("dataForm");

const matrixData = computed(() => {
  const item: any = props.item;
  return item?.containerType == "checkmatrix"
      ? item?.containerFields?.[0]?.fieldList
      : [];
});


const readonly = computed(
    () => props.source === 3 || props.item?.preps?.disabled === true,
);
const allowKeyboard = computed(() => props.item?.preps?.allowKeyboard !== false);
/** 快捷批量操作开关(默认开启;部分业务禁止一键操作时置 false,单点仍可用) */
const allowQuickOp = computed(() => props.item?.preps?.allowQuickOp !== false);
const showStats = computed(() => props.item?.preps?.showStats === true);
/** 表头行(elements[0]) */
const headerRow = computed(() => matrixData.value?.[0] || []);
/** 数据行(elements[1..]) */
const dataRows = computed(() => matrixData.value?.slice(1) || []);
/** 列宽:按列位返回(项目/检查内容/频率/时段/备注) */
const colWidth = (hi: number) => {
  const n = Number(hi);
  // 项目列(分组名):按文本实际长度给足宽度
  if (n === 0) return "96px";
  // 检查内容列:长文本列,给足宽度
  if (n === 1) return `${props.item?.preps?.itemColumnWidth || 320}px`;
  // 稽核频率列
  if (n === 2) return "80px";
  const last = (headerRow.value?.length || 1) - 1;
  // 备注列
  if (n === last) return "120px";
  // 时段列
  return `${props.item?.preps?.slotColumnWidth || 96}px`;
};
const collapsed = ref(props.item?.preps?.defaultCollapsed === true);

const {
  cellValue,
  cellText,
  cellClass,
  isCustom,
  focusedField,
  editingField,
  onCellClick,
  onCellDblClick,
  cycleRow,
  handleKeydown,
  resolveOptions,
  optionName,
  optionIndex,
  setCellValue,
  nextOptionValue,
  fillEntireMatrix,
  allCheckFields,
  onEditInput,
  onEditDone,
  stats,
  keyHints,
  selectedInfo,
} = useCheckMatrixItemState({
  dataForm: dataForm as any,
  rows: matrixData as any,
  readonly,
  allowKeyboard,
});

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

/**
 * 列头点击:按视觉列索引找该列所有 checkitem 并循环
 * (数据行因 rowspan/colspan 列数不同,不能按数组索引定位,须用 preps.visualColIndex)
 */
const cycleColumnByVisual = (visualCol: number) => {
  if (readonly.value || !allowQuickOp.value) return;
  const vc = Number(visualCol);
  // 基准值:第一行数据中该视觉列的 checkitem
  let baseField: any = null;
  for (const row of dataRows.value) {
    for (const cell of row) {
      const f = extractCheckItem(cell);
      if (f && Number(f.preps?.visualColIndex) === vc) {
        baseField = f;
        break;
      }
    }
    if (baseField) break;
  }
  if (!baseField) return;
  const next = nextOptionValue(resolveOptions(baseField), cellValue(baseField));
  for (const row of dataRows.value) {
    for (const cell of row) {
      const f = extractCheckItem(cell);
      if (!f || Number(f.preps?.visualColIndex) !== vc) continue;
      // 自定义文本不参与循环
      const cur = cellValue(f);
      if (cur && optionIndex(resolveOptions(f), cur) < 0) continue;
      setCellValue(f, next);
    }
  }
};

// ===== APP 端分组/抽屉 =====
const mobileCollapsedGroups = ref<Set<string>>(new Set());
const toggleMobileGroup = (title: string) => {
  const next = new Set(mobileCollapsedGroups.value);
  next.has(title) ? next.delete(title) : next.add(title);
  mobileCollapsedGroups.value = next;
};
const isMobileGroupCollapsed = (title: string) => mobileCollapsedGroups.value.has(title);

/**
 * 树形分组(支持任意层级):按 groupLevel 从数据行的分组格构建嵌套树
 * 分组格默认 groupLevel=1(单级);多级时同组首行多个分组格各带 groupLevel
 */
/**
 * 分组格判定:显式标注 groupLevel>=1 的静态格,或视觉列 0 的静态格(默认一级)
 */
const isGroupCell = (cell: any) =>
    cell?.staticData === true &&
    (Number(cell.preps?.groupLevel) >= 1 ||
        Number(cell.preps?.visualColIndex) === 0);

/** 分组格占用的最大视觉列(决定检查内容/频率列位置,支持任意层级分组) */
const maxGroupVisualCol = computed(() => {
  let maxVc = 0;
  for (const row of (matrixData.value || []).slice(1)) {
    for (const cell of row) {
      if (isGroupCell(cell)) {
        maxVc = Math.max(maxVc, Number(cell.preps?.visualColIndex) || 0);
      }
    }
  }
  return maxVc;
});

/**
 * 树形分组(支持任意层级):按 groupLevel / 视觉列从数据行的分组格构建嵌套树
 * 单级:分组格视觉列 0(默认 groupLevel=1);多级:多个分组格各带 groupLevel(1..N)
 * 检查内容列 = 分组格最大视觉列 + 1,频率列 = +2(动态推断,支持列右移)
 */
/** 整表一键点检的选项集(取首个 checkitem 的选项) */
const wholeOptions = computed(() => {
  const first = allCheckFields.value?.[0];
  return first ? resolveOptions(first) : [];
});

const mobileGroupTree = computed(() => {
  const roots: any[] = [];
  const stack: Array<{level: number; node: any}> = [];
  const textOf = (cell: any) => checkItem(cell)?.preps?.textContent || "";
  const contentVc = maxGroupVisualCol.value + 1;
  const freqVc = maxGroupVisualCol.value + 2;
  const cellAtVisual = (row: any[], vc: number) =>
    row.find((c: any) => Number(c.preps?.visualColIndex) === vc);

  for (const row of (matrixData.value || []).slice(1)) {
    // 该行分组格(按视觉列升序 = 由外到内)
    const groupCells = row
        .filter((c: any) => isGroupCell(c) && !!textOf(c))
        .sort((a: any, b: any) =>
            Number(a.preps?.visualColIndex) - Number(b.preps?.visualColIndex));

    for (const gc of groupCells) {
      const level = Number(gc.preps?.groupLevel) || (Number(gc.preps?.visualColIndex) + 1);
      const title = textOf(gc);
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      const node = {
        key: stack.map((st) => st.node.title).join("/") + "/" + title,
        title,
        level,
        children: [] as any[],
        items: [] as any[],
      };
      if (stack.length) stack[stack.length - 1].node.children.push(node);
      else roots.push(node);
      stack.push({level, node});
    }

    // 检查内容/频率/字段归入当前最深分组
    const contentCell = cellAtVisual(row, contentVc);
    const freqCell = cellAtVisual(row, freqVc);
    const fields: any[] = [];
    for (const cell of row) {
      const f = extractCheckItem(cell);
      if (f) fields.push(f);
    }
    if (stack.length) {
      const deepest = stack[stack.length - 1].node;
      deepest.items.push({
        content: textOf(contentCell),
        freq: textOf(freqCell),
        fields,
      });
    }
  }
  return roots;
});

/** 分组统计(递归含子分组) */
const mobileGroupStats = (node: any) => {
  let filled = 0, empty = 0;
  const walk = (n: any) => {
    for (const item of n.items || []) {
      for (const field of item.fields || []) {
        if (cellValue(field) && cellValue(field) !== "") filled++;
        else empty++;
      }
    }
    for (const c of n.children || []) walk(c);
  };
  walk(node);
  return {filled, empty};
};

const mobileGroupStatClass = (group: any) => {
  const {filled, empty} = mobileGroupStats(group);
  if (empty === 0 && filled > 0) return "stat-complete";
  if (filled > 0 && empty > 0) return "stat-partial";
  return "stat-pending";
};

const mobileBlockSummary = (item: any) => {
  return item.fields.map((field: any) => {
    const val = cellValue(field);
    const opts = resolveOptions(field);
    const text = optionName(opts, val) || i18n("checkmatrix.empty");
    const idx = optionIndex(opts, val);
    return {text, cls: idx >= 0 ? `opt-${idx}` : ""};
  });
};

const onMobileChipCycle = (item: any, bi: number) => {
  if (readonly.value) return;
  const field = item.fields[bi];
  if (!field) return;
  const cur = cellValue(field);
  if (cur && optionIndex(resolveOptions(field), cur) < 0) return;
  setCellValue(field, nextOptionValue(resolveOptions(field), cur));
};

const mobileDrawerVisible = ref(false);
const mobileActiveItem = ref<any>(null);
const openMobileDrawer = (item: any) => {
  if (readonly.value) return;
  mobileActiveItem.value = item;
  mobileDrawerVisible.value = true;
};

/** 分组快捷设置:整组(含子分组)所有检查项设为指定值 */
const fillGroupByOption = (node: any, value: string) => {
  if (readonly.value) return;
  const walk = (n: any) => {
    for (const item of n.items || []) {
      for (const field of item.fields || []) {
        // 自定义文本不参与批量设置
        const cur = cellValue(field);
        if (cur && optionIndex(resolveOptions(field), cur) < 0) continue;
        setCellValue(field, value);
      }
    }
    for (const c of n.children || []) walk(c);
  };
  walk(node);
};

/** 抽屉批量快捷设置:当前检查项所有字段设为指定值 */
const fillDrawerAll = (value: string) => {
  if (readonly.value) return;
  for (const field of mobileActiveItem.value?.fields || []) {
    setCellValue(field, value);
  }
};

/** 分组快捷设置的选项集(该节点或子节点首个字段的选项) */
const mobileGroupOptions = (node: any) => {
  const find = (n: any): any => {
    const f = n?.items?.[0]?.fields?.[0];
    if (f) return f;
    for (const c of n?.children || []) {
      const r = find(c);
      if (r) return r;
    }
    return null;
  };
  const field = find(node);
  return field ? resolveOptions(field) : [];
};

/** 供递归分组组件调用的 api 集合(避免 props 爆炸) */
const mobileApi = {
  toggleGroup: (key: string) => toggleMobileGroup(key),
  isCollapsed: (key: string) => isMobileGroupCollapsed(key),
  groupStats: (node: any) => mobileGroupStats(node),
  groupStatClass: (node: any) => mobileGroupStatClass(node),
  groupOptions: (node: any) => mobileGroupOptions(node),
  fillGroup: (node: any, value: string) => fillGroupByOption(node, value),
  blockSummary: (item: any) => mobileBlockSummary(item),
  chipCycle: (item: any, bi: number) => onMobileChipCycle(item, bi),
  // 快捷操作开关(递归组件据此隐藏整组设置)
  allowQuickOp: computed(() => allowQuickOp.value),
  openDrawer: (item: any) => openMobileDrawer(item),
};

const mobileBlockLabel = (field: any, bi: number) => {
  const blocks = getMergeBlocks(field?.preps?.mergeRule, mobileActiveItem.value?.fields?.length || 1);
  const block = blocks[bi];
  return block ? i18n("checkmatrix.blockSlot", block.start + 1) : i18n("checkmatrix.blockSlot", bi + 1);
};

const checkItem = (item: any) => {
  if (Array.isArray(item)) {
    return item[0];
  }
  return item;
};
const createArray = (item: any) => {
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
};

const tableWrap = ref<HTMLElement | null>(null);
const hintCollapsed = ref(true);

watch(editingField, (key) => {
  if (!key) return;
  nextTick(() => {
    const input = tableWrap.value?.querySelector(
        ".cm-cell-edit-input",
    ) as HTMLInputElement | null;
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  });
});

onMounted(() => {
  tableWrap.value?.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  tableWrap.value?.removeEventListener("keydown", handleKeydown);
});

// 列宽调整相关状态
</script>

<template>
  <template v-if="matrixData.length > 0">
    <!-- APP 端:分组卡片(折叠/展开+抽屉填写) -->
    <template v-if="isMobile">
      <div v-if="item.label" class="group-label" :class="{'group-label-clickable': true}" @click="toggleCollapse">
        <div class="group-label-text">{{ item.label }}</div>
        <el-icon class="group-label-arrow">
          <ArrowRight v-if="collapsed"/>
          <ArrowDown v-else/>
        </el-icon>
      </div>
      <template v-if="!collapsed">
        <div class="cm-mobile">
          <div v-if="!readonly && allowQuickOp && wholeOptions.length > 0" class="cm-mobile-toolbar">
            <span class="cm-mobile-toolbar-count">{{ i18n("checkmatrix.wholeTable") }}</span>
            <el-dropdown trigger="click" @command="(cmd: string) => fillEntireMatrix(cmd)">
              <el-button link type="primary" size="small">
                {{ i18n("checkmatrix.wholeSet") }}
                <el-icon class="el-icon--right"><ArrowDown/></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                      v-for="(opt, oi) in wholeOptions"
                      :key="oi"
                      :command="opt.value"
                  >{{ i18n("checkmatrix.fillAllPrefix") }}{{ opt.name }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <check-matrix-group-node
              v-for="(node, ni) in mobileGroupTree"
              :key="ni"
              :node="node"
              :readonly="readonly"
              :api="mobileApi"
          />
        </div>
      </template>
    </template>
    <!-- PC 端:表格(行号+时段表头+三态格+快捷键) -->
    <template v-else>
    <div
        v-if="item.label"
        class="group-label group-label-clickable"
        @click="toggleCollapse"
    >
      <div class="group-label-text">{{ item.label }}</div>
      <span v-if="showStats" class="cm-item-stats">
        <span class="cm-stat-chip">{{ i18n("checkmatrix.statFilled") }} {{ stats.filled }}</span>
        <span class="cm-stat-chip">{{ i18n("checkmatrix.statEmpty") }} {{ stats.empty }}</span>
        <span v-if="stats.custom > 0" class="cm-stat-chip">
          {{ i18n("checkmatrix.statCustom") }} {{ stats.custom }}
        </span>
        <span class="cm-stat-chip cm-stat-total">/ {{ stats.total }}</span>
      </span>
      <el-icon class="group-label-arrow">
        <ArrowRight v-if="collapsed"/>
        <ArrowDown v-else/>
      </el-icon>
    </div>
    <div
        ref="tableWrap"
        v-show="!collapsed"
        class="cm-item-wrap"
        tabindex="0"
        :style="{maxHeight: item.preps?.maxHeight || 'none'}"
    >
      <div
          v-if="allowKeyboard && !readonly"
          class="cm-key-hint"
          :class="{'cm-key-hint-collapsed': isMobile && hintCollapsed}"
          @click="isMobile && (hintCollapsed = !hintCollapsed)"
      >
        <span class="cm-key-hint-label">{{ i18n("checkmatrix.keyHintLabel") }}</span>
        <el-icon v-if="isMobile" class="cm-key-hint-arrow">
          <ArrowRight v-if="hintCollapsed"/>
          <ArrowDown v-else/>
        </el-icon>
        <template v-show="!isMobile || !hintCollapsed">
          <span
              v-for="hint in keyHints"
              :key="hint.key"
              class="cm-key-chip"
          ><kbd>{{ hint.key }}</kbd> {{ hint.name }}</span>
          <span class="cm-key-chip"><kbd>{{ i18n("checkmatrix.spaceKey") }}</kbd> {{ i18n("checkmatrix.keyHintCycle") }}</span>
          <span class="cm-key-chip"><kbd>Enter</kbd> {{ i18n("checkmatrix.enterToEdit") }}</span>
        </template>
        <span class="cm-key-hint-sel">
          <template v-if="selectedInfo">
            {{ i18n("checkmatrix.keyHintCurrent") }}: {{ selectedInfo }}
          </template>
          <template v-else>{{ i18n("checkmatrix.keyHintSelectTip") }}</template>
        </span>
        <!-- 整表一键点检(按首个检查项的选项集渲染,跳过自定义文本) -->
        <span v-if="!readonly && allowQuickOp && wholeOptions.length > 0" class="cm-key-hint-batch" @click.stop>
          <el-button
              v-for="(opt, oi) in wholeOptions"
              :key="oi"
              size="small"
              link
              type="primary"
              @click="fillEntireMatrix(opt.value)"
          >{{ i18n("checkmatrix.fillAllPrefix") }}{{ opt.name }}</el-button>
        </span>
      </div>
      <table
          :style="{
          width: item.preps?.tableWidth || (item.preps?.styles?.width ?? '100%'),
        }"
          class="dynamic-table instance-table cm-item-table"
      >
        <!-- 列宽由 colgroup 定义(不受 colspan 影响,保证列与表头对齐) -->
        <colgroup>
          <col v-if="item.preps?.showLineNumber" style="width: 42px"/>
          <col v-for="(_, hi) in headerRow" :key="'cg' + hi" :style="{width: colWidth(Number(hi))}"/>
        </colgroup>
        <!-- 表头行(elements[0]):时段标签,点击整列循环 -->
        <thead>
        <tr class="cm-header-row">
          <th
              v-if="item.preps?.showLineNumber"
              class="cm-idx-head"
              :title="i18n('checkmatrix.rowCycleTip')"
          >#</th>
          <th
              v-for="(hcol, hi) in headerRow"
              :key="'h' + hi"
              class="cm-col-head"
              :title="allowQuickOp ? i18n('checkmatrix.fillColumnTip') : ''"
              @click="cycleColumnByVisual(Number(hi))"
          >{{ checkItem(hcol)?.preps?.textContent || '' }}</th>
        </tr>
        </thead>
        <!-- 数据行(elements[1..]) -->
        <tbody>
        <tr
            v-for="(row, rowIndex) in dataRows"
            :key="'r' + rowIndex"
            class="dy-tr"
        >
          <td
              v-if="item.preps?.showLineNumber"
              class="dy-cell no-cell cm-row-idx"
              :title="allowQuickOp ? i18n('checkmatrix.rowCycleTip') : ''"
              @click="allowQuickOp && cycleRow(Number(rowIndex) + 1)"
          >
            {{ Number(rowIndex) + 1 }}
          </td>
          <template v-for="(sitem, colIndex) in row" :key="'c' + colIndex">
            <td
                v-if="checkItem(sitem)?.preps?.cellVisible"
                :colspan="checkItem(sitem)?.preps?.colspan || 1"
                :rowspan="checkItem(sitem)?.preps?.rowspan || 1"
                class="dytable-cell"
            >
              <div
                  class="cm-static-cell"
                  v-if="sitem.staticData === true"
                  v-html="sitem.preps?.textContent"
              />
              <template v-else-if="extractCheckItem(sitem)">
                <div
                    class="cm-res"
                    :class="[
                      cellClass(extractCheckItem(sitem)),
                      {
                        'cm-custom': isCustom(extractCheckItem(sitem)),
                        'cm-cur': focusedField === extractCheckItem(sitem).fieldName,
                        'cm-editing': editingField === extractCheckItem(sitem).fieldName,
                      },
                    ]"
                    :tabindex="readonly ? -1 : 0"
                    @click="onCellClick(extractCheckItem(sitem))"
                    @dblclick="onCellDblClick(extractCheckItem(sitem))"
                    @focusin="focusedField = extractCheckItem(sitem).fieldName"
                >
                  <input
                      v-if="editingField === extractCheckItem(sitem).fieldName"
                      class="cm-cell-edit-input"
                      :value="cellValue(extractCheckItem(sitem))"
                      @input="onEditInput(extractCheckItem(sitem), $event)"
                      @blur="onEditDone"
                      @keydown.enter.prevent="onEditDone"
                      @keydown.esc.prevent="onEditDone"
                      @click.stop
                  >
                  <template v-else>{{ cellText(extractCheckItem(sitem)) }}</template>
                </div>
              </template>
              <template v-else v-for="tempData in createArray(sitem)">
                <el-form-item
                    v-if="tempData.type != 'button' && tempData.type != 'usercomp' && !tempData.preps?.staticData"
                    :size="compSize"
                    :label="labelVisibleCheck(tempData)"
                    class="cm-cell-form-item"
                    :prop="loadProp(propPrefix, tempData.fieldName, -1, -1)"
                    :rules="validMsg(tempData, dataForm)"
                >
                  <star-horse-item
                      :primaryKey="primaryKey"
                      :compSize="compSize"
                      v-model:dataForm="dataForm"
                      :item="tempData"
                      :dataIndex="dataIndex"
                      :source="source"
                  />
                  <template #error="{ error }">
                    <sh-error-tooltip :error="error || ''"/>
                  </template>
                </el-form-item>
                <star-horse-item
                    v-else-if="tempData.fieldName"
                    :primaryKey="primaryKey"
                    :compSize="compSize"
                    v-model:dataForm="dataForm"
                    :item="tempData"
                    :dataIndex="dataIndex"
                    :source="source"
                />
              </template>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
  </template>
  </template>
  <!-- APP 端抽屉 -->
  <teleport to="body" v-if="isMobile && mobileDrawerVisible">
    <div class="cm-drawer-mask" @click="mobileDrawerVisible = false">
      <div class="cm-drawer" @click.stop>
        <div class="cm-drawer-header">
          <div class="cm-drawer-title">{{ mobileActiveItem?.content }}</div>
          <div v-if="mobileActiveItem?.freq" class="cm-drawer-freq">{{ i18n("checkmatrix.freq") }}: {{ mobileActiveItem.freq }}</div>
        </div>
        <div class="cm-drawer-body">
          <el-descriptions v-for="(field, bi) in (mobileActiveItem?.fields || [])" :key="bi" :column="1" border direction="vertical" size="small" class="cm-drawer-desc">
            <el-descriptions-item :label="mobileBlockLabel(field, Number(bi))">
              <div class="cm-drawer-options">
                <div v-for="(opt, oi) in resolveOptions(field)" :key="oi" class="cm-drawer-option" :class="['opt-' + oi, {active: cellValue(field) === opt.value}]" @click="setCellValue(field, opt.value)">{{ opt.name }}</div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item :label="i18n('checkmatrix.customNote')">
              <el-input :model-value="cellValue(field)" size="small" :placeholder="i18n('checkmatrix.customNotePlaceholder')" @update:model-value="(v: string) => setCellValue(field, v || '')" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-if="allowQuickOp" class="cm-drawer-batch">
          <div
              v-for="(opt, oi) in (mobileActiveItem?.fields?.[0] ? resolveOptions(mobileActiveItem.fields[0]) : [])"
              :key="oi"
              class="cm-drawer-batch-btn"
              :class="['opt-' + oi, {disabled: readonly}]"
              @click="readonly ? undefined : fillDrawerAll(opt.value)"
          >{{ i18n("checkmatrix.fillAllPrefix") }}{{ opt.name }}</div>
        </div>
        <div class="cm-drawer-footer">
          <el-button class="cm-drawer-btn" @click="mobileDrawerVisible = false">{{ i18n("checkmatrix.cancel") }}</el-button>
          <el-button class="cm-drawer-btn" type="primary" @click="mobileDrawerVisible = false">{{ i18n("checkmatrix.confirm") }}</el-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.cm-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--sh-cm-head, #f2f4f7);
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 600;
  color: #2f3540;

  &:hover {
    background: var(--sh-cm-freeze, #eef1f5);
  }

  .cm-collapse-arrow {
    font-size: 16px;
    color: #57606a;
  }

  .cm-item-title {
    flex: 1;
  }

  .cm-item-stats {
    display: flex;
    gap: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #57606a;

    .cm-stat-chip {
      background: #fff;
      border: 1px solid var(--sh-cm-bd, #c9cdd3);
      border-radius: 10px;
      padding: 1px 8px;
    }

    .cm-stat-total {
      background: transparent;
      border: none;
      padding: 1px 2px;
    }
  }
}

.cm-item-wrap {
  outline: none;
  overflow: auto;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: #fff;
}

.cm-item-header + .cm-item-wrap {
  border-top: none;
}

.cm-key-hint-batch {
  margin-left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.cm-mobile-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 4px 8px;
}

.cm-mobile-toolbar-count {
  margin-right: auto;
  font-size: 12px;
  color: #8a919c;
}

.cm-key-hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 8px 10px;
  background: #fff;
  border-bottom: 1px solid var(--sh-cm-bd, #c9cdd3);
  font-size: 12px;
  color: #57606a;
  line-height: 1.4;
  cursor: pointer;

  .cm-key-hint-label {
    font-weight: 600;
    color: #2f3540;
  }

  .cm-key-chip {
    white-space: nowrap;

    kbd {
      display: inline-block;
      min-width: 22px;
      text-align: center;
      background: #f4f5f7;
      border: 1px solid #d0d3d9;
      border-bottom-width: 2px;
      border-radius: 4px;
      padding: 1px 6px;
      margin-right: 3px;
      font-size: 12px;
      font-family: inherit;
      color: #2f3540;
    }
  }

  .cm-key-hint-sel {
    margin-left: auto;
    color: #2563eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 45%;
  }
}

.cm-key-hint-collapsed {
  flex-wrap: nowrap;
  overflow: hidden;
}

.cm-key-hint-arrow {
  flex: none;
  font-size: 12px;
  color: #8a919c;
  margin-left: 4px;
}

.cm-item-table {
  .cm-head-row {
    background: var(--sh-cm-head, #f2f4f7);
  }

  .cm-idx-head {
    width: 42px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #57606a;
    padding: 6px;
    border: 1px solid var(--sh-cm-bd, #c9cdd3);
  }

  .cm-col-head {
    position: relative;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #57606a;
    padding: 6px;
    border: 1px solid var(--sh-cm-bd, #c9cdd3);
    cursor: pointer;
    user-select: none;

    &:hover {
      outline: 2px solid var(--sh-cm-accent, #2563eb);
      outline-offset: -2px;
    }
  }

  .cm-row-idx {
    width: 42px;
    text-align: center;
    color: #57606a;
    cursor: pointer;
    font-size: 12px;
    user-select: none;
    font-weight: 600;

    &:hover {
      outline: 2px solid var(--sh-cm-accent, #2563eb);
      outline-offset: -2px;
    }
  }
}

.dytable-cell {
  text-overflow: ellipsis;
  position: relative;
  background-color: #fff;
  padding: 6px !important;
  vertical-align: middle;
  font-size: 13px;
  transition: background 0.15s;

  /* 鼠标移上单元格:仅浅底高亮(不带边框,避免与三态格选中/聚焦边框叠加成双边框) */
  &:hover {
    background: #f7f9fc;
  }

  /* 可编辑格(输入控件/三态格)hover:淡蓝底提示 */
  &:has(> .cm-cell-form-item):hover,
  &:has(> .cm-res):hover {
    background: #f0f7ff;
  }

  /* 输入聚焦:整格蓝框(编辑态,唯一在此处出现的边框) */
  &:focus-within {
    background: #fff;
    box-shadow: inset 0 0 0 2px var(--sh-cm-accent, #2563eb);
  }
}

.no-cell {
  border: 1px solid var(--star-horse-style);
}

:deep(.el-form-item__content) {
  height: 100% !important;
}

.col-resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -3px;
  width: 6px;
  cursor: col-resize;
  background: var(--star-horse-style);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1000;
  visibility: visible;

  &:hover {
    opacity: 1;
  }
}

.title-style {
  font-weight: 700;
  background: #f5f7fa;
  color: #606266;
}

.cm-res {
  width: 100%;
  height: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  transition: background 0.15s;
  border-radius: 2px;

  /* hover 边框统一由父单元格 .dytable-cell:hover 提供,此处不再叠加(避免双边框) */

  &.opt-1 {
    background: var(--sh-cm-ok-bg, #e8f6ee);
    color: var(--sh-cm-ok, #16a34a);
    font-weight: 700;
  }

  &.opt-2 {
    background: var(--sh-cm-ng-bg, #fdecec);
    color: var(--sh-cm-ng, #dc2626);
    font-weight: 700;
  }

  &.opt-3 {
    background: var(--sh-cm-na-bg, #fdf3e3);
    color: var(--sh-cm-na, #d97706);
    font-weight: 600;
  }

  &.opt-4 {
    background: #eef2fb;
    color: #4b5bab;
    font-weight: 600;
  }

  &.opt-5 {
    background: #f3eefb;
    color: #7c4bb0;
    font-weight: 600;
  }

  &.cm-cur {
    outline: 2px solid var(--sh-cm-accent, #2563eb);
    outline-offset: -2px;
  }

  &.cm-editing {
    background: #fff !important;
  }

  &.cm-custom {
    background: #f0f7ff;
    color: #1f4e79;
    font-size: 12px;
  }
}

.cm-cell-edit-input {
  width: 100%;
  height: 100%;
  min-height: 32px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  text-align: center;
  padding: 2px 6px;
  box-sizing: border-box;
}

table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  table-layout: fixed;
  border-spacing: 0;
  border-color: gray;
}

tr {
  display: table-row;
  vertical-align: inherit;
  unicode-bidi: isolate;
  border-color: inherit;
}

.instance-table tbody {
  td {
    line-height: 35px;
    border: 1px solid #E8E9EB;
    min-height: 35px;
    padding: 1px;

    :deep(.el-form-item--default),
    :deep(.el-form-item--large),
    :deep(.el-form-item--small),
    :deep(.el-form-item) {
      margin-bottom: 0 !important;
    }

    :deep(.el-form-item__error) {
      top: 0 !important;
      transform: translateY(-10%);
    }
  }
}

.striped-table tbody tr:nth-child(even) {
  background: #fafafa;
}

/* 表头行(sticky,浅灰背景,加粗) */
.cm-header-row {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f2f4f7;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
}

.cm-header-row td {
  padding: 6px 4px;
  border: 1px solid #c9cdd3;
}

/* ===== checkmatrix 表格样式 ===== */
.cm-item-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  border: 1px solid #c9cdd3;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.cm-item-table th,
.cm-item-table td {
  border-right: 1px solid #c9cdd3;
  border-bottom: 1px solid #c9cdd3;
  padding: 0;
  box-sizing: border-box;
}

.cm-item-table th:last-child,
.cm-item-table td:last-child {
  border-right: none;
}

/* 表头行:sticky + 浅灰底 + 加粗,时段两行显示 */
.cm-header-row th {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f2f4f7;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  padding: 6px 4px;
  white-space: pre-line;
  line-height: 1.35;
  cursor: pointer;
}

.cm-header-row th:hover {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.cm-idx-head {
  width: 42px;
}

/* 行号列:冻结 + 可点击整行循环 */
.cm-row-idx {
  position: sticky;
  left: 0;
  z-index: 5;
  width: 42px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #57606a;
  cursor: pointer;
  background: #fafbfc;
}

.cm-row-idx:hover {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

/* 静态文本格 */
.cm-static-cell {
  padding: 6px 8px;
  font-size: 13px;
  line-height: 1.45;
  color: #2f3540;
  word-break: break-all;
  white-space: pre-line;
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* 三态结果格:占满单元格 */
.cm-res {
  width: 100%;
  height: 100%;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  transition: background 0.15s;


  &.opt-1 { background: #e8f6ee; color: #16a34a; font-weight: 700; }
  &.opt-2 { background: #fdecec; color: #dc2626; font-weight: 700; }
  &.opt-3 { background: #fdf3e3; color: #d97706; font-weight: 600; }
  &.opt-4 { background: #eef2fb; color: #4b5bab; font-weight: 600; }
  &.opt-5 { background: #f3eefb; color: #7c4bb0; font-weight: 600; }
  &.cm-custom { background: #f0f7ff; color: #1f4e79; font-size: 12px; }
  &.cm-cur { outline: 2px solid #2563eb; outline-offset: -2px; }
  &.cm-editing { background: #fff !important; }
}

/* 编辑输入框:占满单元格无边框 */
.cm-cell-edit-input {
  width: 100%;
  height: 100%;
  min-height: 34px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  text-align: left;
  padding: 2px 6px;
  box-sizing: border-box;
}

/* 普通字段格:输入控件占满 */
.dytable-cell .cm-cell-form-item {
  margin-bottom: 0;
  height: 100%;
}

.dytable-cell :deep(.el-form-item__content) {
  height: 100% !important;
}

.dytable-cell :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: transparent;
}

.dytable-cell :deep(.el-input__inner) {
  text-align: left;
  height: 100%;
  padding-left: 4px;
  padding-right: 4px;
}

/* 静态文本格 hover 也可感知(跟随 .dytable-cell) */
.cm-static-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 分组标题:group-label 全局样式已定义,此处补充箭头对齐 */
.group-label-clickable {
  display: flex;
  align-items: center;

  .group-label-text {
    flex: 1;
  }

  .group-label-arrow {
    flex: none;
    font-size: 14px;
    color: #8a919c;
  }
}

.cm-item-stats {
  display: flex;
  gap: 6px;
  margin-right: 8px;
}

.cm-stat-chip {
  font-size: 11px;
  color: #8a919c;
}

.cm-item-wrap {
  overflow: auto;
  outline: none;
}

/* ===== APP 端:分组卡片 ===== */
.cm-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cm-mobile-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.cm-mobile-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 6px;
}

.cm-mobile-card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.cm-mobile-collapse-icon {
  flex: none;
  font-size: 14px;
  color: #8a919c;
}

.cm-mobile-card-stat {
  font-size: 11px;
  margin-left: 8px;
  white-space: nowrap;

  &.stat-complete { color: #16a34a; }
  &.stat-partial { color: #d97706; }
  &.stat-pending { color: #dc2626; }
}

.cm-mobile-item {
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #f0f1f3;

  &:last-of-type { border-bottom: none; }
}

.cm-mobile-content {
  font-size: 14px;
  line-height: 1.5;
  color: #1f2329;
}

.cm-mobile-freq {
  font-size: 12px;
  color: #8a919c;
  margin: 4px 0;
}

.cm-mobile-stat {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin: 6px 0 2px;
}

.cm-mobile-stat-chip {
  cursor: pointer;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #4e5560;

  &.opt-1 { background: #e8f6ee; color: #16a34a; font-weight: 600; }
  &.opt-2 { background: #fdecec; color: #dc2626; font-weight: 600; }
  &.opt-3 { background: #fdf3e3; color: #d97706; font-weight: 600; }
  &.opt-4 { background: #eef2fb; color: #4b5bab; font-weight: 600; }
  &.opt-5 { background: #f3eefb; color: #7c4bb0; font-weight: 600; }
}

.cm-mobile-stat-action {
  font-size: 12px;
  color: #2563eb;
}

/* ===== APP 端:抽屉 ===== */
.cm-drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.cm-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
}

.cm-drawer-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f0f1f3;
}

.cm-drawer-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: #1f2329;
  word-break: break-all;
}

.cm-drawer-freq {
  font-size: 12px;
  color: #8a919c;
  margin-top: 4px;
}

.cm-drawer-body {
  overflow-y: auto;
  padding: 12px 16px;
  flex: 1;
}

.cm-drawer-desc {
  margin-bottom: 12px;
}

.cm-drawer-desc :deep(.el-descriptions__cell) {
  padding: 8px 10px;
}

.cm-drawer-desc .cm-drawer-options {
  display: flex;
  gap: 8px;
  width: 100%;
}

.cm-drawer-desc .cm-drawer-option {
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: center;
  padding: 8px 2px;
  border-radius: 6px;
  border: 1px solid #dfe2e7;
  font-size: 13px;
  line-height: 1.2;
  color: #4e5560;
  user-select: none;

  &.opt-0.active { background: #f3f4f6; border-color: #4e5560; color: #1f2329; font-weight: 700; }
  &.opt-1.active { background: #e8f6ee; border-color: #16a34a; color: #16a34a; font-weight: 700; }
  &.opt-2.active { background: #fdecec; border-color: #dc2626; color: #dc2626; font-weight: 700; }
  &.opt-3.active { background: #fdf3e3; border-color: #d97706; color: #d97706; font-weight: 700; }
  &.opt-4.active { background: #eef2fb; border-color: #4b5bab; color: #4b5bab; font-weight: 700; }
  &.opt-5.active { background: #f3eefb; border-color: #7c4bb0; color: #7c4bb0; font-weight: 700; }
}

/* 抽屉输入框:数据左对齐 + 激活加边框 */
.cm-drawer-desc :deep(.el-input) {
  width: 100%;
}

.cm-drawer-desc :deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #dfe2e7;
  border-radius: 6px;
}

.cm-drawer-desc :deep(.el-input__wrapper.is-focus) {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb inset;
}

.cm-drawer-desc :deep(.el-input__inner) {
  text-align: left;
}

/* 抽屉批量快捷设置(与上方选项同一选项集,逐列对齐) */
.cm-drawer-batch {
  display: flex;
  gap: 8px;
  padding: 8px 16px 4px;

  .cm-drawer-batch-btn {
    cursor: pointer;
    flex: 1;
    min-width: 0;
    text-align: center;
    padding: 8px 2px;
    border-radius: 6px;
    border: 1px solid #dfe2e7;
    background: #fff;
    font-size: 13px;
    line-height: 1.2;
    color: #4e5560;
    user-select: none;

    &.opt-1 { color: #16a34a; border-color: #bfe6cd; }
    &.opt-2 { color: #dc2626; border-color: #f3c8c8; }
    &.opt-3 { color: #d97706; border-color: #f0dcb4; }
    &.opt-4 { color: #4b5bab; border-color: #c9d2ec; }
    &.opt-5 { color: #7c4bb0; border-color: #ddcdf0; }
    &.disabled { opacity: 0.5; }
  }
}

/* 分组卡片右侧操作区 */
.cm-mobile-card-actions {
  margin-left: auto;
  flex: none;
  display: flex;
  align-items: center;
}

.cm-drawer-footer {
  display: flex;
  gap: 10px;
  padding: 10px 16px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #f0f1f3;
}

.cm-drawer-btn {
  flex: 1;
  margin: 0;
  padding: 12px 0;
  font-size: 15px;
}

</style>