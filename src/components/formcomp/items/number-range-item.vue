<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <div class="number-range-container">
      <div
        v-if="field.preps?.prefix"
        :class="{ 'slot-default': slotStyle === 'default', 'slot-pend ': true }"
      >
        <span v-if="field.preps?.prefix">{{ field.preps["prefix"] }}</span>
        <star-horse-icon
          :icon-class="field.preps?.prefixIcon"
          v-if="field.preps?.prefixIcon"
        />
      </div>
      <div
        class="number-range"
        :class="{
          'is-disabled': checkIsDisabled(props),
          'is-focus': isFocus,
          'number-range-border-left-radius': !field.preps?.prefix,
          'number-range-border-right-radius': !field.preps?.suffix,
        }"
      >
        <el-input-number
          :fid="minName"
          :controls="false"
          :disabled="checkIsDisabled(props)"
          v-bind="prepsFilter(field.preps)"
          :placeholder="field.preps?.minPlaceholder"
          @change="itemAction('change')"
          @blur="handleBlur"
          @focus="handleFocus"
          v-model="formData[minName]"
        />
        <div class="to">
          <span>{{ splitName }}</span>
        </div>
        <el-input-number
          :fid="maxName"
          :controls="false"
          :disabled="checkIsDisabled(props)"
          v-bind="prepsFilter(field.preps)"
          @change="itemAction('change')"
          @blur="handleBlur"
          @focus="handleFocus"
          :placeholder="field.preps?.maxPlaceholder"
          :step-strictly="field.preps?.stepStrictly"
          v-model="formData[maxName]"
        />
      </div>
      <div
        v-if="field.preps?.suffix"
        :class="{
          'slot-default': slotStyle === 'default',
          'slot-suffix ': true,
        }"
      >
        <span v-if="field.preps?.suffix">{{ field.preps["suffix"] }}</span>
        <star-horse-icon
          :icon-class="field.preps?.suffixIcon"
          v-if="field.preps?.suffixIcon"
        />
      </div>
    </div>
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
} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const maxName = computed(() => {
  return props.field.preps?.maxName ?? props.field.fieldName + "Max";
});
const minName = computed(() => {
  return props.field.preps?.minName ?? props.field.fieldName + "Min";
});
const splitName = computed(() => {
  return props.field.preps?.splitName ?? "-";
});
let slotStyle = shallowRef("");

// input焦点事件
const isFocus = ref();
const handleFocus = () => {
  isFocus.value = true;
};
const handleBlur = () => {
  isFocus.value = false;
};

// 处理数字精度
// 判断插槽是否被使用
// 组件外部使用时插入了
// <template #插槽名 >
// </template>
// 无论template标签内是否插入了内容，均视为已使用该插槽

const itemAction = (prep: string) => {
  let min = formData.value[minName.value];
  let max = formData.value[maxName.value];
  if (
    min === undefined ||
    min === null ||
    isNaN(min) || // 空值/非数值校验
    max === undefined ||
    max === null ||
    isNaN(max) ||
    max < min // 最大值小于最小值校验
  ) {
    // 校验失败时，清空主字段值（触发父组件required规则）
    formData.value[props.field.fieldName] =
      `${min ?? ""}${splitName.value}${max ?? ""}`;
    return;
  }
  formData.value[props.field.fieldName] = `${min}${splitName.value}${max}`;
  allAction(props, emits, formData, prep);
};
onBeforeMount(() => {
  if (!props.field.preps) {
    props.field["preps"] = {};
  }
});
onMounted(() => {
  let val: any = formData.value[props.field.fieldName];
  if (typeof val === "string") {
    let data = val.split(splitName.value);
    formData.value[minName.value] = Number(data[0]);
    formData.value[maxName.value] = Number(data[1]);
  } else if (Array.isArray(val)) {
    formData.value[minName.value] = Number(val[0]);
    formData.value[maxName.value] = Number(val[1]);
  }
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}

.number-range-container {
  display: flex;
  height: 100%;
  align-items: center;
  width: 100%;

  .slot-pend,
  .slot-suffix {
    white-space: nowrap;
    padding: 0 10px;
    border: 1px solid var(--el-border-color);
    color: var(--el-color-info);
    background: #ebeef5;
  }

  .slot-pend {
    border-right: 0;
    border-top-left-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
    border-bottom-left-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
  }

  .slot-suffix {
    border-left: 0;
    border-top-right-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
    border-bottom-right-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
  }

  #append,
  #append {
    padding: 0 10px;
    box-shadow:
      1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      0 1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
      0 -1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
  }

  #prepend {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #append {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .slot-default {
    background-color: var(--el-fill-color-light);
  }

  .number-range-border-left-radius {
    border-top-left-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
    border-bottom-left-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
  }

  .number-range-border-right-radius {
    border-top-right-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
    border-bottom-right-radius: var(
      --el-input-border-radius,
      var(--el-border-radius-base)
    );
  }

  .number-range {
    background-color: var(--el-bg-color) !important;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
      inset;

    padding: 0 2px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: var(--el-input-text-color, var(--el-text-color-regular));
    transition: var(--el-transition-box-shadow);
    transform: translate3d(0, 0, 0);
    overflow: hidden;

    .to {
      margin-top: 1px;
    }
  }

  .is-focus {
    transition: all 0.3s;
    box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
  }

  .is-disabled {
    background-color: var(--el-input-bg-color);
    color: var(--el-input-text-color, var(--el-text-color-regular));
    cursor: not-allowed;

    .to {
      height: calc(100% - 3px);
      background-color: var(--el-fill-color-light) !important;
    }
  }
}

:deep(.el-input) {
  border: none;
}

:deep(.el-input__wrapper) {
  margin: 0;
  padding: 0 15px;
  background-color: transparent;
  border: none !important;
  box-shadow: none !important;

  &.is-focus {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
