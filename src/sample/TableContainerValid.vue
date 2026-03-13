<template>
  <el-scrollbar>
    <table-container
        :formData="formData"
        :field="fields"
        :isDesign="true"
        :formInfo="{}"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import piniaInstance from "@/store";
import {useDesignFormStore} from "@/store/DesignForm";
import {onMounted, ref} from "vue";
import {analysisCompDatas} from "@/api/form_utils";
import TableContainer from "@/components/formcomp/container/table-container.vue";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
  test: "1-2-1",
});
const dataItem = ref<any>({});
const fields = {
  "id": "Idsh829d2794-3cb8-4b02-96b4-1c2655d1a646",
  "preps": {
    "id": "Idsh829d2794-3cb8-4b02-96b4-1c2655d1a646",
    "label": "动态列表",
    "itemNameLabel": "动态列表",
    "name": "table1",
    "elements": [
      {
        "id": "sh3b91d1f5-cbaf-4749-a8a3-809c6d526ad9",
        "colIndex": 1,
        "columns": 1,
        "items": [
          {
            "id": "Idshb790dbe5-4215-4e86-94d9-abe715ce0b55",
            "preps": {
              "id": "Idshb790dbe5-4215-4e86-94d9-abe715ce0b55",
              "label": "单行文本框",
              "itemNameLabel": "单行文本框",
              "name": "input2",
              "clearable": true,
              "readonly": false,
              "placeholder": "请输入单行文本框",
              "rules": [],
              "maxLength": 255,
              "formVisible": true,
              "listVisible": true,
              "viewVisible": true
            },
            "compType": "formItem",
            "fieldName": "input2",
            "itemType": "input",
            "label": "单行文本框",
            "type": "input"
          }
        ]
      },
      {
        "colIndex": 2,
        "items": [
          {
            "id": "Idsh49036256-5b09-45ea-a9da-ed64610ce886",
            "preps": {
              "id": "Idsh49036256-5b09-45ea-a9da-ed64610ce886",
              "label": "单行文本框",
              "itemNameLabel": "单行文本框",
              "name": "input3",
              "clearable": true,
              "readonly": false,
              "placeholder": "请输入单行文本框",
              "rules": [],
              "maxLength": 255,
              "formVisible": true,
              "listVisible": true,
              "viewVisible": true
            },
            "compType": "formItem",
            "fieldName": "input3",
            "itemType": "input",
            "label": "单行文本框",
            "type": "input"
          }
        ]
      },
      {
        "colIndex": 3,
        "items": [
          {
            "id": "Idsh21f9f594-594d-427a-a1de-f5df5681b16a",
            "preps": {
              "id": "Idsh21f9f594-594d-427a-a1de-f5df5681b16a",
              "label": "单行文本框",
              "itemNameLabel": "单行文本框",
              "name": "input4",
              "clearable": true,
              "readonly": false,
              "placeholder": "请输入单行文本框",
              "rules": [],
              "maxLength": 255,
              "formVisible": true,
              "listVisible": true,
              "viewVisible": true
            },
            "compType": "formItem",
            "fieldName": "input4",
            "itemType": "input",
            "label": "单行文本框",
            "type": "input"
          }
        ]
      },
      {
        "colIndex": 4,
        "items": [
          {
            "id": "Idshbbb4ea6d-7ce2-4650-90d6-c88cb0c900b9",
            "preps": {
              "id": "Idshbbb4ea6d-7ce2-4650-90d6-c88cb0c900b9",
              "label": "单行文本框",
              "itemNameLabel": "单行文本框",
              "name": "input5",
              "clearable": true,
              "readonly": false,
              "placeholder": "请输入单行文本框",
              "rules": [],
              "maxLength": 255,
              "formVisible": true,
              "listVisible": true,
              "viewVisible": true
            },
            "compType": "formItem",
            "fieldName": "input5",
            "itemType": "input",
            "label": "单行文本框",
            "type": "input"
          }
        ]
      },
      {
        "colIndex": 5,
        "items": [
          {
            "id": "Idsh505a394a-6d9d-4496-b6c5-dee6e72d1da9",
            "preps": {
              "id": "Idsh505a394a-6d9d-4496-b6c5-dee6e72d1da9",
              "label": "单行文本框",
              "itemNameLabel": "单行文本框",
              "name": "input6",
              "clearable": true,
              "readonly": false,
              "placeholder": "请输入单行文本框",
              "rules": [],
              "maxLength": 255,
              "formVisible": true,
              "listVisible": true,
              "viewVisible": true
            },
            "compType": "formItem",
            "fieldName": "input6",
            "itemType": "input",
            "label": "单行文本框",
            "type": "input"
          }
        ]
      }
    ],
    "columns": 5
  },
  "compType": "container",
  "fieldName": "table1",
  "itemType": "table",
  "type": "table"
};
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result?.fieldList?.[0];
  console.log("xxx", result);
});
</script>

<style lang="scss" scoped></style>
