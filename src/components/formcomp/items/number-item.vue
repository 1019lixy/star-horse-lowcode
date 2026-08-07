<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <el-input-number
        :fid="field.fieldName"
        :disabled="checkIsDisabled(props)"
        v-bind="prepsFilter(field.preps)"
        :controls-position="field.controlsPosition??'right'"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="formData[field.fieldName]"
    >
      <template #prefix>
        <span v-if="field.preps?.prefix">{{ field.preps["prefix"] }}</span>
        <star-horse-icon
            :icon-class="field.preps?.prefixIcon"
            v-if="field.preps?.prefixIcon"
        />
      </template>
      <template #suffix>
        <span v-if="field.preps?.suffix">{{ field.preps["suffix"] }}</span>
        <star-horse-icon
            :icon-class="field.preps?.suffixIcon"
            v-if="field.preps?.suffixIcon"
        />
      </template>
    </el-input-number>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, watch} from "vue";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
  setupFormulaWatchers,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {getDynamicEvents} from "@/api/system";
import {ItemPreps} from "@/components/types/ItemPreps";
import {StarHorseIcon} from "@/components/comp";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";

defineOptions({
  name: "NumberItem",
});
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const initEvent = async () => {
  await nextTick();
};
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

// 公式计算 watch 清理
let formulaStops: (() => void)[] = [];

onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["step"] = props.field.preps["step"] || 1;
  props.field.preps["min"] = props.field.preps["min"] || 0;
  // 优先使用字段自身精度，其次公式精度，最后默认 0
  // 避免公式字段的小数结果被 el-input-number 的 precision=0 四舍五入
  props.field.preps["precision"] =
      props.field.preps["precision"] ??
      props.field.preps?.formula?.precision ??
      0;
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
    // 初始化公式计算监听
    formulaStops = setupFormulaWatchers(
        props.field,
        props.formInfo,
        formData,
        watch,
    );
  });

  initEvent();
});

onBeforeUnmount(() => {
  formulaStops.forEach((stop) => stop());
  formulaStops = [];
});
</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  width: 100% !important;
}
</style>
