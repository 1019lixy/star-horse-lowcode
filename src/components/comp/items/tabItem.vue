<script setup lang="ts">
import StarHorseFormTable from "@/components/comp/StarHorseFormTable.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { initRelationEvent } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ModelRef, inject, nextTick, onMounted, ref, unref, watch } from "vue";

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
// inject 表单字段列表,用于构造 initRelationEvent 所需的 props.formInfo
const formFields = inject("formFields", ref<any[]>([]));

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
const init = () => {};
onMounted(() => {
  init();
});

/**
 * 递归遍历 fieldList,对有 dataRelation 的字段重新触发初始联动
 * 用于 tab 从隐藏变可见时,补触 tab 内字段因组件未挂载而遗漏的初始联动
 */
const reTriggerRelationInTab = (fields: any[], visited?: WeakSet<any>) => {
  if (!Array.isArray(fields)) return;
  // 循环引用防护:防止配置错误导致栈溢出
  if (!visited) visited = new WeakSet();
  fields.forEach((field: any) => {
    if (Array.isArray(field)) {
      reTriggerRelationInTab(field, visited);
    } else if (field == null || typeof field !== "object") {
      // 容错:跳过 null/undefined/非对象元素
      return;
    } else if (visited.has(field)) {
      // 循环引用防护
      return;
    } else {
      visited.add(field);
      if (field?.preps?.dataRelation?.actionName) {
        // formFields 可能是 ref(shallowRef),unref 统一取值;非 ref 则原样返回
        const formInfoVal = unref(formFields);
        initRelationEvent(
          { field, formInfo: formInfoVal },
          dataForm,
          true,
        );
      }
    }
  });
};

/**
 * 监听 tabList 的 formVisible 变化:
 * 1. tab 从隐藏变可见时,重新触发 tab 内有 dataRelation 的字段的初始联动
 *    (tab 隐藏时内部字段组件未挂载,onMounted 中的 initCompCallEvent 未执行)
 * 2. 激活的 tab 被隐藏时,自动切换到第一个可见 tab,避免 el-tabs 显示空白
 */
watch(
  () => {
    // 容错:tabList 可能不是数组(配置错误),返回空数组避免 .map crash
    const tabs = props.item?.tabList;
    return Array.isArray(tabs) ? tabs.map((t: any) => t?.formVisible) : [];
  },
  (newVals, oldVals) => {
    const tabs = props.item?.tabList;
    if (!Array.isArray(tabs)) return;
    tabs.forEach((tab: any, index: number) => {
      if (tab == null) return;
      const wasVisible = oldVals?.[index] !== false;
      const isVisible = newVals?.[index] !== false;
      // tab 从隐藏变可见:延迟重触发 tab 内字段的初始联动
      if (!wasVisible && isVisible) {
        nextTick(() => {
          reTriggerRelationInTab(tab.fieldList);
        });
      }
    });
    // 激活的 tab 被隐藏时,切换到第一个可见 tab
    const activeTab = tabs.find((t: any) => t?.tabName === props.item?.fieldName);
    if (activeTab && activeTab.formVisible === false) {
      const firstVisible = tabs.find((t: any) => t?.formVisible !== false);
      if (firstVisible) {
        props.item.fieldName = firstVisible.tabName;
      }
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <template v-if="item.tabList?.length > 0">
    <el-tabs
      v-model="item.fieldName"
      :type="item.preps?.type || ''"
      @tabRemove="closeOperation"
      :closable="item.preps?.closable"
      :addable="item.preps?.addable"
      v-if="!item.preps?.hideTabs"
      @tabChange="(data) => item.actions?.['tabChange']?.(data)"
      @tabAdd="(data) => item.actions?.['tabAdd']?.(data)"
      :before-leave="beforeLeave"
    >
      <template v-for="(tabItem, key) in item.tabList">
        <tabPanelItem
          :item="tabItem"
          v-if="tabItem.formVisible !== false && !tabItem.preps?.hideTabPanel"
          :dataIndex="dataIndex"
          :itemKey="item.groupData ? key : 0"
          :source="source"
          :enableSubNode="tabItem.enableSubNode"
          parentType="tab"
          :commonFormat="commonFormat"
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
      <el-tabs
        v-model="item.fieldName"
        :type="item.preps?.type || ''"
        @tabRemove="closeOperation"
        :closable="item.preps?.closable"
        :addable="item.preps?.addable"
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
            :enableSubNode="sitem.enableSubNode"
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
        :source="source"
        @addRow="addRow"
        :enableSubNode="temp.enableSubNode"
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
