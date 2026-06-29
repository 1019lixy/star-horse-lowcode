<script setup lang="ts">
import { ModelRef, onMounted, PropType } from "vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { FieldInfo } from "@/components/types/PageFieldInfo";

import { getDataIndex, getFormData, getPrefix } from "@/api/form_utils";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
import { StarHorseFormTable } from "@/components/comp";

defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  item: { type: Array as PropType<Array<FieldInfo> | any>, required: true },
  // 数据索引
  dataIndex: { type: Number, default: -1 },
  itemKey: { type: [Number, String], default: 0 },
  // 父节点名称
  propPrefix: { type: String, default: "" },
  rules: { type: Object },
  compSize: { type: String, default: "default" },
  source: { type: Number, default: 1 },
  parentType: { type: String, default: "" },
  commonFormat: { type: Function, default: () => {} },
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
  <el-tab-pane
    v-if="!item['disVisible']"
    :label="item['title']"
    :name="item.tabName || 'tab' + itemKey"
    :disabled="item.disabled"
    :closable="item.closable"
    v-bind="item.preps"
    class="h-full flex flex-col w-[99%] mx-auto"
  >
    <template #label>
      <div class="custom-tabs-label">
        <star-horse-icon :icon-class="item.icon" v-if="item.icon" />
        <span>{{ item.title || item.label }}</span>
      </div>
    </template>
    <template
      v-if="
        (parentType == 'tab' && item.tableFlag != 'Y') || item.formFlag == 'Y'
      "
    >
      <star-horse-form-item
        :source="source"
        :compUrl="compUrl"
        :compSize="compSize"
        @addRow="addRow"
        @removeRow="removeRow"
        :objectName="item.objectName"
        :commonFormat="commonFormat"
        :dataForm="getFormData(item, dataForm, propPrefix, dataIndex, itemKey)"
        :dataIndex="getDataIndex(item, propPrefix, dataIndex, itemKey)"
        :propPrefix="getPrefix(item, propPrefix, dataIndex, itemKey)"
        :fieldList="item"
        :rules="rules"
        :subFormFlag="item.subFormFlag"
        :primaryKey="item.primaryKey"
      />
    </template>
    <star-horse-form-table
      v-else-if="parentType == 'batch' || item.tableFlag == 'Y'"
      :size="compSize"
      @addRow="addRow"
      :source="source"
      @removeRow="removeRow"
      :commonFormat="commonFormat"
      :rules="rules"
      :item="item"
      v-model:dataForm="dataForm"
    />
  </el-tab-pane>
</template>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  height: 100% !important;
  flex: 1;
  overflow-y: auto;
}
</style>
