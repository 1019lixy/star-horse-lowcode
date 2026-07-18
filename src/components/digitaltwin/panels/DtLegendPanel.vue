<script setup lang="ts" name="DtLegendPanel">
/**
 * 数字孪生 - 状态图例 + 实体统计
 */
import { i18n } from "@/lang";
import { DT_STATUS_PRESETS } from "../constants";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";

const props = defineProps<{
    designer: UseDigitalTwinDesignerReturn;
}>();

const designer = props.designer;

const statRows = [
    { key: "total", labelKey: "digitaltwin.legend.total", getValue: () => designer.stats.value.total },
    { key: "normal", labelKey: "digitaltwin.legend.normal", getValue: () => designer.stats.value.normal },
    { key: "warning", labelKey: "digitaltwin.legend.warning", getValue: () => designer.stats.value.warning },
    { key: "alarm", labelKey: "digitaltwin.legend.alarm", getValue: () => designer.stats.value.alarm },
    { key: "offline", labelKey: "digitaltwin.legend.offline", getValue: () => designer.stats.value.offline },
] as const;
</script>

<template>
    <div class="dt-legend-panel">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.legend.title") }}</span>
        </div>

        <div class="panel-body">
            <!-- 状态图例 -->
            <div class="section">
                <div class="section-title">{{ i18n("digitaltwin.legend.title") }}</div>
                <div v-for="s in DT_STATUS_PRESETS" :key="s.status" class="legend-row">
                    <span class="legend-dot" :style="{ background: s.color }" />
                    <span class="legend-label">{{ i18n(s.labelKey as any) }}</span>
                    <span class="legend-color-desc">({{ i18n(s.colorLabelKey as any) }})</span>
                </div>
            </div>

            <!-- 实体统计 -->
            <div class="section">
                <div class="section-title">{{ i18n("digitaltwin.legend.stats") }}</div>
                <div v-for="row in statRows" :key="row.key" class="stat-row">
                    <span class="stat-label">{{ i18n(row.labelKey as any) }}</span>
                    <span class="stat-value">{{ row.getValue() }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-legend-panel {
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-lighter);
    overflow: hidden;
    max-height: 240px;

    .panel-header {
        padding: 6px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 12px;
            font-weight: 600;
        }
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px 12px;
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    .section {
        flex: 1;
        min-width: 140px;

        .section-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--el-text-color-secondary);
            margin-bottom: 4px;
        }
    }

    .legend-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 0;
        font-size: 11px;

        .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .legend-label {
            color: var(--el-text-color-primary);
        }

        .legend-color-desc {
            color: var(--el-text-color-secondary);
            font-size: 10px;
        }
    }

    .stat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 0;
        font-size: 11px;

        .stat-label {
            color: var(--el-text-color-secondary);
        }

        .stat-value {
            color: var(--el-text-color-primary);
            font-weight: 600;
        }
    }
}
</style>
