<template>
  {{ formData }}
  <template v-for="data in fields">
    <component
      :field="data"
      v-model:formData="formData"
      :isDesign="false"
      :formInfo="fields"
      :showFormItem="true"
      :is="data.itemType + '-item'"
    />
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/DesignForm";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
  test: "1-2-1",
});
const fields = ref<Array<any>>([
  {
    id: "Idshf8ab7060-129e-4321-9118-b72738fbc734",
    preps: {
      showArrow: false,
      placeholder: "请选择验证1",
      multipleLimit: null,
      noMatchText: "",
      valueType: "",
      remoteMethod: "",
      remote: false,
      loading: "",
      multiple: "",
      reserveKeyword: "",
      noDataText: "",
      filterable: true,
      collapseTags: true,
      allowCreate: "",
      defaultFirstOption: "",
      collapseTagsTooltip: true,
      automaticDropdown: "",
      tagType: "",
      placement: "",
      valueKey: "",
      filterMethod: "",
      loadingText: "",
      autocomplete: "",
      fitInputWidth: "",
      popperClass: "",
      effect: "",
      id: "Idshf8ab7060-129e-4321-9118-b72738fbc734",
      label: "验证1",
      itemNameLabel: "选择器",
      name: "valid1",
      clearable: true,
      readonly: false,
      maxLength: 255,
      rules: [],
      formVisible: true,
      listVisible: true,
      viewVisible: true,
      starHorseBtnName: "dataRelation",
      dataSource: "data",
      analysisType: "func",
      httpMethod: "POST",
      protocol: "http",
      values: [
        { name: "按钮权限", value: "button_authority", xh: 1 },
        { name: "白名单过滤类型", value: "white_name_filter_type", xh: 2 },
      ],
      queryParams: [],
      dataRelation: {
        actionName: "change",
        relationDetails: [
          {
            matchType: "eq",
            controlCondition: "dataLinkage",
            relationFields: "valid2",
            matchFieldName: "dictType",
            params: {
              url: "http://127.0.0.1:8749/system-config-dev/system/dictinfo/getAllByCondition",
              httpMethod: "POST",
              primaryKey: "idDictType",
              labelName: "dictName",
              valueName: "dictType",
            },
            xh: 1,
          },
        ],
        relationDetailsDefaultValue: [{}],
      },
    },
    compType: "formItem",
    fieldName: "valid1",
    itemType: "select",
    label: "选择器",
    type: "select",
  },
  {
    id: "Idsh8e8d7ecb-6cb7-4656-909f-23c4899fa85b",
    preps: {
      showArrow: false,
      placeholder: "请选择验证2",
      multipleLimit: null,
      noMatchText: "",
      valueType: "",
      remoteMethod: "",
      remote: false,
      loading: "",
      multiple: "",
      reserveKeyword: "",
      noDataText: "",
      filterable: true,
      collapseTags: true,
      allowCreate: "",
      defaultFirstOption: "",
      collapseTagsTooltip: true,
      automaticDropdown: "",
      tagType: "",
      placement: "",
      valueKey: "",
      filterMethod: "",
      loadingText: "",
      autocomplete: "",
      fitInputWidth: "",
      popperClass: "",
      effect: "",
      id: "Idsh8e8d7ecb-6cb7-4656-909f-23c4899fa85b",
      label: "验证2",
      itemNameLabel: "选择器",
      name: "valid2",
      clearable: true,
      readonly: false,
      maxLength: 255,
      rules: [],
      formVisible: true,
      listVisible: true,
      viewVisible: true,
      starHorseBtnName: "dataSource",
      dataSource: "data",
      analysisType: "func",
      httpMethod: "POST",
      protocol: "http",
      values: [{ name: "CC", value: "c", xh: 1 }],
    },
    compType: "formItem",
    fieldName: "valid2",
    itemType: "select",
    label: "选择器",
    type: "select",
  },
  {
    preps: {},
    compType: "formItem",
    fieldName: "valid3",
    itemType: "htmleditor",
    label: "选择器",
    type: "htmleditor",
  },
]);
onMounted(() => {
  designForm.clearAll(true);
});
</script>

<style lang="scss" scoped></style>
