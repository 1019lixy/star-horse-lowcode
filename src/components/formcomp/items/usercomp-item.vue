<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
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
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted,  shallowRef, watch } from "vue";

import { ItemPreps } from "@/components/types/ItemPreps";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

const currentComponent = shallowRef(null);
const loadComponent = async () => {
  let compName = props.field["preps"].compName;
  if (compName) {
    try {
      let comp = await import(`@/components/${compName}.vue`);
      currentComponent.value = comp.default;
    } catch (e) {
      console.log(e.message);
      currentComponent.value = null;
    }
  } else {
    currentComponent.value = props.field?.preps["name"];
  }
};
onMounted(() => {
  loadComponent();
});
watch(
  () => [props.field.preps?.compName, props.field.preps?.name],
  () => {
    loadComponent();
  },
  { immediate: false },
);
</script>
<style scoped></style>
