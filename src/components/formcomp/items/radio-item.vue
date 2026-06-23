<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-radio-group
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        :readonly="field.preps?.readonly ?? false"
        :text-color="field.preps?.textColor"
        v-on="getDynamicEvents(props, itemAction,formData)"
        v-model="formData[field.fieldName]"
    >
      <el-radio-button
          v-if="field.preps?.radioType == 'button'"
          :border="item['border'] ?? true"
          :checked="item['checked']"
          :disabled="item['disabled']||source==3"
          :label="item['name']"
          :value="item['value']"
          v-for="item in field.preps?.values"
      />
      <el-radio
          v-else
          :border="item['border'] ?? false"
          :checked="item['checked']"
          :disabled="item['disabled']||source==3"
          :label="item['name']"
          :value="item['value']"
          v-for="item in field.preps?.values"
      >
      </el-radio>
    </el-radio-group>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onMounted, watch} from "vue";
import {allAction, checkIsDisabled, initCompCallEvent,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {compDynamicData} from "@/api/star_horse_utils";
import {getDynamicEvents} from "@/api/system";

import {ItemPreps} from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

const itemAction = () => {
  allAction(props, emits, formData, "change");
};
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["values"] = dataa;
  }
};
onMounted(async () => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  await initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
watch(
    () => formData.value[props.field.fieldName + "OptionList"],
    (val) => {
      if (val?.length > 0) {
        props.field.preps["values"] = val;
      }
    },
    {
      immediate: true,
    },
);
</script>
<style scoped></style>
