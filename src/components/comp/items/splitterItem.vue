<script setup lang="ts">
import {checkObject, getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";

import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted} from "vue";
import {prepsFilter} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {i18n} from "@/lang";

withDefaults(defineProps<ContainerPreps>(), {
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
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.containerFields?.length > 0">
    <el-splitter v-bind="prepsFilter(item.preps)">
      <template v-for="(splitterItem, key) in item.containerFields">
        <el-splitter-panel
            v-if="
            Object.keys(splitterItem).length > 0 &&
            splitterItem.formVisible !== false
          "
            v-bind="splitterItem.preps"
            :index="
            checkObject(dataForm, splitterItem, key, dataIndex, propPrefix)
          "
        >
          <div class="section-title-bar">
            <span class="section-name">{{
                splitterItem.title
              }}</span>
          </div>
          <div class="splitter-body">
            <star-horse-form-item
                :source="source"
                :compUrl="compUrl"
                :compSize="compSize"
                @addRow="addRow"
                :commonFormat="commonFormat"
                @removeRow="removeRow"
                :subTableName="splitterItem.subTableName"
                :dataForm="
              getFormData(
                splitterItem,
                dataForm,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
                :dataIndex="
              getDataIndex(
                splitterItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
                :propPrefix="
              getPrefix(
                splitterItem,
                propPrefix,
                dataIndex,
                item.groupData ? key : 0,
              )
            "
                :fieldList="splitterItem"
                :rules="rules"
                :subFormFlag="splitterItem.subFormFlag"
                :enableSubNode="splitterItem.enableSubNode"
                :primaryKey="primaryKey"
            />
          </div>
        </el-splitter-panel>
      </template>
    </el-splitter>
  </template>
</template>

<style scoped lang="scss">
.splitter-body {
  margin: 5px 8px;


}
</style>
