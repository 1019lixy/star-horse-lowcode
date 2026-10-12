# 弹窗按钮动作字典（btnActions）

为 `StarHorseDialog` / `StarHorseDrawer` / `StarHorseModalBase` 提供的底部按钮国际化字典方案。
通过传入动作类型即可切换按钮的**文案（国际化）**、**图标**、**样式**与**触发事件**，
避免在模板里硬编码按钮；特殊业务按钮请使用 `extend` / `footer` 插槽实现。

## 设计目标

不同业务下弹窗底部需要显示不同按钮组合，例如：

| 业务场景 | 按钮组合 |
|---|---|
| 新增/编辑表单 | 提交、重置 |
| 连续录入 | 提交、提交并继续、重置 |
| 草稿保存 | 提交、保存、保存并继续、重置 |
| 暂存业务 | 提交、暂存、暂存并继续、取消 |
| 确认弹窗 | 确定、取消 |
| 提示弹窗 | 好的 |
| 审批弹窗 | 通过、驳回、撤回 |
| 发布业务 | 发布、发布并继续、取消 |
| 向导步骤 | 上一步、下一步、完成 |
| 打印预览 | 打印、取消 |

通过 `btnActions` 传入对应动作类型数组即可，文案与图标由字典 + 国际化自动切换。

## 基础用法

```vue
<template>
  <!-- 提交 + 取消 -->
  <StarHorseDialog
    v-model:dialogVisible="visible"
    :btn-actions="['submit', 'cancel']"
    :user-action="true"
    @merge="onMerge"
  >
    <StarHorseForm ref="formRef" :fieldList="fieldList" />
  </StarHorseDialog>

  <!-- 暂存业务：暂存、暂存并继续、提交、取消 -->
  <StarHorseDialog
    v-model:dialogVisible="visible"
    :btn-actions="['draft', 'draftContinue', 'submit', 'cancel']"
    :user-action="true"
    @mergeDraft="onDraft"
    @merge="onSubmit"
  >
    <StarHorseForm ref="formRef" :fieldList="fieldList" />
  </StarHorseDialog>

  <!-- 审批：通过、驳回、撤回 -->
  <StarHorseDialog
    v-model:dialogVisible="visible"
    :btn-actions="['approve', 'reject', 'withdraw']"
    :user-action="true"
    @approve="onApprove"
    @reject="onReject"
    @withdraw="onWithdraw"
  />
</template>
```

## 动作类型预设字典

每个动作类型在 `MODAL_BTN_PRESETS` 中有一份默认配置：

| 动作类型 | 文案(i18n key) | 图标 | priority | variant | action | actionType | 说明 |
|---|---|---|---|---|---|---|---|
| `submit` | `dialog.submit` 提交 | `save` | 100 | primary | `merge` | `close` | 提交后关闭 |
| `submitContinue` | `dialog.submitContinue` 提交并继续 | `save_continue` | 110 | primary | `merge` | `continue` | 提交后继续录入 |
| `save` | `dialog.save` 保存 | `short_save` | 120 | link | `mergeDraft` | `close` | 保存草稿后关闭 |
| `saveContinue` | `dialog.saveContinue` 保存并继续 | `save` | 130 | link | `mergeDraft` | `continue` | 保存草稿后继续 |
| `draft` | `dialog.draft` 暂存 | `short_save` | 120 | link | `mergeDraft` | `close` | 暂存（同 save 事件，文案不同） |
| `draftContinue` | `dialog.draftContinue` 暂存并继续 | `save` | 130 | link | `mergeDraft` | `continue` | 暂存并继续 |
| `confirm` | `dialog.confirm` 确定 | `save` | 100 | primary | `merge` | `close` | 确定（同 submit 事件，文案不同） |
| `cancel` | `dialog.cancel` 取消 | `close` | 200 | link | `close` | `close` | 直接关闭弹窗 |
| `reset` | `dialog.reset` 重置 | `undo` | 210 | link | `resetForm` | `reset` | 重置表单 |
| `ok` | `dialog.ok` 好的 | `save` | 100 | primary | `close` | `close` | 好的（纯关闭，如提示弹窗） |
| `apply` | `dialog.apply` 应用 | `save` | 100 | primary | `merge` | `close` | 应用（同 submit 事件） |
| `publish` | `dialog.publish` 发布 | `save` | 100 | primary | `publish` | `close` | 发布 |
| `publishContinue` | `dialog.publishContinue` 发布并继续 | `save_continue` | 110 | primary | `publish` | `continue` | 发布并继续 |
| `approve` | `dialog.approve` 通过 | `save` | 100 | primary | `approve` | `close` | 审批通过 |
| `reject` | `dialog.reject` 驳回 | `close` | 120 | link | `reject` | `close` | 审批驳回 |
| `withdraw` | `dialog.withdraw` 撤回 | `undo` | 130 | link | `withdraw` | `close` | 撤回 |
| `next` | `dialog.next` 下一步 | `save` | 100 | primary | `next` | `close` | 向导下一步 |
| `prev` | `dialog.prev` 上一步 | `undo` | 90 | link | `prev` | `close` | 向导上一步 |
| `finish` | `dialog.finish` 完成 | `save` | 100 | primary | `finish` | `close` | 向导完成 |
| `print` | `dialog.print` 打印 | `save` | 150 | link | `print` | `close` | 打印 |

**priority**：数字越小越靠左；同 priority 按数组顺序稳定排序。
**variant**：`primary`=主色背景实心按钮；`link`=链接式按钮（沿用主色背景白字，与原硬编码一致）；`default`/`plain`=Element Plus 默认/朴素按钮。
**action**：`close` 直接关闭弹窗（调用 `beforeClose`）；其余通过 `operation(action, actionType)` 分发。

## 按钮区整体对齐（btnAlign）

通过 `btnAlign` 控制底部按钮区的整体对齐位置，不传时保持默认（dialog 居中 / drawer 靠右、全屏居中）：

| 值 | 对齐方式 | 说明 |
|---|---|---|
| `center` | 居中 | justify-content: center |
| `start` | 靠左 | justify-content: flex-start |
| `end` | 靠右 | justify-content: flex-end |
| `between` | 两端对齐 | justify-content: space-between |
| `around` | 等距分布 | justify-content: space-around |

```vue
<StarHorseDialog :btn-actions="['submit', 'cancel']" btn-align="end" />
<StarHorseDialog :btn-actions="['prev', 'next', 'finish']" btn-align="between" />
```

- **单个按钮排列位置**：由 `priority` 控制（数字越小越靠左），可在 `ModalBtnConfig` 中覆盖。
- **整体对齐位置**：由 `btnAlign` 控制。
- 两者均不配置时使用当前默认（dialog 居中、drawer 靠右/全屏居中，按钮按预设 priority 排序）。

## 覆盖预设

`btnActions` 元素可为字符串（用预设）或 `ModalBtnConfig` 对象（覆盖预设任意字段）：

```ts
import type { ModalBtnType, ModalBtnConfig } from "@/components/types/ModalBtnConfig";

// 覆盖文案：把"提交"改成"入库"，图标改成自定义
const btnActions: (ModalBtnType | ModalBtnConfig)[] = [
  { type: "submit", label: "入库", icon: "warehouse-in" },
  { type: "submitContinue", label: "入库并继续" },
  "cancel",
];

// 覆盖事件：让"暂存"走自定义 draft 事件而非 mergeDraft
const btnActions2: (ModalBtnType | ModalBtnConfig)[] = [
  { type: "draft", action: "draft", actionType: "close" },
  "submit",
  "cancel",
];

// 覆盖样式与显隐：动态控制
const btnActions3 = computed(() => [
  "prev",
  { type: "next", label: "下一步", disabled: !formValid.value },
  { type: "finish", visible: isLastStep.value },
]);
```

### ModalBtnConfig 字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `type` | `ModalBtnType` | 动作类型（必填，字典 key） |
| `label` | `string` | 覆盖文案（直接字符串，不经过 i18n） |
| `labelKey` | `string` | 覆盖 i18n key（优先于 `label`） |
| `icon` | `string` | 覆盖图标名（传给 `StarHorseIcon` 的 `icon-class`，kebab-case） |
| `priority` | `number` | 排序优先级（越小越靠前） |
| `variant` | `"primary"\|"link"\|"default"\|"plain"` | 按钮样式变体 |
| `visible` | `boolean` | 是否显示（默认 `true`，设 `false` 隐藏） |
| `disabled` | `boolean` | 是否禁用 |
| `action` | `string` | 触发的 operation 事件名 |
| `actionType` | `string` | operation 的 type 参数 |

## 事件监听

字典按钮点击时：
- `action === "close"`：直接关闭弹窗（触发 `closeAction` + `update:dialogVisible(false)`）。
- 其余 `action`：调用 `operation(action, actionType)`。
  - `userAction=true` 时 `emits(action, actionType)`，外部用 `@action名` 监听。
  - `userAction=false` 时写入 `provide("dialogOperation")` 的 `clickFunction`，由弹窗内表单组件消费。

需在弹窗上声明的事件（已在 `starHorseModalEmits` 中注册）：
`merge` / `mergeDraft` / `resetForm` / `publish` / `approve` / `reject` / `withdraw` / `next` / `prev` / `finish` / `print` / `apply` / `closeAction` / `open` / `minimize`。

```vue
<StarHorseDialog
  :btn-actions="['approve', 'reject', 'withdraw']"
  :user-action="true"
  @approve="(type) => handleApprove(type)"
  @reject="(type) => handleReject(type)"
  @withdraw="(type) => handleWithdraw(type)"
/>
```

## 向后兼容

**不传 `btnActions` 时**，footer 回退到原有硬编码按钮，由 `isShowReset` / `isShowSave` / `isShowBtnContinue` / `btnText` / `userBtn` 驱动，行为与改造前完全一致。传入 `btnActions`（即使空数组）后以字典为准，上述布尔 prop 不再生效。

## 特殊业务：插槽

超出预设字典的特殊按钮通过插槽实现：

| 插槽名 | 位置 | 说明 |
|---|---|---|
| `extend` | 按钮区最前 | 在所有字典按钮前插入自定义按钮 |
| `footer` | 按钮区整体 | 完全替换底部区域（字典按钮也不显示） |

```vue
<StarHorseDialog :btn-actions="['submit', 'cancel']">
  <template #extend>
    <el-button @click="customAction">特殊业务</el-button>
  </template>
</StarHorseDialog>
```

## 国际化

文案通过 `src/lang/index.ts` 的 `i18n()` 函数取值，已在中英文包中补充对应 key：

| key | 中文 | 英文 |
|---|---|---|
| `dialog.submit` | 提交 | Submit |
| `dialog.submitContinue` | 提交并继续 | Submit&Continue |
| `dialog.save` | 保存 | Save |
| `dialog.saveContinue` | 保存并继续 | Save&Continue |
| `dialog.draft` | 暂存 | Draft |
| `dialog.draftContinue` | 暂存并继续 | Draft&Continue |
| `dialog.confirm` | 确定 | Confirm |
| `dialog.cancel` | 取消 | Cancel |
| `dialog.reset` | 重置 | Reset |
| `dialog.ok` | 好的 | OK |
| `dialog.apply` | 应用 | Apply |
| `dialog.publish` | 发布 | Publish |
| `dialog.publishContinue` | 发布并继续 | Publish&Continue |
| `dialog.approve` | 通过 | Approve |
| `dialog.reject` | 驳回 | Reject |
| `dialog.withdraw` | 撤回 | Withdraw |
| `dialog.next` | 下一步 | Next |
| `dialog.prev` | 上一步 | Previous |
| `dialog.finish` | 完成 | Finish |
| `dialog.print` | 打印 | Print |

语言切换时文案自动响应（依赖 `i18n()` 的语言包切换机制）。

## 相关文件

| 文件 | 说明 |
|---|---|
| `src/components/types/ModalBtnConfig.ts` | 动作类型、配置接口、预设字典、解析函数 |
| `src/components/comp/starHorseModal.ts` | `btnActions` prop 声明、扩展 emits |
| `src/components/comp/StarHorseModalBase.vue` | footer 字典渲染逻辑 |
| `src/lang/zh_CN.ts` / `src/lang/en_US.ts` | 中英文 i18n key |