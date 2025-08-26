# CheckboxItem 复选框组件

## 概述
CheckboxItem组件是基于Element Plus的el-checkbox-group和el-checkbox组件封装的复选框组件。它支持动态数据加载、事件绑定等功能，适用于多选场景。

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
| itemAction | none | void | 处理项目动作 |
| initData | none | Promise<void> | 初始化数据 |

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

### Checkbox组件preps配置
```typescript
interface CheckboxPreps {
  values?: Array<any>; // 选项值
  props?: {
    label?: string; // 标签字段名，默认为'name'
    value?: string; // 值字段名，默认为'value'
  };
}
```

## 使用示例
```vue
<template>
  <checkbox-item
    v-model:form-data="formData"
    :field="fieldConfig"
    @self-func="handleSelfFunc"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import CheckboxItem from '@/components/formcomp/items/checkbox-item.vue'

const formData = ref({
  hobbies: []
})

const fieldConfig = {
  fieldName: 'hobbies',
  label: '爱好',
  type: 'checkbox',
  preps: {
    values: [
      { name: '读书', value: 'reading' },
      { name: '游泳', value: 'swimming' },
      { name: '跑步', value: 'running' }
    ]
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