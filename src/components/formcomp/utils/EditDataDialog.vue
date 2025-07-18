<template>
  <star-horse-dialog
    :title="title"
    :box-width="boxWidth"
    :self-func="true"
    @resetForm="handleReset"
    :hideFullScreenIcon="true"
    :dialog-visible="modelValue"
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
    />
  </star-horse-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "编辑数据",
  },
  boxWidth: {
    type: String,
    default: "50%",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: String,
  initialContent: String,
});

const content = ref("");
const emit = defineEmits(["update:modelValue", "confirm"]);

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
);
</script>
