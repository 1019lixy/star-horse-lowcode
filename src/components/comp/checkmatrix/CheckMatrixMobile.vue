<script setup lang="ts">
import {computed, ref} from "vue";
import {i18n} from "@/lang";
import {ArrowDown, ArrowRight} from "@element-plus/icons-vue";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    getMergeBlocks,
    nextOptionValue,
    optionIndex,
    optionName,
    resolveTimeSlots,
    resolveEditColumns,
    rowHasAbnormal,
    setBlockResult,
    setSlotResult,
    type CheckRenderRow,
} from "@/components/comp/checkmatrix/useCheckMatrixState";
import CheckMatrixDrawer from "@/components/comp/checkmatrix/CheckMatrixDrawer.vue";

const props = defineProps<{
    rows: CheckRenderRow[];
    value: CheckMatrixValue;
    preps?: CheckMatrixPreps;
    disabled?: boolean;
    source?: number;
}>();
const emits = defineEmits(["change"]);

const drawerVisible = ref(false);
const activeRow = ref<CheckRenderRow | null>(null);

/** 折叠的分组 title 集合 */
const collapsedGroups = ref<Set<string>>(new Set());
const toggleGroup = (title: string) => {
    const next = new Set(collapsedGroups.value);
    next.has(title) ? next.delete(title) : next.add(title);
    collapsedGroups.value = next;
};
const isGroupCollapsed = (title: string) => collapsedGroups.value.has(title);
const allCollapsed = computed(() =>
    groups.value.length > 0 &&
    groups.value.every((g) => collapsedGroups.value.has(g.title)),
);
const toggleAllGroups = () => {
    if (allCollapsed.value) {
        collapsedGroups.value = new Set();
    } else {
        collapsedGroups.value = new Set(groups.value.map((g) => g.title));
    }
};

const readonly = computed(() => props.disabled || props.source === 3);
const slotCount = computed(() => resolveTimeSlots(props.preps).length);
const columnModel = computed(() => props.preps?.columnModel || "triState");
const editColumns = computed(() => resolveEditColumns(props.preps));
const showRemark = computed(() => props.preps?.showRemark !== false);

const itemValue = computed(() =>
    ensureCheckValue(props.value, props.rows, props.preps),
);

/** 分组统计:已填/未填(折叠时显示,让用户不展开就能看到完成情况) */
const groupStats = (group: {rows: CheckRenderRow[]}) => {
    let filled = 0, empty = 0;
    for (const row of group.rows) {
        for (const r of itemValue.value.rows[row.key]?.results || []) {
            if (r && r !== "") filled++;
            else empty++;
        }
    }
    return {filled, empty};
};

const groups = computed(() => {
    const list: Array<{title: string; rows: CheckRenderRow[]}> = [];
    for (const row of props.rows) {
        let group = list.find((g) => g.title === row.groupTitle);
        if (!group) {
            group = {title: row.groupTitle, rows: []};
            list.push(group);
        }
        group.rows.push(row);
    }
    return list;
});

const blocksOf = (row: CheckRenderRow) =>
    getMergeBlocks(row.item.mergeRule, slotCount.value);

const blockSummary = (row: CheckRenderRow) =>
    blocksOf(row).map((block, bi) => {
        const raw = itemValue.value.rows[row.key]?.results?.[block.start] || "";
        return {
            index: bi,
            text: optionName(row.options, raw) || i18n("checkmatrix.empty"),
            cls: optionIndex(row.options, raw) >= 0
                ? `opt-${optionIndex(row.options, raw)}`
                : "",
        };
    });

const rowAbnormal = (row: CheckRenderRow) =>
    columnModel.value === "triState" && rowHasAbnormal(props.value, row);

const openDrawer = (row: CheckRenderRow) => {
    if (readonly.value || columnModel.value !== "triState") return;
    activeRow.value = row;
    drawerVisible.value = true;
};

/** 组级批量:按指定选项值整组填充(dropdown 选择) */
const fillGroupByOption = (group: {rows: CheckRenderRow[]}, value: string) => {
    if (readonly.value) return;
    for (const row of group.rows) {
        // 逐格设置,跳过自定义文本(值不在选项列表里的格保留用户输入)
        const results = itemValue.value.rows[row.key]?.results || [];
        const blocks = blocksOf(row);
        for (const block of blocks) {
            for (let k = 0; k < block.span; k++) {
                const slotIdx = block.start + k;
                const currentVal = results[slotIdx] || "";
                if (currentVal && optionIndex(row.options, currentVal) < 0) continue;
                setSlotResult(props.value, row, slotIdx, value, props.preps);
            }
        }
    }
    emits("change");
};

/** APP 端 chip 循环点击:点状态 chip 直接循环该块值(不开抽屉) */
const onChipCycle = (row: CheckRenderRow, blockIndex: number) => {
    if (readonly.value) return;
    const block = blocksOf(row)[blockIndex];
    if (!block) return;
    const currentVal = itemValue.value.rows[row.key]?.results?.[block.start] || "";
    // 自定义文本(不在选项列表里)不参与循环,保留用户输入
    if (currentVal && optionIndex(row.options, currentVal) < 0) return;
    const next = nextOptionValue(row.options, currentVal);
    setBlockResult(props.value, row, blockIndex, next, props.preps);
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

const groupStatClass = (group: {rows: CheckRenderRow[]}) => {
    const {filled, empty} = groupStats(group);
    if (empty === 0 && filled > 0) return "stat-complete";
    if (filled > 0 && empty > 0) return "stat-partial";
    return "stat-pending";
};

const onDrawerConfirm = () => emits("change");
</script>

<template>
  <div class="cm-mobile">
    <div class="cm-mobile-toolbar">
      <span class="cm-mobile-toolbar-count">{{ groups.length }} 组 · {{ rows.length }} 项</span>
      <el-button
          link
          type="primary"
          size="small"
          @click="toggleAllGroups"
      >{{ allCollapsed ? "全部展开" : "全部折叠" }}</el-button>
    </div>
    <div
        v-for="(group, gi) in groups"
        :key="group.title || gi"
        class="cm-mobile-card"
        :class="{'cm-mobile-card-collapsed': isGroupCollapsed(group.title)}"
    >
      <div class="cm-mobile-card-head" @click="toggleGroup(group.title)">
        <el-icon class="cm-mobile-collapse-icon">
          <ArrowRight v-if="isGroupCollapsed(group.title)"/>
          <ArrowDown v-else/>
        </el-icon>
        <span class="cm-mobile-card-title">{{ group.title }}</span>
        <span
            v-if="isGroupCollapsed(group.title)"
            class="cm-mobile-card-stat"
            :class="groupStatClass(group)"
        >{{ i18n("checkmatrix.statFilled") }}{{ groupStats(group).filled }} / {{ i18n("checkmatrix.statEmpty") }}{{ groupStats(group).empty }}</span>
        <span class="cm-mobile-card-actions" @click.stop>
          <el-dropdown
              v-if="columnModel === 'triState' && !readonly"
              trigger="click"
              @command="(cmd: string) => fillGroupByOption(group, cmd)"
          >
          <el-button link type="primary" size="small">
            整组设置
            <el-icon class="el-icon--right"><ArrowDown/></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="opt in (group.rows[0]?.options || [])"
                  :key="opt.value"
                  :command="opt.value"
              >全{{ opt.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        </span>
      </div>
      <template v-if="!isGroupCollapsed(group.title)">
      <div
          v-for="row in group.rows"
          :key="row.key"
          class="cm-mobile-item"
          :class="{'cm-mobile-item-ng': rowAbnormal(row)}"
          @click="columnModel === 'triState' ? openDrawer(row) : undefined"
      >
        <div class="cm-mobile-content">{{ row.item.content }}</div>
        <div
            v-if="row.item.freq"
            class="cm-mobile-freq"
        >{{ i18n("checkmatrix.freq") }}: {{ row.item.freq }}</div>
        <div
            v-if="columnModel === 'triState'"
            class="cm-mobile-stat"
        >
          <span
              v-for="block in blockSummary(row)"
              :key="block.index"
              class="cm-mobile-stat-chip"
              :class="block.cls"
              @click.stop="onChipCycle(row, block.index)"
          >#{{ block.index + 1 }} {{ block.text }}</span>
          <span
              v-if="!readonly"
              class="cm-mobile-stat-action"
          >{{ i18n("checkmatrix.tapToFill") }}</span>
        </div>
        <template v-else>
          <div class="cm-mobile-edit">
            <div
                v-for="column in editColumns"
                :key="column.key"
                class="cm-mobile-edit-field"
            >
              <div class="cm-mobile-edit-label">{{ column.label }}</div>
              <el-select
                  v-if="column.type === 'select'"
                  :model-value="itemValue.rows[row.key]?.values?.[column.key] || ''"
                  :disabled="readonly"
                  size="default"
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
                  :placeholder="readonly ? '' : i18n('api.pleaseInput2') + column.label"
                  @update:model-value="(v: string) => onEditColumnInput(row, column.key, v || '')"
              />
            </div>
          </div>
        </template>
        <div
            v-if="showRemark"
            class="cm-mobile-remark"
        >
          <input
              class="cm-mobile-remark-input"
              :value="itemValue.rows[row.key]?.remark || ''"
              :disabled="readonly"
              :placeholder="preps?.remarkPlaceholder || i18n('checkmatrix.remark')"
              @input="onRemarkInput(row, $event)"
              @click.stop
          >
        </div>
      </div>
      </template>
    </div>
    <check-matrix-drawer
        v-model:visible="drawerVisible"
        :row="activeRow"
        :value="value"
        :preps="preps"
        :disabled="disabled"
        @confirm="onDrawerConfirm"
    />
  </div>
</template>

<style scoped lang="scss">
.cm-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cm-mobile-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.cm-mobile-toolbar-count {
  font-size: 12px;
  color: #8a919c;
}

.cm-mobile-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* 折叠时紧凑:减小 padding,去掉底部 margin */
.cm-mobile-card-collapsed {
  padding: 6px 14px;
}

.cm-mobile-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 6px;
}

.cm-mobile-card-collapsed .cm-mobile-card-head {
  margin-bottom: 0;
}

.cm-mobile-card-actions {
  margin-left: auto;
  flex: none;
  display: flex;
  align-items: center;
}

.cm-mobile-card-stat {
  font-size: 11px;
  margin-left: 8px;
  white-space: nowrap;

  &.stat-complete {
    color: #16a34a;
  }

  &.stat-partial {
    color: #d97706;
  }

  &.stat-pending {
    color: #dc2626;
  }
}

.cm-mobile-collapse-icon {
  flex: none;
  font-size: 14px;
  color: #8a919c;
  transition: transform 0.2s;
}

.cm-mobile-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.cm-mobile-item {
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid #f0f1f3;

  &:last-of-type {
    border-bottom: none;
  }

  &.cm-mobile-item-ng {
    background: #fff7f7;
    border-radius: 6px;
    padding: 10px 8px;
    margin: 0 -8px;
  }
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

  &.opt-1 {
    background: #e8f6ee;
    color: #16a34a;
    font-weight: 600;
  }

  &.opt-2 {
    background: #fdecec;
    color: #dc2626;
    font-weight: 600;
  }

  &.opt-3 {
    background: #fdf3e3;
    color: #d97706;
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
}

.cm-mobile-stat-action {
  font-size: 12px;
  color: #2563eb;
}

.cm-mobile-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0 2px;
}

.cm-mobile-edit-label {
  font-size: 12px;
  color: #57606a;
  margin-bottom: 2px;
}

.cm-mobile-remark {
  margin-top: 8px;
}

.cm-mobile-remark-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dfe2e7;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #2563eb;
  }

  &:disabled {
    background: #f5f6f8;
    color: #98a1aa;
  }
}
</style>