# Params 查询参数类型

## 概述
Params 是一组 TypeScript 接口类型，用于定义查询条件、搜索信息和重定向参数等。

## 主要类型

### SearchParams 查询条件
```typescript
export declare interface SearchParams {
  propertyName?: string;        // 属性名称
  operation?: string | null;    // 匹配方式 (eq,lk,gt,gte,lt,lte,llk,rlk,in,nin,exits)
  value?: any;                  // 查询值
  orOperList?: SearchParams[];  // 或查询
}
```

### JoinSearchParams 连接查询条件
```typescript
export declare interface JoinSearchParams {
  leftFieldName: string;        // 左侧属性名称
  operation?: string | null;    // 匹配方式 (eq,neq,gt,gte,lt,lte)
  rightFieldName: string;       // 右侧属性名称
  or?: JoinSearchParams[];      // 或查询
}
```

### SearchInfo 查询对象
```typescript
export declare interface SearchInfo {
  pageSize?: number;            // 每页数据量大小
  currentPage?: number;         // 页码
  totalDatas?: number;          // 总数据量
  totalPages?: number;          // 总页数
  fieldList?: SearchParams[];   // 查询条件
  orderBy?: OrderByInfo[];      // 排序条件
}
```

### BtnHideCondition 按钮隐藏条件
```typescript
export declare interface BtnHideCondition {
  fieldName: string;            // 属性名
  btnName: Array<string> | string; // 按钮
  value: any;                   // 值
}
```

### RedirectParams 接口重定向参数
```typescript
export declare interface RedirectParams {
  url: string;                  // 接口地址
  host?: string;                // 主机或者域名
  port?: string;                // 端口
  protocol?: string;            // 协议
  env?: string;                 // 环境
  httpMethod?: string;          // http方法
  dataType?: string;            // 数据类型
  queryParams?: SearchParams[]; // 查询条件
  searchInfo?: SearchInfo;      // 分页信息
  primaryKey?: any;             // 主键
  labelName?: string;           // 标签名称
  valueName?: string;           // 值名称
}
```

## 匹配方式说明

- `eq`: 等于
- `lk`: 模糊匹配
- `gt`: 大于
- `gte`: 大于等于
- `lt`: 小于
- `lte`: 小于等于
- `llk`: 左模糊匹配
- `rlk`: 右模糊匹配
- `in`: 在...之中
- `nin`: 不在...之中
- `exits`: 存在

## 使用示例

```typescript
import { SearchParams, SearchInfo, RedirectParams } from '@/components/types/Params'

// 查询条件示例
const searchParams: SearchParams = {
  propertyName: 'name',
  operation: 'lk',
  value: '张三'
}

// 查询对象示例
const searchInfo: SearchInfo = {
  pageSize: 20,
  currentPage: 1,
  fieldList: [searchParams],
  orderBy: [{
    fieldName: 'createTime',
    ascOrDesc: 'desc'
  }]
}

// 重定向参数示例
const redirectParams: RedirectParams = {
  url: '/api/user/list',
  httpMethod: 'POST',
  dataType: 'json',
  queryParams: [searchParams],
  searchInfo: searchInfo
}
```

## 特性

1. 完整的查询条件定义
2. 支持连接查询
3. 支持分页和排序
4. 支持按钮隐藏条件
5. 支持接口重定向参数
6. 支持多种匹配方式
7. 支持或查询条件
8. 与排序信息集成