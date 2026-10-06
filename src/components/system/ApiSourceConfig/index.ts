/**
 * 第三方接口配置组件 —— 统一出口
 *
 * 由 src/components/system/index.ts `export * from "./ApiSourceConfig"` 透传，
 * 宿主可通过：
 *   import { StarHorseApiSourceConfig, createApiSourceSchema } from "star-horse-lowcode";
 * 或直接全局使用 <star-horse-api-source-config>。
 */
export * from "./types";
export * from "./options";
export * from "./schema";

export { default as StarHorseApiSourceConfig } from "./StarHorseApiSourceConfig.vue";