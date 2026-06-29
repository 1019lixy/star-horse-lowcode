<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-tree-select
      v-model="formData[field.fieldName]"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :data="orgTreeData"
      :multiple="field.preps?.multiple"
      :check-strictly="field.preps?.checkStrictly ?? true"
      :render-after-expand="false"
      :placeholder="field.preps?.placeholder || i18n('api.pleaseSelectData2')"
      :filterable="field.preps?.filterable ?? true"
      :clearable="field.preps?.clearable ?? true"
      :props="orgTreeProps"
      @change="itemAction('change')"
    />
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { computed, onMounted, ref, watch } from "vue";
import { dynamicUrlOperation } from "@/api/star_horse_utils";

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

const orgTreeData = ref<any[]>([]);
const orgTreeProps = computed(() => ({
  label: props.field.preps?.props?.label || "name",
  value: props.field.preps?.props?.value || "id",
  children: props.field.preps?.props?.children || "children",
}));

const loadOrgData = async () => {
  const url = props.field.preps?.url;
  if (!url) {
    orgTreeData.value =
      props.field.preps?.values || props.field.preps?.data || [];
    return;
  }
  try {
    const res = await dynamicUrlOperation({ preps: { url } });
    orgTreeData.value = res?.data || res || [];
  } catch (e) {
    console.error("[org-item] load org data failed", e);
    orgTreeData.value = props.field.preps?.values || [];
  }
};

onMounted(() => {
  loadOrgData();
  initCompCallEvent(props, emits, formData);
});

watch(
  () => props.field.preps?.values,
  (val) => {
    if (val && !props.field.preps?.url) {
      orgTreeData.value = val;
    }
  },
  { deep: true },
);
</script>
<style lang="scss" scoped></style>
