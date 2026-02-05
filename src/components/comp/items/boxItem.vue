<script setup lang="ts">
import {checkVisible, loadProp, validMsg} from "@/api/form_utils";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, onMounted} from "vue";

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
const dataForm = defineModel("dataForm");
const colHeight = computed(() => {
  const temp = props.item.find(item => item.preps?.colHeight);
  if (!temp) {
    return "unset";
  }
  return temp.preps?.colHeight;
});
const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <el-row v-if="Array.isArray(item)"
          :gutter="5"
          :justify="'start'"
          :align="'top'"
          :tag="'div'"
          :style="{height: colHeight,minHeight: '40px'}"
  >
    <template v-for="sitem in item">
      <el-col
          :span="sitem.preps?.colspan ||
          24 / item.filter((temp) => temp.formVisible).length
        "
          class="edit_col h-full"
          v-bind="sitem.preps"

      >
        <template v-if="sitem.type != 'button' && sitem.type != 'usercomp'&&!sitem.preps?.staticData">
          <!--需解决只需要标签内容的情况-->
          <el-form-item
              :size="compSize"
              class="h-full w-full"
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
        </template>
        <template v-else>
          <star-horse-item
              :primaryKey="primaryKey"
              :compSize="compSize"
              v-model:dataForm="dataForm"
              :item="sitem"
              :dataIndex="dataIndex"
              :source="source"
          />
        </template>
      </el-col>
    </template>
  </el-row>
</template>

<style scoped lang="scss">
.el-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
