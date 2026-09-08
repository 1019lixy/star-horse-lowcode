<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import DataPicker, {
  type ModelValueType,
} from "@/components/comp/utils/DataPicker.vue";
import { computed, CSSProperties, nextTick, onMounted, ref, watch } from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { i18n } from "@/lang";
import { SearchParams } from "@/components/types";
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
  /** 显示模式：label 仅显示名称，label+code 显示 名称(编码) */
  displayMode?: "label" | "label+code";
  /** 编码字段名（displayMode=label+code 时使用） */
  displayCode?: string;
  multiple?: boolean;
  disabled?: boolean;
  checkStrictly?: boolean;
  selectLeaf?: boolean;
  showTagLength?: number;
  /** 是否允许创建不在数据列表中的自定义值（allowCreate） */
  allowCreate?: boolean;
  style?: CSSProperties;
  tagType?: "" | "primary" | "secondary" | "success" | "info" | "warning";
  tagEffect?: "" | "light" | "dark" | "plain";
  /** APP 端是否启用层级分类筛选 */
  enableHierarchy?: boolean;
}

const props = withDefaults(defineProps<DataSelectorProps>(), {
  multiple: false,
  disabled: false,
  compSize: "default",
  pageSize: 0,
  displayName: "name",
  displayValue: "value",
  displayMode: "label",
  displayCode: "code",
  checkStrictly: true,
  selectLeaf: false,
  showTagLength: 3,
  allowCreate: true,
  placeholder: i18n("api.pleaseSelectData2"),
  tagType: "info",
  tagEffect: "light",
  enableHierarchy: true,
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
const pickerMounted = ref(false);

const openDataPicker = async () => {
  if (props.disabled) return;
  if (!pickerMounted.value) {
    pickerMounted.value = true;
    await nextTick();
  }
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
      (item: any) => item?.[props.displayValue] === targetValue,
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

/** 将 modelValue 统一转为值数组（兼容单值/数组两种形态） */
const toValueList = (): any[] => {
  const v = value.value;
  if (v === undefined || v === null || v === "") return [];
  return Array.isArray(v) ? v : [v];
};

/** 将 selectData 统一转为对象数组形态 */
const toSelectList = (): any[] => {
  const s = selectData.value;
  if (s === undefined || s === null || s === "") return [];
  return Array.isArray(s) ? s : [s];
};

/** selectData 是否已覆盖 modelValue 的全部值（覆盖说明是内部更新，无需重新加载） */
const isCovered = (): boolean => {
  const vals = toValueList();
  if (!vals.length) return true;
  const exist = new Set(
    toSelectList().map((i: any) => i?.[props.displayValue]),
  );
  return vals.every(
    (v) => v === "" || v === undefined || v === null || exist.has(v),
  );
};

/**
 * 以 modelValue 为准重建 selectData：
 * 数据源命中的用真实数据，未命中的（手动输入的值不在数据源中）补临时项，保证回显
 */
const mergeSelectData = (loaded: any[] = []) => {
  const vals = toValueList().filter(
    (v) => v !== undefined && v !== null && v !== "",
  );
  if (!vals.length) {
    if (toSelectList().length) {
      selectData.value = props.multiple ? [] : "";
    }
    return;
  }
  const current = toSelectList();
  const merged = vals.map((v) => {
    const hit =
      loaded.find((i: any) => i?.[props.displayValue] === v) ??
      current.find((i: any) => i?.[props.displayValue] === v);
    return hit ?? { [props.displayName]: v, [props.displayValue]: v };
  });
  if (JSON.stringify(merged) === JSON.stringify(current)) return;
  selectData.value = merged;
};

/** 从数据源加载 modelValue 对应的真实数据 */
const fetchLoaded = async (): Promise<any[]> => {
  if (props.data) {
    return findNodesInTree(props.data, value.value, props.displayValue);
  }
  if (props.dataUrl && value.value?.length > 0) {
    return await loadSelectedData(
      props.dataUrl,
      value.value,
      props.displayValue,
      props.params,
      props.proxy,
      props.proxyUrl,
    );
  }
  return [];
};

/**
 * 初始化数据选择器 - 使用公共工具函数
 */
const init = async () => {
  mergeSelectData(await fetchLoaded());
};

/** 外部回显/表单填充导致 modelValue 变化时重新同步 selectData（内部选择已覆盖时跳过） */
watch(
  () => props.modelValue,
  async () => {
    if (isCovered()) return;
    const snapshot = JSON.stringify(toValueList());
    const loaded = await fetchLoaded();
    if (JSON.stringify(toValueList()) !== snapshot) return;
    mergeSelectData(loaded);
  },
);

const addTag = (val: any) => {
  if (!props.allowCreate) return;
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

/** 获取显示文本（支持 label+code 模式） */
const getDisplayText = (val: any): string => {
  const item = selectData.value?.find(
    (i: any) => i?.[props.displayValue] === val,
  );
  if (!item) return val;
  if (props.displayMode === "label+code") {
    const code = item[props.displayCode];
    const name = item[props.displayName];
    return code ? `${name}（${code}）` : name;
  }
  return item[props.displayName] ?? val;
};

const tagVisible = (val: any) => {
  return getDisplayText(val);
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
  { deep: true },
);
</script>

<template>
  <data-picker
    v-if="pickerMounted"
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
    :display-mode="displayMode"
    :display-code="displayCode"
    :checkStrictly="checkStrictly"
    :select-leaf="selectLeaf"
    :multiple="multiple"
    :enable-hierarchy="enableHierarchy"
    v-model="selectData"
  />
  <el-input-tag
    v-model="valueArr"
    :tag-type="tagType"
    :disabled="disabled"
    :readonly="!allowCreate"
    :tagEffect="tagEffect"
    :collapse-tags="true"
    :max-collapse-tags="showTagLength ?? 5"
    :collapse-tags-tooltip="true"
    @clear="selectData = []"
    @addTag="addTag"
    @removeTag="(val) => onClose(val)"
  >
    <template #tag="{ value }">
      <div class="flex items-center">
        <span>{{ tagVisible(value) }}</span>
      </div>
    </template>
    <template #suffix>
      <div
        class="data-selector-suffix"
        :class="{ 'is-disabled': disabled }"
        @click="openDataPicker"
      >
        <star-horse-icon
          cursor="pointer"
          icon-class="select-data"
          size="18px"
          :color="
            !disabled ? 'var(--star-horse-style)' : 'var(--star-horse-disabled)'
          "
        />
      </div>
    </template>
  </el-input-tag>
</template>

<style scoped lang="scss">
.el-tag {
  padding: 0 3px;
}

:deep(.el-input-tag__suffix) {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
}

:deep(.el-input-tag__suffix-inner) {
  height: 100% !important;
  align-items: stretch !important;
}

.data-selector-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 0;
  background: var(--el-fill-color-light);
  border-left: 1px solid var(--el-border-color);
  transition:
    background 0.2s,
    border-color 0.2s;
  cursor: pointer;

  &:hover {
    background: var(--el-fill-color);
  }

  &.is-disabled {
    cursor: not-allowed;
    background: transparent;
    border-left-color: var(--el-disabled-border-color);
  }
}

/* 移动端紧凑化 */
@media (max-width: 768px) {
  .data-selector-suffix {
    width: 28px;
  }

  :deep(.el-input-tag) {
    --el-input-tag-inner-padding: 2px 4px;
  }

  .el-tag {
    padding: 0 2px;
    font-size: 12px;
  }
}
</style>
