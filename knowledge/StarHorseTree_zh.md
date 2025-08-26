# StarHorseTree 树形组件

## 概述
StarHorseTree组件是一个功能丰富的树形组件，支持树形和菜单两种显示模式。它提供了搜索、分页、复选框选择、节点操作等功能，适用于组织架构、菜单管理、分类数据等场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| preps | Object | {value:"value",label:"name",children:"children"} | 树节点配置 |
| helpMsg | String | undefined | 帮助信息 |
| showCollapse | Boolean | false | 是否显示折叠按钮 |
| treeTitle | String | "树形菜单" | 树标题 |
| expand | Boolean | false | 是否展开所有节点 |
| height | Number | 600 | 树高度 |
| showCheckBox | Boolean | false | 是否显示复选框 |
| showSelectData | Boolean | false | 是否显示已选数据 |
| checkStrictly | Boolean | true | 是否严格选择（父子节点不关联） |
| showSearch | Boolean | true | 是否显示搜索框 |
| checkOnClickNode | Boolean | true | 点击节点时是否选中 |
| treeType | String | "tree" | 树类型（tree/menu） |
| showCode | Boolean | false | 是否在标签上显示值 |
| showPageBar | Boolean | false | 是否显示分页 |
| isDynamicData | Boolean | false | 是否为动态数据 |
| autoLoad | Boolean | true | 是否自动加载数据 |
| compUrl | ApiUrls | undefined | 接口地址配置 |
| btnTitle | String | "添加数据" | 添加按钮标题 |
| btnVisible | Boolean | false | 添加按钮是否可见 |
| rmvTitle | String | "删除数据" | 删除按钮标题 |
| rmvVisible | Boolean | false | 删除按钮是否可见 |
| showDropdown | Boolean | true | 是否显示下拉按钮 |
| commonPersons | Array<any> | [] | 数据共享人 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| selectData | data: any, checked: boolean | 选择数据事件 |
| changeCollapse | collapse: boolean | 折叠状态改变事件 |
| addData | item: any | 添加数据事件 |
| removeData | item: any | 删除数据事件 |

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| getSelectData | none | Array<any> | 获取选中数据 |
| setSelectData | datas: Array<any> | void | 设置选中数据 |
| createSearchParams | params: SearchParams[], orderBy: OrderByInfo[] | void | 创建搜索参数 |

## 数据结构

### 树节点配置(preps)
```typescript
interface TreeProps {
  value: string;     // 值字段名
  label: string;     // 标签字段名
  children: string;  // 子节点字段名
  code?: string;     // 代码字段名（可选）
}
```

### 树节点数据结构
```typescript
interface TreeNode {
  name: string;        // 节点名称
  value: any;          // 节点值
  children?: Array<TreeNode>;  // 子节点
  code?: string;       // 节点代码（可选）
}
```

### ApiUrls
```typescript
type ApiUrls = {
  pageListUrl: string;  // 分页接口地址
  // 其他API配置...
}
```

## 使用示例
```vue
<template>
  <div>
    <star-horse-tree
      v-model:tree-datas="treeData"
      :preps="treeProps"
      :comp-url="compUrl"
      :is-dynamic-data="true"
      :show-check-box="true"
      :show-search="true"
      :show-page-bar="true"
      tree-title="组织架构"
      @select-data="handleSelectData"
      @add-data="handleAddData"
      @remove-data="handleRemoveData"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StarHorseTree from '@/components/comp/StarHorseTree.vue'

const treeData = ref([])
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

const compUrl = {
  pageListUrl: '/api/org/tree'
}

const handleSelectData = (data, checked) => {
  console.log('选择数据:', data, checked)
}

const handleAddData = (item) => {
  console.log('添加数据:', item)
}

const handleRemoveData = (item) => {
  console.log('删除数据:', item)
}
</script>
```

## 功能特性
1. **双模式显示**：支持标准树形结构和菜单模式
2. **搜索过滤**：支持关键词搜索过滤节点
3. **分页支持**：支持大数据量的分页加载
4. **复选框选择**：支持单选和多选模式
5. **节点操作**：支持添加、删除节点操作
6. **折叠控制**：支持展开/折叠所有节点
7. **动态数据**：支持通过接口动态加载数据
8. **已选数据展示**：支持显示已选中的数据标签
9. **帮助提示**：支持节点帮助信息提示