<script setup lang="ts" name="DiagramToolbar">
import { i18n } from "@/lang";
import type { UseDiagramDesignerReturn } from "../composables/useDiagramDesigner";

defineProps<{
    designer: UseDiagramDesignerReturn;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "save"): void;
    (e: "preview"): void;
}>();
</script>

<template>
    <div class="diagram-toolbar">
        <el-button-group>
            <el-button :disabled="readonly || !designer.canUndo.value" @click="designer.undo()" :title="i18n('diagram.toolbar.undo')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
            </el-button>
            <el-button :disabled="readonly || !designer.canRedo.value" @click="designer.redo()" :title="i18n('diagram.toolbar.redo')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/>
                </svg>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button
                :type="designer.state.tool === 'select' ? 'primary' : 'default'"
                @click="designer.setTool('select')"
                :title="i18n('diagram.toolbar.select')"
            >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                </svg>
                {{ i18n('diagram.toolbar.select') }}
            </el-button>
            <el-button
                :type="designer.state.tool === 'pan' ? 'primary' : 'default'"
                @click="designer.setTool('pan')"
                :title="i18n('diagram.toolbar.pan')"
            >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 9l-3 3 3 3"/>
                    <path d="M9 5l3-3 3 3"/>
                    <path d="M15 19l-3 3-3-3"/>
                    <path d="M19 9l3 3-3 3"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <line x1="12" y1="2" x2="12" y2="22"/>
                </svg>
                {{ i18n('diagram.toolbar.pan') }}
            </el-button>
            <el-button
                :type="designer.state.tool === 'connect' ? 'primary' : 'default'"
                @click="designer.setTool('connect')"
                :title="i18n('diagram.toolbar.connect')"
            >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {{ i18n('diagram.toolbar.connect') }}
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button :disabled="readonly" @click="designer.deleteNodes()" :title="i18n('diagram.toolbar.delete')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button @click="designer.zoomOut()" :title="i18n('diagram.toolbar.zoomOut')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </el-button>
            <el-button @click="designer.zoomReset()" class="zoom-text">
                {{ Math.round(designer.state.diagram.canvas.zoom * 100) }}%
            </el-button>
            <el-button @click="designer.zoomIn()" :title="i18n('diagram.toolbar.zoomIn')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </el-button>
            <el-button @click="designer.fitView()" :title="i18n('diagram.toolbar.fitView')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                    <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                </svg>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button
            :type="designer.state.diagram.canvas.showGrid ? 'primary' : 'default'"
            @click="designer.toggleGrid()"
            :title="i18n('diagram.toolbar.grid')"
        >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
            </svg>
        </el-button>
        <el-button
            :type="designer.state.diagram.canvas.snap ? 'primary' : 'default'"
            @click="designer.toggleSnap()"
            :title="i18n('diagram.toolbar.snap')"
        >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        </el-button>
        <div class="spacer"></div>
        <el-button @click="emits('preview')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
            {{ i18n('diagram.toolbar.preview') }}
        </el-button>
        <el-button type="primary" :disabled="readonly" @click="emits('save')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ i18n('diagram.toolbar.save') }}
        </el-button>
    </div>
</template>

<style lang="scss" scoped>
.diagram-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    height: 44px;
    flex-shrink: 0;

    .divider {
        width: 1px;
        height: 22px;
        background: var(--el-border-color);
        margin: 0 4px;
    }

    .spacer {
        flex: 1;
    }

    .zoom-text {
        min-width: 56px;
        font-size: 12px;
        padding: 0 8px;
    }

    svg {
        flex-shrink: 0;
    }
}
</style>
