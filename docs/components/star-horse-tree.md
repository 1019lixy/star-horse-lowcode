# StarHorseTree 树形控件

基于 el-tree 的增强树形控件，支持搜索、分页、复选框、动态数据加载等功能。

## 基础用法

```vue
<template>
  <StarHorseTree
    v-model:treeDatas="treeData"
    :compUrl="apiUrls"
    :preps="{ label: 'name', value: 'id' }"
    @selectData="onSelect"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| preps | `object` | 否 | `{ value:'value', label:'name', children:'children' }` | 树属性映射配置 |
| helpMsg | `string` | 否 | — | 帮助提示 |
| showCollapse | `boolean` | 否 | `false` | 是否显示折叠按钮 |
| treeTitle | `string` | 否 | `i18n("comp.treeMenu")` | 树标题 |
| expand | `boolean` | 否 | `false` | 是否默认展开 |
| height | `number` | 否 | `600` | 树高度 |
| showCheckBox | `boolean` | 否 | `false` | 是否显示复选框 |
| showSelectData | `boolean` | 否 | `false` | 是否显示已选中数据 |
| checkStrictly | `boolean` | 否 | `true` | 父子是否不关联 |
| showSearch | `boolean` | 否 | `true` | 是否显示搜索框 |
| checkOnClickNode | `boolean` | 否 | `true` | 点击节点是否触发选中 |
| treeType | `string` | 否 | `'tree'` | 树类型 |
| showCode | `boolean` | 否 | `false` | 是否在标签上显示值 |
| showPageBar | `boolean` | 否 | `false` | 是否显示分页 |
| isDynamicData | `boolean` | 否 | `false` | 是否动态数据 |
| autoLoad | `boolean` | 否 | `true` | 是否自动加载数据 |
| compUrl | `ApiUrls` | 否 | — | 接口地址配置 |
| orderBy | `OrderByInfo[]` | 否 | `[]` | 默认排序 |
| btnTitle | `string` | 否 | `i18n("comp.addData")` | 添加按钮名称 |
| btnVisible | `boolean` | 否 | `false` | 添加按钮是否可见 |
| rmvTitle | `string` | 否 | `i18n("comp.deleteData")` | 删除按钮名称 |
| rmvVisible | `boolean` | 否 | `false` | 删除按钮是否可见 |
| showDropdown | `boolean` | 否 | `true` | 是否显示下拉按钮 |
| commonPersons | `Array<any>` | 否 | `[]` | 数据共享人 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| treeDatas | `any` | 树数据，支持 `v-model:treeDatas` |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| selectData | `(data: any, checked?: boolean)` | 选中/取消节点时触发 |
| changeCollapse | `(collapse: boolean)` | 折叠状态变化时触发 |
| addData | `(item: any)` | 点击添加按钮时触发 |
| removeData | `(item: any)` | 点击删除按钮时触发 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| getSelectData | — | `Array<any>` | 获取选中的数据列表 |
| setSelectData | `(datas: Array<any>)` | `void` | 设置选中的数据列表 |
| createSearchParams | `(params?: SearchParams[], orderBy?: OrderByInfo[])` | `void` | 创建搜索参数并重新加载 |

## 计算属性 (Computed)

| 属性名 | 类型 | 说明 |
|---|---|---|
| compSize | `string` | 从全局配置 store 读取 `configFormInfo.inputSize`，默认 `"default"` |

## 联动机制

### 数据权限联动

`loadByPage()` 中，若 `commonPersons` 非空且当前用户非系统管理员，自动追加 `createCondition("a.createdBy", commonPersons, "in")` 条件到搜索参数，实现数据共享人过滤。

### 搜索参数联动

`createSearchParams(params, orderBy)` 接收外部搜索条件后存储，并自动调用 `loadByPage()` 刷新数据。

### 展开联动

若 `expand` prop 为 true，数据加载完成后延时 800ms 自动展开全部节点。

## 关键内部方法说明

| 方法名 | 功能说明 |
|---|---|
| onQueryChanged(query) | 搜索输入变化时调用 treeRef.filter(query) 过滤树节点 |
| filterMethod(query, node) | 树节点过滤——按 preps.label 做大小写不敏感的包含匹配 |
| changeArrow(evt) | 切换折叠/展开侧边栏——切换 collapse 状态和图标，emit changeCollapse |
| treeOperation(cmd) | 树操作——"add" emit addData；"collapse" 折叠所有节点；"expand" 展开所有节点。支持 tree 和 menu 两种模式 |
| operSelectData(data, checked) | 复选框选中/取消——维护 selectedDataList 数组，取消选中时同步 treeRef.setChecked |
| setSelectData(datas) | 外部设置选中数据——清空 selectedDataList 后逐项添加并 setChecked |
| getSelectData() | 获取当前选中数据列表 |
| treeChange(data, checked) | 树节点点击/复选回调——调用 operSelectData 并 emit selectData |
| menuChange(data) | 菜单模式点击回调——emit selectData |
| addData(item) / removeData(item) | emit 对应事件 |
| pageSizeClick / pageChangeClick | 分页回调——更新 pageInfo 并重新加载 |
| createSearchParams(params, orderBy) | 接收外部搜索参数，存储后调用 loadByPage() |
| loadByPage() | 核心数据加载——组装分页参数 + 搜索条件 + 排序 + 共享人过滤条件，POST 请求 compUrl.pageListUrl，更新 treeDatas 和分页信息 |
| init() | 初始化——若是动态数据 (isDynamicData) 且 autoLoad 则加载数据；否则仅展开节点 |
| expandData() | 若 expand 为 true，延时 800ms 后自动展开所有节点 |

## 使用示例

### 基本树形选择

```vue
<StarHorseTree
  v-model:treeDatas="treeData"
  :compUrl="apiUrls"
  :showCheckBox="true"
  @selectData="onSelect"
/>
```

### 带搜索和分页

```vue
<StarHorseTree
  v-model:treeDatas="treeData"
  :compUrl="apiUrls"
  :showSearch="true"
  :showPageBar="true"
  :height="500"
/>
```
