<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-time-select
      v-if="!isSeparate"
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :start="field.preps?.start || '00:00'"
      :end="field.preps?.end || '24:00'"
      :step="field.preps?.step || '00:05'"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction, formData)"
      @change="itemAction('change')"
      v-model="formData[field.fieldName]"
    />

    <template v-else>
      <el-input
        :model-value="displayText"
        :placeholder="field.preps?.placeholder"
        :disabled="checkIsDisabled(props)"
        readonly
        @click="openPicker"
      >
        <template #suffix>
          <star-horse-icon icon-class="time" />
        </template>
      </el-input>

      <ShMobilePicker
        v-model="pickerVisible"
        :title="title"
        :placement="placement"
        :size="size"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <ShMobileWheelPicker
          ref="wheelPickerRef"
          :model-value="formData[field.fieldName]"
          :type="isRange ? 'timerange' : 'time'"
          :value-format="wheelValueFormat"
          :show-second="showSecond"
        />
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { allAction, checkIsDisabled, initCompCallEvent, prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { ItemPreps } from "@/components/types/ItemPreps";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import ShMobileWheelPicker from "@/components/formcomp/utils/ShMobileWheelPicker.vue";
import { i18n } from "@/lang";

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
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

const isRange = computed(() => {
  const t = props.field.preps?.type || props.field.type;
  return t === "timerange" || props.field.preps?.isRange;
});

const showSecond = computed(() => {
  const fmt = props.field.preps?.format || props.field.preps?.valueFormat || "HH:mm";
  return fmt.includes("ss");
});

const wheelValueFormat = computed(() => {
  const fmt = props.field.preps?.valueFormat || props.field.preps?.format || "HH:mm";
  return fmt.includes("ss") ? "HH:mm:ss" : "HH:mm";
});

const wheelPickerRef = ref<any>(null);

const displayText = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") return "";
  if (Array.isArray(val)) return val.join(" ~ ");
  return String(val);
});

const handleConfirm = () => {
  const val = wheelPickerRef.value?.getFormattedValue?.();
  if (val !== undefined) formData.value[props.field.fieldName] = val;
  itemAction("change");
  closePicker();
};

const handleCancel = () => {
  closePicker();
};

const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};

function normalizeTimeSelectValue(val: any): any {
  if (!val || typeof val !== "string") return val;
  if (/^\d{1,2}:\d{2}$/.test(val)) return val;
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(val)) return val.substring(0, 5);
  const tzMatch = val.match(/^\d{4}-\d{2}-\d{2}\s+(\d{1,2}):(\d{2})/);
  if (tzMatch) {
    return tzMatch[1] + ":" + tzMatch[2];
  }
  const isoMatch = val.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    return isoMatch[1] + ":" + isoMatch[2];
  }
  return val;
}

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});

const closeWatch = ref<() => void>();
closeWatch.value = watch(
  () => formData.value?.[props.field.fieldName],
  (val) => {
    if (props.source == 1) {
      closeWatch.value?.();
      return;
    }
    if (val != null && val !== "") {
      const name = props.field.fieldName;
      const normalized = normalizeTimeSelectValue(val);
      if (normalized !== val) {
        formData.value[name] = normalized;
        closeWatch.value?.();
      }
    }
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
</style>
