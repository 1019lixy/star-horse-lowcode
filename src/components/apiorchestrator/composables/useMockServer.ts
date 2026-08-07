/**
 * Mock 服务：响应匹配、模拟请求、变量提取
 * 全部使用浏览器原生 API，不依赖第三方库
 */
import type {ApiEndpoint, MockResponse, VariableExtraction} from "../types";

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
        // 数字下标
        if (/^\d+$/.test(seg)) {
            current = current[Number(seg)];
        } else {
            current = current[seg];
        }
    }
    return current;
};

/** 从响应体中按提取规则抽取变量 */
export const extractVariables = (
    body: any,
    extractions: VariableExtraction[],
): Record<string, any> => {
    const result: Record<string, any> = {};
    let parsed: any = body;
    // 若 body 是字符串，尝试解析为 JSON
    if (typeof body === "string") {
        try {
            parsed = JSON.parse(body);
        } catch {
            // 非 JSON 字符串，直接以字符串形式按 path 取值（path 为空时返回原字符串）
            parsed = body;
        }
    }
    for (const ext of extractions) {
        if (!ext.targetVar) continue;
        result[ext.targetVar] = getByPath(parsed, ext.sourceVar);
    }
    return result;
};

/** 简单变量替换：将 {{var}} 替换为 variables 中对应值 */
const interpolate = (template: string, variables: Record<string, any>): string => {
    return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) => {
        const v = variables[key];
        if (v === undefined || v === null) return "";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
    });
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

/** 模拟单次 HTTP 请求 */
export const simulateRequest = async (
    endpoint: ApiEndpoint,
    mock: MockResponse,
    variables: Record<string, any>,
): Promise<{ status: number; statusText: string; body: string; duration: number; headers: Record<string, string> }> => {
    const start = performance.now();
    // 模拟网络延迟
    const delay = Math.max(0, mock.delay | 0);
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    // 对 url / body 做变量插值
    const finalUrl = interpolate(endpoint.url, variables);
    const finalBody = endpoint.body ? interpolate(endpoint.body, variables) : "";
    // 计算耗时（含延迟）
    const duration = Math.round(performance.now() - start);
    return {
        status: mock.status,
        statusText: mock.statusText,
        body: mock.body,
        duration,
        headers: {
            ...mock.headers,
            // 记录最终请求信息，便于调试展示
            "X-Mock-Final-Url": finalUrl,
            "X-Mock-Final-Body": finalBody,
        },
    };
};
