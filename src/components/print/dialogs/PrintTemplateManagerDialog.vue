<script setup lang="ts" name="PrintTemplateManagerDialog">
/**
 * 打印模板设计器 - 模板管理弹窗
 * 职责：列出预设/已保存模板，支持加载到设计器
 * 强制使用 star-horse-dialog
 */
import {computed, ref} from "vue";
import {i18n} from "@/lang";
import type {PrintTemplate} from "../types";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  /** 已保存的模板列表（外部存储） */
  savedTemplates: PrintTemplate[];
  dialogType?:"dialog"|"drawer";
}>();

const emits = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "load", template: PrintTemplate): void;
  (e: "delete", id: string): void;
  (e: "export", template: PrintTemplate): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emits("update:visible", v),
});

const searchKey = ref("");

const filteredTemplates = computed(() => {
  if (!searchKey.value) return props.savedTemplates;
  const key = searchKey.value.toLowerCase();
  return props.savedTemplates.filter(
      (t) =>
          t.name.toLowerCase().includes(key) ||
          t.code.toLowerCase().includes(key) ||
          (t.category || "").toLowerCase().includes(key),
  );
});

const handleLoad = (template: PrintTemplate) => {
  emits("load", template);
  innerVisible.value = false;
};

const handleDelete = (id: string) => {
  emits("delete", id);
};

const handleExport = (template: PrintTemplate) => {
  emits("export", template);
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="i18n('print.templateManager.title')"
      box-width="70%"
      box-height="70%"
      :is-show-reset="false"
      :is-show-save="false"
      :self-func="true"
  >
    <div class="tpl-mgr">
      <div class="tpl-toolbar">
        <el-input
            v-model="searchKey"
            :placeholder="i18n('print.templateManager.searchPlaceholder')"

            clearable
            style="width: 300px"
        />
      </div>
      <el-table :data="filteredTemplates" border height="100%">
        <el-table-column :label="i18n('print.templateManager.name')" prop="name" min-width="160"/>
        <el-table-column :label="i18n('print.templateManager.code')" prop="code" width="160"/>
        <el-table-column :label="i18n('print.templateManager.category')" prop="category" width="120"/>
        <el-table-column :label="i18n('print.templateManager.paper')" width="120">
          <template #default="{ row }">
            {{ row.paper.width }}×{{ row.paper.height }}mm
          </template>
        </el-table-column>
        <el-table-column :label="i18n('print.templateManager.updateTime')" width="160">
          <template #default="{ row }">
            {{ row.updateTime ? new Date(row.updateTime).toLocaleString() : '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="i18n('print.templateManager.operation')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleLoad(row)">
              {{ i18n('print.templateManager.load') }}
            </el-button>
            <el-button link @click="handleExport(row)">
              {{ i18n('print.templateManager.export') }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">
              {{ i18n('print.templateManager.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ i18n('dialog.close') }}</el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.tpl-mgr {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  .tpl-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
