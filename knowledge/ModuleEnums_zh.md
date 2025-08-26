# ModuleEnums 模块枚举

## 概述
ModuleEnums 是一个 TypeScript 枚举类型，用于定义系统模块的常量标识。

## 枚举定义

```typescript
export enum ModuleEnums {
  DYNAMIC_FORM = "dynamic-form",   // 动态表单
  DYNAMIC_PAGE = "dynamic-page"    // 动态页面
}
```

## 使用示例

```typescript
import { ModuleEnums } from '@/components/enums/ModuleEnums'

// 使用模块枚举
const dynamicFormModule = ModuleEnums.DYNAMIC_FORM
const dynamicPageModule = ModuleEnums.DYNAMIC_PAGE

// 模块路由配置
const moduleRoutes = {
  [ModuleEnums.DYNAMIC_FORM]: '/form/design',
  [ModuleEnums.DYNAMIC_PAGE]: '/page/design'
}

// 模块权限控制
const checkModulePermission = (module: ModuleEnums) => {
  switch (module) {
    case ModuleEnums.DYNAMIC_FORM:
      return hasPermission('form-design')
    case ModuleEnums.DYNAMIC_PAGE:
      return hasPermission('page-design')
    default:
      return false
  }
}

// 模块名称显示
const getModuleDisplayName = (module: ModuleEnums) => {
  const moduleNames = {
    [ModuleEnums.DYNAMIC_FORM]: '动态表单',
    [ModuleEnums.DYNAMIC_PAGE]: '动态页面'
  }
  return moduleNames[module] || '未知模块'
}
```

## 特性

1. 定义系统模块常量标识
2. 支持动态表单和动态页面模块
3. 便于维护和统一管理模块标识
4. 支持字符串枚举值
5. 适用于路由配置和权限控制