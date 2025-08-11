<script setup lang="ts" name="dytable-container">
// 右键菜单组件
import { PropType, ref } from "vue";
import DytableCol from "@/components/formcomp/container/dytable-col.vue";

let containerTableRef = ref(); // 强制刷新表格
defineProps({
  parentField: { type: String },
  isDesign: { type: Boolean, default: false },
  showFormItem: { type: Boolean, default: false },
  disabled: { type: Object as PropType<Boolean | String> },
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
    <table ref="containerTableRef" class="dynamic-table">
      <tbody>
        <tr v-for="(row, rowIndex) in field.preps.elements" class="dy-tr">
          <template v-for="(td, colIndex) in row.columns">
            <dytable-col
              :field="td"
              :formInfo="formInfo"
              v-model:formData="formData"
              :isDesign="isDesign"
              :showFormItem="showFormItem"
              :disabled="disabled"
              :isFirstRow="rowIndex == 0"
              :parentField="field"
              :isLastRow="rowIndex == field.preps.elements.length - 1"
              :isFirstCol="colIndex == 0"
              :isLastCol="colIndex == row.columns.length - 1"
              :rowIndex="rowIndex"
              :colIndex="colIndex"
              class="dy-cell"
            />
          </template>
        </tr>
      </tbody>
    </table>
  </group-container>
</template>
<style lang="scss" scoped>
.dynamic-table {
  width: 100% !important;
  border-collapse: collapse;
}
</style>
