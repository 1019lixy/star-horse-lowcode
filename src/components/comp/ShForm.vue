<script setup lang="ts">
import {provide, ref} from "vue";

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
provide("starHorseFormRef", shFormRef);
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
        <slot :form="dataForm"></slot>
      </template>
      <slot v-else name="empty" :form="dataForm"></slot>
    </el-scrollbar>
    <template v-else>
      <template v-if="$slots.default">
        <slot :form="dataForm"></slot>
      </template>
      <slot v-else name="empty" :form="dataForm"></slot>
    </template>
  </el-form>
  <slot name="button" :form="dataForm"></slot>
</template>
<style lang="scss" scoped></style>
