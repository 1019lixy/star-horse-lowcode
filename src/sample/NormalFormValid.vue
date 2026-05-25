<script setup lang="ts" name="Areainfo">
import {onMounted, provide, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm, StarHorseTableComp} from "@/components/comp";
import {apiInstance, closeLoad, dialogPreps, load} from "@/api/star_horse_utils";
import {download} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {ApiUrls} from "@/components/types";

const dataUrl: ApiUrls = apiInstance("http://userdb-manage", "////generator/code");
console.log(dataUrl);
const testFormValidRef = ref();
const outerData: any = {
  backgroundSize: "http你好%",
  qrcode: "http://www.baidu.com",
  barcode: "22222223333",
};
const fieldList = ref<PageFieldInfo>({
  "fieldList": [
    {
      "fieldName": "input4",
      "formVisible": true,
      "id": "Idsh40913d60-94a2-4795-aa43-63c5eda40165",
      "label": "条件1",
      "listVisible": true,
      "preps": {
        "clearable": true,
        "formula": {
          "enable": false,
          "expression": "",
          "sourceFields": [],
          "type": "calc"
        },
        "maxLength": 255,
        "placeholder": "请输入条件1",
        "rules": []
      },
      "type": "input",
      "viewVisible": true
    },
    {
      "fieldName": "input1",
      "formVisible": true,
      "id": "Idshe3559c9b-1c73-4b29-ad9e-946ed4596087",
      "label": "条件2",
      "listVisible": true,
      "preps": {
        "clearable": true,
        "formula": {
          "enable": false,
          "expression": "",
          "sourceFields": [],
          "type": "calc"
        },
        "maxLength": 255,
        "placeholder": "请输入条件2",
        "rules": []
      },
      "type": "input",
      "viewVisible": true
    },
    {
      "fieldName": "input2",
      "formVisible": true,
      "id": "Idsh43f4f981-c96a-4718-876a-5bfd33fd753f",
      "label": "单行文本框",
      "listVisible": true,
      "preps": {
        "clearable": true,
        "formula": {
          "enable": false,
          "expression": "",
          "sourceFields": [],
          "type": "calc"
        },
        "maxLength": 255,
        "placeholder": "请输入单行文本框",
        "rules": []
      },
      "type": "input",
      "viewVisible": true
    },
    {
      "fieldName": "number3",
      "formVisible": true,
      "id": "Idshccd5b29e-88c2-4ee2-b4d1-c0ead6f4f9a3",
      "label": "数字输入框",
      "listVisible": true,
      "preps": {
        "clearable": true,
        "formula": {
          "enable": true,
          "expression": "${input4}+${input1}",
          "sourceFields": [
            "input4",
            "input1"
          ],
          "suffix": "%",
          "type": "calc"
        },
        "maxLength": 10,
        "placeholder": "请输入数字输入框",
        "rules": [],
        "step": 1
      },
      "type": "number",
      "viewVisible": true
    },
    {
      "dytableList": [
        [
          {
            "fieldName": "input8",
            "formVisible": true,
            "id": "Idsh1e1ea4fe-c495-488d-98b6-c62d44a53b67",
            "label": "单行文本框",
            "listVisible": true,
            "preps": {
              "cellVisible": true,
              "clearable": true,
              "colspan": 1,
              "formula": {
                "enable": true,
                "expression": "${input4}-${input1}",
                "sourceFields": [
                  "input4",
                  "input1"
                ],
                "suffix": "%",
                "type": "calc"
              },
              "maxLength": 255,
              "placeholder": "请输入单行文本框",
              "rowspan": 1,
              "rules": []
            },
            "type": "input",
            "viewVisible": true
          },
          {
            "fieldName": "number9",
            "formVisible": true,
            "id": "Idshdb821fc2-de12-4b7f-82a7-b7925d30e753",
            "label": "数字输入框",
            "listVisible": true,
            "preps": {
              "cellVisible": true,
              "clearable": true,
              "colspan": 1,
              "formula": {
                "enable": false,
                "expression": "",
                "sourceFields": [],
                "type": "calc"
              },
              "maxLength": 10,
              "placeholder": "请输入数字输入框",
              "rowspan": 1,
              "rules": [],
              "step": 1
            },
            "type": "number",
            "viewVisible": true
          },
          {
            "formVisible": false,
            "preps": {
              "cellVisible": true,
              "colspan": 1,
              "rowspan": 1
            },
            "type": "empty",
            "viewVisible": true
          }
        ],
        [
          {
            "fieldName": "input6",
            "formVisible": true,
            "id": "Idsh4c915615-55b9-4a17-a5f9-900ef0842a1c",
            "label": "单行文本框",
            "listVisible": true,
            "preps": {
              "cellVisible": true,
              "clearable": true,
              "colspan": 1,
              "columnNums": 1,
              "formula": {
                "enable": false,
                "expression": "",
                "sourceFields": [],
                "type": "calc"
              },
              "maxLength": 255,
              "placeholder": "请输入单行文本框",
              "rowNums": 1,
              "rowspan": 1,
              "rules": []
            },
            "type": "input",
            "viewVisible": true
          },
          {
            "fieldName": "input7",
            "formVisible": true,
            "id": "Idshb53e3ec1-04fb-47d0-8d7a-a2321ed9de22",
            "label": "单行文本框",
            "listVisible": true,
            "preps": {
              "cellVisible": true,
              "clearable": true,
              "colspan": 1,
              "formula": {
                "enable": false,
                "expression": "",
                "sourceFields": [],
                "type": "calc"
              },
              "maxLength": 255,
              "placeholder": "请输入单行文本框",
              "rowspan": 1,
              "rules": []
            },
            "type": "input",
            "viewVisible": true
          },
          {
            "formVisible": false,
            "preps": {
              "cellVisible": true,
              "colspan": 1,
              "rowspan": 1
            },
            "type": "empty",
            "viewVisible": true
          }
        ]
      ],
      "fieldName": ""
    }
  ],
  "stopAutoLoad": true
});
const initData = async () => {
};
const primaryKey = "idCodeGenerator";
const codeGeneratorRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const generateFormRef = ref();
const generateMerge = (type: string) => {
  console.log(generateFormRef.value.getFormData()?.value)
  generateFormRef.value.$refs.starHorseFormRef.validate((res: boolean) => {
    let dataForm: any = generateFormRef.value.getFormData()?.value;
    if (res) {
      load("代码生成中,请稍后...");
      if (dataForm["prefixesStr"]) {
        dataForm["prefixesList"] = dataForm["prefixesStr"].split(";");
      }
      let isError = false;
      download("/userdb-manage/generator/code/convertToCode", dataForm)
          .catch((err) => {
            isError = true;
            warning(err);
          })
          .finally(() => {
            closeLoad();
            if (type != "continue" && !isError) {
              closeAction();
            }
          });
    }
  });
};
const closeAction = () => {
  dialogProps.editVisible = false;
};
onMounted(() => {
  initData();
});
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
        :isShowBtnContinue="true"
        :dialogVisible="dialogProps.editVisible"
        :dialogProps="dialogProps"
        :selfFunc="false"
        @merge="generateMerge"
        @closeAction="closeAction"
        boxHeight="85%"
    >
      <star-horse-form
          ref="generateFormRef"
          @refresh="(formData,result)=>codeGeneratorRef?.assignStaticData(formData)"
          :compUrl="dataUrl"
          :preview="true"
          formSize="default"
          :fieldList="fieldList"
          :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
        :dialog-visible="dialogProps.viewVisible"
        :dialogProps="dialogProps"
        :source="3"
    >
      <star-horse-data-view
          :preview="true"
          :field-list="fieldList"
          :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
            @searchData="
                  (data: any) => codeGeneratorRef?.createSearchParams(data)
                "
            :formData="searchFormData"
            :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
          ref="codeGeneratorRef"
          :fieldList="fieldList"
          :primaryKey="primaryKey"
          :compUrl="dataUrl"
          :preview="true"
          :btn-permissions="{
                  edit: 'edit',
                  view: 'view',
                  delete: 'delete',
                  add:'add'
                }"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
