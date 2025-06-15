<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-slider
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        :step="field.preps?.step??1"
        @change="itemAction"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {ModelRef, onMounted} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';

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
const formData: ModelRef<any> = defineModel("formData");
const itemAction = () => {
  allAction(props, emits, formData, 'change');
};
onMounted(() => {
  allAction(props, emits, formData, 'change', true);
});

</script>
<style scoped></style>
