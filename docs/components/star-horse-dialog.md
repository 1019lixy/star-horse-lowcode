# StarHorseDialog 对话框

基于 el-dialog 的增强对话框组件，内置表单提交、重置、最小化等功能。

## 基础用法

```vue
<template>
  <StarHorseDialog
    v-model:dialogVisible="visible"
    title="编辑数据"
    @merge="onMerge"
    @closeAction="onClose"
  >
    <!-- 对话框内容 -->
    <StarHorseForm ref="formRef" :apiEndpoints="apiUrls" :fieldList="fieldList" />
  </StarHorseDialog>
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| dialogVisible | `boolean` | 否 | `false` | 对话框是否可见，支持 `v-model:dialogVisible` |
| dialogProps | `DialogProps` | 否 | `{}` | 弹窗属性配置，详见 [DialogProps 类型](../types/dialog-props.md) |
| isShowReset | `boolean` | 否 | `true` | 是否显示重置按钮 |
| isShowSave | `boolean` | 否 | `false` | 是否显示保存按钮 |
| isShowBtnContinue | `boolean` | 否 | `false` | 是否显示"提交并继续"按钮 |
| draggable | `boolean` | 否 | `true` | 是否可拖拽 |
| boxHeight | `string` | 否 | `'auto'` | 对话框内容区高度 |
| boxWidth | `string` | 否 | `'60%'` | 对话框宽度 |
| isBatch | `boolean` | 否 | `false` | 是否批量编辑模式 |
| fullScreen | `boolean` | 否 | `false` | 是否默认全屏 |
| hideFullScreenIcon | `boolean` | 否 | `false` | 是否隐藏全屏图标 |
| hideMinimizeIcon | `boolean` | 否 | `false` | 是否隐藏最小化图标 |
| userAction | `boolean` | 否 | `false` | 是否自定义提交逻辑（true 时不自动调用接口） |
| selfClose | `boolean` | 否 | `false` | 是否自定义关闭逻辑（true 时不自动关闭） |
| btnText | `string` | 否 | — | 提交按钮文字 |
| userBtn | `UserFuncInfo[]` | 否 | `[]` | 自定义按钮列表 |
| btnTextContinue | `string` | 否 | `i18n("common.submitAndContinue")` | "提交并继续"按钮文字 |
| btnActions | `Array<ModalBtnType \| ModalBtnConfig>` | 否 | — | 底部按钮动作字典，传入后按预设渲染按钮（文案/图标/样式/事件），不传时保持 `isShowReset`/`isShowSave`/`isShowBtnContinue` 驱动的硬编码按钮。详见 [按钮动作字典](./modal-btn-actions.md) |
| btnAlign | `"center" \| "start" \| "end" \| "between" \| "around"` | 否 | — | 底部按钮区整体对齐位置，不传时保持默认（dialog 居中 / drawer 靠右、全屏居中） |
| title | `string` | 否 | `''` | 对话框标题 |
| source | `number` | 否 | `1` | 数据来源标识（1=新增, 2=编辑, 3=查看） |
| compSize | `string` | 否 | `'default'` | 组件尺寸（large/default/small） |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| merge | `(type: string)` | 点击提交按钮时触发，type 为操作类型 |
| mergeDraft | `(type: string)` | 点击暂存草稿按钮时触发 |
| resetForm | — | 点击重置按钮时触发 |
| publish | `(type: string)` | btnActions 含 `publish`/`publishContinue` 时触发 |
| approve | `(type: string)` | btnActions 含 `approve` 时触发 |
| reject | `(type: string)` | btnActions 含 `reject` 时触发 |
| withdraw | `(type: string)` | btnActions 含 `withdraw` 时触发 |
| next | `(type: string)` | btnActions 含 `next` 时触发 |
| prev | `(type: string)` | btnActions 含 `prev` 时触发 |
| finish | `(type: string)` | btnActions 含 `finish` 时触发 |
| print | `(type: string)` | btnActions 含 `print` 时触发 |
| apply | `(type: string)` | btnActions 含 `apply` 时触发 |
| open | — | 对话框打开时触发 |
| closeAction | — | 对话框关闭时触发 |
| minimize | — | 对话框最小化时触发 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| header | 自定义对话框头部区域 |
| default | 对话框主体内容区域 |
| extend | 底部按钮区域扩展位（在提交按钮前） |
| footer | 自定义底部区域 |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| dialogStyle | `{ height: string; max-height: string }` | 全屏时高度为 `"100%"`，否则取 `props.boxHeight`；`max-height` 始终为 `"100%"` |

## Provide / Inject

### Provide（向子组件提供）

| key | 类型 | 说明 |
|---|---|---|
| `"closeDialog"` | `() => void` | 提供 `beforeClose` 方法，子组件可注入后直接关闭对话框 |
| `"dialogOperation"` | `Reactive<Record<any, any>>` | 提供 `clickFunction` 响应式对象，用于子组件通过 `operation()` 方法间接触发对话框操作（merge / mergeDraft / resetForm 等） |

## Watch 监听

| 监听目标 | 配置 | 触发逻辑 |
|---|---|---|
| `props.dialogVisible` | `{ immediate: true, deep: true }` | 同步到内部 `windowsType`；打开时重置 `isMinimized`；手机端自动全屏 |

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| beforeClose() | 关闭对话框，重置 windowsType 和 isMinimized；根据 selfClose 决定是否自动关闭 dialogProps 中的各 visible 标志（batchEditVisible、viewVisible、editVisible、bakeVisible1/2/3） |
| callFunc(func) | 安全调用函数——若 func 是函数则直接调用，若为字符串则预留扩展位 |
| open() | 触发 open 事件 |
| fullScreen() | 切换全屏状态；若 hideFullScreenIcon 则不执行 |
| minimize() | 最小化对话框——记录当前全屏状态，设 isMinimized = true，触发 minimize 事件 |
| restoreFromMinimize() | 从最小化恢复——恢复之前记忆的全屏状态 |
| operation(funcName, type) | 核心操作分发：若 userAction 为 true 且非 resetForm / closeAction，则 emit 对应事件名；否则将 funcName 和 type 写入 clickFunction 响应式对象供子组件响应 |

## source 值对行为的影响

| source 值 | 影响 |
|---|---|
| 1（默认） | 编辑模式——标题显示"编辑"，底部按钮区正常显示，body 区域无 overflow-hidden 类 |
| 3 | 查看模式——标题显示"查看"，底部按钮区通过 `v-if="source != 3"` 完全隐藏，body 区域添加 overflow-hidden 类阻止溢出，关闭时仅操作 viewVisible |

## 使用示例

### 自定义提交逻辑

```vue
<StarHorseDialog
  v-model:dialogVisible="visible"
  :userAction="true"
  @merge="handleCustomMerge"
>
  <StarHorseForm ref="formRef" :apiEndpoints="apiUrls" :fieldList="fieldList" />
</StarHorseDialog>
```

### 全屏对话框

```vue
<StarHorseDialog
  v-model:dialogVisible="visible"
  :fullScreen="true"
  boxWidth="100%"
>
  <!-- 内容 -->
</StarHorseDialog>
```

### 自定义按钮

```vue
<StarHorseDialog
  v-model:dialogVisible="visible"
  :userBtn="customButtons"
>
  <!-- 内容 -->
</StarHorseDialog>

<script setup>
const customButtons = [
  { btnName: '审批', funcName: 'approve', icon: 'check' },
  { btnName: '驳回', funcName: 'reject', icon: 'close' },
]
</script>
```
### 按钮动作字典（推荐）

通过 `btnActions` 传入动作类型即可切换按钮文案、图标与事件，无需手动拼按钮：

```vue
<!-- 暂存业务：暂存、暂存并继续、提交、取消 -->
<StarHorseDialog
  v-model:dialogVisible="visible"
  :btn-actions="['draft', 'draftContinue', 'submit', 'cancel']"
  :user-action="true"
  @mergeDraft="onDraft"
  @merge="onSubmit"
/>

<!-- 审批：通过、驳回、撤回 -->
<StarHorseDialog
  v-model:dialogVisible="visible"
  :btn-actions="['approve', 'reject', 'withdraw']"
  :user-action="true"
  @approve="onApprove"
  @reject="onReject"
  @withdraw="onWithdraw"
/>

<!-- 覆盖文案：把"提交"改成"入库" -->
<StarHorseDialog
  :btn-actions="[{ type: 'submit', label: '入库', icon: 'warehouse-in' }, 'cancel']"
  :user-action="true"
  @merge="onMerge"
/>
```

完整动作类型列表与覆盖方式详见 [按钮动作字典文档](./modal-btn-actions.md)。
