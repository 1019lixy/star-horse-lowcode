# DatetimeItem 日期时间组件

## 概述
DatetimeItem组件是基于Element Plus的el-date-picker组件封装的日期时间选择组件。它支持多种日期时间格式、范围选择、禁用日期等功能，适用于日期时间选择场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| field | FieldInfo | required | 字段配置信息 |
| formData | Object | required | 表单数据对象 |
| parentField | FieldInfo | undefined | 父级字段信息 |
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| bareFlag | Boolean | false | 是否为简洁模式 |
| showFormItem | Boolean | false | 是否显示表单项包装 |
| isSearch | Boolean | false | 是否为搜索模式 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| selfFunc | function | 自定义函数事件 |
| selectItem | item | 选择项目事件 |

## 插槽(Slots)
该组件不直接暴露插槽。

## 方法(Methods)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| itemAction | prep: any | void | 处理项目动作 |

## 数据结构

### FieldInfo
```typescript
interface FieldInfo {
  label?: string;
  fieldName: string;
  hideFieldName?: string;
  aliasName?: string;
  helpMsg?: string;
  type?: string;
  listPrototypeDisplay?: boolean;
  required?: boolean | Ref<boolean>;
  formVisible?: boolean | Ref<boolean>;
  listVisible?: boolean | Ref<boolean>;
  viewVisible?: boolean | Ref<boolean>;
  minWidth?: number;
  disabled?: boolean | Ref<boolean>;
  editDisabled?: boolean | Ref<boolean>;
  tabList?: TabFieldInfo[];
  cardList?: CardFieldInfo[];
  collapseList?: CollapseList[];
  dytableList?: FieldInfo[];
  batchFieldList?: BatchFieldInfo[];
  defaultValue?: any;
  actions?: Function | Record<string, Function>;
  precision?: number;
  preps?: Record<string, any | CompParams>;
  prefix?: string;
  matchType?: string;
  displayStyle?: string;
  brotherNodes?: FieldInfo[];
  priority?: number;
  searchVisible?: boolean;
  rules?: RuleType[] | any;
  addActions?: Function | string;
  editActions?: Function | string;
  removeActions?: Function | string;
}
```

### ItemPreps
```typescript
interface ItemPreps {
  field: FieldInfo;
  formData: any;
  parentField?: FieldInfo;
  isDesign?: boolean;
  disabled?: boolean;
  bareFlag?: boolean;
  showFormItem?: boolean;
  isSearch?: boolean;
}
```

### Datetime组件preps配置
```typescript
interface DatetimePreps {
  type?: string; // 日期选择器类型，如'date'、'datetime'、'daterange'、'datetimerange'等
  format?: string; // 显示格式，默认为'YYYY-MM-DD HH:mm:ss'
  valueFormat?: string; // 值格式
  disabledDate?: string; // 禁用日期，以分号分隔的日期字符串
  needSplitName?: boolean; // 是否需要分割名称（用于范围选择）
}
```

## 使用示例
```vue
<template>
  <datetime-item
    v-model:form-data="formData"
    :field="fieldConfig"
    @self-func="handleSelfFunc"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import DatetimeItem from '@/components/formcomp/items/datetime-item.vue'

const formData = ref({
  createTime: '',
  dateRange: []
})

const fieldConfig = {
  fieldName: 'createTime',
  label: '创建时间',
  type: 'datetime',
  preps: {
    type: 'datetime',
    format: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss'
  }
}

const handleSelfFunc = (func) => {
  console.log('自定义函数:', func)
}

const handleSelectItem = (item) => {
  console.log('选择项目:', item)
}
</script>
```