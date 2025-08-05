<script setup lang="ts">
import {PropType} from "vue";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {StarHorseDataSelector} from "@/components/comp";

defineOptions({
  name: "DataPickerItem",
})
const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel<any>("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
</script>
<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <star-horse-data-selector v-model="formData[field.fieldName]"
                              v-bind="field.preps"
                              @selectedData="(data)=>itemAction('change')"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
