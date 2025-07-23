<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-divider
      :direction="field.preps?.direction || 'horizontal'"
      v-on="getDynamicEvents(props, itemAction)"
      :content-position="field.preps?.contentPosition || 'center'"
    >
      {{ field.preps?.content }}
    </el-divider>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, PropType} from "vue";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";

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
const formData = defineModel("formData");

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  formData.value[props.field.fieldName] = props.field.preps?.content;
});
</script>
<style scoped></style>
