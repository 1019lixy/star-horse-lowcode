<template>
  <star-horse-panel
    :type="dialogType"
    :title="title"
    :box-width="boxWidth"
    :userAction="true"
    @resetForm="handleReset"
    :hideFullScreenIcon="true"
    v-model="compVisible"
    @merge="handleConfirm"
    @closeAction="$emit('update:modelValue', false)"
  >
    <el-input
      v-model="content"
      type="textarea"
      :rows="20"
      :disabled="disabled"
      resize="both"
      show-word-limit
      :placeholder="placeholder"
      :autofocus="true"
    />
  </star-horse-panel>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { i18n } from "@/lang";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: i18n("item.editData"),
  },
  boxWidth: {
    type: String,
    default: "50%",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  placeholder: String,
  initialContent: String,
  dialogType: { type: String as () => "dialog" | "drawer" },
});

const content = ref("");
const emit = defineEmits(["update:modelValue", "confirm"]);
const compVisible = ref(false);
const handleConfirm = () => {
  emit("confirm", content.value);
  emit("update:modelValue", false);
};

const handleReset = () => {
  content.value = "";
};
// 新增内容监听
watch(
  () => props.initialContent,
  (newVal) => {
    content.value = newVal || "";
  },
  { immediate: true },
);
watch(
  () => props.modelValue,
  (newVal) => {
    compVisible.value = newVal;
  },
  { immediate: true },
);
</script>
