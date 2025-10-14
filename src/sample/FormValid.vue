<script setup lang="ts" name="Areainfo">
import {onMounted, reactive} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm} from "@/components/comp";

const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [{
    "id": "Idshf3cc32e8-bde3-434f-b940-57c9d06b5024",
    "formVisible": true,
    "preps": {
      "placeholder": "请输入模板名称",
      "maxLength": 100,
      "showWordLimit": false,
      "autocomplete": false,
      "id": "Idshf3cc32e8-bde3-434f-b940-57c9d06b5024",
      "label": "模板名称",
      "itemNameLabel": "单行文本框",
      "name": "templateName",
      "rules": [],
      "formVisible": true,
      "searchVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "hideLabel": false,
      "required": true,
      "disabled": false,
      "editDisabled": false,
      "clearable": true,
      "readonly": false,
      "prototypeDisplay": false,
      "listPrototypeDisplay": false,
      "uniqueValid": false
    },
    "compType": "formItem",
    "itemType": "input",
    "priority": 1,
    "type": "input",
    "fieldName": "templateName",
    "label": "模板名称"
  }, {
    "id": "Idshba2d3ae4-3811-4b4c-971c-15154ca896bd",
    "formVisible": true,
    "preps": {
      "placeholder": "请输入模板编码",
      "maxLength": 100,
      "id": "Idshba2d3ae4-3811-4b4c-971c-15154ca896bd",
      "label": "模板编码",
      "itemNameLabel": "单行文本框",
      "name": "templateCode",
      "rules": [],
      "formVisible": true,
      "searchVisible": true,
      "listVisible": true,
      "viewVisible": true,
      "hideLabel": false,
      "required": true,
      "disabled": false,
      "editDisabled": false,
      "clearable": true,
      "readonly": false,
      "prototypeDisplay": false,
      "listPrototypeDisplay": false,
      "uniqueValid": false
    },
    "compType": "formItem",
    "itemType": "input",
    "priority": 2,
    "label": "模板编码",
    "type": "input"
  }, {
    "batchFieldList": [{
      batchName:"other",
      fieldList: [{
        "id": "Idsh02578986-f8ea-41db-8585-f56d7685eb9f",
        "formVisible": true,
        "preps": {
          "placeholder": "请选择节点名称",
          "maxLength": 100,
          "showWordLimit": false,
          "autocomplete": false,
          "id": "Idsh02578986-f8ea-41db-8585-f56d7685eb9f",
          "label": "节点名称",
          "itemNameLabel": "选择器",
          "name": "nodeName",
          "rules": [],
          "formVisible": true,
          "searchVisible": false,
          "listVisible": true,
          "viewVisible": true,
          "hideLabel": false,
          "required": true,
          "disabled": false,
          "editDisabled": false,
          "clearable": true,
          "readonly": false,
          "prototypeDisplay": false,
          "listPrototypeDisplay": false,
          "uniqueValid": false,
          "loading": false,
          "reserveKeyword": false,
          "allowCreate": true,
          "defaultFirstOption": false,
          "multiple": false,
          "filterable": true,
          "collapseTags": true,
          "collapseTagsTooltip": true,
          "fitInputWidth": false,

          "starHorseBtnName": "valid",
          "dataSource": "url",
          "httpMethod": "POST",
          "protocol": "http",
          "remote": true,
          "analysisType": "func",
          "redirect": true,
          "queryParams": [{"matchType": "notnull", "name": "dynamicFormNo", "value": " ", "xh": 1}],
          "url": "http://localhost:7758/userdb-manage-dev/userdb/formInstance/conNodeConfigures/idNodeConfigure/136/pageList",
          "selectLabel": "nodeName",
          "selectValue": "nodeCode"
        },
        "compType": "formItem",
        "itemType": "select",
        "priority": 3,
        "label": "节点名称",
        "fieldName": "nodeName",
        "type": "select"
      }]
    }]
  }]
});
const initData = async () => {
};

onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-form :field-list="tableFieldList"/>
  </div>
</template>
<style lang="scss" scoped></style>
