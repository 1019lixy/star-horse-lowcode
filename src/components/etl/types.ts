/**
 * ETL 数据管道类型定义
 */

/** ETL 节点类型分类 */
export type EtlNodeCategory =
  "source" | "transform" | "destination" | "control";

/** ETL 节点类型 */
export type EtlNodeType =
  | "source.database"
  | "source.api"
  | "source.file"
  | "source.json"
  | "source.csv"
  | "transform.filter"
  | "transform.map"
  | "transform.join"
  | "transform.aggregate"
  | "transform.sort"
  | "transform.deduplicate"
  | "transform.formula"
  | "destination.database"
  | "destination.api"
  | "destination.file"
  | "destination.webhook"
  | "control.merge"
  | "control.branch";

/** 节点状态 */
export type EtlNodeStatus =
  "idle" | "running" | "success" | "error" | "skipped";

/** 数据字段定义 */
export interface EtlField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object";
  nullable?: boolean;
}

/** ETL 节点 */
export interface EtlNode {
  id: string;
  type: EtlNodeType;
  category: EtlNodeCategory;
  name: string;
  x: number;
  y: number;
  /** 节点配置（按类型不同） */
  config: Record<string, any>;
  /** 输入字段 schema */
  inputFields?: EtlField[];
  /** 输出字段 schema */
  outputFields?: EtlField[];
  /** 运行状态 */
  status?: EtlNodeStatus;
  /** 运行结果记录数 */
  rowCount?: number;
  /** 错误信息 */
  error?: string;
  /** 运行耗时（毫秒） */
  duration?: number;
}

/** ETL 连线 */
export interface EtlEdge {
  id: string;
  source: string;
  target: string;
  /** 源端口（多输出节点用） */
  sourcePort?: string;
  /** 目标端口（多输入节点用） */
  targetPort?: string;
  label?: string;
}

/** ETL 管道 */
export interface EtlPipeline {
  id: string;
  name: string;
  description?: string;
  nodes: EtlNode[];
  edges: EtlEdge[];
  /** 调度配置 */
  schedule?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** 节点类型预设 */
export interface EtlNodeTypePreset {
  type: EtlNodeType;
  category: EtlNodeCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
  /** 默认配置 */
  defaultConfig: Record<string, any>;
  /** 输入端口数（0=源, 1=单输入, -1=多输入） */
  inputs: number;
  /** 输出端口数（0=目标, 1=单输出, -1=多输出） */
  outputs: number;
}

/** 数据预览记录 */
export interface EtlPreviewData {
  nodeId: string;
  fields: EtlField[];
  rows: Record<string, any>[];
  total: number;
}
