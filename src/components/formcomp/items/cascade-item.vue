<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-cascader
      :fid="field.fieldName"
       v-bind="prepsFilter(field.preps)"
      :disabled="checkIsDisabled(props)"
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
    </el-cascader>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted,  ref, watch } from "vue";
import { compDynamicData, isJson } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,prepsFilter
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";

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
const getAllValuePaths = computed(() => {
  const codeName =
    props.field.preps.props?.code || props.field.preps.props?.value || "value";
  const result: string[][] = [];
  const queue: { node: any; path: string[] }[] = props.field.preps.options.map(
    (node) => ({ node, path: [node[codeName]] }),
  );

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    if (node.children?.length) {
      node.children.forEach((child) => {
        queue.push({ node: child, path: [...path, child[codeName]] });
      });
    } else {
      result.push(path);
    }
  }
  return result;
});

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
    props.field.preps.options.find(
      (item: any) => item[codeName] == optionName.value,
    )
  ) {
    warning("选项名称重复");
    return;
  }
  const temp = {};
  temp[labelName] = optionName.value;
  temp[codeName] = optionName.value;
  props.field.preps.options.push(temp);
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
      props.field.preps.options,
    );
  } else {
    // 取消全选
    formData.value[props.field.fieldName] = [];
  }
};
const initData = async () => {
  await nextTick();
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["options"] = dataa;
  }
  let data: any = formData.value[props.field.fieldName];
  if (isJson(data)) {
    formData.value[props.field.fieldName] = JSON.parse(data);
  } else {
    //解决加载慢问题，导致数据没法回显
    setTimeout(() => {
      let data: any = formData.value[props.field.fieldName];
      formData.value[props.field.fieldName] = isJson(data)
        ? JSON.parse(data)
        : [];
    }, 200);
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  if (!props.field.preps.props) {
    props.field.preps["props"] = {
      label: "name",
      multiple: props.field?.preps?.multiple,
      checkStrictly: true,
    };
  }

  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
watch(formData.value[props.field.fieldName], (val) => {
  if (val.length === 0) {
    checkAll.value = false;
    indeterminate.value = false;
  } else if (val.length === getAllValuePaths.value.length) {
    checkAll.value = true;
    indeterminate.value = false;
  } else {
    indeterminate.value = true;
  }
});
watch(
  () => formData.value[props.field.fieldName + "OptionList"],
  (val) => {
    if (val?.length > 0) {
      props.field.preps["options"] = val;
    }
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
</style>
