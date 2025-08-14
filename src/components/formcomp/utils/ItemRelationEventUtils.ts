import { createCondition, dynamicUrlOperation } from "@/api/star_horse_utils";
import { userFunction } from "@/api/user_func";
import { RelationDetail } from "@/components/types";
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/DesignForm";
import { error } from "@/utils/message";
import { computed, unref, watch } from "vue";

const designForm = useDesignFormStore(piniaInstance);

const isDesign = computed(() => designForm.isEdit);

const fieldAssign = (
  props: any,
  relationFields: Array<string>,
  values: any,
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
      Object.entries(record).forEach(([key, value]) => {
        if (value.includes(field.itemType ?? field.type)) {
          field.preps[key] = values;
          flag = true;
          return false;
        }
      });
      if (!flag) {
        field.defaultValue = values;
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
  let { relationFields, params } = item;
  if (!relationFields) {
    return;
  }
  if (!Array.isArray(relationFields)) {
    relationFields = [relationFields];
  }
  const tempParams = { ...params };
  tempParams.queryParams = tempParams.queryParams || [];
  tempParams.queryParams.push(
    createCondition(item.matchFieldName, e, item.matchType),
  );
  const resultData = await dynamicUrlOperation({
    preps: {
      ...tempParams,
    },
  });
  fieldAssign(props, relationFields, resultData);
};
const eqDisableOrEditable = (
  props: any,
  item: RelationDetail,
  e: any,
  isEq: boolean,
) => {
  let { relationFields, params } = item;
  if (!relationFields) {
    return;
  }
  if (!Array.isArray(relationFields)) {
    relationFields = [relationFields];
  }
  relationFields?.forEach(async (item: string) => {
    const field = props.formInfo?.find((field: any) => field.fieldName == item);
    if (field) {
      field.formVisible = isEq ? params != e : params == e;
    }
  });
};
const assignValue = (props: any, item: RelationDetail, e: any) => {
  let { relationFields, relationDetailsDefaultValue } = item;
  if (!relationFields) {
    return;
  }
  if (!Array.isArray(relationFields)) {
    relationFields = [relationFields];
  }
  fieldAssign(props, relationFields, relationDetailsDefaultValue);
};
const changeType = (props: any, item: RelationDetail, e: any) => {
  let { relationFields, params } = item;
  if (!relationFields) {
    return;
  }
  if (!Array.isArray(relationFields)) {
    relationFields = [relationFields];
  }
  relationFields?.forEach(async (item: string) => {
    const field = props.formInfo?.find((field: any) => field.fieldName == item);
    if (field) {
      field.itemType = params;
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
    const { controlCondition } = item;
    //处理连动
    switch (controlCondition) {
      //数据联动
      case "dataLinkage":
        dataLinkage(props, item, e);
        break;
      case "eqDisable":
      case "eqDisableOrEditable":
        //输入的值等于指定值隐藏否则显示
        eqDisableOrEditable(props, item, e, true);
        break;
      case "eqEditable":
      case "eqEditableOrDisable":
        //编辑时输入的值等于指定值显示否则隐藏
        eqDisableOrEditable(props, item, e, false);
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
const initRelationEvent = (props: any, formData: any) => {
  //联动事件
  const dataRelation = props.field.preps?.dataRelation;
  const actionName = dataRelation?.actionName;

  if (actionName) {
    if (
      Object.keys(formData.value || {}).length == 0 ||
      !formData.value[props.field.fieldName]
    ) {
      const stop = watch(
        () => formData.value[props.field.fieldName],
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
        { immediate: true },
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
            initRelationEvent(props, val);
            stop();
          }
        },
        { immediate: true },
      );
      return;
    }
    doInitCallEvent(props, emits, formData);
  }
  initRelationEvent(props, formData);
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
  initCompCallEvent,
  prepsFilter,
  relationEvent,
  useFormField,
};
