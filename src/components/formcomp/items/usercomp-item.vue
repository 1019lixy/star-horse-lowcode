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
        :nodeFieldList="field['preps'].params?.nodeFieldList"
        :lineFieldList="field['preps'].params?.lineFieldList"
        :customerItems="field['preps'].params?.nodeList"
        :readonly="field['preps']['readonly'] == 'Y'"
        v-bind="field['preps']"
        v-model:dataForm="formData"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef, watch} from 'vue';

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
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
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
