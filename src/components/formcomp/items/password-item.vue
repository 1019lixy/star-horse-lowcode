<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      type="password"
      v-on="getDynamicEvents(props, itemAction, formData)"
      v-model="formData[field.fieldName]"
    >
      <template #prefix>
        <star-horse-icon
          :icon-class="field.preps?.prefixIcon"
          v-if="field.preps?.prefixIcon"
        />
        <span v-if="field.preps?.prefix">{{ field.preps?.prefix }}</span>
      </template>
      <template #suffix>
        <star-horse-icon
          :icon-class="field.preps?.suffixIcon"
          v-if="field.preps?.suffixIcon"
        />
        <span v-if="field.preps?.suffix">{{ field.preps?.suffix }}</span>
      </template>
      <template #prepend v-if="field.preps?.prependText">
        {{ field.preps?.prependText }}
      </template>
      <template #prepend v-if="prependList?.length > 0">
        <el-select v-model="formData[preName]" style="width: 115px !important">
          <el-option
            v-for="item in prependList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps?.appendText">
        {{ field.preps?.appendText }}
      </template>
      <template #append v-if="field.preps?.appendAction">
        <star-horse-icon
          :title="field.preps?.appendAction?.actionTitle"
          style="cursor: pointer"
          :icon-class="field.preps?.appendAction?.icon || 'document'"
          @click="field.preps?.appendAction?.actions?.(formData)"
        />
      </template>
      <template #append v-if="appendList?.length > 0">
        <el-select v-model="formData[appName]" style="width: 115px !important">
          <el-option
            v-for="item in appendList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted } from "vue";
import {
  allAction,
  checkIsDisabled,
  convertData,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import { StarHorseIcon } from "@/components/comp";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const preName = computed(() => {
  return props.field?.preps.preName ?? "pre" + props.field.fieldName;
});
const appName = computed(() => {
  return props.field?.preps.appName ?? "app" + props.field.fieldName;
});
const appendList = computed(() => convertData(props.field?.preps?.appendList));
const prependList = computed(() =>
  convertData(props.field?.preps?.prependList),
);
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style scoped></style>
