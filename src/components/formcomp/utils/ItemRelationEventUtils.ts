import { error } from "@/utils/message";
import { userFunction } from "@/api/user_func";
import { compDynamicData } from "@/api/star_horse_utils";
import piniaInstance from "@/store";
import { useSelfOperationStore } from "@/store/SelfOperation";
import { useDesignFormStore } from "@/store/DesignForm";
import { computed, isRef, unref, watch } from "vue";
import { RelationDetail } from "@/components/types";

const designForm = useDesignFormStore(piniaInstance);
const userOperation = useSelfOperationStore(piniaInstance);

const isDesign = computed(() => designForm.isEdit);
/**
 * Change 事件
 * @param context
 * @param formData
 */
const change = (context: any, formData: any) => {
  const field = context.field as any;
  const relation = field.preps?.dataRelation;
  operationRelation(relation, "change", formData, field.fieldName);
};
/**
 * Input 事件
 * @param context
 * @param formData
 */
const input = (context: any, formData: any) => {
  const field = context.field as any;
  const relation = field.preps?.dataRelation;
  operationRelation(relation, "input", formData, field.fieldName);
};
/**
 * Focus 事件
 * @param context
 * @param formData
 */
const focus = (context: any, formData: any) => {
  const field = context.field as any;
  const relation = field.preps?.dataRelation;
  operationRelation(relation, "focus", formData, field.fieldName);
};
/**
 * Blur 事件
 * @param context
 * @param formData
 */
const blur = (context: any, formData: any) => {
  const field = context.field as any;
  const relation = field.preps?.dataRelation;
  operationRelation(relation, "blur", formData, field.fieldName);
};
/**
 * Enter 事件
 * @param context
 * @param formData
 */
const mouseEnter = (context: any, formData: any) => {
  const field = context.field as any;
  const relation = field.preps?.dataRelation;
  operationRelation(relation, "enter", formData, field.fieldName);
};

/**
 * 操作关联关系
 * @param relation
 * @param actionName
 * @param formData
 * @param currentName
 */
const operationRelation = async (
  relation: any,
  actionName: string,
  formData: any,
  currentName: string,
) => {
  if (!relation || actionName != relation.actionName) {
    return;
  }
  const relations: Array<RelationDetail> = relation?.relationDetails;
  const currentVal = formData[currentName];
  if (!relations || relations.length == 0) {
    return;
  }
  for (const index in relations) {
    const temp = relations[index];
    const conditon: string = temp.controlCondition;
    const fieldName: string | Array<string> = temp.relationFields;
    if (!conditon || !fieldName) {
      continue;
    }
    const field = userOperation.getFormItem(fieldName);
    const params: any = temp.params;
    //数据联动
    if (conditon == "dataLinkage") {
      formData[fieldName + "OptionList"] = await compDynamicData({
        preps: temp,
      });
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
        formData[field.fieldName] = params;
      }
    } else if (conditon == "changeType") {
      //输入的值等于指定值时改变字段类型
      field.itemType = params;
    }
  }
};

const dataLinkage =async (
  props: any,
  relationFields: string | Array<string>,
  matchType: string,
  params: any,
  relationDetailsDefaultValue: any,
  e: any,
) => {
  if (!relationFields) {
    return;
  }
  if (!Array.isArray(relationFields)) {
    relationFields = [relationFields];
  }
  relationFields?.forEach((item: string) => {
    const field = props.formInfo?.find((field: any) => field.fieldName == item);
    if (field) {
      field.preps["values"] = [
        { name: "静态1", value: "1" },
        { name: "静态2", value: "2" },
      ];
      field.preps["disabled"] = params == e;
    }
  });
};

const relationEvent = (
  props: any,
  relationDetails: RelationDetail[],
  e: any,
  actionName: string,
) => {
  relationDetails?.forEach((item: RelationDetail) => {
    const {
      controlCondition,
      relationFields,
      matchType,
      params,
      relationDetailsDefaultValue,
    } = item;
    //处理连动
    switch (controlCondition) {
      //数据联动
      case "dataLinkage":
        dataLinkage(
          props,
          relationFields,
          matchType,
          params,
          relationDetailsDefaultValue,
          e,
        );
        break;
      case "eqDisable":
      case "eqDisableOrEditable":
        //输入的值等于指定值隐藏否则显示
        break;
      case "eqEditable":
      case "eqEditableOrDisable":
        //编辑时输入的值等于指定值显示否则隐藏
        break;
      case "assignValue":
        //赋值
        break;
      case "changeType":
         //输入的值等于指定值时改变字段类型
         break;
         default:

    }
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
  //设计时的初始化不作处理
  // const field = context.field as any;
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
  const currentData = isRef(formData) ? formData.value : formData;
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
  const { field } = attrs;
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
            stop();
          }
        },
        { immediate: true },
      );
      return;
    }
    doInitCallEvent(props, emits, formData);
  }
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

const prepsFilter = (preps: any) => {
  if (!preps || Object.keys(preps).length == 0) return {};
  //删除undefined,null,空字符串
  Object.keys(preps).forEach((key) => {
    if (preps[key] === undefined || preps[key] === null || preps[key] === "") {
      delete preps[key];
    }
    if (preps[key] == "false" || preps[key] == "true") {
      preps[key] = Boolean(preps[key]);
    }
  });

  return preps;
};
export {
  allAction,
  buttonAction,
  checkIsDisabled,
  useFormField,
  initCompCallEvent,
  prepsFilter,
  relationEvent,
};
