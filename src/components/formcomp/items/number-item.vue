<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input-number
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="field.preps"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.fieldName]"
    >
      <template #prefix>
        <span v-if="field.preps?.prefix">{{ field.preps["prefix"] }}</span>
      </template>
      <template #suffix>
        <span v-if="field.preps?.suffix">{{ field.preps["suffix"] }}</span>
      </template>
    </el-input-number>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, shallowRef, PropType} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';

defineOptions({
  name: 'NumberItem'
})
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
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
let actionName = shallowRef('normal');
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  props.field.preps['step'] = props.field.preps['step'] || 1;
  props.field.preps['min'] = props.field.preps['min'] || 0;
  props.field.preps['precision'] = props.field.preps['precision'] || 0;
  actionName.value = props.field.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }

  initEvent();
});

</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  width: 100% !important;
}
</style>
