<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-transfer
      :fid="field?.preps['name']"
      v-bind="prepsFilter(field.preps)"
      :props="field?.preps.props ?? { key: 'value', label: 'name' }"
      v-on="getDynamicEvents(props, itemAction,formData)"
      v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, shallowRef, watch } from "vue";
import { compDynamicData } from "@/api/star_horse_utils";
import { SelectOption } from "@/components/types/SearchProps";
import {
  allAction,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
let bakeData = shallowRef<SelectOption[]>([]);
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["data"] = dataa;
  }
  bakeData.value = JSON.parse(JSON.stringify(props.field?.preps["data"] ?? []));
};

onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["data"] = val;
    }
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss" scoped></style>
