<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <el-checkbox-group
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        :readonly="field.preps?.readonly??false"
        @change="itemAction"
        v-model="formData[field.fieldName]"
    >
      <el-checkbox
          :border="item['border'] ??true"
          :checked="item['checked']"
          :disabled="item['disabled']??false"
          :label="item[field.preps?.props?.label || 'name']"
          :value="item[field.preps?.props?.value || 'value']"
          v-for="item in field.preps?.values"
      />
    </el-checkbox-group>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, watch, PropType} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';
import {compDynamicData} from "@/api/star_horse_utils";

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
    type: Object as PropType<any>,
    required: true
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
const itemAction = () => {
  allAction(props, emits, formData, 'change');
};
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps['values'] = dataa;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {}
  }
  initData();
  allAction(props, emits, formData, 'change', true);
});
watch(() => formData.value[props.field.fieldName + "OptionList"], (val) => {
  if (val?.length > 0) {
    props.field.preps['values'] = val;
  }
},{immediate:true})
</script>
<style scoped></style>
