<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-input-number
        :fid="field.preps['name']"
        :controls-position="field.preps['controlsPosition'] || ''"
        :controls="field.preps['controls'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :max="field.preps['max'] || Infinity"
        :min="field.preps['min'] || -Infinity"
        :clearable="field.preps['clearable'] == 'Y'"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :precision="field.preps['precision']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :step="field.preps['step']"
        :step-strictly="field.preps['stepStrictly'] == 'Y'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    >
      <template #prefix>
        <span v-if="field.preps['prefix']">{{ field.preps["prefix"] }}</span>
      </template>
      <template #suffix>
        <span v-if="field.preps['suffix']">{{ field.preps["suffix"] }}</span>
      </template>
    </el-input-number>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

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
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
  initEvent();
});

</script>
<style lang="scss" scoped>
:deep(.el-input-number--small) {
  width: 100% !important;
}
</style>
