# PageProps 页面属性类型

## 概述
PageProps 是一个 TypeScript 接口类型，用于定义页面分页数据的属性信息。

## 类型定义

```typescript
export declare interface PageProps {
  totalData?: number;       // 数据总条数
  pageSize?: number;        // 每页数据条数
  currentPage?: number;     // 页码
  totalPage?: number;       // 总页数
  dataList?: Array<any> | null; // 数据
}
```

## 使用示例

```typescript
import { PageProps } from '@/components/types/PageProps'

// 页面属性示例
const pageProps: PageProps = {
  totalData: 100,
  pageSize: 20,
  currentPage: 1,
  totalPage: 5,
  dataList: [
    { id: 1, name: '用户1' },
    { id: 2, name: '用户2' },
    // ...更多数据
  ]
}

// 在分页组件中使用
const handlePageChange = (newPage: number) => {
  pageProps.currentPage = newPage
  // 重新加载数据
  loadData()
}

const handlePageSizeChange = (newSize: number) => {
  pageProps.pageSize = newSize
  pageProps.currentPage = 1 // 重置到第一页
  // 重新加载数据
  loadData()
}
```

## 特性

1. 完整的分页信息定义
2. 支持数据总量统计
3. 支持每页大小配置
4. 支持当前页码控制
5. 支持总页数计算
6. 支持数据列表存储
7. 适用于各种分页场景