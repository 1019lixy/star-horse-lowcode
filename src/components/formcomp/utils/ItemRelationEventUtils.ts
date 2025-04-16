import {error} from "@/utils/message.ts";
import {userFunction} from "@/api/user_func.ts";
import {compDynamicData} from "@/api/star_horse_utils.ts";
import piniaInstance from "@/store";
import {useSelfOperationStore} from "@/store/SelfOperation.ts";
import {useDesignFormStore} from "@/store/DesignForm.ts";
import {computed} from "vue";
import {SelectOption} from "@/components/types";

const designForm = useDesignFormStore(piniaInstance);
const userOperation = useSelfOperationStore(piniaInstance);

const isDesign = computed(() => designForm.isEdit);
/**
 * Change 事件
 * @param context
 */
const change = (context: any) => {
    const field = context.attrs["field"] as any;
    const relation = field.preps?.dataRelation;
    operationRelation(relation, "change", context.attrs["formData"], field.preps["name"]);
};
/**
 * Input 事件
 * @param context
 */
const input = (context: any) => {
    const field = context.attrs["field"] as any;
    const relation = field.preps?.dataRelation;
    operationRelation(relation, "input", context.attrs["formData"], field.preps["name"]);
};
/**
 * Focus 事件
 * @param context
 */
const focus = (context: any) => {
    const field = context.attrs["field"] as any;
    const relation = field.preps?.dataRelation;
    operationRelation(relation, "focus", context.attrs["formData"], field.preps["name"]);
};
/**
 * Blur 事件
 * @param context
 */
const blur = (context: any) => {
    const field = context.attrs["field"] as any;
    const relation = field.preps?.dataRelation;
    operationRelation(relation, "blur", context.attrs["formData"], field.preps["name"]);
};
/**
 * Enter 事件
 * @param context
 */
const mouseEnter = (context: any) => {
    const field = context.attrs["field"] as any;
    const relation = field.preps?.dataRelation;
    operationRelation(relation, "enter", context.attrs["formData"], field.preps["name"]);
};

/**
 * 操作关联关系
 * @param relation
 * @param actionName
 * @param formData
 * @param currentName
 */
const operationRelation = async (relation: any, actionName: string, formData: any, currentName: string) => {
    if (!relation || actionName != relation.actionName) {
        return;
    }
    const relations: Array<any> = relation?.relationDetails;
    const currentVal = formData[currentName];
    if (!relations || relations.length == 0) {
        return;
    }
    for (const index in relations) {
        const temp = relations[index];
        const conditon: string = temp.controlCondition;
        const fieldName: string = temp.relationFields;
        if (!conditon || !fieldName) {
            continue;
        }
        const field = userOperation.getFormItem(fieldName);
        const params: any = temp.params;
        //数据联动
        if (conditon == "dataLinkage") {
            formData[fieldName + "OptionList"] = await compDynamicData(temp);
        } else if (conditon == "eqDisable" || conditon == "eqDisableOrEditable") {
            //输入的值等于指定值隐藏否则显示
            formData["_" + fieldName + "Editable"] = !(currentVal == params);
        } else if (conditon == "eqEditable" || conditon == "eqEditableOrDisable") {
            //输入的值等于指定值显示否则隐藏
            formData["_" + fieldName + "Editable"] = currentVal == params;
        } else if (conditon == "assignValue") {
            //输入的值等于指定值时赋予新值
            if (
                field.itemType == "select" ||
                field.itemType == "tselect" ||
                field.itemType == "autocomplete" ||
                field.itemType == "cascade"
            ) {
                field.preps.values = JSON.parse(params);
            } else {
                formData[field.name] = params;
            }
        } else if (conditon == "changeType") {
            //输入的值等于指定值时改变字段类型
            field.itemType = params;
        }
    }
};
/**
 * 所有触发的事件
 * @param context
 * @param actionName
 * @param isInit
 */
const allAction = (context: any, actionName: string, isInit: boolean = false) => {
    //设计时的初始化不作处理
    const field = context.attrs["field"] as any;
    if (!isInit && actionName != "normal") {
        try {
            context.emit("selfFunc", actionName, context.attrs["formData"]);
        } catch (e) {
            error("事件触发异常：" + e);
        }
    }
    if ((isDesign.value && isInit) || actionName == "normal") {
        return;
    }
    const tempName = field.preps?.actionName;
    //如果没有设置事件则不处理
    // if (actionName != tempName) {
    //     return;
    // }
    //处理连动
    switch (actionName) {
        case "change":
            change(context);
            break;
        case "input":
            input(context);
            break;
        case "focus":
            focus(context);
            break;
        case "blur":
            blur(context);
            break;
        case "enter":
        case "keydown.enter":
            mouseEnter(context);
            break;
        default:
            console.log("不支持的事件：" + actionName);
            return;
    }

    if (actionName == "input" && actionName != tempName) {
        return;
    }
    //处理自定义响应事件
    if (actionName == field.preps["actionName"] && field.preps["actionRelation"]) {
        field.preps["actionRelation"](context.attrs["formData"][field.preps["name"]], context.attrs["formData"]["xh"]);
    }
};
/**
 * Button 组件的点击事件
 * @param context
 * @param code
 */
const buttonAction = (context: any, code: string) => {
    if (code) {
        userFunction(code, context);
    } else {
        const field = context.attrs["field"] as any;
        context.attrs["formData"]["starHorseBtnName"] = field.preps["name"];
        if (field.preps["actions"]) {
            field.preps["actions"](context.attrs["formData"]);
        }
        context.emit("selfFunc", context.attrs["formData"]);
    }
};
export {allAction, buttonAction};
