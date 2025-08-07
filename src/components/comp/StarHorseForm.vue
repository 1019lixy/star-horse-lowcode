<script setup lang="ts" name="StarHorseForm">
import {
  inject,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  PropType,
  ref,
  ShallowReactive,
  unref,
  watch,
} from "vue";
import { ApiUrls } from "@/components/types/ApiUrls";
import { error, success, warning } from "@/utils/message";
import { postRequest } from "@/api/star_horse_apis";
import {
  closeLoad,
  formFieldMapping,
  isJson,
  load,
  loadById,
} from "@/api/star_horse_utils";
import { DialogProps } from "@/components/types/DialogProps";
import {
  BatchFieldInfo,
  FieldInfo,
  PageFieldInfo,
} from "@/components/types/PageFieldInfo";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import piniaInstance from "@/store";
import { useSelfOperationStore } from "@/store/SelfOperation";
import { SelectOption } from "@/components/types/SearchProps";
import { Config } from "@/api/settings";

const props = defineProps({
  compUrl: { type: Object as PropType<ApiUrls> },
  fieldList: { type: Object as PropType<PageFieldInfo>, required: true },
  batchName: { type: String, default: "batchDataList" },
  batchFieldName: { type: String, default: "batchFieldList" },
  outerFormData: { type: Object as PropType<any> },
  primaryKey: { type: [String, Object] as PropType<string | any> },
  globalCondition: { type: Object },
  rules: { type: Object },
  formSize: { type: String, default: Config.compSize },
  labelPosition: { type: String, default: "left" },
  typeModel: { type: String },
  dynamicForm: { type: Boolean, default: false },

  selectData: {
    type: Array<SelectOption>,
    default: () => {
      return [
        { name: "正常", value: "1" },
        { name: "禁用", value: "2" },
      ];
    },
  },
});
let userOperation = useSelfOperationStore(piniaInstance);
//刷新事件，数据已加载事件，导出数据更新数据
const emits = defineEmits([
  "refresh",
  "dataLoaded",
  "exportData",
  "removeRow",
  "addRow",
  "inited",
]);
const starHorseFormRef = ref(null);
const dataForm = ref<any>({});
// source:{type:Number,default:1},
const source = ref<number>(1);
//更新外面传进来的数据

const exportData = () => {
  emits("exportData", dataForm.value);
};
//向外实时导出数据

const closeDialog = inject("closeDialog") as Function;
let dialogOperation = inject("dialogOperation") as ShallowReactive<any>;
const dialogProps = inject<DialogProps>("dialogProps", {});
const formFields = inject("formFields", {}) as ShallowReactive<any>;

const loadData = async () => {
  if (!props.compUrl || !props.compUrl.loadByIdUrl || !dialogProps.ids) {
    return;
  }
  await nextTick();
  let id = Array.isArray(dialogProps?.ids)
    ? dialogProps.ids[0]
    : dialogProps?.ids;
  let objData;
  let params = props.globalCondition || {};
  //如果是Json 对象
  if (isJson(id)) {
    params = { ...params, ...id };
    objData = await loadById(props.compUrl?.loadByIdUrl!, "", params);
  } else {
    objData = await loadById(props.compUrl?.loadByIdUrl!, id, params);
  }
  let data = formFieldMapping(props.fieldList);
  dataForm.value = objData;
  //如果是动态表单
  if (props.dynamicForm) {
    for (let i in params) {
      let temp = params[i];
      if (!temp.subTabFlag) {
        let subTemp = { ...objData };
        delete subTemp[temp.tableName];
        dataForm.value[temp.tableName] = [subTemp];
      }
    }
  }
  let mapping = data.mappingFields;
  if (mapping) {
    for (let index in mapping) {
      let temp = mapping[index];
      if (!Object.keys(objData).includes(temp.name)) {
        dataForm.value[temp.name] = dataForm.value[temp.alias];
      }
    }
  }
  let actions = data.actions;
  if (actions && actions.length > 0) {
    for (let index in actions) {
      let temp = actions[index];
      // let tempFunc: any = objData;
      if (temp.actionNames == "change") {
        temp.actions(objData);
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
  starHorseFormRef.value!.validate((result: boolean) => {
    if (!result) {
      return;
    }
    doMerge(type);
  });
};
/**
 * 对状态名称赋值
 */
const assignStatusName = () => {
  if (dataForm.value.statusCode) {
    let sData = props.selectData.find(
      (item: any) => item.value === dataForm.value.statusCode,
    );
    if (sData) {
      dataForm.value["statusName"] = sData.name;
    }
  }
  let batchFields = props.fieldList?.batchFieldList || [];
  batchFields?.forEach((item: BatchFieldInfo) => {
    if (dataForm.value[item.batchName]) {
      for (
        let index = 0;
        index < dataForm.value[item.batchName]?.length;
        index++
      ) {
        let temp = dataForm.value[item.batchName][index];
        let sData = props.selectData.find(
          (sitem: any) => sitem.value === temp.statusCode,
        );
        if (sData) {
          dataForm.value[item.batchName][index]["statusName"] = sData.name;
        }
      }
    }
  });
};
const mergeDraft = (type: string) => {
  doMerge(type);
};

const analysisSameToParentField = (): Array<string> => {
  let batchName: Array<string> = [];
  let batchFields = props.fieldList?.batchFieldList || [];
  const analysis = (batchFields: BatchFieldInfo[]) => {
    batchFields?.forEach((item: BatchFieldInfo) => {
      if (false === item.subFormFlag || "N" == item.subFormFlag) {
        batchName.push(item.batchName);
      }
    });
  };
  //单独定义的批量属性
  analysis(batchFields);
  //嵌入fieldList里的批量属性
  let fieldList = props.fieldList?.fieldList || [];
  const arrayFieldList = (fieldList: FieldInfo[]) => {
    for (let index in fieldList) {
      let temp: any = fieldList[index];
      if (temp instanceof Array) {
        arrayFieldList(temp);
      } else if (temp.batchFieldList) {
        analysis(temp.batchFieldList);
      }
    }
  };
  arrayFieldList(fieldList);
  return batchName;
};

const doMerge = (type: string) => {
  assignStatusName();
  let tempForm: any = [];
  let tempDatas: any = JSON.parse(JSON.stringify(dataForm.value));
  let mergeUrl = props.compUrl?.mergeUrl;
  let flag = true;
  //单独批量数据和嵌入fieldList 里的批量数据
  //原则上只支持1个批量表格，多个存在数据对称问题
  let sameBatchNames = analysisSameToParentField();
  if (sameBatchNames?.length > 0) {
    flag = false;
    mergeUrl = props.compUrl?.batchMergeUrl;
    tempForm = [];
    sameBatchNames.forEach((batchName: string) => {
      let batchDatas = tempDatas[batchName];
      delete tempDatas[batchName];
      for (let i in batchDatas) {
        //保留第一条数据的ID
        if (parseInt(i) > 0) {
          delete tempDatas[props.primaryKey];
        }
        let temp = { ...tempDatas, ...batchDatas[i] };
        tempForm.push(temp);
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
  load("数据处理中");
  //dynamicForm 如果为true 表示动态表单，动态表单需额外封装数据对象
  let formData = props.dynamicForm ? dydata : tempForm;
  postRequest(mergeUrl!, formData)
    .then((res) => {
      closeLoad();
      if (res.data.code != 0) {
        warning(res.data.cnMessage);
        return;
      } else {
        success(res.data.cnMessage);
      }
      emits("refresh", formData, res.data);
      resetForm();
      if (type == "close") {
        closeDialog();
      }
      dialogProps.ids = -1;
      //关闭弹窗
    })
    .catch((err) => {
      error("接口调用异常" + err);
    })
    .finally(() => {
      closeLoad();
    });
};
const resetForm = () => {
  dataForm.value = formFieldMapping(props.fieldList)?.defaultDatas;
  let data = unref(props.outerFormData);
  if (Object.keys(data || {}).length > 0) {
    dataForm.value = { ...dataForm.value, ...data };
  }
};
/**
 * 返回表单数据
 */
const getFormData = () => {
  return dataForm;
};
/**
 * 设置表单数据
 * @param data
 */
const setFormData = (data: any) => {
  let mappingData = formFieldMapping(props.fieldList);
  let defaultDatas = mappingData.defaultDatas;
  dataForm.value = { ...defaultDatas, ...data };
};
/**
 * 更新数据
 * @param data
 */
const updateFormData = (data: any) => {
  dataForm.value = { ...dataForm.value, ...data };
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
  await nextTick();
  userOperation.init(props.fieldList, dataForm, starHorseFormRef);
  await nextTick();
  emits("inited");
};
const tableListRef = ref<any>([]);
onActivated(() => {
  recordFieldInfo();
});
onDeactivated(() => {
  // userOperation.clearAll();
});
onBeforeUnmount(() => {
  userOperation.clearAll();
});
onMounted(() => {
  recordFieldInfo();
});
watch(
  () => dataForm.value,
  () => {
    exportData();
  },
  { immediate: false, deep: true },
);
watch(
  () => props.outerFormData,
  (val: any) => {
    if (val) {
      resetForm();
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => dialogOperation,
  (val: any) => {
    const handlers: any = {
      merge: () => merge(val.type),
      mergeDraft: () => mergeDraft(val.type),
      resetForm: () => resetForm(),
    };
    handlers[val.funcName]?.();
    dialogOperation.funcName = "";
    dialogOperation["type"] = "";
  },
  {
    immediate: false,
    deep: true,
  },
);
watch(
  () => dialogProps.ids,
  (val) => {
    console.log("ids", val);
    if (!val || val == -1) {
      source.value = 1;
      setFormData(dataForm.value);
    } else {
      source.value = 2;
      loadData();
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

defineExpose({
  merge,
  mergeDraft,
  resetForm,
  setFormData,
  getFormData,
  updateFormData,
  starHorseFormRef,
  tableListRef,
});
</script>
<template>
  <el-scrollbar height="100%">
    <el-form
      :model="dataForm"
      :size="formSize"
      :rules="rules"
      :scroll-to-error="true"
      :scroll-into-view-options="true"
      :inline-message="false"
      :status-icon="true"
      :label-position="labelPosition"
      require-asterisk-position="right"
      label-width="auto"
      class="data-form"
      ref="starHorseFormRef"
    >
      <star-horse-form-item
        :primaryKey="primaryKey"
        :compUrl="compUrl"
        :fieldList="fieldList"
        :rules="rules"
        :compSize="formSize"
        v-model:dataForm="dataForm"
        :source="source"
        @addRow="addRow"
        @removeRow="removeRow"
        :batchName="batchName"
        :batchFieldName="batchFieldName"
      />
    </el-form>
  </el-scrollbar>
  <el-form-item v-if="typeModel == 'form'" :size="formSize">
    <el-button
      @click="merge"
      style="
        background: var(--star-horse-style);
        color: var(--star-horse-white);
      "
    >
      <star-horse-icon
        icon-class="save"
        style="color: var(--star-horse-white)"
      />
      提交
    </el-button>
    <el-button @click="resetForm" link>
      <star-horse-icon icon-class="undo" />
      重置
    </el-button>
  </el-form-item>
</template>
<style lang="scss" scoped></style>
