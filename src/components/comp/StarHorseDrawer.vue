<script setup lang="ts" name="StarHorseDrawer">
import { computed, onMounted, provide, reactive, ref, watch } from "vue";
import { useZIndex } from "element-plus";
import { i18n } from "@/lang";
import { UserFuncInfo } from "@/components/types/PageFieldInfo";

import { compKey } from "@/api/system";
import { isMobile } from "@/api/device";

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
  dialogVisible: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
  isShowReset: { type: Boolean, default: true },
  isShowSave: { type: Boolean, default: false },
  isShowBtnContinue: { type: Boolean, default: false },
  resizable: { type: Boolean, default: true },
  modal: { type: Boolean, default: true },
  //'rtl' | 'ltr' | 'ttb' | 'btt'
  direction: { type: String, default: "rtl" },
  boxWidth: { type: String, default: "60%" },
  isBatch: { type: Boolean, default: false },
  fullScreen: { type: Boolean, default: false },
  hideFullScreenIcon: { type: Boolean, default: false },
  hideMinimizeIcon: { type: Boolean, default: false },
  //自定义提交
  selfFunc: { type: Boolean, default: false },
  //自定义关闭
  selfClose: { type: Boolean, default: false },
  btnText: { type: String },
  userBtn: { type: Array<UserFuncInfo>, default: [] },
  btnTextContinue: { type: String, default: i18n("common.submitAndContinue") },
  title: { type: String, default: "" },
  source: { type: Number, default: 1 },
  compSize: { type: String, default: "default" },
  /** 手动指定 z-index；0 表示打开时自动计算（取当前页面最高弹层 +1） */
  zIndex: { type: Number, default: 0 },
  appendTo: { type: String, default: "body" },
  // ── el-drawer 属性透传（默认值与原硬编码一致，确保向后兼容） ──
  closeOnClickModal: { type: Boolean, default: false },
  closeOnPressEscape: { type: Boolean, default: false },
  showClose: { type: Boolean, default: false },
  withHeader: { type: Boolean, default: true },
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
  },
});
let isFullScreen = ref<boolean>(false);
const drawerWidth = computed(() =>
  isFullScreen.value || isMobile ? "100%" : props.boxWidth,
);
const _compKey = compKey;
let isMinimized = ref<boolean>(false);
let wasFullScreenBeforeMinimize = ref<boolean>(false);
let firstOpenStart = 0;

const dialogStyle = computed(() => {
  return {
    height: "100%",
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
/** 当前弹窗的 z-index（打开前计算） */
const activeZIndex = ref<number | undefined>(undefined);
/** 复用 EP 全局 z-index 计数器，确保与 el-drawer / el-popover 等弹层正确叠加 */
const { nextZIndex } = useZIndex();

const open = () => {
  const t = (performance.now() - firstOpenStart).toFixed(1);
  console.log(`[StarHorseDrawer] el-drawer @open 触发 t=${t}ms`);
  emits("open");
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
  if (props.selfFunc && funcName != "closeAction") {
    emits(funcName, type);
  } else {
    clickFunction["funcName"] = funcName;
    clickFunction["type"] = type;
  }
};
watch(
  () => windowsType.value,
  (val: boolean) => {
    if (val) {
      activeZIndex.value = props.zIndex > 0 ? props.zIndex : nextZIndex();
      isMinimized.value = false;
      if (isMobile) {
        isFullScreen.value = true;
      }
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <Teleport to="body">
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
        <path d="M3 3h10v10H3V3zm1 1v8h8V4H4z" />
        <path d="M6 6h4v4H6V6z" opacity="0.5" />
      </svg>
      <span class="minimized-title">{{
        title ||
        (source == 3 ? i18n("dialog.viewTitle") : i18n("dialog.editTitle"))
      }}</span>
    </div>
  </Teleport>

  <div class="di animated animate__fadeIn" v-show="!isMinimized" ref="diRef">
    <el-drawer
      :append-to-body="true"
      :append-to="appendTo"
      :destroy-on-close="true"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :lock-scroll="true"
      class="dialog-settings"
      :show-close="showClose"
      :with-header="withHeader"
      :resizable="resizable && !isFullScreen && !isMobile"
      :modal="modal"
      :modal-class="isMinimized ? 'sh-dialog-minimized' : ''"
      :direction="direction"
      v-model="windowsType"
      @close="beforeClose"
      @open="open"
      :size="drawerWidth"
      :zIndex="activeZIndex"
      :style="dialogStyle"
    >
      <template #header="{ close }">
        <h3 @dblclick="fullScreen">
          {{
            title ||
            (source == 3 ? i18n("dialog.viewTitle") : i18n("dialog.editTitle"))
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
                v-if="!!isFullScreen && resizable"
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
                v-if="!isFullScreen && resizable"
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
          :style="{ justifyContent: isFullScreen ? 'center' : 'end' }"
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
            <star-horse-icon icon-class="short_save" cursor="pointer" />{{
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
            <star-horse-icon icon-class="save" cursor="pointer" />{{
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
    </el-drawer>
  </div>
</template>
<style lang="scss">
/* teleport 到 body 后，el-drawer 不再是 .di 的子元素，
   scoped 的 :deep(.el-drawer) 无法匹配。改用 .dialog-settings 全局锚定。 */
.sh-dialog-minimized {
  display: none !important;
}

.dialog-settings.el-drawer {
  display: flex;
  flex-direction: column;
  padding: unset;

  .el-drawer__header {
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

  .el-drawer__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .el-drawer__footer {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
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
