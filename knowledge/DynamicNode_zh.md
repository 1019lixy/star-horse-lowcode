# DynamicNode 动态节点类型

## 概述
DynamicNode 是一个 TypeScript 接口类型，用于定义动态节点的属性和结构。

## 类型定义

```typescript
export declare interface DynamicNode {
  id: string;               // 节点ID
  zIndex?: number;          // 层级
  width: number;            // 节点的宽度
  height: number;           // 节点的高度
  left: number;             // 节点的left位置
  top: number;              // 节点的Top位置
  name: string;             // 节点名称
  type?: string;            // 节点类型
  properties?: any;         // 节点属性
  children?: DynamicNode[]; // 子节点
}
```

## 使用示例

```typescript
import { DynamicNode } from '@/components/types/DynamicNode'

// 动态节点示例
const dynamicNode: DynamicNode = {
  id: 'node1',
  zIndex: 1,
  width: 200,
  height: 100,
  left: 50,
  top: 50,
  name: '开始节点',
  type: 'start',
  properties: {
    color: '#409eff',
    borderColor: '#333'
  }
}

// 嵌套节点示例
const nestedNode: DynamicNode = {
  id: 'container1',
  zIndex: 2,
  width: 400,
  height: 300,
  left: 100,
  top: 100,
  name: '容器节点',
  type: 'container',
  properties: {
    backgroundColor: '#f5f5f5'
  },
  children: [
    {
      id: 'child1',
      width: 100,
      height: 50,
      left: 20,
      top: 20,
      name: '子节点1',
      type: 'process'
    },
    {
      id: 'child2',
      width: 100,
      height: 50,
      left: 20,
      top: 100,
      name: '子节点2',
      type: 'decision'
    }
  ]
}
```

## 特性

1. 完整的节点位置和尺寸定义
2. 支持层级控制
3. 支持节点类型标识
4. 支持自定义属性扩展
5. 支持嵌套子节点结构
6. 支持唯一的节点ID
7. 适用于可视化编辑器和流程图