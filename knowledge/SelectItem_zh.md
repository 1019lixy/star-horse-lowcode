# SelectItem 下拉选择组件

## 概述
SelectItem组件是基于Element Plus的el-select组件封装的下拉选择组件。它支持远程搜索、多选、全选、动态数据加载等功能，适用于各种选择场景。

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
| 插槽名 | 描述 |
|--------|------|
| header | 头部插槽（用于全选） |
| footer | 底部插槽（用于添加选项） |

## 方法(Methods)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| itemAction | prep: any | void | 处理项目动作 |
| initData | none | Promise<void> | 初始化数据 |
| onAddOption | none | void | 添加选项 |
| onConfirm | none | void | 确认添加选项 |
| clear | none | void | 清除选项 |
| handleCheckAll | val: any | void | 处理全选 |
| remoteMethod | queryString: string | Promise<void> | 远程搜索方法 |

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

### Select组件preps配置
```typescript
interface SelectPreps {
  multiple?: boolean; // 是否多选
  values?: Array<any>; // 选项值
  props?: {
    label?: string; // 标签字段名，默认为'name'
    value?: string; // 值字段名，默认为'value'
  };
  showFooter?: boolean; // 是否显示底部
  dataSource?: string; // 数据源类型
  selectLabel?: string; // 搜索字段名
  remote?: boolean; // 是否远程搜索
  filterable?: boolean; // 是否可过滤
  collapseTags?: boolean; // 是否折叠标签
}
```

## 使用示例
```vue
<template>
  <select-item
    v-model:form-data="formData"
    :field="fieldConfig"
    @self-func="handleSelfFunc"
    @select-item="handleSelectItem"
  />
</template>

<script setup>
import { ref } from 'vue'
import SelectItem from '@/components/formcomp/items/select-item.vue'

const formData = ref({
  status: ''
})

const fieldConfig = {
  fieldName: 'status',
  label: '状态',
  type: 'select',
  preps: {
    multiple: false,
    values: [
      { name: '正常', value: '1' },
      { name: '禁用', value: '2' }
    ],
    showFooter: true
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