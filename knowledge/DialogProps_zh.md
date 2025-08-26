# DialogProps 弹窗属性类型

## 概述
DialogProps 是一个 TypeScript 类型，用于定义弹窗组件的各种属性和控制变量。

## 类型定义

```typescript
export type DialogProps = {
  batchDialogTitle?: string;      // 批量编辑标题
  dialogTitle?: string;           // 编辑标题
  batchEditVisible?: boolean;     // 批量编辑弹窗控制变量
  editVisible?: boolean;          // 编辑弹窗控制变量
  uploadVisible?: boolean;        // 上传组件控制变量
  viewVisible?: boolean;          // 查看数据控制变量
  bakeVisible1?: boolean;         // 弹窗显示/隐藏备用1
  bakeVisible2?: boolean;         // 弹窗显示/隐藏备用2
  bakeVisible3?: boolean;         // 弹窗显示/隐藏备用3
  ids?: number | string | undefined | null; // 数据id
  isExpand?: boolean;             // 是否扩展表
  expandUrl?: ApiUrls;            // 扩展表的接口API
};
```

## 使用示例

```typescript
import { DialogProps } from '@/components/types/DialogProps'

const dialogProps: DialogProps = {
  dialogTitle: '编辑用户信息',
  editVisible: false,
  batchDialogTitle: '批量编辑用户',
  batchEditVisible: false,
  ids: null
}

// 在组件中使用
const openEditDialog = (id?: number) => {
  dialogProps.ids = id
  dialogProps.dialogTitle = id ? '编辑用户' : '新增用户'
  dialogProps.editVisible = true
}

const closeEditDialog = () => {
  dialogProps.editVisible = false
  dialogProps.ids = null
}
```

## 特性

1. 完整的弹窗控制变量
2. 支持编辑和批量编辑模式
3. 支持上传和查看模式
4. 提供备用控制变量
5. 支持数据ID管理
6. 支持扩展表功能
7. 与API接口集成