<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import type {CheckMatrixPreps, CheckMatrixValue} from "@/components/types";
import {
    ensureCheckValue,
    fillColumnResults,
    fillRowResults,
    getCheckStats,
    getMergeBlocks,
    KEY_MAP,
    nextCycleState,
    rowHasNg,
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
const readonly = computed(() => props.disabled || props.source === 3);
const slotCount = computed(() => props.preps?.timeSlots?.length || 6);
const showRemark = computed(() => props.preps?.showRemark !== false);
const columnModel = computed(() => props.preps?.columnModel || "triState");
const editColumns = computed(() => props.preps?.editColumns || []);

const itemValue = computed(() =>
    ensureCheckValue(props.value, props.rows, props.preps),
);

const blocksOf = (row: CheckRenderRow) =>
    getMergeBlocks(row.item.mergeRule, slotCount.value);

const rowNg = (row: CheckRenderRow) =>
    columnModel.value === "triState" && rowHasNg(props.value, row);

const cellKey = (row: CheckRenderRow, slotIndex: number) =>
    `${row.key}_${slotIndex}`;

const isFocused = (row: CheckRenderRow, slotIndex: number) =>
    focusedKey.value === cellKey(row, slotIndex);

const slotText = (row: CheckRenderRow, slotIndex: number) =>
    itemValue.value.rows[row.key]?.results?.[slotIndex] || "";

const onCellClick = (row: CheckRenderRow, slotIndex: number) => {
    if (readonly.value) return;
    focusedKey.value = cellKey(row, slotIndex);
    setSlotResult(
        props.value,
        row,
        slotIndex,
        nextCycleState(slotText(row, slotIndex)),
        props.preps,
    );
    emits("change");
};

const onHeaderClick = (slotIndex: number) => {
    if (readonly.value) return;
    if (props.preps?.fillColumnOnHeaderClick === false) return;
    fillColumnResults(props.value, props.rows, slotIndex, "OK", props.preps);
    emits("change");
};

const onRowIndexClick = (row: CheckRenderRow) => {
    if (readonly.value) return;
    if (props.preps?.fillRowOnIndexClick === false) return;
    // 整行循环切换:以行首格当前值为基准 空→OK→NG→NA→空
    const results = itemValue.value.rows[row.key]?.results || [];
    const next = nextCycleState(results[0] || "");
    fillRowResults(props.value, row, next, props.preps);
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
    if (!focusedKey.value) return;
    if (document.activeElement?.tagName === "INPUT") return;
    const mapped = KEY_MAP[e.key];
    if (mapped === undefined) {
        if (e.key === " ") {
            e.preventDefault();
            applyFocused(nextCycleState(currentFocused()));
        }
        return;
    }
    e.preventDefault();
    applyFocused(mapped);
};

const currentFocused = () => {
    const [rowKey, slotIndex] = focusedKey.value.split("_");
    const row = findRow(rowKey);
    if (!row) return "";
    return slotText(row, Number(slotIndex));
};

const findRow = (rowKey: string) =>
    props.rows.find((row) => row.key === rowKey) || null;

const applyFocused = (result: string) => {
    const [rowKey, slotIndex] = focusedKey.value.split("_");
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
 * 整行聚合状态(序号格着色): 行内所有格一致时返回该值,否则返回空
 */
const rowState = (row: CheckRenderRow) => {
    const results = itemValue.value.rows[row.key]?.results || [];
    if (!results.length) return "";
    const first = results[0];
    return results.every((result) => result === first) ? first : "";
};

/**
 * 表格总列数(note 行跨列用)
 */
const totalColumns = computed(() => {
    let count = 3;
    if (columnModel.value === "triState") {
        count = 4 + slotCount.value;
    } else {
        count = 3 + editColumns.value.length;
    }
    if (showRemark.value) count += 1;
    return count;
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
    <table class="cm-table">
      <thead>
      <tr v-if="columnModel === 'triState'">
        <th class="cm-idx" title="点击行号整行循环切换 空→OK→NG→NA">#</th>
        <th class="cm-pj">项目</th>
        <th class="cm-item" :style="{width: itemColumnWidth}">检查内容</th>
        <th class="cm-freq">稽核频率</th>
        <th
            v-for="(slot, si) in preps?.timeSlots"
            :key="si"
            class="cm-slot"
            :style="{width: slotColumnWidth}"
            title="点击整列填OK"
            @click="onHeaderClick(si)"
        >
          <div class="cm-slot-day">{{ slot.label }}</div>
          <div v-if="slot.sub" class="cm-slot-night">{{ slot.sub }}</div>
        </th>
        <th v-if="showRemark" class="cm-remark">备注</th>
      </tr>
      <tr v-else>
        <th class="cm-idx">#</th>
        <th class="cm-pj">项目</th>
        <th class="cm-item" :style="{width: itemColumnWidth}">检查内容</th>
        <th
            v-for="column in editColumns"
            :key="column.key"
            class="cm-edit-head"
            :style="{width: (column.width || 140) + 'px'}"
        >
          {{ column.label }}
        </th>
        <th v-if="showRemark" class="cm-remark">备注</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, ri) in rows"
          :key="row.key"
          :class="{'cm-row-ng': rowNg(row)}"
      >
        <td
            class="cm-idx"
            :class="['cm-idx-state', rowState(row)]"
            title="点击整行循环切换 空→OK→NG→NA"
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
                  slotText(row, block.start),
                  {'cm-cur': isFocused(row, block.start)},
              ]"
              :colspan="block.span"
              :tabindex="readonly ? -1 : 0"
              @click="onCellClick(row, block.start)"
              @focusin="focusedKey = cellKey(row, block.start)"
          >{{ slotText(row, block.start) || "" }}</td>
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
                :placeholder="readonly ? '' : '请输入'"
                @update:model-value="(v: string) => onEditColumnInput(row, column.key, v || '')"
            />
          </td>
        </template>
        <td v-if="showRemark" class="cm-remark-cell">
          <input
              class="cm-remark-input"
              :value="itemValue.rows[row.key]?.remark || ''"
              :disabled="readonly"
              :placeholder="preps?.remarkPlaceholder || '备注'"
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

    &.cm-idx-state.OK {
      background: var(--sh-cm-ok-bg, #e8f6ee);
      color: var(--sh-cm-ok, #16a34a);
    }

    &.cm-idx-state.NG {
      background: var(--sh-cm-ng-bg, #fdecec);
      color: var(--sh-cm-ng, #dc2626);
    }

    &.cm-idx-state.NA {
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

    &.OK {
      background: var(--sh-cm-ok-bg, #e8f6ee);
      color: var(--sh-cm-ok, #16a34a);
      font-weight: 700;
    }

    &.NG {
      background: var(--sh-cm-ng-bg, #fdecec);
      color: var(--sh-cm-ng, #dc2626);
      font-weight: 700;
    }

    &.NA {
      background: var(--sh-cm-na-bg, #fdf3e3);
      color: var(--sh-cm-na, #d97706);
      font-weight: 600;
    }

    &.cm-cur {
      outline: 2px solid var(--sh-cm-accent, #2563eb);
      outline-offset: -2px;
    }
  }

  .cm-row-ng .cm-item {
    background: #fff7f7;
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