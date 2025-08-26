# InputItem 输入框组件

## 概述
InputItem组件是基于Element Plus的el-input组件封装的输入框组件。它支持前置和后置内容、双击编辑、动态事件绑定等功能，适用于各种文本输入场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| field | FieldInfo | required | 字段配置信息 |
| formData | Object | required | 表单数据对象 |
| parentField | FieldInfo | undefined | 父级字段信息 |
| isDesign | Boolean | false | 是否为设计模式 |
| disabled | Boolean | false | 是否禁用 |
| bareFlag | Boolean | false | 是否为简洁模式 |
| showFormItem | Boolean | true | 是否显示表单项包装 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| selfFunc | function | 自定义函数事件 |
| selectItem | item | 选择项目事件 |

## 插槽(Slots)
| 插槽名 | 描述 |
|--------|------|
| prepend | 前置内容插槽 |
| append | 后置内容插槽 |

## 方法(Methods)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| initEvent | none | Promise<void> | 初始化事件 |
| itemAction | prep: any | void | 处理项目动作 |
| handleContentConfirm | newContent: string | void | 处理内容确认 |
| editContent | none | void | 编辑内容 |

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
}
```

## 使用示例
```vue
<template>
  <input-item
    v-model:form-data="formData"
    :field="fieldConfig"
    @self-func="handleSelfFunc"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import InputItem from '@/components/formcomp/items/input-item.vue'

const formData = ref({
  name: '',
  email: ''
})

const fieldConfig = {
  fieldName: 'name',
  label: '姓名',
  type: 'input',
  preps: {
    prependText: '前缀',
    appendText: '后缀'
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