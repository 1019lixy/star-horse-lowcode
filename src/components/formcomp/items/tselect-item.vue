<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-tree-select
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :default-expand-all="true"
      v-bind="prepsFilter(field.preps)"
      :filter-node-method="filterNodeMethod"
      :render-content="renderContent"
      v-on="getDynamicEvents(props, itemAction, formData)"
      v-model="formData[field.fieldName]"
    >
      <template v-if="field.preps?.multiple" #header>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          @change="handleCheckAll"
        >
          {{ i18n("common.selectAll") }}
        </el-checkbox>
      </template>
      <template v-if="field.preps?.showFooter" #footer>
        <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
          {{ i18n("form.addComponentOption") }}
        </el-button>
        <template v-else>
          <div class="flex-row flex w-full justify-between">
            <el-input
              v-model="optionName"
              class="option-input flex-1"
              :placeholder="i18n('form.enterOptionName')"
              size="small"
            />
            <div class="flex-row flex justify-center w-[35%] mx-auto my-0">
              <el-button
                type="primary"
                icon="add"
                size="small"
                @click="onConfirm"
              >
                {{ i18n("form.add") }}
              </el-button>
              <el-button size="small" icon="cancel" @click="clear">{{
                i18n("form.cancel")
              }}</el-button>
            </div>
          </div>
        </template>
      </template>
    </el-tree-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { compDynamicData } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";
import { i18n } from "@/lang";

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
const checkAll = ref(false);
const indeterminate = ref(false);
const isAdding = ref(false);
const optionName = ref("");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const onAddOption = () => {
  isAdding.value = true;
};
const onConfirm = () => {
  // 校验输入
  if (!optionName.value) {
    warning(i18n("form.enterOptionName"));
    return;
  }

  const labelName = props.field.preps?.props?.label || "label";
  const codeName =
    props.field.preps?.props?.code ||
    props.field.preps?.props?.value ||
    "value";
  // 校验重复
  if (
    props.field.preps.data.find(
      (item: any) => item[codeName] == optionName.value,
    )
  ) {
    warning(i18n("form.optionNameDuplicate"));
    return;
  }
  const temp = {};
  temp[labelName] = optionName.value;
  temp[codeName] = optionName.value;
  props.field.preps.data.push(temp);
  isAdding.value = false;
};
const clear = () => {
  optionName.value = "";
  isAdding.value = false;
};
const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    // 全选，选中所有数据包括所有子数据,选中所有子数据的子数据
    const collectValues = (nodes: any[]) => {
      let values: any[] = [];
      nodes.forEach((node) => {
        values.push(node.value);
        if (node.children) {
          values = values.concat(collectValues(node.children));
        }
      });
      return values;
    };
    formData.value[props.field.fieldName] = collectValues(
      props.field.preps.data,
    );
  } else {
    // 取消全选
    formData.value[props.field.fieldName] = [];
  }
};
const filterNodeMethod = (value: any, data: any) => {
  let name: any = props.field.preps["props"]?.label || "label";
  return data[name].includes(value);
};
const renderContent = (_h: Function, data: any) => {
  let labelName = props.field.preps.props?.label || "label";
  if (props.field.preps["showCode"]) {
    let codeName =
      props.field.preps.props?.code ||
      props.field.preps.props?.value ||
      "value";
    return `${data.data[labelName]}(${data.data["code"] || data.data[codeName] || ""})`;
  }
  return data.data[labelName];
};
/**
 * 动态获取数据
 */
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["data"] = dataa;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["remote"] =
    props.field.preps["remote"] || props.field.preps["dataSource"] == "url";
  props.field.preps["filterable"] = true;
  props.field.preps["collapseTags"] = true;
  props.field.preps["props"] = props.field.preps["props"] || {
    label: "name",
    value: "value",
  };
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style scoped></style>
