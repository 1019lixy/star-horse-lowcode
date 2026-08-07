<script setup lang="ts">
import JsBarcode from "jsbarcode";
import {nextTick, onMounted, ref, watch} from "vue";
import {allAction} from "../utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const barcodeRef = ref();
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const dataValue = ref<string>("");
const createCode = () => {
  if (!dataValue.value) {
    dataValue.value =
        props.field?.preps.value ?? formData.value[props.field.fieldName];
  }
  JsBarcode(barcodeRef.value, dataValue.value, {
    format: props.field.preps?.format ?? "CODE128", //选择要使用的条形码类型
    width: props.field.preps?.width ?? 2, //设置条之间的宽度
    height: props.field.preps?.height ?? 80, //高度
    displayValue: props.field.preps?.displayValue ?? true, //是否在条形码下方显示文字
    font: props.field.preps?.font, //设置文本的字体
    textAlign: props.field.preps?.textAlign ?? "center", //设置文本的水平对齐方式
    textPosition: props.field.preps?.textPosition ?? "bottom", //设置文本的垂直位置
    textMargin: props.field.preps?.textMargin ?? 6, //设置条形码和文本之间的间距
    fontSize: props.field.preps?.fontSize ?? 14, //设置文本的大小
    background: props.field.preps?.background ?? "#fff", //设置条形码的背景
    lineColor: props.field.preps?.lineColor ?? "#000", //设置条和文本的颜色。
    margin: props.field.preps?.margin ?? 10, //设置条形码周围的空白边距
    ...props.field.preps
  });
};
onMounted(() => {
  nextTick(() => {
    createCode();
    allAction(props, emits, formData, "change", true);
  });
});
watch(
    () => dataValue.value,
    (newValue) => {
      if (newValue) {
        formData.value[props.field.fieldName] = newValue;
      }
    },
    {immediate: true, deep: true},
);
watch(
    () => props.field.preps,
    () => {
      createCode();
      allAction(props, emits, formData, "change", false);
    },
    {immediate: false, deep: true},
);
</script>
<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <svg ref="barcodeRef"></svg>
  </starhorse-form-item>
</template>
<style scoped></style>
