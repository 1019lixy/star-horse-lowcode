import {createCondition, dynamicUrlOperation, isJson} from "@/api/star_horse_utils";
import {loadData} from "@/api/star_horse_apis";
import {userFunction} from "@/api/user_func";
import {ApiLinkageConfig, FieldMappingItem, RelationDetail, RequestParamItem, SelectOption} from "@/components/types";
import {error} from "@/utils/message";
import {i18n} from "@/lang";
import {computed, nextTick, unref, watch} from "vue";
import JSON5 from "json5";
import {
    executeFormulaWithFill,
    initFormFormulaWatchers,
    setupFormulaWatchers,
} from "@/components/formcomp/utils/FormulaEngine";

// ==================== 公共工具函数 ====================

/** 将值归一化为数组 */
const ensureArray = (val: any): any[] => {
    if (!Array.isArray(val)) {
        return val ? [val] : [];
    }
    return val;
};

/** 安全深拷贝，兼容 undefined/function/Date 等类型 */
const safeDeepClone = <T>(obj: T): T => {
    if (obj === null || obj === undefined) return obj;
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch {
        // 降级：简单浅拷贝
        if (Array.isArray(obj)) return [...obj] as unknown as T;
        if (typeof obj === "object") return {...obj as object} as T;
        return obj;
    }
};

/** 安全获取嵌套属性值，支持 a.b.c 和数组索引 a[0].b */
const getNestedValue = (obj: any, path: string): any => {
    if (!obj || !path) return undefined;
    const keys = path.replace(/\[(\d+)]/g, ".$1").split(".");
    let current = obj;
    for (const key of keys) {
        if (current === null || current === undefined) return undefined;
        current = current[key];
    }
    return current;
};

/** 查找字段并确保 preps 存在，支持递归查找 children */
const findField = (props: any, fieldName: string, fieldList?: any[]): any => {
    const list = fieldList || props.formInfo || [];

    for (const field of list) {
        if (field.fieldName === fieldName) {
            if (!field.preps) {
                field.preps = {};
            }
            return field;
        }
        // 递归查找 children 中的字段
        if (field.children && Array.isArray(field.children)) {
            const found = findField(props, fieldName, field.children);
            if (found) {
                return found;
            }
        }
        // 递归查找 tabList 中的字段（如数据源配置中的登录tab等）
        if (field.tabList && Array.isArray(field.tabList)) {
            for (const tab of field.tabList) {
                const tabFields = tab.fieldList || tab.batchFieldList || [];
                // batchFieldList 中的字段嵌套在 batchFieldList[].fieldList 中
                if (tab.batchFieldList) {
                    for (const batch of tab.batchFieldList) {
                        if (batch.fieldList && Array.isArray(batch.fieldList)) {
                            const found = findField(props, fieldName, batch.fieldList);
                            if (found) return found;
                        }
                    }
                } else if (Array.isArray(tabFields)) {
                    const found = findField(props, fieldName, tabFields);
                    if (found) return found;
                }
            }
        }
    }
    return null;
};

/** 遍历关联字段，对每个字段执行操作 */
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

// ==================== 防抖控制器 ====================

/** 接口联动防抖 Map：key = relationDetail的唯一标识，value = requestId */
const apiLinkageRequestMap = new Map<string, number>();

/** 获取联动唯一标识 */
const getLinkageKey = (item: RelationDetail): string => {
    return `${item.matchFieldName}_${item.controlCondition}_${item.relationFields?.toString()}`;
};

/** 生成请求ID（递增），用于丢弃过期响应 */
const nextRequestId = (key: string): number => {
    const id = (apiLinkageRequestMap.get(key) || 0) + 1;
    apiLinkageRequestMap.set(key, id);
    return id;
};

// ==================== 字段赋值 ====================

const fieldAssign = (
    props: any,
    relationFields: Array<string>,
    values: SelectOption[] | any,
) => {
    const record: Record<string, Array<string>> = {
        values: ["select", "autocomplete", "radio", "checkbox"],
        data: ["tselect", "transfer"],
        options: ["cascade"],
    };
    forEachRelationField(props, relationFields, (field) => {
        let flag = false;
        field["formVisible"] = true;
        Object.entries(record).forEach(([key, value]) => {
            if (value.includes(field.itemType ?? field.type)) {
                field.preps[key] = values;
                flag = true;
                return false;
            }
        });
        if (!flag) {
            if (isJson(values)) {
                Object.entries(values).forEach(([key, value]) => {
                    field.preps[key] = value;
                });
            } else if (!Array.isArray(values)) {
                field["defaultValue"] = values;
            }
        }
    });
};

// ==================== 匹配判断 ====================

/**
 * 判断 e 是否匹配 matchFieldValue
 * 改进：完整的 null 安全检查、数组 matchFieldValue 全部匹配类型支持
 */
const isMatch = (matchType: string, matchFieldValue: any, e: any) => {
    // null/undefined 安全处理
    if (e === null || e === undefined) {
        if (matchType === "isnull") return true;
        if (matchType === "notnull") return false;
        // 其他匹配类型，空值一律不匹配
        return false;
    }

    // 如果 matchFieldValue 本身是数组（多值匹配），任一值匹配即可
    if (Array.isArray(matchFieldValue)) {
        if (matchFieldValue.length === 0) return true; // 空数组 = 无条件匹配
        return matchFieldValue.some((mv) => isMatch(matchType, mv, e));
    }

    // e 为数组时，检查是否有元素匹配
    if (Array.isArray(e)) {
        if (e.length === 0) {
            return matchType === "isnull" || matchType === "notnull";
        }
        return e.some((item) => isMatchSingle(matchType, matchFieldValue, item));
    }

    return isMatchSingle(matchType, matchFieldValue, e);
};

/** 单值匹配判断（e 和 matchFieldValue 均为非数组标量） */
const isMatchSingle = (matchType: string, matchFieldValue: any, e: any) => {
    // 统一转字符串做包含/前缀/后缀匹配
    const fv = String(matchFieldValue ?? "");
    const ev = String(e ?? "");

    switch (matchType) {
        case "llk": return fv.startsWith(ev);
        case "rlk": return fv.endsWith(ev);
        case "neq": return fv !== ev;
        case "nlk": return !fv.includes(ev);
        case "lt": return Number(fv) < Number(e);
        case "lte": return Number(fv) <= Number(e);
        case "gt": return Number(fv) > Number(e);
        case "gte": return Number(fv) >= Number(e);
        case "isnull": return !e && e !== 0;
        case "notnull": return !!e || e === 0;
        case "bt": {
            // between: matchFieldValue 应为 [min, max]
            if (!Array.isArray(matchFieldValue) || matchFieldValue.length < 2) return false;
            const numE = Number(e);
            return Number(matchFieldValue[0]) <= numE && numE <= Number(matchFieldValue[1]);
        }
        case "eq":
        default: return fv.includes(ev);
    }
};

// ==================== 联动处理器 ====================

/** 属性控制映射表：controlCondition -> { 目标属性, 是否取反 } */
const CONTROL_ACTION_MAP: Record<string, { targetProp: string; negate: boolean; isPreps: boolean }> = {
    eqHide:      { targetProp: "formVisible", negate: true,  isPreps: false },
    eqVisible:   { targetProp: "formVisible", negate: false, isPreps: false },
    eqDisable:   { targetProp: "disabled",    negate: false, isPreps: true },
    eqEditable:  { targetProp: "disabled",    negate: true,  isPreps: true },
    eqRequired:  { targetProp: "required",    negate: false, isPreps: false },
    eqUnRequired: { targetProp: "required",   negate: true,  isPreps: false },
};

/**
 * 属性控制（显隐/禁用/必填）
 * 改进：支持恢复机制 — 不匹配时恢复字段原始状态
 */
const controlFieldProps = (props: any, item: RelationDetail, e: any) => {
    const {matchFieldValue, matchType, controlCondition, relationFields} = item;
    const matchValues = ensureArray(matchFieldValue);
    const matchResult = matchValues.length === 0 || isMatch(matchType, matchFieldValue, e);
    const action = CONTROL_ACTION_MAP[controlCondition];
    if (!action) return;

    const finalValue = action.negate ? !matchResult : matchResult;
    forEachRelationField(props, relationFields, (field) => {
        // 记录原始值用于恢复
        const backupKey = `_backup_${action.targetProp}`;
        if (field[backupKey] === undefined) {
            if (action.isPreps) {
                field[backupKey] = field.preps[action.targetProp];
            } else {
                field[backupKey] = field[action.targetProp];
            }
        }
        if (action.isPreps) {
            field.preps[action.targetProp] = finalValue;
        } else {
            field[action.targetProp] = finalValue;
        }
    });
};

/** 数据关联（数据源联动）
 *  改进：使用 isMatch() 支持全部 matchType；安全深拷贝；null 防护
 */
const dataLinkage = async (props: any, item: RelationDetail, e: any) => {
    const {relationFields, params, matchFieldValue, matchType} = item;

    // 使用完整匹配逻辑代替简单 includes
    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !isMatch(matchType, matchFieldValue, e)) {
        return;
    }

    if (!params) {
        console.warn("[dataLinkage] 缺少关联参数配置");
        return;
    }

    const tempParams: any = safeDeepClone(params);
    if (item.controlCondition === "asParamDataLinkage") {
        tempParams["queryParams"] = tempParams.queryParams || [];
        tempParams.queryParams.push(
            createCondition(item.matchFieldName, e, item.matchType),
        );
    }
    const resultData = await dynamicUrlOperation({
        preps: Object.assign({}, tempParams),
    });
    fieldAssign(props, ensureArray(relationFields) as string[], resultData);
};

/** 赋值 */
const assignValue = (props: any, item: RelationDetail, _e: any) => {
    fieldAssign(props, ensureArray(item.relationFields) as string[], item.staticDatas);
};

/** 改变字段类型 */
const changeType = (props: any, item: RelationDetail, e: any) => {
    const {matchFieldValue, matchType, relationFields, staticDatas} = item;
    if (!isMatch(matchType, matchFieldValue, e)) return;

    forEachRelationField(props, relationFields, (field) => {
        field["itemType"] = staticDatas;
        field["type"] = staticDatas;
    });
};

/** 清空字段值联动
 *  当条件匹配时，将关联字段的值清空（表单值设为 null/空数组）
 */
const clearLinkage = (props: any, item: RelationDetail, e: any) => {
    const {matchFieldValue, matchType, relationFields} = item;
    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !isMatch(matchType, matchFieldValue, e)) {
        return;
    }
    const formData = props.formData;
    if (!formData) return;
    const data = unref(formData);
    forEachRelationField(props, relationFields, (field, fieldName) => {
        // 根据字段类型清空为合适的空值
        const type = field.itemType ?? field.type;
        if (["select", "tselect", "transfer", "checkbox"].includes(type)) {
            data[fieldName] = [];
            field.preps.values = [];
            field.preps.data = [];
        } else if (type === "cascade") {
            data[fieldName] = [];
            field.preps.options = [];
        } else {
            data[fieldName] = null;
            field.defaultValue = null;
        }
    });
};

/** 刷新数据源联动
 *  强制刷新关联字段的数据源（重新加载动态数据）
 */
const refreshLinkage = async (props: any, item: RelationDetail, e: any) => {
    const {relationFields, params, matchFieldValue, matchType} = item;
    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !isMatch(matchType, matchFieldValue, e)) {
        return;
    }
    forEachRelationField(props, relationFields, async (field, fieldName) => {
        const fieldParams = field.preps?.starHorseFieldUrl;
        if (fieldParams) {
            const resultData = await dynamicUrlOperation({preps: fieldParams});
            field.preps.values = resultData;
            field.preps.data = resultData;
            field.preps.options = resultData;
        }
    });
};

// ==================== 接口联动 ====================

/** 解析请求参数中的动态占位符，将 $formField.xxx 替换为表单字段值 */
const resolveRequestParams = (params: Record<string, any>, formData: any): Record<string, any> => {
    if (!params || !formData) return params;
    const resolved: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string" && value.startsWith("$formField.")) {
            const fieldName = value.substring("$formField.".length);
            resolved[key] = formData[fieldName] ?? "";
        } else if (typeof value === "string" && value.startsWith("$current.")) {
            // $current 表示当前触发联动的字段值
            resolved[key] = formData[value.substring("$current.".length)] ?? "";
        } else {
            resolved[key] = value;
        }
    }
    return resolved;
};

/** 解析单个动态值，支持 $formField.xxx（深层路径）、$current、$current.xxx 占位符 */
const resolveDynamicValue = (value: string, formData: any, currentValue?: any): any => {
    if (!value || typeof value !== "string") return value;
    if (value === "$current") {
        return currentValue ?? "";
    }
    if (value.startsWith("$formField.")) {
        const path = value.substring("$formField.".length);
        return getNestedValue(formData, path) ?? "";
    }
    if (value.startsWith("$current.")) {
        const path = value.substring("$current.".length);
        return getNestedValue(formData, path) ?? "";
    }
    return value;
};

/** 接口联动：调用第三方接口，根据响应模板提取数据，按字段映射赋值给表单
 *  改进：请求ID防抖，丢弃过期响应；使用 isMatch() 统一匹配逻辑
 */
const apiLinkageAction = async (props: any, item: RelationDetail, e: any) => {
    const config = item.apiLinkageConfig;
    if (!config || !config.url) {
        console.warn("[apiLinkage] 缺少接口联动配置或URL");
        return;
    }

    const {matchFieldValue, matchType} = item;
    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !isMatch(matchType, matchFieldValue, e)) {
        return;
    }

    // 生成请求ID，用于丢弃过期响应
    const linkageKey = getLinkageKey(item);
    const requestId = nextRequestId(linkageKey);

    try {
        // 构建请求参数
        const requestParams: Record<string, any> = {
            url: config.url,
            httpMethod: config.httpMethod || "POST",
            dataType: config.dataType || "JSON",
            protocol: config.protocol || "http",
            host: config.host || "",
            port: config.port,
            env: config.env || "",
            responseTemplate: config.responseTemplate || "result_data",
            successCode: config.successCode ?? 0,
            codePath: config.codePath || "code",
            dataPath: config.dataPath || "data",
            messagePath: config.messagePath || "message",
            authType: config.authType || "none",
            timeout: config.timeout,
            serviceName: config.serviceName || "",
        };

        // 构建认证信息 - 根据认证类型转换结构化字段
        const authType = config.authType || "none";
        if (authType === "login" || config.needLogin === "Y") {
            requestParams.authType = "login";
            requestParams.loginUrl = config.loginUrl;
            requestParams.loginMethod = config.loginMethod || "POST";
            requestParams.loginAccount = config.loginAccount || "";
            requestParams.loginPassword = config.loginPassword || "";
            requestParams.loginParams = config.loginParams || {};
            requestParams.loginTokenPath = config.loginTokenPath || "data.token";
            requestParams.loginHeaderName = config.loginHeaderName || "Authorization";
        } else if (authType === "basic") {
            requestParams.authInfo = {
                username: config.basicUsername || "",
                password: config.basicPassword || "",
            };
        } else if (authType === "bearer") {
            requestParams.authInfo = {
                token: config.bearerToken || "",
            };
        } else if (authType === "custom") {
            requestParams.headers = config.customHeaders || {};
        } else {
            // none 或兼容旧配置
            requestParams.authInfo = config.authInfo || {};
            requestParams.headers = config.headers || {};
        }

        // 解析动态请求参数 - 支持新的表格形式和旧的JSON格式
        const formData = props.formData || {};
        const data = unref(formData);
        if (config.requestParams) {
            if (Array.isArray(config.requestParams)) {
                // 新格式: RequestParamItem[] 表格形式
                const resolved: Record<string, any> = {};
                for (const param of config.requestParams as RequestParamItem[]) {
                    if (param.paramName) {
                        resolved[param.paramName] = resolveDynamicValue(param.paramValue, data, e);
                    }
                }
                requestParams.params = resolved;
            } else {
                // 旧格式: Record<string, any> JSON格式
                requestParams.params = resolveRequestParams(config.requestParams, data);
            }
        }
        // 将当前触发值注入参数
        if (item.matchFieldName && e !== undefined && e !== null) {
            requestParams.params = requestParams.params || {};
            requestParams.params[item.matchFieldName] = e;
        }

        // 字段映射
        if (config.fieldMappings && config.fieldMappings.length > 0) {
            requestParams.fieldMappings = config.fieldMappings.map((m: FieldMappingItem) => ({
                sourceField: m.sourceField,
                targetField: m.targetField,
                typeConvert: m.typeConvert,
                transform: m.transform,
            }));
        }

        // 调用后端代理接口
        const result = await loadData("/system-config/redirect/apiLinkage", requestParams);

        // 防抖检查：如果已有更新的请求发出，丢弃当前响应
        if (apiLinkageRequestMap.get(linkageKey) !== requestId) {
            return;
        }

        if (result.error) {
            error(i18n("api.apiLinkageError") || "接口联动请求失败: " + result.error);
            return;
        }

        // 后端已根据模板提取并映射数据，直接赋值
        const mappedData = result.data;
        if (!mappedData || (typeof mappedData === "object" && Object.keys(mappedData).length === 0)) {
            return;
        }

        // 将映射后的数据赋值给表单字段
        if (formData) {
            for (const [key, value] of Object.entries(mappedData)) {
                if (value !== undefined && value !== null) {
                    data[key] = value;
                }
            }
        }
    } catch (err: any) {
        // 防抖检查：过期请求的错误也忽略
        if (apiLinkageRequestMap.get(linkageKey) !== requestId) {
            return;
        }
        console.error("[apiLinkage] 接口联动异常:", err);
        error(i18n("api.apiLinkageError") || "接口联动异常: " + (err.message || err));
    }
};

// ==================== 联动事件分发 ====================

/**
 * 联动事件分发器
 * 改进：使用 for...of + await 确保按序执行，避免并发竞态
 */
const relationEvent = (
    props: any,
    relationDetails: RelationDetail[],
    e: any,
    actionName: string,
) => {
    if (!Array.isArray(relationDetails)) {
        console.error(i18n("api.relationDetailsMustBeArray"), relationDetails);
        return;
    }

    // 使用 async IIFE + for...of 保证顺序执行
    (async () => {
        for (const item of relationDetails) {
            const {controlCondition, relationFields} = item;
            if (!relationFields || item.isWorking) {
                continue;
            }
            item.isWorking = true;

            try {
                switch (controlCondition) {
                    case "eqConditionDataLinkage":
                    case "asParamDataLinkage":
                        await dataLinkage(props, item, e);
                        break;
                    case "eqDisable":
                    case "eqHide":
                    case "eqEditable":
                    case "eqVisible":
                    case "eqRequired":
                    case "eqUnRequired":
                        controlFieldProps(props, item, e);
                        break;
                    case "assignValue":
                        assignValue(props, item, e);
                        break;
                    case "changeType":
                        changeType(props, item, e);
                        break;
                    case "apiLinkage":
                        await apiLinkageAction(props, item, e);
                        break;
                    case "clearLinkage":
                        clearLinkage(props, item, e);
                        break;
                    case "refreshLinkage":
                        await refreshLinkage(props, item, e);
                        break;
                    default:
                        console.log(i18n("api.unhandledEvent") + controlCondition);
                }
            } catch (err) {
                console.error(`[relationEvent] 联动执行异常 (${controlCondition}):`, err);
            }

            await nextTick();
            item.isWorking = false;
        }
    })();
};

// ==================== 事件触发 ====================

/** 所有触发的事件 */
const allAction = (
    context: any,
    emits: any,
    formData: any,
    actionName: string,
    _isInit: boolean = false,
) => {
    const currentData = unref(formData);
    try {
        emits("selfFunc", actionName, currentData);
    } catch (e) {
        error(i18n("api.eventTriggerError") + e);
    }
};

/** Button 组件的点击事件 */
const buttonAction = (
    context: any,
    emits: any,
    formData: any,
    code: string,
    evtName: string = "click",
) => {
    const currentData = unref(formData);
    if (code) {
        userFunction(code, context, currentData);
    } else {
        const field = context.field as any;
        currentData["starHorseBtnName"] = field.fieldName;
        const actions = field.actions;
        if (actions) {
            if (typeof actions === "function") {
                actions(formData);
            } else {
                actions[evtName]?.(formData);
            }
        } else {
            emits("selfFunc", currentData);
        }
    }
};

// ==================== 禁用检查 ====================

/** 检查是否禁用 */
const checkIsDisabled = (attrs: any) => {
    const {field} = attrs;
    const fieldName = field.fieldName;
    const isExplicitlyDisabled =
        attrs?.disabled || field.disabled || field.preps?.disabled;
    const editDisabled =
        (attrs.editDisabled || field.editDisabled || field.preps?.editDisabled) &&
        field.preps?.starHorseFieldSource != 1;
    const isImplicitlyDisabled =
        !attrs?.formData?.[`_${fieldName}Editable`] && field?.preps?.disabled;
    return (
        editDisabled === true ||
        isExplicitlyDisabled === true ||
        isImplicitlyDisabled === true ||
        attrs.source == 3
    );
};

// ==================== 表单字段绑定 ====================

const useFormField = (context: any, field: any) => {
    const fieldName = computed(() => field.fieldName);
    const updateFormData = (value: any) => {
        const newData = context.attrs.formData;
        newData[fieldName.value] = value;
    };

    return {
        fieldValue: computed({
            get: () => context.attrs.formData[fieldName.value],
            set: updateFormData,
        }),
    };
};

// ==================== 初始化事件 ====================

const initRelationEvent = (props: any, formData: any, needWatch?: boolean) => {
    const dataRelation = props.field.preps?.dataRelation;
    const actionName = dataRelation?.actionName;
    if (actionName) {
        if (
            (Object.keys(formData.value || {}).length == 0 ||
                !formData.value?.[props.field?.fieldName]) &&
            needWatch
        ) {
            const stop = watch(
                () => formData.value?.[props.field?.fieldName],
                (val) => {
                    if (val) {
                        relationEvent(
                            props,
                            dataRelation?.relationDetails,
                            val,
                            actionName,
                        );
                        stop();
                    }
                },
                {immediate: true},
            );
            return;
        }
        relationEvent(
            props,
            dataRelation?.relationDetails,
            formData.value[props.field.fieldName],
            actionName,
        );
    }
};

const initCompCallEvent = (props: any, emits: any, formData: any) => {
    const events: string[] = Object.keys(props.field.actions || {});
    if (
        !props.isSearch &&
        !props.field?.preps?.["stopInitCallAction"] &&
        events?.length > 0
    ) {
        if (
            Object.keys(formData.value || {}).length == 0 ||
            !formData.value[props.field.fieldName]
        ) {
            const stop = watch(
                () => formData.value[props.field.fieldName],
                (val) => {
                    if (val) {
                        doInitCallEvent(props, emits, formData);
                        initRelationEvent(props, val, false);
                        stop();
                    }
                },
                {immediate: true},
            );
            return;
        }
        doInitCallEvent(props, emits, formData);
    }
    initRelationEvent(props, formData, true);
};

const doInitCallEvent = (props: any, emits: any, formData: any) => {
    const events: string[] = Object.keys(props.field.actions || {});
    if (props.field?.preps?.["starHorseFieldSource"] == 5) {
        return;
    }
    events?.forEach((event) => {
        allAction(props, emits, unref(formData), event, true);
    });
};

// ==================== 工具函数 ====================

const isNaN = (value: any) => {
    return value !== value;
};

const isReadOnly = (obj: any, prop: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (!descriptor) return false;
    return descriptor.writable === false;
};

const prepsFilter = (preps: any) => {
    if (!preps || Object.keys(preps).length == 0) return {};

    Object.keys(preps).forEach((key) => {
        const prep = preps[key];
        if (
            (prep === undefined || prep === null || prep === "" || isNaN(prep)) &&
            !isReadOnly(preps, key)
        ) {
            delete preps[key];
        }

        if (prep === "false" || prep === "true") {
            preps[key] = Boolean(prep);
        }
    });
    return preps;
};

const convertData = (data: any) => {
    if (typeof data === "string") {
        try {
            return JSON5.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    return data;
};

// ==================== 导出 ====================

export {
    allAction,
    buttonAction,
    checkIsDisabled,
    initCompCallEvent,
    prepsFilter,
    relationEvent,
    useFormField,
    convertData,
    executeFormulaWithFill,
    initFormFormulaWatchers,
    setupFormulaWatchers,
};
