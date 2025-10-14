<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input-number
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    >
      <template #prefix>
        <span v-if="field.preps?.prefix">{{ field.preps["prefix"] }}</span>
        <star-horse-icon :icon-class="field.preps?.prefixIcon" v-if="field.preps?.prefixIcon"/>
      </template>
      <template #suffix>
        <span v-if="field.preps?.suffix">{{ field.preps["suffix"] }}</span>
        <star-horse-icon :icon-class="field.preps?.suffixIcon" v-if="field.preps?.suffixIcon"/>
      </template>
    </el-input-number>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

defineOptions({
  name: "NumberItem",
});
import { ItemPreps } from "@/components/types/ItemPreps";
import {StarHorseIcon} from "@/components/comp";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["step"] = props.field.preps["step"] || 1;
  props.field.preps["min"] = props.field.preps["min"] || 0;
  props.field.preps["precision"] = props.field.preps["precision"] || 0;
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });

  initEvent();
});
</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  width: 100% !important;
}
</style>
