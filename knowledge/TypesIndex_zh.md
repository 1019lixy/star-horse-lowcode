# Types Index 类型定义导出索引

## 概述
Types Index 是一个 TypeScript 文件，用于统一导出 [types](file:///e:/lixycode/testcode/src/components/types) 目录下的所有类型定义，方便其他模块按需导入。

## 导出的类型

```typescript
export * from "./ApiUrls";
export * from "./BtnAction";
export * from "./CompInfo";
export * from "./DialogProps";
export * from "./DyCompField";
export * from "./DynamicNode";
export * from "./MenusInfo";
export * from "./PageFieldInfo";
export * from "./PageProps";
export * from "./Params";
export * from "./RuleType";
export * from "./SearchProps";
export * from "./ShortKey";
export * from "./StarHorseType";
export * from "./BtnAuth";
export * from "./ItemPreps";
```

## 类型分类

### API 相关
- **ApiUrls** - API 接口配置类型
- **BtnAction** - 按钮事件类型

### 组件相关
- **CompInfo** - 组件信息类型
- **DyCompField** - 动态组件字段类型
- **DynamicNode** - 动态节点类型
- **ItemPreps** - 组件属性类型

### 页面相关
- **DialogProps** - 弹窗属性类型
- **PageFieldInfo** - 页面字段信息类型
- **PageProps** - 页面属性类型

### 数据相关
- **Params** - 查询参数类型
- **RuleType** - 规则类型
- **SearchProps** - 搜索属性类型

### 系统相关
- **MenusInfo** - 菜单信息类型
- **ShortKey** - 快捷键类型
- **StarHorseType** - 标签类型
- **BtnAuth** - 按钮权限类型

## 使用示例

```typescript
// 按需导入类型定义
import { ApiUrls, PageFieldInfo, SearchParams } from '@/components/types'

// 使用类型定义
const apiConfig: ApiUrls = {
  pageListUrl: '/api/user/page',
  mergeUrl: '/api/user/save'
}

const pageConfig: PageFieldInfo = {
  fieldList: [],
  primaryKey: 'id'
}
```

## 特性

1. **统一导出** - 集中管理所有类型定义的导出
2. **按需导入** - 支持按需导入单个类型定义
3. **完整覆盖** - 包含所有类型定义文件
4. **模块化** - 便于维护和扩展
5. **类型安全** - 完整的 TypeScript 类型支持