<script setup lang="ts">
import {checkObject, getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";
import {Config} from "@/api/settings";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted} from "vue";
import {prepsFilter} from "@/components/formcomp/utils/ItemRelationEventUtils";

withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: Config.compSize,
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
  <template v-if="item.splitterList?.length > 0">
    <el-splitter
        v-bind="prepsFilter(item.preps)"
    >
      <template v-for="(splitterItem, key) in item.splitterList">
        <el-splitter-panel
            v-if="Object.keys(splitterItem).length > 0"
            v-bind="splitterItem.preps"
            :index="
            checkObject(dataForm, splitterItem, key, dataIndex, propPrefix)
          "
        >
          <star-horse-form-item
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              @addRow="addRow"
              @removeRow="removeRow"
              :objectName="splitterItem.objectName"
              :dataForm="
              getFormData(splitterItem, dataForm, propPrefix, dataIndex, item.groupData?key:0)
            "
              :dataIndex="getDataIndex(splitterItem, propPrefix, dataIndex, item.groupData?key:0)"
              :propPrefix="getPrefix(splitterItem, propPrefix, dataIndex, item.groupData?key:0)"
              :fieldList="splitterItem"
              :rules="rules"
              :subFormFlag="splitterItem.subFormFlag"
              :primaryKey="primaryKey"
          />
        </el-splitter-panel>
      </template>
    </el-splitter>
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
