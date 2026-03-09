<script setup lang="ts" name="box-container">
import {computed, PropType} from "vue";
import GroupContainer from "@/components/formcomp/container/group-container.vue";
import BoxCol from "@/components/formcomp/container/box-col.vue";

const props = defineProps({
  parentField: {type: Object as PropType<any>},
  isDesign: {type: Boolean, default: false},
  showFormItem: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  formInfo: {type: Object as PropType<any>},
  field: {type: Object as PropType<any>},
  compSize: {type: String, default: "default"},
});
const formData = defineModel("formData");
const rowHeight = computed(() => {
  if (props.compSize == "large") {
    return "45px";
  } else if (props.compSize == "small") {
    return "35px";
  } else {
    return "40px";
  }
});
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
        :gutter="field.preps?.gutter || 1"
        :justify="field.preps?.justify || 'start'"
        :align="field.preps?.align || 'top'"
        :tag="field.preps?.tag || 'div'"
        :style="
        {
          width: field.colWidth || '100%',
          height: field.colHeight || rowHeight,
        }
"
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
