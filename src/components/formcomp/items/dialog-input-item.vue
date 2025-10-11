<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef } from "vue";
import { warning } from "@/utils/message";
import { FieldInfo, FieldMapping } from "@/components/types/PageFieldInfo";
import { isJson } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { SearchFields } from "@/components/types";
import { getDynamicEvents } from "@/api/system";

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
const dialogInputTableRef = ref();
let dialogInputVisible = shallowRef(false);
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const selectItem = (row: any) => {
  let data = "";
  let needField = props.field.preps?.needField;
  if (!row || !isJson(row)) {
    let selectDatas = dialogInputTableRef.value.multipleSelection;
    if (!selectDatas) {
      warning("请选择数据");
      return;
    }
    data = selectDatas[0];
  } else {
    data = row;
  }
  //如果没有指定属性，则默认取相同的属性
  let name = props.field.fieldName;
  if (!needField) {
    formData.value[name] = data[name];
  } else {
    needField.forEach((item: FieldMapping) => {
      if (needField.length == 1) {
        formData.value[name] = data[item.sourceField];
      } else {
        formData.value[item.distField] = data[item.sourceField];
      }
    });
  }
  if (props.field.preps?.recall) {
    props.field.preps?.["recall"](row);
  }
  closeAction();
};
const closeAction = () => {
  dialogInputVisible.value = false;
};
const showVisible = () => {
  dialogInputVisible.value = true;
  nextTick(() => {
    let fields = props.field.preps?.needField;
    let name = props.field.fieldName;
    let realName = name;
    if (props.field.aliasName) {
      realName = props.field?.aliasName;
    }
    if (fields) {
      name = fields.map((item: FieldMapping) => item.sourceField)[0];
    }
    dialogInputTableRef.value?.setDataInfo(name, formData.value[realName]);
  });
};

onMounted(async () => {
  await nextTick();
  let inputPreps = props.field?.preps;
  if (!inputPreps) {
    warning("属性" + props.field?.label + "需要配置params 信息");
    return;
  }
  if (inputPreps.searchFieldList?.length === 0) {
    let searchFieldList: Array<SearchFields> = [];
    inputPreps.fieldList?.forEach((item: FieldInfo) => {
      if (item.searchVisible) {
        let temp: any = Object.assign({}, item);
        if (item.prefix) {
          temp["fieldName"] = item.prefix + "." + temp["fieldName"];
        }
        temp["defaultVisible"] = true;
        if (item?.type == "input" && !item["matchType"]) {
          temp["matchType"] = "lk";
        }
        searchFieldList.push(temp);
      }
    });
    inputPreps.searchFieldList = { fieldList: searchFieldList };
  }
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<template>
  <star-horse-dialog
    :title="field.label + '数据选择'"
    :self-func="true"
    :dialog-visible="dialogInputVisible"
    @merge="selectItem"
    @closeAction="closeAction"
  >
    <el-card class="inner_content">
      <div class="search-content">
        <div class="search_btn">
          <star-horse-search-comp
            @searchData="
              (data: any) => dialogInputTableRef.createSearchParams(data)
            "
            :formData="field.preps?.['searchFieldList']"
            :compUrl="field.preps?.['dataUrl']"
          />
        </div>
      </div>
      <star-horse-table-comp
        :fieldList="{
          cellEditable: false,
          fieldList: field.preps?.['fieldList'],
        }"
        :primaryKey="field.preps?.['primaryKey']"
        :compUrl="field.preps?.['dataUrl']"
        ref="dialogInputTableRef"
        :dialogInput="true"
        height="400px"
        :filterCondition="field.preps?.['filterCondition']"
        :orderBy="field.preps?.['orderBy']"
        @selectItem="selectItem"
        :dataFormat="field.preps?.['dataFormat']"
        :disableAction="true"
      />
    </el-card>
  </star-horse-dialog>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <el-input
      :disabled="checkIsDisabled(props)"
      type="text"
      v-bind="prepsFilter(field.preps)"
      :fid="field.fieldName"
      v-on="getDynamicEvents(props, itemAction)"
      v-model="formData[field.fieldName]"
    >
      <template #append>
        <el-button
          icon="Search"
          @click="showVisible"
          :disabled="checkIsDisabled(props)"
        />
      </template>
    </el-input>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.cell.el-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
