<script lang="ts">
import {defineComponent, shallowRef} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];
    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const tagType = (val: any) => {
      let tagMap = field?.preps?.tagMap;
      if (tagMap && Object.keys(tagMap).length > 0) {
        return tagMap[val] || 'primary';
      }
      return field?.preps?.tagType || 'primary';
    };
    return {parentField, context, field, formItem, dataField, itemAction, tagType};
  }
});
</script>
<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="cell-header" @click="itemAction('click')">
      <div :style="{
        display: 'flex',
        verticalAlign: field.preps['verticalAlign']??'middle',
        justifyContent: field.preps['justifyContent']??'center',
        alignItems: field.preps['alignItems']??'center',
        wordBreak: field.preps['wordBreak']??'normal',
        width: field.preps['width']??'100%',
        height:  field.preps['height']??'100%',
        fontWeight: field.preps['fontWeight']??'600',
        color: field.preps['color']??'inherit',
        backgroundColor: field.preps['backgroundColor']??'none',
        borderRadius: field.preps['fontWeight']??'none',
        border: field.preps['border']??'none'
      }">{{ field.preps["textContent"] || field.preps["placeholder"] }}
      </div>
    </div>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.cell-header {
  width: 100%;
  height: 100%;
}
</style>
