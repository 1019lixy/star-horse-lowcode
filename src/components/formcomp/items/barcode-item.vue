<script setup lang="ts">
import Vue3Barcode from "vue3-barcode";
import { computed, nextTick, onMounted, PropType, ref, watch } from "vue";
import { allAction } from "../utils/ItemRelationEventUtils";

const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
});
const barcodeRef = ref();
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const dataValue = computed(() => formData.value[props.field.preps?.name]);
const createCode = () => {
  barcodeRef.value = {
    format: props.field.preps?.format ?? "CODE39", //选择要使用的条形码类型
    width: props.field.preps?.width ?? 1, //设置条之间的宽度
    height: props.field.preps?.height ?? 40, //高度
    displayValue: props.field.preps?.displayValue ?? true, //是否在条形码下方显示文字
    // text: dataValue.value,//覆盖显示的文本
    fontOptions: props.field.preps?.fontOptions, //使文字加粗体或变斜体
    font: props.field.preps?.font, //设置文本的字体
    textAlign: props.field.preps?.textAlign ?? "center", //设置文本的水平对齐方式
    textPosition: props.field.preps?.textPosition ?? "bottom", //设置文本的垂直位置
    textMargin: props.field.preps?.textMargin ?? 5, //设置条形码和文本之间的间距
    fontSize: props.field.preps?.fontSize ?? 15, //设置文本的大小
    background: props.field.preps?.fontSize ?? "#fff", //设置条形码的背景
    lineColor: props.field.preps?.fontSize ?? "#000", //设置条和文本的颜色。
    margin: props.field.preps?.margin ?? 15, //设置条形码周围的空白边距
  };
};
onMounted(() => {
  nextTick(() => {
    createCode();
    allAction(props, emits, formData, "change", true);
  });
});
watch(
  () => [dataValue.value, props.field.preps],
  () => {
    createCode();
    allAction(props, emits, formData, "change", false);
  },
  { immediate: false, deep: true },
);
</script>
<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <Vue3Barcode :value="dataValue" :options="barcodeRef" />
  </starhorse-form-item>
</template>
<style scoped></style>
