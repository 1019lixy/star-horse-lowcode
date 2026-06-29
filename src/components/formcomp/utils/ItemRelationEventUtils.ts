import {closeLoad, createCondition, dynamicUrlOperation, isJson, load,} from "@/api/star_horse_utils";
import {userFunction} from "@/api/user_func";
import {ApiLinkageDetail, ItemRelation, RelationDetail, SelectOption,} from "@/components/types";
import {error, warning} from "@/utils/message";
import {i18n} from "@/lang";
import {computed, nextTick, Ref, unref, watch} from "vue";
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
            if (result?.code) {
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
    relationDetails?.forEach(async (item: RelationDetail) => {
        const {controlCondition, relationFields} = item;
        if (!relationFields || item.isWorking) {
            return;
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
                controlFieldProps(props, item, e);
                break;
            case "assignValue":
                assignValue(props, item, e);
                break;
            case "changeType":
                changeType(props, item, e);
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
        relationEvent(
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
const userActionEvent = (action: PreOrPendEventConfig,props:any,emits:any,formData:any) => {
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
    checkIsDisabled,
    initCompCallEvent,
    prepsFilter,
    relationEvent,
    relationEventDispatcher,
    useFormField,
    convertData,
    executeFormulaWithFill,
    initFormFormulaWatchers,
    setupFormulaWatchers,
    userActionEvent
};
