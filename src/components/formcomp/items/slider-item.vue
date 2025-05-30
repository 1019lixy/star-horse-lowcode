<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-slider
        :fid="field.preps['name']"
        :disabled="checkIsDisabled(props)"
        :format-tooltip="field.preps['formatTooltip'] == 'Y'"
        :format-value-text="field.preps['formatValueText']"
        :height="field.preps['height']"
        :input-size="field.preps['inputSize']"
        :aria-label="field.preps['label']"
        :marks="field.preps['marks']"
        :max="isNaN(field.preps['max'])?100:field.preps['max']"
        :min="isNaN(field.preps['min'])?0:field.preps['min']"
        :range="field.preps['range'] == 'Y'"
        :range-end-label="field.preps['rangeEndLabel']"
        :range-start-label="field.preps['rangeStartLabel']"
        :show-input="field.preps['showInput'] == 'Y'"
        :show-input-controls="field.preps['showInputControls'] == 'Y'"
        :show-stops="field.preps['showStops'] == 'Y'"
        :show-tooltip="field.preps['showTooltip'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :step="isNaN(field.preps['step'])?1:field.preps['step']"
        @change="itemAction"
        v-model="formData[props.field.preps['name']]"
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
