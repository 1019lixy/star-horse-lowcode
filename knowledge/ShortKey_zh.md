# ShortKey 快捷键类型

## 概述
ShortKey 是一个 TypeScript 类型，用于定义快捷键配置信息。

## 类型定义

```typescript
export type ShortKey = {
  key: string;              // 快捷键
  action: string;           // 动作名称
  alt?: boolean;            // 是否需要alt键组合
  ctrl?: boolean;           // 是否需要ctrl键组合
  shift?: boolean;          // 是否需要shift键组合
  other?: Array<string> | string; // 其他键
  handler?: Function;        // 处理函数
};
```

## 使用示例

```typescript
import { ShortKey } from '@/components/types/ShortKey'

// 快捷键示例 - 保存操作
const saveShortcut: ShortKey = {
  key: 's',
  action: 'save',
  ctrl: true,
  handler: () => {
    console.log('执行保存操作')
    // 调用保存方法
  }
}

// 快捷键示例 - 刷新操作
const refreshShortcut: ShortKey = {
  key: 'r',
  action: 'refresh',
  ctrl: true,
  shift: true,
  handler: () => {
    console.log('执行刷新操作')
    // 调用刷新方法
  }
}

// 快捷键示例 - 复合键操作
const complexShortcut: ShortKey = {
  key: 'k',
  action: 'search',
  ctrl: true,
  alt: true,
  other: ['meta'], // 支持其他键
  handler: () => {
    console.log('执行搜索操作')
    // 打开搜索框
  }
}

// 快捷键数组示例
const shortcuts: ShortKey[] = [
  saveShortcut,
  refreshShortcut,
  complexShortcut
]
```

## 特性

1. 完整的快捷键配置定义
2. 支持单键和组合键
3. 支持 Ctrl、Alt、Shift 修饰键
4. 支持其他自定义键组合
5. 支持动作名称标识
6. 支持自定义处理函数
7. 适用于键盘快捷键系统