<script setup lang="ts" name="DtTemplateDialog">
/**
 * 数字孪生 - 场景模板弹窗
 *
 * 网格展示模板缩略图 + 名称 + 描述 + 应用按钮
 */
import {computed} from "vue";
import {i18n} from "@/lang";
import {ElMessage, ElMessageBox} from "element-plus";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import {DT_SCENE_TEMPLATES} from "../constants";
import type {DtSceneTemplate} from "../types";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  dialogType?:"dialog"|"drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "apply-template", template: DtSceneTemplate): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const handleApply = (template: DtSceneTemplate): void => {
  ElMessageBox.confirm(i18n("digitaltwin.template.confirmApply"), i18n("digitaltwin.template.title"), {
    type: "warning",
  })
      .then(() => {
        emit("apply-template", template);
        ElMessage.success(i18n("digitaltwin.message.templateApplied"));
        innerVisible.value = false;
      })
      .catch(() => {
      });
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="i18n('digitaltwin.template.title')"
      box-width="720px"
  >
    <div class="template-grid">
      <div
          v-for="tpl in DT_SCENE_TEMPLATES"
          :key="tpl.id"
          class="template-card"
      >
        <div class="thumbnail" v-html="tpl.thumbnail ?? '<div class=placeholder></div>'"/>
        <div class="info">
          <div class="name">{{ i18n(tpl.labelKey as any) }}</div>
          <div class="desc">{{ i18n(tpl.descKey as any) }}</div>
          <div class="meta">{{ tpl.entities.length }} {{ i18n("digitaltwin.entity.title") }}</div>
        </div>
        <el-button type="primary" size="small" @click="handleApply(tpl)">
          {{ i18n("digitaltwin.template.apply") }}
        </el-button>
      </div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ i18n("digitaltwin.dialog.close") }}</el-button>
    </template>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 4px;
}

.template-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  overflow: hidden;
  background: var(--el-bg-color);

  .thumbnail {
    height: 120px;
    background: linear-gradient(135deg, #f0f5ff 0%, #d6e4ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.placeholder) {
      width: 60px;
      height: 60px;
      background: rgba(24, 144, 255, 0.2);
      border-radius: 8px;
    }

    :deep(svg) {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .info {
    padding: 8px 12px;
    flex: 1;

    .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
    }

    .desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .meta {
      font-size: 11px;
      color: var(--el-text-color-placeholder);
    }
  }

  :deep(.el-button) {
    margin: 0 12px 12px;
    align-self: flex-start;
  }
}
</style>
