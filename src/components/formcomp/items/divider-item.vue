<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-divider
        :direction="field.preps['direction'] || 'horizontal'"
        @change="itemAction('change')"
        :content-position="field.preps['contentPosition'] || 'center'"
    >
      {{ field.preps["content"] }}
    </el-divider>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {allAction} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';

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

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  formData.value[props.field.preps['name']] = props.field.preps['content'];
});
</script>
<style scoped></style>
