<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-date-picker
      v-if="!isSeparate"
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :type="effectiveType"
      :format="field.preps?.format || displayFormat"
      :value-format="field.preps?.valueFormat || valueFormat"
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
          <star-horse-icon icon-class="date" />
        </template>
      </el-input>

      <ShMobilePicker
        v-if="isSeparate && pickerVisible"
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
          :type="wheelType"
          :value-format="wheelValueFormat"
          :min-year="minYear"
          :max-year="maxYear"
        />
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
  relationEventDispatcher,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { ItemPreps } from "@/components/types/ItemPreps";
import {
  getDateDisplayFormat,
  getDateValueFormat,
  normalizeDateModel,
} from "@/api/date_utils";
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
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const disabledDate = shallowRef<any>([]);

const effectiveType = computed(() => {
  return props.field.preps?.type || props.field.type || "datetime";
});

const valueFormat = computed(() => getDateValueFormat(effectiveType.value));
const displayFormat = computed(() => getDateDisplayFormat(effectiveType.value));

const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

/* 滚轮类型映射：根据 effectiveType 精确映射，避免 year/month/week 显示为 datetime */
const wheelType = computed(() => {
  const t = effectiveType.value;
  switch (t) {
    case "year":
      return "year";
    case "month":
      return "month";
    case "week":
    case "date":
      return "date";
    case "daterange":
      return "daterange";
    case "monthrange":
      return "monthrange";
    case "yearrange":
      return "yearrange";
    case "datetimerange":
      return "datetimerange";
    case "datetime":
    default:
      return "datetime";
  }
});

const wheelValueFormat = computed(() => {
  return props.field.preps?.valueFormat || valueFormat.value;
});

const minYear = computed(() => {
  const min = props.field.preps?.minYear;
  return min ? parseInt(min) : 1900;
});

const maxYear = computed(() => {
  const max = props.field.preps?.maxYear;
  return max ? parseInt(max) : 2099;
});

const wheelPickerRef = ref<any>(null);

const displayText = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") return "";
  if (Array.isArray(val)) {
    return val.map((v) => formatSingle(v)).join(" ~ ");
  }
  return formatSingle(val);
});

const formatSingle = (val: any) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val instanceof Date) {
    try {
      const yyyy = val.getFullYear();
      const mm = String(val.getMonth() + 1).padStart(2, "0");
      const dd = String(val.getDate()).padStart(2, "0");
      const hh = String(val.getHours()).padStart(2, "0");
      const mi = String(val.getMinutes()).padStart(2, "0");
      const ss = String(val.getSeconds()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    } catch {
      return String(val);
    }
  }
  return String(val);
};

const handleConfirm = () => {
  const val = wheelPickerRef.value?.getFormattedValue?.();
  if (val !== undefined) formData.value[props.field.fieldName] = val;
  itemAction("change");
  // App 端抽屉化选择不经过 el-date-picker 的 v-on(getDynamicEvents),
  // 需手动触发 dataRelation 联动(PC 端通过 getDynamicEvents 绑定的 change 事件触发)
  const dataRelation = props.field.preps?.dataRelation;
  if (dataRelation?.actionName) {
    relationEventDispatcher(
      props,
      dataRelation,
      val,
      formData,
      dataRelation.actionName,
    );
  }
  closePicker();
};

const handleCancel = () => {
  closePicker();
};

const itemAction = (prep: any) => {
  if (prep == "change" && effectiveType.value?.includes("range")) {
    let val = formData.value[props.field.fieldName];
    if (props.field.preps?.needSplitName && Array.isArray(val)) {
      formData.value[props.field.fieldName + "Start"] = val[0];
      formData.value[props.field.fieldName + "End"] = val[1];
    }
  }
  allAction(props, emits, formData, prep);
};

onBeforeMount(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["type"] = effectiveType.value;
  const disableDate = props.field.preps?.disableDate;
  if (typeof disableDate === "function") {
    disabledDate.value = disableDate() || [];
  } else if (typeof disableDate == "string") {
    disabledDate.value = disableDate.split(";") || [];
  }
  delete props.field.preps?.disabledDate;
});

onMounted(() => {
  props.field.preps["disabledDate"] = (date: Date) => {
    return disabledDate.value.includes(date.getDate().toString());
  };
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
      const vf = props.field.preps?.valueFormat || valueFormat.value;
      const normalized = normalizeDateModel(val, effectiveType.value, vf);
      if (Array.isArray(normalized)) {
        if (
          !Array.isArray(val) ||
          normalized.length !== val.length ||
          normalized.some((v: any, i: number) => v !== val[i])
        ) {
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
:deep(.el-input) {
  width: unset !important;
}
</style>
