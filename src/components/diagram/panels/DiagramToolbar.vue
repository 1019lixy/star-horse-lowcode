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
            <el-button  :disabled="readonly || !designer.canUndo.value" @click="designer.undo()">
                <star-horse-icon icon-class="undo" cursor="pointer"/>
            </el-button>
            <el-button  :disabled="readonly || !designer.canRedo.value" @click="designer.redo()">
                <star-horse-icon icon-class="redo" cursor="pointer"/>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button

                :type="designer.state.tool === 'select' ? 'primary' : 'default'"
                @click="designer.setTool('select')"
            >
                <star-horse-icon icon-class="cursor" cursor="pointer"/>
                {{ i18n('diagram.toolbar.select') }}
            </el-button>
            <el-button

                :type="designer.state.tool === 'pan' ? 'primary' : 'default'"
                @click="designer.setTool('pan')"
            >
                <star-horse-icon icon-class="cursor-move" cursor="pointer"/>
                {{ i18n('diagram.toolbar.pan') }}
            </el-button>
            <el-button

                :type="designer.state.tool === 'connect' ? 'primary' : 'default'"
                @click="designer.setTool('connect')"
            >
                <star-horse-icon icon-class="link" cursor="pointer"/>
                {{ i18n('diagram.toolbar.connect') }}
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button  :disabled="readonly" @click="designer.deleteNodes()">
                <star-horse-icon icon-class="delete" cursor="pointer"/>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button-group>
            <el-button  @click="designer.zoomOut()">
                <star-horse-icon icon-class="zoom_out" cursor="pointer"/>
            </el-button>
            <el-button  @click="designer.zoomReset()">
                {{ Math.round(designer.state.diagram.canvas.zoom * 100) }}%
            </el-button>
            <el-button  @click="designer.zoomIn()">
                <star-horse-icon icon-class="zoom_in" cursor="pointer"/>
            </el-button>
        </el-button-group>
        <div class="divider"></div>
        <el-button

            :type="designer.state.diagram.canvas.showGrid ? 'primary' : 'default'"
            @click="designer.toggleGrid()"
        >
            <star-horse-icon icon-class="grid" cursor="pointer"/>
        </el-button>
        <el-button

            :type="designer.state.diagram.canvas.snap ? 'primary' : 'default'"
            @click="designer.toggleSnap()"
        >
            <star-horse-icon icon-class="aim" cursor="pointer"/>
        </el-button>
        <div class="spacer"></div>
        <el-button  @click="emits('preview')">
            <star-horse-icon icon-class="preview" cursor="pointer"/>
            {{ i18n('diagram.toolbar.preview') }}
        </el-button>
        <el-button  type="primary" :disabled="readonly" @click="emits('save')">
            <star-horse-icon icon-class="save" cursor="pointer"/>
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
}
</style>
