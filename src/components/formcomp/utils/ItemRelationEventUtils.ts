import {createCondition, dynamicUrlOperation, isJson,} from "@/api/star_horse_utils";
import {userFunction} from "@/api/user_func";
import {RelationDetail, SelectOption} from "@/components/types";
import piniaInstance from "@/store";
import {useDesignFormStore} from "@/store/DesignForm";
import {error} from "@/utils/message";
import {computed, nextTick, unref, watch} from "vue";
import JSON5 from "json5";

const designForm = useDesignFormStore(piniaInstance);

const isDesign = computed(() => designForm.isEdit);

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
    relationFields?.forEach(async (item: string) => {
        const field = props.formInfo?.find((field: any) => field.fieldName == item);
        if (field) {
            let flag = false;
            field.formVisible = true;
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
                    field.defaultValue = values;
                }
            }
        }
    });
};
/**
 * 数据关联
 * @param props 组件属性
 * @param item 关联关系详情
 * @param e 事件参数
 * @returns
 */
const dataLinkage = async (props: any, item: RelationDetail, e: any) => {
    let {relationFields, params, matchFieldValue} = item;

    if (!Array.isArray(matchFieldValue)) {
        matchFieldValue = matchFieldValue ? [matchFieldValue] : [];
    }
    if (matchFieldValue.length > 0 && !matchFieldValue.includes(e)) {
        return;
    }
    if (!Array.isArray(relationFields)) {
        relationFields = [relationFields];
    }

    const tempParams: any = JSON5.parse(JSON5.stringify(params));
    if (item.controlCondition == "asParamDataLinkage") {
        //输入值作为查询条件
        tempParams.queryParams = tempParams.queryParams || [];
        tempParams.queryParams.push(
            createCondition(item.matchFieldName, e, item.matchType),
        );
    }
    const resultData = await dynamicUrlOperation({
        preps: Object.assign({}, tempParams),
    });
    fieldAssign(props, relationFields, resultData);
};
const eqDisableOrEditable = (props: any, item: RelationDetail, e: any) => {
    let {relationFields, matchFieldValue} = item;
    if (!Array.isArray(matchFieldValue)) {
        matchFieldValue = matchFieldValue ? [matchFieldValue] : [];
    }
    if (!Array.isArray(relationFields)) {
        relationFields = [relationFields];
    }

    // 判断e是否匹配matchFieldValue，支持e为数组的情况
    const isMatch = () => {
        // 如果e是数组，检查数组中是否有任何元素与matchFieldValue中的元素匹配
        if (Array.isArray(e)) {
            return e.some(item => matchFieldValue.includes(item));
        }
        // 如果e是基本类型，直接检查是否包含
        return matchFieldValue.includes(e);
    };

    const matchResult = isMatch();

    relationFields?.forEach(async (sitem: string) => {
        const field = props.formInfo?.find(
            (field: any) => field.fieldName == sitem,
        );
        if (field) {
            if (!field.preps) {
                field.preps = {};
            }
            if (item.controlCondition == "eqHide") {
                field.formVisible = !matchResult;
            } else if (item.controlCondition == "eqVisible") {
                field.formVisible = matchResult;
            } else if (item.controlCondition == "eqEditable") {
                field.preps["disabled"] = !matchResult;
            } else if (item.controlCondition == "eqDisable") {
                field.preps["disabled"] = matchResult;
            } else if (item.controlCondition == "eqRequired") {
                field.required = matchResult;
            }
        }
    });
};
const assignValue = (props: any, item: RelationDetail, e: any) => {
    let {relationFields, staticDatas} = item;
    if (!Array.isArray(relationFields)) {
        relationFields = [relationFields];
    }
    fieldAssign(props, relationFields, staticDatas);
};
/**
 * 输入的值等于指定值时改变字段类型
 * @param props 组件属性
 * @param item 关联关系详情
 * @param e 事件参数
 * @returns
 */
const changeType = (props: any, item: RelationDetail, e: any) => {
    let {relationFields} = item;
    if (!Array.isArray(relationFields)) {
        relationFields = [relationFields];
    }
    relationFields?.forEach(async (sitem: string) => {
        const field = props.formInfo?.find(
            (field: any) => field.fieldName == sitem,
        );
        if (field) {
            field.itemType = item.staticDatas;
        }
    });
};
const relationEvent = (
    props: any,
    relationDetails: RelationDetail[],
    e: any,
    actionName: string,
) => {
    if (!Array.isArray(relationDetails)) {
        console.error("relationDetails 必须是数组类型", relationDetails);
        return;
    }
    relationDetails?.forEach(async (item: RelationDetail) => {
        let {controlCondition, relationFields, matchFieldValue} = item;
        if (!Array.isArray(matchFieldValue)) {
            matchFieldValue = matchFieldValue ? [matchFieldValue] : [];
        }
        if (!relationFields || item.isWorking) {
            return;
        }
        // item.isWorking = true;
        //处理连动
        switch (controlCondition) {
            //数据联动
            case "eqConditionDataLinkage":
            case "asParamDataLinkage":
                dataLinkage(props, item, e);
                break;
            case "eqDisable":
            case "eqHide":
            case "eqEditable":
            case "eqVisible":
            case "eqRequired":
                //输入的值等于指定值可编辑否则不可编辑
                eqDisableOrEditable(props, item, e);
                break;
            case "assignValue":
                //赋值
                assignValue(props, item, e);
                break;
            case "changeType":
                //输入的值等于指定值时改变字段类型
                changeType(props, item, e);
                break;
            default:
                console.log("未处理的事件：" + controlCondition);
        }
        await nextTick();
        item.isWorking = false;
    });
};
/**
 * 所有触发的事件
 * @param context
 * @param emits
 * @param formData
 * @param actionName
 * @param isInit
 */
const allAction = (
    context: any,
    emits: any,
    formData: any,
    actionName: string,
    isInit: boolean = false,
) => {
    const currentData = unref(formData);
    try {
        emits("selfFunc", actionName, currentData);
    } catch (e) {
        error("事件触发异常：" + e);
    }
    if (isDesign.value && isInit) {
        return;
    }
};
/**
 * Button 组件的点击事件
 * @param context
 * @param emits
 * @param formData
 * @param code
 * @param evtName 时间名称
 */
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
/**
 * 检查是否禁用
 * @param attrs
 */
const checkIsDisabled = (attrs: any) => {
    // const {attrs} = context;
    const {field} = attrs;
    const fieldName = field.fieldName;
    const isExplicitlyDisabled =
        attrs?.disabled || field.disabled || field.preps?.disabled;
    const eidtDidsabled =
        (attrs.editDisabled || field.editDisabled || field.preps?.editDisabled) &&
        field.preps?.starHorseFieldSource != 1;
    const isImplicitlyDisabled =
        !attrs?.formData?.[`_${fieldName}Editable`] && field?.preps?.disabled;
    return (
        eidtDidsabled === true ||
        isExplicitlyDisabled === true ||
        isImplicitlyDisabled === true
    );
};
const useFormField = (context: any, field: any) => {
    const fieldName = computed(() => field.fieldName);
    const updateFormData = (value: any) => {
        const newData = context.attrs.formData;
        newData[fieldName.value] = value;
        // context.emit('form-data-update', newData);
    };

    return {
        fieldValue: computed({
            get: () => context.attrs.formData[fieldName.value],
            set: updateFormData,
        }),
    };
};
const initRelationEvent = (props: any, formData: any, needWatch?: boolean) => {
    //联动事件
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
    // 新增数据检查
    if (
        !props.isSearch &&
        !props.field.preps?.["stopInitCallAction"] &&
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
    if (props.field.preps?.["starHorseFieldSource"] == 5) {
        return;
    }
    events?.forEach((event) => {
        allAction(props, emits, unref(formData), event, true);
    });
};
const isNaN = (value: any) => {
    return value !== value;
};
const isReadOnly = (obj, prop) => {
    // 获取属性描述符
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

    // 如果属性不存在，返回false
    if (!descriptor) return false;

    // writable为false表示只读
    return descriptor.writable === false;
};
const prepsFilter = (preps: any) => {
    if (!preps || Object.keys(preps).length == 0) return {};

    //删除undefined,null,空字符串
    Object.keys(preps).forEach((key) => {
        const prep = preps[key];
        if ((prep === undefined || prep === null || prep === "" || isNaN(prep)) && !isReadOnly(preps, key)) {
            delete preps[key];
        }
        if (prep == "false" || prep == "true") {
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
            return [];
        }
    }
    return data;
};
export {
    allAction,
    buttonAction,
    checkIsDisabled,
    initCompCallEvent,
    prepsFilter,
    relationEvent,
    useFormField,
    convertData
};
