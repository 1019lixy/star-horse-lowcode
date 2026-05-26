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
  "fieldList": [{"fieldName":"condition1","label":"条件组","type":"condition","compType":"container","itemType":"condition","children":[{"label":"字段1","fieldName":"leaf_sh2aad","type":"input","formVisible":true,"listVisible":true,"id":"Idsh367410ea-4e06-4c96-9b2a-d7e1a6386f85","preps":{"clearable":true,"placeholder":"请输入字段1"}},{"label":"字段2","fieldName":"leaf_shb327","type":"input","formVisible":true,"listVisible":true,"id":"Idsh50afa37d-9308-453e-a678-d3ba463ae89c","preps":{"clearable":true,"placeholder":"请输入字段2"}},{"fieldName":"condition_sha772","label":"子条件3","type":"group","compType":"container","itemType":"condition","children":[{"label":"字段1","fieldName":"leaf_sh2a29","type":"input","formVisible":true,"listVisible":true,"id":"Idsh39879ab2-4efe-413f-be35-9094bc2fa7e3","preps":{"clearable":true,"placeholder":"请输入字段1"}},{"fieldName":"condition_she0c4","label":"子条件2","type":"group","compType":"container","itemType":"condition","children":[{"label":"字段1","fieldName":"leaf_shbecf","type":"input","formVisible":true,"listVisible":true,"id":"Idshe3ca85a2-ac2b-43fa-9e77-09354f9b2647","preps":{"clearable":true,"placeholder":"请输入字段1"}},{"label":"字段2","fieldName":"leaf_sh43df","type":"input","formVisible":true,"listVisible":true,"id":"Idsh476f4940-80f8-423d-b60b-77cc6e7eea7a","preps":{"clearable":true,"placeholder":"请输入字段2"}},{"fieldName":"condition_sh597b","label":"子条件3","type":"group","compType":"container","itemType":"condition","children":[{"label":"字段1","fieldName":"leaf_sh9626","type":"input","formVisible":true,"listVisible":true,"id":"Idshdf98acba-ff24-4cee-a41b-627c30513565","preps":{"clearable":true,"placeholder":"请输入字段1"}},{"label":"字段2","fieldName":"leaf_sh80d6","type":"input","formVisible":true,"listVisible":true,"id":"Idsh111a2d92-dbad-4cfb-8d77-e788a1d3c228","preps":{"clearable":true,"placeholder":"请输入字段2"}}]},{"label":"字段4","fieldName":"leaf_sh30c4","type":"input","formVisible":true,"listVisible":true,"id":"Idsh28a2ab23-3e75-4334-be63-34f145dbbe2c","preps":{"clearable":true,"placeholder":"请输入字段4"}}]},{"label":"字段3","fieldName":"leaf_sh2578","type":"input","formVisible":true,"listVisible":true,"id":"Idsha92a0181-321f-4efe-8f34-59c7a0048172","preps":{"clearable":true,"placeholder":"请输入字段3"}}]},{"label":"字段4","fieldName":"leaf_sh5edb","type":"input","formVisible":true,"listVisible":true,"id":"Idsh46a35de5-5c48-473d-97b8-fa5d4dd7bd53","preps":{"clearable":true,"placeholder":"请输入字段4"}}]}]
  ,
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
