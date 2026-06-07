<script setup lang="ts">
import {useVModel} from "@vueuse/core";
import DataPicker, {type ModelValueType,} from "@/components/comp/utils/DataPicker.vue";
import {computed, CSSProperties, onMounted, ref, watch} from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {i18n} from "@/lang";
import {SearchParams} from "@/components/types";
import {
  findNodesInTree,
  loadSelectedData,
} from "@/components/comp/utils/DataSelectorUtils";

export interface DataSelectorProps {
  modelValue: ModelValueType;
  selectedData?: any;
  placeholder?: string;
  dataUrl?: string;
  proxy?: boolean;
  proxyUrl?: string;
  params?: SearchParams[];
  data?: Array<any>;
  pageSize?: number;
  title?: string;
  compSize?: string;
  displayName?: string;
  displayValue?: string;
  multiple?: boolean;
  disabled?: boolean;
  checkStrictly?: boolean;
  selectLeaf?: boolean;
  showTagLength?: number;
  style?: CSSProperties;
  tagType: "" | "primary" | "secondary" | "success" | "info" | "warning";
  tagEffect: "" | "light" | "dark" | "plain";
}

const props = withDefaults(defineProps<DataSelectorProps>(), {
  multiple: false,
  disabled: false,
  compSize: "default",
  pageSize: 0,
  displayName: "name",
  displayValue: "value",
  checkStrictly: true,
  selectLeaf: false,
  showTagLength: 3,
  placeholder: i18n("api.pleaseSelectData2"),
});
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "update:selectedData", selectData: any): void;
  (e: "selectedData", selectData: any): void;
  (e: "change", selectData: any): void;
}>();
const value: any = useVModel(props, "modelValue", emits);
const emitData: any = useVModel(props, "selectedData", emits);
const selectData: any = ref<any>(props.multiple ? [] : "");
const valueArr = computed<string[]>(() => {
  if (selectData.value) {
    const temp = Array.isArray(selectData.value)
        ? selectData.value
        : [selectData.value];
    return temp.map((item: any) => item?.[props.displayValue]);
  }
  return [];
});

const dataPickerRef = ref<InstanceType<typeof DataPicker>>();

const openDataPicker = () => {
  if (props.disabled) return;
  dataPickerRef.value?.open();
};

const onClose = (data: any) => {
  if (!selectData.value) {
    emits("change", selectData.value);
    return;
  }
  if (props.multiple && Array.isArray(selectData.value)) {
    const targetValue = data?.[props.displayValue] ?? data;
    const selectIndex = selectData.value.findIndex(
        (item: any) => item?.[props.displayValue] === targetValue
    );
    const valueIndex = value.value?.indexOf(targetValue);
    if (selectIndex !== -1) {
      selectData.value.splice(selectIndex, 1);
    }
    if (valueIndex !== -1 && value.value) {
      value.value.splice(valueIndex, 1);
    }
  } else {
    selectData.value = [];
    value.value = props.multiple ? [] : "";
  }
  emits("change", selectData.value);
  emits("selectedData", selectData.value);
};

/**
 * 初始化数据选择器 - 使用公共工具函数
 */
const init = async () => {
  if (props.data) {
    selectData.value = findNodesInTree(props.data, value.value, props.displayValue);
  } else if (props.dataUrl && value.value?.length > 0) {
    selectData.value = await loadSelectedData(
        props.dataUrl,
        value.value,
        props.displayValue,
        props.params,
        props.proxy,
        props.proxyUrl,
    );
  }
};

const addTag = (val: any) => {
  const temp = {
    [props.displayName]: val,
    [props.displayValue]: val,
  };
  if (props.multiple && Array.isArray(selectData.value)) {
    selectData.value.push(temp);
  } else {
    selectData.value = [temp];
  }
};

const tagVisible = (val: any) => {
  const result =
      (Array.isArray(selectData?.value) &&
          selectData?.value?.find(
              (item: any) => item?.[props.displayValue] === val,
          )?.[props.displayName]) ??
      val;
  return result;
};

onMounted(() => {
  init();
});

watch(
    () => selectData.value,
    (newVal) => {
      if (newVal) {
        const tempNewValue = Array.isArray(newVal)
            ? newVal.map((v) => v[props.displayValue])
            : newVal?.[props.displayValue];
        value.value = props.multiple ? tempNewValue : tempNewValue[0];
        emitData.value = newVal;
        emits("change", newVal);
      } else {
        console.error("dataselector error", newVal);
      }
    },
    {deep: true},
);
</script>

<template>
  <data-picker
      ref="dataPickerRef"
      :title="title"
      :data="data"
      :data-url="dataUrl"
      :proxy="proxy"
      :proxy-url="proxyUrl"
      :params="params"
      :page-size="pageSize"
      :display-name="displayName"
      :display-value="displayValue"
      :checkStrictly="checkStrictly"
      :select-leaf="selectLeaf"
      :multiple="multiple"
      v-model="selectData"
  />
  <el-input-tag
      v-model="valueArr"
      :tag-type="tagType"
      :disabled="disabled"
      :tagEffect="tagEffect"
      :collapse-tags="true"
      :max-collapse-tags="showTagLength??5"
      :collapse-tags-tooltip="true"
      @clear="selectData = []"
      @addTag="addTag"
      @removeTag="(val) =>onClose(val)"
  >
    <template #tag="{ value }">
      <div class="flex items-center">
        <span>{{ tagVisible(value) }}</span>
      </div>
    </template>
    <template #prefix>
      <star-horse-icon
          @click="openDataPicker"
          cursor="pointer"
          icon-class="select-data"
          size="22px"
          :color="!disabled?'var(--star-horse-style)':'var(--star-horse-disabled)'"
          :border="!disabled"
      />
    </template>
  </el-input-tag>
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 3px;
}
</style>
