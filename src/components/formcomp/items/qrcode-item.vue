<script setup lang="ts">
import type { ImageSettings } from "qrcode.vue";
import QrcodeVue from "qrcode.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import {
  allAction,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const imageSettings = ref<ImageSettings>({ height: 0, src: "", width: 0 });
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const dataValue = ref<string>("");
const createCode = () => {
  if (!dataValue.value) {
    dataValue.value = formData.value[props.field.fieldName];
  }
  if (props.field.preps.src) {
    dataValue.value = props.field.preps.src;
    imageSettings.value = {
      src: props.field.preps?.src,
      width: props.field.preps?.width ?? 30,
      height: props.field.preps?.height ?? 30,
      excavate: true,
    };
  }
};
onMounted(() => {
  nextTick(() => {
    createCode();
    allAction(props, emits, formData, "change", true);
  });
});
watch(
  () => props.field.preps,
  () => {
    createCode();
    allAction(props, emits, formData, "change", false);
  },
  { immediate: false, deep: true },
);
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <qrcode-vue
      :value="dataValue"
      v-bind="prepsFilter(field.preps)"
      :image-settings="imageSettings"
    />
  </starhorse-form-item>
</template>
<style scoped></style>
