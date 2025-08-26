# CompInfo 组件信息类型

## 概述
CompInfo 是一组 TypeScript 接口类型，用于定义组件信息、折叠面板数据格式、节点信息和边信息。

## 主要类型

### CompInfo 组件信息
```typescript
interface CompInfo {
  id?: string;              // ID
  name: string;             // 属性名称
  label: string;            // 标签名称
  disableDrag: boolean;     // 是否允许拖拽，默认允许
  items?: Array<any>;       // 子元素
}
```

### CustomerItem 折叠面板数据
```typescript
export interface CustomerItem {
  name: string;             // 折叠面板名称
  title: string;            // 折叠面板标题
  compItems?: Array<CompInfo>; // 面板内的数据元素
}
```

### NodeInfo 节点信息
```typescript
export interface NodeInfo {
  id?: string;              // 节点Id
  index: number;            // 节点索引
  shape: string;            // 节点样式
  name: string;             // 节点名称
  compType?: string;        // 节点类型为空则取normal
  label: string;            // 标签名称
  data?: any;               // 业务数据
  posX?: number;            // 节点的x坐标
  posY?: number;            // 节点的y坐标
  icon?: string;            // 节点图标
  width?: number;           // 节点宽度
  lineHeight?: number;      // 行高
  items?: Array<any>;       // 表格时的字段属性
}
```

### EdgeInfo 边信息
```typescript
export interface EdgeInfo {
  id?: string;              // 边Id
  sourceId: string;         // 连接起点组件Id
  targetId: string;         // 链接终点组件Id
  sourcePoint: string;      // 链接起点桩
  targetPoint: string;      // 链接终点桩
  data?: any;               // 业务数据
  label: string;            // 标签名称
  color: string;            // 标签颜色
}
```

## 使用示例

```typescript
import { CompInfo, CustomerItem, NodeInfo, EdgeInfo } from '@/components/types/CompInfo'

// 组件信息示例
const compInfo: CompInfo = {
  id: 'comp1',
  name: 'input',
  label: '输入框',
  disableDrag: false,
  items: []
}

// 折叠面板数据示例
const customerItem: CustomerItem = {
  name: 'formComponents',
  title: '表单组件',
  compItems: [compInfo]
}

// 节点信息示例
const nodeInfo: NodeInfo = {
  id: 'node1',
  index: 1,
  shape: 'rect',
  name: 'start',
  label: '开始节点',
  compType: 'normal',
  posX: 100,
  posY: 100,
  icon: 'start-icon'
}

// 边信息示例
const edgeInfo: EdgeInfo = {
  id: 'edge1',
  sourceId: 'node1',
  targetId: 'node2',
  sourcePoint: 'bottom',
  targetPoint: 'top',
  label: '连接线',
  color: '#409eff'
}
```

## 特性

1. 完整的组件信息定义
2. 支持折叠面板数据结构
3. 支持节点和边信息定义
4. 支持坐标和样式配置
5. 支持业务数据扩展
6. 支持拖拽控制
7. 支持图标和标签配置