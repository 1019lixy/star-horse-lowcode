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
  fieldList: [{
    label: "属性1",
    fieldName: "prep1",

  }, {
    label: "属性2",
    fieldName: "prep2",

  }, {
    label: "属性3",
    fieldName: "prep3",
    preps: {
      formula: {
        enable: true,
        type: "calc",
        sourceFields: ["prep1", "prep2"],
        expression: "${prep2}/${prep1}*100",
        suffix:"%"
      }
    }
  }]

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
