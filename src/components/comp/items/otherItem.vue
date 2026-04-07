<script setup lang="ts">
import { checkVisible, loadProp, validMsg } from "@/api/form_utils";
import { Config } from "@/api/settings";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
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
const dataForm: ModelRef<any> = defineModel("dataForm");
const init = () => {};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.type == 'usercomp' || item.type == 'button'">
    <star-horse-item
      v-if="checkVisible(item, dataForm)"
      :primaryKey="primaryKey"
      v-model:dataForm="dataForm"
      :item="item"
      :commonFormat="commonFormat"
      :dataIndex="dataIndex"
      :bareFlag="true"
      :compSize="compSize"
      :source="source"
    />
  </template>
  <el-form-item
    :size="compSize"
    :label="item.preps?.hideLabel ? '' : item.label"
    :rules="validMsg(item, dataForm)"
    :prop="loadProp(propPrefix, item.fieldName, -1, -1)"
    :label-position="parentPreps?.labelPosition"
    v-else-if="checkVisible(item, dataForm)"
  >
    <star-horse-item
      :primaryKey="primaryKey"
      :compSize="compSize"
      v-model:dataForm="dataForm"
      :item="item"
      :commonFormat="commonFormat"
      :dataIndex="dataIndex"
      :source="source"
    />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
