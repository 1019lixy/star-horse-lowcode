<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { compDynamicData } from "@/api/star_horse_utils";
import { SelectOption } from "@/components/types/SearchProps";
import {
  allAction,
  initCompCallEvent,
  prepsFilter,
  relationEventDispatcher,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { isMobile } from "@/api/device";
import { StarHorseDataSelector } from "@/components/comp";
import { getOptionsOverride } from "@/components/formcomp/utils/ItemRuleEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
let bakeData = shallowRef<SelectOption[]>([]);
const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};
const transferProps = computed(
  () => props.field?.preps?.props ?? { key: "value", label: "name" },
);
const ruleData = computed(() => {
  const formId =
    props.field.preps?.ruleEngineConfig?.formId || props.field.preps?.formId;
  if (formId) {
    const override = getOptionsOverride(formId, props.field.fieldName);
    if (override) return override;
  }
  return props.field.preps?.data || [];
});
// StarHorseDataSelector 的 v-model（key[]，与 transfer 的 v-model 格式一致）
const pickerData = ref<any>(
  Array.isArray(formData.value?.[props.field.fieldName])
    ? formData.value?.[props.field.fieldName]
    : formData.value?.[props.field.fieldName]
      ? [formData.value?.[props.field.fieldName]]
      : [],
);
// pickerData 变化 → 同步回 formData
watch(
  pickerData,
  (val) => {
    formData.value[props.field.fieldName] = val;
  },
  { deep: true },
);
// formData 外部变化 → 同步到 pickerData（如 reset）
watch(
  () => formData.value?.[props.field.fieldName],
  (val) => {
    const cur = Array.isArray(val) ? val : val != null ? [val] : [];
    if (JSON.stringify(cur) !== JSON.stringify(pickerData.value)) {
      pickerData.value = cur;
    }
  },
  { deep: true },
);
// 选择变化回调
const onSelectChange = () => {
  itemAction("change");
  // App 端 StarHorseDataSelector 选择不经过 el-transfer 的 v-on(getDynamicEvents),
  // 需手动触发 dataRelation 联动(PC 端通过 getDynamicEvents 绑定的 change 事件触发)
  const dataRelation = props.field.preps?.dataRelation;
  if (dataRelation?.actionName) {
    relationEventDispatcher(
      props,
      dataRelation,
      pickerData.value,
      formData,
      dataRelation.actionName,
    );
  }
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
    <!-- PC 端：保留原生 el-transfer -->
    <el-transfer
        v-if="!isMobile && source != 3"
        :fid="field?.preps['name']"
        v-bind="prepsFilter(field.preps)"
        :data="ruleData"
        :props="transferProps"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="formData[field.fieldName]"
    />
    <!-- APP 端：直接复用 StarHorseDataSelector -->
    <StarHorseDataSelector
        v-else
        v-model="pickerData"
        :data="ruleData"
        :multiple="true"
        :display-name="transferProps.label"
        :display-value="transferProps.key"
        :title="field.label"
        :disabled="disabled||source == 3"
        :allow-create="!!field.preps?.allowCreate"
        @update:selectedData="onSelectChange"
        @change="onSelectChange"
    />
  </starhorse-form-item>
</template>
<style lang="scss" scoped></style>
