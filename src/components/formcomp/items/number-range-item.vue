<template>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :disabled="context.attrs['disabled']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <div class="number-range-container">
      <div v-if="field.preps['prefix']" :class="{ 'slot-default': slotStyle === 'default', 'slot-pend ': true }">
        {{ field.preps["prefix"] }}
      </div>
      <div
          class="number-range"
          :class="{
          'is-disabled': checkIsDisabled(context),
          'is-focus': isFocus,
          'number-range-border-radius': true
        }"
      >
        <el-input-number
            :fid="field.preps['minName']"
            :controls="false"
            :disabled="checkIsDisabled(context)"
            :min="field.preps['min'] || -Infinity"
            :clearable="field.preps['clearable'] == 'Y'"
            :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label'] + '最小值'"
            :precision="field.preps['precision']"
            :readonly="field.preps['readonly'] == 'Y'"
            :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
            :step="field.preps['step']"
            :step-strictly="field.preps['stepStrictly'] == 'Y'"
            @change="itemAction('change')"
            @blur="handleBlur"
            @focus="handleFocus"
            v-model="context.attrs['formData'][field.preps['minName']]"
        />
        <div class="to">
          <span>{{ field.preps["to"] || "-" }}</span>
        </div>
        <el-input-number
            :fid="field.preps['maxName']"
            :controls="false"
            :disabled="checkIsDisabled(context)"
            :max="field.preps['max'] || Infinity"
            :clearable="field.preps['clearable'] == 'Y'"
            :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label'] + '最大值'"
            :precision="field.preps['precision']"
            :readonly="field.preps['readonly'] == 'Y'"
            :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
            :step="field.preps['step']"
            @change="itemAction('change')"
            @blur="handleBlur"
            @focus="handleFocus"
            :step-strictly="field.preps['stepStrictly'] == 'Y'"
            v-model="context.attrs['formData'][field.preps['maxName']]"
        />
      </div>
      <div v-if="field.preps['suffix']" :class="{ 'slot-default': slotStyle === 'default', 'slot-pend ': true }">
        {{ field.preps["suffix"] }}
      </div>
    </div>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, onMounted, shallowRef, watch, ref, useSlots} from 'vue';
import {allAction, checkIsDisabled} from '@/components/formcomp/utils/ItemRelationEventUtils.ts';
import {warning} from '@/utils/message.ts';

export default defineComponent({
  methods: {checkIsDisabled},
  setup(_props, context) {
    const parentField = context.attrs['parentField'];
    const field = context.attrs['field'] as any;
    let formItem = shallowRef({label: 'input', required: false});
    let dataField = shallowRef('');
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
    const slots = useSlots();
    const itemAction = (prep: string) => {
      let min = context.attrs['formData'][field.preps['minName']];
      let max = context.attrs['formData'][field.preps['maxName']];
      if (max < min) {
        warning('最大值不能小于最小值');
        return;
      }
      context.attrs['formData'][field.preps['name']] = `${min}-${max}`;
      allAction(context, prep);
    };
    onMounted(() => {
      actionName.value = field.preps?.actionName || 'normal';
      field.preps['maxName'] = field.preps['name'] + 'Max';
      field.preps['minName'] = field.preps['name'] + 'Min';
      let val = context.attrs['formData'][field.preps['name']];
      if (val) {
        let data = val.split('-');
        context.attrs['formData'][field.preps['minName']] = Number(data[0]);
        context.attrs['formData'][field.preps['maxName']] = Number(data[1]);
      }
      if (!context.attrs['isSearch']) {
        allAction(context, actionName.value, true);
      }
    });
    watch(
        () => context.attrs['formFieldList'],
        () => {
          itemAction('init');
        },
        {immediate: true, deep: true}
    );
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      actionName,
      itemAction,
      handleBlur,
      handleFocus,
      isFocus,
      slotStyle
    };
  }
});
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
