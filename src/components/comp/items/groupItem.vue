<script setup lang="ts">
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef} from "vue";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";

const props = withDefaults(defineProps<ContainerPreps>(), {
  dataIndex: -1,
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: "default",
  source: 1,
  level: 0,
});

const dataForm: ModelRef<any> = defineModel("dataForm");

// 判断是否应该显示（考虑 formVisible 属性）
const shouldShow = () => {
  if (props.item && props.item.formVisible === false) {
    return false;
  }
  return true;
};
</script>

<template>
  <!-- 根据 formVisible 判断是否显示整个分组 -->
  <div v-if="shouldShow()" class="form-group" :style="{ marginLeft: level * 16 + 'px' }">
    <!-- 非叶子节点显示为标签标题 -->
    <div class="group-label">
      <span class="group-label-text">{{ item.label }}</span>
    </div>
    <!-- 使用 StarHorseFormItem 递归渲染子节点，保持类型判断一致性 -->
    <star-horse-form-item
      :fieldList="{ fieldList: item.children }"
      :level="level + 1"
      :primary-key="primaryKey"
      :rules="rules"
      :batchFieldName="batchFieldName"
      :batchName="batchName"
      :compSize="compSize"
      :compUrl="compUrl"
      :subFormFlag="subFormFlag"
      :source="source"
      :objectName="objectName"
      :dataIndex="dataIndex"
      :propPrefix="propPrefix"
      v-model:dataForm="dataForm"
      :parentPreps="parentPreps"
    />
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
}


</style>
