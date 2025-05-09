<script setup lang="ts">
import QRCode from "qrcode.vue-next";

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
</script>
<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <QRCode
        :value="formData[field.preps['name']]"
        :size="field.preps.size??160"
        :bgColor="field.preps.bgColor??'#fff'"
        :color="field.preps.color??'#000'"
        :level="field.preps.level??'M'"
        :type="field.preps.type??'svg'"
        :icon="field.preps.icon"
        :iconSize="field.preps.iconSize"
        :iconSettings="field.preps.iconSettings??undefined"
        :imageSettings="field.preps.imageSettings??undefined"
        :status="field.preps.status??'active'"
        :bordered="true"
        style="margin: 5px"
        @change="() => console.log('change')"
        @refresh="() => console.log('refresh')"
    />
  </starhorse-form-item>
</template>
<style scoped></style>
