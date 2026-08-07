<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div
        style="border: 1px solid #ccc; width: 100%; height: 100%"
        v-if="source != 3"
    >
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          v-if="!field.preps?.hideToolbar"
          :mode="field.preps?.mode ?? 'default'"
      />
      <Editor
          :style="{
          width: field.preps?.width ?? '100%',
          height: field.preps?.height ?? '100%',
          overflow: field.preps?.overflow ?? 'auto',
          'border-radius': '4px',
        }"
          v-bind="prepsFilter(props)"
          v-on="getDynamicEvents(props, itemAction, formData)"
          v-model="formData[field.fieldName]"
          :defaultConfig="editorConfig"
          :mode="field.preps?.mode ?? 'default'"
          @onCreated="handleCreated"
      />
    </div>
    <el-input
        type="textarea"
        v-model="formData[field.fieldName]"
        disabled
        rows="3"
        v-else
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onBeforeUnmount, onMounted, shallowRef} from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {allAction, prepsFilter,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {ItemPreps} from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import {uploadRequest} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {i18n} from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const toolbarConfig = {};
const editorConfig = {
  placeholder: i18n("item.pleaseInputContent"),
  MENU_CONF: {
    uploadImage: {
      base64LimitSize: 0,
      async customUpload(file: File, insertFn: any) {
        const formData: any = new FormData();
        formData.append("file", file);
        const url: string =
            props.field.preps?.uploadUrl ?? "/system-config/annex/upload/images";
        uploadRequest(url, formData)
            .then((res) => {
              const result = res.data;
              console.log(result);
              insertFn(result.data[props.field.preps?.["fieldName"] ?? "path"]);
            })
            .catch((err) => {
              console.error("Error:", err);
            });
      },
      beforeUpload(file) {
        // 校验文件类型
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          warning(i18n("item.pleaseUploadImage"));
          return false;
        }
        // 校验文件大小（5MB）
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          warning(i18n("item.imageSizeLimit"));
          return false;
        }
        return true;
      },
    },
    uploadVideo: {
      base64LimitSize: 0,
      async customUpload(file: File, insertFn: any) {
        const formData: any = new FormData();
        formData.append("file", file);
        const url: string =
            props.field.preps?.uploadUrl ?? "/system-config/annex/upload/videos";
        uploadRequest(url, formData)
            .then((res) => {
              const result = res.data;
              console.log(result);
              insertFn(result.data[props.field.preps?.["fieldName"] ?? "path"]);
            })
            .catch((err) => {
              console.error("Error:", err);
            });
      },
      beforeUpload(file) {
        // 校验文件类型
        const isImage = file.type.startsWith("video/");
        if (!isImage) {
          warning(i18n("item.pleaseUploadImage"));
          return false;
        }
        // 校验文件大小（5MB）
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
          warning(i18n("item.videoSizeLimit"));
          return false;
        }
        return true;
      },
    },
  },
};

const dataChange = (data: any) => {
  console.log("dataChange", data);
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

onMounted(() => {
});
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
<style scoped></style>
