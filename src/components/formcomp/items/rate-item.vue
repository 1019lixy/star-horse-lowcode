<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-rate
        :fid="field.preps['name']"
        :allow-half="field.preps['allowHalf'] == 'Y'"
        :clearable="field.preps['clearable'] == 'Y'"
        :colors="field.preps['colors']"
        :disabled="checkIsDisabled(context)"
        :disabled-void-color="field.preps['disabledVoidColor']"
        :high-threshold="field.preps['highThreshold']"
        :low-threshold="field.preps['lowThreshold']"
        :max="field.preps['max']"
        :score-template="field.preps['scoreTemplate']"
        :show-score="field.preps['showScore'] == 'Y'"
        @change="itemAction"
        :show-text="field.preps['showText'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :text-color="field.preps['textColor']"
        :texts="field.preps['texts']"
        :void-color="field.preps['voidColor']"
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
