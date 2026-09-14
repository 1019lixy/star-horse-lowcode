<script setup lang="ts" name="Areainfo">
import { onMounted, provide, ref } from "vue";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { StarHorseForm, StarHorseTableComp } from "@/components/comp";
import {
  apiInstance,
  closeLoad,
  dialogPreps,
  load,
} from "@/api/star_horse_utils";
import { download } from "@/api/star_horse_apis";
import { warning } from "@/utils/message";
import { ApiUrls } from "@/components/types";

const apiEndpoints: ApiUrls = apiInstance(
  "http://userdb-manage",
  "////generator/code",
);
console.log(apiEndpoints);
const testFormValidRef = ref();
const outerData: any = {
  backgroundSize: "http你好%",
  qrcode: "http://www.baidu.com",
  barcode: "22222223333",
};
const fieldList = ref<PageFieldInfo>({
  fieldList: [],
});
/*const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "数据",
      type: "json",
      fieldName: "dataJson",
      formVisible: true,
      listVisible:true,
      preps: {
        rows: 8,
      },
    },
    {
      label: "背景颜色",
      type: "htmleditor",
      fieldName: "backgroundColor",
      formVisible: true,
      listVisible:true,
      preps: {
        colorFormat: "rgb",
      },
    },
    {
      label: "背景图片",
      type: "upload",
      fieldName: "backgroundImage",
      formVisible: true,
      listVisible:true,
      preps: {
        listType: "picture-card",
        drag: true,
        showFileList: true,
      },
    },
    {
      label: "背景大小",
      type: "input",
      fieldName: "backgroundSize",
      formVisible: true,
      listVisible:true,
      preps: {
        mergePrefix: true,
        mergeAppend: true,
        appendList: [
          {name: "%", value: "%"},
          {name: "px", value: "px"},
        ],
        prependList: [
          {name: "http", value: "http"},
          {name: "https", value: "https"},
        ],
      },
    },
    {
      label: "验证数字",
      type: "number",
      fieldName: "validNumber",
      formVisible: true,
      listVisible:true,
      preps: {
        mergePrefix: true,
        mergeAppend: true,
        appendList: [
          {name: "%", value: "%"},
          {name: "px", value: "px"},
          {name: "fr", value: "fr"},
        ],
        prependList: [
          {name: "http", value: "http"},
          {name: "https", value: "https"},
        ],
      },
    },
    {
      label: "背景重复",
      type: "radio",
      fieldName: "backgroundRepeat",
      formVisible: true,
      listVisible:true,
      preps: {
        values: [
          {name: "不重复", value: "no-repeat"},
          {name: "重复", value: "repeat"},
          {name: "水平方向重复", value: "repeat-x"},
          {name: "垂直方向重复", value: "repeat-y"},
          {name: "重复，空白区域填充", value: "space"},
        ],
      },
    },
    {
      label: "签名",
      type: "signature",
      fieldName: "signature",
      formVisible: true,
      listVisible:true,
      preps: {
        imageType: "jpg",
      },
    },
    {
      label: "二维码",
      formVisible: true,
      listVisible:true,
      type: "qrcode",
      fieldName: "qrcode",
    },
    {
      label: "条形码",
      type: "barcode",
      formVisible: true,
      listVisible:true,
      fieldName: "barcode",
    },
    {
      label: "数据选择器",
      type: "datapicker",
      formVisible: true,
      listVisible:true,
      fieldName: "datapicker",
      preps: {
        dataSource: "url",
        apiDataSource: {
          apiInfo: {
            url: "/system-config/system/usersinfo/pageList",
            httpMethod: "POST",
            requestDataType: "json",
            apiType: "systemApi",
          },
          optionField: {
            labelField: "name",
            valueField: "username",
          },
          responseMode: "options",
        },
      }
    },
  ],
});*/
const initData = async () => {};
const primaryKey = "idCodeGenerator";
const codeGeneratorRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
const generateFormRef = ref();
const generateMerge = (type: string) => {
  console.log(generateFormRef.value.getFormData()?.value);
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
        @refresh="
          (formData, result) => codeGeneratorRef?.assignStaticData(formData)
        "
        :apiEndpoints="apiEndpoints"
        :preview="true"
        formSize="default"
        :fieldList="fieldList"
        :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
      v-model="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
    >
      <star-horse-data-view
        :preview="true"
        :field-list="fieldList"
        :apiEndpoints="apiEndpoints"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
          @searchData="
            (data: any) => codeGeneratorRef?.createSearchParams(data)
          "
          :formData="searchFormData"
          :apiEndpoints="apiEndpoints"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
        ref="codeGeneratorRef"
        :fieldList="fieldList"
        :primaryKey="primaryKey"
        :apiEndpoints="apiEndpoints"
        :preview="true"
        :btn-permissions="{
          edit: 'edit',
          view: 'view',
          delete: 'delete',
          add: 'add',
        }"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
