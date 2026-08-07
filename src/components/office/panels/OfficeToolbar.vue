<script setup lang="ts" name="OfficeToolbar">
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {OFFICE_DOC_TYPE_PRESETS} from "../constants";
import type {OfficeDocType} from "../types";

defineProps<{
  canUndo: boolean;
  canRedo: boolean;
  activeType: OfficeDocType | null;
}>();

const emit = defineEmits<{
  (e: "new"): void;
  (e: "save"): void;
  (e: "export"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "switch-type", type: OfficeDocType): void;
}>();
</script>

<template>
  <div class="office-toolbar">
    <div class="toolbar-group">
      <el-tooltip :content="i18n('office.toolbar.new')" :show-after="500">
        <el-button type="primary" @click="emit('new')">
          <ShSvgIcon name="plus" size="14px"/>
          <span class="btn-text">{{ i18n("office.toolbar.new") }}</span>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.toolbar.save')" :show-after="500">
        <el-button @click="emit('save')">
          <ShSvgIcon name="save" size="14px"/>
          <span class="btn-text">{{ i18n("office.toolbar.save") }}</span>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.toolbar.export')" :show-after="500">
        <el-button @click="emit('export')">
          <ShSvgIcon name="export" size="14px"/>
          <span class="btn-text">{{ i18n("office.toolbar.export") }}</span>
        </el-button>
      </el-tooltip>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group">
      <el-tooltip :content="i18n('office.toolbar.undo')" :show-after="500">
        <el-button :disabled="!canUndo" @click="emit('undo')">
          <ShSvgIcon name="undo" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.toolbar.redo')" :show-after="500">
        <el-button :disabled="!canRedo" @click="emit('redo')">
          <ShSvgIcon name="redo" size="14px"/>
        </el-button>
      </el-tooltip>
    </div>
    <div class="toolbar-divider"></div>
    <div class="toolbar-group type-switch">
      <el-radio-group
          :model-value="activeType ?? 'word'"
          @change="(v: string | number | boolean | undefined) => emit('switch-type', v as OfficeDocType)"
      >
        <el-radio-button
            v-for="p in OFFICE_DOC_TYPE_PRESETS"
            :key="p.type"
            :value="p.type"
        >
          {{ p.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.office-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  flex-wrap: wrap;

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .btn-text {
    margin-left: 4px;
    font-size: 13px;
  }

  .toolbar-divider {
    width: 1px;
    height: 20px;
    background: var(--el-border-color);
  }

  .type-switch {
    margin-left: auto;
  }
}
</style>
