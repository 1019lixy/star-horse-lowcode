<script setup lang="ts" name="EtlNodePanel">
import { i18n } from "@/lang";
import { ETL_NODE_GROUPS } from "../constants";
import type { EtlNodeType } from "../types";

const emit = defineEmits<{
    (e: "add", type: EtlNodeType): void;
}>();

const handleDragStart = (e: DragEvent, type: EtlNodeType) => {
    e.dataTransfer?.setData("etl-node-type", type);
};

const handleClick = (type: EtlNodeType) => {
    emit("add", type);
};
</script>

<template>
    <div class="etl-node-panel">
        <div class="panel-title">{{ i18n("etl.nodeLibrary.title") }}</div>
        <div class="panel-body">
            <div v-for="group in ETL_NODE_GROUPS" :key="group.category" class="node-group">
                <div class="group-title">{{ group.label }}</div>
                <div class="group-items">
                    <div
                        v-for="preset in group.presets"
                        :key="preset.type"
                        class="node-item"
                        draggable="true"
                        @dragstart="handleDragStart($event, preset.type)"
                        @click="handleClick(preset.type)"
                        :style="{ borderLeftColor: preset.color }"
                    >
                        <el-icon class="node-icon" :style="{ color: preset.color }">
                            <component :is="preset.icon"/>
                        </el-icon>
                        <div class="node-info">
                            <div class="node-label">{{ preset.label }}</div>
                            <div class="node-desc">{{ preset.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.etl-node-panel {
    width: 220px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    overflow: hidden;

    .panel-title {
        padding: 8px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color);
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 8px;
    }

    .node-group {
        margin-bottom: 12px;

        .group-title {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-bottom: 4px;
            padding: 0 4px;
        }

        .group-items {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .node-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            background: var(--el-fill-color-light);
            border-left: 3px solid transparent;
            border-radius: 4px;
            cursor: grab;
            transition: background 0.2s;

            &:hover {
                background: var(--el-fill-color);
            }

            &:active {
                cursor: grabbing;
            }

            .node-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .node-info {
                flex: 1;
                overflow: hidden;

                .node-label {
                    font-size: 12px;
                    font-weight: 500;
                }

                .node-desc {
                    font-size: 11px;
                    color: var(--el-text-color-placeholder);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>
