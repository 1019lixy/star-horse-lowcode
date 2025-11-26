<script setup lang="ts">

import StarHorseFormTable from "@/components/comp/StarHorseFormTable.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted} from "vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");

/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
const closeOperation = (tabName: any) => {
  props.item.tabList?.forEach((item: any, index: number) => {
    if (item.tabName == tabName) {
      props.item.tabList.splice(index, 1);
      props.item.fieldName = props.item.tabList[0]?.tabName;
      let closeAction = props.item.actions?.["close"];
      closeAction && closeAction(item);
      return false;
    }
  });
};
/**
 * 切换tab校验
 * @param activeName 切换到的tabName
 * @param oldActiveName 切换前的tabName
 */
const beforeLeave = (activeName: string, oldActiveName: string) => {
  let beforeLeaveAction = props.item.actions?.["beforeLeave"];
  if (beforeLeaveAction) {
    return beforeLeaveAction(activeName, oldActiveName);
  }
  return true;
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.tabList?.length > 0">
    <el-tabs
        v-model="item.fieldName"
        :type="item.type || ''"
        @tabRemove="closeOperation"
        :closable="item.closable"
        :addable="item.addable"
        @tabChange="(data) => item.actions?.['tabChange']?.(data)"
        @tabAdd="(data) => item.actions?.['tabAdd']?.(data)"
        :before-leave="beforeLeave"
    >
      <template v-for="(tabItem, key) in item.tabList">
        <tabPanelItem
            :item="tabItem"
            :dataIndex="dataIndex"
            :itemKey="item.groupData?key:0"
            :source="source"
            parentType="tab"
            :compUrl="compUrl"
            :compSize="compSize"
            :propPrefix="propPrefix"
            @addRow="addRow"
            v-model:dataForm="dataForm"
            @removeRow="removeRow"
            :rules="rules"
        />
      </template>
    </el-tabs>
  </template>
  <template v-else-if="item.batchFieldList?.length > 0">
    <template
        v-if="
        item.batchFieldList.length > 1 &&
        (!item.displayStyle || item.displayStyle == 'tab')
      "
    >
      <el-tabs v-model="item.fieldName"
               :type="item.type || ''"
               @tabRemove="closeOperation"
               :closable="item.closable"
               :addable="item.addable"
               @tabChange="(data) => item.actions?.['tabChange']?.(data)"
               @tabAdd="(data) => item.actions?.['tabAdd']?.(data)"
               :before-leave="beforeLeave"
      >
        <template v-for="(sitem, key) in item.batchFieldList">
          <tabPanelItem
              :item="sitem"
              :dataIndex="dataIndex"
              :itemKey="key"
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              parentType="batch"
              :propPrefix="propPrefix"
              @addRow="addRow"
              v-model:dataForm="dataForm"
              @removeRow="removeRow"
              :rules="rules"
          />
        </template>
      </el-tabs>
    </template>
    <template v-else v-for="temp in item.batchFieldList">
      <star-horse-form-table
          :rules="rules"
          :size="compSize"
          :item="temp"
          @addRow="addRow"
          @removeRow="removeRow"
          v-if="Object.keys(temp).length > 0"
          v-model:dataForm="dataForm"
      />
    </template>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  height: 100% !important;
  flex: 1;
  overflow: auto;
}

:deep(.el-tabs) {
  overflow: auto !important;
}
</style>
