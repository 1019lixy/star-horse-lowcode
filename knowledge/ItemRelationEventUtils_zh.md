# ItemRelationEventUtils 组件关联事件工具

## 概述
ItemRelationEventUtils 是一组工具函数，用于处理表单组件之间的关联事件，包括数据联动、字段显示/隐藏控制、字段赋值等。

## 方法

### fieldAssign
```typescript
fieldAssign(props: any, relationFields: Array<string>, values: SelectOption[] | any)
```
为关联字段赋值

### dataLinkage
```typescript
dataLinkage(props: any, item: RelationDetail, e: any)
```
数据联动处理

### eqDisableOrEditable
```typescript
eqDisableOrEditable(props: any, item: RelationDetail, e: any)
```
根据值相等条件控制字段禁用或可编辑状态

### assignValue
```typescript
assignValue(props: any, item: RelationDetail, e: any)
```
为字段赋值静态数据

### changeType
```typescript
changeType(props: any, item: RelationDetail, e: any)
```
根据条件改变字段类型

### relationEvent
```typescript
relationEvent(props: any, relationDetails: RelationDetail[], e: any, actionName: string)
```
处理所有关联事件

### allAction
```typescript
allAction(context: any, emits: any, formData: any, actionName: string, isInit: boolean)
```
处理所有触发的事件

## 数据结构

### RelationDetail 关联关系详情
```typescript
{
  controlCondition: string;  // 控制条件
  relationFields: string[];  // 关联字段
  matchFieldValue: any[];    // 匹配值
  params: any;              // 参数
  matchFieldName: string;   // 匹配字段名
  matchType: string;        // 匹配类型
  staticDatas: any;         // 静态数据
  isWorking: boolean;       // 是否正在工作
}
```

## 控制条件类型

- `eqConditionDataLinkage`: 条件数据联动
- `asParamDataLinkage`: 参数数据联动
- `eqDisable`: 值相等时禁用
- `eqHide`: 值相等时隐藏
- `eqEditable`: 值相等时可编辑
- `eqVisible`: 值相等时显示
- `eqRequired`: 值相等时必填
- `assignValue`: 赋值
- `changeType`: 改变类型

## 使用示例

```typescript
import { relationEvent } from '@/components/formcomp/utils/ItemRelationEventUtils'

// 在组件中使用
const handleFieldChange = (newValue) => {
  // 处理字段关联事件
  relationEvent(
    props,           // 组件props
    relationDetails, // 关联关系配置
    newValue,        // 新值
    'change'         // 动作名称
  )
}
```