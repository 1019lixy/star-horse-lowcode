<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-descriptions
      v-bind="prepsFilter(field.preps)"
      :column="field.preps?.column || 2"
      :border="field.preps?.border ?? true"
      :direction="field.preps?.direction"
      :size="field.preps?.size || 'default'"
    >
      <el-descriptions-item
        v-for="item in descItems"
        :key="item.label"
        :label="item.label"
        :span="item.span || 1"
      >
        {{ item.value }}
      </el-descriptions-item>
    </el-descriptions>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  allAction,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { computed } from "vue";

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

const descItems = computed(() => {
  const items = props.field.preps?.descItems;
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item: any) => ({
      label: item.label || "",
      value: formData.value?.[item.fieldName] ?? item.value ?? "",
      span: item.span || 1,
    }));
  }
  // 默认：将当前字段值作为唯一描述项
  return [
    {
      label: props.field.label || "",
      value: formData.value?.[props.field.fieldName] ?? "",
      span: 1,
    },
  ];
});
</script>
<style lang="scss" scoped></style>
