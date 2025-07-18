import { defineStore } from "pinia";
import { ref } from "vue";

export const useContinusConfigStore = defineStore(
  "continuousConfig",
  () => {
    /**
     * 节点信息
     */
    const nodeInfo = ref<any>({});
    const nodeFields = ref<any>({});

    /**
     * 添加节点数据
     * @param nodeName
     * @param data
     */
    const addNodeInfo = (nodeName: string, data: any) => {
      if (nodeName) {
        nodeInfo.value[nodeName] = data;
      }
    };
    /**
     * 添加节点属性
     * @param formNo 表单编号
     * @param data
     */
    const addNodeFields = (formNo: string, data: any) => {
      if (formNo) {
        nodeFields.value[formNo] = data;
      }
    };
    /**
     * 获取节点数据
     * @param nodeName
     */
    const getNodeInfo = (nodeName: string) => {
      return nodeInfo.value[nodeName];
    };
    /**
     * 获取节点属性
     * @param formNo
     */
    const getNodeFields = (formNo: string) => {
      return nodeFields.value[formNo];
    };
    /**
     * 移除节点数据
     * @param nodeName
     */
    const removeNode = (nodeName: string) => {
      delete nodeInfo.value[nodeName];
    };

    const removeNodeFields = (formNo: string) => {
      delete nodeFields.value[formNo];
    };
    /**
     * 清空节点数据
     */
    const clear = () => {
      nodeInfo.value = {};
      nodeFields.value = {};
    };
    return {
      addNodeInfo,
      addNodeFields,
      getNodeFields,
      removeNodeFields,
      getNodeInfo,
      removeNode,
      clear,
      nodeInfo,
      nodeFields,
    };
  },
  {},
);
