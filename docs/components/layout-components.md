# MainBar 主导航栏

主导航栏组件，支持多种位置和图标类型。

## 基础用法

```vue
<template>
  <MainBar
    :categories="menuItems"
    :position="'left'"
    @select="onSelect"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| categories | `MenuItem[]` | **是** | — | 菜单分类数据 |
| iconType | `'user' \| 'ele'` | 否 | — | 图标类型 |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | — | 导航栏位置 |

### MenuItem 接口

| 字段 | 类型 | 说明 |
|---|---|---|
| component | `any` | 组件 |
| name | `string` | 名称 |
| menuIcon | `string` | 图标 |
| path | `string` | 路径 |
| meta | `Record<string, any>` | 元信息 |
| children | `MenuItem[]` | 子菜单 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| select | `(isSubMenu: boolean, item: any)` | 选中菜单项时触发 |

---

# MainContent 主内容区

主内容区域组件，与 MainBar 配合使用。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| categories | `Array<{component, name, menuIcon?, path?, meta?}>` | **是** | — | 菜单分类数据 |
| systemConfigName | `string` | 否 | — | 系统配置名称 |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | — | 位置 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| select | `(item: MainBarItem)` | 选中菜单项时触发 |
| system-config | — | 点击系统配置时触发 |

---

# MainContainer 主容器

主容器组件，集成了 MainBar 和 MainContent。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| categories | `MenuItem[]` | **是** | — | 菜单分类数据 |
| systemConfigName | `string` | 否 | — | 系统配置名称 |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | — | 位置 |
| iconType | `'user' \| 'ele'` | 否 | — | 图标类型 |
| preps | `Record<string, any>` | 否 | — | 额外属性 |

---

# MainSubBar 子导航栏

子导航栏组件，用于展示二级菜单。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| level | `number` | **是** | `1` | 菜单层级 |
| menuType | `string` | 否 | `'url'` | 菜单类型 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataList | `any` | 菜单数据，支持 `v-model:dataList` |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selectMenu | `(menu: any)` | 选中菜单时触发 |

---

# MenuShot 快捷菜单

快捷菜单按钮，点击弹出菜单列表。

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| menus | `Array<any>` | 否 | `[]` | 菜单列表 |
| icon | `string` | 否 | `'menu'` | 图标 |
| prop | `Record<string, string>` | 否 | `{label:'btnName', iconName:'icon'}` | 属性映射 |
| position | `Record<string, any>` | 否 | `{}` | 弹出位置 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| change | `(menu?: any)` | 选择菜单项时触发 |

---

# Crontab Cron 表达式编辑器

Cron 表达式可视化编辑器，支持秒、分、时、日、月、周、年配置。

## 基础用法

```vue
<template>
  <Crontab v-model="cronExpression" />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| expression | `string` | 否 | — | Cron 表达式 |
| modelValue | `string` | **是** | — | Cron 表达式（支持 `v-model`） |
| hideComponent | `any` | 否 | — | 隐藏的组件标签页 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| update:modelValue | `(value: string)` | 值变化时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| clearCron | — | `void` | 清空表达式 |
| resolveExp | — | `void` | 解析表达式 |
