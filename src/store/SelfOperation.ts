import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";

/**
 * 用户自定义方法处理逻辑
 */
export const useSelfOperationStore = defineStore("selfOperation", () => {
  const formFieldList = ref<PageFieldInfo>({});
  const fieldItemList = ref<any>({});
  const formData = ref<any>({});
  const formInstance = ref();
  /**
   * 设置表单信息
   * @param fieldList
   */
  const setFormFields = (fieldList: PageFieldInfo) => {
    formFieldList.value = fieldList;
  };
  const setFormInstance = (formRef: Ref) => {
    formInstance.value = formRef.value;
  };
  /**
   * 设置实例数据
   * @param data
   */
  const setFormData = (data: any) => {
    formData.value = data;
  };
  /**
   * 添加
   * @param formItem
   */
  const addFormItem = (formItem: any) => {
    if (!formItem || (!formItem.fieldName && !formItem.preps?.name)) {
      return;
    }
    fieldItemList.value[formItem.fieldName || formItem.preps?.name] = formItem;
  };

  /**
   * 批量添加
   * @param formItems
   */
  const addFormItemList = (formItems: Array<any>) => {
    if (!formItems) {
      return;
    }
    for (const formItem of formItems) {
      fieldItemList.value[formItem.fieldName || formItem.preps?.name] =
        formItem;
    }
  };
  /**
   * 获取属性配置信息
   * @param fieldName
   */
  const getFormItem = (fieldName: string) => {
    return fieldItemList.value[fieldName] || {};
  };
  /**
   * 一个模块只能操作一个表单
   * 初始化数据
   */
  const init = (fieldList: PageFieldInfo, data: any, formRef: Ref) => {
    formFieldList.value = fieldList;
    fieldItemList.value = {};
    formData.value = data;
    formInstance.value = formRef;
  };
  /**
   * 清除掉数据
   */
  const clearAll = () => {
    formFieldList.value = {};
    fieldItemList.value = {};
    formData.value = {};
    formInstance.value = null;
  };
  return {
    formFieldList,
    fieldItemList,
    formInstance,
    formData,
    setFormInstance,
    setFormFields,
    setFormData,
    addFormItem,
    addFormItemList,
    getFormItem,
    init,
    clearAll,
  };
});
