# BtnAuth 按钮权限类型

## 概述
BtnAuth 是一组 TypeScript 接口类型，用于定义按钮权限和前置验证规则。

## 主要类型

### BtnAuth 按钮权限
```typescript
export declare interface BtnAuth {
  btnName: string;        // 按钮名字
  icon?: string;          // 图标
  labelName: string;      // 标签名字
  exec?: Function;        // 自定义调用方法
  disabled?: string;      // 是否禁用 (Y 是 N否)
  children?: BtnAuth[];   // 子节点
}
```

### PreValid 前置验证
```typescript
export declare interface PreValid {
  authority: string;      // 权限标识
  valid: Function;        // 校验方法
  msg?: string;           // 校验失败提示信息
}
```

## 使用示例

```typescript
import { BtnAuth, PreValid } from '@/components/types/BtnAuth'

// 按钮权限示例
const btnAuth: BtnAuth = {
  btnName: '删除',
  icon: 'delete',
  labelName: 'deleteBtn',
  exec: () => {
    console.log('执行删除操作')
  },
  disabled: 'N'
}

// 前置验证示例
const preValid: PreValid = {
  authority: 'delete',
  valid: () => {
    return confirm('确定要删除吗？')
  },
  msg: '删除操作已取消'
}
```

## 特性

1. 完整的按钮权限定义
2. 支持图标和标签配置
3. 支持自定义执行方法
4. 支持禁用状态控制
5. 支持树形结构子节点
6. 支持前置验证规则
7. 支持验证失败提示信息