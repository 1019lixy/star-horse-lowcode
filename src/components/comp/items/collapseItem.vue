<script setup lang="ts">
import {
  checkObject,
  getDataIndex,
  getFormData,
  getPrefix,
} from "@/api/form_utils";

import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";
import { prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";

withDefaults(defineProps<ContainerPreps>(), {
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
  <template v-if="item.collapseList?.length > 0">
    <el-collapse
      v-model="item.fieldName"
      v-bind="prepsFilter(item.preps)"
      v-if="!item.preps?.hideCollapse"
      v-on:change="(data) => item.actions?.['change']?.(data)"
    >
      <template v-for="(collapseItem, key) in item.collapseList">
        <el-collapse-item
          v-if="
            Object.keys(collapseItem).length > 0 &&
            !collapseItem.preps?.hideCollapseItem
          "
          :name="collapseItem.tabName || key"
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
            :source="source"
            :compUrl="compUrl"
            :compSize="compSize"
            @addRow="addRow"
            @removeRow="removeRow"
            :commonFormat="commonFormat"
            :objectName="collapseItem.objectName"
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
