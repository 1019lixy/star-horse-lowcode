<script setup lang="ts">
import {ref} from "vue";

defineProps({
  needScroller: {
    type: Boolean,
    default: true,
  },
});
const shFormRef = ref();
const dataForm = defineModel("dataForm");
const getFields = () => {
  return shFormRef.value?.fields;
};
const validate = async () => {
  return await shFormRef.value?.validate();
};
defineExpose({
  getFields,
  validate,
});
</script>
<template>
  <slot name="header"></slot>
  <el-form :model="dataForm" v-bind="$attrs" class="data-form" ref="shFormRef">
    <el-scrollbar height="100%" v-if="needScroller">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <slot v-else name="empty"></slot>
    </el-scrollbar>
    <template v-else>
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <slot v-else name="empty"></slot>
    </template>
  </el-form>
  <slot name="button"></slot>
</template>
<style lang="scss" scoped></style>
