# StarHorseFormList 表单列表组件

## 概述
StarHorseFormList组件是一个功能丰富的表单列表组件，支持动态行添加/删除、行内编辑、Excel导入导出、行拖拽排序等功能。它基于Element Plus的el-table构建，适用于需要动态管理多行数据的表单场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| compUrl | ApiUrls | undefined | 接口地址配置 |
| fieldList | Array<FieldInfo> | required | 字段列表配置（必需） |
| defaultValues | Object | {} | 默认值配置 |
| batchName | String | "batchDataList" | 批量数据名称 |
| primaryKey | String/Object | undefined | 主键字段 |
| initRows | Number | 0 | 初始化行数 |
| importInfo | Object | undefined | 导入信息配置 |
| title | String | "" | 列表标题 |
| helpMsg | String | "" | 帮助信息 |
| rules | Object | undefined | 验证规则 |
| staticColumn | String | "Y" | 是否为静态列（Y/N） |
| size | String | Config.compSize | 组件大小 |
| source | Number | 1 | 数据源类型 |
| showCheckBox | Boolean | false | 是否显示复选框 |
| selectAll | Boolean | false | 是否默认全选 |
| subFlag | Boolean | false | 是否为子表单标志 |
| dataForm | Object | required | 双向绑定的表单数据（必需） |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| addRow | row: any | 添加行事件 |
| removeRow | row: any | 删除行事件 |
| inited | none | 初始化完成事件 |

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods)
该组件不直接暴露方法。

## 数据结构

### 字段信息(FieldInfo)
```typescript
interface FieldInfo {
  label?: string;          // 标签名称
  fieldName: string;       // 字段名称
  type?: string;           // 字段类型
  formVisible?: boolean;   // 表单是否可见
  // 更多字段属性...
}
```

### 导入信息(importInfo)
```typescript
interface ImportInfo {
  downloadTemplateUrl?: string;  // 下载模板地址
  importDataUrl?: string;        // 导入数据地址
}
```

### 接口地址配置(ApiUrls)
```typescript
type ApiUrls = {
  // 接口地址配置...
}
```

## 使用示例
```vue
<template>
  <div>
    <star-horse-form-list
      v-model:data-form="formData"
      :field-list="fieldList"
      :batch-name="'userList'"
      :title="'用户列表'"
      :init-rows="2"
      :import-info="importInfo"
      @add-row="handleAddRow"
      @remove-row="handleRemoveRow"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StarHorseFormList from '@/components/comp/StarHorseFormList.vue'

const formData = ref({
  userList: []
})

const fieldList = [
  {
    fieldName: 'name',
    label: '姓名',
    type: 'input',
    formVisible: true
  },
  {
    fieldName: 'age',
    label: '年龄',
    type: 'number',
    formVisible: true
  },
  {
    fieldName: 'email',
    label: '邮箱',
    type: 'input',
    formVisible: true
  }
]

const importInfo = {
  downloadTemplateUrl: '/api/user/downloadTemplate',
  importDataUrl: '/api/user/importData'
}

const handleAddRow = (row) => {
  console.log('添加行:', row)
}

const handleRemoveRow = (row) => {
  console.log('删除行:', row)
}
</script>
```

## 功能特性
1. **动态行管理**：支持动态添加和删除行
2. **行内编辑**：支持行内编辑和弹窗编辑两种模式
3. **Excel导入导出**：支持Excel模板下载和数据导入
4. **行拖拽排序**：支持通过拖拽调整行顺序
5. **数据验证**：支持表单数据验证
6. **批量操作**：支持批量选择和操作
7. **初始化行数**：支持设置初始化行数
8. **帮助提示**：支持字段帮助信息提示
9. **自定义样式**：支持自定义组件大小和样式