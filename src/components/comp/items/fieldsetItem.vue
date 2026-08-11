<script setup lang="ts">
import {getDataIndex, getFormData, getPrefix,} from "@/api/form_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, onMounted, ref} from "vue";

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
const innerCollapsed = ref<boolean>(false);
const toggleInner = () => {
  if (props.item?.preps?.collapsible) innerCollapsed.value = !innerCollapsed.value;
};
onMounted(() => {
  init();
});
</script>

<template>
  <template v-if="item.fieldsetList?.length > 0">
    <fieldset
        class="fieldset-container"
        :class="{
          'border-dashed': item.preps['borderStyle'] === 'dashed',
          'border-none': item.preps['borderStyle'] === 'none',
          'is-collapsible': item.preps['collapsible'],
          'is-collapsed': innerCollapsed
        }"
    >
      <legend
          class="fieldset-legend"
          :class="{ 'clickable': item.preps['collapsible'] }"
          @click="toggleInner"
      >
        <svg
            v-if="item.preps['collapsible']"
            :class="['legend-arrow', { 'rotated': innerCollapsed }]"
            viewBox="0 0 10 6" fill="none" width="10" height="10"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <span
            class="legend-text"
        >
          {{ item.preps['fieldsetTitle'] }}
        </span>
      </legend>
      <div v-show="!innerCollapsed" class="fieldset-body">
        <template v-for="(fiedsetItem, key) in item.fieldsetList">
          <star-horse-form-item
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              :commonFormat="commonFormat"
              :dataForm="
            getFormData(
              fiedsetItem,
              dataForm,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
              :dataIndex="
            getDataIndex(
              fiedsetItem,
              propPrefix,
              dataIndex,
              item.groupData ? key : 0,
            )
          "
              :propPrefix="
            getPrefix(fiedsetItem, propPrefix, dataIndex, item.groupData ? key : 0)
          "
              :objectName="fiedsetItem.objectName"
              @addRow="addRow"
              @removeRow="removeRow"
              :fieldList="fiedsetItem"
              :rules="rules"
              :subFormFlag="fiedsetItem.subFormFlag"
              :enableSubNode="fiedsetItem.enableSubNode"
              :primaryKey="primaryKey"
          />
        </template>
      </div>
    </fieldset>

  </template>
</template>

<style scoped lang="scss">
.fieldset-container {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 12px 16px 8px;
  margin: 0;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #c0c4cc;
  }

  &.border-dashed {
    border-style: dashed;
  }

  &.border-none {
    border: none;
    padding: 4px 0;
  }

  &.is-collapsible .fieldset-legend {
    cursor: pointer;
    user-select: none;
  }

  &.is-collapsed {
    padding-bottom: 12px;
  }
}

.fieldset-legend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;

}

.legend-text {
  &.editable {
    cursor: text;
    border-bottom: 1px dashed transparent;

    &:hover {
      border-bottom-color: var(--star-horse-style, #409eff);
    }
  }
}

.legend-arrow {
  transition: transform 0.2s ease;
  color: #909399;

  &.rotated {
    transform: rotate(-90deg);
  }
}

.fieldset-body {
  padding-top: 4px;
}



</style>
