<script setup lang="ts" name="DtLegendPanel">
/**
 * 数字孪生 - 状态图例
 *
 * - 仅保留固定 4 种状态（normal/warning/alarm/offline）
 * - 默认隐藏，通过工具栏按钮切换显示
 */
import { i18n } from "@/lang";
import { DT_STATUS_PRESETS } from "../constants";
import type { UseDigitalTwinDesignerReturn } from "../composables/useDigitalTwinDesigner";

defineProps<{
    /** 保留透传，父组件仍通过 :designer 绑定，但图例不再依赖其数据 */
    designer?: UseDigitalTwinDesignerReturn;
}>();
</script>

<template>
    <div class="dt-legend-panel">
        <div class="panel-header">
            <span class="panel-title">{{ i18n("digitaltwin.legend.title") }}</span>
        </div>

        <div class="panel-body">
            <!-- 状态图例 -->
            <div class="section">
                <div class="section-title">{{ i18n("digitaltwin.legend.statusTitle") }}</div>
                <div v-for="s in DT_STATUS_PRESETS" :key="s.status" class="legend-row">
                    <span class="legend-dot" :style="{ background: s.color, boxShadow: `0 0 6px ${s.color}` }" />
                    <span class="legend-label">{{ i18n(s.labelKey as any) }}</span>
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
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    max-height: 260px;
    width: 200px;
    backdrop-filter: blur(4px);
    background: rgba(var(--el-bg-color-rgb, 255, 255, 255), 0.92);

    .panel-header {
        padding: 8px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .panel-title {
            font-size: 13px;
            font-weight: 600;
        }

        .panel-badge {
            font-size: 12px;
            padding: 1px 6px;
            border-radius: 8px;
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
            font-weight: 600;
        }
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 10px 12px;
    }

    .section {
        & + .section {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed var(--el-border-color-lighter);
        }

        .section-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-secondary);
            margin-bottom: 6px;
        }
    }

    .legend-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        font-size: 12px;

        .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .legend-label {
            color: var(--el-text-color-primary);
        }
    }

}
</style>
