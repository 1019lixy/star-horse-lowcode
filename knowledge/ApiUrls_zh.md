# ApiUrls API接口配置类型

## 概述
ApiUrls 是一个 TypeScript 接口类型，用于定义组件所需的各种 API 接口地址和配置信息。

## 类型定义

```typescript
export type ApiUrls = {
  // 分页接口
  pageListUrl: string;
  
  // merge接口
  mergeUrl: string;
  
  // merge暂存接口
  mergeDraftUrl: string;
  
  // 批量Merge接口
  batchMergeUrl: string;
  
  // 批量暂存接口
  batchMergeDraftUrl: string;
  
  // 根据Id获取数据接口
  loadByIdUrl: string;
  
  // 根据Id获取数据接口（查看模式）
  loadByIdForViewUrl: string;
  
  // 删除数据接口
  deleteUrl: string;
  
  // 根据条件删除数据
  deleteByConditionUrl?: string;
  
  // 导出数据接口
  exportAllUrl?: string;
  
  // 下载模板接口
  downloadTemplateUrl?: string;
  
  // 自定义查询接口（返回满足条件的所有数据）
  listConditionUrl?: string;
  
  // 自定义查询接口（返回满足条件的一条数据）
  oneConditionUrl?: string;
  
  // 上载接口
  uploadUrl?: string;
  
  // 导入数据接口
  importUrl?: string;
  
  // 执行接口
  executeUrl?: string;
  
  // 修改字段接口
  modifyColumnsUrl?: string;
  
  // 接口路径前缀
  basePrefix?: string;
  
  // 权限接口
  permissionsUrl?: string;
  
  // 应用名称
  appName?: string;
  
  // 接口过滤条件
  condition?: Array<SearchParams>;
  
  // 是否接口转发
  redirect?: boolean;
  
  // 接口请求方式
  httpMethod?: string;
  
  // 数据请求方式
  dataType?: string;
  
  // 分页接口函数
  pageAction?: Function;
  
  // 编辑接口函数
  mergeAction?: Function;
  
  // 编辑暂存接口函数
  mergeDraftAction?: Function;
  
  // 批量编辑接口函数
  batchMergeAction?: Function;
  
  // 批量编辑暂存接口函数
  batchMergeDraftAction?: Function;
  
  // 根据Id获取数据接口函数
  loadByIdAction?: Function;
  
  // 删除数据接口函数
  deleteAction?: Function;
  
  // 根据条件删除数据函数
  deleteByConditionAction?: Function;
  
  // 导出数据接口函数
  exportDataAction?: Function;
  
  // 下载模板接口函数
  downloadTemplateAction?: Function;
  
  // 自定义查询接口函数
  queryConditionAction?: Function;
  
  // 自定义查询接口函数
  queryOneByConditionAction?: Function;
  
  // 上载接口函数
  uploadAction?: Function;
  
  // 导入数据接口函数
  importAction?: Function;
  
  // 执行接口函数
  executeAction?: Function;
  
  // 修改字段接口函数
  modifyColumnsAction?: Function;
};
```

## 使用示例

```typescript
import { ApiUrls } from '@/components/types/ApiUrls'

const apiConfig: ApiUrls = {
  pageListUrl: '/api/user/page',
  mergeUrl: '/api/user/save',
  deleteUrl: '/api/user/delete',
  loadByIdUrl: '/api/user/detail',
  // 其他接口配置...
}

// 在组件中使用
const fetchData = async () => {
  const response = await fetch(apiConfig.pageListUrl)
  // 处理响应数据
}
```

## 特性

1. 完整的 CRUD 接口配置
2. 支持批量操作接口
3. 支持暂存操作接口
4. 支持自定义查询接口
5. 支持文件上传下载接口
6. 支持权限控制接口
7. 支持函数形式的接口调用
8. 支持接口前缀和重定向配置