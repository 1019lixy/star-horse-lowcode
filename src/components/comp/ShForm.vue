<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps({
  formSize: {
    type: String,
    default: "default"
  },
  labelPosition: {
    type: String,
    default: "right"
  },
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const shFormRef = ref();
const dataForm = defineModel("dataForm");
</script>
<template>
  <slot name="header"></slot>
  <el-scrollbar height="100%">
    <el-form
        :model="dataForm"
        :size="formSize"
        :rules="rules"
        :scroll-to-error="true"
        :scroll-into-view-options="true"
        :inline-message="false"
        :status-icon="true"
        :label-position="labelPosition"
        require-asterisk-position="right"
        label-width="auto"
        class="data-form"
        ref="shFormRef"
    >
      <slot></slot>
    </el-form>
  </el-scrollbar>
  <slot name="button"></slot>
</template>
<style lang="scss" scoped>
:deep(.el-scrollbar__view) {
  height: inherit !important;
}

</style>
