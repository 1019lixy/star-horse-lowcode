<script setup lang="ts" name="StarHorseDataView">
import {ApiUrls} from "@/components/types/ApiUrls";
import {computed, inject, nextTick, onMounted, PropType, ref, unref, watch,} from "vue";
import {DialogProps} from "@/components/types/DialogProps";
import {formFieldMapping, isJson} from "@/api/star_horse_utils";
import {loadById} from "@/api/star_horse_apis";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {convertPcCompToFitPlatformComps} from "@/api/form_utils";
import {isMobile} from "@/api/device";

const dataForm = ref<any>({});
const props = defineProps({
  compUrl: {type: Object as PropType<ApiUrls>},
  objectName: {type: String},
  subFormFlag: {type: String, default: "N"},
  formSize: {type: String, default: "default"},
  labelPosition: {type: String, default: "left"},
  batchName: {type: String, default: "batchDataList"},
  batchFieldName: {type: String, default: "batchFieldList"},
  fieldList: {type: Object, required: true},
  globalCondition: {type: Object},
  outerData: {type: Object},
  dynamicForm: {type: Boolean, default: false},
  preview: {type: Boolean, default: false},
  primaryKey: {
    type: [String, Object] as PropType<string | any>,
    default: "id",
  },
  dataFormat: {type: Function, default: null},
  useViewUrl: {type: Boolean, default: false},
  slotType: {type: String, default: "normal"},
});
const emits = defineEmits(["dataLoaded"]);
const dialogProps = inject<DialogProps>("dialogProps");
const source = ref<number>(3);
const platformFields = computed(() =>
    convertPcCompToFitPlatformComps(props.fieldList),
);
const mappingFields = computed(() => formFieldMapping(unref(platformFields)));
onMounted(() => {
  if (dialogProps?.ids) {
    loadData();
  }
});
const loadData = async () => {
  await nextTick();
  if (props.preview) {
    setData({...dialogProps?.ids});
    return;
  }
  let id = Array.isArray(dialogProps?.ids)
      ? dialogProps.ids[0]
      : dialogProps?.ids;
  if (!props.compUrl) {
    return;
  }
  let objData;
  let params = props.globalCondition || {};
  const url = props.useViewUrl
      ? props.compUrl?.loadByIdForViewUrl
      : props.compUrl?.loadByIdUrl;
  if (isJson(id)) {
    params = {...params, ...id};
    objData = await loadById(url, "", params);
  } else {
    objData = await loadById(url, id, params);
  }
  let data = unref(mappingFields);
  dataForm.value = objData;
  if (props.dynamicForm) {
    for (let i in params) {
      let temp = params[i];
      if (!temp.subTabFlag) {
        dataForm.value[temp.tableName] = [objData];
      }
    }
  }
  let mapping = data.mappingFields;
  if (mapping) {
    for (let index in mapping) {
      let temp = mapping[index];
      dataForm.value[temp.name] = dataForm.value[temp.alias];
    }
  }
  await nextTick(() => {
    emits("dataLoaded", objData, true);
  });
};
const setData = (data: any) => {
  dataForm.value = data;
};
watch(
    () => props.outerData,
    (val: any) => {
      if (val) {
        Object.assign(dataForm.value, val);
      }
    },
    {immediate: true, deep: false},
);
watch(
    () => dialogProps?.ids,
    (val) => {
      if (val != -2) {
        if (!val || val == -1) {
          dataForm.value = {};
        } else {
          source.value = 3;
          loadData();
        }
      }
    },
    {deep: true},
);
defineExpose({
  setData,
});
</script>
<template>
  <div
      class="w-full h-full flex flex-col overflow-hidden star-horse-data-view"
      :class="{ 'star-horse-app': isMobile }"
  >
    <el-scrollbar height="100%" class="flex-1">
      <el-form
          :model="dataForm"
          :size="formSize"
          :scroll-to-error="true"
          :scroll-into-view-options="true"
          :inline-message="false"
          :status-icon="true"
          :label-position="isMobile ? 'top' : 'left'"
          require-asterisk-position="right"
          label-width="auto"
          class="data-form data-view-mode"
          ref="starHorseFormRef"
          v-if="slotType != 'user'"
      >
        <star-horse-form-item
            :primaryKey="primaryKey"
            :compUrl="compUrl"
            :fieldList="platformFields"
            :compSize="formSize"
            v-model:dataForm="dataForm"
            :source="source"
            :batchName="batchName"
            :commonFormat="dataFormat"
            :batchFieldName="batchFieldName"
        />
        <slot name="ext" :dataForm="dataForm"></slot>
      </el-form>
      <slot name="user" :dataForm="dataForm"></slot>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" >
/* 查看视图：统一通过非scoped样式穿透子组件 */
.star-horse-data-view .data-view-mode {

  /* ---- 表单行：el-descriptions 风格 ---- */
  .el-form-item {
    margin-bottom: 0 !important;
    border-bottom: 1px solid var(--el-border-color-lighter);
    min-height: 40px;
    align-items: center;
  }

  /* 隐藏校验错误提示（去掉占位的16-18px高度） */
  .el-form-item__error {
    display: none !important;
  }

  .el-form-item.is-error {
    border-color: transparent;
  }

  /* 去掉必填星号 */
  .el-form-item__label::before {
    display: none !important;
  }

  /* 标签列 */
  .el-form-item__label {
    background-color: var(--el-bg-color) !important;
    color: var(--el-text-color-regular) !important;
    font-weight: 500;
    padding: 8px 12px !important;
    border-right: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
  }

  /* 内容列 */
  .el-form-item__content {
    padding: 6px 12px;
    color: var(--el-text-color-primary);
    flex: 1;
    background-color: var(--el-bg-color);
  }

  /* ---- 所有禁用输入类组件：保留边框，去掉灰色背景 ---- */
  .el-input.is-disabled .el-input__wrapper,
  .el-textarea.is-disabled .el-textarea__inner,
  .el-select.is-disabled .el-input__wrapper,
  .el-select__wrapper.is-disabled,
  .el-date-editor.is-disabled .el-input__wrapper,
  .el-range-editor.is-disabled,
  .el-cascader.is-disabled .el-input__wrapper,
  .el-tree-select.is-disabled .el-input__wrapper,
  .el-input-number.is-disabled .el-input__wrapper,
  .el-autocomplete.is-disabled .el-input__wrapper,
  .el-input-tag.is-disabled {
    background-color: var(--el-bg-color) !important;
    box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
    cursor: default;
  }

  .el-input-tag.is-disabled .el-input-tag__wrapper {
    background-color: var(--el-bg-color) !important;
    box-shadow: none !important;
  }

  .el-input-tag.is-disabled .el-input-tag__input {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  /* 文本域特殊处理 */
  .el-textarea.is-disabled .el-textarea__inner {
    box-shadow: none !important;
    border: 1px solid var(--el-border-color) !important;
    padding: 5px 11px;
  }

  /* ---- 所有禁用输入文字颜色修正 ---- */
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner,
  .el-select.is-disabled .el-input__inner,
  .el-date-editor.is-disabled .el-input__inner,
  .el-range-editor.is-disabled .el-range-input,
  .el-cascader.is-disabled .el-input__inner,
  .el-tree-select.is-disabled .el-input__inner,
  .el-input-number.is-disabled .el-input__inner,
  .el-autocomplete.is-disabled .el-input__inner,
  .el-input-tag.is-disabled .el-input-tag__input,
  .el-select__wrapper.is-disabled .el-select__selected-item {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  /* 数字输入居中修正 */
  .el-input-number.is-center .el-input__inner {
    text-align: left;
  }

  /* ---- 隐藏所有前缀/后缀/图标/追加 ---- */
  .el-input__prefix,
  .el-input__suffix,
  .el-input__prefix-icon,
  .el-input__validateIcon,
  .el-input__clear,
  .el-select__suffix,
  .el-date-editor .el-input__prefix,
  .el-date-editor .el-input__suffix,
  .el-cascader .el-input__suffix,
  .el-tree-select .el-input__suffix,
  .el-autocomplete .el-input__suffix,
  .el-input-group__append,
  .el-input-group__prepend,
  .data-selector-suffix {
    display: none !important;
  }

  /* 隐藏数字步进按钮 */
  .el-input-number__decrease,
  .el-input-number__increase {
    display: none !important;
  }

  /* ---- Switch/Radio/Checkbox/Rate/Slider 禁用态修正 ---- */
  .el-switch.is-disabled {
    opacity: 1;
  }

  .el-radio.is-disabled .el-radio__label,
  .el-checkbox.is-disabled .el-checkbox__label {
    color: var(--el-text-color-primary);
  }

  .el-rate.is-disabled,
  .el-slider.is-disabled {
    opacity: 1;
  }

  /* ---- Upload：隐藏上传按钮 ---- */
  .el-upload.is-disabled .el-upload-dragger,
  .el-upload.is-disabled .el-button {
    display: none;
  }

  .el-upload.is-disabled {
    border: none;
    background: transparent;
  }

  .el-upload-list__item-status-label,
  .el-upload-list__item-delete {
    display: none;
  }

  /* ---- Tag 禁用态修正 ---- */
  .el-tag.is-disabled {
    opacity: 1;
    color: var(--el-text-color-primary);
  }
}

/* 移动端标签无边框 */
.star-horse-app .data-view-mode .el-form-item__label {
  border-right: none !important;
}
</style>
