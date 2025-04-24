<script setup lang="ts" name="help">
  import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';

  defineProps({
    width: { type: Number, default: 340 },
    message: { type: String, required: true, default: '帮助' }
  });
</script>
<template>
  <el-popover trigger="hover" :popper-style="{ width: 'unset !important' }" placement="bottom-start">
    <template #reference>
      <star-horse-icon icon-class="help" color="var(--star-horse-style)" size="12px" style="cursor: pointer" />
    </template>
    <div style="font-size: 12px">
      <pre
        >{{ message }}
      </pre>
    </div>
  </el-popover>
</template>
<style scoped lang="scss"></style>
