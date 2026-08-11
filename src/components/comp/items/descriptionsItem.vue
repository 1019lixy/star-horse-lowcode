<script setup lang="ts">
import {getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted} from "vue";

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

const init = () => {
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.descriptionsList?.length > 0">

    <el-descriptions
        :title="item.preps['descTitle'] || ''"
        :direction="item.preps['direction'] || 'horizontal'"
        :column="item.preps['column'] || 3"
        :border="item.preps['border'] !== false"
        :size="item.preps['size'] || 'default'"
        :extra="item.preps['descExtra'] || ''"
        :label-width=" item.preps['descItemLabelWidth'] || ''"
    >
      <template v-for="(descItm, key) in item.descriptionsList">
        <el-descriptions-item
            :key="descItm.id"
            :label="descItm.preps?.label || descItm.itemName"
            :rowspan=" item.preps['descItemRowspan'] || 1"
            :align=" item.preps['descItemAlign'] || 'left'"
            :class-name=" item.preps['descItemClassName'] || ''"

            :span="item.preps['descItemSpan'] || 1"
            :label-class-name=" item.preps['descItemLabelClassName'] || ''"
        >
          <star-horse-form-item
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              :commonFormat="commonFormat"
              :dataForm="
            getFormData(
              descItm,
              dataForm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
              :dataIndex="
            getDataIndex(
              descItm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
              :propPrefix="
            getPrefix(descItm, propPrefix, dataIndex, item.groupData ? key : 0)
          "
              :objectName="descItm.objectName"
              @addRow="addRow"
              @removeRow="removeRow"
              :fieldList="descItm"
              :rules="rules"
              :subFormFlag="descItm.subFormFlag"
              :enableSubNode="descItm.enableSubNode"
              :primaryKey="primaryKey"
          />
        </el-descriptions-item>
      </template>

    </el-descriptions>
  </template>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  padding: 0 !important;
}
</style>
