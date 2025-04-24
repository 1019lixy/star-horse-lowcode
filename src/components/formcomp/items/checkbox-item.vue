<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-checkbox-group
        :fid="field.preps['name']"
        :disabled="checkIsDisabled(context)"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'small'"
        @change="itemAction"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <el-checkbox
          :border="item['border'] == 'Y'"
          :checked="item['checked'] == 'Y'"
          :disabled="item['disabled'] == 'Y'"
          :label="item[field.preps['props']?.label || 'name']"
          :value="item[field.preps['props']?.value || 'value']"
          v-for="item in field.preps['values']"
      >
      </el-checkbox>
    </el-checkbox-group>
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
    const itemAction = () => {
      allAction(context, 'change');
    };
    onMounted(() => {
      allAction(context, 'change', true);
    });
    return {parentField, context, field, formItem, dataField, itemAction};
  }
});
</script>
<style scoped></style>
