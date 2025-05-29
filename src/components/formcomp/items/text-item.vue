<script setup lang="ts">
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
const formData = defineModel<any>("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

</script>
<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="cell-header" @click="itemAction('click')">
      <div :style="{
        display: 'flex',
        verticalAlign: field.preps['verticalAlign']??'middle',
        justifyContent: field.preps['justifyContent']??'left',
        alignItems: field.preps['alignItems']??'left',
        wordBreak: field.preps['wordBreak']??'normal',
        width: field.preps['width']??'100%',
        height:  field.preps['height']??'100%',
        fontWeight: field.preps['fontWeight']??'600',
        color: field.preps['color']??'inherit',
        backgroundColor: field.preps['backgroundColor']??'none',
        borderRadius: field.preps['fontWeight']??'none',
        border: field.preps['border']??'none',
        margin:' 0 5px'
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
