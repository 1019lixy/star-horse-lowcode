<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import DataTag from "@/components/comp/utils/DataTag.vue";
import DataPicker, {
  type ModelValueType,
} from "@/components/comp/utils/DataPicker.vue";
import { useFormDisabled } from "element-plus";
import type { CSSProperties } from "vue";
import { computed, ref } from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { compKey } from "@/api/system";

export interface DataSelectorProps {
  modelValue: ModelValueType;
  selectedData?: any;
  placeholder?: string;
  dataUrl?: string;
  datas?: Array<any>;
  pageSize?: number;
  title?: string;
  compSize?: string;
  displayName?: string;
  displayValue?: string;
  multiple?: boolean;
  disabled?: boolean;
  checkStrictly?: boolean;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<DataSelectorProps>(), {
  multiple: false,
  disabled: false,
  compSize: "small",
  pageSize: 0,
  displayName: "name",
  displayValue: "value",
  checkStrictly: true,
  placeholder: "请选择数据",
});
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "selectedData", selectData: any): void;
}>();
const value: any = useVModel(props, "modelValue", emits);
const emitData: any = useVModel(props, "selectedData", emits);
const selectData: any = ref<any>();
const valueArr = computed<string[]>(() => {
  emitData.value = selectData.value;
  if (!selectData.value) return [];
  if (Array.isArray(selectData.value)) {
    value.value = selectData.value.map((v: any) => v[props.displayValue]);
    return selectData.value;
  } else {
    value.value = selectData.value[props.displayValue];
    return [selectData.value];
  }
});
const dataPickerRef = ref<InstanceType<typeof DataPicker>>();
const formDisabled = useFormDisabled();
const disabled = computed<boolean>(() => {
  return formDisabled.value || props.disabled;
});
const openDataPicker = () => {
  if (props.disabled) return;
  dataPickerRef.value?.open();
};
const onClose = (data: any) => {
  if (!selectData.value) return;
  if (props.multiple && Array.isArray(selectData.value)) {
    selectData.value.splice(selectData.value.indexOf(data), 1);
    value.value.splice(selectData.value.indexOf(data[props.displayValue]), 1);
  } else {
    selectData.value = null;
    value.value = null;
  }
  emits("selectedData", selectData.value);
};
</script>

<template>
  <data-picker
    ref="dataPickerRef"
    :title="title"
    :datas="datas"
    :data-url="dataUrl"
    :page-size="pageSize"
    :display-name="displayName"
    :display-value="displayValue"
    :checkStrictly="checkStrictly"
    :multiple="multiple"
    v-model="selectData"
  />
  <div class="data-wrapper">
    <star-horse-icon
      @click="openDataPicker"
      cursor="pointer"
      icon-class="select-data"
      :border="true"
    />
    <DataTag
      v-for="(item, key) in valueArr"
      :key="compKey(item, key)"
      :closable="!disabled"
      :data="item"
      :display-name="displayName"
      :display-value="displayValue"
      @close="onClose"
    />
    <el-text v-show="!value || value.length === 0" class="placeholder">
      {{ placeholder }}
    </el-text>
  </div>
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 3px;
}

.data-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  grid-gap: 7px;
  gap: 7px;

  .placeholder {
    color: var(--el-text-color-placeholder);
  }

  .data-but-item {
    border-style: dashed;

    &:hover {
      border-style: solid;
    }
  }
}
</style>
