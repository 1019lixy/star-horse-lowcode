/**
 * 公共 API 接口配置组件 —— 统一出口
 * 由 shplugin/src/index.ts `export * from "@/components/apiconfig"`
 * 透传到 star-horse-lowcode 包根，宿主可通过：
 *   import { StarHorseApiConfig, createApiConfigSchema, toEndpointModel } from "star-horse-lowcode";
 * 或直接全局使用 <star-horse-api-config>。
 */
export * from "./types";
export * from "./options";
export * from "./schema";
export * from "./bridge";
export { default as StarHorseApiConfig } from "./StarHorseApiConfig.vue";
