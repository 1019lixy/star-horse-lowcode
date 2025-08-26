# CompInfo Component Information Types

## Overview
CompInfo is a set of TypeScript interface types used to define component information, collapsible panel data formats, node information, and edge information.

## Main Types

### CompInfo Component Information
```typescript
interface CompInfo {
  id?: string;              // ID
  name: string;             // Property name
  label: string;            // Label name
  disableDrag: boolean;     // Whether dragging is allowed, default is allowed
  items?: Array<any>;       // Child elements
}
```

### CustomerItem Collapsible Panel Data
```typescript
export interface CustomerItem {
  name: string;             // Collapsible panel name
  title: string;            // Collapsible panel title
  compItems?: Array<CompInfo>; // Data elements within the panel
}
```

### NodeInfo Node Information
```typescript
export interface NodeInfo {
  id?: string;              // Node ID
  index: number;            // Node index
  shape: string;            // Node style
  name: string;             // Node name
  compType?: string;        // Node type, if empty then take 'normal'
  label: string;            // Label name
  data?: any;               // Business data
  posX?: number;            // Node's x coordinate
  posY?: number;            // Node's y coordinate
  icon?: string;            // Node icon
  width?: number;           // Node width
  lineHeight?: number;      // Line height
  items?: Array<any>;       // Field properties when it's a table
}
```

### EdgeInfo Edge Information
```typescript
export interface EdgeInfo {
  id?: string;              // Edge ID
  sourceId: string;         // Connection start component ID
  targetId: string;         // Connection end component ID
  sourcePoint: string;      // Connection start port
  targetPoint: string;      // Connection end port
  data?: any;               // Business data
  label: string;            // Label name
  color: string;            // Label color
}
```

## Usage Example

```typescript
import { CompInfo, CustomerItem, NodeInfo, EdgeInfo } from '@/components/types/CompInfo'

// Component information example
const compInfo: CompInfo = {
  id: 'comp1',
  name: 'input',
  label: 'Input Box',
  disableDrag: false,
  items: []
}

// Collapsible panel data example
const customerItem: CustomerItem = {
  name: 'formComponents',
  title: 'Form Components',
  compItems: [compInfo]
}

// Node information example
const nodeInfo: NodeInfo = {
  id: 'node1',
  index: 1,
  shape: 'rect',
  name: 'start',
  label: 'Start Node',
  compType: 'normal',
  posX: 100,
  posY: 100,
  icon: 'start-icon'
}

// Edge information example
const edgeInfo: EdgeInfo = {
  id: 'edge1',
  sourceId: 'node1',
  targetId: 'node2',
  sourcePoint: 'bottom',
  targetPoint: 'top',
  label: 'Connection Line',
  color: '#409eff'
}
```

## Features

1. Complete component information definition
2. Support for collapsible panel data structure
3. Support for node and edge information definition
4. Support for coordinate and style configuration
5. Support for business data extension
6. Support for drag control
7. Support for icon and label configuration