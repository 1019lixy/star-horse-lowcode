/**
 * 公共 API 接口配置组件 —— 与编排器的双向转换桥
 *
 * 目标：让 <star-horse-api-config>（共享 schema/模型）与编排器内部
 * `ApiEndpoint` / `GlobalConfig` / `VariableExtraction` 之间互相转换，
 * 而**不重构**编排器的 buildRequest / runChain 管线。
 *
 * 映射约定：
 * - dataType(FORM/JSON/BINARY) ↔ requestFormat(x-www-form-urlencoded/json/raw)
 *   form-data 是编排器扩展位，桥接层不主动生成；调用方可手动切换。
 * - valueType=dynamic + paramValueField ↔ 编排器的 valueType=dynamic + sourceVar；
 *   同时把 paramValue 里的 `${field}` 与编排器里的 `{{field}}` 互转。
 * - requestParams：GET/HEAD/OPTIONS → 编排器 params(location=query)；
 *   其他方法 FORM → bodyParams；其他方法 JSON/raw → body 字符串。三者互斥。
 * - headers：数组 ↔ Record<string,string>（v1 不再合成 Authorization，参考模型未含 authType）。
 * - fieldMappings ↔ variableExtractions(sourceVar/targetVar/typeConvert)。
 * - responseTemplate/successCode/codePath/dataPath ↔ 编排器
 *   ApiEndpoint.responseParsing：执行管线按 codePath 校验业务码、
 *   按 dataPath 定位数据节点，变量提取以该节点为根。
 *
 * 说明：
 * - proxy/proxyUrl/conditionFields/pageSize/responseMode/apiType/serviceName/
 *   interfaceName/method/redirect/matchType/isolationType 是参考里给代理后端
 *   消费的元数据，编排器执行管线不使用，故 toEndpointModel 不搬进 ApiEndpoint；
 *   反向 fromEndpointModel 填一组保守默认，让表单能直接渲染。
 */
import type {
  ApiEndpoint,
  ApiEndpointParam,
  ApiKeyValue,
  HttpMethod,
  RequestFormat,
  VariableExtraction,
} from "@/components/apiorchestrator/types";
import type {
  ApiConfigFieldMapping,
  ApiConfigModel,
  ApiConfigHeaderRow,
  ApiConfigParamRow,
} from "./types";

const genId = (p: string) =>
  `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

/** "${field}" 或 "{{field}}" 抽出 field */
const FIELD_TOKEN = /^\s*(?:\$\{(\w+)\}|\{\{\s*([\w.-]+)\s*\}\})\s*$/;
const parseField = (v: string): string | null => {
  const m = (v ?? "").match(FIELD_TOKEN);
  if (!m) return null;
  return m[1] ?? m[2] ?? null;
};

/** dataType ↔ requestFormat */
const dataTypeToFormat = (dt: string): RequestFormat => {
  switch ((dt || "").toUpperCase()) {
    case "FORM":
      return "x-www-form-urlencoded";
    case "BINARY":
      return "raw";
    case "JSON":
    default:
      return "json";
  }
};
const formatToDataType = (fmt: RequestFormat): string => {
  switch (fmt) {
    case "x-www-form-urlencoded":
    case "form-data":
      return "FORM";
    case "raw":
      return "BINARY";
    case "none":
    case "json":
    default:
      return "JSON";
  }
};

/** 共享 paramValue (可能是 ${field}) → 编排器 defaultValue (可能是 {{field}}) */
const toOrchestratorValue = (row: ApiConfigParamRow): string => {
  if (row.valueType === "dynamic" && row.paramValueField)
    return `{{${row.paramValueField}}}`;
  const f = parseField(row.paramValue ?? "");
  if (f) return `{{${f}}}`;
  return row.paramValue ?? "";
};
/** 编排器 defaultValue (可能是 {{field}}) → 共享 paramValue/paramValueField/valueType */
const fromOrchestratorValue = (
  v: string,
): Pick<ApiConfigParamRow, "paramValue" | "paramValueField" | "valueType"> => {
  const f = parseField(v ?? "");
  if (f)
    return {
      paramValue: "${" + f + "}",
      paramValueField: f,
      valueType: "dynamic",
    };
  return { paramValue: v ?? "", valueType: "static" };
};

/** 从 JSON 请求参数行生成 body 字符串 */
const buildJsonBody = (rows: ApiConfigParamRow[]): string => {
  if (!rows.length) return "";
  const obj: Record<string, unknown> = {};
  for (const r of rows) {
    if (!r.paramName) continue;
    obj[r.paramName] = toOrchestratorValue(r);
  }
  return JSON.stringify(obj, null, 2);
};

/** 编排器 endpoint 反向构造 JSON 请求参数行 */
const parseJsonBodyToRows = (body: string): ApiConfigParamRow[] => {
  if (!body || !body.trim()) return [];
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return [];
    return Object.entries(parsed).map(([k, v]) => {
      const str = typeof v === "string" ? v : JSON.stringify(v);
      return { paramName: k, ...fromOrchestratorValue(str) };
    });
  } catch {
    return [];
  }
};

/** 桥接所需的元信息（ApiEndpoint 的 id/name 不在共享模型里） */
export interface BridgeMeta {
  id: string;
  name: string;
  description?: string;
}

/** 无 body 的 HTTP 方法（此时 requestParams 应作为 query 传入编排器） */
const BODYLESS_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** 共享 ApiConfigModel → 编排器 ApiEndpoint */
export function toEndpointModel(
  m: ApiConfigModel,
  meta: BridgeMeta,
): ApiEndpoint {
  const format = dataTypeToFormat(m.dataType);
  const isForm = format === "x-www-form-urlencoded" || format === "form-data";
  const method = ((m.httpMethod || "GET").toUpperCase() ??
    "GET") as HttpMethod;
  const isBodyless = BODYLESS_METHODS.has(method);
  const headers: Record<string, string> = {};
  for (const h of m.headers ?? []) {
    if (!h.paramName) continue;
    const dyn = h.valueType === "dynamic";
    const field = parseField(h.paramValue ?? "");
    headers[h.paramName] =
      dyn && field
        ? `{{${field}}}`
        : dyn && h.paramValue
          ? `{{${h.paramValue}}}`
          : h.paramValue ?? "";
  }

  const rows = (m.requestParams ?? []).filter((r) => r.paramName);
  const asQuery = isBodyless;
  const params: ApiEndpointParam[] = asQuery
    ? rows.map((r) => ({
        name: r.paramName,
        location: "query",
        required: false,
        defaultValue: toOrchestratorValue(r),
        description: "",
        enabled: true,
        valueType: r.valueType === "dynamic" ? "dynamic" : "static",
        sourceVar:
          r.valueType === "dynamic" ? (r.paramValueField ?? "") : undefined,
      }))
    : [];
  const bodyParams: ApiKeyValue[] =
    !asQuery && isForm
      ? rows.map((r) => ({
          id: genId("kv"),
          name: r.paramName,
          value: toOrchestratorValue(r),
          enabled: true,
          valueType: r.valueType === "dynamic" ? "dynamic" : "static",
          sourceVar:
            r.valueType === "dynamic" ? (r.paramValueField ?? "") : undefined,
        }))
      : [];
  const body = isBodyless
    ? ""
    : format === "json"
      ? buildJsonBody(rows)
      : format === "raw"
        ? (rows[0]?.paramValue ?? "")
        : "";

  return {
    id: meta.id,
    name: m.name ?? meta.name,
    method,
    url: m.url ?? "",
    headers,
    params,
    requestFormat: isBodyless ? "none" : format,
    body,
    bodyParams,
    description: m.description ?? meta.description ?? "",
    // 返回值解析：供编排器执行管线做业务码校验与 dataPath 定位
    responseParsing: {
      responseTemplate: m.responseTemplate ?? "result_data_list",
      successCode: m.successCode ?? "",
      codePath: m.codePath ?? "code",
      dataPath: m.dataPath ?? "data",
    },
  };
}

/** 编排器 ApiEndpoint → 共享 ApiConfigModel */
export function fromEndpointModel(ep: ApiEndpoint): ApiConfigModel {
  const format = ep.requestFormat ?? "json";
  const dataType = formatToDataType(format);
  const headers: ApiConfigHeaderRow[] = Object.entries(ep.headers ?? {}).map(
    ([name, value]) => {
      const f = parseField(value ?? "");
      return {
        paramName: name,
        paramValue: f ? "${" + f + "}" : (value ?? ""),
        valueType: f ? "dynamic" : "static",
      };
    },
  );

  const requestParams: ApiConfigParamRow[] = [];
  const isForm = format === "x-www-form-urlencoded" || format === "form-data";
  const isNone = format === "none";
  const pushUnique = (
    bag: ApiConfigParamRow[],
    seen: Set<string>,
    row: ApiConfigParamRow,
  ) => {
    if (!row.paramName || seen.has(row.paramName)) return;
    bag.push(row);
    seen.add(row.paramName);
  };
  const seen = new Set<string>();
  if (isForm) {
    for (const kv of ep.bodyParams ?? []) {
      pushUnique(requestParams, seen, {
        paramName: kv.name,
        ...fromOrchestratorValue(kv.value ?? ""),
      });
    }
  } else if (format === "json") {
    const fromKv = (ep.bodyParams ?? []).map((kv) => ({
      paramName: kv.name,
      ...fromOrchestratorValue(kv.value ?? ""),
    }));
    const fromBody = parseJsonBodyToRows(ep.body ?? "");
    for (const r of [...fromKv, ...fromBody]) pushUnique(requestParams, seen, r);
  } else if (!isNone) {
    if (ep.body) {
      pushUnique(requestParams, seen, {
        paramName: "_raw",
        ...fromOrchestratorValue(ep.body),
      });
    }
  }
  for (const p of ep.params ?? []) {
    if (!p.name || p.location === "header") continue;
    pushUnique(requestParams, seen, {
      paramName: p.name,
      ...fromOrchestratorValue(
        p.valueType === "dynamic" && p.sourceVar
          ? `{{${p.sourceVar}}}`
          : (p.defaultValue ?? ""),
      ),
    });
  }

  return {
    // 顶层：编排器无代理概念，默认关闭 proxy（thirdApi 直连）
    proxy: false,
    proxyUrl: "",
    conditionFields: [],
    pageSize: 0,
    responseMode: "options",
    // 请求配置
    apiType: "thirdApi",
    serviceName: "",
    interfaceName: "",
    method: "",
    redirect: true,
    name: ep.name ?? "",
    description: ep.description ?? "",
    httpMethod: ep.method ?? "GET",
    protocol: /^https:\/\//i.test(ep.url ?? "") ? "https" : "http",
    url: ep.url ?? "",
    dataType,
    headers,
    requestParams,
    // 返回值解析（编排器执行管线按此校验业务码并定位数据节点）
    responseTemplate: ep.responseParsing?.responseTemplate ?? "result_data_list",
    codePath: ep.responseParsing?.codePath ?? "code",
    dataPath: ep.responseParsing?.dataPath ?? "data",
    successCode: ep.responseParsing?.successCode ?? "",
    // 响应/映射
    fieldMappings: [],
    isolationDetails: [],
  };
}

/** 共享字段映射 → 编排器变量提取 */
export function toExtractions(
  mappings: ApiConfigFieldMapping[] | undefined,
): VariableExtraction[] {
  return (mappings ?? [])
    .filter((m) => m.sourceField && m.distField)
    .map((m) => ({
      sourceVar: m.sourceField,
      targetVar: m.distField,
      typeConvert: m.typeConvert ?? "",
    }));
}

/** 编排器变量提取 → 共享字段映射 */
export function fromExtractions(
  extractions: VariableExtraction[] | undefined,
): ApiConfigFieldMapping[] {
  return (extractions ?? []).map((e) => ({
    sourceField: e.sourceVar,
    distField: e.targetVar,
    typeConvert: e.typeConvert ?? "",
  }));
}
