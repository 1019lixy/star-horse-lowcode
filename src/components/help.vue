<script setup lang="ts" name="help">
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import { i18n } from "@/lang";

defineProps({
  width: { type: Number, default: 340 },
  message: { type: String, required: true, default: i18n("common.help") },
});
</script>
<template>
  <el-popover
      trigger="hover"
      :popper-style="{ width: width + 'px', 'max-width': 'calc(100vw - 24px) !important', 'z-index': 10000 }"
      placement="bottom-start"
  >
    <template #reference>
      <star-horse-icon
        icon-class="help"
        color="var(--star-horse-style)"
        size="12px"
        style="cursor: pointer"
      />
    </template>
    <div class="help-content">
      <pre>{{ message }}</pre>
    </div>
  </el-popover>
</template>
<style scoped lang="scss">
.help-content {
  font-size: 12px;
  max-height: 80vh;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
