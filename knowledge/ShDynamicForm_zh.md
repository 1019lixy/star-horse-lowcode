# ShDynamicForm 动态表单组件

## 概述
ShDynamicForm组件是一个动态表单组件，支持通过配置动态生成表单界面。它基于Element Plus的el-form构建，提供了数据加载、表单验证、数据提交等完整的表单功能。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| compUrl | ApiUrls | required | 接口地址配置（必需） |
| fieldList | Object | required | 字段列表配置（必需） |
| formInfo | Object | required | 表单信息配置（必需） |
| rules | Object | undefined | 表单验证规则 |
| typeModel | String | "normal" | 表单类型模式 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| refresh | none | 刷新事件 |

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| merge | type: string | void | 合并提交表单数据 |
| mergeDraft | type: string | void | 草稿提交表单数据 |
| resetForm | none | void | 重置表单 |
| assignDefault | none | void | 分配默认值 |

## 数据结构

### 接口地址配置(ApiUrls)
```typescript
type ApiUrls = {
  loadByIdUrl: string;  // 根据ID加载数据接口
  mergeUrl: string;     // 合并数据接口
  // 其他接口配置...
}
```

### 表单信息配置(formInfo)
```typescript
interface FormInfo {
  disabled?: boolean;                    // 是否禁用
  hideRequiredAsterisk?: boolean;        // 是否隐藏必填星号
  inline?: boolean;                      // 是否行内表单
  labelPosition?: string;                // 标签位置
  labelWidth?: string | number;          // 标签宽度
  size?: string;                         // 表单大小
  statusIcon?: boolean;                  // 是否显示状态图标
  // 更多el-form属性...
}
```

### 字段列表配置(fieldList)
```typescript
// 字段列表是一个包含多个字段配置对象的数组
interface FieldConfig {
  // 字段配置属性...
}
```

## 使用示例
```vue
<template>
  <div>
    <sh-dynamic-form
      :comp-url="compUrl"
      :field-list="fieldList"
      :form-info="formInfo"
      :rules="rules"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ShDynamicForm from '@/components/comp/ShDynamicForm.vue'

const compUrl = {
  loadByIdUrl: '/api/data/loadById',
  mergeUrl: '/api/data/merge'
}

const fieldList = [
  {
    fieldName: 'name',
    label: '姓名',
    type: 'input',
    required: true
  },
  {
    fieldName: 'email',
    label: '邮箱',
    type: 'input'
  }
]

const formInfo = {
  labelPosition: 'left',
  labelWidth: '100px',
  size: 'small'
}

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ]
}

const handleRefresh = () => {
  console.log('表单提交成功，刷新数据')
}
</script>
```

## 功能特性
1. **动态表单生成**：通过配置动态生成表单界面
2. **数据加载**：支持根据ID加载表单数据
3. **表单验证**：支持自定义表单验证规则
4. **数据提交**：支持表单数据提交和草稿保存
5. **表单重置**：支持表单重置功能
6. **禁用控制**：支持表单禁用状态控制
7. **多种布局**：支持行内和普通表单布局
8. **状态图标**：支持表单状态图标显示