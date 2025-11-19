<script setup lang="ts">
import { Config } from "@/api/settings";
import { compKey } from "@/api/system";
import StarHorseFormTable from "@/components/comp/StarHorseFormTable.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { ModelRef, onMounted } from "vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
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
const init = () => {};
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
onMounted(() => {
  init();
});
</script>

<template>
  <template
    v-if="
      item[batchFieldName]?.length > 1 &&
      (!item.displayStyle || item.displayStyle == 'tab')
    "
  >
    <el-tabs v-model="item.fieldName">
      <template v-for="(temp, key) in item[batchFieldName]">
        <el-tab-pane
          :label="temp['title']"
          v-if="!temp['disVisible']"
          :name="temp.tabName || 'sub_tab' + key"
          :disabled="temp.disabled"
          class="h-full flex flex-col"
        >
          <star-horse-form-table
            :size="compSize"
            @addRow="addRow"
            @removeRow="removeRow"
            :rules="rules"
            :item="temp"
            v-model:dataForm="dataForm"
          />
        </el-tab-pane>
      </template>
    </el-tabs>
  </template>
  <template
    v-else
    v-for="(temp, key) in item[batchFieldName]"
    :key="compKey(temp, key)"
  >
    <star-horse-form-table
      :size="compSize"
      :rules="rules"
      @addRow="addRow"
      @removeRow="removeRow"
      :item="temp"
      v-model:dataForm="dataForm"
    />
  </template>
</template>

<style scoped lang="scss"></style>
