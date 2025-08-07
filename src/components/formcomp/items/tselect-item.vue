<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :formItem="field"
    :parentField="parentField"
  >
    <el-tree-select
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :default-expand-all="true"
      v-bind="field.preps"
      :filter-node-method="filterNodeMethod"
      :render-content="renderContent"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    >
      <template v-if="field.preps.multiple" #header>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          @change="handleCheckAll"
        >
          全部
        </el-checkbox>
      </template>
      <template v-if="field.preps?.showFooter" #footer>
        <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
          添加选项
        </el-button>
        <template v-else>
          <div class="flex-row flex w-full justify-between">
            <el-input
              v-model="optionName"
              class="option-input flex-1"
              placeholder="请输入选项名称"
              size="small"
            />
            <div class="flex-row flex justify-center w-[35%] mx-auto my-0">
              <el-button
                type="primary"
                icon="add"
                size="small"
                @click="onConfirm"
              >
                添加
              </el-button>
              <el-button size="small" icon="cancel" @click="clear"
                >取消</el-button
              >
            </div>
          </div>
        </template>
      </template>
    </el-tree-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { nextTick, onMounted, PropType, ref, watch } from "vue";
import { compDynamicData } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";

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
    warning("请输入选项名称");
    return;
  }

  const labelName = props.field.preps.props?.label || "label";
  const codeName =
    props.field.preps.props?.code || props.field.preps.props?.value || "value";
  // 校验重复
  if (
    props.field.preps.data.find(
      (item: any) => item[codeName] == optionName.value,
    )
  ) {
    warning("选项名称重复");
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
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["data"] = val;
    }
  },
  {
    immediate: true,
  },
);
</script>
<style scoped></style>
