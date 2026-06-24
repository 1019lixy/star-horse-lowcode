<template>
  <star-horse-dialog
    :title="field.label + i18n('item.dataSelect')"
    :self-func="true"
    :dialog-visible="dialogInputVisible"
    @merge="selectItem"
    :box-height="'500px'"
    @closeAction="closeAction"
  >
    <div class="w-full h-full overflow-hidden">
      <component
        :is="field.preps.compName"
        v-bind="field.preps"
        ref="userTableRef"
        style="flex: 1"
      />
    </div>
  </star-horse-dialog>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-mention
      :disabled="checkIsDisabled(props)"
      :options="userOptionList"
      :whole="true"
      :fid="field.fieldName"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction,formData)"
      v-model="formData[field.fieldName]"
    >
      <template #append>
        <star-horse-icon
          icon-class="user-add"
          @click="showVisible"
          :disabled="field.preps['disabled']"
        />
      </template>
    </el-mention>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, shallowRef } from "vue";
import { FieldMapping } from "@/components/types/PageFieldInfo";
import { warning } from "@/utils/message";
import {
  allAction,
  checkIsDisabled,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import { StarHorseDialog } from "@/components/comp";
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
let userTableRef = shallowRef();
let dialogInputVisible = shallowRef<boolean>(false);
let userOptionList = shallowRef<Array<any>>([]);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (_row: any) => {
  userOptionList.value = [];
  let needField = props.field.preps["needField"];
  let selectDatas =
    userTableRef.value?.$refs?.employeeInfoRef?.getSelectedDatas();
  if (!selectDatas) {
    warning(i18n("api.pleaseSelectData2"));
    return;
  }
  //如果没有指定属性，则默认取相同的属性
  let name = props.field.fieldName;
  let aliasName = props.field.preps["aliasName"];
  let temp: any = {};
  for (let i in selectDatas) {
    let data = selectDatas[i];
    if (!needField) {
      if (!Object.keys(temp).includes(name)) {
        temp[name] = [];
        aliasName && (temp[aliasName] = []);
      }
      userOptionList.value.push({
        label: data["name"],
        value: data["employeeNo"],
      });
      temp[name].push(data["name"]);
      aliasName && temp[aliasName].push(data["employeeNo"]);
    } else {
      needField.forEach((item: FieldMapping) => {
        if (needField.length == 1) {
          if (!Object.keys(temp).includes(item.sourceField)) {
            temp[item.sourceField] = [];
          }
          temp[name].push(data[item.sourceField]);
        } else {
          if (!Object.keys(temp).includes(item.distField)) {
            temp[item.distField] = [];
          }
          temp[item.distField] = data[item.sourceField];
        }
      });
    }
  }

  if (!needField) {
    formData.value[name] = arrayToString(temp[name]);
    aliasName && (formData.value[aliasName] = arrayToString(temp[aliasName]));
  } else {
    needField.forEach((item: FieldMapping) => {
      if (needField.length == 1) {
        formData.value[name] = arrayToString(temp[item.sourceField]);
      } else {
        formData.value[item.distField] = arrayToString(temp[item.distField]);
      }
    });
  }
  if (props.field.preps["recall"]) {
    props.field.preps["recall"](selectDatas);
  }
  closeAction();
};
const arrayToString = (data: any) => {
  return Array.isArray(data) ? data.join("") : data;
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
  nextTick(() => {
    let fields = props.field.preps["needField"];
    let name = props.field.fieldName;
    let realName = name;
    if (props.field.preps["aliasName"]) {
      realName = props.field.preps["aliasName"];
    }
    if (fields) {
      name = fields.map((item: FieldMapping) => item.sourceField)[0];
    }
    userTableRef.value?.$refs?.employeeInfoRef?.setDataInfo(
      name,
      formData.value[realName],
    );
  });
};
</script>
<style lang="less" scoped></style>
