<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <component
      :is="currentComponent"
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      v-bind="field['preps']"
      v-model:dataForm="formData"
      :source="source"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
  source: 0,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
// const subDataInfo = ref<any>({});
const currentComponent = computed(() => props.field["preps"].compName);
/* const dataSource = computed(() => {
  let subFormFlag = props.field?.preps?.subFormFlag;
  if (subFormFlag) {
    if (props.source == 2) {
      const stop = watch(() => formData.value[props.field.fieldName], (newVal) => {
        if (newVal) {
          subDataInfo.value = formData.value[props.field.fieldName];
          stop();
        }
      }, { immediate: true, deep: true });
    } else if (props.source == 1) {
      formData.value[props.field.fieldName] = subDataInfo.value;
    }
  } else {
    subDataInfo.value = formData.value;
  }
  return props.source
}); */
const loadComponent = async () => {};
onMounted(() => {
  loadComponent();
});
</script>
<style scoped></style>
