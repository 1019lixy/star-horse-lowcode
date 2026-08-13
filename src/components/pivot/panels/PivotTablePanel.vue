<script setup lang="ts" name="PivotTablePanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import { computePivotTable, formatNumber } from "../PivotEngine";

const props = defineProps<{
  designer: PivotDesigner;
}>();

/** 计算透视表结果 */
const result = computed(() =>
  computePivotTable(
    props.designer.state.records,
    props.designer.state.fields,
    props.designer.state.config,
  ),
);

/** 行字段标签列表 */
const rowFieldLabels = computed(() =>
  props.designer.state.config.rows.map(
    (name) =>
      props.designer.state.fields.find((f) => f.name === name)?.label ?? name,
  ),
);

/** 值字段标签 */
const valueFieldLabels = computed(() =>
  props.designer.state.config.values.map(
    (name) =>
      props.designer.state.fields.find((f) => f.name === name)?.label ?? name,
  ),
);

/** 列头层级数 */
const colHeaderDepth = computed(
  () => props.designer.state.config.columns.length || 1,
);

/** 格式化单元格 */
const formatCell = (value: number | string | null): string => {
  return formatNumber(value, props.designer.state.config.numberFormat);
};
</script>

<template>
  <div class="pivot-table-panel">
    <div
      class="table-container"
      v-if="result.rowHeaders.length > 0 || result.colHeaders.length > 0"
    >
      <table class="pivot-table">
        <!-- 表头：列字段名 + 行字段名 + 值字段名 -->
        <thead>
          <tr v-for="depth in colHeaderDepth" :key="depth">
            <!-- 左上角 -->
            <th
              v-if="depth === 1"
              :rowspan="colHeaderDepth"
              class="corner-cell"
            >
              <div class="corner-content">
                <div v-if="designer.state.config.columns.length">
                  {{
                    designer.state.config.columns
                      .map(
                        (n) =>
                          designer.state.fields.find((f) => f.name === n)
                            ?.label ?? n,
                      )
                      .join(" / ")
                  }}
                </div>
                <div class="corner-divider">
                  {{
                    designer.state.config.rows
                      .map(
                        (n) =>
                          designer.state.fields.find((f) => f.name === n)
                            ?.label ?? n,
                      )
                      .join(" / ")
                  }}
                </div>
              </div>
            </th>
            <!-- 列头 -->
            <th
              v-for="(col, cIdx) in result.colHeaders"
              :key="cIdx"
              :colspan="1"
              class="col-header"
            >
              {{ col[depth - 1] ?? "" }}
            </th>
            <th
              v-if="depth === 1 && designer.state.config.showTotal"
              class="total-cell"
            >
              {{ i18n("pivot.label.total") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rIdx) in result.rowHeaders" :key="rIdx">
            <!-- 行头 -->
            <td
              v-for="(h, hIdx) in row"
              :key="hIdx"
              class="row-header"
              :style="{ paddingLeft: `${hIdx * 12 + 8}px` }"
            >
              {{ h }}
            </td>
            <!-- 单元格 -->
            <td
              v-for="(cell, cIdx) in result.cells[rIdx]"
              :key="cIdx"
              class="data-cell"
            >
              {{ formatCell(cell.value) }}
            </td>
            <!-- 行合计 -->
            <td v-if="designer.state.config.showTotal" class="total-cell">
              {{ formatCell(result.rowTotals[rIdx]) }}
            </td>
          </tr>
          <!-- 列合计行 -->
          <tr v-if="designer.state.config.showTotal" class="total-row">
            <td :colspan="rowFieldLabels.length" class="total-label">
              {{ i18n("pivot.label.total") }}
            </td>
            <td
              v-for="(total, cIdx) in result.colTotals"
              :key="cIdx"
              class="total-cell"
            >
              {{ formatCell(total) }}
            </td>
            <td class="grand-total">
              {{ formatCell(result.grandTotal) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty-state" v-else>
      <el-empty :description="i18n('pivot.empty.dragFields')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pivot-table-panel {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--el-bg-color);
  padding: 8px;

  .table-container {
    overflow: auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
  }

  .pivot-table {
    border-collapse: collapse;
    font-size: 13px;
    width: max-content;

    thead {
      background: var(--el-fill-color-light);

      th {
        padding: 6px 12px;
        border: 1px solid var(--el-border-color-lighter);
        text-align: center;
        font-weight: 600;
        white-space: nowrap;
      }

      .corner-cell {
        background: var(--el-fill-color-darker);

        .corner-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;

          .corner-divider {
            padding-top: 4px;
            border-top: 1px solid var(--el-border-color);
          }
        }
      }

      .col-header {
        background: var(--el-fill-color);
      }
    }

    tbody {
      tr {
        &:nth-child(even) {
          background: var(--el-fill-color-lighter);
        }
      }

      td {
        padding: 4px 12px;
        border: 1px solid var(--el-border-color-lighter);
        white-space: nowrap;
      }

      .row-header {
        font-weight: 500;
        background: var(--el-fill-color-light);
      }

      .data-cell {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .total-cell {
        font-weight: 600;
        background: var(--el-color-primary-light-9);
        text-align: right;
      }

      .total-row {
        background: var(--el-color-primary-light-9);
        font-weight: 600;

        .total-label {
          text-align: left;
        }

        .grand-total {
          background: var(--el-color-primary-light-8);
          text-align: right;
        }
      }
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
