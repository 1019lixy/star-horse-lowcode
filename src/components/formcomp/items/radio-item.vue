<template>
  <starhorse-form-item :isDesign="isDesign" :disabled="disabled" :bareFlag="bareFlag" :formItem="field"
    :parentField="parentField">
    <el-radio-group :fid="field.fieldName" :disabled="checkIsDisabled(props)" :readonly="field.preps?.readonly ?? false"
      :text-color="field.preps?.textColor" v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]">
      <el-radio-button v-if="field.preps?.radioType == 'button'" :border="item['border'] ?? true"
        :checked="item['checked']" :disabled="item['disabled'] ?? false" :label="item['name']" :value="item['value']"
        v-for="item in field.preps?.values" />
      <el-radio v-else :border="item['border'] ?? false" :checked="item['checked']"
        :disabled="item['disabled'] ?? false" :label="item['name']" :value="item['value']"
        v-for="item in field.preps?.values">
      </el-radio>
    </el-radio-group>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { onMounted, PropType, watch } from 'vue';
import { allAction, checkIsDisabled } from '@/components/formcomp/utils/ItemRelationEventUtils';
import { compDynamicData } from "@/api/star_horse_utils";
import { getDynamicEvents } from '@/api/system';
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
}, {
  immediate: true
})
</script>
<style scoped></style>
