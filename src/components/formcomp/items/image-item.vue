<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      v-if="field.preps?.assignType == 'url'"
      :placeholder="field.preps?.placeholder || ''"
      v-model="formData[field.fieldName]"
    >
      <template #append>
        <el-upload
          :auto-upload="true"
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
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          :action="field.action || defaultAction"
          :headers="{ token: getToken() }"
          class="upload"
          name="file"
        >
          <el-tooltip :content="i18n('item.uploadImage')">
            <star-horse-icon
              icon-class="upload"
              color="var(--star-horse-style)"
            />
          </el-tooltip>
        </el-upload>
      </template>
    </el-input>
    <div class="image-area" v-else>
      <el-image
        :style="{
          width: formData[field.fieldName]
            ? field.preps?.width || '100px'
            : '100%',
          height: formData[field.fieldName]
            ? field.preps?.height || '100px'
            : '100%',
        }"
        :zoom-rate="field.preps?.zoomRate || 1.2"
        :max-scale="field.preps?.maxScale || 2"
        :min-scale="field.preps?.minScale || 0.2"
        :preview-src-list="field.preps?.previewSrcList || defaultViewList"
        :initial-index="field.preps?.initialIndex || 5"
        :fit="field.preps?.fit || 'contain'"
        :fid="field.fieldName"
        :src="formData[field.fieldName] || ''"
      >
        <template #error>
          <el-upload
            :auto-upload="true"
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
            :show-file-list="false"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
            :action="field.preps['action'] || defaultAction"
            :headers="{ token: getToken() }"
            class="upload"
            name="file"
          >
            <el-button type="text" text >
              <el-tooltip :content="i18n('item.uploadImage')">
                <star-horse-icon icon-class="upload" />
                上传图片
              </el-tooltip>
            </el-button>
          </el-upload>
        </template>
        <template #placeholder>
          <div class="image-slot">
            <el-icon>
              <Picture />
            </el-icon>
          </div>
        </template>
      </el-image>
      <div class="image-remove" v-if="formData[field.fieldName] && isDesign">
        <el-tooltip :content="i18n('item.deleteImage')">
          <el-button title=""  type="text" @click="removeImage">
            <star-horse-icon
              icon-class="delete"
              color="var(--el-color-danger)"
              cursor="pointer"
            />
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, shallowRef } from "vue";
import { initCompCallEvent } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getToken } from "@/utils/auth";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { Picture } from "@element-plus/icons-vue";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

let defaultAction = "/system-config/annex/upload/common";
let defaultViewList = shallowRef([]);

const removeImage = () => {
  formData.value[props.field.fieldName] = "";
  defaultViewList.value = [];
};
const selfAction = (
  prep: any,
  uploadFile: any,
  uploadFiles: any = [],
  param: any = {},
) => {
  if (prep == "success") {
    let result = param.data;
    let path = (props.field.preps["context"] || "/system-config") + result.path;
    formData.value[props.field.fieldName] = path;
    defaultViewList.value.push(path);
    //默认将上传成功的属性存入数据对象
    Object.entries(result).forEach(([key, value]) => {
      formData.value[key] = value;
    });
    //console.log(param.data.path);
  }
  emits("selfFunc", prep, uploadFile, uploadFiles, param);
};
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.image-area {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;

  &:hover {
    .image-remove {
      visibility: visible;
    }
  }

  .image-remove {
    position: absolute;
    visibility: hidden;
    top: 50%;
    left: 50%;
  }
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
