<script setup lang="ts">
import { nextTick, onMounted, provide, reactive, ref, watch } from "vue";
import { i18n } from "@/lang";
import CommonSkeleton from "./CommonSkeleton.vue";
import {
  FormDataProp,
  loadDynamicFormData,
} from "@/sample/commonpage/dynamic_form_utils";
import { getFormDataCacheStore } from "@/store/StoreManager";
import { UserFuncInfo } from "@/components/types";
import { userAction } from "@/api/user_func";
import { dialogPreps } from "@/api/star_horse_utils";
import { createDatetime } from "@/api/date_utils";
import { isMobile } from "@/api/device";

const normalPageRef = ref();
const normalFormRef = ref();
// 添加骨架屏加载状态
const isLoading = ref(true);
/**
 * 表单数据直接取定义的数据preps,
 * 列表数据重新定义，方便排序和位置拖拽
 */
let extBtns = ref<Array<UserFuncInfo>>([]);
const formData = ref<FormDataProp | any>({});
const props = defineProps({
  param: { type: String, required: true },
});

// 使用Pinia store管理表单数据缓存
const formDataCacheStore = getFormDataCacheStore();

// 追踪当前活跃的param，防止竞态条件导致数据错乱
let currentParamRef = ref<string>(props.param);

// 添加重复调用保护标志
let isLoadingRef = ref(false);

const loadFormData = async (formId: string) => {
  // 添加重复调用保护
  if (isLoadingRef.value) {
    return; // 如果正在加载中，直接返回，避免重复调用
  }

  isLoadingRef.value = true; // 开始加载
  isLoading.value = true; // 更新UI加载状态

  // 检查缓存中是否已有该表单数据
  if (formDataCacheStore.hasFormData(formId)) {
    // 使用缓存数据（深拷贝获取，避免引用问题）
    formData.value = formDataCacheStore.getFormData(formId)!;
    formData.value.tableFieldList["stopAutoLoad"] = true;
    extBtns.value = userAction(
      normalPageRef,
      formData.value.primaryKey,
      formData.value.tableFieldList["userTableFuncs"],
    );
    isLoading.value = false;

    delete formData.value.tableFieldList["userTableFuncs"];
    await nextTick();
    normalPageRef.value?.loadByPage(true);
    isLoadingRef.value = false;
    return;
  }

  // 缓存中没有，从后端加载
  const data = await loadDynamicFormData(formId);
  // 检查是否仍然是当前活跃的param（防止竞态条件）
  if (currentParamRef.value !== formId) {
    isLoading.value = false;
    isLoadingRef.value = false; // 重置加载状态
    return;
  }

  // 将加载的数据存入缓存
  formDataCacheStore.setFormData(formId, data);

  // 再次检查（数据加载和缓存设置之间可能已切换tab）
  if (currentParamRef.value !== formId) {
    isLoading.value = false;
    isLoadingRef.value = false; // 重置加载状态
    return;
  }

  formData.value = data;
  formData.value.tableFieldList["stopAutoLoad"] = true;
  extBtns.value = userAction(
    normalPageRef,
    formData.value.primaryKey,
    formData.value.tableFieldList["userTableFuncs"],
  );
  isLoading.value = false;
  isLoadingRef.value = false; // 重置加载状态
  delete formData.value.tableFieldList["userTableFuncs"];
  nextTick(() => {
    if (formDataCacheStore.getCacheSize() == 1 || isMobile) {
      console.log("----------------------1--------------");
      const handler = setTimeout(() => {
        console.log("----------------------3--------------");
        normalPageRef.value?.loadByPage(true);
        clearTimeout(handler);
      }, 200);
    } else {
      console.log("----------------------2--------------");
      normalPageRef.value?.loadByPage(true);
    }
  });
};

// 主动刷新表单（清除缓存后重新加载）
const refreshForm = async () => {
  formDataCacheStore.deleteFormData(props.param);
  await loadFormData(props.param);
};

//记录表单的属性
const formFields = reactive<Array<any>>([]);
provide("formFields", formFields);
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const dataFormat = (name: string, cellValue: any, row: any): any => {
  if (formData.value.dateFields?.length > 0) {
    if (formData.value.dateFields.includes(name)) {
      return createDatetime(cellValue);
    }
  }
  const subFormat = (name: string, cellValue: any, row: any) => {
    if (
      formData.value.dataSource &&
      Object.keys(formData.value.dataSource).length > 0
    ) {
      let temp = formData.value.dataSource[name];
      if (temp) {
        let stemp = temp.datas?.find(
          (item: any) => item[temp.valueField] == cellValue,
        );
        return stemp ? stemp[temp.labelField] : cellValue || "--";
      }
    }
    return "null" == cellValue ? "--" : cellValue || "--";
  };
  if (
    formData.value.fieldMappingList &&
    formData.value.fieldMappingList?.length > 0
  ) {
    let temp = formData.value.fieldMappingList.find(
      (item: any) => item["fieldName"] == name,
    );
    if (temp) {
      return row[temp.mappingDisplayField] || subFormat(name, cellValue, row);
    }
  }
  return subFormat(name, cellValue, row);
};
const init = () => {
  // loadFormData(props.param);
};
onMounted(async () => {
  // 初始化时手动调用一次，避免watch的immediate导致重复触发
  currentParamRef.value = props.param;
  loadFormData(props.param);
});

watch(
  () => props.param,
  (val) => {
    // 更新当前活跃的param，用于防止竞态条件
    currentParamRef.value = val;
    try {
      console.log("watch------------------------" + val);
      loadFormData(<string>val);
    } catch (e) {
      console.log(i18n("commonPage.dataTypeMismatch"));
    } finally {
      isLoading.value = false;
    }
  },
);
// 暴露refreshForm方法供外部调用
defineExpose({ refreshForm });
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden" :key="param">
    <!-- 使用通用骨架屏组件 -->
    <CommonSkeleton
      v-if="isLoading"
      :showSearch="true"
      :showHeader="true"
      :showTable="true"
      :tableRowCount="5"
    />

    <!-- 正常内容 -->
    <template v-else-if="formData.hasData">
      <star-horse-dialog
        :isShowBtnContinue="true"
        v-model="dialogProps.editVisible"
        :dialogProps="dialogProps"
      >
        <star-horse-form
          @refresh="normalPageRef?.loadByPage()"
          :compUrl="formData.dataUrl"
          :fieldList="formData.tableFieldList"
          :primary-key="formData.primaryKey"
          :rules="formData.rules"
          ref="normalFormRef"
          :globalCondition="formData.relationTables"
          :dynamicForm="true"
        />
      </star-horse-dialog>
      <star-horse-dialog
        v-model="dialogProps.viewVisible"
        :dialogProps="dialogProps"
        :source="3"
      >
        <star-horse-data-view
          :dataFormat="dataFormat"
          :field-list="formData.tableFieldList"
          :globalCondition="formData.relationTables"
          :dynamicForm="true"
          :compUrl="formData.dataUrl"
        />
      </star-horse-dialog>
      <div
        class="search-content"
        v-if="formData.searchFormData.fieldList?.length > 0"
      >
        <div class="search_btn">
          <star-horse-search-comp
            @searchData="(data: any) => normalPageRef?.createSearchParams(data)"
            :formData="formData.searchFormData"
            :compUrl="formData.dataUrl"
          />
        </div>
      </div>
      <el-card class="inner_content">
        <star-horse-table-comp
          ref="normalPageRef"
          :fieldList="formData.tableFieldList"
          :primaryKey="formData.primaryKey"
          :globalConfig="formData.relationTables"
          :isDynamic="true"
          :extendBtns="extBtns"
          :compUrl="formData.dataUrl"
          :showBatchField="true"
          :dataFormat="dataFormat"
        />
      </el-card>
    </template>
    <!-- 错误或空状态 -->
    <el-empty :content="formData.errorMsg" v-else></el-empty>
  </div>
</template>
<style lang="scss" scoped>
/* 原有样式保留 */
</style>
