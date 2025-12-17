<template>
  <EditDataDialog
      v-model="dialogInputVisible"
      :disabled="checkIsDisabled(props)"
      :initial-content="String(formData[field.fieldName])"
      @confirm="handleContentConfirm"
  />
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-input
        :disabled="checkIsDisabled(props)"
        v-bind="prepsFilter(field.preps)"
        type="text"
        ref="inputItemRef"
        :fid="field.fieldName"
        class="input-with-select"
        v-on="getDynamicEvents(props, itemAction)"
        @dblclick.stop="editContent"
        v-model="normalData"
    >
      <template #prefix>
        <star-horse-icon :icon-class="field.preps?.prefixIcon" v-if="field.preps?.prefixIcon"/>
        <span v-if="field.preps?.prefix">{{ field.preps?.prefix }}</span>
      </template>
      <template #suffix>
        <star-horse-icon :icon-class="field.preps?.suffixIcon" v-if="field.preps?.suffixIcon"/>
        <span v-if="field.preps?.suffix">{{ field.preps?.suffix }}</span>
      </template>
      <template #prepend v-if="field.preps?.prependText">
        {{ field.preps?.prependText }}
      </template>
      <template #prepend v-if="prependList?.length>0">
        <el-select v-model="formData[preName]" style="width: 115px !important;">
          <el-option
              v-for="item in prependList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps?.appendText">
        {{ field.preps?.appendText }}
      </template>
      <template #append v-if="field.preps?.appendAction">
        <star-horse-icon
            :title="field.preps?.appendAction?.actionTitle"
            style="cursor: pointer"
            :icon-class="field.preps?.appendAction?.icon || 'document'"
            @click="field.preps?.appendAction?.actions?.(formData)"
        />
      </template>
      <template #append v-if="appendList?.length>0">
        <el-select v-model="formData[appName]" style="width: 115px !important;">
          <el-option
              v-for="item in appendList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
          />
        </el-select>
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {getDynamicEvents} from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  convertData,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {StarHorseIcon} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

defineOptions({
  name: "InputItem",
});
const props = defineProps<ItemPreps>();
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const inputItemRef = ref();
const normalData = ref();
const dialogInputVisible = ref<boolean>(false);
const initEvent = async () => {
  await nextTick();
};
const preName = computed(() => {
  return props.field?.preps?.preName ?? "pre" + props.field.fieldName;
});
const appName = computed(() => {
  return props.field?.preps?.appName ?? "app" + props.field.fieldName;
});
const appendList = computed(() => convertData(props.field?.preps?.appendList));
const prependList = computed(() => convertData(props.field?.preps?.prependList));
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const handleContentConfirm = (newContent: string) => {
  // 通过设置normalData来触发合并逻辑
  normalData.value = newContent;
  dialogInputVisible.value = false;
};
const editContent = () => {
  dialogInputVisible.value = true;
};
// 根据主字段值查找匹配的前缀
const findMatchingPrefix = (mainValue: string) => {
  // 如果formData中已经有前缀值，直接使用
  if (formData.value[preName.value]) {
    return formData.value[preName.value];
  }

  // 遍历前缀列表，找到与主字段值开头匹配的前缀
  if (prependList.value && prependList.value.length > 0) {
    for (const item of prependList.value) {
      const itemValue = item.value || "";
      if (mainValue.startsWith(itemValue)) {
        // 找到匹配的前缀，设置到formData中
        formData.value[preName.value] = itemValue;
        return itemValue;
      }
    }
  }

  return "";
};

// 根据主字段值查找匹配的后缀
const findMatchingSuffix = (mainValue: string) => {
  // 如果formData中已经有后缀值，直接使用
  if (formData.value[appName.value]) {
    return formData.value[appName.value];
  }

  // 遍历后缀列表，找到与主字段值结尾匹配的后缀
  if (appendList.value && appendList.value.length > 0) {
    for (const item of appendList.value) {
      const itemValue = item.value || "";
      if (mainValue.endsWith(itemValue)) {
        // 找到匹配的后缀，设置到formData中
        formData.value[appName.value] = itemValue;
        return itemValue;
      }
    }
  }

  return "";
};

// 解析主字段值，分离前缀和后缀部分
const parseMainValue = () => {
  const mainValue = formData.value[props.field.fieldName] || "";
  let parsedValue = String(mainValue);

  // 如果需要合并前缀，尝试分离前缀值
  if (props.field?.preps?.mergePrefix) {
    // 根据主字段值查找匹配的前缀
    const prefixValue = findMatchingPrefix(parsedValue);
    if (prefixValue && parsedValue.startsWith(prefixValue)) {
      parsedValue = parsedValue.slice(prefixValue.length);
    }
  }

  // 如果需要合并后缀，尝试分离后缀值
  if (props.field?.preps?.mergeAppend) {
    // 根据主字段值查找匹配的后缀
    const suffixValue = findMatchingSuffix(parsedValue);
    if (suffixValue && parsedValue.endsWith(suffixValue)) {
      parsedValue = parsedValue.slice(0, -suffixValue.length);
    }
  }

  return parsedValue;
};

// 统一的合并逻辑函数
const mergeData = (isParsing = false) => {
  // 确保值的类型安全
  let baseValue = isParsing ? parseMainValue() : (normalData.value || "");

  // 如果是解析模式，设置normalData并返回
  if (isParsing) {
    normalData.value = baseValue;
    return;
  }

  // 开始构建合并后的值
  let mergedValue = baseValue;

  // 合并前缀（如果需要）
  if (props.field?.preps?.mergePrefix) {
    // 从formData获取前缀值（parseMainValue已经确保了正确的值）
    const prefixValue = formData.value[preName.value];
    if (prefixValue) {
      mergedValue = prefixValue + mergedValue;
    }
  }

  // 合并后缀（如果需要）
  if (props.field?.preps?.mergeAppend) {
    // 从formData获取后缀值（parseMainValue已经确保了正确的值）
    const suffixValue = formData.value[appName.value];
    if (suffixValue) {
      mergedValue = mergedValue + suffixValue;
    }
  }

  // 更新主字段值（避免不必要的更新）
  if (formData.value[props.field.fieldName] !== mergedValue) {
    formData.value[props.field.fieldName] = mergedValue;
  }
};

// 初始化数据解析
onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
    // 初始化数据解析
    mergeData(true);
  });
  initEvent();
});

// 监听normalData变化，触发合并
watch(() => normalData.value, (val) => {
  mergeData();
}, {immediate: false});

// 监听前缀变化，触发合并
watch(() => formData.value[preName.value], (val) => {
  mergeData();
});

// 监听后缀变化，触发合并
watch(() => formData.value[appName.value], (val) => {
  mergeData();
});

// 监听主字段值变化，触发解析（用于外部修改主字段值的情况）
watch(() => formData.value[props.field.fieldName], (val) => {
  mergeData(true);
}, {immediate: true});

// 监听前缀或后缀列表变化，重新解析
watch([prependList, appendList], () => {
  // 只有在需要合并且列表有变化时才重新解析
  if ((props.field?.preps?.mergePrefix && prependList.value.length > 0) ||
      (props.field?.preps?.mergeAppend && appendList.value.length > 0)) {
    // 清除当前的前缀/后缀值，让系统重新匹配
    if (props.field?.preps?.mergePrefix) {
      formData.value[preName.value] = undefined;
    }
    if (props.field?.preps?.mergeAppend) {
      formData.value[appName.value] = undefined;
    }
    // 重新解析主字段值
    mergeData(true);
  }
});
</script>
<style lang="scss" scoped>
.input-with-select .el-input-group__prepend,
.input-with-select .el-input-group__append {
  background-color: var(--el-fill-color-blank);
}
</style>
