/**
 * 弹窗底部按钮动作字典。
 *
 * 用于 StarHorseDialog / StarHorseDrawer / StarHorseModalBase 的 btnActions prop，
 * 通过传入动作类型即可切换按钮文案（国际化）、图标、样式与触发事件，
 * 避免在模板里硬编码按钮。特殊业务按钮请使用 extend / footer 插槽实现。
 *
 * 用法：
 * - 传字符串数组：使用预设配置，如 :btn-actions="['submit', 'cancel']"
 * - 传对象数组：覆盖预设字段，如 :btn-actions="[{ type: 'submit', label: '入库' }, 'cancel']"
 * - 不传：保持原有 isShowReset / isShowSave / isShowBtnContinue 驱动的硬编码按钮（向后兼容）
 */

/** 常见业务按钮动作类型 */
export type ModalBtnType =
  | "submit" // 提交
  | "submitContinue" // 提交并继续
  | "save" // 保存
  | "saveContinue" // 保存并继续
  | "draft" // 暂存
  | "draftContinue" // 暂存并继续
  | "confirm" // 确定
  | "cancel" // 取消
  | "reset" // 重置
  | "ok" // 好的
  | "apply" // 应用
  | "publish" // 发布
  | "publishContinue" // 发布并继续
  | "approve" // 通过
  | "reject" // 驳回
  | "withdraw" // 撤回
  | "next" // 下一步
  | "prev" // 上一步
  | "finish" // 完成
  | "print"; // 打印

/** 按钮样式变体 */
export type ModalBtnVariant = "primary" | "link" | "default" | "plain";

/** 单个按钮配置 */
export interface ModalBtnConfig {
  /** 动作类型（字典 key） */
  type: ModalBtnType;
  /** 覆盖文案（直接字符串，不经过 i18n） */
  label?: string;
  /** 覆盖 i18n key（优先于 label） */
  labelKey?: string;
  /** 覆盖图标名（传给 StarHorseIcon 的 icon-class，kebab-case） */
  icon?: string;
  /** 排序优先级（数字越小越靠前，默认取预设值） */
  priority?: number;
  /** 按钮样式变体（默认取预设值） */
  variant?: ModalBtnVariant;
  /** 是否显示，默认 true */
  visible?: boolean;
  /** 是否禁用，默认 false */
  disabled?: boolean;
  /** 触发的 operation 事件名（如 "merge"/"mergeDraft"/"resetForm"/"close"/"publish"） */
  action?: string;
  /** operation 的 type 参数（如 "close"/"continue"/"reset"） */
  actionType?: string;
}

/**
 * 预设动作字典：每个动作类型的默认配置。
 * action 为 "close" 时直接关闭弹窗（不触发 operation）；
 * 其余 action 通过 operation(action, actionType) 分发，需配合 userAction=true 在外部 @监听，
 * 或由弹窗内表单组件消费 provide 的 dialogOperation。
 */
export const MODAL_BTN_PRESETS: Record<ModalBtnType, Omit<ModalBtnConfig, "type">> = {
  submit: { labelKey: "dialog.submit", icon: "save", priority: 100, variant: "primary", action: "merge", actionType: "close" },
  submitContinue: { labelKey: "dialog.submitContinue", icon: "save_continue", priority: 110, variant: "primary", action: "merge", actionType: "continue" },
  save: { labelKey: "dialog.save", icon: "short_save", priority: 120, variant: "link", action: "mergeDraft", actionType: "close" },
  saveContinue: { labelKey: "dialog.saveContinue", icon: "save", priority: 130, variant: "link", action: "mergeDraft", actionType: "continue" },
  draft: { labelKey: "dialog.draft", icon: "short_save", priority: 120, variant: "link", action: "mergeDraft", actionType: "close" },
  draftContinue: { labelKey: "dialog.draftContinue", icon: "save", priority: 130, variant: "link", action: "mergeDraft", actionType: "continue" },
  confirm: { labelKey: "dialog.confirm", icon: "save", priority: 100, variant: "primary", action: "merge", actionType: "close" },
  cancel: { labelKey: "dialog.cancel", icon: "close", priority: 200, variant: "link", action: "close", actionType: "close" },
  reset: { labelKey: "dialog.reset", icon: "undo", priority: 210, variant: "link", action: "resetForm", actionType: "reset" },
  ok: { labelKey: "dialog.ok", icon: "save", priority: 100, variant: "primary", action: "close", actionType: "close" },
  apply: { labelKey: "dialog.apply", icon: "save", priority: 100, variant: "primary", action: "merge", actionType: "close" },
  publish: { labelKey: "dialog.publish", icon: "save", priority: 100, variant: "primary", action: "publish", actionType: "close" },
  publishContinue: { labelKey: "dialog.publishContinue", icon: "save_continue", priority: 110, variant: "primary", action: "publish", actionType: "continue" },
  approve: { labelKey: "dialog.approve", icon: "save", priority: 100, variant: "primary", action: "approve", actionType: "close" },
  reject: { labelKey: "dialog.reject", icon: "close", priority: 120, variant: "link", action: "reject", actionType: "close" },
  withdraw: { labelKey: "dialog.withdraw", icon: "undo", priority: 130, variant: "link", action: "withdraw", actionType: "close" },
  next: { labelKey: "dialog.next", icon: "save", priority: 100, variant: "primary", action: "next", actionType: "close" },
  prev: { labelKey: "dialog.prev", icon: "undo", priority: 90, variant: "link", action: "prev", actionType: "close" },
  finish: { labelKey: "dialog.finish", icon: "save", priority: 100, variant: "primary", action: "finish", actionType: "close" },
  print: { labelKey: "dialog.print", icon: "save", priority: 150, variant: "link", action: "print", actionType: "close" },
};

/** 解析 btnActions 项为完整配置（合并预设 + 覆盖） */
export function resolveModalBtn(item: ModalBtnType | ModalBtnConfig): ModalBtnConfig {
  if (typeof item === "string") {
    return { type: item, ...MODAL_BTN_PRESETS[item] };
  }
  return { ...MODAL_BTN_PRESETS[item.type], ...item };
}