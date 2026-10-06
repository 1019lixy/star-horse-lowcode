/**
 * API 编排器类型定义
 */

/** HTTP 方法 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** 参数位置 */
export type ParamLocation = "query" | "path" | "header";

/**
 * 参数取值方式
 * - static: 直接使用配置的字面值（仍支持 {{变量}} 插值）
 * - dynamic: 绑定一个运行时变量，其值可来自全局变量或上游步骤的提取结果，
 *   用于显式表达"接口执行结果 → 下游入参"的参数传递
 */
export type ParamValueType = "static" | "dynamic";

/**
 * 请求体格式（决定 body 如何序列化以及默认 Content-Type）
 * - none: 无请求体
 * - json: JSON 字符串请求体（application/json）
 * - raw: 原样文本请求体（text/plain）
 * - form-data: 键值对表单（multipart/form-data）
 * - x-www-form-urlencoded: 键值对表单（application/x-www-form-urlencoded）
 */
export type RequestFormat =
  | "none"
  | "json"
  | "raw"
  | "form-data"
  | "x-www-form-urlencoded";

/** 通用键值对（用于表单参数、全局头/查询/变量编辑） */
export interface ApiKeyValue {
  id: string;
  name: string;
  /** 值，支持 {{变量}} 插值（valueType=dynamic 时作为绑定缺失的兜底） */
  value: string;
  enabled: boolean;
  description?: string;
  /** 取值方式，缺省视为 static */
  valueType?: ParamValueType;
  /** valueType=dynamic 时绑定的运行时变量名（支持点号路径） */
  sourceVar?: string;
}

/** API 参数定义（query / path / header） */
export interface ApiEndpointParam {
  name: string;
  location: ParamLocation;
  required: boolean;
  /**
   * 参数取值，支持 {{变量}} 插值。执行时优先取同名运行时变量，
   * 否则回退到此默认值。
   */
  defaultValue: string;
  description: string;
  /** 是否参与请求组装，缺省视为启用 */
  enabled?: boolean;
  /** 取值方式，缺省视为 static */
  valueType?: ParamValueType;
  /** valueType=dynamic 时绑定的运行时变量名（支持点号路径） */
  sourceVar?: string;
}

/**
 * 响应解析配置（对齐 dynamicform 第三方接口配置的「返回值解析」）。
 * 执行管线按 codePath 校验业务码，按 dataPath 定位数据节点，
 * 步骤的变量提取（sourceVar）以解析后的数据节点为根。
 */
export interface ResponseParsing {
  /** 返回模板（string/number/result_data/result_data_list/result_data_map/map/list） */
  responseTemplate: string;
  /** 成功码：codePath 处的值等于它视为业务成功；空表示不校验业务码 */
  successCode: string;
  /** 状态码路径（如 "code"、"status.code"） */
  codePath: string;
  /** 数据路径（如 "data"、"result.records"），空表示整个响应体 */
  dataPath: string;
}

/** API 接口定义 */
export interface ApiEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  /** 请求头（值支持 {{变量}} 插值） */
  headers: Record<string, string>;
  /** query / path / header 参数列表 */
  params: ApiEndpointParam[];
  /** 请求体格式 */
  requestFormat: RequestFormat;
  /** 请求体（字符串形式，用于 json / raw 格式，支持 {{变量}} 插值） */
  body: string;
  /** 表单请求体键值对（用于 form-data / x-www-form-urlencoded 格式） */
  bodyParams: ApiKeyValue[];
  description: string;
  /** 响应解析配置（缺省按 code/data 模板解析） */
  responseParsing?: ResponseParsing;

}

/** 全局参数配置（作用于编排链内所有接口） */
export interface GlobalConfig {
  /** 全局请求头，会被接口同名头覆盖 */
  headers: Record<string, string>;
  /** 全局查询参数，会与接口查询参数合并 */
  query: Record<string, string>;
  /** 全局变量，作为 {{var}} 插值与条件求值的基线变量 */
  variables: Record<string, any>;
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
  /** 提取后的类型转换（string/number/boolean/array），缺省不转换 */
  typeConvert?: string;
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

/** 编排链入口参数取值类型 */
export type ChainInputType = "string" | "number" | "boolean" | "object" | "array";

/**
 * 编排链入口参数（入口表单变量）
 * 作为整条链运行时的基线变量，供第一个及后续接口的
 * {{变量}} 插值、dynamic 参数绑定、条件求值消费。
 */
export interface ChainInput {
  id: string;
  /** 变量名（唯一，供 {{name}} / sourceVar 引用） */
  name: string;
  /** 取值类型 */
  type: ChainInputType;
  /** 是否必填 */
  required: boolean;
  /** 默认值（字符串形态，按 type 转换后注入运行时变量） */
  defaultValue: string;
  /** 说明 */
  description?: string;
}

/** API 编排链 */
export interface ApiChain {
  id: string;
  name: string;
  description: string;
  steps: ApiChainStep[];
  /** 全局参数配置（作用于所有接口） */
  globalConfig: GlobalConfig;
  /** 编排入口参数（运行时基线变量） */
  inputs: ChainInput[];
  /** 编排过程中产生的变量（步骤提取结果会回写至此） */
  variables: Record<string, any>;
}

/** 测试结果中的请求快照 */
export interface ApiTestRequest {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  /** 组装后的最终地址（含 query 字符串） */
  fullUrl?: string;
  /** 请求体格式 */
  format?: RequestFormat;
  /** 解析后生效的查询参数 */
  query?: ApiKeyValue[];
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
  /** 响应按 dataPath 解析后的数据节点（供提取与下游传参） */
  parsedData?: any;
}
