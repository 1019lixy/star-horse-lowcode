<script setup lang="ts" name="ShErrorTooltip">
/**
 * 表单校验错误提示：el-form-item 的 #error slot 专用渲染组件
 * 校验失败时字段旁显示红色异常图标（不占布局），鼠标点击图标弹出浅色气泡查看错误信息，
 * 气泡 teleport 到 body 不拦截鼠标，不影响其他属性编辑；校验通过后图标随 error slot 卸载自动消失
 */
import {CircleCloseFilled} from "@element-plus/icons-vue";

defineProps({
  error: {type: String, default: ""},
});
</script>

<template>
  <el-tooltip
      :content="error"
      placement="left"
      effect="light"
      trigger="hover"
      popper-class="sh-valid-tooltip"
      :disabled="!error"
  >
    <span class="sh-valid-anchor">
      <el-icon class="sh-valid-icon" color="var(--el-color-danger)" >
        <CircleCloseFilled style="color: var(--el-color-danger); font-size: 14px;"/>
      </el-icon>
    </span>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.sh-valid-anchor {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  line-height: 1;
}

.sh-valid-icon {
  color: var(--el-color-danger);
  font-size: 14px;
}
</style>

<style lang="scss">
.sh-valid-tooltip.el-popper {
  max-width: 360px;
  line-height: 18px;
  color: var(--el-color-danger);
}
</style>
