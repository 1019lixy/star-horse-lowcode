import type { PropType } from "vue";
import { i18n } from "@/lang";
import { UserFuncInfo } from "@/components/types/PageFieldInfo";
import type { ModalBtnConfig, ModalBtnType } from "@/components/types/ModalBtnConfig";

/** StarHorseModal 容器形态：dialog=居中弹窗，drawer=侧滑抽屉 */
export type StarHorseModalMode = "dialog" | "drawer";

/** 底部按钮区整体对齐位置 */
export type ModalBtnAlign = "center" | "start" | "end" | "between" | "around";

/**
 * StarHorseDialog / StarHorseDrawer / StarHorseModalBase 共享 props。
 * 默认值与历史两个组件的硬编码完全一致，保证对外行为向后兼容。
 * StarHorseModalBase 按声明；薄壳声明后经 v-bind 透传。
 */
const starHorseModalPropsBase = {
  /** 容器形态（由薄壳固定传入，外部无需传） */
  mode: { type: String as PropType<StarHorseModalMode>, default: "dialog" },
  dialogVisible: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
  isShowReset: { type: Boolean, default: true },
  isShowSave: { type: Boolean, default: false },
  isShowBtnContinue: { type: Boolean, default: false },
  // ── el-dialog 专属 ──
  draggable: { type: Boolean, default: true },
  boxHeight: { type: String, default: "auto" },
  top: { type: String, default: "15vh" },
  center: { type: Boolean, default: false },
  destroyOnClose: { type: Boolean, default: true },
  // ── el-drawer 专属 ──
  resizable: { type: Boolean, default: true },
  //'rtl' | 'ltr' | 'ttb' | 'btt'
  direction: { type: String, default: "rtl" },
  withHeader: { type: Boolean, default: true },
  // ── 公共 ──
  boxWidth: { type: String, default: "60%" },
  isBatch: { type: Boolean, default: false },
  fullScreen: { type: Boolean, default: false },
  hideFullScreenIcon: { type: Boolean, default: false },
  hideMinimizeIcon: { type: Boolean, default: false },
  //自定义提交
  userAction: { type: Boolean, default: false },
  //自定义事件排除事件名,在排除中的，则走系统默认事件
  userActionExcludeEventNames: {
    type: Array as PropType<Array<String>>,
    default: () => ["resetForm"],
  },
  btnText: { type: String },
  userBtn: {
    type: Array as PropType<UserFuncInfo[]>,
    default: () => [],
  },
  btnTextContinue: { type: String, default: i18n("common.submitAndContinue") },
  /**
   * 底部按钮动作字典。传入后按 MODAL_BTN_PRESETS 预设渲染按钮（文案/图标/样式/事件），
   * 元素可为动作类型字符串（用预设）或 ModalBtnConfig 对象（覆盖预设）。
   * 不传时保持 isShowReset / isShowSave / isShowBtnContinue 驱动的硬编码按钮（向后兼容）。
   * 详见 docs/components/modal-btn-actions.md
   */
  btnActions: {
    type: Array as PropType<Array<ModalBtnType | ModalBtnConfig>>,
    default: undefined,
  },
  /**
   * 底部按钮区整体对齐位置。不传时保持默认（dialog 居中 / drawer 靠右、全屏居中）。
   * 传 "center"/"start"/"end"/"between"/"around" 覆盖默认对齐。
   */
  btnAlign: {
    type: String as PropType<ModalBtnAlign>,
    default: undefined,
  },
  title: { type: String, default: "" },
  source: { type: Number, default: 1 },
  compSize: { type: String, default: "default" },
  /** 手动指定 z-index；0 表示打开时自动计算（取当前页面最高弹层 +1） */
  zIndex: { type: Number, default: 0 },
  appendTo: { type: String, default: "body" },
  modal: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: false },
  closeOnPressEscape: { type: Boolean, default: false },
  showClose: { type: Boolean, default: false },
};

/** 完整 props（含 mode），供 StarHorseDialog / StarHorseDrawer / StarHorseModalBase 使用 */
export const starHorseModalProps = starHorseModalPropsBase;

/** 排除 mode 的 props，供 StarHorsePanel 使用（Panel 自身有 type 字段替代 mode） */
export const panelModalProps = Object.fromEntries(
  Object.entries(starHorseModalPropsBase).filter(([k]) => k !== "mode"),
);

/** StarHorseModal 共享事件（薄壳不声明 emits，经 $attrs 原样透传，由 ModalBase 触发） */
export const starHorseModalEmits = [
  "merge",
  "mergeDraft",
  "resetForm",
  "open",
  "closeAction",
  "minimize",
  "update:dialogVisible",
  "update:modelValue",
  // ── btnActions 字典扩展事件（配合 userAction=true 在外部监听）──
  "publish",
  "approve",
  "reject",
  "withdraw",
  "next",
  "prev",
  "finish",
  "print",
  "apply",
];
