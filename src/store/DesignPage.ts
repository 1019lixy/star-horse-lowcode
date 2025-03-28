import {defineStore} from "pinia";
import {ref} from "vue";
import {DynamicNode} from "@/components/types/DynamicNode";

export const useDesignPageStore = defineStore("designPage",
    () => {
        const nodeList = ref<Array<DynamicNode>>([]);
        const currentNode = ref<DynamicNode>(null);
        const isEdit = ref<boolean>(false);
        const defaultZindex = ref<number>(100);
        /**
         * 清除所有数据
         */
        const clearAll = () => {
            isEdit.value = false;
            nodeList.value = [];
            currentNode.value = null;
        };
        const removeNode = (id: string) => {
            nodeList.value = nodeList.value.filter((node: DynamicNode) => {
                return node.id != id;
            });
            currentNode.value = id == currentNode.value.id ? null : currentNode.value;
        };
        const setNodeList = (list: Array<DynamicNode>) => {
            nodeList.value = list;
        };
        const addNode = (node: DynamicNode) => {
            nodeList.value.push(node);
        };
        const selectNode = (node: DynamicNode) => {
            currentNode.value = node;
        };
        const setIsEdit = (edit: boolean) => {
            isEdit.value = edit;
        };
        const maxZIndex = () => {
            nodeList.value.sort((a: DynamicNode, b: DynamicNode) => {
                return (a.zIndex || defaultZindex.value) - (b.zIndex || defaultZindex.value);
            });
            return nodeList.value[0].zIndex || defaultZindex.value;
        };
        const init = () => {
        };
        return {
            nodeList,
            currentNode,
            isEdit,
            defaultZindex,
            setNodeList,
            removeNode,
            addNode,
            selectNode,
            clearAll,
            setIsEdit,
            maxZIndex,
            init
        };
    });
