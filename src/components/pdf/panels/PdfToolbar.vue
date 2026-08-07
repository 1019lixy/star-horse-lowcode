<script setup lang="ts" name="PdfToolbar">
import {ref} from "vue";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import type {PdfDesigner} from "../composables/usePdfDesigner";
import {PDF_PAPER_PRESETS} from "../constants";

defineProps<{
  designer: PdfDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
}>();

/** 页边距弹窗 */
const marginDialogVisible = ref(false);
</script>

<template>
  <div class="pdf-toolbar">
    <div class="left-group">
      <el-button-group>
        <el-tooltip :content="i18n('pdf.btn.undoTip')" :show-after="500">
          <el-button :disabled="readonly" @click="designer.undo()">
            <ShSvgIcon name="undo" size="14px"/>
          </el-button>
        </el-tooltip>
        <el-tooltip :content="i18n('pdf.btn.redoTip')" :show-after="500">
          <el-button :disabled="readonly" @click="designer.redo()">
            <ShSvgIcon name="redo" size="14px"/>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-tooltip :content="i18n('pdf.btn.copyTip')" :show-after="500">
        <el-button
            :disabled="readonly || !designer.selectedElementId"
            @click="designer.selectedElementId && designer.duplicateElement(designer.selectedElementId.value)"
        >
          <ShSvgIcon name="duplicate" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('pdf.btn.deleteTip')" :show-after="500">
        <el-button
            :disabled="readonly || !designer.selectedElementId"
            @click="designer.selectedElementId && designer.removeElement(designer.selectedElementId.value)"
        >
          <ShSvgIcon name="delete" size="14px"/>
        </el-button>
      </el-tooltip>
    </div>

    <div class="right-group">
      <span class="label">{{ i18n("pdf.label.paper") }}:</span>
      <el-select
          :model-value="`${designer.state.page.width}x${designer.state.page.height}`"
          style="width: 120px"
          @update:model-value="(v: string) => {
                    const preset = PDF_PAPER_PRESETS.find(p => `${p.width}x${p.height}` === v);
                    if (preset) designer.updatePage({ width: preset.width, height: preset.height });
                }"
      >
        <el-option
            v-for="opt in PDF_PAPER_PRESETS"
            :key="opt.label"
            :label="opt.label"
            :value="`${opt.width}x${opt.height}`"
        />
      </el-select>

      <el-tooltip :content="i18n('pdf.label.marginTip')" :show-after="500">
        <el-button @click="marginDialogVisible = true">
          <ShSvgIcon name="margin" size="14px"/>
          {{ i18n("pdf.label.margin") }}
        </el-button>
      </el-tooltip>

      <el-tooltip :content="i18n('pdf.btn.previewTip')" :show-after="500">
        <el-button @click="emit('preview')">
          <ShSvgIcon name="preview" size="14px"/>
          {{ i18n("pdf.btn.preview") }}
        </el-button>
      </el-tooltip>

      <el-button type="primary" :disabled="readonly" @click="emit('save')">
        <ShSvgIcon name="save" size="14px"/>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>
  </div>

  <!-- 页边距设置弹窗 -->
  <el-dialog
      v-model="marginDialogVisible"
      :title="i18n('pdf.label.margin')"
      width="360px"
      :append-to-body="true"
  >
    <el-form label-width="80px">
      <el-form-item :label="i18n('pdf.margin.top')">
        <el-input-number v-model="designer.state.page.marginTop" :min="0" :max="100" :step="5" style="width: 100%"/>
      </el-form-item>
      <el-form-item :label="i18n('pdf.margin.bottom')">
        <el-input-number v-model="designer.state.page.marginBottom" :min="0" :max="100" :step="5" style="width: 100%"/>
      </el-form-item>
      <el-form-item :label="i18n('pdf.margin.left')">
        <el-input-number v-model="designer.state.page.marginLeft" :min="0" :max="100" :step="5" style="width: 100%"/>
      </el-form-item>
      <el-form-item :label="i18n('pdf.margin.right')">
        <el-input-number v-model="designer.state.page.marginRight" :min="0" :max="100" :step="5" style="width: 100%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="marginDialogVisible = false">{{ i18n("dialog.close") }}</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.pdf-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  flex-wrap: wrap;
  gap: 8px;

  .left-group,
  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
