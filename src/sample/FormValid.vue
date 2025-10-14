<script setup lang="ts" name="Areainfo">
import {onMounted, reactive} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm} from "@/components/comp";

const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [{
    "id": "Idshc2651bcc-3542-4005-b295-0d9b0bf10e13",
    "preps": {
      "placeholder": "请输入单行文本框",
      "resize": "both",
      "id": "Idshc2651bcc-3542-4005-b295-0d9b0bf10e13",
      "label": "单行文本框",
      "itemNameLabel": "单行文本框",
      "name": "input1",
      "clearable": true,
      "readonly": false,
      "rules": [],
      "maxLength": 255,

      "suffixIcon": "align_bottom",
      "showWordLimit": false,
      "prependList": "[\n {\n name: 'abc',\n value: 'abc',\n xh: 1,\n },\n {\n name: 'abe',\n value: 'abe',\n xh: 2,\n },\n]",
      "appendList": [{name: "append1", value: "append1"}]
    },
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "compType": "formItem",
    "fieldName": "input1",
    "itemType": "input",
    "label": "单行文本框",
    "type": "input"
  }, {
    "id": "Idsh0f1446e8-1052-40c9-bfff-b742e0c65ee1",
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "preps": {
      "placeholder": "请输入数字输入框",
      "controlsPosition": "right",
      "id": "Idsh0f1446e8-1052-40c9-bfff-b742e0c65ee1",
      "label": "数字输入框",
      "itemNameLabel": "数字输入框",
      "name": "number2",
      "clearable": true,
      "readonly": false,
      "step": 1,
      "min": 0,
      "precision": 0,
      "rules": [],
      "maxLength": 10,

      "suffix": "RMB",
      "prefix": "sss"
    },
    "compType": "formItem",
    "fieldName": "number2",
    "itemType": "number",
    "label": "数字输入框",
    "type": "number"
  }, {
    "id": "Idsh84fcce4a-62f8-44c8-a4cb-79219e752e3f",
    "preps": {
      "id": "Idsh84fcce4a-62f8-44c8-a4cb-79219e752e3f",
      "label": "数据范围",
      "itemNameLabel": "数据范围",
      "name": "number-range1",
      "clearable": true,
      "readonly": false,
      "minPlaceholder": "请输入最小值",
      "maxPlaceholder": "请输入最大值",
      "rules": [],
      "maxLength": 255,
      controlsPosition: "right",
      "prefix": "$$",
      "prependList": [],
      "appendText": "b",
      suffix: "RMB",
      "appendList": []
    },
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "compType": "formItem",
    "fieldName": "number-range1",
    "itemType": "number-range",
    "label": "数据范围",
    "type": "number-range"
  },{
    label:"Json",
    fieldName: "json",
    itemType: "json",
    type: "json",
    defaultValue:'{ "id": "sh9e3e32b4-47cd-48e9-b2d0-9c9a8ecdb272", "name": "发起人", "type": "ApplyNode", "statusCode": -1, "error": true, "errorMsg": "未配置表单", "formId": "", "formType": "", "privilege": "edit", "childNode": { "id": "sh3527710b-956f-4fc3-8869-bf4be20b53ca", "name": "结束", "type": "EndNode", "statusCode": -1, "errorMsg": "", "error": false }, "addable": true }',
    formVisible: true,
    listVisible: true,
    viewVisible: true,
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
