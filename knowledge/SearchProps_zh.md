# SearchProps 搜索属性类型

## 概述
SearchProps 是一组 TypeScript 类型，用于定义搜索组件的属性和选项。

## 主要类型

### SelectOption 选择项
```typescript
export type SelectOption = {
  name?: string;                          // 选项名称
  value?: string | number;                // 选项值
  disabled?: string;                      // 是否禁用
  children?: SelectOption[] | Ref<SelectOption[]>; // 子选项
};
```

### SearchProps 搜索属性
```typescript
export type SearchProps = {
  label?: string;                         // 标签
  fieldName?: string;                     // 字段名
  type?: string;                          // 类型
  matchType?: string;                     // 匹配类型
  disabled?: boolean | string;            // 是否禁用
  defaultValue?: any | null;              // 默认值
  defaultVisible?: boolean;               // 默认可见
  helpMsg?: string;                       // 帮助信息
  minWidth?: string;                      // 最小宽度
  prefix?: string;                        // 表的别名
  params?: CompParams;                    // 弹窗数据配置
  preps?: any;                            // 其他属性
  optionList?: SelectOption[] | Ref<SelectOption[]>; // 选项列表（已废弃）
};
```

### SearchFields 搜索字段
```typescript
export type SearchFields = {
  fieldList: SearchProps[];               // 搜索属性列表
};
```

## 使用示例

```typescript
import { SearchProps, SelectOption } from '@/components/types/SearchProps'

// 选择项示例
const options: SelectOption[] = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2' },
  { name: '选项3', value: '3', disabled: 'Y' }
]

// 搜索属性示例
const searchProps: SearchProps = {
  label: '姓名',
  fieldName: 'name',
  type: 'input',
  matchType: 'lk',
  defaultValue: null,
  defaultVisible: true,
  helpMsg: '请输入姓名进行搜索',
  minWidth: '120px'
}

// 搜索字段示例
const searchFields: SearchFields = {
  fieldList: [searchProps]
}
```

## 特性

1. 完整的选择项定义
2. 支持树形结构选项
3. 丰富的搜索属性配置
4. 支持默认值和可见性控制
5. 支持帮助信息提示
6. 支持表别名前缀
7. 支持弹窗数据配置
8. 支持自定义属性扩展