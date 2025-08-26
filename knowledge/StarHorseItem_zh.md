# StarHorseItem 通用组件项

## 概述
StarHorseItem组件是一个通用的组件项容器，用于根据配置动态渲染不同类型的表单组件。它支持输入框、选择框、日期选择器等多种组件类型，并提供了事件分发、拖拽调整宽度等功能。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| item | Object | required | 组件项配置信息（必需） |
| column | Object | undefined | 列信息 |
| primaryKey | Object | undefined | 主键信息 |
| dataIndex | Number | -1 | 数据索引 |
| bareFlag | Boolean | false | 是否为简洁模式 |
| batchName | String | "" | 批量操作名称 |
| compSize | String | Config.compSize | 组件大小 |
| showLabel | Boolean | true | 是否显示标签 |
| source | Number | 1 | 数据源类型 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| dataSearch | params: any[] | 数据搜索事件 |
| focus | column: any, params: any[] | 获得焦点事件 |
| blur | column: any, params: any[] | 失去焦点事件 |

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| actionDispatcher | act: string, ...params: any[] | void | 事件分发器 |
| fieldType | none | void | 设置字段类型 |
| init | none | void | 初始化组件 |
| compPreps | none | void | 组件预处理 |
| startDrag | e: MouseEvent | void | 开始拖拽 |
| onDrag | e: MouseEvent | void | 拖拽中 |
| stopDrag | none | void | 停止拖拽 |
| checkClassName | none | string | 检查CSS类名 |

## 数据结构

### Item配置
```typescript
interface Item {
  id?: string;
  fieldName: string;
  label?: string;
  type?: string;
  fieldType?: string;
  readonly?: boolean;
  defaultValue?: any;
  helpMsg?: string;
  actions?: Record<string, Function>;
  preps?: Record<string, any>;
  brotherNodes?: Array<Item>;
  minWidth?: number;
}
```

### Source类型说明
| 值 | 描述 |
|----|------|
| 1 | 表单模式 |
| 3 | 查看模式 |
| 4 | 搜索模式 |
| 5 | 列表模式 |

## 使用示例
```vue
<template>
  <star-horse-item
    v-model:data-form="formData"
    :item="itemConfig"
    :source="1"
    @data-search="handleSearch"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseItem from '@/components/comp/StarHorseItem.vue'

const formData = ref({
  name: '',
  email: '',
  status: ''
})

const itemConfig = {
  fieldName: 'name',
  label: '姓名',
  type: 'input',
  defaultValue: '',
  preps: {
    placeholder: '请输入姓名'
  },
  actions: {
    change: (dataForm, params) => {
      console.log('数据变化:', dataForm, params)
    }
  }
}

const handleSearch = (params) => {
  console.log('搜索事件:', params)
}

const handleFocus = (column, params) => {
  console.log('获得焦点:', column, params)
}

const handleBlur = (column, params) => {
  console.log('失去焦点:', column, params)
}
</script>
```