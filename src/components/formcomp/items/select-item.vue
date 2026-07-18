<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-select
      :fid="field.fieldName"
      :remote="remote"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :show-arrow="true"
      :remote-method="remoteMethod"
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
      <template
        v-for="item in field.preps?.values"
        :key="item[field.preps?.props?.value ?? 'value']"
      >
        <el-option
          :disabled="item['disabled']"
          :label="item[field.preps?.props?.label ?? 'name']"
          :value="item[field.preps?.props?.value ?? 'value']"
        />
      </template>
      <template v-if="field.preps?.showFooter" #footer>
        <el-button v-if="!isAdding" text bg  @click="onAddOption">
          {{ i18n("form.addComponentOption") }}
        </el-button>
        <template v-else>
          <div class="flex-row flex w-full justify-between">
            <el-input
              v-model="optionName"
              class="option-input flex-1"
              :placeholder="i18n('form.enterOptionName')"

            />
            <div class="flex-row flex justify-center w-[35%] mx-auto my-0">
              <el-button
                type="primary"
                icon="add"

                @click="onConfirm"
              >
                {{ i18n("form.add") }}
              </el-button>
              <el-button  icon="cancel" @click="clear"
                >{{ i18n("form.cancel") }}
              </el-button>
            </div>
          </div>
        </template>
      </template>
    </el-select>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  compDynamicData,
  createFilter,
  dynamicUrlOperation,
} from "@/api/star_horse_utils";
import { getDynamicEvents } from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { SearchParams } from "@/components/types/Params";
import { warning } from "@/utils/message";
import { computed, nextTick, onMounted, ref, watch } from "vue";
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
const checkAll = ref(false);
const indeterminate = ref(false);
const isAdding = ref(false);
const optionName = ref("");
const remote = computed(() => {
  let temp = props.field.preps?.remote;
  if (typeof temp == "string") {
    return ["true", "yes", "t"].includes(temp.toLowerCase());
  }
  return false;
});
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
/**
 * 动态获取数据
 */
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["values"] = dataa;
  }
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
  // 校验重复
  if (props.field.preps.values.find((_) => _.value == optionName.value)) {
    warning(i18n("form.optionNameDuplicate"));
    return;
  }
  props.field.preps?.values.push({
    name: optionName.value,
    value: optionName.value,
  });
  isAdding.value = false;
};
const clear = () => {
  optionName.value = "";
  isAdding.value = false;
};
const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    formData.value[props.field.fieldName] = props.field.preps.values.map(
      (_) => _.value,
    );
  } else {
    formData.value[props.field.fieldName] = [];
  }
};
const remoteMethod = async (queryString: string) => {
  if (!remote.value) {
    return;
  }
  let temp = props.field.preps;
  let dataSource = temp["dataSource"];
  if (dataSource == "url") {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp["selectLabel"],
      value: queryString,
      operation: "lk",
    });
    temp["values"] = await dynamicUrlOperation(temp, searchParams);
  } else {
    temp["values"] = queryString
      ? temp["values"]?.filter(createFilter(queryString))
      : temp["values"];
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
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
