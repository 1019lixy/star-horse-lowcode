<script setup lang="ts" name="StarHorseDialog">
import {computed, nextTick, onMounted, provide, reactive, ref, watch,} from "vue";
import {i18n} from "@/lang";
import {UserFuncInfo} from "@/components/types/PageFieldInfo";

import {compKey} from "@/api/system";
import {isMobile} from "@/api/device";

const emits = defineEmits([
  "merge",
  "mergeDraft",
  "resetForm",
  "open",
  "closeAction",
  "minimize",
  "update:dialogVisible",
  "update:modelValue",
]);
const props = defineProps({
  dialogVisible: {type: Boolean, default: false},
  modelValue: {type: Boolean, default: false},
  // dialogProps: {type: Object as PropType<DialogProps>, default: {}},
  isShowReset: {type: Boolean, default: true},
  isShowSave: {type: Boolean, default: false},
  isShowBtnContinue: {type: Boolean, default: false},
  draggable: {type: Boolean, default: true},
  boxHeight: {type: String, default: "auto"},
  boxWidth: {type: String, default: "60%"},
  isBatch: {type: Boolean, default: false},
  fullScreen: {type: Boolean, default: false},
  hideFullScreenIcon: {type: Boolean, default: false},
  hideMinimizeIcon: {type: Boolean, default: false},
  //自定义提交
  selfFunc: {type: Boolean, default: false},
  //自定义关闭
  selfClose: {type: Boolean, default: false},
  btnText: {type: String},
  userBtn: {type: Array<UserFuncInfo>, default: []},
  btnTextContinue: {type: String, default: i18n("common.submitAndContinue")},
  title: {type: String, default: ""},
  source: {type: Number, default: 1},
  compSize: {type: String, default: "default"},
  /** 手动指定 z-index；0 表示打开时自动计算（取当前页面最高弹层 +1） */
  zIndex: {type: Number, default: 0},
  appendTo: {type: String, default: "body"},
});
let windowsType = computed({
  get() {
    // 优先取v-model绑定的modelValue，没有再取dialogVisible
    return props.modelValue ?? props.dialogVisible;
  },
  set(val) {
    // 两个事件都触发，外部两种v-model写法都能更新
    emits("update:dialogVisible", val);
    emits("update:modelValue", val);
  }
});
const _compKey = compKey;

let isFullScreen = ref<boolean>(false);
// 最小化状态
let isMinimized = ref<boolean>(false);
// 记住最小化前是否全屏
let wasFullScreenBeforeMinimize = ref<boolean>(false);

const dialogStyle = computed(() => {
  return {
    height: isFullScreen.value ? "100%" : props.boxHeight,
    "max-height": "100%",
  };
});
const beforeClose = () => {
  // 无论 selfClose 与否，都必须先同步父组件状态，否则 dialogVisible 卡死无法再次打开
  emits("update:dialogVisible", false);
  emits("update:modelValue", false);
  emits("closeAction");
  windowsType.value = false;
  isMinimized.value = false;
  if (props.selfClose) {
    return;
  }

};
// 新增：安全调用函数的方法
const callFunc = (func: any) => {
  if (typeof func === "function") {
    func(); // 仅当 func 是函数时调用
  } else if (typeof func === "string") {
    // 如果 func 是字符串（方法名），可根据需要映射到实际函数（示例）
    // const method = getCurrentInstance()?.proxy?.[func];
    // if (method) method();
  }
};
/** 当前弹窗的 z-index（打开时计算） */
const activeZIndex = ref(0);
const diRef = ref<HTMLElement>();

/** 获取当前页面所有 .el-overlay 中的最高 z-index */
const getMaxOverlayZIndex = (): number => {
  let maxZ = 0;
  for (const el of document.querySelectorAll(".el-overlay")) {
    const z = parseInt(getComputedStyle(el).zIndex, 10);
    if (!isNaN(z) && z > maxZ) maxZ = z;
  }
  return maxZ;
};

/** 将计算/指定的 z-index 直接写入 el-overlay 行内样式 */
const applyOverlayZIndex = (z: number) => {
  activeZIndex.value = z;
  const overlay = diRef.value?.querySelector(".el-overlay") as HTMLElement | null;
  if (overlay) overlay.style.zIndex = String(z);
};

const open = () => {
  emits("open");
  nextTick(() => {
    const z = props.zIndex > 0 ? props.zIndex : Math.max(getMaxOverlayZIndex(), 2000) + 1;
    applyOverlayZIndex(z);
  });
};


onMounted(() => {
  // 手机模式默认最大化
  if (isMobile && windowsType.value) {
    isFullScreen.value = true;
  }
});
provide("closeDialog", beforeClose);
const fullScreen = () => {
  if (props.hideFullScreenIcon) return;
  isFullScreen.value = !isFullScreen.value;
};
const minimize = () => {
  if (props.hideMinimizeIcon) return;
  wasFullScreenBeforeMinimize.value = isFullScreen.value;
  isMinimized.value = true;
  emits("minimize");
};
const restoreFromMinimize = () => {
  isMinimized.value = false;
  isFullScreen.value = wasFullScreenBeforeMinimize.value;
};
const clickFunction = reactive<Record<any, any>>({});
provide("dialogOperation", clickFunction);
const operation = (funcName: any, type: string) => {
  if (props.selfFunc && funcName != "resetForm" && funcName != "closeAction") {
    emits(funcName, type);
  } else {
    clickFunction["funcName"] = funcName;
    clickFunction["type"] = type;
  }
  console.log(clickFunction);
};
watch(
    () => windowsType.value,
    (val: boolean) => {
      if (val) {
        // 打开时重置最小化状态
        isMinimized.value = false;
        // 手机模式默认最大化
        if (isMobile) {
          isFullScreen.value = true;
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
);
</script>
<template>
  <Teleport to="body">
    <!-- 最小化后的折叠图标 -->
    <div
        v-if="isMinimized && windowsType"
        class="dialog-minimized-bar"
        @click="restoreFromMinimize"
        :title="i18n('dialog.restore')"
    >
      <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="currentColor"
          class="minimized-icon"
      >
        <path d="M3 3h10v10H3V3zm1 1v8h8V4H4z"/>
        <path d="M6 6h4v4H6V6z" opacity="0.5"/>
      </svg>
      <span class="minimized-title">{{
          title ||
          (source == 3 ? i18n("dialog.viewTitle") : i18n("dialog.editTitle"))
        }}</span>
    </div>

    <div class="di animated animate__fadeIn" v-show="!isMinimized" ref="diRef">
      <el-dialog
          :append-to-body="false"
          :append-to="appendTo"
          :center="false"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :lock-scroll="true"
          class="dialog-settings"
          :fullscreen="isFullScreen || isMobile"
          :show-close="false"
          :draggable="draggable && !isFullScreen && !isMobile"
          :align-center="true"
          v-model="windowsType"
          @close="beforeClose"
          @open="open"
          :width="boxWidth"
          :zIndex="activeZIndex"
          :style="dialogStyle"
      >
        <template #header="{ close }">
          <h3 @dblclick="fullScreen">
            {{
              title ||
              (source == 3
                  ? i18n("dialog.viewTitle")
                  : i18n("dialog.editTitle"))
            }}
          </h3>
          <div class="my-header">
            <template v-if="!isMobile">
              <el-button
                  style="
                  background: var(--star-horse-style);
                  color: var(--star-horse-white);
                "
                  :size="compSize"
                  @click="minimize"
                  link
                  v-if="!hideMinimizeIcon"
                  :title="i18n('dialog.minimize')"
              >
                <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="currentColor"
                    style="cursor: pointer"
                >
                  <path
                      d="M2 8h12"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                  />
                </svg>
              </el-button>
              <template v-if="!hideFullScreenIcon">
                <el-button
                    style="
                    background: var(--star-horse-style);
                    color: var(--star-horse-white);
                  "
                    :size="compSize"
                    @click="fullScreen"
                    link
                    v-if="!!isFullScreen && draggable"
                    :title="i18n('dialog.resize')"
                >
                  <star-horse-icon
                      icon-class="fullscreen-shrink"
                      color="var(--star-horse-white)"
                      cursor="pointer"
                  />
                </el-button>
                <el-button
                    style="
                    background: var(--star-horse-style);
                    color: var(--star-horse-white);
                  "
                    :size="compSize"
                    @click="fullScreen"
                    link
                    v-if="!isFullScreen && draggable"
                    :title="i18n('dialog.fullScreen')"
                >
                  <star-horse-icon
                      icon-class="fullscreen-expand"
                      color="var(--star-horse-white)"
                      cursor="pointer"
                  />
                </el-button>
              </template>
            </template>
            <el-button
                style="
                background: var(--star-horse-style);
                color: var(--star-horse-white);
              "
                :size="compSize"
                @click="close"
                link
                :title="i18n('dialog.close')"
            >
              <star-horse-icon
                  icon-class="close"
                  color="var(--star-horse-white)"
                  cursor="pointer"
              />
            </el-button>
          </div>
        </template>
        <slot name="header"></slot>
        <div class="shdialog" :class="{ 'overflow-hidden': source == 3 }">
          <div class="dialog-body">
            <slot></slot>
            <div v-if="false" class="w-full h-[80px]"></div>
          </div>
        </div>
        <template #footer>
          <span
              class="dialog-footer"
              :class="{ 'app-btn': false }"
              v-if="source != 3"
          >
            <slot name="extend"></slot>
            <el-button
                @click="operation('merge', 'close')"
                style="
                background: var(--star-horse-style);
                color: var(--star-horse-white);
              "
                :size="compSize"
            >
              <star-horse-icon
                  icon-class="save"
                  cursor="pointer"
                  style="color: var(--star-horse-white)"
              />
              {{ btnText ?? i18n("dialog.submit") }}
            </el-button>
            <el-button
                @click="operation('merge', 'continue')"
                style="
                background: var(--star-horse-style);
                color: var(--star-horse-white);
              "
                :size="compSize"
                v-if="isShowBtnContinue"
            >
              <star-horse-icon
                  icon-class="save_continue"
                  cursor="pointer"
                  style="color: var(--star-horse-white)"
              />
              {{ i18n("dialog.submitContinue") }}</el-button
            >
            <el-button
                @click="operation('mergeDraft', 'close')"
                :size="compSize"
                link
                style="
                background: var(--star-horse-style);
                color: var(--star-horse-white);
              "
                v-if="isShowSave"
            >
              <star-horse-icon icon-class="short_save" cursor="pointer"/>{{
                i18n("dialog.save")
              }}</el-button
            >
            <el-button
                @click="operation('mergeDraft', 'continue')"
                :size="compSize"
                link
                style="
                background: var(--star-horse-style);
                color: var(--star-horse-white);
              "
                v-if="isShowSave && isShowBtnContinue"
            >
              <star-horse-icon icon-class="save" cursor="pointer"/>{{
                i18n("dialog.saveContinue")
              }}</el-button
            >
            <el-button
                v-for="item in userBtn"
                :key="_compKey(item, item.authority)"
                @click="callFunc(item.funcName)"
                :disabled="item.disabled ?? false"
                :style="{
                background: item.disabled
                  ? 'var(--star-horse-disable)'
                  : 'var(--star-horse-style)',
                color: 'var(--star-horse-white)',
              }"
                :size="compSize"
            >
              <star-horse-icon
                  :icon-class="item.icon"
                  cursor="pointer"
                  style="color: var(--star-horse-white)"
              />
              {{ item.btnName }}
            </el-button>
            <el-button
                @click="operation('resetForm', 'reset')"
                :size="compSize"
                link
                v-if="isShowReset"
            >
              <star-horse-icon
                  icon-class="undo"
                  cursor="pointer"
                  style="color: var(--star-horse-style)"
              />
              {{ i18n("dialog.reset") }}</el-button
            >
          </span>
          <slot name="footer"></slot>
        </template>
      </el-dialog>
    </div>
  </Teleport>
</template>
<style lang="scss" scoped>
:deep(.el-dialog__footer) {
  text-align: center;
}

// 最小化折叠栏
.dialog-minimized-bar {
  position: fixed;
  left: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  z-index: 99999;
  gap: 8px;
  padding: 8px 16px;
  background: var(--star-horse-style);
  color: var(--star-horse-white);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
  max-width: 260px;
  overflow: hidden;

  &:hover {
    box-shadow: 0 -2px 18px rgba(0, 0, 0, 0.4);
    transform: translateY(-2px);
  }

  .minimized-icon {
    flex-shrink: 0;
  }

  .minimized-title {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.di {
  :deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    padding: unset;

    .el-dialog__header {
      flex-shrink: 0;
      height: 50px;
      box-sizing: border-box;
      padding: 12px;
      background-color: var(--star-horse-style);
      margin: 0;
      border-bottom: var(--star-horse-shadow) 4px solid;
      display: flex;
      flex-direction: row;
      color: var(--star-horse-white);

      h3 {
        flex: 1;
        font-size: 14px;
      }

      .my-header {
        width: 100px;
        display: flex;
        justify-content: right;
        flex-direction: row;
        right: 10px;
      }
    }

    .el-dialog__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
}

.shdialog {
  flex: 1;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.app-btn {
  position: fixed;
  bottom: 60px;
  width: 100%;
}
</style>
