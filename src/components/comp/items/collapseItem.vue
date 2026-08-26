<script setup lang="ts">
import {
  checkObject,
  getDataIndex,
  getFormData,
  getPrefix,
} from "@/api/form_utils";

import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted, ref, watch } from "vue";
import { prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";

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

/**
 * 判断某个 collapse-item 是否处于展开状态
 * el-collapse 的 v-model 为激活项 name 数组(非手风琴)或单个 name(手风琴)
 * 仅展开的 collapse-item 才渲染子内容,避免折叠项内字段组件挂载触发所有事件
 * @param collapseItem collapse 子项
 * @param key 子项在 containerFields 中的索引
 */
const isCollapseExpanded = (collapseItem: any, key: number): boolean => {
  const activeNames = props.item?.fieldName;
  const name = collapseItem.subTablePrimaryKey || key;
  if (Array.isArray(activeNames)) {
    return activeNames.includes(name);
  }
  return activeNames === name;
};

/**
 * 是否启用按需渲染(仅展开时才渲染子内容)
 * 默认启用,可通过 preps.lazy=false 关闭以保持原有全部渲染行为
 */
const lazyRender = () => props.item?.preps?.lazy !== false;

/**
 * 已挂载过的 collapse 子项 name 集合(仿 el-tabs lazy 的 loaded 标记机制)
 * 首次展开才挂载,之后保持挂载,避免反复折叠/展开重复触发子组件 onMounted 事件
 */
const loadedCollapse = ref<Set<any>>(new Set());
const markCollapseLoaded = () => {
  if (!lazyRender()) return;
  const next = new Set(loadedCollapse.value);
  (props.item?.containerFields || []).forEach((ci: any, key: number) => {
    if (isCollapseExpanded(ci, key)) {
      next.add(ci.subTablePrimaryKey || key);
    }
  });
  loadedCollapse.value = next;
};
watch(
  () => props.item?.fieldName,
  () => markCollapseLoaded(),
  { immediate: true, deep: true },
);
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
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
</script>

<template>
  <template v-if="item.containerFields?.length > 0">
    <el-collapse
      v-model="item.fieldName"
      v-bind="prepsFilter(item.preps)"
      v-if="!item.preps?.hideCollapse"
      v-on:change="(data) => item.actions?.['change']?.(data)"
    >
      <template v-for="(collapseItem, key) in item.containerFields">
        <el-collapse-item
          v-if="
            Object.keys(collapseItem).length > 0 &&
            collapseItem.formVisible !== false &&
            !collapseItem.preps?.hideCollapseItem
          "
          :name="collapseItem.subTablePrimaryKey || key"
          :disabled="collapseItem.disabled"
          v-bind="collapseItem.preps"
          :index="
            checkObject(dataForm, collapseItem, key, dataIndex, propPrefix)
          "
        >
          <template #title>
            <div class="collapse-item-title title">
              <div style="width: 80%">
                {{ collapseItem.title || collapseItem.label }}
                <help
                  v-if="collapseItem.helpMsg"
                  :message="collapseItem.helpMsg"
                />
              </div>
              <star-horse-icon
                v-if="collapseItem.icon"
                :icon-class="collapseItem.icon"
              />
            </div>
          </template>
          <star-horse-form-item
            v-if="
              !lazyRender() ||
              loadedCollapse.has(collapseItem.subTablePrimaryKey || key)
            "
            :source="source"
            :compUrl="compUrl"
            :compSize="compSize"
            @addRow="addRow"
            @removeRow="removeRow"
            :commonFormat="commonFormat"
            :subTableName="collapseItem.subTableName"
            :dataForm="
              getFormData(
                collapseItem,
                dataForm,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :dataIndex="
              getDataIndex(
                collapseItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :propPrefix="
              getPrefix(
                collapseItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
            :fieldList="collapseItem"
            :rules="rules"
            :subFormFlag="collapseItem.subFormFlag"
            :enableSubNode="collapseItem.enableSubNode"
            :primaryKey="primaryKey"
          />
        </el-collapse-item>
      </template>
    </el-collapse>
  </template>
</template>

<style scoped lang="scss">
.el-collapse {
  margin: 5px 3px;

  :deep(.el-collapse-item__header) {
    border-bottom: 1px solid rgb(229, 230, 235);
    border-top: 1px solid rgb(229, 230, 235);
    height: 30px;
  }

  :deep(.el-collapse-item__wrap) {
    margin-top: 10px;
    border: unset;
  }
}
</style>
