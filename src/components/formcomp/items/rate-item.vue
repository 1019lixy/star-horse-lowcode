<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-rate
        :fid="field.preps['name']"
        :allow-half="field.preps['allowHalf'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :colors="field.preps['colors']"
        :disabled="checkIsDisabled(props)"
        :disabled-void-color="field.preps['disabledVoidColor']"
        :high-threshold="field.preps['highThreshold']"
        :low-threshold="field.preps['lowThreshold']"
        :max="isNaN(field.preps['max']) ? 5 : field.preps['max']"
        :score-template="field.preps['scoreTemplate']"
        :show-score="field.preps['showScore'] == 'Y'"
        @change="itemAction"
        :show-text="field.preps['showText'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :text-color="field.preps['textColor']"
        :texts="field.preps['texts']"
        :void-color="field.preps['voidColor']"
        v-model="formData[field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

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

const itemAction = () => {
  allAction(props, emits, formData, 'change');
};
onMounted(() => {
  allAction(props, emits, formData, 'change', true);
});
</script>
<style scoped></style>
