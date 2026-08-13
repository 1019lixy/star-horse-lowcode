import { defineStore } from "pinia";
import { ref } from "vue";

export const useConsumerViewStore = defineStore(
  "consumerView",
  () => {
    const tableList = ref<any>({});
    const dbConfigId = ref<string>("");

    /**
     *赋值
     * @param tableName 表名
     * @param data 字典列表
     */
    const addTableInfo = (tableName: string, data: object | Array<any>) => {
      tableList.value[tableName] = data;
    };
    /**
     * 设置数据库配置id
     *
     * @param configId
     */
    const setDbConfigId = (configId: string) => {
      dbConfigId.value = configId;
    };
    /**
     * 根据表名获取字段信息
     * @param tableName 表名
     */
    const getTableInfo = (tableName: string) => {
      return tableList.value[tableName];
    };
    /**
     * 清除所有Tab
     */
    const clearAll = () => {
      tableList.value = {};
    };

    return {
      tableList,
      dbConfigId,
      addTableInfo,
      setDbConfigId,
      getTableInfo,
      clearAll,
    };
  },
  {
    persist: false,
  },
);
