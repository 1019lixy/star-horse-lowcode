/**
 * 规则引擎独立事件工具（前端本地执行版）
 *
 * 核心库无状态设计：
 * 1. 所有后端交互通过 configureRuleEngine 从外部注入，核心库不写死任何接口地址
 * 2. 表单加载时（ON_LOAD）通过注入的 fetchRulesHandler 拉取规则 → 缓存到内存
 * 3. 字段变更（ON_CHANGE）/ 按钮点击（ON_BUTTON_CLICK）时本地执行缓存规则，零网络开销
 * 4. http-call 节点通过注入的 httpCallHandler 发起请求，核心库不关心 HTTP 实现
 *
 * 规则与联动完全独立，各行其是。
 */

import {reactive, Ref, triggerRef, unref} from "vue";
import {RulePreps} from "@/components/types";
import {executeFlows, ExecutionStrategy, HttpCallHandler} from "./RuleFlowExecutor";

/** 触发事件类型（与 dynamicform TriggerEventType 对齐） */
export type TriggerEventType =
    | "ON_LOAD"
    | "ON_CHANGE"
    | "ON_SUBMIT"
    | "ON_VALIDATE"
    | "ON_BUTTON_CLICK";

// ==================== 外部配置 ====================

/**
 * 规则引擎配置接口
 * 由业务层通过 configureRuleEngine 注入，核心库不写死任何接口地址
 */
export interface RuleEngineConfig {
    /**
     * 规则拉取处理器：由外部业务层实现
     * 接收 formId，返回 { triggerEvent → flowContent[] }
     * 后端应将规则集、规则定义、规则集项合并为一个接口返回
     */
    fetchRulesHandler?: (formId: string) => Promise<Record<string, string[]>>;

    /**
     * HTTP 调用处理器：http-call 节点通过此函数发起 API 请求
     * 由外部业务层注入，核心库不关心具体 HTTP 实现
     */
    httpCallHandler?: HttpCallHandler;

    /**
     * 自定义执行策略：优先于内置策略匹配
     * 业务层可注入自定义策略以扩展节点执行行为，无需修改核心库
     */
    extraStrategies?: ExecutionStrategy[];
}

/** 全局配置（由外部注入） */
let ruleEngineConfig: RuleEngineConfig = {};

/**
 * 配置规则引擎（由业务层调用）
 * @param config 配置对象
 *
 * @example
 * configureRuleEngine({
 *   fetchRulesHandler: async (formId) => {
 *     const res = await postRequest(`/api/ruleEngine/fetchRules/${formId}`, {});
 *     return res?.data?.data ?? {};
 *   },
 *   httpCallHandler: async (url, method, body) => {
 *     const res = await postRequest(url, body);
 *     return res?.data?.data ?? res?.data;
 *   },
 * });
 */
export const configureRuleEngine = (config: RuleEngineConfig): void => {
    ruleEngineConfig = {...ruleEngineConfig, ...config};
};

// ==================== 规则缓存 ====================

/** formId → { triggerEvent → flowContent[] } */
const ruleCache = new Map<string, Record<string, string[]>>();

/**
 * options 覆盖存储（响应式）
 * key: `${formId}:${fieldName}` → options 数组
 * select 等组件通过 getOptionsOverride 订阅此 Map，规则引擎设置 options 时自动触发更新
 */
const optionsOverrideStore = reactive(new Map<string, any[]>());

/** 正在加载中的 formId 集合，防止重复加载 */
const loadingPromises = new Map<string, Promise<Record<string, string[]>>>();

/** 已执行过 ON_LOAD 的 formId 集合，防止每个字段都重复执行 */
const loadedFormIds = new Set<string>();

/** formId → formFields shallowRef 引用，用于设置 options 后 triggerRef 触发更新 */
const formFieldsRefs = new Map<string, any>();

/** ON_CHANGE 防抖计时器：formId → timeoutId */
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();
const DEBOUNCE_MS = 300;

// ==================== 公共工具函数 ====================

const ensureArray = (val: any): any[] => {
    if (!Array.isArray(val)) return val ? [val] : [];
    return val;
};

const CONTAINER_LIST_KEYS = ["containerFields"];

const findField = (
    props: any,
    fieldName: string,
    fieldList?: any[],
    visited?: WeakSet<any>,
): any => {
    const list =
        fieldList || (Array.isArray(props.formInfo) ? props.formInfo : []);
    if (!Array.isArray(list)) return null;
    if (!visited) visited = new WeakSet();

    for (const field of list) {
        if (Array.isArray(field)) {
            const found = findField(props, fieldName, field, visited);
            if (found) return found;
            continue;
        }
        if (field == null || typeof field !== "object") continue;
        if (visited.has(field)) continue;
        visited.add(field);

        if (field.fieldName === fieldName) {
            if (!field.preps) field.preps = {};
            return field;
        }
        if (Array.isArray(field.children)) {
            const found = findField(props, fieldName, field.children, visited);
            if (found) return found;
        }
        for (const key of CONTAINER_LIST_KEYS) {
            const containerFields = field[key];
            if (!Array.isArray(containerFields)) continue;
            for (const containerItem of containerFields) {
                if (containerItem == null || typeof containerItem !== "object")
                    continue;
                const innerList =
                    containerItem?.fieldList || containerItem?.headerFieldList;
                if (Array.isArray(innerList) && innerList.length > 0) {
                    const found = findField(props, fieldName, innerList, visited);
                    if (found) return found;
                }
            }
        }
        if (Array.isArray(field.appList)) {
            const found = findField(props, fieldName, field.appList, visited);
            if (found) return found;
        }
    }
    return null;
};

const forEachRelationField = (
    props: any,
    relationFields: string | string[],
    callback: (field: any, fieldName: string) => void,
) => {
    ensureArray(relationFields).forEach((name: string) => {
        const field = findField(props, name);
        if (field) callback(field, name);
    });
};

// ==================== 规则拉取与缓存 ====================

/**
 * 拉取规则并缓存
 * 通过外部注入的 fetchRulesHandler 获取规则，核心库不关心接口地址
 * 拉取后缓存到 ruleCache，后续 ON_CHANGE / ON_BUTTON_CLICK 直接读缓存
 */
const fetchAndCacheRules = async (
    formId: string,
): Promise<Record<string, string[]>> => {
    const cached = ruleCache.get(formId);
    if (cached) return cached;

    const loading = loadingPromises.get(formId);
    if (loading) return loading;

    const promise = (async () => {
        try {
            const handler = ruleEngineConfig.fetchRulesHandler;
            if (!handler) {
                const empty: Record<string, string[]> = {};
                ruleCache.set(formId, empty);
                return empty;
            }
            const rules = await handler(formId);
            ruleCache.set(formId, rules);
            return rules;
        } catch (err) {
            console.error("[fetchAndCacheRules] 拉取规则失败:", err);
            const empty: Record<string, string[]> = {};
            ruleCache.set(formId, empty);
            return empty;
        } finally {
            loadingPromises.delete(formId);
        }
    })();

    loadingPromises.set(formId, promise);
    return promise;
};

// ==================== 规则指令解析与应用 ====================

export const parseRuleEngineActions = (
    context: Record<string, any> = {},
): Array<{
    field: string;
    visible?: boolean;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    value?: any;
    options?: any[];
}> => {
    const actionMap = new Map<string, any>();
    const PREFIXES: Array<[string, string]> = [
        ["__visible_", "visible"],
        ["__required_", "required"],
        ["__readonly_", "readonly"],
        ["__disabled_", "disabled"],
        ["__options_", "options"],
    ];

    for (const [key, val] of Object.entries(context)) {
        let matched = false;
        for (const [prefix, prop] of PREFIXES) {
            if (key.startsWith(prefix)) {
                const fieldName = key.slice(prefix.length);
                if (!fieldName) break;
                const action = actionMap.get(fieldName) || {field: fieldName};
                action[prop] = val;
                actionMap.set(fieldName, action);
                matched = true;
                break;
            }
        }
        if (!matched && !key.startsWith("__") && val !== undefined) {
            const action = actionMap.get(key) || {field: key};
            action.value = val;
            actionMap.set(key, action);
        }
    }

    return Array.from(actionMap.values());
};

/**
 * 将规则引擎解析出的字段控制指令应用到 formFields
 *
 * 修复：SET_VALUE 只写 formData[fieldName]，不覆盖 preps.values/data/options
 * 只有 __options_ 前缀才写 preps.options
 */
export const applyRuleEngineActionsToFields = (
    props: any,
    actions: Array<{
        field: string;
        visible?: boolean;
        required?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        editDisabled?: boolean;
        value?: any;
        options?: any[];
    }>,
    formData: Ref<Record<string, any>>,
    formId?: string,
) => {
    let optionsChanged = false;
    for (const action of actions) {
        if (action.visible !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.formVisible = action.visible;
            });
        }
        if (action.required !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.required = action.required;
            });
        }
        if (action.disabled !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.preps.disabled = action.disabled;
            });
        }
        if (action.editDisabled !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.preps.editDisabled = action.editDisabled;
            });
        }
        if (action.readonly !== undefined) {
            forEachRelationField(props, action.field, (field) => {
               field.preps.readonly = action.readonly;
            });
        }
        if (action.value !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                unref(formData)[action.field] = action.value;
            });
        }
        if (action.options !== undefined) {
            optionsChanged = true;
            const overrideKey = formId ? `${formId}:${action.field}` : "";
            forEachRelationField(props, action.field, (field) => {
                if (!field.preps) field.preps = {};
                const itemType = field.itemType ?? field.type;
                if (["tselect", "transfer"].includes(itemType)) {
                    field.preps.data = action.options;
                } else if (itemType === "cascade") {
                    field.preps.options = action.options;
                } else {
                    field.preps.values = action.options;
                }
            });
            if (overrideKey) {
                optionsOverrideStore.set(overrideKey, action.options);
            }
        }
    }
    if (optionsChanged) {
        const formFieldsRef = formFieldsRefs.get(formId);
        if (formFieldsRef) {
            triggerRef(formFieldsRef);
        }
    }
};

// ==================== 本地规则执行 ====================

const getRuleConfig = (
    props: any,
): { formId: string; config: RulePreps } | null => {
    const field = props?.field;
    const fieldRuleConfig =
        field?.preps?.ruleEngineConfig || field?.ruleEngineConfig || {};
    const formId =
        fieldRuleConfig.formId || props.formId || field?.preps?.formId;
    if (!formId) return null;
    return {formId, config: fieldRuleConfig};
};

/**
 * 本地执行规则并应用结果
 * http-call 节点通过外部注入的 httpCallHandler 发起请求
 * @returns 是否有字段控制指令被应用
 */
const executeLocal = async (
    props: any,
    formData: Ref<Record<string, any>>,
    formId: string,
    triggerEvent: string,
    triggerField?: string,
): Promise<boolean> => {
    const cache = ruleCache.get(formId);
    if (!cache) return false;

    const flowContents = cache[triggerEvent];
    if (!flowContents || flowContents.length === 0) return false;

    const currentFormData = unref(formData);
    const context = {...currentFormData};
    if (triggerField) context.__triggerField = triggerField;
    context.__trigger_event = triggerEvent;
    const delta = await executeFlows(
        flowContents,
        context,
        ruleEngineConfig.httpCallHandler,
        ruleEngineConfig.extraStrategies,
    );

    const fieldActions = parseRuleEngineActions(delta);
    if (fieldActions.length === 0) return false;

    applyRuleEngineActionsToFields(props, fieldActions, formData, formId);
    return true;
};

// ==================== 独立触发入口 ====================

/**
 * 规则事件独立分发函数（ON_CHANGE）
 *
 * 本地执行缓存规则，带防抖（300ms），避免输入框逐字触发请求。
 */
export const ruleEventDispatcher = async (
    props: any,
    _e: any,
    formData: Ref<Record<string, any>>,
    triggerField?: string,
): Promise<void> => {
    const config = getRuleConfig(props);
    if (!config) return;

    const cache = await fetchAndCacheRules(config.formId);
    if (!cache || Object.keys(cache).length === 0) return;

    const debounceKey = config.formId;
    const existing = debounceTimers.get(debounceKey);
    if (existing) clearTimeout(existing);

    debounceTimers.set(
        debounceKey,
        setTimeout(async () => {
            debounceTimers.delete(debounceKey);
            await executeLocal(
                props,
                formData,
                config.formId,
                "ON_CHANGE",
                triggerField,
            );
        }, DEBOUNCE_MS),
    );
};

/**
 * 规则引擎初始化（ON_LOAD）
 *
 * 通过注入的 fetchRulesHandler 拉取规则 → 缓存 → 本地执行 ON_LOAD 规则。
 * 每个 formId 只调一次。
 */
export const initRuleEvent = async (
    props: any,
    formData: Ref<Record<string, any>>,
): Promise<void> => {
    const config = getRuleConfig(props);
    if (!config) return;

    const cache = await fetchAndCacheRules(config.formId);
    if (!cache || Object.keys(cache).length === 0) return;

    if (loadedFormIds.has(config.formId)) return;
    loadedFormIds.add(config.formId);

    await executeLocal(props, formData, config.formId, "ON_LOAD");
};

/**
 * 按钮点击触发的规则引擎（ON_BUTTON_CLICK）
 *
 * 本地执行缓存规则，零网络开销。
 */
export const ruleButtonAction = async (
    props: any,
    formData: Ref<Record<string, any>>,
    evtName: string = "click",
): Promise<void> => {
    const field = props?.field;
    if (!field) return;

    const ruleEngineConfig =
        field.preps?.ruleEngineConfig || field.ruleEngineConfig || {};
    const formId = ruleEngineConfig.formId || props.formId || field.preps?.formId;
    if (!formId) return;

    const cache = await fetchAndCacheRules(formId);
    if (!cache || Object.keys(cache).length === 0) return;

    const currentFormData = unref(formData);
    currentFormData.__buttonKey = field.fieldName;
    currentFormData.__buttonEvent = evtName;

    await executeLocal(props, formData, formId, "ON_BUTTON_CLICK");
};

/**
 * 表单提交触发的规则引擎（ON_SUBMIT）
 *
 * 本地执行缓存规则，返回是否有字段控制指令被应用。
 * 可用于提交前校验/字段联动等场景。
 */
export const ruleSubmitAction = async (
    props: any,
    formData: Ref<Record<string, any>>,
): Promise<boolean> => {
    const config = getRuleConfig(props);
    if (!config) return false;

    const cache = await fetchAndCacheRules(config.formId);
    if (!cache || Object.keys(cache).length === 0) return false;

    return executeLocal(props, formData, config.formId, "ON_SUBMIT");
};

/**
 * 表单校验触发的规则引擎（ON_VALIDATE）
 *
 * 本地执行缓存规则，返回是否有字段控制指令被应用。
 * 可用于校验时动态调整字段必填/可见等属性。
 */
export const ruleValidateAction = async (
    props: any,
    formData: Ref<Record<string, any>>,
): Promise<boolean> => {
    const config = getRuleConfig(props);
    if (!config) return false;

    const cache = await fetchAndCacheRules(config.formId);
    if (!cache || Object.keys(cache).length === 0) return false;

    return executeLocal(props, formData, config.formId, "ON_VALIDATE");
};

// ==================== 表单字段引用注册 ====================

/**
 * 注册 formFields shallowRef 引用，用于设置 options 后触发响应式更新
 * 在 StarHorseForm.vue 的 onMounted 中调用
 */
export const setFormFieldsRef = (formId: string, formFieldsRef: any): void => {
    formFieldsRefs.set(formId, formFieldsRef);
};

/**
 * 扫描字段树，为所有配置了 ruleEngineConfig.formId 或 preps.formId 的字段注册 formFields 引用
 * 在 StarHorseForm.vue 的 recordFieldInfo 中调用，确保 triggerRef 能找到对应 formId
 */
export const registerFormFieldsRef = (
    formFields: any[],
    formFieldsRef: any,
): void => {
    const formIds = new Set<string>();
    const collectFormIds = (list: any[]) => {
        if (!Array.isArray(list)) return;
        for (const field of list) {
            if (Array.isArray(field)) {
                collectFormIds(field);
                continue;
            }
            if (field == null || typeof field !== "object") continue;
            const formId =
                field?.preps?.ruleEngineConfig?.formId ||
                field?.preps?.formId ||
                field?.ruleEngineConfig?.formId;
            if (formId) formIds.add(formId);
            if (Array.isArray(field.children)) collectFormIds(field.children);
            for (const key of CONTAINER_LIST_KEYS) {
                const containerFields = field[key];
                if (!Array.isArray(containerFields)) continue;
                for (const containerItem of containerFields) {
                    if (containerItem == null || typeof containerItem !== "object")
                        continue;
                    const innerList =
                        containerItem?.fieldList || containerItem?.headerFieldList;
                    if (Array.isArray(innerList)) collectFormIds(innerList);
                }
            }
            if (Array.isArray(field.appList)) collectFormIds(field.appList);
        }
    };
    collectFormIds(formFields);
    for (const formId of formIds) {
        formFieldsRefs.set(formId, formFieldsRef);
    }
};

// ==================== Mock 支持（demo/测试用） ====================

/**
 * 注入规则缓存（用于 demo/测试，跳过后端拉取）
 * @param formId 表单ID
 * @param rules { triggerEvent → flowContent[] }
 */
export const injectRuleCache = (
    formId: string,
    rules: Record<string, string[]>,
): void => {
    ruleCache.set(formId, rules);
    loadedFormIds.delete(formId);
};

/**
 * 读取 options 覆盖值（供 select / radio / checkbox 等组件 computed 订阅）
 * 规则引擎设置 options 时写入 optionsOverrideStore，组件通过此函数获取最新值
 * 返回 undefined 表示无覆盖，组件应回退到 field.preps.values
 */
export const getOptionsOverride = (
    formId: string,
    fieldName: string,
): any[] | undefined => {
    return optionsOverrideStore.get(`${formId}:${fieldName}`);
};

/** 清除规则缓存 */
export const clearRuleCache = (formId?: string): void => {
    if (formId) {
        ruleCache.delete(formId);
        loadedFormIds.delete(formId);
        formFieldsRefs.delete(formId);
        const timer = debounceTimers.get(formId);
        if (timer) {
            clearTimeout(timer);
            debounceTimers.delete(formId);
        }
        for (const key of optionsOverrideStore.keys()) {
            if (key.startsWith(`${formId}:`)) {
                optionsOverrideStore.delete(key);
            }
        }
    } else {
        ruleCache.clear();
        loadedFormIds.clear();
        formFieldsRefs.clear();
        for (const timer of debounceTimers.values()) {
            clearTimeout(timer);
        }
        debounceTimers.clear();
        optionsOverrideStore.clear();
    }
};
