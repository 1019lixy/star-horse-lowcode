<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {StarHorseDataSelector} from "@/components/comp";
import {ItemPreps} from "@/components/types/ItemPreps";

defineOptions({
  name: "DataPickerItem",
});

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel<any>("formData");
const pickerData = ref<any>([]);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
onMounted(() => {
});
watch(
    () => formData.value[props.field.fieldName],
    (val) => {
      if (val) {
        // 优化数组转换逻辑
        pickerData.value = props.field.preps?.multiple
            ? Array.isArray(val)
                ? val
                : [val]
            : val !== undefined
                ? [val]
                : [];
      }
    },
    {immediate: true, deep: true},
);
watch(
    () => pickerData.value,
    (val) => {
      if (props.field.preps?.multiple) {
        formData.value[props.field.fieldName] = val;
      } else {
        formData.value[props.field.fieldName] = val[0];
      }
    },
    {deep: true},
);
</script>
<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <!--里面用的el-input-tag -->
    <star-horse-data-selector
        v-model="pickerData"
        v-bind="field.preps"
        @update:selectedData="(data) => itemAction('change')"
        @selectedData="(data) => itemAction('change')"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
