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
  //是不是要用查看视图的接口
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
  //是使用查看数据接口，还是使用编辑数据接口，
  const url = props.useViewUrl
      ? props.compUrl?.loadByIdForViewUrl
      : props.compUrl?.loadByIdUrl;
  //如果是Json 对象
  if (isJson(id)) {
    params = {...params, ...id};
    objData = await loadById(url, "", params);
  } else {
    objData = await loadById(url, id, params);
  }
  let data = unref(mappingFields);
  dataForm.value = objData;
  //如果是动态表单
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
//更新外面传进来的数据
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
    {
      // immediate: true,
      deep: true,
    },
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
          label-width="120px"
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
<style lang="scss" scoped>
.star-horse-app {
  :deep(.el-form-item__label) {
    border-right: none !important;
  }
}

/* ====== 查看视图：el-descriptions 风格 ====== */
.data-view-mode {
  /* 整体布局：类似 el-descriptions 的表格感 */
  :deep(.el-form-item) {
    margin-bottom: 0 !important;
    border-bottom: 1px solid var(--el-border-color-lighter);
    min-height: 40px;
    align-items: center;
  }

  /* 标签列：类似 el-descriptions__label */
  :deep(.el-form-item__label) {
    background-color: #fff !important;
    color: #606266 !important;
    font-weight: 500;
    padding: 8px 12px !important;
    border-right: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
  }

  :deep(.el-input-number.is-center .el-input__inner) {
    text-align: left;
  }

  /* 内容列：类似 el-descriptions__content */
  :deep(.el-form-item__content) {
    padding: 8px 12px;
    margin-left: 5px !important;
    color: var(--el-text-color-primary);
    flex: 1;
    background-color: #fff;
  }

  /* ---- 输入框：去边框，纯文本 ---- */
  :deep(.el-input.is-disabled .el-input__wrapper),
  :deep(.el-textarea.is-disabled .el-textarea__inner) {
    background-color: #fff !important;


    padding: 0;
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
    cursor: default;
  }

  :deep(.el-input.is-disabled .el-input__inner),
  :deep(.el-textarea.is-disabled .el-textarea__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  /* ---- Select：去边框 ---- */
  :deep(.el-select.is-disabled .el-input__wrapper),
  :deep(.el-select__wrapper.is-disabled) {
    background-color: #fff !important;
    border: 1px solid var(--el-border-color-lighter);

    padding: 0;
  }

  :deep(.el-select__suffix),
  :deep(.el-input__prefix-icon) {
    display: none;

    .el-icon {
      visibility: hidden;
    }
  }

  :deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
    color: var(--el-text-color-primary);
  }

  :deep(.el-select.is-disabled .el-input__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-select.is-disabled .el-input__suffix) {
    display: none;
  }

  /* ---- 日期/时间：去边框 ---- */
  :deep(.el-date-editor.is-disabled .el-input__wrapper),
  :deep(.el-range-editor.is-disabled),
  :deep(.el-range-editor.is-disabled .el-range-input) {
    background-color: #fff !important;


    padding: 0;

    .el-icon {
      visibility: hidden;
    }
  }

  :deep(.el-date-editor.is-disabled .el-input__inner),
  :deep(.el-range-editor.is-disabled .el-range-input) ,
  :deep(.el-input-tag__input){
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-date-editor.is-disabled .el-input__prefix),
  :deep(.el-date-editor.is-disabled .el-input__suffix) {
    display: none;
  }

  /* ---- 级联选择：去边框 ---- */
  :deep(.el-cascader.is-disabled .el-input__wrapper) {
    background-color: #fff !important;


    padding: 0;
  }

  :deep(.el-cascader.is-disabled .el-input__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-cascader.is-disabled .el-input__suffix) {
    display: none;
  }

  /* ---- Switch：只读展示 ---- */
  :deep(.el-switch.is-disabled) {
    opacity: 1;
  }

  /* ---- Radio/Checkbox：禁用态颜色修正 ---- */
  :deep(.el-radio.is-disabled .el-radio__label),
  :deep(.el-checkbox.is-disabled .el-checkbox__label) {
    color: var(--el-text-color-primary);
  }

  /* ---- Rate：禁用态颜色修正 ---- */
  :deep(.el-rate.is-disabled) {
    opacity: 1;
  }

  /* ---- 滑块：禁用态 ---- */
  :deep(.el-slider.is-disabled) {
    opacity: 1;
  }

  /* ---- 隐藏不需要的图标 ---- */
  :deep(.el-input__validateIcon),
  :deep(.el-input__clear) {
    display: none;
  }

  /* ---- 去掉必填星号 ---- */
  :deep(.el-form-item__label)::before {
    display: none;
  }

  :deep(.el-input-group__append),:deep(.data-selector-suffix) {
    display: none;
  }

  /* ---- Upload：隐藏上传按钮 ---- */
  :deep(.el-upload.is-disabled .el-upload-dragger),
  :deep(.el-upload.is-disabled .el-button) {
    display: none;
  }

  :deep(.el-upload.is-disabled) {
    border: none;
    background: transparent;
  }

  :deep(.el-upload-list__item-status-label),
  :deep(.el-upload-list__item-delete) {
    display: none;
  }

  /* ---- Image：隐藏操作按钮 ---- */
  :deep(.el-image.is-disabled .image-slot),
  :deep(.image-remove) {
    display: none;
  }

  /* ---- Tag Input：禁用态颜色修正 ---- */
  :deep(.el-tag.is-disabled) {
    opacity: 1;
    color: var(--el-text-color-primary);
  }

  /* ---- Autocomplete：去边框 ---- */
  :deep(.el-autocomplete.is-disabled .el-input__wrapper) {
    background-color: #fff !important;


    padding: 0;
  }

  :deep(.el-autocomplete.is-disabled .el-input__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-autocomplete.is-disabled .el-input__suffix) {
    display: none;
  }

  /* ---- Tree Select：去边框 ---- */
  :deep(.el-tree-select.is-disabled .el-input__wrapper) {
    background-color: #fff !important;


    padding: 0;
  }

  :deep(.el-tree-select.is-disabled .el-input__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-tree-select.is-disabled .el-input__suffix) {
    display: none;
  }

  /* ---- Number：去边框 ---- */
  :deep(.el-input-number.is-disabled .el-input__wrapper) {
    background-color: #fff !important;


    padding: 0;
  }
  :deep(.el-input-tag.is-disabled .el-input-tag__input-wrapper) {
    background-color: #fff !important;


    padding: 0;
  }

  :deep(.el-input-number.is-disabled .el-input__inner) {
    color: var(--el-text-color-primary);
    -webkit-text-fill-color: var(--el-text-color-primary);
  }

  :deep(.el-input-number__decrease),
  :deep(.el-input-number__increase) {
    display: none;
  }

  /* ---- 隐藏验证状态图标 ---- */
  :deep(.el-form-item.is-error) {
    border-color: transparent;
  }

  :deep(.el-form-item__error) {
    display: none;
  }
}
</style>

<!-- 非scoped样式：确保穿透多层子组件 -->
<style lang="scss">
.star-horse-data-view .data-view-mode {
  .el-form-item {
    margin-bottom: 0 !important;
    border-bottom: 1px solid var(--el-border-color-lighter);
    min-height: 40px;
    align-items: center;
  }

  .el-form-item__label {
    background-color: #fff !important;
    color: #606266 !important;
    font-weight: 500;
    padding: 8px 12px !important;
    border-right: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
  }

  .el-form-item__content {
    padding: 8px 12px;
    color: var(--el-text-color-primary);
    flex: 1;
    background-color: #fff;
  }

  /* 输入框 */
  .el-input.is-disabled .el-input__wrapper,
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff !important;


    padding: 0;
    cursor: default;
  }

  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  /* Select */
  .el-select.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-select.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-select.is-disabled .el-input__suffix {
    display: none;
  }

  /* 日期/时间 */
  .el-date-editor.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-date-editor.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-date-editor.is-disabled .el-input__prefix,
  .el-date-editor.is-disabled .el-input__suffix {
    display: none;
  }

  /* 级联选择 */
  .el-cascader.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-cascader.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-cascader.is-disabled .el-input__suffix {
    display: none;
  }

  /* Tree Select */
  .el-tree-select.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-tree-select.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-tree-select.is-disabled .el-input__suffix {
    display: none;
  }

  /* Number */
  .el-input-number.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-input-number.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-input-number__decrease,
  .el-input-number__increase {
    display: none;
  }

  /* Autocomplete */
  .el-autocomplete.is-disabled .el-input__wrapper {
    background-color: #fff !important;


    padding: 0;
  }

  .el-autocomplete.is-disabled .el-input__inner {
    color: var(--el-text-color-primary) !important;
    -webkit-text-fill-color: var(--el-text-color-primary) !important;
  }

  .el-autocomplete.is-disabled .el-input__suffix {
    display: none;
  }

  /* Switch */
  .el-switch.is-disabled {
    opacity: 1;
  }

  /* Radio/Checkbox */
  .el-radio.is-disabled .el-radio__label,
  .el-checkbox.is-disabled .el-checkbox__label {
    color: var(--el-text-color-primary);
  }

  /* Rate */
  .el-rate.is-disabled {
    opacity: 1;
  }

  /* Slider */
  .el-slider.is-disabled {
    opacity: 1;
  }

  /* Upload */
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

  /* Tag */
  .el-tag.is-disabled {
    opacity: 1;
    color: var(--el-text-color-primary);
  }

  /* 去掉必填星号 */
  .el-form-item__label::before {
    display: none;
  }

  /* 隐藏验证图标 */
  .el-input__validateIcon,
  .el-input__clear {
    display: none;
  }

  .el-form-item.is-error {
    border-color: transparent;
  }

  .el-form-item__error {
    display: none;
  }
}
</style>
