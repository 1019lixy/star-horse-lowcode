<script setup lang="ts" name="DiagramNodePanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import { NODE_PRESETS, PRESET_CATEGORIES } from "../constants";
import type { NodeTypePreset } from "../types";

const props = defineProps<{
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "add", preset: NodeTypePreset): void;
    (e: "drag-start", preset: NodeTypePreset): void;
}>();

const groupedPresets = computed(() => {
    return PRESET_CATEGORIES.map((category) => ({
        category,
        items: NODE_PRESETS.filter((p) => p.category === category),
    }));
});

const handleAdd = (preset: NodeTypePreset) => {
    if (props.readonly) return;
    emits("add", preset);
};

const handleDragStart = (e: DragEvent, preset: NodeTypePreset) => {
    if (props.readonly) return;
    e.dataTransfer?.setData("diagram-node-type", preset.type);
    emits("drag-start", preset);
};
</script>

<template>
    <div class="diagram-node-panel">
        <div v-for="group in groupedPresets" :key="group.category" class="preset-group">
            <div class="group-title">{{ group.category }}</div>
            <div class="group-items">
                <div
                    v-for="preset in group.items"
                    :key="preset.type"
                    class="preset-item"
                    :class="{ disabled: readonly }"
                    draggable="!readonly"
                    @click="handleAdd(preset)"
                    @dragstart="handleDragStart($event, preset)"
                    :title="preset.label"
                >
                    <star-horse-icon :icon-class="preset.icon" cursor="pointer"/>
                    <span class="preset-label">{{ preset.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.diagram-node-panel {
    width: 200px;
    height: 100%;
    overflow-y: auto;
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color-lighter);
    padding: 8px;
    box-sizing: border-box;
    flex-shrink: 0;

    .preset-group {
        margin-bottom: 12px;

        .group-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-secondary);
            padding: 4px 8px;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .group-items {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
        }

        .preset-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px 4px;
            background: var(--el-fill-color-light);
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 4px;
            cursor: grab;
            transition: all 0.15s;
            gap: 4px;
            min-height: 56px;

            &:hover {
                background: var(--el-color-primary-light-9);
                border-color: var(--el-color-primary);
                transform: translateY(-1px);
            }

            &.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .preset-label {
                font-size: 11px;
                color: var(--el-text-color-regular);
                text-align: center;
                line-height: 1.2;
            }
        }
    }
}
</style>
