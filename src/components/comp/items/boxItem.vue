<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {onMounted} from "vue";

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
const dataForm = defineModel("dataForm");

const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <el-row v-if="Array.isArray(item)" :gutter="5">
    <template v-for="sitem in item">
      <el-col
          :span="
          sitem.colspan ||
          sitem.preps?.colspan ||
          24 / item.filter((temp) => temp.formVisible).length
        "
          v-bind="sitem.preps"
          v-if="sitem.type != 'button' && sitem.type != 'usercomp'"
      >
        <el-form-item
            :size="compSize"
            :label="sitem.preps?.hideLabel ? '' : sitem.label"
            :prop="loadProp(propPrefix, sitem.fieldName, -1, -1)"
            :labelPosition="parentPreps?.labelPosition"
            :rules="validMsg(sitem, dataForm)"
            v-if="
            (sitem.formVisible &&
              sitem.label &&
              sitem.preps?.headerFlag != 'Y') ||
            checkVisible(sitem, dataForm)
          "
        >
          <star-horse-item
              :primaryKey="primaryKey"
              :compSize="compSize"
              v-model:dataForm="dataForm"
              :item="sitem"
              :dataIndex="dataIndex"
              :source="source"
          />
        </el-form-item>
        <star-horse-item
            v-else-if="sitem.viewVisible || checkVisible(sitem, dataForm)"
            :compSize="compSize"
            :primaryKey="primaryKey"
            v-model:dataForm="dataForm"
            :item="sitem"
            :dataIndex="dataIndex"
            :source="source"
        />
      </el-col>
      <el-col
          v-bind="sitem.preps"
          :span="
          sitem.colspan ||
          sitem.preps?.colspan ||
          24 / item.filter((temp) => temp.formVisible).length
        "
          v-else
      >
        <star-horse-item
            :primaryKey="primaryKey"
            :compSize="compSize"
            v-model:dataForm="dataForm"
            :item="sitem"
            :dataIndex="dataIndex"
            :source="source"
        />
      </el-col>
    </template>
  </el-row>
</template>

<style scoped lang="scss"></style>
