<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-transfer
        :fid="field?.preps['name']"
        v-bind="field.preps"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, shallowRef, watch} from 'vue';
import {compDynamicData} from '@/api/star_horse_utils';
import {SelectOption} from '@/components/types/SearchProps';
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

let actionName = shallowRef('normal');
let bakeData = shallowRef<SelectOption[]>([]);
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  props.field.preps['values'] = await compDynamicData(props.field);
  bakeData.value = JSON.parse(JSON.stringify(props.field?.preps['values']??[]));
};

onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  initData();
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
watch(() => formData.value[props.field.fieldName + "OptionList"], (val) => {
  if (val?.length > 0) {
    props.field.preps['values'] = val;
  }
})
</script>
<style scoped></style>
