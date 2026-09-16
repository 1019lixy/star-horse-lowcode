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
      v-on="getDynamicEvents(props, itemAction, formData)"
      v-model="formData[field.fieldName]"
    >
      <el-radio-button
        v-if="field.preps?.radioType == 'button'"
        :border="item['border'] ?? true"
        :checked="item['checked']"
        :disabled="item['disabled'] || source == 3"
        :label="item['name']"
        :value="item['value']"
        @dblclick.stop="cancelChecked"
        v-for="item in ruleOptions"
      />
      <el-radio
        v-else
        :border="item['border'] ?? false"
        :checked="item['checked']"
        :disabled="item['disabled'] || source == 3"
        :label="item['name']"
        :value="item['value']"
        @dblclick.stop="cancelChecked"
        v-for="item in ruleOptions"
      >
      </el-radio>
    </el-radio-group>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { compDynamicData } from "@/api/star_horse_utils";
import { getDynamicEvents } from "@/api/system";
import { getOptionsOverride } from "@/components/formcomp/utils/ItemRuleEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const ruleOptions = computed(() => {
  const formId =
    props.field.preps?.ruleEngineConfig?.formId || props.field.preps?.formId;
  if (formId) {
    const override = getOptionsOverride(formId, props.field.fieldName);
    if (override) return override;
  }
  return props.field.preps?.values || [];
});
const cancelChecked = () => {
  const preps = props.field.preps;
  if (!preps?.readonly && !preps?.disabled) {
    formData.value[props.field.fieldName] = null;
  }
};
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
</script>
<style scoped></style>
