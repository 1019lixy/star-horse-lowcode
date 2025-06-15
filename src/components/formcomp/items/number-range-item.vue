<template>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="number-range-container">
      <div v-if="field.preps?.prefix" :class="{ 'slot-default': slotStyle === 'default', 'slot-pend ': true }">
        {{ field.preps["prefix"] }}
      </div>
      <div
          class="number-range"
          :class="{
          'is-disabled': checkIsDisabled(props),
          'is-focus': isFocus,
          'number-range-border-radius': true
        }"
      >
        <el-input-number
            :fid="field.preps?.minName"
            :controls="false"
            :disabled="checkIsDisabled(props)"
            v-bind="field.preps"
            @change="itemAction('change')"
            @blur="handleBlur"
            @focus="handleFocus"
            v-model="formData[field.preps['minName']]"
        />
        <div class="to">
          <span>{{ field.preps?.to || "-" }}</span>
        </div>
        <el-input-number
            :fid="field.preps?.maxName"
            :controls="false"
            :disabled="checkIsDisabled(props)"
            v-bind="field.preps"
            @change="itemAction('change')"
            @blur="handleBlur"
            @focus="handleFocus"
            :step-strictly="field.preps?.stepStrictly"
            v-model="formData[field.preps['maxName']]"
        />
      </div>
      <div v-if="field.preps?.suffix" :class="{ 'slot-default': slotStyle === 'default', 'slot-pend ': true }">
        {{ field.preps["suffix"] }}
      </div>
    </div>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {onMounted, ref, shallowRef, watch, PropType} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils';
import {warning} from '@/utils/message';

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object as PropType<any>,
    required: true
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
  formFieldList: {
    type: Array,
    default: () => []
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
let actionName = shallowRef('normal');
let slotStyle = shallowRef('');
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
  let min = formData.value[props.field.preps['minName']];
  let max = formData.value[props.field.preps['maxName']];
  if (max < min) {
    warning('最大值不能小于最小值');
    return;
  }
  formData.value[props.field.fieldName] = `${min}-${max}`;
  allAction(props, emits, formData, prep);
};
onMounted(() => {
  actionName.value = props.field.actionName || 'normal';
  props.field.preps['maxName'] = props.field.fieldName + 'Max';
  props.field.preps['minName'] = props.field.fieldName + 'Min';
  let val: any = formData.value[props.field.fieldName];
  if (val) {
    let data = val.split('-');
    formData.value[props.field.preps['minName']] = Number(data[0]);
    formData.value[props.field.preps['maxName']] = Number(data[1]);
  }
  if (!props.isSearch) {
    allAction(props, emits, formData, actionName.value, true);
  }
});
watch(
    () => props.formFieldList,
    () => {
      itemAction('init');
    },
    {immediate: true, deep: true}
);
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}

.number-range-container {
  display: flex;
  height: 100%;

  .slot-pend {
    white-space: nowrap;
    color: var(--el-color-info);
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  }

  #prepend {
    padding: 0 20px;
    box-shadow: 1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
    0 1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
    0 -1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  #append {
    padding: 0 15px;
    box-shadow: 0 1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
    0 -1px 0 0 var(--el-input-border-color, var(--el-border-color)) inset,
    -1px 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .slot-default {
    background-color: var(--el-fill-color-light);
  }

  .number-range-border-radius {
    border-radius: 5px !important;
  }

  .number-range {
    background-color: var(--el-bg-color) !important;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
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
