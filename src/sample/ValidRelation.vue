<script setup lang="ts" name="Areainfo">
import { apiInstance, dialogPreps } from "@/api/star_horse_utils";
import { ApiUrls } from "@/components/types/ApiUrls";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import { SearchFields, SelectOption } from "@/components/types/SearchProps";
import { nextTick, onMounted, provide, reactive, ref, watch } from "vue";

const dataUrl: ApiUrls = apiInstance("system-config", "system/areainfo");
const linkExecServerList = ref<SelectOption[]>([]);
const codeCommitorList = ref<SelectOption[]>([]);

const reportPersonList = ref<SelectOption[]>([]);
const reportTypeList = ref<SelectOption[]>([]);

const searchFormData = reactive<SearchFields>({
  fieldList: [
    {
      label: "区域名称",
      defaultVisible: true,
      matchType: "lk",
      fieldName: "areaName",
    },
    {
      label: "区域编码",
      defaultVisible: true,
      matchType: "lk",
      fieldName: "areaCode",
    },
  ],
});
const tableFieldList = reactive<PageFieldInfo>({
  fieldList: [
    {
      fieldName: "row1",
      collapseList: [
        {
          title: "高级设置",
          tabName: "row1",
          subFormFlag: "N",
          objectName: "advancedSetting",
          fieldList: [
            [
              {
                label: "  ",
                type: "checkbox",
                formVisible: true,
                fieldName: "singleImageFlag",
                preps: {
                  values: [{ name: "使用唯一镜像名称", value: "Y" }],
                  colspan: 6,
                  border: "Y",
                },
              },
              {
                label: "关联使用执行机",
                type: "select",
                formVisible: true,
                fieldName: "linkExecServer",
                preps: {
                  values: linkExecServerList,
                  colspan: 6,
                },
              },
            ],
          ],
        },
        {
          title: "运行结果通知",
          tabName: "result",
          subFormFlag: "Y",
          objectName: "resultReport",
          fieldList: [
            [
              {
                label: "失败时通知",
                type: "select",
                fieldName: "errorReport",
                formVisible: true,

                preps: {
                  dataRelation: {
                    actionName: "change",
                    relationDetails: [
                      {
                        matchType: "eq",
                        controlCondition: "eqVisible",
                        relationFields: [
                          "errorReportPerson",
                          "errorReportType",
                        ],
                        matchFieldValue: "Y",
                      },
                    ],
                  },
                  values: [
                    {
                      name: "Y",
                      value: "Y",
                    },
                    {
                      name: "N",
                      value: "N",
                    },
                  ],
                  colspan: 6,
                },
              },
            ],
            {
              label: "通知人",
              type: "checkbox",
              formVisible: false,
              fieldName: "errorReportPerson",
              preps: {
                values: reportPersonList,
                border: "Y",
              },
              brotherNodes: [
                {
                  type: "select",
                  label: "  ",
                  fieldName: "errorCodeCommitor",
                  preps: {
                    values: codeCommitorList,
                    multiple: true,
                  },
                },
              ],
            },
            {
              label: "通知方式",
              type: "checkbox",
              formVisible: false,
              fieldName: "errorReportType",
              preps: {
                values: reportTypeList,
                border: "Y",
              },
            },
            [
              {
                label: "成功时通知",
                type: "switch",
                defaultValue: "N",
                fieldName: "successReport",
                formVisible: true,
                preps: {
                  dataRelation: {
                    actionName: "change",
                    relationDetails: [
                      {
                        matchType: "eq",
                        controlCondition: "eqVisible",
                        relationFields: [
                          "successReportPerson",
                          "successReportType",
                        ],
                        matchFieldValue: "Y",
                      },
                    ],
                  },
                  activeValue: "Y",
                  inactiveValue: "N",
                  colspan: 6,
                },
              },
            ],
            {
              label: "通知人",
              type: "checkbox",
              formVisible: true,
              fieldName: "successReportPerson",
              preps: {
                values: reportPersonList,
                border: "Y",
              },
              brotherNodes: [
                {
                  type: "select",
                  label: "  ",
                  fieldName: "successCodeCommitorVisible",
                  preps: {
                    values: codeCommitorList,
                    multiple: true,
                  },
                },
              ],
            },
            {
              label: "通知方式",
              type: "checkbox",
              formVisible: true,
              fieldName: "successReportType",
              preps: {
                values: reportTypeList,
              },
            },
          ],
        },
      ],
    },
  ],
  batchFieldList: [],
});
const primaryKey = "idAreainfo";
const areainfoRef = ref();
const areaFormRef = ref();
const rules = {};
const dialogProps = dialogPreps();
provide("dialogProps", dialogProps);
//手动赋值权限
const btnPermissions = {
  add: true,
  edit: true,
  delete: true,
  view: true,
};
const dataFormat = (_name: string, cellValue: object): any => {
  return cellValue;
};
const initData = async () => {
  // loadDict("message_tools").then((res: any) => {
  //   reportTypeList.value = res;
  // });
  // loadDict("CONTINUS_JOB_REPORT_PERSON").then((res: any) => {
  //   console.log(res);
  //   reportPersonList.value = res;
  // });
  await nextTick(() => {
    setTimeout(() => {
      assignValues();
    }, 1000);
  });
};
const assignValues = () => {
  areaFormRef.value?.setFormData({
    result: { errorReport: "N", successReport: "N" },
    resultReport: [
      { errorReport: "Y", successReport: "N" },
      { errorReport: "Y", successReport: "N" },
    ],
  });
};
onMounted(() => {
  initData();
});
watch(
  () => dialogProps.editVisible,
  (newVal: boolean) => {
    if (newVal) {
      initData();
    }
  },
);
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <star-horse-dialog
      :isShowBtnContinue="true"
      :dialogVisible="dialogProps.editVisible"
      :dialogProps="dialogProps"
    >
      {{ areaFormRef?.getFormData() }}
      <el-button type="primary" @click="assignValues">赋值</el-button>
      <star-horse-form
        ref="areaFormRef"
        @refresh="areainfoRef?.loadByPage()"
        :compUrl="dataUrl"
        :fieldList="tableFieldList"
        :rules="rules"
      />
    </star-horse-dialog>
    <star-horse-dialog
      :dialog-visible="dialogProps.viewVisible"
      :dialogProps="dialogProps"
      :source="3"
    >
      <star-horse-data-view
        :dataFormat="dataFormat"
        :field-list="tableFieldList"
        :compUrl="dataUrl"
      />
    </star-horse-dialog>
    <div class="search-content">
      <div class="search_btn">
        <star-horse-search-comp
          @searchData="(data: any) => areainfoRef?.createSearchParams(data)"
          :formData="searchFormData"
          :compUrl="dataUrl"
        />
      </div>
    </div>
    <el-card class="inner_content">
      <star-horse-table-comp
        ref="areainfoRef"
        :fieldList="tableFieldList"
        :btnPermissions="btnPermissions"
        :primaryKey="primaryKey"
        :compUrl="dataUrl"
        :dataFormat="dataFormat"
        :showPageBar="false"
      />
    </el-card>
  </div>
</template>
<style lang="scss" scoped></style>
