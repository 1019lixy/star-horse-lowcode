<script setup lang="ts">
import {compKey} from "@/api/system";
import StarHorseFormTable from "@/components/comp/StarHorseFormTable.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {computed, ModelRef, onMounted} from "vue";

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
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");

const batchContainers = computed(() => {
  const item: any = props.item;
  //除了顶层
  return item.containerType === "table" || props.containerType == "table" ? item.containerFields : [];
});

const init = () => {
};
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
      batchContainers.length > 1 &&
      (!item.displayStyle || item.displayStyle == 'tab')
    "
  >
    <el-tabs v-model="item.fieldName" :type="item.preps?.type ?? 'border-card'">
      <template v-for="(temp, key) in batchContainers">
        <el-tab-pane
            :label="temp['title']"
            v-if="!(temp['disVisible'] ?? temp.preps?.disVisible)"
            :name="temp.subTablePrimaryKey || 'sub_tab' + key"
            :disabled="temp.disabled"
            :lazy="temp.preps?.lazy !== false"
            class="h-full flex flex-col"
        >
          <star-horse-form-table
              :size="compSize"
              @addRow="addRow"
              :source="source"
              :dialogType="dialogType"
              @removeRow="removeRow"
              :enableSubNode="enableSubNode"
              :commonFormat="commonFormat"
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
      v-for="(temp, key) in batchContainers"
      :key="compKey(temp, key)"
  >
    <star-horse-form-table
        :size="compSize"
        :rules="rules"
        :source="source"
        @addRow="addRow"
        @removeRow="removeRow"
        :enableSubNode="enableSubNode"
        :commonFormat="commonFormat"
        :item="temp"
        v-model:dataForm="dataForm"
    />
  </template>
</template>

<style scoped lang="scss"></style>
