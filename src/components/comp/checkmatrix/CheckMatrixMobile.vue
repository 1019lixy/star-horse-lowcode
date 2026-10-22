<script setup lang="ts">
import {computed, ref} from "vue";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    fillRowResults,
    getMergeBlocks,
    rowHasNg,
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
const slotCount = computed(() => props.preps?.timeSlots?.length || 6);
const columnModel = computed(() => props.preps?.columnModel || "triState");
const editColumns = computed(() => props.preps?.editColumns || []);
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
    blocksOf(row).map((block, bi) => ({
        index: bi,
        text: itemValue.value.rows[row.key]?.results?.[block.start] || "空",
    }));

const rowNg = (row: CheckRenderRow) =>
    columnModel.value === "triState" && rowHasNg(props.value, row);

const openDrawer = (row: CheckRenderRow) => {
    if (readonly.value || columnModel.value !== "triState") return;
    activeRow.value = row;
    drawerVisible.value = true;
};

const fillGroupOk = (group: {rows: CheckRenderRow[]}) => {
    if (readonly.value) return;
    for (const row of group.rows) {
        fillRowResults(props.value, row, "OK", props.preps);
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
            @click="fillGroupOk(group)"
        >整组OK</el-button>
      </div>
      <div
          v-for="row in group.rows"
          :key="row.key"
          class="cm-mobile-item"
          :class="{'cm-mobile-item-ng': rowNg(row)}"
          @click="columnModel === 'triState' ? openDrawer(row) : undefined"
      >
        <div class="cm-mobile-content">{{ row.item.content }}</div>
        <div
            v-if="row.item.freq"
            class="cm-mobile-freq"
        >稽核频率: {{ row.item.freq }}</div>
        <div
            v-if="columnModel === 'triState'"
            class="cm-mobile-stat"
        >
          <span
              v-for="block in blockSummary(row)"
              :key="block.index"
              class="cm-mobile-stat-chip"
              :class="block.text"
          >#{{ block.index + 1 }} {{ block.text }}</span>
          <span
              v-if="!readonly"
              class="cm-mobile-stat-action"
          >点击填写</span>
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
                  :placeholder="readonly ? '' : '请输入' + column.label"
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
              :placeholder="preps?.remarkPlaceholder || '备注'"
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

  &.OK {
    background: #e8f6ee;
    color: #16a34a;
    font-weight: 600;
  }

  &.NG {
    background: #fdecec;
    color: #dc2626;
    font-weight: 600;
  }

  &.NA {
    background: #fdf3e3;
    color: #d97706;
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