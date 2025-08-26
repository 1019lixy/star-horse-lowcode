# RuleType 规则类型

## 概述
RuleType 是一个 TypeScript 接口类型，用于定义表单验证规则。

## 类型定义

```typescript
export declare interface RuleType {
  name: any;        // 规则名称
  options?: any;    // 参数选项
}
```

## 使用示例

```typescript
import { RuleType } from '@/components/types/RuleType'

// 基本规则示例
const requiredRule: RuleType = {
  name: 'required',
  options: { message: '此字段为必填项' }
}

// 长度规则示例
const lengthRule: RuleType = {
  name: 'maxLength',
  options: { 
    value: 50, 
    message: '长度不能超过50个字符' 
  }
}

// 正则规则示例
const patternRule: RuleType = {
  name: 'pattern',
  options: { 
    value: /^[a-zA-Z0-9]+$/, 
    message: '只能包含字母和数字' 
  }
}
```

## 特性

1. 简洁的规则定义
2. 支持自定义参数选项
3. 灵活的规则名称配置
4. 易于扩展和使用