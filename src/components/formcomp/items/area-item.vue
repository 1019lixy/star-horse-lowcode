<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-cascader
        :fid="field.preps['name']"
        :clearable="field.preps['clearable'] == 'Y'"
        :filterable="field.preps['filterable'] == 'Y'"
        :collapse-tags="field.preps['collapseTags'] == 'Y'"
        :collapse-tags-tooltip="field.preps['collapseTagsTooltip'] == 'Y'"
        :disabled="checkIsDisabled(props)"
        :options="areaData"
        :placeholder="'请选择' + field.preps['label']"
        :props="{
        multiple: field.preps['props']?.multiple == 'Y',
        checkStrictly: field.preps['props']?.checkStrictly == 'Y',
        expandTrigger: field.preps['props']?.expandTrigger || 'click',
        label: 'name',
        value: 'code',
        emitPath: field.preps['props']?.emitPath == 'Y'
      }"
        :separator="field.preps['separator']"
        :show-all-levels="field.preps['showAllLevels'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'default'"
        :tag-type="field.preps['tagType']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="formData[field.preps['name']]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, shallowRef} from 'vue';
import {compDynamicData} from '@/api/star_horse_utils';
import areaData from '@/api/pcas-code.json';
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
let actionName = shallowRef('normal');
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  await nextTick();
  props.field.preps['values'] = await compDynamicData(props.field.preps);
  let data: any = formData.value[props.field.preps['name']];
  if (data) {
    formData.value[props.field.preps['name']] = JSON.parse(data);
  } else {
    //解决加载慢问题，导致数据没法回显
    setTimeout(() => {
      let data: any = formData.value[props.field.preps['name']];
      formData.value[props.field.preps['name']] = data ? JSON.parse(data) : [];
    }, 200);
  }
};
onMounted(() => {
  initData();
  actionName.value = props.field.preps?.actionName || 'normal';
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
