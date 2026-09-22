<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <MdEditor
      v-if="source != 3"
      v-model="formData[field.fieldName]"
      :theme="'light'"
      :language="'zh-CN'"
      :previewTheme="'default'"
      :codeTheme="'github'"
      :onUploadImg="onUploadImg"
      v-bind="prepsFilter(field.preps)"
      class="markdown-editor"
    />
    <div
      v-else
      class="view-content"
      style="background: var(--el-disabled-bg-color)"
    >
      <MdPreview
        :modelValue="formData[field.fieldName]"
        :theme="'light'"
        :previewTheme="'default'"
        :codeTheme="'github'"
      />
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts" name="markdown">
import { nextTick, onMounted, onUpdated } from "vue";
import { MdEditor, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { uploadRequest } from "@/api/star_horse_apis";
import { warning } from "@/utils/message";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");

const onUploadImg = async (files: File[], callBack: (urls: string[]) => void) => {
  const url: string =
    props.field.preps?.uploadUrl ?? "/system-config/annex/upload/images";
  const fieldName = props.field.preps?.["fieldName"] ?? "path";
  const maxSize = 5 * 1024 * 1024;
  const validFiles: File[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      warning(i18n("item.pleaseUploadImage"));
      continue;
    }
    if (file.size > maxSize) {
      warning(i18n("item.imageSizeLimit"));
      continue;
    }
    validFiles.push(file);
  }
  if (!validFiles.length) {
    callBack([]);
    return;
  }
  const results = await Promise.all(
    validFiles.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const fd = new FormData();
          fd.append("file", file);
          uploadRequest(url, fd)
            .then((res) => {
              resolve(res.data.data[fieldName]);
            })
            .catch(reject);
        }),
    ),
  );
  callBack(results);
};

const init = async () => {
  nextTick(() => {
    const toolbarRight = document.querySelector(".md-editor-toolbar-right");
    if (toolbarRight) {
      const lastButton = toolbarRight.querySelector("button:last-child");
      if (lastButton) {
        lastButton.remove();
      }
    }
  });
};
onMounted(() => {
  init();
});
onUpdated(() => {
  init();
});
</script>
<style lang="scss" scoped>
.v-md-editor {
  width: 100% !important;
  min-height: 400px !important;

  :deep(.vditor-toolbar) {
    padding-left: unset !important;
  }
}
.view-content {
  min-height: 100px;
  padding: 5px 10px;
  width: 100%;
  border-radius: 4px;
}
</style>
