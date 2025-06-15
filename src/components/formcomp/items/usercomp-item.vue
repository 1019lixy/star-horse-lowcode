<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <component
        :is="currentComponent"
        :isDesign="isDesign"
        :disabled="disabled"
        :bareFlag="bareFlag"
        v-bind="field['preps']"
        v-model:dataForm="formData"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef, watch, PropType} from 'vue';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object as PropType<any>,
    required: true
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");

const currentComponent = shallowRef(null);
const loadComponent = async () => {
  let compName = props.field['preps'].compName;
  if (compName) {
    try {
      let comp = await import(`@/components/${compName}.vue`);
      currentComponent.value = comp.default;
    } catch (e) {
      console.log(e.message);
      currentComponent.value = null;
    }
  } else {
    currentComponent.value = props.field?.preps['name'];
  }
};
onMounted(() => {
  loadComponent();
});
watch(() => [props.field.preps?.compName, props.field.preps?.name],
    () => {
      loadComponent();
    }, {immediate: false});
</script>
<style scoped></style>
