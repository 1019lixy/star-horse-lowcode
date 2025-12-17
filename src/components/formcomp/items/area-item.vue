<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-cascader
        :fid="field.fieldName"
        v-bind="prepsFilter(field.preps)"
        :options="field.preps?.options??areaData"
        :disabled="checkIsDisabled(props)"
        v-on="getDynamicEvents(props, itemAction)"
        v-model="formData[field.fieldName]"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import areaData from "@/api/pcas-code.json";
import {compDynamicData} from "@/api/star_horse_utils";
import {getDynamicEvents} from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {nextTick, onMounted, watch} from "vue";
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
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  if (props.field.preps.user) {
    const data = await compDynamicData(props.field);
    if (data?.length) {
      props.field.preps["options"] = data;
    }
  } else {
    props.field.preps["props"] = {
      label: "name",
      value: "code",
    };
  }
  await nextTick();
  let data: any = formData.value[props.field.fieldName];
  if (data) {
    formData.value[props.field.fieldName] = JSON.parse(data);
  } else {
    //解决加载慢问题，导致数据没法回显
    setTimeout(() => {
      let data: any = formData.value[props.field.fieldName];
      formData.value[props.field.fieldName] = data ? JSON.parse(data) : [];
    }, 200);
  }
};
onMounted(() => {
  initData();
  initCompCallEvent(props, emits, formData);
});
watch(
    () => formData.value[props.field.fieldName + "OptionList"],
    (val) => {
      if (val?.length > 0) {
        props.field.preps["options"] = val;
      }
    },
    {
      immediate: true,
    },
);
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
