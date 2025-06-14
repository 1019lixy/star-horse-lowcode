<script setup lang="ts">
import {ref} from 'vue';
defineProps({

  needScroller: {
    type: Boolean,
    default: true
  }
})
const shFormRef = ref();
const dataForm = defineModel("dataForm");
</script>
<template>
  <slot name="header"></slot>
  <el-form :model="dataForm" v-bind="$attrs" class="data-form" ref="shFormRef">
    <el-scrollbar height="100%" v-if="needScroller">
      <slot></slot>
    </el-scrollbar>
    <slot v-else></slot>
  </el-form>

  <slot name="button"></slot>
</template>
<style lang="scss" scoped>
:deep(.el-scrollbar__view) {
  height: 100% !important;
}
</style>
