/**
 * API 编排器状态管理
 */
import { reactive, ref } from "vue";
import {
    createChain,
    createChainStep,
    createEndpoint,
    createMockResponse,
    SAMPLE_CHAIN,
    SAMPLE_ENDPOINTS,
    SAMPLE_MOCKS,
} from "../constants";
import { extractVariables, matchMock, simulateRequest } from "./useMockServer";
import type {
    ApiChain,
    ApiChainStep,
    ApiEndpoint,
    ApiTestResult,
    MockResponse,
} from "../types";

export const useApiOrchestrator = (
    initialEndpoints?: ApiEndpoint[],
    initialMocks?: MockResponse[],
    initialChain?: Partial<ApiChain>,
) => {
    const endpoints = reactive<ApiEndpoint[]>(
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
    const selectedEndpoint = ref<ApiEndpoint | null>(null);
    /** 当前选中的步骤 */
    const selectedStep = ref<ApiChainStep | null>(null);

    const selectEndpoint = (id: string | null) => {
        selectedEndpointId.value = id;
        selectedEndpoint.value = id ? endpoints.find((e) => e.id === id) ?? null : null;
    };

    const selectStep = (id: string | null) => {
        selectedStepId.value = id;
        selectedStep.value = id ? chain.steps.find((s) => s.id === id) ?? null : null;
    };

    const addEndpoint = (): ApiEndpoint => {
        const ep = createEndpoint();
        endpoints.push(ep);
        // 同步创建一份默认 mock
        const mock = createMockResponse(ep.id);
        mocks.push(mock);
        selectEndpoint(ep.id);
        return ep;
    };

    const updateEndpoint = (id: string, updates: Partial<ApiEndpoint>) => {
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
        const step = createChainStep(endpointId, { stepName: `${chain.steps.length + 1}. ${ep.name}` });
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

    const clearResults = () => {
        testResults.value.splice(0, testResults.value.length);
    };

    /** 简易条件求值：空串视为 true，否则支持 "var === value" 等简单表达式 */
    const evalCondition = (condition: string, variables: Record<string, any>): boolean => {
        if (!condition || !condition.trim()) return true;
        try {
            // 使用 Function 作用域注入变量，仅用于前端演示场景
            const keys = Object.keys(variables);
            const vals = keys.map((k) => variables[k]);
            // eslint-disable-next-line no-new-func
            const fn = new Function(...keys, `"use strict"; return (${condition});`);
            return !!fn(...vals);
        } catch {
            // 表达式异常则跳过该步骤
            return false;
        }
    };

    /** 执行编排链 */
    const runChain = async (): Promise<boolean> => {
        if (isRunning.value) return false;
        if (chain.steps.length === 0) return false;
        isRunning.value = true;
        stopRequested.value = false;
        clearResults();

        // 初始化运行时变量
        const runtimeVars: Record<string, any> = { ...chain.variables };

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
            const mock = matchMock(endpoint.id, mocks);
            if (!mock) {
                testResults.value.push({
                    stepId: step.id,
                    stepName: step.stepName,
                    request: {
                        method: endpoint.method,
                        url: endpoint.url,
                        headers: { ...endpoint.headers },
                        body: endpoint.body,
                    },
                    response: { status: 0, statusText: "", body: "", duration: 0 },
                    success: false,
                    error: "No active mock response",
                    extractedVars: {},
                });
                success = false;
                break;
            }
            try {
                const res = await simulateRequest(endpoint, mock, runtimeVars);
                const extracted = extractVariables(res.body, step.variableExtractions);
                Object.assign(runtimeVars, extracted);
                // 回写到链变量，便于持久化与展示
                Object.assign(chain.variables, extracted);
                const isOk = res.status >= 200 && res.status < 300;
                testResults.value.push({
                    stepId: step.id,
                    stepName: step.stepName,
                    request: {
                        method: endpoint.method,
                        url: endpoint.url,
                        headers: { ...endpoint.headers },
                        body: endpoint.body,
                    },
                    response: {
                        status: res.status,
                        statusText: res.statusText,
                        body: res.body,
                        duration: res.duration,
                    },
                    success: isOk,
                    error: isOk ? "" : `HTTP ${res.status}`,
                    extractedVars: extracted,
                });
                if (!isOk) {
                    success = false;
                    break;
                }
            } catch (err: any) {
                testResults.value.push({
                    stepId: step.id,
                    stepName: step.stepName,
                    request: {
                        method: endpoint.method,
                        url: endpoint.url,
                        headers: { ...endpoint.headers },
                        body: endpoint.body,
                    },
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
        endpoints?: ApiEndpoint[];
        mocks?: MockResponse[];
        chain?: Partial<ApiChain>;
    }) => {
        endpoints.splice(0, endpoints.length, ...(data.endpoints ? JSON.parse(JSON.stringify(data.endpoints)) : []));
        mocks.splice(0, mocks.length, ...(data.mocks ? JSON.parse(JSON.stringify(data.mocks)) : []));
        Object.assign(chain, createChain(data.chain ?? {}));
        selectEndpoint(null);
        selectStep(null);
        clearResults();
    };

    /** 导出完整数据 */
    const getData = () => ({
        endpoints: JSON.parse(JSON.stringify(endpoints)) as ApiEndpoint[],
        mocks: JSON.parse(JSON.stringify(mocks)) as MockResponse[],
        chain: JSON.parse(JSON.stringify(chain)) as ApiChain,
        testResults: JSON.parse(JSON.stringify(testResults.value)) as ApiTestResult[],
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
