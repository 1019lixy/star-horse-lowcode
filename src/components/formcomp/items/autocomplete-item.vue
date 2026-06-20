<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-autocomplete
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :fetch-suggestions="querySearch"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction,formData)"
      v-model="normalData"
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
    </el-autocomplete>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue";
import {
  compDynamicData,
  createFilter,
  dynamicUrlOperation,
} from "@/api/star_horse_utils";
import { SearchParams } from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { StarHorseIcon } from "@/components/comp";
import { usePrefixSuffix } from "@/components/formcomp/utils/prefixSuffixUtils";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const {
  preName,
  appName,
  prependList,
  appendList,
  normalData,
  mergeData,
  setupWatchers,
} = usePrefixSuffix({
  field: props.field,
  formData: formData as any,
});
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
/**
 * 动态获取数据
 */
const initData = async () => {
  const data = await compDynamicData(props.field);
  if (data?.length) {
    props.field.preps["values"] = data;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
    mergeData(true);
  });
});
setupWatchers();
const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  let temp = props.field.preps;
  let dataSource = temp["dataSource"];
  if (dataSource == "url") {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp["selectLabel"],
      value: queryString,
      operation: "lk",
    });
    temp["values"] = await dynamicUrlOperation(temp, searchParams);
    cb(temp["values"]);
  } else {
    const results = queryString
      ? temp["values"]?.filter(createFilter(queryString))
      : temp["values"];
    cb(results??[]);
  }
};
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["data"] = val;
    }
  },
  { immediate: true },
);
</script>
<style scoped></style>
