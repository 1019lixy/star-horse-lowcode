<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-checkbox-group
        :fid="field.preps['name']"
        :disabled="checkIsDisabled(props)"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="formInfo?.size || field?.preps['size'] || 'small'"
        @change="itemAction"
        v-model="formData[field.preps['name']]"
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
<script setup lang="ts">
import {onMounted} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';

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
const itemAction = () => {
  allAction(props, emits, formData, 'change');
};
onMounted(() => {
  allAction(props, emits, formData, 'change', true);
});

</script>
<style scoped></style>
