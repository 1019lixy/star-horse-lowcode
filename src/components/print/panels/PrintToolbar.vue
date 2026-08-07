<script setup lang="ts" name="PrintToolbar">
/**
 * 打印模板设计器 - 顶部工具栏
 * 职责：撤销/重做、缩放、视图切换、保存、预览、模板管理
 */
import {computed} from "vue";
import {i18n} from "@/lang";
import type {UsePrintDesignerReturn} from "../composables/usePrintDesigner";

const props = defineProps<{
  designer: UsePrintDesignerReturn;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
  (e: "manage"): void;
  (e: "datasource"): void;
}>();

const zoomPercent = computed(() => Math.round(props.designer.state.zoom * 100));
</script>

<template>
  <div class="print-toolbar">
    <div class="toolbar-group">
      <el-button-group>
        <el-button
            :icon="readonly ? undefined : 'undo'"

            :disabled="readonly || !designer.canUndo.value"
            @click="designer.undo()"
            :title="i18n('print.toolbar.undo')"
        >
          <star-horse-icon icon-class="undo" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly || !designer.canRedo.value"
            @click="designer.redo()"
            :title="i18n('print.toolbar.redo')"
        >
          <star-horse-icon icon-class="redo" cursor="pointer"/>
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button-group>
        <el-button

            :disabled="readonly"
            @click="designer.copyElements()"
            :title="i18n('print.toolbar.copy')"
        >
          <star-horse-icon icon-class="copy" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.cutElements()"
            :title="i18n('print.toolbar.cut')"
        >
          <star-horse-icon icon-class="cut" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.pasteElements()"
            :title="i18n('print.toolbar.paste')"
        >
          <star-horse-icon icon-class="paste" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.duplicateElements()"
            :title="i18n('print.toolbar.duplicate')"
        >
          <star-horse-icon icon-class="clone" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.deleteElements()"
            :title="i18n('print.toolbar.delete')"
        >
          <star-horse-icon icon-class="delete" cursor="pointer"/>
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button-group>
        <el-button

            :disabled="readonly"
            @click="designer.bringToFront()"
            :title="i18n('print.toolbar.bringToFront')"
        >
          <star-horse-icon icon-class="up-layer" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.sendToBack()"
            :title="i18n('print.toolbar.sendToBack')"
        >
          <star-horse-icon icon-class="down-layer" cursor="pointer"/>
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button-group>
        <el-button @click="designer.zoomOut()" :title="i18n('print.toolbar.zoomOut')">
          <star-horse-icon icon-class="zoom_out" cursor="pointer"/>
        </el-button>
        <el-button @click="designer.zoomReset()" :title="i18n('print.toolbar.zoomReset')">
          {{ zoomPercent }}%
        </el-button>
        <el-button @click="designer.zoomIn()" :title="i18n('print.toolbar.zoomIn')">
          <star-horse-icon icon-class="zoom_in" cursor="pointer"/>
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-tooltip :content="i18n('print.toolbar.toggleRuler')" placement="bottom">
        <el-button

            :type="designer.state.showRuler ? 'primary' : 'default'"
            @click="designer.toggleRuler()"
        >
          <star-horse-icon icon-class="ruler" cursor="pointer"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('print.toolbar.toggleGrid')" placement="bottom">
        <el-button

            :type="designer.state.showGrid ? 'primary' : 'default'"
            @click="designer.toggleGrid()"
        >
          <star-horse-icon icon-class="grid" cursor="pointer"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('print.toolbar.toggleSnap')" placement="bottom">
        <el-button

            :type="designer.state.snap ? 'primary' : 'default'"
            @click="designer.toggleSnap()"
        >
          <star-horse-icon icon-class="cursor-move" cursor="pointer"/>
        </el-button>
      </el-tooltip>
    </div>

    <div class="toolbar-spacer"></div>

    <div class="toolbar-group">
      <el-button @click="emits('datasource')" :disabled="readonly">
        <star-horse-icon icon-class="data_db" cursor="pointer"/>
        {{ i18n('print.toolbar.datasource') }}
      </el-button>
      <el-button @click="emits('manage')" :disabled="readonly">
        <star-horse-icon icon-class="template" cursor="pointer"/>
        {{ i18n('print.toolbar.template') }}
      </el-button>
      <el-button @click="emits('preview')">
        <star-horse-icon icon-class="preview" cursor="pointer"/>
        {{ i18n('print.toolbar.preview') }}
      </el-button>
      <el-button

          type="primary"
          @click="emits('save')"
          :disabled="readonly"
      >
        <star-horse-icon icon-class="save" cursor="pointer"/>
        {{ i18n('print.toolbar.save') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.print-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  height: 44px;
  box-sizing: border-box;
  flex-shrink: 0;

  .toolbar-group {
    display: flex;
    gap: 2px;
  }

  .toolbar-divider {
    width: 1px;
    height: 22px;
    background: var(--el-border-color);
    margin: 0 4px;
  }

  .toolbar-spacer {
    flex: 1;
  }
}
</style>
