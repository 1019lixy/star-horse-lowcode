<script setup lang="ts">
import {ContainerPreps} from "@/components/types/ItemPreps";
import {initRelationEvent} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {collectFieldProps, getPrefix} from "@/api/form_utils";
import {i18n} from "@/lang";
import {warning} from "@/utils/message";
import {computed, inject, ModelRef, nextTick, onMounted, ref, unref, watch,} from "vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",

  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
// inject 表单字段列表,用于构造 initRelationEvent 所需的 props.formInfo
const formFields = inject("formFields", ref<any[]>([]));
// 注入 el-form 实例（由 StarHorseForm provide），用于调用 validateField / clearValidate
const starHorseFormRef = inject("starHorseFormRef", ref<any>(null));

// 是否切换 tab 前必须完成当前 tab（默认开启，设为 "N" 可关闭；source=3 查看模式自动关闭）
const mustCompleteTab = computed(() => {
  if (props.source == 3) return false;
  return !!props.item?.preps?.mustCompleteTab;
});

/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
const closeOperation = (subTablePrimaryKey: any) => {
  props.item.containerFields?.forEach((item: any, index: number) => {
    if (item.subTablePrimaryKey == subTablePrimaryKey) {
      props.item.containerFields.splice(index, 1);
      props.item.fieldName = props.item.containerFields[0]?.subTablePrimaryKey;
      let closeAction = props.item.actions?.["close"];
      closeAction && closeAction(item);
      return false;
    }
  });
};
/**
 * 校验指定 tab：调用 el-form 的 validateField 触发内联校验（红框 + 错误提示）
 * @param tab tab 对象
 * @param tabIdx tab 在 tabList 中的索引
 */
const validateTab = async (tab: any, tabIdx: number): Promise<boolean> => {
  const formRef = starHorseFormRef.value;
  if (!formRef?.validateField) return true;
  const tabPrefix = getPrefix(tab, props.propPrefix, props.dataIndex, tabIdx);
  const fieldProps = collectFieldProps(tab.fieldList || [], tabPrefix);
  if (!fieldProps.length) return true;
  try {
    await formRef.validateField(fieldProps);
    return true;
  } catch {
    return false;
  }
};

/**
 * 清除指定 tab 字段的校验状态（用于切换时清除残留的红框）
 */
const clearTabValidate = (tab: any, tabIdx: number) => {
  const formRef = starHorseFormRef.value;
  if (!formRef?.clearValidate) return;
  const tabPrefix = getPrefix(tab, props.propPrefix, props.dataIndex, tabIdx);
  const fieldProps = collectFieldProps(tab.fieldList || [], tabPrefix);
  if (fieldProps.length) formRef.clearValidate(fieldProps);
};

/**
 * 切换tab校验
 * - 仅向前切换时校验当前 tab（与 stepItem 规则一致，向后切换不校验）
 * - 先执行用户配置的 beforeLeave，若返回 false 则直接阻止
 * @param activeName 切换到的tabName
 * @param oldActiveName 切换前的tabName
 */
const beforeLeave = async (activeName: string, oldActiveName: string) => {
  const beforeLeaveAction = props.item.actions?.["beforeLeave"];
  if (beforeLeaveAction) {
    const result = await beforeLeaveAction(activeName, oldActiveName);
    if (result === false) return false;
  }
  if (!mustCompleteTab.value || !props.item.containerFields?.length)
    return true;
  const tabs = props.item.containerFields;
  const oldIdx = tabs.findIndex(
      (t: any) => t.subTablePrimaryKey === oldActiveName,
  );
  const newIdx = tabs.findIndex(
      (t: any) => t.subTablePrimaryKey === activeName,
  );
  // 向后切换或未找到：不校验，清除当前 tab 残留校验状态
  if (oldIdx < 0 || newIdx < 0 || newIdx <= oldIdx) {
    if (oldIdx >= 0) clearTabValidate(tabs[oldIdx], oldIdx);
    return true;
  }
  // 向前切换：校验当前 tab
  const oldTab = tabs[oldIdx];
  const valid = await validateTab(oldTab, oldIdx);
  if (!valid) {
    warning(i18n("dyform.step.stepIncomplete"));
    return false;
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
        initRelationEvent({field, formInfo: formInfoVal}, dataForm, true);
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
      // 容错:containerFields 可能不是数组(配置错误),返回空数组避免 .map crash
      const tabs = props.item?.containerFields;
      return Array.isArray(tabs) ? tabs.map((t: any) => t?.formVisible) : [];
    },
    (newVals, oldVals) => {
      const tabs = props.item?.containerFields;
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
      const activeTab = tabs.find(
          (t: any) => t?.subTablePrimaryKey === props.item?.fieldName,
      );
      if (activeTab && activeTab.formVisible === false) {
        const firstVisible = tabs.find((t: any) => t?.formVisible !== false);
        if (firstVisible) {
          props.item.fieldName = firstVisible.subTablePrimaryKey;
        }
      }
    },
    {deep: true, immediate: true},
);
</script>

<template>
  <template v-if="item.containerFields?.length > 0">
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
      <template v-for="(tabItem, key) in item.containerFields">
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
