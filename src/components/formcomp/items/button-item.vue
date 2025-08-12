<template>
  <star-horse-dialog
    :title="field.preps?.dialogTitle || '配置按钮事件'"
    :selfFunc="true"
    @merge="operResultAction"
    :dialogVisible="btnDialogVisible"
    :boxWidth="field.preps?.boxWidth || '50%'"
    :isShowReset="field.preps?.isShowReset ?? false"
    @closeAction="close"
    :btnText="field.preps?.dialogBtn ?? '确定'"
  >
    <star-horse-form
      ref="btnFormRef"
      :fieldList="{
        fieldList: field.preps?.fieldList,
      }"
      v-if="field.preps?.viewType == 'form'"
    />
    <component
      :is="field.preps?.componentName"
      ref="btnCompRef"
      v-else-if="field.preps?.viewType == 'usercomp'"
      :params="field.preps?.params"
    />
    <star-horse-editor
      v-else-if="field.preps?.viewType == 'code'"
      ref="btnCompRef"
    />
  </star-horse-dialog>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-button
      :disabled="checkIsDisabled(props)"
      v-bind="field.preps"
      @click="dynamicFunc(field.preps?.code)"
    >
      <star-horse-icon
        v-if="field.preps?.icon"
        :icon-class="field.preps.icon"
        style="vertical-align: middle; color: var(--star-horse-style)"
      />
      {{ field?.label }}
    </el-button>
  </starhorse-form-item>
</template>
<script setup lang="ts" name="buttonItem">
import { onMounted,  shallowRef, unref } from "vue";
import {
  buttonAction,
  checkIsDisabled,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { httpRequest } from "@/api/star_horse_apis";
import { operationConfirm, warning } from "@/utils/message";
import { BtnAction, DynamicParamField } from "@/components/types/BtnAction";
import { SearchParams } from "@/components/types/Params";
import { createCondition } from "@/api/star_horse_utils";

import { ItemPreps } from "@/components/types/ItemPreps";
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

let btnDialogVisible = shallowRef<boolean>(false);
const btnCompRef = shallowRef();

const operResultAction = async () => {
  let action: BtnAction = props.field.preps;
  let formData: any = {};
  if (action?.viewType == "comp") {
    formData = await btnCompRef.value?.getFormData("请先填写表单数据");
    if (!formData) {
      return;
    }
  } else {
    formData = await btnCompRef.value?.getFormData().value;
  }
  formData.value[props.field.fieldName] = JSON.stringify(unref(formData));
  close();
};
//打开对话框
const openDialog = async () => {
  /**
   * 1、调用公共的方法
   * --2、调用公共的组件
   * --3、调用指定接口
   * --4、执行程序块
   * --5、传入表单参数，生成表单
   *
   */
  let action: BtnAction = props.field.preps;
  //执行代码块
  if (action?.needConfirm) {
    let result = operationConfirm(action.confirmMsg ?? "确定要执行此操作吗");
    if (!result) {
      return;
    }
  }
  if (action?.viewType == "inter") {
    //如果参数是动态参数，则在当前form中寻找对应名称的值
    let urlParam: any = {};
    if (action.isDynamicParam == "Y") {
      let dynamicParams: SearchParams[] | DynamicParamField[] | any =
        action.params;
      let params: SearchParams[] = [];
      dynamicParams?.forEach((dynamicParam: any) => {
        let value =
          formData.value[dynamicParam.paramName] ?? dynamicParam.defaultValue;
        params.push(
          createCondition(
            dynamicParam.paramName,
            value,
            dynamicParam.matchType,
          ),
        );
      });
      urlParam["fieldList"] = params;
    } else {
      urlParam = action.params;
    }
    if (!action.url) {
      warning("请提供需要调用的接口");
      return;
    }
    httpRequest(action.url!, action.method ?? "POST", urlParam).then(
      (res: any) => {
        //仅仅执行，则直接调用接口
        console.log(res);
        let reData = res.data;
        if (reData.code) {
          warning(reData.cnMessage);
          return;
        }
        let datas = reData?.data;
        if (action?.afterAction) {
          if (!datas) {
            warning("返回数据为空，无法赋值");
            return;
          }
          if (Array.isArray(datas)) {
            warning("返回数据为数组，无法赋值");
            return;
          }
          //执行后搜集返回结果
          if (action?.afterAction == "assignCurrentName") {
            formData.value[props.field.fieldName] = datas;
          } else if (action?.afterAction == "assignForm") {
            let entries = Object.entries(datas);
            entries.forEach(([key, value]) => {
              formData.value[key] = value;
            });
          }
        }
      },
    );
  } else if (action?.viewType == "code") {
    if (!action.code) {
      warning("请提供需要执行的代码");
      return;
    }
    buttonAction(props, emits, formData, action.code);
  } else if (action?.viewType == "method") {
    if (!action.actions) {
      warning("请提供需要执行的函数");
      return;
    }
    action.actions(formData);
  } else {
    btnDialogVisible.value = true;
  }
};
const close = () => {
  btnDialogVisible.value = false;
};
const dynamicFunc = (code: any) => {
  // openDialog();
  //如果是配置的标准操作
  if (props.field.preps?.viewType) {
    openDialog();
  } else {
    buttonAction(props, emits, formData, code);
  }
};
onMounted(() => {
  // 按钮没有初始化事件
  // nextTick(() => {
  //   initCompCallEvent(props, emits, formData);
  // });
});
</script>
<style lang="scss" scoped>
:deep(.el-icon) {
  display: none;
}
</style>
