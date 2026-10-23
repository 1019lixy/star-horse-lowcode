<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {i18n} from "@/lang";
import {isMobile} from "@/api/device";
import {ArrowDown, ArrowRight} from "@element-plus/icons-vue";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    buildKeyMapHints,
    ensureCheckValue,
    fillRowResults,
    getCheckStats,
    getMergeBlocks,
    keyToOptionValue,
    type KeyHint,
    nextOptionValue,
    optionIndex,
    optionName,
    resolveTimeSlots,
    resolveEditColumns,
    rowHasAbnormal,
    setSlotResult,
    type CheckRenderRow,
} from "@/components/comp/checkmatrix/useCheckMatrixState";

const props = defineProps<{
    rows: CheckRenderRow[];
    value: CheckMatrixValue;
    preps?: CheckMatrixPreps;
    disabled?: boolean;
    source?: number;
}>();
const emits = defineEmits(["change"]);

const tableWrap = ref<HTMLElement | null>(null);
const focusedKey = ref("");
/** Enter 进入文本编辑模式(选中单元格后按 Enter) */
const editingKey = ref("");
/** APP 端快捷键提示条收缩为气泡 */
const hintCollapsed = ref(true);
/** 整行选中的检查项 key(点行号选中后,数字键作用于整行) */
const selectedRowKey = ref("");
const readonly = computed(() => props.disabled || props.source === 3);
const timeSlots = computed(() => resolveTimeSlots(props.preps));
const slotCount = computed(() => timeSlots.value.length);
const showRemark = computed(() => props.preps?.showRemark !== false);
const columnModel = computed(() => props.preps?.columnModel || "triState");
const editColumns = computed(() => resolveEditColumns(props.preps));

const itemValue = computed(() =>
    ensureCheckValue(props.value, props.rows, props.preps),
);

const blocksOf = (row: CheckRenderRow) =>
    getMergeBlocks(row.item.mergeRule, slotCount.value);

const rowAbnormal = (row: CheckRenderRow) =>
    columnModel.value === "triState" && rowHasAbnormal(props.value, row);

const cellKey = (row: CheckRenderRow, slotIndex: number) =>
    `${row.key}|${slotIndex}`;

const isFocused = (row: CheckRenderRow, slotIndex: number) =>
    focusedKey.value === cellKey(row, slotIndex);

/** 单元格存储值 */
const slotValue = (row: CheckRenderRow, slotIndex: number): string =>
    itemValue.value.rows[row.key]?.results?.[slotIndex] || "";

/** 单元格显示文案(按本行配置的选项 name) */
const slotText = (row: CheckRenderRow, slotIndex: number): string =>
    optionName(row.options, slotValue(row, slotIndex));

/** 单元格颜色类(按选项序号:opt-1/opt-2/opt-3...,不硬编码 OK/NG/NA) */
const slotClass = (row: CheckRenderRow, slotIndex: number): string => {
    const idx = optionIndex(row.options, slotValue(row, slotIndex));
    return idx >= 0 ? `opt-${idx}` : "";
};

const onCellClick = (row: CheckRenderRow, slotIndex: number) => {
    if (readonly.value) return;
    selectedRowKey.value = "";
    const key = cellKey(row, slotIndex);
    if (focusedKey.value === key) {
        // 同一格已选中 → 再次点击循环切换选项
        const currentVal = slotValue(row, slotIndex);
        // 自定义文本(不在选项列表里)不参与循环,保留用户输入
        if (currentVal && optionIndex(row.options, currentVal) < 0) return;
        setSlotResult(
            props.value,
            row,
            slotIndex,
            nextOptionValue(row.options, currentVal),
            props.preps,
        );
    } else {
        // 不同格 → 仅选中(不循环),后续可按 Enter 编辑/数字键设值/空格循环
        focusedKey.value = key;
    }
    emits("change");
};

const onHeaderClick = (slotIndex: number) => {
    if (readonly.value) return;
    if (props.preps?.fillColumnOnHeaderClick === false) return;
    // 整列循环:以第一行该列当前值为基准,按首行选项循环
    const firstRow = props.rows[0];
    if (!firstRow) return;
    const next = nextOptionValue(firstRow.options, slotValue(firstRow, slotIndex));
    for (const row of props.rows) {
        // 跳过自定义文本(值不在选项列表里的格保留用户输入)
        const currentVal = slotValue(row, slotIndex);
        if (currentVal && optionIndex(row.options, currentVal) < 0) continue;
        setSlotResult(props.value, row, slotIndex, next, props.preps);
    }
    emits("change");
};

const onRowIndexClick = (row: CheckRenderRow) => {
    if (readonly.value) return;
    // 选中整行:后续数字键作用于整行(设置行)
    selectedRowKey.value = row.key;
    focusedKey.value = "";
    if (props.preps?.fillRowOnIndexClick === false) return;
    // 整行循环:以行首格当前值为基准,按本行选项循环
    const results = itemValue.value.rows[row.key]?.results || [];
    const next = nextOptionValue(row.options, results[0] || "");
    // 逐格设置,跳过自定义文本(值不在选项列表里的格保留原值)
    const blocks = blocksOf(row);
    for (const block of blocks) {
        for (let k = 0; k < block.span; k++) {
            const slotIdx = block.start + k;
            const currentVal = results[slotIdx] || "";
            if (currentVal && optionIndex(row.options, currentVal) < 0) continue;
            setSlotResult(props.value, row, slotIdx, next, props.preps);
        }
    }
    emits("change");
};

const onRemarkInput = (row: CheckRenderRow, event: Event) => {
    const rowValue = itemValue.value.rows[row.key];
    rowValue.remark = (event.target as HTMLInputElement).value;
    emits("change");
};

const onEditColumnInput = (row: CheckRenderRow, columnKey: string, val: string) => {
    const rowValue = itemValue.value.rows[row.key];
    if (!rowValue.values) rowValue.values = {};
    rowValue.values[columnKey] = val || "";
    emits("change");
};

const handleKeydown = (e: KeyboardEvent) => {
    if (readonly.value) return;
    if (props.preps?.allowKeyboard === false) return;
    if (document.activeElement?.tagName === "INPUT") return;
    // 目标:整行选中优先(设置行),否则当前单元格(设置单元格)
    const rowKey = selectedRowKey.value || focusedKey.value.split("|")[0];
    const target = rowKey ? findRow(rowKey) : null;
    if (!target) return;
    const isRowMode = !!selectedRowKey.value;
    // 数字键按当前行备选项顺序取值(0=空,1..N=第 1..N 个非空项;按键数=选项数+1)
    const mapped = keyToOptionValue(target.options, e.key);
    if (mapped === null) {
        if (e.key === " ") {
            e.preventDefault();
            const current = isRowMode
                ? itemValue.value.rows[target.key]?.results?.[0] || ""
                : currentFocusedValue(target);
            // 自定义文本(不在选项列表里)不参与循环,保留用户输入
            if (current && optionIndex(target.options, current) < 0) return;
            applyTarget(
                target,
                nextOptionValue(target.options, current),
                isRowMode,
            );
        } else if (e.key === "Enter" && focusedKey.value) {
            e.preventDefault();
            editingKey.value = focusedKey.value;
        }
        return;
    }
    e.preventDefault();
    applyTarget(target, mapped, isRowMode);
};

/** 按目标粒度写入:整行 或 单单元格 */
const applyTarget = (
    row: CheckRenderRow,
    result: string,
    rowMode: boolean,
) => {
    if (rowMode) {
        fillRowResults(props.value, row, result, props.preps);
    } else {
        applyFocused(result);
    }
    emits("change");
};

const currentFocusedValue = (row: CheckRenderRow) =>
    slotValue(row, Number(focusedKey.value.split("|")[1]));

const findRow = (rowKey: string) =>
    props.rows.find((row) => row.key === rowKey) || null;

const onEditInput = (row: CheckRenderRow, slotIndex: number, event: Event) => {
    const rowValue = itemValue.value.rows[row.key];
    if (!rowValue || !Array.isArray(rowValue.results)) return;
    rowValue.results[slotIndex] = (event.target as HTMLInputElement).value;
    emits("change");
};

const onEditDone = () => {
    editingKey.value = "";
};

const applyFocused = (result: string) => {
    const [rowKey, slotIndex] = focusedKey.value.split("|");
    const row = findRow(rowKey);
    if (!row) return;
    setSlotResult(props.value, row, Number(slotIndex), result, props.preps);
    emits("change");
};

const stats = computed(() =>
    getCheckStats(props.value, props.rows, props.preps),
);
defineExpose({stats});

const itemColumnWidth = computed(
    () => `${props.preps?.itemColumnWidth || 320}px`,
);
const slotColumnWidth = computed(
    () => `${props.preps?.slotColumnWidth || 84}px`,
);

/**
 * 整行聚合状态(序号格着色): 行内所有格一致时返回其选项序号类,否则返回空
 */
const rowState = (row: CheckRenderRow) => {
    const results = itemValue.value.rows[row.key]?.results || [];
    if (!results.length) return "";
    const first = results[0];
    return results.every((result) => result === first)
        ? slotClass(row, 0)
        : "";
};

/**
 * 表格总列数(note 行跨列用)
 */
/** 聚焦行的按键提示(无聚焦时用首行配置,即表级默认;完全按配置生成) */
const focusedRow = computed(() => {
    if (!focusedKey.value) return null;
    return findRow(focusedKey.value.split("|")[0]);
});

const keyHints = computed<KeyHint[]>(() =>
    buildKeyMapHints(
        (focusedRow.value || props.rows[0])?.options || [],
    ),
);

/** 当前选中单元格描述(行内容 / 时段 / 当前值);未选中时返回空 */
const selectedInfo = computed(() => {
    const row = focusedRow.value;
    if (row) {
        const slotIndex = Number(focusedKey.value.split("|")[1]);
        const slot = timeSlots.value[slotIndex];
        const valueText =
            optionName(row.options, slotValue(row, slotIndex)) ||
            i18n("checkmatrix.empty");
        const slotText =
            slot?.label || i18n("checkmatrix.blockSlot", slotIndex + 1);
        return `${row.item.content.slice(0, 18)} · ${slotText} = ${valueText}`;
    }
    if (selectedRowKey.value) {
        const target = findRow(selectedRowKey.value);
        if (target) {
            const firstValue =
                itemValue.value.rows[target.key]?.results?.[0] || "";
            const valueText =
                optionName(target.options, firstValue) ||
                i18n("checkmatrix.empty");
            return `${i18n("checkmatrix.wholeRow")} · ${target.item.content.slice(0, 18)} = ${valueText}`;
        }
    }
    return "";
});

const totalColumns = computed(() => {
    let count:number = 3;
    if (columnModel.value === "triState") {
        count = 4 + slotCount.value;
    } else {
        count = 3 + editColumns.value.length;
    }
    if (showRemark.value) count += 1;
    return count;
});

/** Enter 激活编辑后自动聚焦输入框,光标定位到内容末尾 */
watch(editingKey, (key) => {
    if (!key) return;
    nextTick(() => {
        const input = tableWrap.value?.querySelector(".cm-cell-edit-input") as HTMLInputElement | null;
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
</script>

<template>
  <div
      ref="tableWrap"
      class="cm-scroller"
      tabindex="0"
      :style="{maxHeight: preps?.maxHeight || 'calc(100vh - 300px)'}"
  >
    <div
        v-if="columnModel === 'triState' && preps?.allowKeyboard !== false"
        class="cm-key-hint"
        :class="{'cm-key-hint-collapsed': isMobile && hintCollapsed}"
        @click="isMobile && (hintCollapsed = !hintCollapsed)"
    >
      <span class="cm-key-hint-label">{{ i18n("checkmatrix.keyHintLabel") }}</span>
      <el-icon v-if="isMobile" class="cm-key-hint-arrow">
        <ArrowRight v-if="hintCollapsed"/>
        <ArrowDown v-else/>
      </el-icon>
      <span
          v-show="!isMobile || !hintCollapsed"
          v-for="hint in keyHints"
          :key="hint.key"
          class="cm-key-chip"
      ><kbd>{{ hint.key }}</kbd> {{ hint.name }}</span>
      <span v-show="!isMobile || !hintCollapsed" class="cm-key-chip"><kbd>{{ i18n("checkmatrix.spaceKey") }}</kbd> {{ i18n("checkmatrix.keyHintCycle") }}</span>
      <span v-show="!isMobile || !hintCollapsed" class="cm-key-chip"><kbd>Enter</kbd> {{ i18n("checkmatrix.enterToEdit") }}</span>
      <span v-show="!isMobile || !hintCollapsed" class="cm-key-hint-sel">
        <template v-if="selectedInfo">
          {{ i18n("checkmatrix.keyHintCurrent") }}: {{ selectedInfo }}
        </template>
        <template v-else>{{ i18n("checkmatrix.keyHintSelectTip") }}</template>
      </span>
    </div>
    <table class="cm-table">
      <thead>
      <tr v-if="columnModel === 'triState'">
        <th class="cm-idx" :title="i18n('checkmatrix.rowCycleTip')">#</th>
        <th class="cm-pj">{{ i18n("checkmatrix.project") }}</th>
        <th class="cm-item" :style="{width: itemColumnWidth}">{{ i18n("checkmatrix.item") }}</th>
        <th class="cm-freq">{{ i18n("checkmatrix.freq") }}</th>
        <th
            v-for="(slot, si) in timeSlots"
            :key="si"
            class="cm-slot"
            :style="{width: slotColumnWidth}"
            :title="i18n('checkmatrix.fillColumnTip')"
            @click="onHeaderClick(si)"
        >
          <div class="cm-slot-day">{{ slot.label }}</div>
          <div v-if="slot.sub" class="cm-slot-night">{{ slot.sub }}</div>
        </th>
        <th v-if="showRemark" class="cm-remark">{{ i18n("checkmatrix.remark") }}</th>
      </tr>
      <tr v-else>
        <th class="cm-idx">#</th>
        <th class="cm-pj">{{ i18n("checkmatrix.project") }}</th>
        <th class="cm-item" :style="{width: itemColumnWidth}">{{ i18n("checkmatrix.item") }}</th>
        <th
            v-for="column in editColumns"
            :key="column.key"
            class="cm-edit-head"
            :style="{width: (column.width || 140) + 'px'}"
        >
          {{ column.label }}
        </th>
        <th v-if="showRemark" class="cm-remark">{{ i18n("checkmatrix.remark") }}</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, ri) in rows"
          :key="row.key"
          :class="{'cm-row-ng': rowAbnormal(row)}"
      >
        <td
            class="cm-idx"
            :class="[
              'cm-idx-state',
              rowState(row),
              {'cm-idx-selected': selectedRowKey === row.key},
            ]"
            :title="i18n('checkmatrix.rowCycleTip')"
            @click="onRowIndexClick(row)"
        >{{ ri + 1 }}</td>
        <td
            v-if="row.isGroupFirst"
            class="cm-pj"
            :rowspan="row.groupSize"
        >{{ row.groupTitle }}</td>
        <td class="cm-item">{{ row.item.content }}</td>
        <td
            v-if="columnModel === 'triState'"
            class="cm-freq"
        >{{ row.item.freq }}</td>
        <template v-if="columnModel === 'triState'">
          <td
              v-for="(block, bi) in blocksOf(row)"
              :key="row.key + '_b' + bi"
              class="cm-res"
              :class="[
                  editingKey === cellKey(row, block.start) ? 'cm-editing' : slotClass(row, block.start),
                  {'cm-cur': isFocused(row, block.start)},
                  {'cm-custom': slotValue(row, block.start) && optionIndex(row.options, slotValue(row, block.start)) < 0},
              ]"
              :colspan="block.span"
              :tabindex="readonly ? -1 : 0"
              @click="onCellClick(row, block.start)"
              @focusin="focusedKey = cellKey(row, block.start)"
              @keydown="handleKeydown"
          >
            <input
                v-if="editingKey === cellKey(row, block.start)"
                class="cm-cell-edit-input"
                :value="slotValue(row, block.start)"
                @input="onEditInput(row, block.start, $event)"
                @blur="onEditDone"
                @keydown.enter.prevent="onEditDone"
                @keydown.esc.prevent="onEditDone"
                @click.stop
            >
            <template v-else>{{ slotText(row, block.start) }}</template>
          </td>
        </template>
        <template v-else>
          <td
              v-for="column in editColumns"
              :key="column.key"
              class="cm-edit-cell"
          >
            <el-select
                v-if="column.type === 'select'"
                :model-value="itemValue.rows[row.key]?.values?.[column.key] || ''"
                :disabled="readonly"
                size="small"
                clearable
                @update:model-value="(v: any) => onEditColumnInput(row, column.key, v || '')"
            >
              <el-option
                  v-for="opt in column.values || []"
                  :key="opt.value"
                  :label="opt.name"
                  :value="opt.value"
              />
            </el-select>
            <el-input
                v-else
                :model-value="itemValue.rows[row.key]?.values?.[column.key] || ''"
                :disabled="readonly"
                :type="column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'"
                size="small"
                :placeholder="readonly ? '' : i18n('api.pleaseInput2')"
                @update:model-value="(v: string) => onEditColumnInput(row, column.key, v || '')"
            />
          </td>
        </template>
        <td v-if="showRemark" class="cm-remark-cell">
          <input
              class="cm-remark-input"
              :value="itemValue.rows[row.key]?.remark || ''"
              :disabled="readonly"
              :placeholder="preps?.remarkPlaceholder || i18n('checkmatrix.remark')"
              @input="onRemarkInput(row, $event)"
          >
        </td>
      </tr>
      <tr v-if="preps?.noteText" class="cm-note-row">
        <td :colspan="totalColumns">{{ preps.noteText }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.cm-scroller {
  overflow: auto;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  background: #fff;
  outline: none;
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

.cm-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  /* 不设 width 只设 min-width:fixed 布局下列宽总和即表格宽,
     避免容器较窄时显式列宽被等比压缩、检查内容列过窄导致行高过高;
     容器更宽时表格拉伸至 100% */
  min-width: 100%;

  th,
  td {
    border-right: 1px solid var(--sh-cm-bd, #c9cdd3);
    border-bottom: 1px solid var(--sh-cm-bd, #c9cdd3);
    padding: 0;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--sh-cm-head, #f2f4f7);
    font-weight: 600;
    font-size: 13px;
    padding: 6px;
    text-align: center;
  }

  .cm-idx {
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

    &.cm-idx-selected {
      outline: 2px solid var(--sh-cm-accent, #2563eb);
      outline-offset: -2px;
    }

    &.cm-idx-state.opt-1 {
      background: var(--sh-cm-ok-bg, #e8f6ee);
      color: var(--sh-cm-ok, #16a34a);
    }

    &.cm-idx-state.opt-2 {
      background: var(--sh-cm-ng-bg, #fdecec);
      color: var(--sh-cm-ng, #dc2626);
    }

    &.cm-idx-state.opt-3 {
      background: var(--sh-cm-na-bg, #fdf3e3);
      color: var(--sh-cm-na, #d97706);
    }
  }

  .cm-pj {
    position: sticky;
    left: 42px;
    z-index: 10;
    background: var(--sh-cm-freeze, #eef1f5);
    width: 72px;
    font-size: 13px;
    text-align: center;
    font-weight: 600;
    padding: 4px 6px;
    vertical-align: middle;
  }

  thead .cm-pj {
    z-index: 30;
    left: 42px;
  }

  thead .cm-idx {
    position: sticky;
    left: 0;
    z-index: 30;
  }

  .cm-item {
    font-size: 13px;
    padding: 6px 10px;
    line-height: 1.45;
    color: #2f3540;
    vertical-align: middle;
    white-space: normal;
    word-break: break-all;
  }

  .cm-freq {
    font-size: 12px;
    color: #57606a;
    text-align: center;
    vertical-align: middle;
    width: 72px;
    padding: 4px 2px;
  }

  .cm-slot {
    cursor: pointer;
    padding: 4px 2px;

    .cm-slot-day {
      color: #1f2329;
    }

    .cm-slot-night {
      color: #8a919c;
      font-weight: 400;
      font-size: 12px;
    }
  }

  .cm-slot:hover {
    outline: 2px solid var(--sh-cm-accent, #2563eb);
    outline-offset: -2px;
  }

  .cm-remark {
    width: 110px;
  }

  .cm-edit-head {
    font-size: 13px;
  }

  .cm-res {
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    font-size: 13px;
    transition: background 0.15s;

    &:hover {
      outline: 2px solid var(--sh-cm-accent, #2563eb);
      outline-offset: -2px;
    }

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
  }

  .cm-cell-edit-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  text-align: left;
  padding: 2px 6px;
  box-sizing: border-box;
}

.cm-row-ng .cm-item {
    background: #fff7f7;
  }

  /* 编辑中的单元格:去掉选项背景色,变为白色 */
  &.cm-editing {
    background: #fff !important;
  }

  /* 自定义说明文本:淡色背景与选项颜色区分 */
  &.cm-custom {
    background: #f0f7ff;
    color: #1f4e79;
    font-size: 12px;
  }

  .cm-note-row td {
    font-size: 12px;
    color: #57606a;
    line-height: 1.7;
    white-space: pre-line;
    word-break: break-all;
    padding: 8px 10px;
    background: var(--sh-cm-head, #f2f4f7);
    font-weight: 400;
    text-align: left;
    vertical-align: top;
  }

  .cm-remark-cell {
    padding: 4px 8px;
  }

  .cm-remark-input {
    border: none;
    outline: none;
    width: 100%;
    height: 30px;
    font-size: 16px;
    background: transparent;

    &:disabled {
      color: #98a1aa;
    }
  }

  .cm-edit-cell {
    padding: 4px 6px;

    :deep(.el-input__wrapper) {
      box-shadow: none;
      background: transparent;

      &:hover {
        box-shadow: 0 0 0 1px var(--sh-cm-bd, #c9cdd3) inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px var(--sh-cm-accent, #2563eb) inset;
      }
    }

    :deep(.el-select .el-select__wrapper) {
      box-shadow: none;
      background: transparent;
    }
  }
}
</style>
