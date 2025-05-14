<script setup lang="ts">
import bwipjs from 'bwip-js';
import { onMounted, nextTick, ref, computed, watch } from "vue";
import { allAction } from '../utils/ItemRelationEventUtils';
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
const barcodeRef = ref();
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
const dataValue = computed(() => formData.value[props.field.preps.name]);
const createCode = () => {
  const preps = props.field.preps;
  bwipjs.toCanvas(barcodeRef.value, {
    bcid: preps?.bcid ?? 'code128',
    text: dataValue.value ?? "none",
    scale: preps?.scale ?? 3,
    height: preps?.height ?? 10,
    includetext: preps?.includeText ? preps.includeText == 'Y' : true,
    textxalign: preps?.textxAlign ?? 'center',
  });
}
onMounted(() => {
  nextTick(() => {
    createCode();
    allAction(props, emits, formData, "change", true);
  })
});
watch(() => [dataValue.value,props.field.preps],
  () => {
    createCode(),
      allAction(props, emits, formData, "change", false);
  }, { immediate: false, deep: true });
</script>
<template>
  <starhorse-form-item :isDesign="isDesign" :disabled="disabled" :bareFlag="bareFlag" :formItem="field"
    :parentField="parentField">
    <canvas ref="barcodeRef" />
  </starhorse-form-item>
</template>
<style scoped></style>
