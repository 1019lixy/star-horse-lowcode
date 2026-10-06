/**
 * Mock 服务：请求组装、响应匹配、模拟请求、真实请求、变量提取
 * 全部使用浏览器原生 API，不依赖第三方库（真实请求走 axios 实例）
 */
import { getAxiosInstance } from "@/api/star_horse_apis";
import type {
  ApiEndpoint,
  ApiEndpointParam,
  ApiKeyValue,
  GlobalConfig,
  MockResponse,
  RequestFormat,
  ResponseParsing,
  VariableExtraction,
} from "../types";

/** 生成简单唯一 id */
const genId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

/** 在 mocks 中查找指定接口启用的 mock 响应 */
export const matchMock = (
  endpointId: string,
  mocks: MockResponse[],
): MockResponse | null => {
  return mocks.find((m) => m.endpointId === endpointId && m.isActive) ?? null;
};

/** 按 JSON path 取值，支持点号分隔与数组下标（如 "data.list.0.id"） */
const getByPath = (obj: any, path: string): any => {
  if (!path) return obj;
  const segments = path.split(".");
  let current: any = obj;
  for (const seg of segments) {
    if (current == null) return undefined;
    if (/^\d+$/.test(seg)) {
      current = current[Number(seg)];
    } else {
      current = current[seg];
    }
  }
  return current;
};

/** 响应解析结果 */
export interface ParsedResponse {
  /** 业务是否成功（未配置 successCode 或响应无业务结构时不校验，视为成功） */
  ok: boolean;
  /** codePath 处的实际值（无法定位时为 undefined） */
  code: any;
  /** 配置期望的成功码 */
  expectedCode: string;
  /** 业务消息（自动探测 message / msg / cnMessage / error 字段） */
  message: string;
  /** dataPath 定位的数据节点（dataPath 为空或未命中时回退为整个响应体） */
  data: any;
  /** 完整解析后的响应体（JSON 解析失败时为原始字符串） */
  root: any;
}

/** 业务消息的常见字段（按优先级探测） */
const MESSAGE_FIELDS = ["message", "msg", "cnMessage", "error"];

/**
 * 响应解析：对齐 dynamicform 第三方接口「返回值解析」。
 * 1. JSON.parse 响应体（失败则不做业务校验）；
 * 2. codePath 处的值与 successCode 比较（successCode 为空不校验）；
 * 3. dataPath 定位数据节点，作为变量提取与下游传参的根。
 */
export const parseResponse = (
  body: any,
  parsing?: ResponseParsing,
): ParsedResponse => {
  let root: any = body;
  if (typeof body === "string") {
    try {
      root = JSON.parse(body);
    } catch {
      root = body;
    }
  }
  const codePath = parsing?.codePath ?? "";
  const successCode = (parsing?.successCode ?? "").trim();
  const dataPath = parsing?.dataPath ?? "";

  // 非 JSON 结构或未配置业务码校验 → 视为成功
  if (root === null || typeof root !== "object" || !codePath || !successCode) {
    return {
      ok: true,
      code: undefined,
      expectedCode: successCode,
      message: "",
      data: dataPath ? getByPath(root, dataPath) : root,
      root,
    };
  }

  const code = getByPath(root, codePath);
  const ok = String(code) === successCode;
  let message = "";
  if (!ok) {
    for (const f of MESSAGE_FIELDS) {
      const v = getByPath(root, f);
      if (v !== undefined && v !== null && v !== "") {
        message = String(v);
        break;
      }
    }
  }
  return {
    ok,
    code,
    expectedCode: successCode,
    message,
    data: dataPath ? getByPath(root, dataPath) : root,
    root,
  };
};

/**
 * 从响应体中按提取规则抽取变量。
 * sourceVar 以 parseResponse 定位的数据节点（dataPath 之下）为根；
 * 未命中时回退到响应体根节点，兼容 "data.token" 这类全路径写法。
 */
export const extractVariables = (
  body: any,
  extractions: VariableExtraction[],
  parsing?: ResponseParsing,
): Record<string, any> => {
  const result: Record<string, any> = {};
  const parsed = parseResponse(body, parsing);
  for (const ext of extractions) {
    if (!ext.targetVar) continue;
    let raw = ext.sourceVar ? getByPath(parsed.data, ext.sourceVar) : parsed.data;
    if (raw === undefined) raw = getByPath(parsed.root, ext.sourceVar);
    result[ext.targetVar] = convertType(raw, ext.typeConvert);
  }
  return result;
};

/**
 * 提取值类型转换：string/number/boolean/array。
 * 未指定或无法识别时原样返回，undefined/null 保持不动。
 */
const convertType = (val: any, type?: string): any => {
  if (!type || val === undefined || val === null) return val;
  switch (type) {
    case "string":
      return stringify(val);
    case "number": {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    case "boolean":
      return val === true || val === "true" || val === 1 || val === "1";
    case "array": {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const p = JSON.parse(val);
          return Array.isArray(p) ? p : [p];
        } catch {
          return [val];
        }
      }
      return [val];
    }
    default:
      return val;
  }
};

/** 任意值转字符串（用于插值） */
const stringify = (v: any): string => {
  if (v === undefined || v === null) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

/**
 * 模板插值：将 {{var}} / {{a.b.c}} 替换为 variables 中的对应值。
 * 支持点号路径；缺失值替换为空串。
 */
export const interpolate = (
  template: string,
  variables: Record<string, any>,
): string => {
  if (template == null) return "";
  return String(template).replace(
    /\{\{\s*([\w.-]+)\s*\}\}/g,
    (_match, key: string) => {
      const v = key.includes(".") ? getByPath(variables, key) : variables[key];
      return stringify(v);
    },
  );
};

/** 转义用于构造正则的字符串 */
const escapeForRegExp = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 按名称或点号路径从运行时变量取值 */
const readVar = (variables: Record<string, any>, key: string): any =>
  key.includes(".") ? getByPath(variables, key) : variables[key];

/** 解析参数取值：dynamic 绑定变量 → 同名运行时变量 → 插值后的默认值 */
const resolveParamValue = (
  p: ApiEndpointParam,
  variables: Record<string, any>,
): string => {
  if (p.valueType === "dynamic" && p.sourceVar) {
    const bound = readVar(variables, p.sourceVar);
    if (bound !== undefined && bound !== null && bound !== "") {
      return stringify(bound);
    }
    return interpolate(p.defaultValue ?? "", variables);
  }
  const direct = variables[p.name];
  if (direct !== undefined && direct !== null && direct !== "") {
    return stringify(direct);
  }
  return interpolate(p.defaultValue ?? "", variables);
};

/** 解析键值对取值：dynamic 绑定变量，否则插值字面值 */
const resolveKvValue = (
  kv: ApiKeyValue,
  variables: Record<string, any>,
): string => {
  if (kv.valueType === "dynamic" && kv.sourceVar) {
    const bound = readVar(variables, kv.sourceVar);
    if (bound !== undefined && bound !== null && bound !== "") {
      return stringify(bound);
    }
  }
  return interpolate(kv.value ?? "", variables);
};

/** 若表单无键值对但请求体是 JSON，则尝试解析成键值对 */
const parseBodyPairs = (body: string): ApiKeyValue[] => {
  if (!body || !body.trim()) return [];
  try {
    const obj = JSON.parse(body);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return Object.entries(obj).map(([name, value]) => ({
        id: genId("bp"),
        name,
        value: stringify(value),
        enabled: true,
      }));
    }
  } catch {
    /* 非 JSON，忽略 */
  }
  return [];
};

/** 表单格式对应默认 Content-Type */
const FORMAT_CONTENT_TYPE: Record<RequestFormat, string> = {
  none: "",
  json: "application/json",
  raw: "text/plain",
  "form-data": "multipart/form-data",
  "x-www-form-urlencoded": "application/x-www-form-urlencoded",
};

/** 按格式序列化请求体 */
const serializeBody = (
  endpoint: ApiEndpoint,
  variables: Record<string, any>,
): { body: string; boundary?: string } => {
  const format = endpoint.requestFormat ?? "json";
  switch (format) {
    case "none":
      return { body: "" };
    case "json":
    case "raw":
      return { body: interpolate(endpoint.body ?? "", variables) };
    case "x-www-form-urlencoded": {
      const pairs = collectFormPairs(endpoint, variables);
      const body = pairs
        .map(
          (kv) =>
            `${encodeURIComponent(kv.name)}=${encodeURIComponent(kv.value)}`,
        )
        .join("&");
      return { body };
    }
    case "form-data": {
      const pairs = collectFormPairs(endpoint, variables);
      const boundary = `----ShMockBoundary${Date.now().toString(16)}`;
      const lines = pairs.map(
        (kv) =>
          `--${boundary}\r\nContent-Disposition: form-data; name="${kv.name}"\r\n\r\n${kv.value}`,
      );
      const body =
        lines.join("\r\n") + (lines.length ? `\r\n--${boundary}--\r\n` : "");
      return { body, boundary };
    }
    default:
      return { body: interpolate(endpoint.body ?? "", variables) };
  }
};

/** 收集并解析表单键值对（过滤未启用/空名，dynamic 绑定变量否则插值字面值） */
const collectFormPairs = (
  endpoint: ApiEndpoint,
  variables: Record<string, any>,
): ApiKeyValue[] => {
  const source =
    endpoint.bodyParams && endpoint.bodyParams.length
      ? endpoint.bodyParams
      : parseBodyPairs(endpoint.body ?? "");
  return source
    .filter((kv) => kv.enabled !== false && kv.name)
    .map((kv) => ({
      ...kv,
      value: resolveKvValue(kv, variables),
    }));
};

/** 组装后的请求 */
export interface AssembledRequest {
  method: ApiEndpoint["method"];
  /** 基础地址（已替换 path 参数，不含 query） */
  url: string;
  /** 最终地址（含 query 字符串） */
  fullUrl: string;
  headers: Record<string, string>;
  body: string;
  query: ApiKeyValue[];
  format: RequestFormat;
}

/**
 * 组装一次真实请求：合并全局参数与接口参数，完成 path/query/header/body
 * 的 {{变量}} 插值与请求体格式序列化。返回结构用于展示与模拟发送。
 */
export const buildRequest = (
  endpoint: ApiEndpoint,
  globalConfig: GlobalConfig | undefined,
  variables: Record<string, any>,
): AssembledRequest => {
  const g = globalConfig ?? { headers: {}, query: {}, variables: {} };
  const params = endpoint.params ?? [];

  // 1) path 参数替换 {name} 与 {{name}}
  let url = endpoint.url ?? "";
  for (const p of params) {
    if (p.location !== "path" || p.enabled === false || !p.name) continue;
    const enc = encodeURIComponent(resolveParamValue(p, variables));
    const esc = escapeForRegExp(p.name);
    url = url
      .replace(new RegExp(`\\{\\{\\s*${esc}\\s*\\}\\}`, "g"), enc)
      .replace(new RegExp(`\\{\\s*${esc}\\s*\\}`, "g"), enc);
  }
  // 其余 {{var}}（如运行时变量直接写在 url 上）
  url = interpolate(url, variables);

  // 2) query 参数：全局 → 接口（接口同名覆盖）
  const queryPairs: ApiKeyValue[] = [];
  for (const [name, val] of Object.entries(g.query ?? {})) {
    if (!name) continue;
    queryPairs.push({ id: genId("q"), name, value: interpolate(val, variables), enabled: true });
  }
  for (const p of params) {
    if (p.location !== "query" || p.enabled === false || !p.name) continue;
    const value = resolveParamValue(p, variables);
    const hit = queryPairs.find((q) => q.name === p.name);
    if (hit) hit.value = value;
    else queryPairs.push({ id: genId("q"), name: p.name, value, enabled: true });
  }
  const qs = queryPairs
    .filter((q) => q.name)
    .map((q) => `${encodeURIComponent(q.name)}=${encodeURIComponent(q.value)}`)
    .join("&");
  let fullUrl = url;
  if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;

  // 3) 请求头合并：全局 → 接口 headers → header 参数
  const headers: Record<string, string> = {};
  const setHeader = (name: string, value: string) => {
    if (!name) return;
    const hit = Object.keys(headers).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    );
    if (hit) delete headers[hit];
    headers[name] = interpolate(value, variables);
  };
  for (const [name, val] of Object.entries(g.headers ?? {})) setHeader(name, val);
  for (const [name, val] of Object.entries(endpoint.headers ?? {}))
    setHeader(name, val);
  for (const p of params) {
    if (p.location !== "header" || p.enabled === false || !p.name) continue;
    setHeader(p.name, resolveParamValue(p, variables));
  }

  // 4) 请求体序列化
  const format: RequestFormat = endpoint.requestFormat ?? "json";
  const { body, boundary } = serializeBody(endpoint, variables);

  // Content-Type 依据格式补全（未显式设置时）
  const hasCT = Object.keys(headers).some(
    (k) => k.toLowerCase() === "content-type",
  );
  const ct = FORMAT_CONTENT_TYPE[format];
  if (format !== "none" && ct && !hasCT) {
    headers["Content-Type"] =
      format === "form-data" && boundary
        ? `multipart/form-data; boundary=${boundary}`
        : ct;
  } else if (format === "form-data" && boundary) {
    // 已有自定义 Content-Type 时补 boundary
    for (const k of Object.keys(headers)) {
      if (k.toLowerCase() === "content-type" && !headers[k].includes("boundary")) {
        headers[k] = `${headers[k]}; boundary=${boundary}`;
      }
    }
  }

  return {
    method: endpoint.method,
    url,
    fullUrl,
    headers,
    body,
    query: queryPairs,
    format,
  };
};

/** 生成简单的 mock JSON 响应体 */
export const generateMockBody = (fields: Record<string, any>): string => {
  return JSON.stringify(
    {
      code: 0,
      message: "success",
      data: fields,
    },
    null,
    2,
  );
};

/** 模拟单次 HTTP 请求：先组装真实请求，再返回关联 mock 响应 */
export const simulateRequest = async (
  endpoint: ApiEndpoint,
  mock: MockResponse,
  variables: Record<string, any>,
  globalConfig?: GlobalConfig,
): Promise<{
  status: number;
  statusText: string;
  body: string;
  duration: number;
  headers: Record<string, string>;
  request: AssembledRequest;
}> => {
  const request = buildRequest(endpoint, globalConfig, variables);
  const start = performance.now();
  const delay = Math.max(0, mock.delay | 0);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  const duration = Math.round(performance.now() - start);
  return {
    status: mock.status,
    statusText: mock.statusText,
    body: mock.body,
    duration,
    headers: { ...mock.headers },
    request,
  };
};
/**
 * 真实 HTTP 请求：用 axios 实例发送 buildRequest 组装的请求。
 * 供编排器 real 模式调用真实接口；mock 模式仍用 simulateRequest。
 */
export const realRequest = async (
  endpoint: ApiEndpoint,
  variables: Record<string, any>,
  globalConfig?: GlobalConfig,
): Promise<{
  status: number;
  statusText: string;
  body: string;
  duration: number;
  headers: Record<string, string>;
  request: AssembledRequest;
}> => {
  const request = buildRequest(endpoint, globalConfig, variables);
  const start = performance.now();
  const axios = getAxiosInstance();
  const method = (request.method || "GET").toLowerCase();
  const hasBody = request.body && request.body.length > 0;
  const res: any = await axios.request({
    url: request.fullUrl,
    method,
    headers: request.headers,
    data: hasBody ? request.body : undefined,
    // 让 axios 原样返回字符串/对象，便于后续 parseResponse
    transformResponse: [(d: any) => d],
  });
  const duration = Math.round(performance.now() - start);
  const resHeaders: Record<string, string> = {};
  if (res?.headers) {
    for (const [k, v] of Object.entries(res.headers as Record<string, unknown>)) {
      resHeaders[k] = v == null ? "" : String(v);
    }
  }
  let body: string;
  const raw = res?.data;
  if (raw == null) {
    body = "";
  } else if (typeof raw === "string") {
    body = raw;
  } else if (typeof raw === "object") {
    body = JSON.stringify(raw);
  } else {
    body = String(raw);
  }
  return {
    status: res?.status ?? 0,
    statusText: res?.statusText ?? "",
    body,
    duration,
    headers: resHeaders,
    request,
  };
};
