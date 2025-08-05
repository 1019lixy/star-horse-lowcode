<script setup lang="ts">
import {useVModel} from "@vueuse/core";
import DataTag from "@/components/comp/utils/DataTag.vue";
import DataPicker, {type ModelValueType,} from "@/components/comp/utils/DataPicker.vue";
import {useFormDisabled} from "element-plus";
import type {CSSProperties} from "vue";
import {computed, ref,watch} from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {compKey} from "@/api/system";

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
  selectLeaf?: boolean;
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
  selectLeaf: false,
  placeholder: "请选择数据",
});
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "update:selectedData", selectData: any): void;
  (e: "selectedData", selectData: any): void;
}>();
const value: any = useVModel(props, "modelValue", emits);
const emitData: any = useVModel(props, "selectedData", emits);
const selectData: any = ref<any>();
const valueArr = computed<string[]>(() => {
  // emitData.value = selectData.value;
  if (!selectData.value) return [];
  return Array.isArray(selectData.value)
      ? selectData.value
      : [selectData.value];
});
// 新增 watch 监听 selectData 变化
watch(selectData, (newVal) => {
  // 同步modelValue
  value.value = Array.isArray(newVal)
      ? newVal.map(v => v[props.displayValue])
      : newVal?.[props.displayValue];
  // 同步selectedData
  emitData.value = newVal;
}, { deep: true });
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
      :select-leaf="selectLeaf"
      :multiple="multiple"
      v-model="selectData"
  />
  <div class="data-wrapper">
    <star-horse-icon
        @click="openDataPicker"
        cursor="pointer"
        icon-class="select-data"
        size="22px"
        :border="true"
    />
    <DataTag
        v-for="(item, key) in valueArr.slice(0,3)"
        :key="compKey(item, key)"
        :closable="!disabled"
        :data="item"
        :display-name="displayName"
        :display-value="displayValue"
        @close="onClose"
    />
    <el-text
        v-if="valueArr.length > 3"
        type="info"
        class="placeholder"
    >
      <el-tooltip
          v-if="valueArr.length > 3"
          placement="top"
          effect="light"
          :disabled="disabled"
      >
        <template #content>
          <div class="tooltip-content">
            <DataTag
                v-for="(item, index) in valueArr.slice(3)"
                :key="compKey(item, index)"
                :closable="!disabled"
                :data="item"
                :display-name="displayName"
                :display-value="displayValue"
                @close="onClose"
                class="tooltip-item my-[5px]"
            />
          </div>
        </template>
        <span class="more-text">+{{ valueArr.length - 3 }} more</span>
      </el-tooltip>
    </el-text>
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

.tooltip-content {
  max-height: 200px;
  overflow-y: auto;

  .tooltip-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;

    .close-icon {
      margin-left: 8px;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
