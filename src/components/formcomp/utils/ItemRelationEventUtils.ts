import {closeLoad, createCondition, dynamicUrlOperation, isJson, load,} from "@/api/star_horse_utils";
import {userFunction} from "@/api/user_func";
import {ApiLinkageDetail, ItemRelation, RelationDetail, RulePreps, SelectOption,} from "@/components/types";
import {error, warning} from "@/utils/message";
import {i18n} from "@/lang";
import {computed, isRef, nextTick, Ref, unref, watch} from "vue";
import JSON5 from "json5";
import {
    executeFormulaWithFill,
    initFormFormulaWatchers,
    setupFormulaWatchers,
} from "@/components/formcomp/utils/FormulaEngine";
import {postRequest} from "@/api/star_horse_apis";
import {PreOrPendEventConfig} from "@/components/types/PreOrPendType";

// ==================== 公共工具函数 ====================

/** 将值归一化为数组 */
const ensureArray = (val: any): any[] => {
    if (!Array.isArray(val)) {
        return val ? [val] : [];
    }
    return val;
};

/**
 * 归一化 formInfo 为数组
 * 兼容上游传入 shallowRef/ref 对象(取 .value)、单个 field 对象、非数组值
 * 避免因 props.formInfo 未被解包导致 findField/findContainerItems 静默失败
 */
const resolveFormInfo = (formInfo: any): any[] => {
    if (formInfo == null) return [];
    // ref/shallowRef 对象:取 .value(isRef 是 Vue 官方 API,稳定可靠)
    if (isRef(formInfo)) {
        const val = formInfo.value;
        return Array.isArray(val) ? val : [];
    }
    if (Array.isArray(formInfo)) return formInfo;
    return [];
};

/** 查找字段并确保 preps 存在，支持递归查找 children */
/** 容器子节点属性名列表(tabList/cardList/collapseList/splitterList/dytableList) */
const CONTAINER_LIST_KEYS = [
    "tabList",
    "cardList",
    "collapseList",
    "splitterList",
    "dytableList",
    "stepList",
    "dialogList",
    "conditionList",
    "drawerList",
    "descriptionsList",
    "fieldsetList"
];

const findField = (
    props: any,
    fieldName: string,
    fieldList?: any[],
    visited?: WeakSet<any>,
): any => {
    const list = fieldList || resolveFormInfo(props.formInfo);
    // 容错:formInfo 可能不是数组(如传入单个 field 对象或非数组值)
    if (!Array.isArray(list)) return null;
    // 循环引用防护:防止用户配置 A.children=[A] 导致栈溢出
    if (!visited) visited = new WeakSet();

    for (const field of list) {
        // 容错:fieldList 中的元素可能是数组(如 [[field1, field2], field3])
        if (Array.isArray(field)) {
            const found = findField(props, fieldName, field, visited);
            if (found) return found;
            continue;
        }
        // 容错:field 可能是 null/undefined 或非对象(字符串/数字等)
        if (field == null || typeof field !== "object") continue;
        // 循环引用防护:已访问的对象跳过
        if (visited.has(field)) continue;
        visited.add(field);

        if (field.fieldName === fieldName) {
            if (!field.preps) {
                field.preps = {};
            }
            return field;
        }
        // 递归查找 children 中的字段
        if (Array.isArray(field.children)) {
            const found = findField(props, fieldName, field.children, visited);
            if (found) {
                return found;
            }
        }
        // 递归查找容器子节点(tabList/cardList/collapseList/splitterList/dytableList)内的 fieldList
        // 使普通字段控制策略(controlFieldProps)能定位到容器内的字段
        for (const key of CONTAINER_LIST_KEYS) {
            const containerList = field[key];
            if (!Array.isArray(containerList)) continue;
            for (const containerItem of containerList) {
                if (containerItem == null || typeof containerItem !== "object") continue;
                const innerList =
                    containerItem?.fieldList ||
                    containerItem?.headerFieldList;
                if (Array.isArray(innerList) && innerList.length > 0) {
                    const found = findField(props, fieldName, innerList, visited);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        // App 端:递归查找 appList 内的字段(App 端扁平化后字段都在 appList 里)
        if (Array.isArray(field.appList)) {
            const found = findField(props, fieldName, field.appList, visited);
            if (found) {
                return found;
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

/** 判断 e 是否匹配 matchFieldValue，支持 e 为数组的情况 */
const isMatch = (matchType: string, matchFieldValue: any, e: any) => {
    if (Array.isArray(e)) {
        return e.some((item) => matchFieldValue.includes(item));
    }
    switch (matchType) {
        case "llk":
            return matchFieldValue.startsWith(e);
        case "rlk":
            return matchFieldValue.endsWith(e);
        case "neq":
        case "nlk":
            return !matchFieldValue.includes(e);
        case "lt":
            return matchFieldValue < e;
        case "lte":
            return matchFieldValue <= e;
        case "gt":
            return matchFieldValue > e;
        case "gte":
            return matchFieldValue >= e;
        case "isnull":
            return !e;
        case "notnull":
            return !!e;
        case "bt":
            return matchFieldValue[0] <= e && e <= matchFieldValue[1];
        default:
            return matchFieldValue.includes(e);
    }
};

// ==================== 联动处理器 ====================

/** 属性控制映射表：controlCondition -> { 目标属性, 是否取反 } */
const CONTROL_ACTION_MAP: Record<
    string,
    { targetProp: string; negate: boolean; isPreps: boolean }
> = {
    eqHide: {targetProp: "formVisible", negate: true, isPreps: false},
    eqVisible: {targetProp: "formVisible", negate: false, isPreps: false},
    eqDisable: {targetProp: "disabled", negate: false, isPreps: true},
    eqEditable: {targetProp: "disabled", negate: true, isPreps: true},
    eqRequired: {targetProp: "required", negate: false, isPreps: false},
    eqUnRequired: {targetProp: "required", negate: true, isPreps: false},
    // 规则引擎控制动作 - 与上面保持相同的属性映射机制
    ruleHide: {targetProp: "formVisible", negate: true, isPreps: false},
    ruleVisible: {targetProp: "formVisible", negate: false, isPreps: false},
    ruleDisable: {targetProp: "disabled", negate: false, isPreps: true},
    ruleEditable: {targetProp: "disabled", negate: true, isPreps: true},
    ruleRequired: {targetProp: "required", negate: false, isPreps: false},
    ruleUnRequired: {targetProp: "required", negate: true, isPreps: false},
};

/** 属性控制（显隐/禁用/必填） */
const controlFieldProps = (props: any, item: RelationDetail, e: any) => {
    const {matchFieldValue, matchType, controlCondition, relationFields} = item;
    const matchResult = isMatch(matchType, ensureArray(matchFieldValue), e);
    const action = CONTROL_ACTION_MAP[controlCondition];
    if (!action) return;

    const finalValue = action.negate ? !matchResult : matchResult;
    forEachRelationField(props, relationFields, (field) => {
        if (action.isPreps) {
            field.preps[action.targetProp] = finalValue;
        } else {
            field[action.targetProp] = finalValue;
        }
    });
};

// ==================== 容器项控制(独立于普通字段控制) ====================

/**
 * 容器动作映射表
 * 容器项的 disabled/formVisible 都是直接属性(不走 preps),与 controlFieldProps 不同
 */
const CONTAINER_ACTION_MAP: Record<string, { targetProp: string; negate: boolean }> = {
    eqHide: {targetProp: "formVisible", negate: true},
    eqVisible: {targetProp: "formVisible", negate: false},
    eqDisable: {targetProp: "disabled", negate: false},
    eqEditable: {targetProp: "disabled", negate: true},
    ruleHide: {targetProp: "formVisible", negate: true},
    ruleVisible: {targetProp: "formVisible", negate: false},
    ruleDisable: {targetProp: "disabled", negate: false},
    ruleEditable: {targetProp: "disabled", negate: true},
};

/**
 * 按 tabName 在容器列表中查找容器项
 * @param props 表单组件 props(含 formInfo)
 * @param tabNames 要查找的 tabName 列表
 * @param containerField 指定容器所在 field 的 fieldName;不指定则全局查找
 * @returns 匹配到的容器项数组
 */
const findContainerItems = (
    props: any,
    tabNames: string[],
    containerField?: string,
): any[] => {
    const result: any[] = [];
    const list = resolveFormInfo(props.formInfo);
    // 容错:formInfo 可能不是数组
    if (!Array.isArray(list)) return result;
    // 循环引用防护
    const visited = new WeakSet();
    const search = (fields: any[]) => {
        // 容错:fields 可能不是数组
        if (!Array.isArray(fields)) return;
        for (const field of fields) {
            // 容错:field 可能是 null/undefined 或非对象
            if (field == null || typeof field !== "object") continue;
            // 循环引用防护
            if (visited.has(field)) continue;
            visited.add(field);
            // 限定 containerField 时跳过不匹配的 field
            if (containerField && field.fieldName !== containerField) {
                // 但仍需递归 children/appList,因为容器可能嵌套在 group 下
                if (Array.isArray(field.children)) search(field.children);
                if (Array.isArray(field.appList)) search(field.appList);
                continue;
            }
            for (const key of CONTAINER_LIST_KEYS) {
                const containerList = field[key];
                if (!Array.isArray(containerList)) continue;
                for (const containerItem of containerList) {
                    if (containerItem == null || typeof containerItem !== "object") continue;
                    if (
                        containerItem?.tabName &&
                        tabNames.includes(containerItem.tabName)
                    ) {
                        if (!containerItem.preps) containerItem.preps = {};
                        result.push(containerItem);
                    }
                }
            }
            // App 端:识别 __appContainer 标记的影子容器项(非子表单容器拆解后保留)
            if (field.__appContainer && field.tabName && tabNames.includes(field.tabName)) {
                if (!field.preps) field.preps = {};
                result.push(field);
            }
            // App 端:appList 内的子表单容器(带 tabName + oldType)也需要识别
            if (Array.isArray(field.appList)) {
                for (const appItem of field.appList) {
                    if (appItem == null || typeof appItem !== "object") continue;
                    if (appItem?.tabName && tabNames.includes(appItem.tabName)) {
                        if (!appItem.preps) appItem.preps = {};
                        result.push(appItem);
                    }
                }
                // 递归 appList 内部可能嵌套的结构
                search(field.appList);
            }
            if (Array.isArray(field.children)) search(field.children);
        }
    };
    search(list);
    return result;
};

/**
 * 同步容器显隐状态(PC 端 formVisible + App 端字段 __containerHidden)
 * App 端扁平化后字段直接在 appList 渲染,不经过容器组件,
 * 因此影子容器(__appContainer)的 fieldList 内字段需要通过 __containerHidden 同步显隐
 */
const syncContainerVisibility = (container: any, visible: boolean) => {
    container.formVisible = visible;
    //App 端:同步设置原始容器的 formVisible(与 PC 端一致)
    //原始容器是 reactive 对象,设置后触发 platformFields computed 重算,
    //重算后新 title 文本项的 formVisible 读取到最新值,实现显隐同步
    if (container.__originContainer) {
        container.__originContainer.formVisible = visible;
    }
    if (container.__appContainer && Array.isArray(container.fieldList)) {
        container.fieldList.forEach((f: any) => {
            if (f && typeof f === "object" && !Array.isArray(f)) {
                f.__containerHidden = !visible;
            }
        });
    }
};

/**
 * 容器显隐/禁用控制(独立于 controlFieldProps)
 * 直接修改容器项的 formVisible/disabled 属性,不走 preps
 */
const controlContainerProps = (props: any, item: RelationDetail, e: any) => {
    const {
        matchFieldValue,
        matchType,
        controlCondition,
        relationFields,
        containerField,
    } = item;
    const matchResult = isMatch(matchType, ensureArray(matchFieldValue), e);
    const action = CONTAINER_ACTION_MAP[controlCondition];
    if (!action) return;
    const finalValue = action.negate ? !matchResult : matchResult;
    const containers = findContainerItems(
        props,
        ensureArray(relationFields) as string[],
        containerField,
    );
    containers.forEach((containerItem) => {
        if (action.targetProp === "formVisible") {
            // 显隐控制:走同步函数(PC 端 formVisible + App 端 __containerHidden)
            syncContainerVisibility(containerItem, finalValue);
        } else {
            containerItem[action.targetProp] = finalValue;
        }
    });
};

/** 数据关联 */
const dataLinkage = async (props: any, item: RelationDetail, e: any) => {
    let {relationFields, params, matchFieldValue} = item;

    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !matchValues.includes(e)) {
        return;
    }

    const tempParams: any = JSON5.parse(JSON5.stringify(params));
    if (item.controlCondition == "asParamDataLinkage") {
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
    fieldAssign(
        props,
        ensureArray(item.relationFields) as string[],
        item.staticDatas,
    );
};

/** 改变字段类型 */
const changeType = (props: any, item: RelationDetail, e: any) => {
    const {matchFieldValue, matchType, relationFields, staticDatas} = item;
    const matchResult = isMatch(matchType, ensureArray(matchFieldValue), e);
    if (!matchResult) return;

    forEachRelationField(props, relationFields, (field) => {
        field["itemType"] = staticDatas;
        field["type"] = staticDatas;
    });
};

// ==================== 联动事件分发 ====================
/**
 * 联动事件分发函数
 * @param props
 * @param item
 * @param e
 * @param formData
 * @param actionName
 */
const relationEventDispatcher = (
    props: any,
    item: ItemRelation,
    e: any,
    formData: Ref<Record<string, any>>,
    actionName: string,
) => {
    const relationDetails = item.relationDetails;
    const apiLinkage = item.apiLinkage;
    if (relationDetails && relationDetails.length > 0) {
        relationEvent(props, relationDetails, e, formData, actionName);
    } else if (apiLinkage && Object.keys(apiLinkage).length > 0 && props.source != 3) {
        apiLinkageOperation(apiLinkage, formData);
    }
};
/**
 *
 * @param apiLinkage
 * @param formData
 */
export const apiLinkageOperation = (
    apiLinkage: ApiLinkageDetail,
    formData: Ref<Record<string, any>>
) => {
    //数据配置OK后
    const condition = {
        ...apiLinkage,
        formData: unref(formData),
    };
    load(i18n("ide.status.loading"));
    postRequest(
        apiLinkage.proxyUrl ?? "/system-config/redirect/apiLinkage",
        condition,
    )
        .then((response) => {
            const result = response?.data;
            closeLoad();
            if (result?.code!=200) {
                warning(result.cnMessage);
                return;
            }
            const data = result?.data;
            if (data) {
                for (let key in data) {
                    if ("_value" != key) {

                        //如果有数据不替换
                        //任何时候都替换
                        //如果数据和返回数据不一致替换
                        unref(formData)[key] = data[key];
                    }
                }
            }
        })
        .finally(() => {
            closeLoad();
        });
};

// ==================== 规则引擎调度 ====================

/**
 * 规则引擎调度器
 *
 * 当字段的 dataRelation 配置了 ruleEngine 类型时触发。
 * 通过后端 executeByForm API 执行规则集，将结果应用到表单字段。
 *
 * 核心设计：融入已有事件流，不新增并行事件系统
 * - ON_CHANGE: 通过现有 relationEventDispatcher 的 controlCondition="ruleEngine" 触发
 * - 不新增深度 watch formData，复用现有字段级 watch 机制
 *
 * @param props 表单组件 props
 * @param item 联动详情配置
 * @param e 当前字段值
 * @param formData 表单数据
 */
const ruleEngineDispatcher = async (
    props: any,
    item: RelationDetail,
    e: any,
    formData: Ref<Record<string, any>>,
) => {
    const {matchFieldValue} = item;

    // 匹配检查：与 dataLinkage 保持一致的匹配逻辑
    const matchValues = ensureArray(matchFieldValue);
    if (matchValues.length > 0 && !matchValues.includes(e)) {
        return;
    }

    // 获取 formId 和规则引擎 API 配置
    const ruleEngineConfig = item.ruleEngineConfig || {} as RulePreps;
    const formId = ruleEngineConfig.formId || props.formId || props.field?.preps?.formId;
    const apiBasePath = ruleEngineConfig.proxyUrl || "/system-config/redirect/ruleExecute";

    if (!formId) {
        console.warn("[ruleEngineDispatcher] formId 未配置，跳过规则引擎调用");
        return;
    }

    try {
        const currentFormData = unref(formData);
        const res = await postRequest(apiBasePath,
            {
                instanceData: currentFormData,
                configData: ruleEngineConfig,
            }
        );

        const data = res?.data?.data;
        if (!data || !Array.isArray(data)) return;

        // 合并所有规则集的 mergedContext
        const merged: Record<string, any> = {};
        for (const rs of data) {
            if (rs.mergedContext) Object.assign(merged, rs.mergedContext);
        }

        // 解析字段控制指令并应用
        const fieldActions = parseRuleEngineActions(merged);
        applyRuleEngineActionsToFields(props, fieldActions, formData);
    } catch (err) {
        console.error("[ruleEngineDispatcher] 规则引擎执行失败:", err);
    }
};

/**
 * 从规则引擎返回的 mergedContext 中解析字段控制指令
 * 与 dynamicform useRuleEngine.parseFieldActions 逻辑一致
 */
const parseRuleEngineActions = (context: Record<string, any> = {}): Array<{
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
 * 与 controlFieldProps 保持一致的控制方式
 */
const applyRuleEngineActionsToFields = (
    props: any,
    actions: Array<{
        field: string;
        visible?: boolean;
        required?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        value?: any;
        options?: any[];
    }>,
    formData: Ref<Record<string, any>>,
) => {
    for (const action of actions) {
        // 显隐控制 - 与 eqHide/eqVisible 一致
        if (action.visible !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.formVisible = action.visible;
            });
        }
        // 必填控制 - 与 eqRequired 一致
        if (action.required !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.required = action.required;
            });
        }
        // 禁用控制 - 与 eqDisable 一致
        if (action.disabled !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.preps.disabled = action.disabled;
            });
        }
        // 只读控制
        if (action.readonly !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                field.preps.readonly = action.readonly;
            });
        }
        // 值赋值 - 与 fieldAssign 逻辑对齐
        if (action.value !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                const valueRecord: Record<string, string[]> = {
                    values: ["select", "autocomplete", "radio", "checkbox"],
                    data: ["tselect", "transfer"],
                    options: ["cascade"],
                };
                const itemType = field.itemType ?? field.type;
                let matched = false;
                for (const [key, types] of Object.entries(valueRecord)) {
                    if (types.includes(itemType)) {
                        field.preps[key] = action.value;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    unref(formData)[action.field] = action.value;
                }
            });
        }
        // 选项数据源赋值 - 用于 select/cascade/checkbox 等选项类字段的选项更新
        // 与数据源配置 preps.options 一致，由规则引擎动态下发
        if (action.options !== undefined) {
            forEachRelationField(props, action.field, (field) => {
                if (!field.preps) field.preps = {};
                field.preps.options = action.options;
            });
        }
    }
};

/**
 * 按钮点击触发的规则引擎调度器
 *
 * 当按钮字段配置了 ruleEngineConfig.formId 时触发。
 * 通过后端 executeByForm API 以 ON_BUTTON_CLICK 事件执行规则集，
 * 将结果应用到表单字段。
 *
 * 设计原则：不影响原有 buttonAction 的自定义代码、actions、selfFunc 逻辑。
 * 仅当按钮未配置 code 与 actions 且显式配置 ruleEngineConfig.formId 时启用。
 *
 * @param props 表单组件 props（context 即 props）
 * @param formData 表单数据（响应式）
 * @param evtName 按钮事件名（默认 click）
 */
const buttonRuleEngineDispatcher = async (
    props: any,
    formData: Ref<Record<string, any>>,
    evtName: string = "click",
) => {
    const field = props?.field;
    if (!field) return;

    const ruleEngineConfig =
        field.preps?.ruleEngineConfig || field.ruleEngineConfig || {};
    const formId = ruleEngineConfig.formId || props.formId || field.preps?.formId;
    const apiBasePath = ruleEngineConfig.apiBasePath || "/userdb/ruleEngine";

    if (!formId) {
        console.warn("[buttonRuleEngineDispatcher] formId 未配置，跳过规则引擎调用");
        return;
    }

    try {
        const currentFormData = unref(formData);
        // 注入按钮上下文，供后端规则匹配使用
        currentFormData.__buttonKey = field.fieldName;
        currentFormData.__buttonEvent = evtName;

        const res = await postRequest(
            `${apiBasePath}/executeByForm/${formId}?triggerEvent=ON_BUTTON_CLICK`,
            currentFormData,
        );

        const data = res?.data?.data;
        if (!data || !Array.isArray(data)) return;

        // 合并所有规则集的 mergedContext
        const merged: Record<string, any> = {};
        for (const rs of data) {
            if (rs.mergedContext) Object.assign(merged, rs.mergedContext);
        }

        // 解析字段控制指令并应用
        const fieldActions = parseRuleEngineActions(merged);
        applyRuleEngineActionsToFields(props, fieldActions, formData);
    } catch (err) {
        console.error("[buttonRuleEngineDispatcher] 规则引擎执行失败:", err);
    }
};

const relationEvent = (
    props: any,
    relationDetails: RelationDetail[],
    e: any,
    formData: Ref<Record<string, any>>,
    actionName: string,
) => {
    if (!Array.isArray(relationDetails)) {
        console.error(i18n("api.relationDetailsMustBeArray"), relationDetails);
        return;
    }

    // 预处理：对 visible/hide 类规则,先重置所有涉及的字段/容器为默认值
    // 并在后续遍历中跳过不匹配的规则,避免不匹配规则覆盖匹配规则设置的值
    // 场景：channel 切换时,多个渠道的 eqVisible 规则共享 content 等字段,
    //       需先全部重置,再只让匹配的规则设值(OR 逻辑)
    const visibleConditions = new Set(["eqVisible", "ruleVisible"]);
    const hideConditions = new Set(["eqHide", "ruleHide"]);
    const skipIfNotMatched = new Set([
        ...visibleConditions,
        ...hideConditions,
    ]);
    const visibleFieldNames = new Set<string>();
    const visibleContainerNames = new Set<string>();
    const hideFieldNames = new Set<string>();
    const hideContainerNames = new Set<string>();
    relationDetails.forEach((item: RelationDetail) => {
        if (!skipIfNotMatched.has(item.controlCondition)) return;
        const isContainer = item.controlTarget === "container";
        ensureArray(item.relationFields).forEach((name: string) => {
            if (visibleConditions.has(item.controlCondition)) {
                isContainer
                    ? visibleContainerNames.add(name)
                    : visibleFieldNames.add(name);
            } else {
                isContainer
                    ? hideContainerNames.add(name)
                    : hideFieldNames.add(name);
            }
        });
    });
    // visible 类:先设 false(默认隐藏,匹配后显示)
    visibleFieldNames.forEach((name) => {
        const field = findField(props, name);
        if (field) field.formVisible = false;
    });
    if (visibleContainerNames.size > 0) {
        findContainerItems(props, Array.from(visibleContainerNames)).forEach(
            (c) => {
                syncContainerVisibility(c, false);
            },
        );
    }
    // hide 类:先设 true(默认显示,匹配后隐藏)
    hideFieldNames.forEach((name) => {
        const field = findField(props, name);
        if (field) field.formVisible = true;
    });
    if (hideContainerNames.size > 0) {
        findContainerItems(props, Array.from(hideContainerNames)).forEach(
            (c) => {
                syncContainerVisibility(c, true);
            },
        );
    }

    relationDetails?.forEach(async (item: RelationDetail) => {
        const {controlCondition, relationFields} = item;
        if (!relationFields || item.isWorking) {
            return;
        }

        // 对 visible/hide 类规则,不匹配时跳过(预处理已设默认值,只让匹配规则生效)
        if (skipIfNotMatched.has(controlCondition)) {
            const matchResult = isMatch(
                item.matchType,
                ensureArray(item.matchFieldValue),
                e,
            );
            if (!matchResult) return;
        }

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
            // 规则引擎控制动作 - 复用 controlFieldProps 机制
            // eslint-disable-next-line no-fallthrough
            case "ruleHide":
            case "ruleVisible":
            case "ruleDisable":
            case "ruleEditable":
            case "ruleRequired":
            case "ruleUnRequired":
                // 容器项控制(target=container)走独立分支,与普通字段控制分离
                if (item.controlTarget === "container") {
                    controlContainerProps(props, item, e);
                } else {
                    controlFieldProps(props, item, e);
                }
                break;
            case "assignValue":
                assignValue(props, item, e);
                break;
            case "changeType":
                changeType(props, item, e);
                break;
            case "ruleEngine":
                // 规则引擎调度 - 调用后端 executeByForm API
                await ruleEngineDispatcher(props, item, e, formData);
                break;
            default:
                console.log(i18n("api.unhandledEvent") + controlCondition);
        }
        await nextTick();
        item.isWorking = false;
    });
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
            // 新增：规则引擎按钮点击触发
            // 仅当按钮显式配置 ruleEngineConfig.formId 时启用，
            // 不影响原有 selfFunc 兜底逻辑
            const ruleEngineConfig =
                field?.preps?.ruleEngineConfig || field?.ruleEngineConfig;
            if (ruleEngineConfig?.formId) {
                buttonRuleEngineDispatcher(context, formData, evtName);
                return;
            }
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
                        relationEventDispatcher(
                            props,
                            dataRelation,
                            val,
                            formData,
                            actionName,
                        );
                        stop();
                    }
                },
                {immediate: true},
            );
            return;
        }
        relationEventDispatcher(
            props,
            dataRelation,
            formData.value[props.field.fieldName],
            formData,
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
/**
 * 自定义事件
 * @param action
 * @param props
 * @param emits
 * @param formData
 */
const userActionEvent = (action: PreOrPendEventConfig, props: any, emits: any, formData: any) => {
    if (action.eventType === "custom") {
        buttonAction(props, emits, formData, action.customCode);
    } else if (action.eventType === "linkage" || action.eventType === "dataSource") {
        apiLinkageOperation(action.dataRelation?.apiLinkage, formData);
    } else if (action.eventType === "function") {
        action.funcInfo?.(props, formData, props.formInfo);
    } else {
        console.error("Unknown action: ", action);
    }
};
// ==================== 导出 ====================

export {
    allAction,
    buttonAction,
    buttonRuleEngineDispatcher,
    checkIsDisabled,
    initCompCallEvent,
    initRelationEvent,
    prepsFilter,
    relationEvent,
    relationEventDispatcher,
    ruleEngineDispatcher,
    parseRuleEngineActions,
    applyRuleEngineActionsToFields,
    useFormField,
    convertData,
    executeFormulaWithFill,
    initFormFormulaWatchers,
    setupFormulaWatchers,
    userActionEvent
};
