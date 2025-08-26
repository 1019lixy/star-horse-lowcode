# ServiceEnums 服务枚举

## 概述
ServiceEnums 是一个 TypeScript 枚举类型，用于定义系统服务的常量标识。

## 枚举定义

```typescript
export enum ServiceEnums {
  SYSTEM_SERVICE = "system-config",     // 系统服务
  DBUSER_SERVICE = "dbuser-manage",     // 数据库服务
  GLOBAL_PREFIX = `${SYSTEM_SERVICE}/global/`,  // 公共接口前缀
  SYSTEM_PREFIX = `${SYSTEM_SERVICE}/system/`   // 系统服务接口前缀
}
```

## 使用示例

```typescript
import { ServiceEnums } from '@/components/enums/ServiceEnums'

// 使用服务枚举
const systemService = ServiceEnums.SYSTEM_SERVICE
const dbUserService = ServiceEnums.DBUSER_SERVICE
const globalPrefix = ServiceEnums.GLOBAL_PREFIX
const systemPrefix = ServiceEnums.SYSTEM_PREFIX

// 构建API地址
const userApiUrl = `${ServiceEnums.SYSTEM_PREFIX}user/list`
const globalConfigUrl = `${ServiceEnums.GLOBAL_PREFIX}config`

console.log('系统服务:', systemService) // 输出: system-config
console.log('数据库服务:', dbUserService) // 输出: dbuser-manage
console.log('公共接口前缀:', globalPrefix) // 输出: system-config/global/
console.log('系统服务接口前缀:', systemPrefix) // 输出: system-config/system/
```

## 特性

1. 定义系统服务常量标识
2. 支持服务名称和接口前缀配置
3. 便于维护和统一管理服务标识
4. 支持字符串枚举值
5. 适用于API接口地址构建