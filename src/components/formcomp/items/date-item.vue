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
        :placeholder="field.preps?.placeholder || i18n('starhorse.pleaseSelect')"
        :disabled="checkIsDisabled(props)"
        readonly
        @click="openPicker"
      >
        <template #suffix>
          <star-horse-icon icon-class="date" />
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
          v-if="!isMultiSelect"
          ref="wheelPickerRef"
          :model-value="formData[field.fieldName]"
          :type="wheelType"
          :value-format="wheelValueFormat"
          :min-year="minYear"
          :max-year="maxYear"
        />
        <ShMobileGridPicker
          v-else
          ref="gridPickerRef"
          :model-value="formData[field.fieldName] || []"
          :mode="gridMode"
          :value-format="gridValueFormat"
          :min-year="minYear"
          :max-year="maxYear"
          :every-year="everyYear"
          @every-year-change="onEveryYearChange"
        />
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, shallowRef, watch } from "vue";
import { allAction, checkIsDisabled, initCompCallEvent, prepsFilter } from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { ItemPreps } from "@/components/types/ItemPreps";
import { getDateDisplayFormat, getDateValueFormat, normalizeDateModel } from "@/api/date_utils";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import ShMobileWheelPicker from "@/components/formcomp/utils/ShMobileWheelPicker.vue";
import ShMobileGridPicker from "@/components/formcomp/utils/ShMobileGridPicker.vue";
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
const disabledDate = shallowRef<any>([]);

const effectiveType = computed(() => {
  return props.field.preps?.type || props.field.type || "date";
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

/* 是否多选（dates/years/months） */
const isMultiSelect = computed(() => {
  const t = effectiveType.value;
  return t === "dates" || t === "years" || t === "months";
});

/* 滚轮类型映射 */
const wheelType = computed(() => {
  const t = effectiveType.value;
  switch (t) {
    case "daterange": return "daterange";
    case "monthrange": return "monthrange";
    case "yearrange": return "yearrange";
    case "year": return "year";
    case "month": return "month";
    case "week":
    case "date": return "date";
    default: return "date";
  }
});

/* 网格模式 */
const gridMode = computed(() => {
  const t = effectiveType.value;
  if (t === "years") return "year";
  if (t === "months") return "month";
  return "date";
});

const wheelValueFormat = computed(() => {
  return props.field.preps?.valueFormat || valueFormat.value;
});

const gridValueFormat = computed(() => {
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

/** 月份多选时是否为"每年"模式（不绑定年份，值仅为 MM），支持用户在界面切换 */
const everyYear = ref(false);

/** 监听子组件每年模式切换 */
const onEveryYearChange = (val: boolean) => {
  everyYear.value = val;
  // 清空已选数据（值格式不同）
  formData.value[props.field.fieldName] = [];
};

const wheelPickerRef = ref<any>(null);
const gridPickerRef = ref<any>(null);

const displayText = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") return "";
  if (Array.isArray(val)) {
    if (isMultiSelect.value) {
      // 每年月份模式：值是 "01"-"12"，显示为 "1月, 3月"
      if (everyYear.value && gridMode.value === "month") {
        const labels = val.map((v: any) => `${parseInt(String(v))}${i18n('cron.month')}`);
        return labels.length > 3 ? `${i18n('item.selectedData')}(${labels.length})` : labels.join(", ");
      }
      return val.length > 3 ? `${i18n('item.selectedData')}(${val.length})` : val.join(", ");
    }
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
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return String(val);
    }
  }
  return String(val);
};

const handleConfirm = () => {
  if (isMultiSelect.value) {
    const vals = gridPickerRef.value?.getSelectedValues?.();
    if (vals) formData.value[props.field.fieldName] = vals;
  } else {
    const val = wheelPickerRef.value?.getFormattedValue?.();
    if (val !== undefined) formData.value[props.field.fieldName] = val;
  }
  itemAction("change");
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
  // 初始化每年模式：从配置读取
  everyYear.value = !!props.field.preps.everyYear;
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
:deep(.el-input) {
  width: unset !important;
}
</style>
