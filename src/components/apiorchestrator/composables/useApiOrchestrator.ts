/**
 * API 编排器状态管理
 */
import { reactive, ref } from "vue";
import {
  createChain,
  createChainInput,
  createChainStep,
  createEndpoint,
  createMockResponse,
  SAMPLE_CHAIN,
  SAMPLE_ENDPOINTS,
  SAMPLE_MOCKS,
} from "../constants";
import {
  buildRequest,
  extractVariables,
  matchMock,
  parseResponse,
  simulateRequest,
  realRequest,
} from "./useMockServer";
import type { AssembledRequest } from "./useMockServer";
import type {
  ApiChain,
  ApiChainStep,
  ApiEndpoint,
  ApiEndpointParam,
  ApiKeyValue,
  ApiTestRequest,
  ApiTestResult,
  ChainInput,
  HttpMethod,
  MockResponse,
  RequestFormat,
} from "../types";
import type { ApiSourceConfigModel } from "@/components/system/ApiSourceConfig/types";

/** ${field} → {{field}}（配置层用 ${}，执行层用 {{}}） */
const toToken = (v: string): string => (v ?? "").replace(/\$\{(\w+)\}/g, "{{$1}}");

/** dataType → requestFormat */
const dataTypeToFormat = (dt: string): RequestFormat => {
  switch ((dt || "").toUpperCase()) {
    case "FORM":
      return "x-www-form-urlencoded";
    case "BINARY":
      return "raw";
    default:
      return "json";
  }
};

const genExecId = (p: string) =>
  `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

/**
 * 把配置层 ApiSourceConfigModel 转成执行层 ApiEndpoint（useMockServer 消费）。
 * 转换只在执行管线内部发生，编辑层不感知。
 * 配置层结构与表单一致（ApiLinkageDetail）：url/httpMethod 等在 apiInfo 嵌套段。
 */
const toExecutable = (m: ApiSourceConfigModel): ApiEndpoint => {
  const info = m.apiInfo ?? ({} as ApiSourceConfigModel["apiInfo"]);
  const method = ((info.httpMethod || "GET").toUpperCase()) as HttpMethod;
  const isBodyless = ["GET", "HEAD", "OPTIONS"].includes(method);
  const format = dataTypeToFormat(info.dataType);
  const isForm = format === "x-www-form-urlencoded" || format === "form-data";
  const headers: Record<string, string> = {};
  for (const h of m.headers ?? []) {
    if (!h.paramName) continue;
    headers[h.paramName] = toToken(h.paramValue ?? "");
  }
  const rows = (m.requestParams ?? []).filter((r) => r.paramName);
  const params: ApiEndpointParam[] = isBodyless
    ? rows.map((r) => ({
        name: r.paramName,
        location: "query" as const,
        required: false,
        defaultValue: toToken(r.paramValue ?? ""),
        description: "",
        enabled: true,
        valueType: r.valueType === "dynamic" ? "dynamic" : "static",
        sourceVar: r.valueType === "dynamic" ? r.paramValueField ?? "" : undefined,
      }))
    : [];
  const bodyParams: ApiKeyValue[] =
    !isBodyless && isForm
      ? rows.map((r) => ({
          id: genExecId("kv"),
          name: r.paramName,
          value: toToken(r.paramValue ?? ""),
          enabled: true,
          valueType: r.valueType === "dynamic" ? "dynamic" : "static",
          sourceVar: r.valueType === "dynamic" ? r.paramValueField ?? "" : undefined,
        }))
      : [];
  let body = "";
  if (!isBodyless && format === "json") {
    const obj: Record<string, unknown> = {};
    for (const r of rows) if (r.paramName) obj[r.paramName] = toToken(r.paramValue ?? "");
    body = JSON.stringify(obj, null, 2);
  } else if (!isBodyless && format === "raw") {
    body = toToken(rows[0]?.paramValue ?? "");
  }
  return {
    id: m.id ?? "",
    name: m.name ?? "",
    method,
    url: toToken(info.url ?? ""),
    headers,
    params,
    requestFormat: isBodyless ? "none" : format,
    body,
    bodyParams,
    description: m.description ?? "",
    responseParsing: {
      responseTemplate: info.responseTemplate ?? "result_data_list",
      successCode: info.successCode ?? "",
      codePath: info.codePath ?? "code",
      dataPath: info.dataPath ?? "data",
    },
  };
};

/** 将入口参数字符串默认值按其 type 转成运行时值 */
const castChainInputValue = (input: ChainInput): any => {
  const raw = input.defaultValue ?? "";
  if (raw === "") return "";
  switch (input.type) {
    case "number": {
      const n = Number(raw);
      return Number.isNaN(n) ? raw : n;
    }
    case "boolean":
      return raw === "true" || raw === "1";
    case "object":
    case "array":
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    case "string":
    default:
      return raw;
  }
};

export const useApiOrchestrator = (
  initialEndpoints?: ApiSourceConfigModel[],
  initialMocks?: MockResponse[],
  initialChain?: Partial<ApiChain>,
) => {
  const endpoints = reactive<ApiSourceConfigModel[]>(
    initialEndpoints ? JSON.parse(JSON.stringify(initialEndpoints)) : [],
  );
  const mocks = reactive<MockResponse[]>(
    initialMocks ? JSON.parse(JSON.stringify(initialMocks)) : [],
  );
  const chain = reactive<ApiChain>(createChain(initialChain ?? {}));
  const selectedEndpointId = ref<string | null>(null);
  const selectedStepId = ref<string | null>(null);
  const testResults = ref<ApiTestResult[]>([]);
  const isRunning = ref(false);
  /** 是否已请求停止 */
  const stopRequested = ref(false);

  /** 当前选中的接口 */
  const selectedEndpoint = ref<ApiSourceConfigModel | null>(null);
  /** 当前选中的步骤 */
  const selectedStep = ref<ApiChainStep | null>(null);

  const selectEndpoint = (id: string | null) => {
    selectedEndpointId.value = id;
    selectedEndpoint.value = id
      ? (endpoints.find((e) => e.id === id) ?? null)
      : null;
  };

  const selectStep = (id: string | null) => {
    selectedStepId.value = id;
    selectedStep.value = id
      ? (chain.steps.find((s) => s.id === id) ?? null)
      : null;
  };

  const addEndpoint = (): ApiSourceConfigModel => {
    const ep = createEndpoint();
    endpoints.push(ep);
    // 同步创建一份默认 mock
    const mock = createMockResponse(ep.id!);
    mocks.push(mock);
    selectEndpoint(ep.id!);
    return ep;
  };

  const updateEndpoint = (id: string, updates: Partial<ApiSourceConfigModel>) => {
    const ep = endpoints.find((e) => e.id === id);
    if (!ep) return;
    Object.assign(ep, updates);
  };

  const removeEndpoint = (id: string) => {
    const idx = endpoints.findIndex((e) => e.id === id);
    if (idx < 0) return;
    endpoints.splice(idx, 1);
    // 同步删除关联 mock
    for (let i = mocks.length - 1; i >= 0; i--) {
      if (mocks[i].endpointId === id) mocks.splice(i, 1);
    }
    // 同步删除引用该接口的步骤
    for (let i = chain.steps.length - 1; i >= 0; i--) {
      if (chain.steps[i].endpointId === id) chain.steps.splice(i, 1);
    }
    if (selectedEndpointId.value === id) selectEndpoint(null);
  };

  const addMock = (endpointId: string): MockResponse => {
    const mock = createMockResponse(endpointId);
    // 同一接口新 mock 默认启用，旧的置为不启用，保证唯一
    for (const m of mocks) {
      if (m.endpointId === endpointId) m.isActive = false;
    }
    mocks.push(mock);
    return mock;
  };

  const updateMock = (id: string, updates: Partial<MockResponse>) => {
    const m = mocks.find((mm) => mm.id === id);
    if (!m) return;
    Object.assign(m, updates);
  };

  const removeMock = (id: string) => {
    const idx = mocks.findIndex((m) => m.id === id);
    if (idx < 0) return;
    mocks.splice(idx, 1);
  };

  const addChainStep = (endpointId: string): ApiChainStep | null => {
    const ep = endpoints.find((e) => e.id === endpointId);
    if (!ep) return null;
    const step = createChainStep(endpointId, {
      stepName: `${chain.steps.length + 1}. ${ep.name}`,
    });
    chain.steps.push(step);
    return step;
  };

  const updateChainStep = (id: string, updates: Partial<ApiChainStep>) => {
    const s = chain.steps.find((ss) => ss.id === id);
    if (!s) return;
    Object.assign(s, updates);
  };

  const removeChainStep = (id: string) => {
    const idx = chain.steps.findIndex((s) => s.id === id);
    if (idx < 0) return;
    chain.steps.splice(idx, 1);
    if (selectedStepId.value === id) selectStep(null);
  };

  /** 移动步骤：dir=-1 上移，dir=1 下移 */
  const moveStep = (id: string, dir: -1 | 1) => {
    const idx = chain.steps.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= chain.steps.length) return;
    const arr = chain.steps;
    const tmp = arr[idx];
    arr[idx] = arr[target];
    arr[target] = tmp;
  };

  /** 在指定步骤前插入新步骤 */
  const insertStepBefore = (
    refStepId: string,
    endpointId: string,
  ): ApiChainStep | null => {
    const ep = endpoints.find((e) => e.id === endpointId);
    if (!ep) return null;
    const idx = chain.steps.findIndex((s) => s.id === refStepId);
    if (idx < 0) return null;
    const step = createChainStep(endpointId, {
      stepName: `${idx + 1}. ${ep.name}`,
    });
    chain.steps.splice(idx, 0, step);
    // 重新编号
    renumberSteps();
    return step;
  };

  /** 在指定步骤后插入新步骤 */
  const insertStepAfter = (
    refStepId: string,
    endpointId: string,
  ): ApiChainStep | null => {
    const ep = endpoints.find((e) => e.id === endpointId);
    if (!ep) return null;
    const idx = chain.steps.findIndex((s) => s.id === refStepId);
    if (idx < 0) return null;
    const step = createChainStep(endpointId, {
      stepName: `${idx + 2}. ${ep.name}`,
    });
    chain.steps.splice(idx + 1, 0, step);
    renumberSteps();
    return step;
  };

  /** 重新编号步骤名（基于位置） */
  const renumberSteps = () => {
    chain.steps.forEach((s, i) => {
      const ep = endpoints.find((e) => e.id === s.endpointId);
      const epName = ep ? ep.name : s.stepName;
      // 保留用户自定义名称，只在没有自定义时自动编号
      s.stepName = `${i + 1}. ${epName}`;
    });
  };

  /** 新增编排入口参数 */
  const addChainInput = (
    overrides: Partial<ChainInput> = {},
  ): ChainInput => {
    const input = createChainInput(overrides);
    chain.inputs.push(input);
    return input;
  };

  /** 更新编排入口参数 */
  const updateChainInput = (id: string, updates: Partial<ChainInput>) => {
    const input = chain.inputs.find((i) => i.id === id);
    if (!input) return;
    Object.assign(input, updates);
  };

  /** 删除编排入口参数 */
  const removeChainInput = (id: string) => {
    const idx = chain.inputs.findIndex((i) => i.id === id);
    if (idx < 0) return;
    chain.inputs.splice(idx, 1);
  };

  const clearResults = () => {
    testResults.value.splice(0, testResults.value.length);
  };

  /** 简易条件求值：空串视为 true，否则支持 "var === value" 等简单表达式 */
  const evalCondition = (
    condition: string,
    variables: Record<string, any>,
  ): boolean => {
    if (!condition || !condition.trim()) return true;
    try {
      // 使用 Function 作用域注入变量，仅用于前端演示场景
      const keys = Object.keys(variables);
      const vals = keys.map((k) => variables[k]);

      const fn = new Function(...keys, `"use strict"; return (${condition});`);
      return !!fn(...vals);
    } catch {
      // 表达式异常则跳过该步骤
      return false;
    }
  };

  /** 组装请求 → 测试快照 */
  const toTestRequest = (req: AssembledRequest): ApiTestRequest => ({
    method: req.method,
    url: req.fullUrl,
    headers: req.headers,
    body: req.body,
    fullUrl: req.fullUrl,
    format: req.format,
    query: req.query,
  });

  /**
   * 执行编排链。
   * @param options.mode 执行模式："mock"（默认，用 Mock 响应）/ "real"（发真实 HTTP 请求）
   * @param options.inputs 外部传入参数，覆盖入口参数默认值后注入运行时变量，
   *   实现「任务编排好后可配置参数传给编排接口」。传入的参数在编排内全局可见，
   *   供所有接口的 {{变量}} 插值、dynamic 绑定、条件求值消费。
   */
  const runChain = async (
    options?: { mode?: "mock" | "real"; inputs?: Record<string, any> },
  ): Promise<boolean> => {
    if (isRunning.value) return false;
    if (chain.steps.length === 0) return false;
    const runMode = options?.mode ?? "mock";
    const externalInputs = options?.inputs ?? {};
    isRunning.value = true;
    stopRequested.value = false;
    clearResults();

    // 运行时变量：入口参数为基线，外部传入参数覆盖，再叠加全局变量与历史产出变量
    const inputVars: Record<string, any> = {};
    for (const inp of chain.inputs ?? []) {
      if (!inp.name) continue;
      inputVars[inp.name] = castChainInputValue(inp);
    }
    Object.assign(inputVars, externalInputs);
    const runtimeVars: Record<string, any> = {
      ...inputVars,
      ...(chain.globalConfig?.variables ?? {}),
      ...chain.variables,
    };

    let success = true;
    for (const step of chain.steps) {
      if (stopRequested.value) {
        success = false;
        break;
      }
      // 条件判断
      if (!evalCondition(step.condition, runtimeVars)) {
        continue;
      }
      const endpoint = endpoints.find((e) => e.id === step.endpointId);
      if (!endpoint) {
        testResults.value.push({
          stepId: step.id,
          stepName: step.stepName,
          request: { method: "GET", url: "", headers: {}, body: "" },
          response: { status: 0, statusText: "", body: "", duration: 0 },
          success: false,
          error: `Endpoint not found: ${step.endpointId}`,
          extractedVars: {},
        });
        success = false;
        break;
      }
      const execEndpoint = toExecutable(endpoint);
      try {
        let res: any;
        if (runMode === "real") {
          res = await realRequest(execEndpoint, runtimeVars, chain.globalConfig);
        } else {
          const mock = matchMock(endpoint.id, mocks);
          if (!mock) {
            const req = buildRequest(execEndpoint, chain.globalConfig, runtimeVars);
            testResults.value.push({
              stepId: step.id,
              stepName: step.stepName,
              request: toTestRequest(req),
              response: { status: 0, statusText: "", body: "", duration: 0 },
              success: false,
              error: "No active mock response",
              extractedVars: {},
            });
            success = false;
            break;
          }
          res = await simulateRequest(
            execEndpoint,
            mock,
            runtimeVars,
            chain.globalConfig,
          );
        }
        // 响应解析：业务码校验 + dataPath 定位数据节点
        const parsed = parseResponse(res.body, execEndpoint.responseParsing);
        // 变量提取以解析后的数据节点为根（未命中回退响应根）
        const extracted = extractVariables(
          res.body,
          step.variableExtractions,
          execEndpoint.responseParsing,
        );
        Object.assign(runtimeVars, extracted);
        // 回写到链变量，便于持久化与展示
        Object.assign(chain.variables, extracted);
        const httpOk = res.status >= 200 && res.status < 300;
        const isOk = httpOk && parsed.ok;
        const error = !httpOk
          ? `HTTP ${res.status}`
          : !parsed.ok
            ? `Business code mismatch: ${String(parsed.code)} != ${parsed.expectedCode}` +
              (parsed.message ? ` - ${parsed.message}` : "")
            : "";
        testResults.value.push({
          stepId: step.id,
          stepName: step.stepName,
          request: toTestRequest(res.request),
          response: {
            status: res.status,
            statusText: res.statusText,
            body: res.body,
            duration: res.duration,
          },
          success: isOk,
          error,
          extractedVars: extracted,
          parsedData: parsed.data,
        });
        if (!isOk) {
          success = false;
          break;
        }
      } catch (err: any) {
        const req = buildRequest(execEndpoint, chain.globalConfig, runtimeVars);
        testResults.value.push({
          stepId: step.id,
          stepName: step.stepName,
          request: toTestRequest(req),
          response: { status: 0, statusText: "", body: "", duration: 0 },
          success: false,
          error: err?.message ?? String(err),
          extractedVars: {},
        });
        success = false;
        break;
      }
    }
    isRunning.value = false;
    return success;
  };

  const stop = () => {
    stopRequested.value = true;
    isRunning.value = false;
  };

  /** 加载完整数据 */
  const loadData = (data: {
    endpoints?: ApiSourceConfigModel[];
    mocks?: MockResponse[];
    chain?: Partial<ApiChain>;
  }) => {
    endpoints.splice(
      0,
      endpoints.length,
      ...(data.endpoints ? JSON.parse(JSON.stringify(data.endpoints)) : []),
    );
    mocks.splice(
      0,
      mocks.length,
      ...(data.mocks ? JSON.parse(JSON.stringify(data.mocks)) : []),
    );
    Object.assign(chain, createChain(data.chain ?? {}));
    selectEndpoint(null);
    selectStep(null);
    clearResults();
  };

  /** 导出完整数据 */
  const getData = () => ({
    endpoints: JSON.parse(JSON.stringify(endpoints)) as ApiSourceConfigModel[],
    mocks: JSON.parse(JSON.stringify(mocks)) as MockResponse[],
    chain: JSON.parse(JSON.stringify(chain)) as ApiChain,
    testResults: JSON.parse(
      JSON.stringify(testResults.value),
    ) as ApiTestResult[],
  });

  return {
    endpoints,
    mocks,
    chain,
    selectedEndpointId,
    selectedStepId,
    selectedEndpoint,
    selectedStep,
    testResults,
    isRunning,
    addEndpoint,
    updateEndpoint,
    removeEndpoint,
    addMock,
    updateMock,
    removeMock,
    addChainStep,
    updateChainStep,
    removeChainStep,
    moveStep,
    insertStepBefore,
    insertStepAfter,
    addChainInput,
    updateChainInput,
    removeChainInput,
    selectEndpoint,
    selectStep,
    runChain,
    stop,
    clearResults,
    loadData,
    getData,
  };
};

export type ApiOrchestratorState = ReturnType<typeof useApiOrchestrator>;

/** 便捷工厂：使用示例数据初始化 */
export const createSampleOrchestrator = () =>
  useApiOrchestrator(SAMPLE_ENDPOINTS, SAMPLE_MOCKS, SAMPLE_CHAIN);
