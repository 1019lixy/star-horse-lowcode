<template>
  <star-horse-dialog
    :title="field.label + '数据选择'"
    :self-func="true"
    :dialog-visible="dialogInputVisible"
    @merge="selectItem"
    :box-height="'500px'"
    @closeAction="closeAction"
  >
    <div style="width: 100%">
      <component
        :is="field.preps.compName"
        :params="field.preps"
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
    :formItem="field"
    :parentField="parentField"
  >
    <el-mention
      :disabled="checkIsDisabled(props)"
      :options="userOptionList"
      :whole="true"
      :fid="field.fieldName"
      v-bind="field.preps"
      v-on="getDynamicEvents(props, itemAction)"
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
import { nextTick, shallowRef, PropType } from "vue";
import { FieldMapping } from "@/components/types/PageFieldInfo";
import { warning } from "@/utils/message";
import {
  allAction,
  checkIsDisabled,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
const props = defineProps({
  isDesign: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showFormItem: {
    type: Boolean,
    default: false,
  },
  bareFlag: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  field: {
    type: Object as PropType<any>,
    required: true,
  },
  parentField: {
    type: Object as PropType<any>,
  },
  formInfo: {
    type: Object as PropType<any>,
  },
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
  let selectDatas = userTableRef.value.$refs.employeeInfoRef.multipleSelection;
  if (!selectDatas) {
    warning("请选择数据");
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
        temp[aliasName] = [];
      }
      userOptionList.value.push({
        label: data["name"],
        value: data["employeeNo"],
      });
      temp[name].push(data["name"]);
      temp[aliasName].push(data["employeeNo"]);
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
    formData.value[name] = temp[name].join(" ");
    formData.value[aliasName] = temp[aliasName].join(" ");
  } else {
    needField.forEach((item: FieldMapping) => {
      if (needField.length == 1) {
        formData.value[name] = temp[item.sourceField].join(" ");
      } else {
        formData.value[item.distField] = temp[item.distField].join(" ");
      }
    });
  }
  if (props.field.preps["recall"]) {
    props.field.preps["recall"](selectDatas);
  }
  closeAction();
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
    userTableRef.value.$refs.employeeInfoRef.setDataInfo(
      name,
      formData.value[realName],
    );
  });
};
</script>
<style lang="less" scoped></style>
