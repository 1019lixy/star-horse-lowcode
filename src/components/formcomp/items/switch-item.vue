<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-switch
        :fid="field.preps['name']"
        :active-color="field.preps['activeColor']"
        :active-text="field.preps['activeText']"
        :active-value="field.preps['activeValue']"
        :before-change="field.preps['beforeChange']"
        :disabled="checkIsDisabled(props)"
        :inactive-color="field.preps['inactiveColor']"
        :inactive-text="field.preps['inactiveText']"
        :inactive-value="field.preps['inactiveValue']"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :width="field.preps['width']"
        @change="itemAction('change')"
        v-model="formData[field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
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
const formData = defineModel("formData");

let actionName = shallowRef('change');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, false);
  }
});
</script>
<style scoped></style>
