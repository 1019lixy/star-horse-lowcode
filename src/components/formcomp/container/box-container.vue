<script setup lang="ts" name="box-container">
import { PropType } from "vue";
import GroupContainer from "@/components/formcomp/container/group-container.vue";
import BoxCol from "@/components/formcomp/container/box-col.vue";

defineProps({
  parentField: { type: Object },
  isDesign: { type: Boolean, default: false },
  showFormItem: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  formInfo: { type: Object as PropType<any> },
  field: { type: Object as PropType<any> },
});
const formData = defineModel("formData");
</script>
<template>
  <group-container
    class="star-horse-form-container"
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :parentField="parentField"
    :form-item="field"
  >
    <el-row
      v-for="(element, rowIndex) in field.preps.elements"
      :gutter="field.preps?.gutter || 10"
      :justify="field.preps?.justify || 'start'"
      :align="field.preps?.align || 'top'"
      :tag="field.preps?.tag || 'div'"
    >
      <template v-for="(col, colIndex) in element.columns">
        <box-col
          :field="col"
          :formInfo="formInfo"
          v-model:formData="formData"
          :isDesign="isDesign"
          :showFormItem="showFormItem"
          :disabled="disabled"
          :isFirstRow="rowIndex == 0"
          :parentField="field"
          :isLastRow="rowIndex == field.preps.elements.length - 1"
          :isFirstCol="colIndex == 0"
          :isLastCol="colIndex == element.columns.length - 1"
          :rowIndex="rowIndex"
          :colIndex="colIndex"
        />
      </template>
    </el-row>
  </group-container>
</template>
<style lang="scss" scoped></style>
