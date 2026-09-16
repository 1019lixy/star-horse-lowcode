<script setup lang="ts">
import DataPicker from "@/components/comp/utils/DataPicker.vue";
import { CSSProperties, computed, nextTick, ref, watch } from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { i18n } from "@/lang";
import {
  dataPickerBaseDefaults,
  findNodesInTree,
  loadSelectedData,
  type DataPickerBaseProps,
  type ModelValueType,
} from "@/api/star_horse_utils";

/** StarHorseDataSelector 私有扩展：继承公共 DataPickerBaseProps */
export interface DataSelectorProps extends DataPickerBaseProps {
  placeholder?: string;
  disabled?: boolean;
  showTagLength?: number;
  /** 是否允许创建不在数据列表中的自定义值（allowCreate） */
  allowCreate?: boolean;
  style?: CSSProperties;
  tagType?: "" | "primary" | "secondary" | "success" | "info" | "warning";
  tagEffect?: "" | "light" | "dark" | "plain";
}

const props = withDefaults(defineProps<DataSelectorProps>(), {
  ...dataPickerBaseDefaults,
  disabled: false,
  showTagLength: 3,
  allowCreate: true,
  placeholder: i18n("api.pleaseSelectData2"),
  tagType: "info",
  tagEffect: "light",
});
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValueType): void;
  (e: "update:selectedData", selectData: any[]): void;
  (e: "selectedData", selectData: any[]): void;
  (e: "change", selectData: any[]): void;
}>();

/**
 * 数据流说明（单一数据源 + 单向同步，无 useVModel）：
 * 1. selectedItems 是唯一工作状态：已选对象数组（单选/多选统一形态，单选时长度 0/1）
 * 2. 内部变化（弹窗选择 / 手动增删标签）→ watch(selectedItems) 统一对外发事件
 * 3. 外部变化（表单回填 / reset）→ watch(modelValue) 重建 selectedItems（已覆盖时跳过，防止循环）
 */
const selectedItems = ref<any[]>([]);

/** 展示值数组：已选对象 → 值列表（el-input-tag 只读受控） */
const valueArr = computed(() =>
  selectedItems.value.map((item: any) => item?.[props.displayValue]),
);

/** modelValue 统一转值数组（兼容单值/数组两种形态） */
const toValues = (v: ModelValueType): any[] => {
  if (v === undefined || v === null || v === "") return [];
  return Array.isArray(v) ? v : [v];
};

/** selectedItems 是否已覆盖全部值（内部回写引发的 modelValue 变化无需重新加载） */
const isCovered = (values: any[]): boolean => {
  if (!values.length) return selectedItems.value.length === 0;
  const exist = new Set(
    selectedItems.value.map((item: any) => item?.[props.displayValue]),
  );
  return values.every((v) => exist.has(v));
};

/** 拉取已选值对应的完整对象：静态 data 本地树查找，远程模式走统一请求出口 */
const fetchSelectedItems = async (values: any[]): Promise<any[]> => {
  if (props.data?.length) {
    return findNodesInTree(props.data, values, props.displayValue);
  }
  if (props.apiEndpoints || props.apiDataSource) {
    return loadSelectedData(
      props.apiEndpoints,
      values,
      props.displayValue,
      props.params,
      props.proxy,
      props.proxyUrl,
      props.apiDataSource,
    );
  }
  return [];
};

/**
 * 以 values 顺序重建 selectedItems：
 * 数据源命中的用真实对象，未命中的（如自定义输入值）补临时项保证回显
 */
const rebuildItems = (values: any[], loaded: any[]) => {
  if (!values.length) {
    selectedItems.value = [];
    return;
  }
  const merged = values.map(
    (v) =>
      loaded.find(
        (i: any) => String(i?.[props.displayValue]) === String(v),
      ) ??
      selectedItems.value.find(
        (i: any) => String(i?.[props.displayValue]) === String(v),
      ) ?? {
        [props.displayName]: v,
        [props.displayValue]: v,
      },
  );
  if (JSON.stringify(merged) !== JSON.stringify(selectedItems.value)) {
    selectedItems.value = merged;
  }
};

/** 内部状态 → 父组件（唯一出口：值 + 已选对象统一在此发出） */
watch(
  selectedItems,
  (items) => {
    const values = items.map((item: any) => item?.[props.displayValue]);
    emits("update:modelValue", props.multiple ? values : (values[0] ?? ""));
    emits("update:selectedData", items);
    emits("selectedData", items);
    emits("change", items);
  },
  { deep: true },
);

/** 父组件 modelValue → 内部状态（回显入口，immediate 覆盖初始挂载场景） */
watch(
  () => props.modelValue,
  async () => {
    const values = toValues(props.modelValue).filter(
      (v) => v !== "" && v !== undefined && v !== null,
    );
    if (isCovered(values)) return;
    const loaded = await fetchSelectedItems(values);
    // 请求期间 modelValue 再次变化则丢弃本次结果
    const latest = toValues(props.modelValue).filter(
      (v) => v !== "" && v !== undefined && v !== null,
    );
    if (JSON.stringify(latest) !== JSON.stringify(values)) return;
    rebuildItems(latest, loaded);
  },
  { immediate: true },
);

/** 弹窗按需挂载（首次打开才渲染，减少初始组件数量） */
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

/** 删除标签（el-input-tag removeTag，val 为标签值） */
const removeTag = (val: any) => {
  const target = val?.[props.displayValue] ?? val;
  const index = selectedItems.value.findIndex(
    (item: any) => item?.[props.displayValue] === target,
  );
  if (index !== -1) selectedItems.value.splice(index, 1);
};

/** 手动输入新标签（allowCreate 场景，值同时作为名称） */
const addTag = (val: any) => {
  if (!props.allowCreate) return;
  const item = { [props.displayName]: val, [props.displayValue]: val };
  if (props.multiple) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value = [item];
  }
};

/** 标签显示文本（支持 label+code 模式） */
const getDisplayText = (val: any): string => {
  const item = selectedItems.value.find(
    (i: any) => String(i?.[props.displayValue]) === String(val),
  );
  if (!item) return val;
  if (props.displayMode === "label+code") {
    const code = item[props.displayCode];
    const name = item[props.displayName];
    return code ? `${name}（${code}）` : name;
  }
  return item[props.displayName] ?? val;
};
</script>

<template>
  <data-picker
    v-if="pickerMounted"
    ref="dataPickerRef"
    :title="title"
    :data="data"
    :apiEndpoints="apiEndpoints"
    :proxy="proxy"
    :proxy-url="proxyUrl"
    :api-data-source="apiDataSource"
    :params="params"
    :page-size="pageSize"
    :comp-size="compSize"
    :display-name="displayName"
    :display-value="displayValue"
    :display-mode="displayMode"
    :display-code="displayCode"
    :checkStrictly="checkStrictly"
    :select-leaf="selectLeaf"
    :multiple="multiple"
    :enable-hierarchy="enableHierarchy"
    v-model="selectedItems"
  />
  <el-input-tag
    :model-value="valueArr"
    :placeholder="placeholder"
    :tag-type="tagType"
    :disabled="disabled"
    :readonly="!allowCreate"
    :tagEffect="tagEffect"
    :collapse-tags="true"
    :max-collapse-tags="showTagLength ?? 5"
    :collapse-tags-tooltip="true"
    @clear="selectedItems = []"
    @addTag="addTag"
    @removeTag="removeTag"
  >
    <template #tag="{ value }">
      <div class="flex items-center">
        <span>{{ getDisplayText(value) }}</span>
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
