<script setup lang="ts" name="StarHorseForm">
import {loadById, postRequest} from "@/api/star_horse_apis";
import {closeLoad, formFieldMapping, isJson, load,} from "@/api/star_horse_utils";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ApiUrls} from "@/components/types/ApiUrls";
import {DialogProps} from "@/components/types/DialogProps";
import {FieldInfo, PageFieldInfo} from "@/components/types/PageFieldInfo";
import {SelectOption} from "@/components/types/SearchProps";
import {error, success, warning} from "@/utils/message";
import {i18n} from "@/lang";
import {
  computed,
  ComputedRef,
  inject,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  PropType,
  provide,
  ref,
  shallowRef,
  unref,
  watch,
} from "vue";
import {isMobile} from "@/api/device";
import {convertPcCompToFitPlatformComps, ensureFieldIds,} from "@/api/form_utils";
import {registerFormFieldsRef} from "@/components/formcomp/utils/ItemRuleEventUtils";

const props = defineProps({
  apiEndpoints: {type: Object as PropType<ApiUrls>},
  fieldList: {type: Object as PropType<PageFieldInfo>, required: true},
  subTableName: {type: String, default: "subDataList"},

  outerFormData: {type: Object as PropType<any>},
  primaryKey: {type: [String, Object] as PropType<string | any>},
  globalCondition: {type: Object},
  rules: {type: Object},
  formSize: {type: String, default: "default"},
  labelPosition: {type: String, default: "left"},
  typeModel: {type: String},
  dynamicForm: {type: Boolean, default: false},
  preview: {type: Boolean, default: false},
  dialogType: {type: String as () => "dialog" | "drawer"},
  formInfo: {type: Object as PropType<any>},
  bindWorkFlowId: {type: String, default: ""},
  //未显式指定 containerType 的字段默认容器类型："descriptions"(默认)包装为描述容器，"none" 保持旧 box/other 裸布局
  defaultContainerType: {type: String, default: "descriptions"},
  //重置表单是否清空禁用数据
  resetFormClearDisableData: {type: Boolean, default: false},
  selectData: {
    type: Array<SelectOption>,
    default: () => {
      return [
        {name: i18n("comp.normal"), value: "1"},
        {name: i18n("comp.disabled"), value: "2"},
      ];
    },
  },
});
// let userOperation = useSelfOperationStore(piniaInstance);
//刷新事件，数据已加载事件，导出数据更新数据
const emits = defineEmits([
  "refresh",
  "dataLoaded",
  "exportData",
  "removeRow",
  "addRow",
  "inited",
  "beforeSubmit",
]);
const starHorseFormRef = ref(null);
const dataForm = ref<any>({});
// source:{type:Number,default:1},
const source = ref<number>(1);
// 渲染前为字段补充稳定 id，避免 key 变化导致字段组件重复挂载/重复初始化
watch(
    () => props.fieldList,
    (val) => ensureFieldIds(val),
    {immediate: true},
);
const platformFields: ComputedRef = computed(() =>
    convertPcCompToFitPlatformComps(props.fieldList)
);
const mappingFields = computed(() => formFieldMapping(unref(platformFields)));
//更新外面传进来的数据

const exportData = () => {
  emits("exportData", dataForm.value);
};
//向外实时导出数据

const closeDialog = inject("closeDialog") as Function;
let dialogOperation = inject("dialogOperation") as any;
const dialogProps = inject<DialogProps>("dialogProps", {});
const formFields = shallowRef<Array<FieldInfo>>([]);
provide("formFields", formFields);
provide("formInfo", props.formInfo);
provide("bindWorkFlowId", props.bindWorkFlowId);
provide("defaultContainerType", props.defaultContainerType);
// 暴露 el-form 实例给嵌套组件（如 stepItem），用于调用 validateField / clearValidate
provide("starHorseFormRef", starHorseFormRef);
const loadData = async () => {
  if (!props.apiEndpoints || !props.apiEndpoints?.loadByIdUrl || !dialogProps?.ids) {
    return;
  }
  await nextTick();
  if (props.preview) {
    dataForm.value = {...dialogProps?.ids};
    return;
  }
  let ids = dialogProps?.ids;
  if (!ids) return;
  let id = Array.isArray(ids) ? ids[0] : ids;
  let objData;
  let params = props.globalCondition || {};
  //如果是Json 对象
  if (isJson(id)) {
    params = {...params, ...id};
    objData = await loadById(props.apiEndpoints?.loadByIdUrl!, "", params);
  } else {
    objData = await loadById(props.apiEndpoints?.loadByIdUrl!, id, params);
  }
  let data = unref(mappingFields);
  dataForm.value = objData;
  //如果是动态表单
  if (props.dynamicForm) {
    for (let i in params) {
      let temp = params[i];
      if (!temp.subTabFlag) {
        let subTemp = {...objData};
        delete subTemp[temp.tableName];
        dataForm.value[temp.tableName] = [subTemp];
      }
    }
  }
  let mapping = data?.mappingFields;
  if (mapping) {
    for (let index in mapping) {
      let temp = mapping[index];
      if (!Object.keys(objData || {}).includes(temp?.name)) {
        dataForm.value[temp?.name] = dataForm.value[temp?.alias];
      }
    }
  }
  let actions = data?.actions;
  if (actions?.length > 0) {
    for (let index in actions) {
      let temp = actions[index];
      if (temp?.actionNames == "change") {
        temp.actions?.["change"]?.(objData);
      }
    }
  }
  nextTick(() => {
    emits("dataLoaded", objData);
    checkActionRelation();
  });
};
/**
 * 加载了数据，检查是否有数据联动的相关方法
 */
const checkActionRelation = () => {
  for (let key in formFields) {
    let temp = formFields[key];
    let preps = temp?.preps;

    if (preps?.actions) {
      temp.preps["actions"](dataForm.value);
    }
  }
};
const merge = (type: string) => {
  starHorseFormRef.value?.validate((result: boolean) => {
    if (!result) {
      return;
    }
    // 触发 beforeSubmit 事件，允许外部（如规则引擎）在提交前校验
    // 如果事件处理器返回 false 则阻止提交
    emits("beforeSubmit", {type, formData: dataForm.value});
    // Vue emits 是同步的，如果需要异步拦截，请使用 doMerge 前手动调用 triggerOnSubmit

    doMerge(type);
  });
};
/**
 * 对状态名称赋值
 */
const assignStatusName = () => {
  if (dataForm.value.statusCode) {
    let sData = props.selectData?.find(
        (item: any) => item.value === dataForm.value.statusCode,
    );
    if (sData) {
      dataForm.value["statusName"] = sData.name;
    }
  }
  const _pf: any = unref(platformFields);
  let batchFields = Array.isArray(_pf?.containerFields)
      ? _pf.containerFields.filter((c: any) => c?.containerType === "table")
      : [];
  batchFields?.forEach((item: any) => {
    const batchKey = item.subTablePrimaryKey;
    if (dataForm.value[batchKey]) {
      for (let index = 0; index < dataForm.value[batchKey]?.length; index++) {
        let temp = dataForm.value[batchKey][index];
        let sData = props.selectData?.find(
            (sitem: any) => sitem.value === temp.statusCode,
        );
        if (sData) {
          dataForm.value[batchKey][index]["statusName"] = sData.name;
        }
      }
    }
  });
};
const mergeDraft = (type: string) => {
  doMerge(type);
};

const analysisSameToParentField = (): Array<string> => {
  let subTableName: Array<string> = [];
  const _pf2: any = unref(platformFields);
  let batchFields = Array.isArray(_pf2?.containerFields)
      ? _pf2.containerFields.filter((c: any) => c?.containerType === "table")
      : [];
  const analysis = (batchFields: any[]) => {
    batchFields?.forEach((item: any) => {
      if (
          false === item.subFormFlag ||
          "n" == item.subFormFlag?.toString()?.toLowerCase()
      ) {
        subTableName.push(item.subTablePrimaryKey);
      }
    });
  };
  //单独定义的批量属性
  analysis(batchFields);
  //嵌入fieldList里的批量属性
  let fieldList = unref(platformFields)?.fieldList || [];
  const arrayFieldList = (fieldList: FieldInfo[]) => {
    for (let index in fieldList) {
      let temp: any = fieldList[index];
      if (Array.isArray(temp)) {
        arrayFieldList(temp);
      } else if (
          Array.isArray(temp.containerFields) &&
          temp.containerFields.some((c: any) => c?.containerType === "table")
      ) {
        analysis(
            temp.containerFields.filter((c: any) => c?.containerType === "table"),
        );
      } else if (temp.appList) {
        analysis(temp.appList);
      }
    }
  };
  arrayFieldList(fieldList);
  return subTableName;
};
/**
 * 数据提交结果处理
 * @param type
 * @param formData
 * @param res
 */
const mergeResult = (type: string, formData: any, res: any) => {
  emits("refresh", formData, res?.data);
  resetForm();
  if (type == "close") {
    closeDialog();
  }
  if (dialogProps) {
    dialogProps.ids = -1;
  }
};
const doMerge = (type: string) => {
  assignStatusName();
  let tempForm: any = [];
  let tempDatas = {...dataForm.value};
  let mergeUrl = props.apiEndpoints?.mergeUrl;
  let flag = true;
  //单独批量数据和嵌入fieldList 里的批量数据
  //原则上只支持1个批量表格，多个存在数据对称问题
  let sameBatchNames = analysisSameToParentField();
  if (sameBatchNames?.length > 0) {
    flag = false;
    mergeUrl = props.apiEndpoints?.batchMergeUrl;
    tempForm = [];
    sameBatchNames.forEach((subTableName: string) => {
      let batchDatas = tempDatas[subTableName];
      delete tempDatas[subTableName];
      for (let i in batchDatas) {
        //保留第一条数据的ID
        if (parseInt(i) > 0) {
          delete tempDatas[props.primaryKey];
        }
        tempForm.push({...tempDatas, ...batchDatas[i]});
      }
    });
  }
  let dydata: any = {
    relationTables: props.globalCondition,
  };
  //props.globalCondition 有属性不是子表，需要额外封装

  if (flag) {
    tempForm = dataForm.value;
    dydata["dataMap"] = tempForm;
  } else {
    dydata["dataListsMap"] = tempForm;
  }
  // console.log(sameBatchNames, tempForm, dydata);
  load(i18n("comp.dataProcessing"));
  //dynamicForm 如果为true 表示动态表单，动态表单需额外封装数据对象
  let formData = props.dynamicForm ? dydata : tempForm;
  if (props.preview) {
    closeLoad();
    mergeResult(type, formData, {
      data: {
        code: 0,
        cnMessage: "Ok",
      },
    });
  } else {
    postRequest(mergeUrl!, formData)
        .then((res) => {
          closeLoad();
          if (res?.data?.code != 200) {
            warning(res?.data?.cnMessage);
            return;
          } else {
            success(res?.data?.cnMessage);
          }
          mergeResult(type, formData, res);
          //关闭弹窗
        })
        .catch((err) => {
          error(i18n("comp.interfaceCallException") + err);
        })
        .finally(() => {
          closeLoad();
        });
  }
};
/** 宽松布尔判断：兼容 true / 1 / "1" / "true" 的字段配置写法 */
const isTruthyDisabled = (v: any): boolean =>
    v === true || v === 1 || v === "1" || v === "true";

/**
 * 收集所有 disabled / editDisabled 字段：返回「需保留的值快照」和「需恢复的禁用标志」。
 * 遍历真实字段配置(props.fieldList)，涵盖嵌套容器/兄弟节点/children/appList，
 * 并递归恢复 field.disabled / field.preps?.disabled，避免重置后禁用状态被解除。
 */
const collectDisabledInfo = (): {
  valueSnapshot: Record<string, any>;
  disabledRestore: Array<{ f: any; viaPreps: boolean }>;
} => {
  const valueSnapshot: Record<string, any> = {};
  const disabledRestore: Array<{ f: any; viaPreps: boolean }> = [];
  const walk = (f: any) => {
    if (!f || typeof f !== "object") return;
    const disabled = isTruthyDisabled(f.disabled) || isTruthyDisabled(f.preps?.disabled);
    const editDisabled =
        (isTruthyDisabled(f.editDisabled) || isTruthyDisabled(f.preps?.editDisabled)) &&
        f.preps?.starHorseFieldSource != 1;
    // 只读/查看模式(source=3)字段数据须保留：stepItem 只读段位经 segSource 传 source=3，
    // StarHorseItem init 时写入 preps.starHorseFieldSource=3，重置时不应清空其已填写数据
    const readOnlySource = f.preps?.starHorseFieldSource == 3;
    if ((disabled || editDisabled || readOnlySource) && f.fieldName) {
      if (dataForm.value[f.fieldName] !== undefined) {
        valueSnapshot[f.fieldName] = dataForm.value[f.fieldName];
      }
      if (isTruthyDisabled(f.disabled)) {
        disabledRestore.push({f, viaPreps: false});
      } else if (isTruthyDisabled(f.preps?.disabled)) {
        disabledRestore.push({f, viaPreps: true});
      }
    }
    for (const key of ["containerFields", "brotherNodes", "fieldList", "children", "appList"]) {
      const sub = f[key];
      if (Array.isArray(sub)) {
        for (const c of sub) {
          if (Array.isArray(c)) c.forEach((x) => walk(x));
          else walk(c);
        }
      }
    }
  };
  const root: any = unref(platformFields);
  walk(root);
  return {valueSnapshot, disabledRestore};
};

// 重置时需保留的系统关键字：流程当前阶段(后端驱动)与前端持久化阶段 key
// starHorseCurrentStep: 后端返回的当前流程阶段，编辑回显时驱动步骤定位
// __currentStepKey: 前端持久化的当前阶段 key，提交时告知后端当前段
const SYSTEM_PRESERVE_KEYS = ["starHorseCurrentStep", "__currentStepKey"];

const resetForm = () => {
  // 默认(resetFormClearDisableData=false)保留禁用字段数据并恢复其禁用状态
  const preserve = !props.resetFormClearDisableData;
  const {valueSnapshot, disabledRestore} = preserve
      ? collectDisabledInfo()
      : {valueSnapshot: {}, disabledRestore: [] as Array<{f: any; viaPreps: boolean}>};
  // 快照系统关键字，避免重置后丢失流程步骤信息导致流程回退到第一段
  const systemSnapshot: Record<string, any> = {};
  for (const k of SYSTEM_PRESERVE_KEYS) {
    if (dataForm.value[k] !== undefined) {
      systemSnapshot[k] = dataForm.value[k];
    }
  }
  dataForm.value = {};
  dataForm.value = {...unref(mappingFields)?.defaultDatas};
  let data = unref(props.outerFormData);
  if (Object.keys(data || {}).length > 0) {
    Object.assign(dataForm.value, data);
  }
  // 恢复禁用字段原值
  Object.assign(dataForm.value, valueSnapshot);
  // 恢复系统关键字
  Object.assign(dataForm.value, systemSnapshot);
  // 恢复禁用标志，防止联动规则基于清空后的值解除禁用
  for (const {f, viaPreps} of disabledRestore) {
    if (!f.preps) f.preps = {};
    if (viaPreps) f.preps.disabled = true;
    else f.disabled = true;
  }
};
/**
 * 返回表单数据
 */
const getFormData = () => {
  return dataForm;
};
const getFormFields = () => {
  return starHorseFormRef.value?.fields;
};
const getFields = () => {
  return formFields.value;
};
const validate = async () => {
  return await starHorseFormRef.value?.validate();
};
/**
 * 设置表单数据
 * @param data
 */
const setFormData = (data: any) => {
  let defaultDatas = unref(mappingFields)?.defaultDatas;
  Object.assign(dataForm.value, defaultDatas, data);
};
const setSource = (dataSource: number) => {
  source.value = dataSource;
};
/**
 * 更新数据
 * @param data
 */
const updateFormData = (data: any) => {
  Object.assign(dataForm.value, data);
};
/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};
/**
 * 记录当前表单的信息
 */
const recordFieldInfo = async () => {
  formFields.value = unref(mappingFields)?.formFields;
  registerFormFieldsRef(formFields.value, formFields);
  await nextTick();
  emits("inited");
};
const tableListRef = ref<any>([]);
onActivated(() => {
  recordFieldInfo();
});
onDeactivated(() => {
});
onBeforeUnmount(() => {
});
onMounted(() => {
  recordFieldInfo();
});
watch(
    () => dataForm.value,
    () => {
      exportData();
    },
    {immediate: false},
);
watch(
    () => props.outerFormData,
    (val: any) => {
      if (val) {
        resetForm();
      }
    },
    {immediate: true},
);
watch(
    () => dialogOperation?.funcName,
    (funcName: string) => {
      if (!funcName) return;
      const type = dialogOperation?.type;
      const handlers: any = {
        merge: () => merge(type),
        mergeDraft: () => mergeDraft(type),
        resetForm: () => resetForm(),
      };
      handlers[funcName]?.();
      dialogOperation.funcName = "";
      dialogOperation.type = "";
    },
);
watch(
    () => dialogProps.ids,
    (val) => {
      if (val == -1) {
        source.value = 1;
        setFormData(dataForm.value);
      } else if (val && val !== "") {
        source.value = 2;
        loadData();
      }
    },
    {
      immediate: true,
      deep: false,
    },
);

/**
 * 应用规则引擎执行结果到表单字段
 * 供 dynamicform 的 useFormRuleRuntime 调用
 * @param actions 字段控制指令列表
 */
const ruleEngineApply = (
    actions: Array<{
      field: string;
      visible?: boolean;
      required?: boolean;
      readonly?: boolean;
      disabled?: boolean;
      value?: any;
    }>,
) => {
  if (!actions || !actions.length) return;
  for (const action of actions) {
    // 在 formFields 中查找目标字段
    const findAndApply = (fields: any[]) => {
      for (const field of fields) {
        if (field.fieldName === action.field) {
          if (!field.preps) field.preps = {};
          if (action.visible !== undefined) field.formVisible = action.visible;
          if (action.required !== undefined) field.required = action.required;
          if (action.disabled !== undefined)
            field.preps.disabled = action.disabled;
          if (action.readonly !== undefined)
            field.preps.readonly = action.readonly;
          if (action.value !== undefined) {
            // 值赋值到 dataForm
            dataForm.value[action.field] = action.value;
          }
          return true;
        }
        if (field.children) {
          if (findAndApply(field.children)) return true;
        }
      }
      return false;
    };
    findAndApply(formFields.value || []);
  }
};

defineExpose({
  merge,
  mergeDraft,
  resetForm,
  setFormData,
  getFormData,
  updateFormData,
  starHorseFormRef,
  tableListRef,
  getFields,
  getFormFields,
  validate,
  setSource,
  ruleEngineApply,
});
</script>
<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <el-scrollbar height="100%" class="flex-1">
      <el-form
          :model="dataForm"
          :size="formSize"
          :rules="rules"
          :scroll-to-error="true"
          :scroll-into-view-options="true"
          :inline-message="false"
          :status-icon="true"
          :label-position="isMobile ? 'top' : labelPosition"
          require-asterisk-position="right"
          label-width="auto"
          class="data-form"
          ref="starHorseFormRef"
      >
        <star-horse-form-item
            :primaryKey="primaryKey"
            :apiEndpoints="apiEndpoints"
            :fieldList="platformFields"
            :rules="rules"
            :compSize="formSize"
            :dialogType="dialogType"
            v-model:dataForm="dataForm"
            :source="source"
            @addRow="addRow"
            @removeRow="removeRow"
            :subTableName="subTableName"
        />
      </el-form>
    </el-scrollbar>
    <div
        class="my-3 flex items-center justify-center w-full h-[45px]"
        v-if="typeModel == 'form'"
    >
      <el-button
          @click="merge"
          style="
          background: var(--star-horse-style);
          color: var(--star-horse-white);
        "
          :size="formSize"
      >
        <star-horse-icon
            icon-class="save"
            style="color: var(--star-horse-white)"
        />
        {{ i18n("form.submit") }}
      </el-button>
      <el-button @click="resetForm" :size="formSize" link>
        <star-horse-icon icon-class="undo"/>
        {{ i18n("form.reset") }}
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
/* 校验错误提示已改为气泡（ShErrorTooltip，teleport 不占布局），
   去掉 el-form-item 默认 margin-bottom:18px 的预留空白 */
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}
/* 多个 el-descriptions 紧邻时合并为一个视觉表格：
   去掉间距 + 第二个起去掉顶部双边框 */
:deep(.el-descriptions + .el-descriptions) {
  margin-top: -1px;
  .el-descriptions__body {
    .el-descriptions__table {
      border-top: none;
      tr:first-child td {
        border-top: none;
      }
    }
  }
}
</style>
