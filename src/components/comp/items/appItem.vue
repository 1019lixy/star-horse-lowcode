<script setup lang="ts">
import {getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted} from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";

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
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};
const loadItem = (item: any) => {
  return {
    type: "text",
    formVisible: true,
    fieldName: "textTemp",
    preps: {
      staticData: true,
      textContent: item.title
    }
  };
};
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.appList?.length > 0">
    <template v-for="(appItem, key) in item.appList">
      <template v-if="appItem.title">
        <star-horse-item
            :primaryKey="primaryKey"
            :compSize="compSize"
            v-model:dataForm="dataForm"
            :commonFormat="commonFormat"
            :item="loadItem(appItem)"
            :dataIndex="dataIndex"
            :source="source"
        />
      </template>
      <star-horse-form-item
          :source="source"
          :compUrl="compUrl"
          :compSize="compSize"
          :commonFormat="commonFormat"
          :dataForm="
            getFormData(
              appItem,
              dataForm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
          :dataIndex="
            getDataIndex(
              appItem,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
          :propPrefix="
            getPrefix(appItem, propPrefix, dataIndex, item.groupData ? key : 0)
          "
          :objectName="appItem.objectName"
          @addRow="addRow"
          @removeRow="removeRow"
          :fieldList="appItem"
          :rules="rules"
          :subFormFlag="appItem.subFormFlag"
          :primaryKey="primaryKey"
      />
    </template>
  </template>
</template>

<style scoped lang="scss">
.card-header {
  span {
    width: 90%;
  }
}

:deep(.el-card__body),
.el-card {
  height: unset !important;
  flex: unset !important;
}
</style>
