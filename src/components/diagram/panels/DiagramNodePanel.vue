<script setup lang="ts" name="DiagramNodePanel">
import { computed } from "vue";
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

// 节点类型的 SVG 图标映射
const presetIcons: Record<string, string> = {
    // 流程图
    "flow-start": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" fill="#52C41A" stroke="#389E0D"/><polygon points="10,8 17,12 10,16" fill="#fff"/></svg>`,
    "flow-end": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" fill="#F5222D" stroke="#CF1322"/><circle cx="12" cy="12" r="6" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="9" y="10" width="6" height="4" rx="1" fill="#fff"/></svg>`,
    "flow-process": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2" fill="#1890FF" stroke="#096DD9"/><line x1="8" y1="12" x2="16" y2="12" stroke="#fff" stroke-width="1.5"/></svg>`,
    "flow-decision": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 22,12 12,22 2,12" fill="#FAAD14" stroke="#D48806"/><text x="12" y="13" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">?</text></svg>`,
    "flow-io": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6,6 20,6 18,18 4,18" fill="#13C2C2" stroke="#08979C"/><text x="12" y="14" text-anchor="middle" fill="#fff" font-size="7">IO</text></svg>`,
    // 网络拓扑
    "net-server": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="6" rx="1" fill="#722ED1" stroke="#531DAB"/><rect x="4" y="11" width="16" height="6" rx="1" fill="#722ED1" stroke="#531DAB"/><circle cx="17" cy="6" r="1" fill="#fff"/><circle cx="17" cy="14" r="1" fill="#fff"/></svg>`,
    "net-database": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="6" rx="8" ry="3" fill="#EB2F96" stroke="#C41D7F"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="#EB2F96" stroke="#C41D7F"/><ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#C41D7F" opacity="0.5"/></svg>`,
    "net-firewall": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2" fill="#FA541C" stroke="#D4380D"/><path d="M8 10v4M12 9v6M16 10v4" stroke="#fff" stroke-width="1.5"/></svg>`,
    "net-cloud": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#1890FF" stroke="#096DD9"/></svg>`,
    // 组织架构
    "org-dept": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2" fill="#1890FF" stroke="#096DD9"/><line x1="3" y1="10" x2="21" y2="10" stroke="#fff" stroke-width="1"/><line x1="8" y1="10" x2="8" y2="19" stroke="#fff" stroke-width="1"/></svg>`,
    "org-role": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4" fill="#52C41A" stroke="#389E0D"/><path d="M6 20v-2a6 6 0 0 1 12 0v2" fill="#52C41A" stroke="#389E0D"/></svg>`,
    "org-person": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4" fill="#FAAD14" stroke="#D48806"/><path d="M8 20v-1a4 4 0 0 1 8 0v1" fill="#FAAD14" stroke="#D48806"/></svg>`,
    // 基础形状
    "basic-text": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16" stroke="#333" stroke-width="2"/></svg>`,
    "basic-image": `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" fill="#F5F5F5" stroke="#D9D9D9"/><circle cx="8.5" cy="8.5" r="1.5" fill="#999"/><polyline points="21 15 16 10 5 21" fill="none" stroke="#999"/></svg>`,
};

const getPresetIcon = (preset: NodeTypePreset): string => {
    return presetIcons[preset.type] || `<svg viewBox="0 0 24 24" width="20" height="20"><rect x="4" y="4" width="16" height="16" rx="2" fill="#ccc" stroke="#999"/></svg>`;
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
                    :draggable="!readonly"
                    @click="handleAdd(preset)"
                    @dragstart="handleDragStart($event, preset)"
                    :title="preset.label"
                >
                    <span class="preset-icon" v-html="getPresetIcon(preset)"></span>
                    <span class="preset-label">{{ preset.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.diagram-node-panel {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color-lighter);
    padding: 8px;
    box-sizing: border-box;

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

            .preset-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;

                :deep(svg) {
                    display: block;
                }
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
