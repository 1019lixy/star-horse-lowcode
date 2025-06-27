<script setup lang="ts">
import type {ImageSettings} from 'qrcode.vue';
import QrcodeVue from 'qrcode.vue';
import {computed, nextTick, onMounted, ref, watch,PropType} from "vue";
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils';

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
const imageSettings = ref<ImageSettings>({height: 0, src: "", width: 0});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
const dataValue = computed(() => formData.value[props.field.fieldName]);
const createCode = () => {
  if (props.field.preps.src) {
    imageSettings.value = {
      src: props.field.preps?.src,
      width: props.field.preps?.width ?? 30,
      height: props.field.preps?.height ?? 30,
      excavate: true,
    };
  }
}
onMounted(() => {
  nextTick(() => {
    createCode();
    allAction(props, emits, formData, "change", true);
  });
});
watch(() => [dataValue.value, props.field.preps],
    () => {
      createCode();
      allAction(props, emits, formData, "change", false);
    }, {immediate: false, deep: true});
</script>
<template>
  <starhorse-form-item :isDesign="isDesign" :disabled="disabled" :bareFlag="bareFlag" :formItem="field"
                       :parentField="parentField">
    <qrcode-vue
        :value="dataValue"
        v-bind="field.preps"
        :image-settings='imageSettings'
    />
  </starhorse-form-item>
</template>
<style scoped></style>
