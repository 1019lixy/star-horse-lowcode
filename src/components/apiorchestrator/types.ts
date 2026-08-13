/**
 * API 编排器类型定义
 */

/** HTTP 方法 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** 参数位置 */
export type ParamLocation = "query" | "path" | "header";

/** API 参数定义 */
export interface ApiEndpointParam {
  name: string;
  location: ParamLocation;
  required: boolean;
  defaultValue: string;
  description: string;
}

/** API 接口定义 */
export interface ApiEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  /** 请求头 */
  headers: Record<string, string>;
  /** 参数列表 */
  params: ApiEndpointParam[];
  /** 请求体（字符串形式，便于 JSON / form 等多种格式） */
  body: string;
  description: string;
}

/** Mock 响应配置 */
export interface MockResponse {
  id: string;
  /** 关联的接口 id */
  endpointId: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  /** 延迟毫秒数，模拟网络耗时 */
  delay: number;
  isActive: boolean;
}

/** 变量提取规则 */
export interface VariableExtraction {
  /** 来源变量路径（响应体 JSON path，如 "data.id"） */
  sourceVar: string;
  /** 目标变量名 */
  targetVar: string;
}

/** 编排步骤 */
export interface ApiChainStep {
  id: string;
  /** 关联的接口 id */
  endpointId: string;
  stepName: string;
  /** 变量提取规则 */
  variableExtractions: VariableExtraction[];
  /** 执行条件表达式（为空表示无条件执行） */
  condition: string;
}

/** API 编排链 */
export interface ApiChain {
  id: string;
  name: string;
  description: string;
  steps: ApiChainStep[];
  /** 编排过程中产生的变量 */
  variables: Record<string, any>;
}

/** 测试结果中的请求快照 */
export interface ApiTestRequest {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
}

/** 测试结果中的响应快照 */
export interface ApiTestResponse {
  status: number;
  statusText: string;
  body: string;
  duration: number;
}

/** 单步测试结果 */
export interface ApiTestResult {
  stepId: string;
  stepName: string;
  request: ApiTestRequest;
  response: ApiTestResponse;
  success: boolean;
  error: string;
  /** 本步骤提取出的变量 */
  extractedVars: Record<string, any>;
}
