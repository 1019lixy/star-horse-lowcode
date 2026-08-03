<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-time-picker
      v-if="!isSeparate"
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :is-range="isRange"
      :range-separator="field.preps?.rangeSeparator || i18n('api.to')"
      :format="field.preps?.format || 'HH:mm:ss'"
      :value-format="field.preps?.valueFormat || 'HH:mm:ss'"
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
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { allAction, checkIsDisabled, initCompCallEvent, prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { i18n } from "@/lang";
import { ItemPreps } from "@/components/types/ItemPreps";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import ShMobileWheelPicker from "@/components/formcomp/utils/ShMobileWheelPicker.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

const isRange = computed(() => {
  if (props.field.preps?.isRange) return true;
  const subType = props.field.preps?.type || props.field.type;
  return subType === "timerange";
});

const showSecond = computed(() => {
  const fmt = props.field.preps?.format || props.field.preps?.valueFormat || "HH:mm:ss";
  return fmt.includes("ss");
});

const wheelValueFormat = computed(() => {
  return props.field.preps?.valueFormat || "HH:mm:ss";
});

const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

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

function normalizeTimePickerValue(val: any): any {
  if (!val || val === "undefined" || val === "-") return val;
  const vf = wheelValueFormat.value;
  if (Array.isArray(val)) {
    return val.map((v: any) => normalizeTimePickerSingle(v, vf));
  }
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((v: any) => normalizeTimePickerSingle(v, vf));
      }
    } catch {
      /* not JSON */
    }
  }
  return normalizeTimePickerSingle(val, vf);
}

function normalizeTimePickerSingle(val: any, vf: string): any {
  if (!val || val === "undefined" || val === "-") return val;
  if (typeof val !== "string") return val;
  if (vf === "HH:mm:ss" && /^\d{1,2}:\d{2}:\d{2}$/.test(val)) return val;
  if (vf === "HH:mm" && /^\d{1,2}:\d{2}$/.test(val)) return val;
  if (vf === "HH:mm" && /^\d{1,2}:\d{2}:\d{2}$/.test(val))
    return val.substring(0, 5);
  const tzMatch = val.match(
    /^\d{4}-\d{2}-\d{2}\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/,
  );
  if (tzMatch) {
    const h = tzMatch[1];
    const m = tzMatch[2];
    const s = tzMatch[3] || "00";
    if (vf === "HH:mm") return h + ":" + m;
    return h + ":" + m + ":" + s;
  }
  const isoMatch = val.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );
  if (isoMatch) {
    const h = isoMatch[4];
    const m = isoMatch[5];
    const s = isoMatch[6];
    if (vf === "HH:mm") return h + ":" + m;
    return h + ":" + m + ":" + s;
  }
  return val;
}

const itemAction = (prep: string) => {
  allAction(props, emits, formData, prep);
};

onBeforeMount(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
});

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
      const normalized = normalizeTimePickerValue(val);
      if (Array.isArray(normalized)) {
        if (!Array.isArray(val) || normalized.length !== val.length || normalized.some((v: any, i: number) => v !== val[i])) {
          formData.value[name] = normalized;
          closeWatch.value?.();
        }
      } else if (normalized !== val) {
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
