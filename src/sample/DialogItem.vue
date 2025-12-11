<template>
  {{ formData }}
  <template v-for="data in fields">
    <component
        :field="data"
        v-model:formData="formData"
        :isDesign="false"
        :formInfo="fields"
        :showFormItem="true"
        :bareFlag="false"
        :is="data.itemType + '-item'"
    />
  </template>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";

const formData = ref<any>({});
const fields = ref<Array<any>>([{"id": "Idsh9ddae26d-f380-4e70-a805-31e127b82bbc",
      "preps": {
        "id": "Idsh9ddae26d-f380-4e70-a805-31e127b82bbc",
        "label": "模态窗口2",
        "itemNameLabel": "模态窗口",
        "name": "dialog1",
        "clearable": true,
        "readonly": false,
        "rules": [],
        "maxLength": 255,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "fieldList": "{\n fieldList:[\n {\n label:\"Test\",\n fieldName:\"test\", type:\"input\", \n formVisible:true\n }\n ]\n}"
      },
      "compType": "formItem",
      "fieldName": "dialog1",
      "itemType": "dialog",
      "label": "模态窗口",
      "type": "dialog"
    }, {"id": "Idsh4b555d09-13fa-47b9-9b78-36f555ca85b7",
      "preps": {
        "id": "Idsh4b555d09-13fa-47b9-9b78-36f555ca85b7",
        "label": "数字输入框",
        "itemNameLabel": "数字输入框",
        "name": "number1",
        "clearable": true,
        "readonly": false,
        "placeholder": "请输入数字输入框",
        "rules": [],
        "maxLength": 10,
        "formVisible": true,
        "listVisible": true,
        "viewVisible": true,
        "step": 1,
        "min": 0,
        "precision": 0
      },
      "compType": "formItem",
      "fieldName": "number1",
      "itemType": "json",
      "label": "数字输入框",
      "type": "json"
    }, {
     "id": "Idsh4b555d09-13fa-47b9-9b78-36f555ca85b8",
      "preps": {
        "label": "上传信息",
        multiple:false
      },
      "compType": "formItem",
      "fieldName": "number2",
      "itemType": "upload",
      "label": "上传信息",
      "type": "upload"
    }]
);
onMounted(() => {
});
</script>

<style lang="scss" scoped></style>
