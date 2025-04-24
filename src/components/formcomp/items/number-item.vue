<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-input-number
        :fid="field.preps['name']"
        :controls-position="field.preps['controlsPosition'] || ''"
        :controls="field.preps['controls'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :max="field.preps['max'] || Infinity"
        :min="field.preps['min'] || -Infinity"
        :clearable="field.preps['clearable'] == 'Y'"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :precision="field.preps['precision']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :step="field.preps['step']"
        :step-strictly="field.preps['stepStrictly'] == 'Y'"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
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
<script lang="ts">
import {defineComponent, onMounted, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];

    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    let actionName = shallowRef('normal');
    const itemAction = (prep: string) => {
      allAction(context, prep);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      actionName,
      itemAction
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-input-number--small) {
  width: 100% !important;
}
</style>
