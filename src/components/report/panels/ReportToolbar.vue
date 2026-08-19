<script setup lang="ts" name="ReportToolbar">
/**
 * 报表设计器 - 顶部工具栏
 */
import { i18n } from "@/lang";
import type { UseReportDesignerReturn } from "../composables/useReportDesigner";

const props = defineProps<{
  designer: UseReportDesignerReturn;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
  (e: "dataset"): void;
  (e: "param"): void;
  (e: "paper"): void;
}>();

/** 应用样式到选中单元格 */
const applyStyleToSelection = (style: Record<string, any>) => {
  props.designer.applyStyleToSelection(style);
};
</script>

<template>
  <div class="report-toolbar">
    <div class="toolbar-group">
      <el-button-group>
        <el-button
          :disabled="readonly || !designer.canUndo.value"
          @click="designer.undo()"
          :title="i18n('report.toolbar.undo')"
        >
          <star-horse-icon icon-class="undo" cursor="pointer" />
        </el-button>
        <el-button
          :disabled="readonly || !designer.canRedo.value"
          @click="designer.redo()"
          :title="i18n('report.toolbar.redo')"
        >
          <star-horse-icon icon-class="redo" cursor="pointer" />
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button-group>
        <el-button
          :disabled="readonly"
          @click="designer.copyCells()"
          :title="i18n('report.toolbar.copy')"
        >
          <star-horse-icon icon-class="copy" cursor="pointer" />
        </el-button>
        <el-button
          :disabled="readonly"
          @click="designer.deleteCells()"
          :title="i18n('report.toolbar.delete')"
        >
          <star-horse-icon icon-class="delete" cursor="pointer" />
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button-group>
        <el-button
          :disabled="readonly"
          @click="designer.mergeCells()"
          :title="i18n('report.toolbar.merge')"
        >
          <star-horse-icon icon-class="merge" cursor="pointer" />
        </el-button>
        <el-button
          :disabled="readonly"
          @click="designer.unmergeCells()"
          :title="i18n('report.toolbar.unmerge')"
        >
          <star-horse-icon icon-class="split" cursor="pointer" />
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-button
        @click="applyStyleToSelection({ fontWeight: 'bold' })"
        :disabled="readonly"
        :title="i18n('report.toolbar.bold')"
      >
        <star-horse-icon icon-class="bold" cursor="pointer" />
      </el-button>
      <el-button
        @click="applyStyleToSelection({ fontStyle: 'italic' })"
        :disabled="readonly"
        :title="i18n('report.toolbar.italic')"
      >
        <star-horse-icon icon-class="italic" cursor="pointer" />
      </el-button>
      <el-color-picker
        @change="(v) => applyStyleToSelection({ color: v })"
        :title="i18n('report.toolbar.color')"
      />
      <el-color-picker
        @change="(v) => applyStyleToSelection({ backgroundColor: v })"
        :title="i18n('report.toolbar.bgColor')"
      />
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <el-select
        :placeholder="i18n('report.toolbar.fontSize')"
        style="width: 100px"
        @change="(v) => applyStyleToSelection({ fontSize: v })"
      >
        <el-option
          v-for="s in [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32]"
          :key="s"
          :label="s + 'pt'"
          :value="s"
        />
      </el-select>
      <el-button-group>
        <el-button
          @click="applyStyleToSelection({ textAlign: 'left' })"
          :title="i18n('report.toolbar.alignLeft')"
        >
          <star-horse-icon icon-class="left" cursor="pointer" />
        </el-button>
        <el-button
          @click="applyStyleToSelection({ textAlign: 'center' })"
          :title="i18n('report.toolbar.alignCenter')"
        >
          <star-horse-icon icon-class="center" cursor="pointer" />
        </el-button>
        <el-button
          @click="applyStyleToSelection({ textAlign: 'right' })"
          :title="i18n('report.toolbar.alignRight')"
        >
          <star-horse-icon icon-class="right" cursor="pointer" />
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button
          @click="
            applyStyleToSelection({
              border: 'all',
              borderWidth: 1,
              borderColor: '#000',
            })
          "
          :title="i18n('report.toolbar.border')"
        >
          <star-horse-icon icon-class="border-all" cursor="pointer" />
        </el-button>
        <el-button
          @click="applyStyleToSelection({ border: 'none' })"
          :title="i18n('report.toolbar.noBorder')"
        >
          <star-horse-icon icon-class="border-none" cursor="pointer" />
        </el-button>
      </el-button-group>
    </div>

    <div class="toolbar-spacer"></div>

    <div class="toolbar-group">
      <el-button @click="emits('dataset')" :disabled="readonly">
        <star-horse-icon icon-class="data_db" cursor="pointer" />
        {{ i18n("report.toolbar.dataset") }}
      </el-button>
      <el-button @click="emits('param')" :disabled="readonly">
        <star-horse-icon icon-class="param" cursor="pointer" />
        {{ i18n("report.toolbar.param") }}
      </el-button>
      <el-button @click="emits('paper')">
        <star-horse-icon icon-class="page" cursor="pointer" />
        {{ i18n("report.toolbar.paper") }}
      </el-button>
      <el-button @click="emits('preview')">
        <star-horse-icon icon-class="preview" cursor="pointer" />
        {{ i18n("report.toolbar.preview") }}
      </el-button>
      <el-button type="primary" @click="emits('save')" :disabled="readonly">
        <star-horse-icon icon-class="save" cursor="pointer" />
        {{ i18n("report.toolbar.save") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  height: 44px;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow-x: auto;

  .toolbar-group {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .toolbar-divider {
    width: 1px;
    height: 22px;
    background: var(--el-border-color);
    margin: 0 4px;
    flex-shrink: 0;
  }

  .toolbar-spacer {
    flex: 1;
  }
}
</style>
