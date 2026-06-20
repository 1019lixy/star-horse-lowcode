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
        v-on="getDynamicEvents(props, itemAction,formData)"
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
  initCompCallEvent,
  prepsFilter,
  setupFormulaWatchers,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {usePrefixSuffix} from "@/components/formcomp/utils/prefixSuffixUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {StarHorseIcon} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

defineOptions({
  name: "InputItem",
});
const props = defineProps<ItemPreps>();
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const inputItemRef = ref();
const dialogInputVisible = ref<boolean>(false);

const {
  preName,
  appName,
  prependList,
  appendList,
  normalData,
  mergeData,
  setupWatchers,
} = usePrefixSuffix({
  field: props.field,
  formData: formData as any,
});

const initEvent = async () => {
  await nextTick();
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const handleContentConfirm = (newContent: string) => {
  normalData.value = newContent;
  dialogInputVisible.value = false;
};

const editContent = () => {
  if (!props.field.preps?.readonly && !props.field.preps?.disabled && !props.field.disabled) {
    dialogInputVisible.value = true;
  }
};

// 公式计算 watch 清理
let formulaStops: (() => void)[] = [];

onMounted(() => {
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
    mergeData(true);
    // 初始化公式计算监听
    formulaStops = setupFormulaWatchers(props.field, props.formInfo, formData, watch);
  });
  initEvent();
});

onBeforeUnmount(() => {
  formulaStops.forEach(stop => stop());
  formulaStops = [];
});

setupWatchers();
</script>
<style lang="scss" scoped>
.input-with-select .el-input-group__prepend,
.input-with-select .el-input-group__append {
  background-color: var(--el-fill-color-blank);
}
</style>
