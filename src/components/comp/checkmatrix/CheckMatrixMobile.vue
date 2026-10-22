<script setup lang="ts">
import {computed, ref} from "vue";
import {i18n} from "@/lang";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    firstOptionOf,
    fillRowResults,
    getMergeBlocks,
    optionIndex,
    optionName,
    resolveTimeSlots,
    resolveEditColumns,
    rowHasAbnormal,
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

const readonly = computed(() => props.disabled || props.source === 3);
const slotCount = computed(() => resolveTimeSlots(props.preps).length);
const columnModel = computed(() => props.preps?.columnModel || "triState");
const editColumns = computed(() => resolveEditColumns(props.preps));
const showRemark = computed(() => props.preps?.showRemark !== false);

const itemValue = computed(() =>
    ensureCheckValue(props.value, props.rows, props.preps),
);

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

/** 组级批量按钮文案:取该组首个检查项第一个非空选项的显示名(默认 OK) */
const groupBatchLabel = (group: {rows: CheckRenderRow[]}) => {
    const first = group.rows[0]?.options || [];
    return optionName(first, firstOptionOf(first)) || "OK";
};

/** 组级批量:按该组各项自身选项的第一个非空项填充(默认即 OK) */
const fillGroupFirstOption = (group: {rows: CheckRenderRow[]}) => {
    if (readonly.value) return;
    for (const row of group.rows) {
        fillRowResults(
            props.value,
            row,
            firstOptionOf(row.options),
            props.preps,
        );
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

const onDrawerConfirm = () => emits("change");
</script>

<template>
  <div class="cm-mobile">
    <div
        v-for="(group, gi) in groups"
        :key="group.title || gi"
        class="cm-mobile-card"
    >
      <div class="cm-mobile-card-head">
        <span class="cm-mobile-card-title">{{ group.title }}</span>
        <el-button
            v-if="columnModel === 'triState' && !readonly"
            link
            type="primary"
            size="small"
            @click="fillGroupFirstOption(group)"
        >{{ i18n("checkmatrix.groupBatchPrefix") }}{{ groupBatchLabel(group) }}</el-button>
      </div>
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

.cm-mobile-card {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.cm-mobile-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.cm-mobile-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.cm-mobile-item {
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