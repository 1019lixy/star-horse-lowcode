<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-time-picker
        :fid="field.preps['name']"
        :arrow-control="field.preps['arrowControl'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="checkIsDisabled(context)"
        :disabled-hours="field.preps['disabledHours']"
        :disabled-minutes="field.preps['disabledMinutes']"
        :disabled-seconds="field.preps['disabledSeconds']"
        :editable="field.preps['editable'] == 'Y'"
        :end-placeholder="field.preps['endPlaceholder'] || '请选择结束' + field.preps['label']"
        :format="field.preps['format'] || 'HH:mm:ss'"
        :value-format="field.preps['valueFormat'] || 'HH:mm:ss'"
        :is-range="field.preps['isRange'] == 'Y'"
        :placeholder="field.preps['placeholder'] || '请选择' + field.preps['label']"
        :range-separator="field.preps['rangeSeparator']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'small'"
        :start-placeholder="field.preps['startPlaceholder'] || '请选择开始' + field.preps['label']"
        @change="itemAction('change')"
        @input="itemAction('input')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    />
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
      itemAction,
      actionName
    };
  }
});
</script>
<style lang="scss" scoped>
.el-time-picker,
.el-date-editor {
  width: unset;
}
</style>
