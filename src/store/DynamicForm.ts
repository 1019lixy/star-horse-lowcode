import { defineStore } from "pinia";
import { warning } from "@/utils/message";
import { ref } from "vue";
import { i18n } from "@/lang";

export const useDynamicFormStore = defineStore("dynamicForm", () => {
  const dataForm: any = ref({});
  const selectData: any = ref(null);
  const dataId: any = ref(null);

  /**
   *选中数据
   * @param data
   */
  const setSelectData = (data: object | Array<object>) => {
    selectData.value = data;
  };
  /**
   * 赋值
   * @param id 数据Id
   */
  const setDataId = (id: number | string) => {
    dataId.value = id;
  };
  /**
   * 存数据
   * @param data
   */
  const setFormData = (data: object) => {
    Object.assign(dataForm.value, data);
  };
  /**
   * 向集合添加数据
   * @param subTableName
   * @param data
   */
  const addBatchData = (subTableName: string, data: any) => {
    let batchDatas: Array<any> = dataForm.value[subTableName] as Array<any>;
    if (!batchDatas || batchDatas.length == 0) {
      dataForm.value[subTableName] = [];
      batchDatas = dataForm.value[subTableName];
    }
    batchDatas.push(data);
  };
  /**
   * 清除视图
   * @param fieldName
   */
  const delField = (fieldName: string) => {
    delete dataForm.value[fieldName];
  };
  /**
   * 删除集合内指定的所有属性
   * @param subTableName 集合名称
   * @param fieldName  属性名称
   * @param rowIndex 要删除属性所在的行 从1开始  -1 表示删除所有的属性
   */
  const delBatchField = (
    subTableName: string,
    fieldName: string,
    rowIndex: number = -1,
  ) => {
    const batchDatas = dataForm.value[subTableName];
    if (!batchDatas || batchDatas.length == 0) {
      return;
    }
    if (batchDatas instanceof Object) {
      delete batchDatas[fieldName];
    } else {
      if (rowIndex > 0) {
        delete batchDatas[rowIndex - 1][fieldName];
      } else {
        batchDatas.forEach((item: any) => {
          delete item[fieldName];
        });
      }
    }
  };
  /**
   * 设置指定属性的值
   * @param fieldName
   * @param value
   */
  const addOrUpdateField = (fieldName: string, value: any) => {
    dataForm.value[fieldName] = value;
  };
  /**
   * 在集合里新增或者修改属性的值
   * @param subTableName 集合名称
   * @param fieldName 属性名称
   * @param value 值
   * @param rowIndex 集合索引 从1开始 -1 表示在所有的数据中新增或者修改指定的值
   */
  const batchAddOrUpdateField = (
    subTableName: string,
    fieldName: string,
    value: any,
    rowIndex: number = -1,
  ) => {
    let batchDatas = dataForm.value[subTableName];
    if (!batchDatas || batchDatas.length == 0) {
      dataForm.value[subTableName] = [];
      batchDatas = dataForm.value[subTableName];
    }
    if (batchDatas instanceof Object) {
      batchDatas[fieldName] = value;
    } else {
      if (rowIndex > 0) {
        batchDatas[rowIndex - 1][fieldName] = value;
      } else {
        batchDatas.forEach((item: any) => {
          item[fieldName] = value;
        });
      }
    }
  };
  /**
   * 重命名属性，
   * @param sourceField 原来的属性名
   * @param distField 新的属性名
   * @param newValue  新的值
   */
  const renameField = (
    sourceField: string,
    distField: string,
    newValue?: any,
  ) => {
    if (Object.keys(dataForm.value).includes(distField)) {
      warning(i18n("common.fieldNameExists"));
      return;
    }
    const bakeValue = dataForm.value[sourceField];
    delete dataForm.value[sourceField];
    dataForm.value[distField] = newValue ? newValue : bakeValue;
  };
  /**
   * 重命名集合属性，
   * @param subTableName 集合名称
   * @param sourceField 原来的属性名
   * @param distField 新的属性名
   * @param newValue  新的值
   * @param rowIndex 指定重命名集合索引 从1开始 ，-1 表示重命名所有属性
   */
  const batchRenameField = (
    subTableName: string,
    sourceField: string,
    distField: string,
    newValue?: any,
    rowIndex: number = -1,
  ) => {
    const batchDatas = dataForm.value[subTableName];
    if (!batchDatas || batchDatas.length == 0) {
      batchAddOrUpdateField(subTableName, distField, newValue, rowIndex);
      return;
    }
    const dataFun = (
      data: any,
      sourceField: string,
      distField: string,
      newValue?: any,
    ) => {
      if (Object.keys(data).includes(distField)) {
        warning(i18n("common.fieldNameExists"));
        return false;
      }
      const bakeValue: any = data[sourceField];
      delete dataForm.value[sourceField];
      dataForm.value[distField] = newValue || bakeValue;
      return true;
    };
    if (batchDatas instanceof Object) {
      dataFun(batchDatas, sourceField, distField, newValue);
    } else {
      if (rowIndex > 0) {
        dataFun(batchDatas[rowIndex - 1], sourceField, distField, newValue);
      } else {
        batchDatas.forEach((item: any) => {
          const result = dataFun(item, sourceField, distField, newValue);
          if (!result) {
            return false;
          }
        });
      }
    }
  };
  /**
   * 获取指定属性的值
   * @param fieldName 属性名称
   */
  const getFieldValue = (fieldName: string) => {
    return dataForm.value[fieldName];
  };
  /**
   * 获取集合指定属性的数据
   * @param subTableName 集合名称
   * @param fieldName 属性名称
   * @param rowIndex 指定获取集合索引数据 从1开始，-1表示获取所有
   */
  const getBatchFieldValue = (
    subTableName: string,
    fieldName: string,
    rowIndex: number = -1,
  ) => {
    const batchDatas = dataForm.value[subTableName];
    if (!batchDatas) {
      return;
    }
    if (batchDatas instanceof Object) {
      return batchDatas[fieldName];
    } else {
      if (rowIndex > 0) {
        return batchDatas[rowIndex - 1][fieldName];
      } else {
        return batchDatas.map((item: any) => item[fieldName]);
      }
    }
  };
  /**
   * 清除所有Tab
   */
  const clearAll = () => {
    dataForm.value = {};
  };
  return {
    dataForm,
    selectData,
    dataId,
    setSelectData,
    setDataId,
    setFormData,
    addBatchData,
    delField,
    delBatchField,
    addOrUpdateField,
    batchAddOrUpdateField,
    renameField,
    batchRenameField,
    getFieldValue,
    getBatchFieldValue,
    clearAll,
  };
});
