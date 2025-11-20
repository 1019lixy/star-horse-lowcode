<script setup lang="ts">
import {ModelRef, onMounted, PropType} from "vue";
import {FieldInfo} from "@/components/types/PageFieldInfo";
import {compKey} from "@/api/system";

defineProps({
  item: {type: Array as PropType<Array<FieldInfo> | any>, required: true},
  objectName: {type: String},
  dataIndex: {type: Number, default: -1},
  subFormFlag: {type: String, default: "N"},
  batchName: {type: String, default: "batchDataList"},
  batchFieldName: {type: String, default: "batchFieldList"},
  commonFormat: {type: Function, required: true},
});
const dataForm: ModelRef<any> = defineModel("dataForm");
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.splitterList?.length > 0">
    <el-splitter :layout="item.layout">
      <template
          v-for="(splitterItem, key) in item.splitterList"
          :key="compKey(splitterItem, key)"
      >
        <el-splitter-panel
            v-if="Object.keys(splitterItem).length > 0"
            v-bind="splitterItem.preps"
        >
          <star-horse-data-view-items
              v-model:dataForm="dataForm[splitterItem.objectName]"
              :objectName="splitterItem.objectName"
              :commonFormat="commonFormat"
              :fieldList="splitterItem"
              :subFormFlag="splitterItem.subFormFlag"
          />
        </el-splitter-panel>
      </template>
    </el-splitter>
  </template>
</template>

<style scoped lang="scss">
.el-collapse {
  :deep(.el-collapse-item__header) {
    border: 1px solid var(--star-horse-style);
    margin-top: 5px;
    height: 40px;
    padding-left: 15px;
  }

  :deep(.el-collapse-item__content) {
    padding: 5px 10px;
  }

  :deep(.el-collapse-item__wrap) {
    margin-top: 10px;
    border: unset;
  }
}
</style>
