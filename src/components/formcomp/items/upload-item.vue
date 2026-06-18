<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-upload
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :headers="headers"
      v-bind="prepsFilter(field.preps)"
      :on-change="
        (uploadFile: any, uploadFiles: any) =>
          selfAction('change', uploadFile, uploadFiles)
      "
      :on-error="
        (error: any, uploadFile: any, uploadFiles: any) =>
          selfAction('error', uploadFile, uploadFiles, error)
      "
      :on-exceed="
        (files: any, uploadFiles: any) =>
          selfAction('exceed', files, uploadFiles)
      "
      :on-preview="(uploadFile: any) => selfAction('preview', uploadFile)"
      :on-progress="
        (evt: any, uploadFile: any, uploadFiles: any) =>
          selfAction('progress', uploadFile, uploadFiles, evt)
      "
      :on-remove="
        (uploadFile: any, uploadFiles: any) =>
          selfAction('remove', uploadFile, uploadFiles)
      "
      :on-success="
        (response: any, uploadFile: any, uploadFiles: any) =>
          selfAction('success', uploadFile, uploadFiles, response)
      "
      style="
        width: 100% !important;
        display: flex;
        align-items: center;
        position: relative;
      "
      v-model:file-list="dataField"
    >
      <el-icon class="el-icon--upload" v-if="field.preps?.drag">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-if="field.preps?.drag">
        {{ i18n("form.dragFileHereOr") }}
        <em>{{ i18n("form.clickToUpload") }}</em>
      </div>
      <template #tip v-if="field.preps?.maxSize">
        <div class="el-upload__tip">
          {{ i18n("form.fileSizeLimit") }}{{ field.preps["maxSize"] }}
        </div>
      </template>
      <star-horse-icon
        v-if="!field.preps?.drag"
        icon-class="plus"
        color="var(--star-horse-style)"
      />
    </el-upload>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  checkIsDisabled,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getToken } from "@/utils/auth";
import { nextTick, onMounted, ref, shallowRef } from "vue";
import { i18n } from "@/lang";

import { ItemPreps } from "@/components/types/ItemPreps";
import JSON5 from "json5";
import {UploadFilled} from "@element-plus/icons-vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
let dataField = shallowRef([]);
let headers = ref<any>({});
const selfAction = (
  prep: any,
  uploadFile: any,
  uploadFiles: any = [],
  param: any = {},
) => {
  if (prep == "success") {
    let result = param.data;
    if (props.field.preps?.multiple) {
      formData.value[props.field.fieldName].push(result);
    } else {
      formData.value[props.field.fieldName] = result.path;
      Object.entries(result).forEach(([key, value]) => {
        formData.value[key] = value;
      });
    }
    //默认将上传成功的属性存入数据对象
  }
  console.log(prep, uploadFile, uploadFiles, param);
  emits("selfFunc", prep, uploadFile, uploadFiles, param);
};
onMounted(async () => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["action"] =
    props.field.preps["action"] || "/system-config/annex/upload/commonFiles";
  if (props.field.preps["multiple"] && !formData.value[props.field.fieldName]) {
    formData.value[props.field.fieldName] = [];
  }
  await nextTick();
  let datas = formData.value[props.field.fieldName];
  const baseUrl: string = props.field.preps["context"] || "/system-config";
  if (datas && datas.length > 0) {
    if (Array.isArray(datas)) {
      datas.forEach((item) => {
        dataField.value.push({
          url: baseUrl + item,
        });
      });
    } else {
      dataField.value.push({
        url: baseUrl + datas,
      });
    }
  }
  let temp = props.field.preps?.headers;
  try {
    if (typeof temp === "string") {
      temp = JSON5.parse(temp);
    }
  } catch (e) {
    temp = {};
  }
  if (temp && Object.keys(temp).length > 0) {
    headers.value = temp;
  }
  headers.value["token"] = getToken();
});
</script>
<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100% !important;
}

/*
:deep(.el-upload--text) {
  justify-content: left !important;
}
*/
:deep(.el-upload-list--picture-card) {
  width: 100% !important;

  .is-drag {
    height: 100% !important;
    width: 100% !important;
  }
}

/*:deep(.el-upload-list) {
  position: absolute;
  top: 0;
  right: 0;
}*/
</style>
