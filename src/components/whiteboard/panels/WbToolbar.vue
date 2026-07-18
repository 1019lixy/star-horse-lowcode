<script setup lang="ts" name="WbToolbar">
import { i18n } from "@/lang";
import type { UseWhiteboardDesignerReturn } from "../composables/useWhiteboardDesigner";
import {
    WB_COLOR_PRESETS,
    WB_FONT_SIZE_PRESETS,
    WB_LINE_WIDTH_PRESETS,
    WB_OPACITY_PRESETS,
    WB_TOOL_PRESETS,
} from "../constants";
import type { WhiteboardTool } from "../types";

const props = defineProps<{
    designer: UseWhiteboardDesignerReturn;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "export"): void;
}>();

const toolList = WB_TOOL_PRESETS;

const handleToolClick = (tool: WhiteboardTool) => {
    if (props.readonly) return;
    if (tool === "eraser") {
        // 橡皮擦：删除当前选中元素
        props.designer.deleteElements();
        return;
    }
    props.designer.setTool(tool);
};
</script>

<template>
    <div class="wb-toolbar">
        <!-- 撤销/重做 -->
        <el-button-group>
            <el-button

                :disabled="readonly || !designer.canUndo.value"
                @click="designer.undo()"
                :title="i18n('whiteboard.undo')"
            >
                <star-horse-icon icon-class="undo" cursor="pointer"/>
            </el-button>
            <el-button

                :disabled="readonly || !designer.canRedo.value"
                @click="designer.redo()"
                :title="i18n('whiteboard.redo')"
            >
                <star-horse-icon icon-class="redo" cursor="pointer"/>
            </el-button>
        </el-button-group>
        <div class="divider"></div>

        <!-- 工具集 -->
        <el-button-group>
            <el-button
                v-for="t in toolList"
                :key="t.tool"

                :type="designer.state.tool === t.tool ? 'primary' : 'default'"
                :disabled="readonly && t.tool !== 'select'"
                :title="i18n(t.labelKey as any)"
                @click="handleToolClick(t.tool)"
            >
                <star-horse-icon :icon-class="t.icon.replace('sh-', '')" cursor="pointer"/>
                <span class="tool-label">{{ i18n(t.labelKey as any) }}</span>
            </el-button>
        </el-button-group>
        <div class="divider"></div>

        <!-- 描边色 -->
        <div class="control-group">
            <span class="control-label">{{ i18n("whiteboard.color.stroke") }}</span>
            <el-color-picker
                v-model="designer.state.stroke"

                :predefine="WB_COLOR_PRESETS.filter(p => p.value !== 'transparent').map(p => p.value)"
            />
        </div>
        <!-- 填充色 -->
        <div class="control-group">
            <span class="control-label">{{ i18n("whiteboard.color.fill") }}</span>
            <el-color-picker
                v-model="designer.state.fill"

                show-alpha
                :predefine="WB_COLOR_PRESETS.filter(p => p.value !== 'transparent').map(p => p.value)"
            />
        </div>
        <!-- 线宽 -->
        <div class="control-group">
            <span class="control-label">{{ i18n("whiteboard.lineWidth") }}</span>
            <el-select
                v-model="designer.state.strokeWidth"

                style="width: 80px;"
            >
                <el-option
                    v-for="w in WB_LINE_WIDTH_PRESETS"
                    :key="w.value"
                    :label="w.label"
                    :value="w.value"
                />
            </el-select>
        </div>
        <!-- 透明度 -->
        <div class="control-group">
            <span class="control-label">{{ i18n("whiteboard.opacity") }}</span>
            <el-select
                v-model="designer.state.opacity"

                style="width: 90px;"
            >
                <el-option
                    v-for="o in WB_OPACITY_PRESETS"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                />
            </el-select>
        </div>
        <!-- 字号 -->
        <div class="control-group">
            <span class="control-label">{{ i18n("whiteboard.fontSize") }}</span>
            <el-select
                v-model="designer.state.fontSize"

                style="width: 80px;"
            >
                <el-option
                    v-for="s in WB_FONT_SIZE_PRESETS"
                    :key="s.value"
                    :label="s.label"
                    :value="s.value"
                />
            </el-select>
        </div>

        <div class="spacer"></div>

        <!-- 缩放 -->
        <el-button-group>
            <el-button  @click="designer.zoomOut()" :title="i18n('whiteboard.canvas.zoomOut')">
                <star-horse-icon icon-class="zoom_out" cursor="pointer"/>
            </el-button>
            <el-button  @click="designer.zoomReset()">
                {{ Math.round(designer.state.canvas.zoom * 100) }}%
            </el-button>
            <el-button  @click="designer.zoomIn()" :title="i18n('whiteboard.canvas.zoomIn')">
                <star-horse-icon icon-class="zoom_in" cursor="pointer"/>
            </el-button>
        </el-button-group>
        <el-button

            :type="designer.state.canvas.showGrid ? 'primary' : 'default'"
            @click="designer.toggleGrid()"
            :title="i18n('whiteboard.canvas.fit')"
        >
            <star-horse-icon icon-class="grid" cursor="pointer"/>
        </el-button>

        <div class="divider"></div>

        <!-- 清空 -->
        <el-button

            :disabled="readonly"
            @click="designer.clearBoard()"
        >
            {{ i18n("whiteboard.clear") }}
        </el-button>
        <!-- 导出 -->
        <el-button

            type="primary"
            @click="emits('export')"
        >
            <star-horse-icon icon-class="download" cursor="pointer"/>
            {{ i18n("whiteboard.export") }}
        </el-button>
    </div>
</template>

<script lang="ts">
export default {
    name: "WbToolbar",
};
</script>

<style lang="scss" scoped>
.wb-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    height: 44px;
    flex-shrink: 0;
    flex-wrap: wrap;

    .divider {
        width: 1px;
        height: 22px;
        background: var(--el-border-color);
        margin: 0 2px;
    }

    .spacer {
        flex: 1;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 4px;

        .control-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            white-space: nowrap;
        }
    }

    .tool-label {
        margin-left: 4px;
        font-size: 12px;
    }

    :deep(.el-button) {
        .sh_icon {
            font-size: 14px;
        }
    }
}
</style>
