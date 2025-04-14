<template>
  <star-horse-dialog
      :title="field.preps['label'] + '数据选择'"
      :self-func="true"
      :dialog-visible="dialogInputVisible"
      @merge="selectItem"
      :box-height="'500px'"
      @closeAction="closeAction"
  >
    <div style="width: 100%">
      <component :is="field.preps.compName" :params="field.preps" ref="userTableRef"
                 style="flex: 1"/>
    </div>
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="context.attrs['isDesign']"
      :bareFlag="context.attrs['bareFlag']"
      :form-item="field"
      :parentField="parentField"
  >
    <el-mention
        :clearable="field.preps['clearable'] == 'Y'"
        :disabled="!context.attrs['formData']['_' + field.preps['name'] + 'Editable'] && field.preps['disabled'] == 'Y'"
        :max="field.preps['max']"
        :maxlength="field.preps['maxlength']"
        :min="field.preps['min']"
        :options="userOptionList"
        :whole="true"
        :minlength="field.preps['maxlength']"
        :placeholder="field.preps['placeholder'] || '请输入' + field.preps['label']"
        :prefix-icon="field.preps['prefixIcon']"
        :readonly="field.preps['readonly'] == 'Y'"
        :size="context.attrs.formInfo?.size || field?.preps['size'] || 'default'"
        :fid="field.preps['name']"
        @change="itemAction('change')"
        @keydown.enter="itemAction('enter')"
        @focus="itemAction('focus')"
        @blur="itemAction('blur')"
        v-model="context.attrs['formData'][field.preps['name']]"
    >
      <template #append>
        <star-horse-icon icon-class="user-add" @click="showVisible" :disabled="field.preps['disabled'] == 'Y'"/>
      </template>
    </el-mention>
  </starhorse-form-item>
</template>
<script lang="ts">
import {defineComponent, nextTick, shallowRef} from "vue";
import {FieldMapping} from "@/components/types/PageFieldInfo";
import {warning} from "@/utils/message.ts";
import {allAction} from "@/components/formcomp/utils/ItemRelationEventUtils.ts";
export default defineComponent({
  setup(_props, context) {
    const parentField = context.attrs["parentField"];
    const field = context.attrs["field"] as any;
    let formItem = shallowRef({label: "input", required: false});
    let dataField = shallowRef("");
    let userTableRef = shallowRef();
    let dialogInputVisible = shallowRef<boolean>(false);
    let actionName = shallowRef("normal");
    let userOptionList = shallowRef<Array<any>>([]);
    const itemAction = (prep: any) => {
      allAction(context, prep);
    };
    const selectItem = (_row: any) => {
      userOptionList.value = [];
      let needField = field.preps["needField"];
      let selectDatas = userTableRef.value.$refs.employeeInfoRef.multipleSelection;
      if (!selectDatas) {
        warning("请选择数据");
        return;
      }
      console.log(selectDatas);
      //如果没有指定属性，则默认取相同的属性
      let name = field.preps["name"];
      let aliasName = field.preps["aliasName"];
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
            value: data["employeeNo"]
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
        context.attrs["formData"][name] = temp[name].join(" ");
        context.attrs["formData"][aliasName] = temp[aliasName].join(" ");
      } else {
        needField.forEach((item: FieldMapping) => {
          if (needField.length == 1) {
            context.attrs["formData"][name] = temp[item.sourceField].join(" ");
          } else {
            context.attrs["formData"][item.distField] = temp[item.distField].join(" ");
          }
        });
      }
      if (field.preps["recall"]) {
        field.preps["recall"](selectDatas);
      }
      closeAction();
    };
    const closeAction = () => {
      dialogInputVisible.value = false;
    };
    const showVisible = () => {
      dialogInputVisible.value = true;
      nextTick(() => {
        let fields = field.preps["needField"];
        let name = field.preps["name"];
        let realName = name;
        if (field.preps["aliasName"]) {
          realName = field.preps["aliasName"];
        }
        if (fields) {
          name = fields.map((item: FieldMapping) => item.sourceField)[0];
        }
        userTableRef.value.$refs.employeeInfoRef.setDataInfo(name, context.attrs["formData"][realName]);
      });
    };
    return {
      parentField,
      context,
      field,
      formItem,
      dataField,
      closeAction,
      dialogInputVisible,
      actionName,
      itemAction,
      showVisible,
      userTableRef,
      selectItem,
      userOptionList
    };
  }
});
</script>
<style lang="less" scoped></style>
