# BtnAction 按钮事件类型

## 概述
BtnAction 是一组 TypeScript 接口类型，用于定义按钮事件和动态参数字段的配置信息。

## 主要类型

### DynamicParamField 动态参数字段
```typescript
export declare interface DynamicParamField {
  paramName: string;        // 参数名称
  matchType: string;        // 匹配类型
  defaultValue?: any;       // 默认值
}
```

### BtnAction 按钮事件
```typescript
export declare interface BtnAction {
  viewType: "inter" | "comp" | "code" | "method"; // 视图类型
  idDynamicForm?: string;   // 动态表单参数
  componentName?: string;   // 动态组件名称
  isDynamicParam?: string;  // 是否动态参数
  params?: SearchParams[] | DynamicParamField[]; // 动态参数
  url?: string;             // 接口地址
  method?: string;          // 请求方式
  needConfirm?: string;     // 是否需要确认
  confirmMsg?: string;      // 确认提示信息
  needRefresh?: string;     // 是否需要刷新
  afterAction?: string;     // 接口执行完成后的动作
  actions?: Function;        // 执行函数
  code?: string;            // js代码块
}
```

## 视图类型说明

- `inter`: 接口调用
- `comp`: 组件调用
- `code`: 代码执行
- `method`: 方法调用

## afterAction 动作类型

- `assignCurrentName`: 赋值当前名称
- `assignForm`: 赋值给表单

## 使用示例

```typescript
import { BtnAction, DynamicParamField } from '@/components/types/BtnAction'

// 动态参数字段示例
const dynamicParam: DynamicParamField = {
  paramName: 'userId',
  matchType: 'eq',
  defaultValue: 1
}

// 按钮事件示例 - 接口调用
const apiBtnAction: BtnAction = {
  viewType: 'inter',
  url: '/api/user/delete',
  method: 'POST',
  needConfirm: 'Y',
  confirmMsg: '确定要删除该用户吗？',
  needRefresh: 'Y',
  afterAction: 'assignForm',
  params: [dynamicParam]
}

// 按钮事件示例 - 代码执行
const codeBtnAction: BtnAction = {
  viewType: 'code',
  code: `
    console.log('执行自定义代码');
    this.formData.status = 'active';
  `
}

// 按钮事件示例 - 方法调用
const methodBtnAction: BtnAction = {
  viewType: 'method',
  actions: function() {
    console.log('执行自定义方法');
    this.refreshData();
  }
}
```

## 特性

1. 支持多种视图类型
2. 支持动态参数配置
3. 支持接口调用配置
4. 支持确认提示机制
5. 支持刷新控制
6. 支持执行后动作
7. 支持自定义函数和代码块
8. 支持动态表单和组件