import { ItemRelation } from "@/components/types/ItemPreps";

/**
 * 前后缀事件类型
 * - none: 无事件
 * - linkage: 调用联动策略配置
 * - dataSource: 调用数据源配置
 * - custom: 自定义实现（JS 代码）
 */
export type PreOrPendEventType =
  "none" | "linkage" | "dataSource" | "custom" | "function";

/**
 * 前后缀元素事件配置
 *
 * 直接存储在按钮项的 `actions` 字段上，运行时通过 `eventType` 分发请求
 */
export interface PreOrPendEventConfig {
  /** 事件类别（用于运行时分发） */
  eventType: PreOrPendEventType;
  /** 联动策略配置（eventType = "linkage"） */
  dataRelation?: ItemRelation;
  /** 数据源配置（eventType = "dataSource"） */
  dataSourceConfig?: any;
  /** 自定义 JS 代码（eventType = "custom"） */
  customCode?: string;
  /**
   * 自定义函数
   * 第一个参数 是上下文props
   * 第二个参数 是表单实例数据
   * 第三个参数 是整个表单信息
   */
  funcInfo?: Function;
}
