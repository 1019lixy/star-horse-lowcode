# StarHorseButtonList 按钮列表

按钮列表组件，集成了列表操作按钮（新增、编辑、删除、上传、导出等）。

## 基础用法

```vue
<template>
  <StarHorseButtonList
    :dialogProps="dialogProps"
    :apiEndpoints="apiUrls"
    @btnOperation="onBtnOperation"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| dialogProps | `DialogProps` | **是** | — | 弹窗属性配置 |
| apiEndpoints | `ApiUrls` | **是** | — | 接口地址配置 |
| viewFlag | `boolean` | 否 | `false` | 是否查看模式 |
| extendBtns | `UserFuncInfo[]` | 否 | — | 扩展按钮列表 |
| preValidFunc | `PreValid[]` | 否 | — | 按钮前置校验 |
| btnPermissions | `any` | 否 | — | 按钮权限配置 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| upload | `(file: any, fileList: any)` | 上传事件 |
| uploadProcess | — | 上传进度事件 |
| uploadError | — | 上传错误事件 |
| uploadSuccess | — | 上传成功事件 |
| btnOperation | — | 按钮操作事件 |
| tableCompFunc | `(funcName: string)` | 表格组件方法调用 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| setFormData | `(val: any)` | `void` | 设置表单数据 |

---

# StarHorseMenu 菜单组件

侧边菜单组件，支持树形菜单结构。

## 基础用法

```vue
<template>
  <StarHorseMenu
    v-model:dataList="menuData"
    @selectItem="onSelect"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| preps | `object` | 否 | `{id:'id',value:'value',icon:'icon',label:'name',children:'children'}` | 属性映射配置 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataList | `any` | 菜单数据，支持 `v-model:dataList` |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selectItem | `(item: any)` | 选中菜单项时触发 |

---

# StarHorseSvg SVG 组件

SVG 渲染组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| className | `string` | 否 | — | CSS 类名 |
| title | `string` | 否 | `''` | 标题 |
| size | `string` | 否 | `'20px'` | 大小 |
| width | `number` | 否 | `200` | 宽度 |
| height | `number` | 否 | `200` | 高度 |
| data | `object` | 否 | `{}` | SVG 数据 |
| borderOffset | `number` | 否 | `0` | 边框偏移 |
| color | `string` | 否 | `'var(--star-horse-style)'` | 颜色 |
| backgroundColor | `string` | 否 | `'#fff'` | 背景色 |
| borderColor | `string` | 否 | `'#ebebeb'` | 边框颜色 |
| borderWidth | `number` | 否 | `0` | 边框宽度 |
| cursor | `string` | 否 | `'default'` | 鼠标样式 |

---

# StarHorseEditor 代码编辑器

基于 CodeMirror 的代码编辑器组件。

## 基础用法

```vue
<template>
  <StarHorseEditor v-model:value="code" lang="javascript" />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| value | `string` | 否 | `''` | 编辑器内容（支持 `v-model:value`） |
| funcName | `string` | 否 | `''` | 功能名称 |
| fieldName | `string` | 否 | `''` | 字段名称 |
| lang | `string` | 否 | — | 语言类型 |
| theme | `string` | 否 | `'dracula'` | 主题 |
| boxHeight | `string` | 否 | `'95%'` | 编辑器高度 |
| btnList | `Array<any>` | 否 | `[]` | 按钮列表 |
| helpMsg | `string` | 否 | — | 帮助提示 |
| toolbarItems | `ToolbarItem[]` | 否 | `[]` | 工具栏项 |
| showToolbar | `boolean` | 否 | `true` | 是否显示工具栏 |

### ToolbarItem 接口

| 字段 | 类型 | 说明 |
|---|---|---|
| id | `string` | 工具栏项 ID |
| label | `string` | 显示文字 |
| icon | `string` | 图标 |
| position | `'left' \| 'right'` | 位置 |
| type | `'button' \| 'dropdown'` | 类型 |
| handler | `() => void` | 点击处理函数 |
| children | `Array<{label, handler}>` | 下拉子项 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| editor | — | `EditorView` | 编辑器实例 |
| setValue | `(val: any)` | `void` | 设置编辑器内容 |
| setAutoCompletion | `(dbName: string, datas: any)` | `void` | 设置自动补全数据 |

---

# ContentMenu 右键菜单

自定义右键菜单组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| menuData | `Array<any>` | 否 | `[]` | 菜单数据 |
| isSubMenu | `boolean` | 否 | `false` | 是否子菜单 |
| autoHide | `boolean` | 否 | `true` | 是否自动隐藏 |
| active | `string \| number` | 否 | `''` | 当前激活项 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| hide | — | 菜单隐藏时触发 |
| show | — | 菜单显示时触发 |
| mouseenter | — | 鼠标移入时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| hide | — | `void` | 隐藏菜单 |
| show | `(e?: MouseEvent)` | `void` | 显示菜单 |
| contains | `(el: HTMLElement)` | `boolean` | 判断元素是否在菜单内 |
| setPosition | `(e: MouseEvent)` | `void` | 设置菜单位置 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| title | 菜单标题插槽 |

---

# StarHorseSidebar 侧边栏

侧边栏容器组件。

## 插槽 (Slots)

| 插槽名 | 说明 |
|---|---|
| default | 侧边栏主体内容 |

---

# SvgLoader SVG 加载器

SVG 文件加载组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| path | `string` | **是** | — | SVG 文件路径 |
| size | `string` | 否 | `'20px'` | 大小 |
| cursor | `string` | 否 | `'normal'` | 鼠标样式 |
| marginLeft | `string` | 否 | `'1px'` | 左边距 |
| marginRight | `string` | 否 | `'1px'` | 右边距 |
| color | `string` | 否 | `'var(--star-horse-style)'` | 颜色 |

---

# PageConfig 页面配置

页面配置抽屉组件。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| hideDefaultConfig | `boolean` | 否 | `false` | 是否隐藏默认配置 |
| modelValue | `boolean` | 否 | `false` | 是否可见（支持 `v-model`） |
| direction | `string` | 否 | `'rtl'` | 抽屉方向 |
| resizable | `boolean` | 否 | `false` | 是否可调整大小 |
| title | `string` | 否 | `i18n(...)` | 标题 |
| compSize | `string` | 否 | `'default'` | 组件尺寸 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| saveData | `(configInfo: any)` | 保存配置时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| getConfigInfo | — | `any` | 获取配置信息 |

## 插槽 (Slots)

| 插槽名 | 作用域参数 | 说明 |
|---|---|---|---|
| default | `{ form }` | 默认插槽 |
| header | `{ form }` | 头部插槽 |
| content | `{ form }` | 内容插槽 |
| footer | `{ form }` | 底部插槽 |
