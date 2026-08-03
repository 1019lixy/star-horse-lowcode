<template>
  <!--
    APP 端通用选择面板容器
    - 用于替代 Element Plus 下拉类组件（el-select / el-date-picker / el-cascader 等）
      默认的悬浮式 Popper 行为
    - 固定在屏幕顶部或底部，避免挤压页面导致变形
    - 内部通过 default slot 复用原 Element Plus 选择器，保持联动事件链
  -->
  <el-drawer
    v-model="visible"
    :title="title"
    :direction="direction"
    :size="size"
    :with-header="showHeader"
    :modal="true"
    resizable
    :modal-class="'sh-mobile-picker-modal'"
    :class="['sh-mobile-picker', `sh-mobile-picker--${placement}`]"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    append-to-body
    :show-close="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-if="showHeader" #header>
      <div class="sh-mobile-picker__header">
        <span class="sh-mobile-picker__title flex ">  <star-horse-icon iconClass="document" color="var(--star-horse-white)" />{{ title }}</span>
          <div class="flex flex-row items-center gap-3">
            <div class="flex flex-row items-center cursor-pointer" @click="handleCancel"><star-horse-icon iconClass="close" color="var(--star-horse-white)"/>{{ cancelText }}</div>
            <div class="flex flex-row items-center cursor-pointer" @click="handleConfirm">
              <star-horse-icon iconClass="save" color="var(--star-horse-white)" /> {{ confirmText }}
            </div>
          </div>
      </div>
    </template>

    <div class="sh-mobile-picker__body">
      <slot :confirm="handleConfirm" :cancel="handleCancel" />
    </div>


  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { StarHorseIcon } from "@/components/comp";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    /** 面板位置：底部 / 顶部 */
    placement?: "bottom" | "top";
    /** 面板高度占比 */
    size?: string;
    /** 是否显示头部 */
    showHeader?: boolean;
    /** 是否显示底部确认按钮 */
    showFooter?: boolean;
    /** 是否显示关闭图标 */
    showClose?: boolean;
    /** 确认按钮文案 */
    confirmText?: string;
    /** 取消按钮文案 */
    cancelText?: string;
  }>(),
  {
    title: "",
    placement: "bottom",
    size: "50%",
    showHeader: true,
    showFooter: true,
    showClose: true,
    confirmText: () => i18n("message.confirm") || "确认",
    cancelText: () => i18n("message.cancel") || "取消",
  },
);

const emits = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "open"): void;
  (e: "close"): void;
}>();

const visible = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  },
  { immediate: true },
);

watch(visible, (val) => {
  emits("update:modelValue", val);
});

const direction = computed<"btt" | "ttb">(() =>
  props.placement === "top" ? "ttb" : "btt",
);

const handleOpen = () => emits("open");
const handleClose = () => emits("close");

const handleConfirm = () => {
  emits("confirm");
  visible.value = false;
};

const handleCancel = () => {
  emits("cancel");
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.sh-mobile-picker {
  :deep(.el-drawer) {
    border-top-left-radius: var(--sh-mobile-picker-radius, 12px);
    border-top-right-radius: var(--sh-mobile-picker-radius, 12px);
  }

  :deep(.el-drawer__body) {
    display: flex;
    flex-direction: column;
    padding: 0;
    /* 兼容 iOS 底部安全区（home indicator），避免内容被遮挡 ~10px */
    padding-bottom: env(safe-area-inset-bottom);
    overflow: hidden;
  }

  &--top :deep(.el-drawer) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--sh-mobile-picker-radius, 12px);
    border-bottom-right-radius: var(--sh-mobile-picker-radius, 12px);
  }
}

.sh-mobile-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px 8px 5px;
  font-weight: 600;
  flex-shrink: 0;
}

.sh-mobile-picker__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sh-mobile-picker__body {
  padding: 4px 8px calc(10px + env(safe-area-inset-bottom));
  flex: 1;
  min-height: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>

<style lang="scss">
/* 全局样式：抽屉内嵌套 Element Plus 选择器时的样式修正 */
.sh-mobile-picker {
  /* 让内嵌的 el-select / el-date-picker 面板不再 teleported，避免位移错乱 */
  .el-select .el-select__popper,
  .el-date-editor .el-popper,
  .el-cascader .el-cascader__dropdown,
  .el-tree-select__popper {
    position: relative !important;
    transform: none !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
