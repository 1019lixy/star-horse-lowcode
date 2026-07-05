# StarHorseDraggable 拖拽布局

拖拽布局组件，用于设计模式下拖拽排列子节点。

## 基础用法

```vue
<template>
  <StarHorseDraggable
    :node="nodeData"
    :isActive="true"
    @selectNode="onSelect"
    @contextAction="onAction"
  >
    <!-- 子节点内容 -->
  </StarHorseDraggable>
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| msg | `string` | 否 | — | 消息 |
| node | `DynamicNode` | **是** | — | 节点数据，详见 [DynamicNode 类型](../types/dynamic-node.md) |
| isActive | `boolean` | 否 | `false` | 是否激活（选中）状态 |
| showLine | `boolean` | 否 | `true` | 是否显示辅助线 |
| sizeControlType | `string` | 否 | `'percent'` | 大小控制类型（`'percent'` 百分比 / `'px'` 像素） |
| isDesign | `boolean` | 否 | `false` | 是否设计模式 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| contextAction | `(actionName: string, nodeInfo: DynamicNode)` | 右键菜单操作时触发 |
| selectNode | `(node: DynamicNode)` | 选中节点时触发 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| default | 渲染拖拽节点内容 |

---

# StarHorseIcon 图标组件

SVG 图标组件，支持系统图标库和自定义图标。

## 基础用法

```vue
<template>
  <StarHorseIcon iconClass="user" :size="'20px'" />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| iconClass | `string` | **是** | — | 图标类名 |
| className | `string` | 否 | — | 额外 CSS 类名 |
| title | `string` | 否 | `''` | 图标标题 |
| size | `string` | 否 | `'20px'` | 图标大小 |
| marginLeft | `string` | 否 | `'0.1em'` | 左边距 |
| marginRight | `string` | 否 | `'0.2em'` | 右边距 |
| borderRadius | `string` | 否 | `'5px'` | 边框圆角 |
| borderPadding | `string` | 否 | `'3px'` | 边框内边距 |
| boxShow | `boolean` | 否 | `false` | 是否显示背景框 |
| border | `boolean` | 否 | `false` | 是否显示边框 |
| color | `string` | 否 | `'var(--star-horse-style)'` | 图标颜色 |
| cursor | `string` | 否 | `'default'` | 鼠标样式 |
| svgIconName | `string` | 否 | `'sh_icon'` | SVG 图标名称 |

---

# StarHorsePopover 弹出框图标选择

弹出框形式的图标选择器组件。

## 基础用法

```vue
<template>
  <StarHorsePopover
    :menuIcon="'star'"
    :icons="iconList"
    @selectIcon="onSelect"
  >
    <el-button>选择图标</el-button>
  </StarHorsePopover>
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| menuIcon | `string` | 否 | — | 当前选中的图标 |
| iconUrl | `string` | 否 | — | 图标 URL |
| iconSize | `number` | 否 | `48` | 图标大小 |
| icons | `Array` | 否 | `[]` | 可选图标列表 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selectIcon | `(icon: any)` | 选择图标时触发 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| default | 触发弹出框的引用元素 |

---

# StarHorseJsonEditor JSON 编辑器

基于 json-editor 的 JSON 编辑器组件。

## 基础用法

```vue
<template>
  <StarHorseJsonEditor v-model:json="jsonData" />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| options | `object` | 否 | — | json-editor 配置选项 |
| currentMode | `string` | 否 | `'text'` | 当前编辑模式 |
| modeList | `Array` | 否 | `['tree','text','form','preview']` | 可用模式列表 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| json | `any` | JSON 数据，支持 `v-model:json` |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| editor | — | `Ref<any>` | JSON 编辑器实例引用 |
| setEditorContent | `(value: any)` | `void` | 设置编辑器内容 |

---

# StarHorseItem 通用项渲染组件

通用的表单项/列项渲染组件，根据配置自动选择对应的表单项组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| item | `object` | **是** | — | 组件配置项 |
| column | `object` | 否 | — | 列配置 |
| primaryKey | `any` | 否 | — | 主键 |
| dataIndex | `number` | 否 | `-1` | 数据索引 |
| bareFlag | `boolean` | 否 | `false` | 是否基础组件 |
| batchName | `string` | 否 | `''` | 批量数据 Key |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |
| showLabel | `boolean` | 否 | `true` | 是否显示标签 |
| source | `number` | 否 | `1` | 数据来源标识 |
| commonFormat | `Function` | 否 | `() => {}` | 格式化函数 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataForm | `any` | 双向绑定的表单数据 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| dataSearch | `(...params: any[])` | 数据搜索事件 |
| focus | `(column: any, params: any[])` | 获取焦点事件 |
| blur | `(column: any, params: any[])` | 失去焦点事件 |
