<template>
  <star-horse-dialog
    :title="field.preps?.dialogTitle || i18n('item.configureButtonEvent')"
    :selfFunc="true"
    @merge="operResultAction"
    :dialogVisible="btnDialogVisible"
    :boxWidth="field.preps?.boxWidth || '50%'"
    :isShowReset="field.preps?.isShowReset ?? false"
    @closeAction="close"
    :btnText="field.preps?.dialogBtn ?? i18n('item.confirm')"
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
      v-bind="prepsFilter(field.preps)"
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
import { onMounted, shallowRef, unref } from "vue";
import {
  buttonAction,
  checkIsDisabled,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { httpRequest } from "@/api/star_horse_apis";
import { operationConfirm, warning } from "@/utils/message";
import { BtnAction, DynamicParamField } from "@/components/types/BtnAction";
import { SearchParams } from "@/components/types/Params";
import { createCondition } from "@/api/star_horse_utils";

import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
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
    formData = await btnCompRef.value?.getFormData(i18n("item.pleaseFillFormData"));
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
    let result =await operationConfirm(action.confirmMsg ?? i18n("item.confirmToExecute"));
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
      warning(i18n("item.pleaseProvideApiUrl"));
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
            warning(i18n("item.returnDataEmpty"));
            return;
          }
          if (Array.isArray(datas)) {
            warning(i18n("item.returnDataIsArray"));
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
      warning(i18n("item.pleaseProvideCode"));
      return;
    }
    buttonAction(props, emits, formData, action.code);
  } else if (action?.viewType == "method") {
    if (!action.actions) {
      warning(i18n("item.pleaseProvideFunction"));
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
