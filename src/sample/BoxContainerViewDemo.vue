<template>
  <el-scrollbar>
    <star-horse-data-view
      :dataForm="formData"
      :fieldList="dataItem"
      :formInfo="{}"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { analysisCompDatas } from "@/api/form_utils";
import { StarHorseDataView } from "@/components/comp";

const formData = ref<any>({
  test: "1-2-1",
});
const dataItem = ref<any>({});
const fields = [
  {
    "id": "Id21b1e846-befc-475d-89c2-4b086483b477",
    "compType": "container",
    "itemType": "anchor",
    "fieldName": "field2752A8",
    "preps": {
      "id": "Id21b1e846-befc-475d-89c2-4b086483b477",
      "label": "24-健康生活问卷",
      "name": "field2752A8",
      "itemNameLabel": "24-健康生活问卷",
      "direction": "vertical",
      "placement": "left",
      "showNavTitle": true,
      "navWidth": 200,
      "navPosition": "center",
      "showSectionNumber": false,
      "smoothScroll": true,
      "offset": 0,
      "stickyOffset": 0,
      "scrollOffset": 30,
      "highlightColor": "",
      "contentMaxHeight": "97vh",
      "elements": [
        {
          "label": "基本信息",
          "subTablePrimaryKey": "基本信息",
          "subTableName": "基本信息",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Id448dc094-f137-4e35-9b64-86a45a4fb3c3",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "field5F0145",
              "preps": {
                "id": "Id448dc094-f137-4e35-9b64-86a45a4fb3c3",
                "label": "基本信息",
                "name": "field5F0145",
                "itemNameLabel": "基本信息",
                "descTitle": "",
                "direction": "horizontal",
                "column": 2,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "基本信息",
                    "subTablePrimaryKey": "基本信息",
                    "subTableName": "基本信息",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Id44d06540-02e3-46d0-b454-92ec28344f04",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_dc2009",
                        "preps": {
                          "id": "Id44d06540-02e3-46d0-b454-92ec28344f04",
                          "label": "性别",
                          "name": "field_dc2009",
                          "itemNameLabel": "性别",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入性别",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "男",
                              "value": "1"
                            },
                            {
                              "name": "女",
                              "value": "2"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "性别",
                        "type": "radio"
                      },
                      {
                        "id": "Id9dbdbda6-7d3f-4595-a816-be2b78a4b114",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_70e4f0",
                        "preps": {
                          "id": "Id9dbdbda6-7d3f-4595-a816-be2b78a4b114",
                          "label": "年龄段信息2",
                          "name": "field_70e4f0",
                          "itemNameLabel": "年龄段",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入年龄段",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "18岁以下",
                              "value": "1"
                            },
                            {
                              "name": "18-25岁",
                              "value": "2"
                            },
                            {
                              "name": "26-35岁",
                              "value": "3"
                            },
                            {
                              "name": "36-45岁",
                              "value": "4"
                            },
                            {
                              "name": "46-55岁",
                              "value": "5"
                            },
                            {
                              "name": "55岁以上",
                              "value": "6"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "年龄段信息2",
                        "type": "radio"
                      },
                      {
                        "id": "Id89a20bb4-a18c-45aa-86df-17d0ca612c80",
                        "compType": "formItem",
                        "itemType": "number",
                        "fieldName": "field_027380",
                        "preps": {
                          "id": "Id89a20bb4-a18c-45aa-86df-17d0ca612c80",
                          "label": "身高(cm)",
                          "name": "field_027380",
                          "itemNameLabel": "身高(cm)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入身高(cm)",
                          "values": [],
                          "rules": [],
                          "min": 50,
                          "precision": 0,
                          "step": 1,
                          "hideLabel": true
                        },
                        "label": "身高(cm)",
                        "type": "number"
                      },
                      {
                        "id": "Id1aeca7fd-ebe1-427b-b47b-0617232cac54",
                        "compType": "formItem",
                        "itemType": "number",
                        "fieldName": "field_eaf92c",
                        "preps": {
                          "id": "Id1aeca7fd-ebe1-427b-b47b-0617232cac54",
                          "label": "体重(kg)",
                          "name": "field_eaf92c",
                          "itemNameLabel": "体重(kg)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入体重(kg)",
                          "values": [],
                          "rules": [],
                          "min": 20,
                          "precision": 1,
                          "step": 1,
                          "hideLabel": true
                        },
                        "label": "体重(kg)",
                        "type": "number"
                      },
                      {
                        "id": "Id49875519-18df-4fcb-b2b3-b93eaafe7751",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_3872e2",
                        "preps": {
                          "id": "Id49875519-18df-4fcb-b2b3-b93eaafe7751",
                          "label": "学历",
                          "name": "field_3872e2",
                          "itemNameLabel": "学历",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入学历",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "初中及以下",
                              "value": "1"
                            },
                            {
                              "name": "高中",
                              "value": "2"
                            },
                            {
                              "name": "大专",
                              "value": "3"
                            },
                            {
                              "name": "本科",
                              "value": "4"
                            },
                            {
                              "name": "硕士及以上",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "学历",
                        "type": "radio"
                      },
                      {
                        "id": "Id8ff84ff5-5c7f-4055-9b67-474c6112cc8b",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_579302",
                        "preps": {
                          "id": "Id8ff84ff5-5c7f-4055-9b67-474c6112cc8b",
                          "label": "职业",
                          "name": "field_579302",
                          "itemNameLabel": "职业",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入职业",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "学生",
                              "value": "1"
                            },
                            {
                              "name": "上班族",
                              "value": "2"
                            },
                            {
                              "name": "自由职业",
                              "value": "3"
                            },
                            {
                              "name": "退休",
                              "value": "4"
                            },
                            {
                              "name": "其他",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "职业",
                        "type": "radio"
                      },
                      {
                        "id": "Ide5e50038-a669-4f0e-aa14-21c624c80c43",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_6e5cce",
                        "preps": {
                          "id": "Ide5e50038-a669-4f0e-aa14-21c624c80c43",
                          "label": "职业(其他请说明)",
                          "name": "field_6e5cce",
                          "itemNameLabel": "职业(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "职业(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Idf477f1a8-3b6d-49b2-b858-f8f40d30254d",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_f5fb8f",
                        "preps": {
                          "id": "Idf477f1a8-3b6d-49b2-b858-f8f40d30254d",
                          "label": "婚姻状况",
                          "name": "field_f5fb8f",
                          "itemNameLabel": "婚姻状况",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入婚姻状况",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "未婚",
                              "value": "1"
                            },
                            {
                              "name": "已婚",
                              "value": "2"
                            },
                            {
                              "name": "离异",
                              "value": "3"
                            },
                            {
                              "name": "丧偶",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "婚姻状况",
                        "type": "radio"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "基本信息",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        },
        {
          "label": "饮食习惯",
          "subTablePrimaryKey": "饮食习惯",
          "subTableName": "饮食习惯",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Id51f20669-ef48-48a9-b59d-8e468b052940",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "fieldCf93F6",
              "preps": {
                "id": "Id51f20669-ef48-48a9-b59d-8e468b052940",
                "label": "饮食习惯",
                "name": "fieldCf93F6",
                "itemNameLabel": "饮食习惯",
                "descTitle": "",
                "direction": "horizontal",
                "column": 2,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "饮食习惯",
                    "subTablePrimaryKey": "饮食习惯",
                    "subTableName": "饮食习惯",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Idd888cfb9-cade-492c-9aae-77028f7221ee",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_fa4191",
                        "preps": {
                          "id": "Idd888cfb9-cade-492c-9aae-77028f7221ee",
                          "label": "每天吃几餐",
                          "name": "field_fa4191",
                          "itemNameLabel": "每天吃几餐",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每天吃几餐",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "一餐",
                              "value": "1"
                            },
                            {
                              "name": "两餐",
                              "value": "2"
                            },
                            {
                              "name": "三餐",
                              "value": "3"
                            },
                            {
                              "name": "三餐以上",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每天吃几餐",
                        "type": "radio"
                      },
                      {
                        "id": "Id6d5d53f6-5368-4e1b-81d4-64b71b9d4786",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_0d08b4",
                        "preps": {
                          "id": "Id6d5d53f6-5368-4e1b-81d4-64b71b9d4786",
                          "label": "是否经常吃早餐",
                          "name": "field_0d08b4",
                          "itemNameLabel": "是否经常吃早餐",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否经常吃早餐",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天都吃",
                              "value": "1"
                            },
                            {
                              "name": "经常吃",
                              "value": "2"
                            },
                            {
                              "name": "偶尔吃",
                              "value": "3"
                            },
                            {
                              "name": "几乎不吃",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否经常吃早餐",
                        "type": "radio"
                      },
                      {
                        "id": "Id098a96e8-2f3b-4c82-837d-3859648ba3a9",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_4d2bb4",
                        "preps": {
                          "id": "Id098a96e8-2f3b-4c82-837d-3859648ba3a9",
                          "label": "早餐通常吃什么",
                          "name": "field_4d2bb4",
                          "itemNameLabel": "早餐通常吃什么",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入早餐通常吃什么",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "面包牛奶",
                              "value": "1"
                            },
                            {
                              "name": "粥/包子",
                              "value": "2"
                            },
                            {
                              "name": "外卖",
                              "value": "3"
                            },
                            {
                              "name": "不吃",
                              "value": "4"
                            },
                            {
                              "name": "其他",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "早餐通常吃什么",
                        "type": "radio"
                      },
                      {
                        "id": "Id7329aef7-e57c-4cba-8f0d-fbbc7d2df0e6",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_5cc866",
                        "preps": {
                          "id": "Id7329aef7-e57c-4cba-8f0d-fbbc7d2df0e6",
                          "label": "早餐通常吃什么(其他请说明)",
                          "name": "field_5cc866",
                          "itemNameLabel": "早餐通常吃什么(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "早餐通常吃什么(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Ide788953a-5134-4fc8-84bf-85965783a532",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_00eade",
                        "preps": {
                          "id": "Ide788953a-5134-4fc8-84bf-85965783a532",
                          "label": "午餐解决方式",
                          "name": "field_00eade",
                          "itemNameLabel": "午餐解决方式",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入午餐解决方式",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "自己做饭",
                              "value": "1"
                            },
                            {
                              "name": "公司食堂",
                              "value": "2"
                            },
                            {
                              "name": "外卖",
                              "value": "3"
                            },
                            {
                              "name": "外出就餐",
                              "value": "4"
                            },
                            {
                              "name": "不吃",
                              "value": "5"
                            },
                            {
                              "name": "其他",
                              "value": "6"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "午餐解决方式",
                        "type": "radio"
                      },
                      {
                        "id": "Id77e57d8d-960d-438b-aa28-b74b0239183e",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_0bab44",
                        "preps": {
                          "id": "Id77e57d8d-960d-438b-aa28-b74b0239183e",
                          "label": "午餐解决方式(其他请说明)",
                          "name": "field_0bab44",
                          "itemNameLabel": "午餐解决方式(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "午餐解决方式(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id0c4eddd5-8dbd-4202-8d5c-bdd850b4d783",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_210509",
                        "preps": {
                          "id": "Id0c4eddd5-8dbd-4202-8d5c-bdd850b4d783",
                          "label": "晚餐通常几点吃",
                          "name": "field_210509",
                          "itemNameLabel": "晚餐通常几点吃",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入晚餐通常几点吃",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "18点前",
                              "value": "1"
                            },
                            {
                              "name": "18-19点",
                              "value": "2"
                            },
                            {
                              "name": "19-20点",
                              "value": "3"
                            },
                            {
                              "name": "20点后",
                              "value": "4"
                            },
                            {
                              "name": "不固定",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "晚餐通常几点吃",
                        "type": "radio"
                      },
                      {
                        "id": "Idffa2f072-b529-451e-ac61-2ee88a216772",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_69ceaa",
                        "preps": {
                          "id": "Idffa2f072-b529-451e-ac61-2ee88a216772",
                          "label": "每日饮水量",
                          "name": "field_69ceaa",
                          "itemNameLabel": "每日饮水量",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每日饮水量",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "500ml以下",
                              "value": "1"
                            },
                            {
                              "name": "500ml-1L",
                              "value": "2"
                            },
                            {
                              "name": "1L-2L",
                              "value": "3"
                            },
                            {
                              "name": "2L以上",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每日饮水量",
                        "type": "radio"
                      },
                      {
                        "id": "Id4ce19bf3-26de-4d6b-947f-1e6172a77842",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_f3f984",
                        "preps": {
                          "id": "Id4ce19bf3-26de-4d6b-947f-1e6172a77842",
                          "label": "饮食口味偏好",
                          "name": "field_f3f984",
                          "itemNameLabel": "饮食口味偏好",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入饮食口味偏好",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "清淡",
                              "value": "1"
                            },
                            {
                              "name": "偏咸",
                              "value": "2"
                            },
                            {
                              "name": "偏辣",
                              "value": "3"
                            },
                            {
                              "name": "偏甜",
                              "value": "4"
                            },
                            {
                              "name": "偏油腻",
                              "value": "5"
                            },
                            {
                              "name": "均衡",
                              "value": "6"
                            },
                            {
                              "name": "其他",
                              "value": "7"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "饮食口味偏好",
                        "type": "radio"
                      },
                      {
                        "id": "Idfe9b1691-499f-40d1-8bf9-8f35c0a87e26",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_015b15",
                        "preps": {
                          "id": "Idfe9b1691-499f-40d1-8bf9-8f35c0a87e26",
                          "label": "饮食口味偏好(其他请说明)",
                          "name": "field_015b15",
                          "itemNameLabel": "饮食口味偏好(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "饮食口味偏好(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Ida5875c20-7390-42a8-9902-f7792c4da502",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_dd35ae",
                        "preps": {
                          "id": "Ida5875c20-7390-42a8-9902-f7792c4da502",
                          "label": "每周吃外卖频率",
                          "name": "field_dd35ae",
                          "itemNameLabel": "每周吃外卖频率",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每周吃外卖频率",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天",
                              "value": "1"
                            },
                            {
                              "name": "5次以上",
                              "value": "2"
                            },
                            {
                              "name": "3-4次",
                              "value": "3"
                            },
                            {
                              "name": "1-2次",
                              "value": "4"
                            },
                            {
                              "name": "几乎不吃",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每周吃外卖频率",
                        "type": "radio"
                      },
                      {
                        "id": "Id03ac0dca-351e-41a6-988c-33c5a2102336",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_641571",
                        "preps": {
                          "id": "Id03ac0dca-351e-41a6-988c-33c5a2102336",
                          "label": "是否经常吃零食",
                          "name": "field_641571",
                          "itemNameLabel": "是否经常吃零食",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否经常吃零食",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常",
                              "value": "1"
                            },
                            {
                              "name": "偶尔",
                              "value": "2"
                            },
                            {
                              "name": "很少",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否经常吃零食",
                        "type": "radio"
                      },
                      {
                        "id": "Id1bf0c4b1-cf44-497b-89d5-f42972eda060",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_d78fbe",
                        "preps": {
                          "id": "Id1bf0c4b1-cf44-497b-89d5-f42972eda060",
                          "label": "水果摄入频率",
                          "name": "field_d78fbe",
                          "itemNameLabel": "水果摄入频率",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入水果摄入频率",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天",
                              "value": "1"
                            },
                            {
                              "name": "经常",
                              "value": "2"
                            },
                            {
                              "name": "偶尔",
                              "value": "3"
                            },
                            {
                              "name": "很少",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "水果摄入频率",
                        "type": "radio"
                      },
                      {
                        "id": "Id5a188bfe-9068-4e21-93a7-d6924ca5e06b",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_529720",
                        "preps": {
                          "id": "Id5a188bfe-9068-4e21-93a7-d6924ca5e06b",
                          "label": "是否有饮食禁忌",
                          "name": "field_529720",
                          "itemNameLabel": "是否有饮食禁忌",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否有饮食禁忌",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "无",
                              "value": "1"
                            },
                            {
                              "name": "素食",
                              "value": "2"
                            },
                            {
                              "name": "低糖",
                              "value": "3"
                            },
                            {
                              "name": "低盐",
                              "value": "4"
                            },
                            {
                              "name": "无麸质",
                              "value": "5"
                            },
                            {
                              "name": "其他",
                              "value": "6"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否有饮食禁忌",
                        "type": "radio"
                      },
                      {
                        "id": "Id5efc5aea-6478-4b7a-8c41-61f972087bb6",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_8b2c05",
                        "preps": {
                          "id": "Id5efc5aea-6478-4b7a-8c41-61f972087bb6",
                          "label": "是否有饮食禁忌(其他请说明)",
                          "name": "field_8b2c05",
                          "itemNameLabel": "是否有饮食禁忌(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "是否有饮食禁忌(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id533d3004-5202-4cb7-8088-c3ac32093b05",
                        "compType": "formItem",
                        "itemType": "rate",
                        "fieldName": "field_15c4e0",
                        "preps": {
                          "id": "Id533d3004-5202-4cb7-8088-c3ac32093b05",
                          "label": "饮食习惯满意度",
                          "name": "field_15c4e0",
                          "itemNameLabel": "饮食习惯满意度",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入饮食习惯满意度",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "饮食习惯满意度",
                        "type": "rate"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "饮食习惯",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        },
        {
          "label": "运动与锻炼",
          "subTablePrimaryKey": "运动与锻炼",
          "subTableName": "运动与锻炼",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Id63087aff-fb8b-48ff-ac3f-639917b2844b",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "fieldCaea9B",
              "preps": {
                "id": "Id63087aff-fb8b-48ff-ac3f-639917b2844b",
                "label": "运动与锻炼",
                "name": "fieldCaea9B",
                "itemNameLabel": "运动与锻炼",
                "descTitle": "",
                "direction": "horizontal",
                "column": 2,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "运动与锻炼",
                    "subTablePrimaryKey": "运动与锻炼",
                    "subTableName": "运动与锻炼",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Idab53b1e5-d90a-4ce7-8cdd-4a70a31ebe74",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_135352",
                        "preps": {
                          "id": "Idab53b1e5-d90a-4ce7-8cdd-4a70a31ebe74",
                          "label": "每周运动频率",
                          "name": "field_135352",
                          "itemNameLabel": "每周运动频率",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每周运动频率",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天",
                              "value": "1"
                            },
                            {
                              "name": "5-6次",
                              "value": "2"
                            },
                            {
                              "name": "3-4次",
                              "value": "3"
                            },
                            {
                              "name": "1-2次",
                              "value": "4"
                            },
                            {
                              "name": "几乎不运动",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每周运动频率",
                        "type": "radio"
                      },
                      {
                        "id": "Id6f24a3d9-ecb1-4a7d-b5c9-21a1724d4544",
                        "compType": "formItem",
                        "itemType": "checkbox",
                        "fieldName": "field_65fbcf",
                        "preps": {
                          "id": "Id6f24a3d9-ecb1-4a7d-b5c9-21a1724d4544",
                          "label": "常做的运动类型(多选)",
                          "name": "field_65fbcf",
                          "itemNameLabel": "常做的运动类型(多选)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入常做的运动类型(多选)",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "跑步/快走",
                              "value": "1"
                            },
                            {
                              "name": "游泳",
                              "value": "2"
                            },
                            {
                              "name": "健身/力量训练",
                              "value": "3"
                            },
                            {
                              "name": "球类运动",
                              "value": "4"
                            },
                            {
                              "name": "瑜伽/普拉提",
                              "value": "5"
                            },
                            {
                              "name": "骑行",
                              "value": "6"
                            },
                            {
                              "name": "跳操",
                              "value": "7"
                            },
                            {
                              "name": "其他",
                              "value": "8"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "常做的运动类型(多选)",
                        "type": "checkbox"
                      },
                      {
                        "id": "Id9cf744c8-dd04-4f3a-95f0-a8dacc3de0c9",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_30e6eb",
                        "preps": {
                          "id": "Id9cf744c8-dd04-4f3a-95f0-a8dacc3de0c9",
                          "label": "常做的运动类型(多选)(其他请说明)",
                          "name": "field_30e6eb",
                          "itemNameLabel": "常做的运动类型(多选)(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "常做的运动类型(多选)(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Idd77863f7-a76e-4902-bc4c-05ea5913cc46",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_b56311",
                        "preps": {
                          "id": "Idd77863f7-a76e-4902-bc4c-05ea5913cc46",
                          "label": "每次运动时长",
                          "name": "field_b56311",
                          "itemNameLabel": "每次运动时长",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每次运动时长",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "30分钟以下",
                              "value": "1"
                            },
                            {
                              "name": "30-60分钟",
                              "value": "2"
                            },
                            {
                              "name": "60-90分钟",
                              "value": "3"
                            },
                            {
                              "name": "90分钟以上",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每次运动时长",
                        "type": "radio"
                      },
                      {
                        "id": "Id3877a016-36d3-40f3-8e04-817dabc23159",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_6a2ac0",
                        "preps": {
                          "id": "Id3877a016-36d3-40f3-8e04-817dabc23159",
                          "label": "运动场所",
                          "name": "field_6a2ac0",
                          "itemNameLabel": "运动场所",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入运动场所",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "健身房",
                              "value": "1"
                            },
                            {
                              "name": "户外",
                              "value": "2"
                            },
                            {
                              "name": "家中",
                              "value": "3"
                            },
                            {
                              "name": "公园",
                              "value": "4"
                            },
                            {
                              "name": "体育馆",
                              "value": "5"
                            },
                            {
                              "name": "其他",
                              "value": "6"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "运动场所",
                        "type": "radio"
                      },
                      {
                        "id": "Id80f13cc8-9a93-45cc-a0ec-64c79d1b87ae",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_e38021",
                        "preps": {
                          "id": "Id80f13cc8-9a93-45cc-a0ec-64c79d1b87ae",
                          "label": "运动场所(其他请说明)",
                          "name": "field_e38021",
                          "itemNameLabel": "运动场所(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "运动场所(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id7bba5586-fc50-4440-9054-5d8506e8413a",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_b9210a",
                        "preps": {
                          "id": "Id7bba5586-fc50-4440-9054-5d8506e8413a",
                          "label": "是否有健身教练指导",
                          "name": "field_b9210a",
                          "itemNameLabel": "是否有健身教练指导",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否有健身教练指导",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "有",
                              "value": "1"
                            },
                            {
                              "name": "曾经有",
                              "value": "2"
                            },
                            {
                              "name": "没有但考虑过",
                              "value": "3"
                            },
                            {
                              "name": "没有也不考虑",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否有健身教练指导",
                        "type": "radio"
                      },
                      {
                        "id": "Id8f538202-70a4-44a4-ad33-96b66a015c42",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_24cce8",
                        "preps": {
                          "id": "Id8f538202-70a4-44a4-ad33-96b66a015c42",
                          "label": "运动的主要目的",
                          "name": "field_24cce8",
                          "itemNameLabel": "运动的主要目的",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入运动的主要目的",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "减肥塑形",
                              "value": "1"
                            },
                            {
                              "name": "增强体质",
                              "value": "2"
                            },
                            {
                              "name": "释放压力",
                              "value": "3"
                            },
                            {
                              "name": "社交",
                              "value": "4"
                            },
                            {
                              "name": "兴趣爱好",
                              "value": "5"
                            },
                            {
                              "name": "医生建议",
                              "value": "6"
                            },
                            {
                              "name": "其他",
                              "value": "7"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "运动的主要目的",
                        "type": "radio"
                      },
                      {
                        "id": "Id1ba53b10-861f-481a-8d69-d0f303483307",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_14f21f",
                        "preps": {
                          "id": "Id1ba53b10-861f-481a-8d69-d0f303483307",
                          "label": "运动的主要目的(其他请说明)",
                          "name": "field_14f21f",
                          "itemNameLabel": "运动的主要目的(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "运动的主要目的(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id4cda25a2-ff6a-451e-bc50-0fd8259c88da",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_950cc3",
                        "preps": {
                          "id": "Id4cda25a2-ff6a-451e-bc50-0fd8259c88da",
                          "label": "是否使用运动APP",
                          "name": "field_950cc3",
                          "itemNameLabel": "是否使用运动APP",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否使用运动APP",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常使用",
                              "value": "1"
                            },
                            {
                              "name": "偶尔使用",
                              "value": "2"
                            },
                            {
                              "name": "不使用",
                              "value": "3"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否使用运动APP",
                        "type": "radio"
                      },
                      {
                        "id": "Idbdd720e7-4606-4d87-953b-239d8c29ef03",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_c0892d",
                        "preps": {
                          "id": "Idbdd720e7-4606-4d87-953b-239d8c29ef03",
                          "label": "运动后的恢复方式",
                          "name": "field_c0892d",
                          "itemNameLabel": "运动后的恢复方式",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入运动后的恢复方式",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "拉伸放松",
                              "value": "1"
                            },
                            {
                              "name": "按摩",
                              "value": "2"
                            },
                            {
                              "name": "补充营养",
                              "value": "3"
                            },
                            {
                              "name": "直接休息",
                              "value": "4"
                            },
                            {
                              "name": "其他",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "运动后的恢复方式",
                        "type": "radio"
                      },
                      {
                        "id": "Id02eedce9-f540-440a-a48c-8eb515efc5b4",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_c6c958",
                        "preps": {
                          "id": "Id02eedce9-f540-440a-a48c-8eb515efc5b4",
                          "label": "运动后的恢复方式(其他请说明)",
                          "name": "field_c6c958",
                          "itemNameLabel": "运动后的恢复方式(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "运动后的恢复方式(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Idcdab723b-6253-4c19-966b-782109ec0fc2",
                        "compType": "formItem",
                        "itemType": "number",
                        "fieldName": "field_9d4d3c",
                        "preps": {
                          "id": "Idcdab723b-6253-4c19-966b-782109ec0fc2",
                          "label": "月均运动/健身花费(元)",
                          "name": "field_9d4d3c",
                          "itemNameLabel": "月均运动/健身花费(元)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入月均运动/健身花费(元)",
                          "values": [],
                          "rules": [],
                          "min": 0,
                          "precision": 0,
                          "step": 1,
                          "hideLabel": true
                        },
                        "label": "月均运动/健身花费(元)",
                        "type": "number"
                      },
                      {
                        "id": "Idf27dcd30-35c2-4a67-87e6-78a3b0c7be8e",
                        "compType": "formItem",
                        "itemType": "rate",
                        "fieldName": "field_a1bcef",
                        "preps": {
                          "id": "Idf27dcd30-35c2-4a67-87e6-78a3b0c7be8e",
                          "label": "运动习惯满意度",
                          "name": "field_a1bcef",
                          "itemNameLabel": "运动习惯满意度",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入运动习惯满意度",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "运动习惯满意度",
                        "type": "rate"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "运动与锻炼",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        },
        {
          "label": "睡眠与休息",
          "subTablePrimaryKey": "睡眠与休息",
          "subTableName": "睡眠与休息",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Ide40560d1-a607-4d71-ad7c-b5692b822286",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "fieldFbcc32",
              "preps": {
                "id": "Ide40560d1-a607-4d71-ad7c-b5692b822286",
                "label": "睡眠与休息",
                "name": "fieldFbcc32",
                "itemNameLabel": "睡眠与休息",
                "descTitle": "",
                "direction": "horizontal",
                "column": 1,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "睡眠与休息",
                    "subTablePrimaryKey": "睡眠与休息",
                    "subTableName": "睡眠与休息",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Id5f35249d-2bb7-488e-be20-f70ad8afc414",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_4791fc",
                        "preps": {
                          "id": "Id5f35249d-2bb7-488e-be20-f70ad8afc414",
                          "label": "通常几点入睡",
                          "name": "field_4791fc",
                          "itemNameLabel": "通常几点入睡",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入通常几点入睡",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "22点前",
                              "value": "1"
                            },
                            {
                              "name": "22-23点",
                              "value": "2"
                            },
                            {
                              "name": "23-24点",
                              "value": "3"
                            },
                            {
                              "name": "凌晨1点后",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "通常几点入睡",
                        "type": "radio"
                      },
                      {
                        "id": "Id4e113365-6a48-4788-8d80-5254a3d7d158",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_e6eaa3",
                        "preps": {
                          "id": "Id4e113365-6a48-4788-8d80-5254a3d7d158",
                          "label": "每日睡眠时长",
                          "name": "field_e6eaa3",
                          "itemNameLabel": "每日睡眠时长",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每日睡眠时长",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "5小时以下",
                              "value": "1"
                            },
                            {
                              "name": "5-6小时",
                              "value": "2"
                            },
                            {
                              "name": "6-7小时",
                              "value": "3"
                            },
                            {
                              "name": "7-8小时",
                              "value": "4"
                            },
                            {
                              "name": "8小时以上",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每日睡眠时长",
                        "type": "radio"
                      },
                      {
                        "id": "Id3ce54c0d-0f6f-442a-b0ff-b5604cc68c64",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_2216dd",
                        "preps": {
                          "id": "Id3ce54c0d-0f6f-442a-b0ff-b5604cc68c64",
                          "label": "入睡是否困难",
                          "name": "field_2216dd",
                          "itemNameLabel": "入睡是否困难",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入入睡是否困难",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "很快入睡",
                              "value": "1"
                            },
                            {
                              "name": "一般",
                              "value": "2"
                            },
                            {
                              "name": "较难入睡",
                              "value": "3"
                            },
                            {
                              "name": "经常失眠",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "入睡是否困难",
                        "type": "radio"
                      },
                      {
                        "id": "Idd1cfc75e-1c07-445e-b5a2-2d08e81dbab4",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_0afb13",
                        "preps": {
                          "id": "Idd1cfc75e-1c07-445e-b5a2-2d08e81dbab4",
                          "label": "睡眠质量",
                          "name": "field_0afb13",
                          "itemNameLabel": "睡眠质量",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入睡眠质量",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "很好",
                              "value": "1"
                            },
                            {
                              "name": "较好",
                              "value": "2"
                            },
                            {
                              "name": "一般",
                              "value": "3"
                            },
                            {
                              "name": "较差",
                              "value": "4"
                            },
                            {
                              "name": "很差",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "睡眠质量",
                        "type": "radio"
                      },
                      {
                        "id": "Id897c4ac7-f387-4615-997f-669be05fd30c",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_b396f6",
                        "preps": {
                          "id": "Id897c4ac7-f387-4615-997f-669be05fd30c",
                          "label": "是否经常做梦",
                          "name": "field_b396f6",
                          "itemNameLabel": "是否经常做梦",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否经常做梦",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常",
                              "value": "1"
                            },
                            {
                              "name": "偶尔",
                              "value": "2"
                            },
                            {
                              "name": "很少",
                              "value": "3"
                            },
                            {
                              "name": "从不做梦",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否经常做梦",
                        "type": "radio"
                      },
                      {
                        "id": "Id49c25265-0dcf-431f-a430-527b4b3627ea",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_9643ba",
                        "preps": {
                          "id": "Id49c25265-0dcf-431f-a430-527b4b3627ea",
                          "label": "是否使用助眠产品",
                          "name": "field_9643ba",
                          "itemNameLabel": "是否使用助眠产品",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否使用助眠产品",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常使用",
                              "value": "1"
                            },
                            {
                              "name": "偶尔使用",
                              "value": "2"
                            },
                            {
                              "name": "曾经用过",
                              "value": "3"
                            },
                            {
                              "name": "从未使用",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否使用助眠产品",
                        "type": "radio"
                      },
                      {
                        "id": "Idb69152f0-24dd-4601-ba9a-d3ef09b4419a",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_60003c",
                        "preps": {
                          "id": "Idb69152f0-24dd-4601-ba9a-d3ef09b4419a",
                          "label": "午休习惯",
                          "name": "field_60003c",
                          "itemNameLabel": "午休习惯",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入午休习惯",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天午休",
                              "value": "1"
                            },
                            {
                              "name": "经常午休",
                              "value": "2"
                            },
                            {
                              "name": "偶尔午休",
                              "value": "3"
                            },
                            {
                              "name": "从不午休",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "午休习惯",
                        "type": "radio"
                      },
                      {
                        "id": "Ide9f859ad-8788-4ff0-a4f6-ac0d47c9004c",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_9899c4",
                        "preps": {
                          "id": "Ide9f859ad-8788-4ff0-a4f6-ac0d47c9004c",
                          "label": "周末是否补觉",
                          "name": "field_9899c4",
                          "itemNameLabel": "周末是否补觉",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入周末是否补觉",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "总是",
                              "value": "1"
                            },
                            {
                              "name": "经常",
                              "value": "2"
                            },
                            {
                              "name": "偶尔",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "周末是否补觉",
                        "type": "radio"
                      },
                      {
                        "id": "Ida9667bab-a116-4b0f-83b8-80d1dc7b0cad",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_2a89c9",
                        "preps": {
                          "id": "Ida9667bab-a116-4b0f-83b8-80d1dc7b0cad",
                          "label": "睡前最常做的事",
                          "name": "field_2a89c9",
                          "itemNameLabel": "睡前最常做的事",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入睡前最常做的事",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "刷手机",
                              "value": "1"
                            },
                            {
                              "name": "看书",
                              "value": "2"
                            },
                            {
                              "name": "看电视",
                              "value": "3"
                            },
                            {
                              "name": "听音乐",
                              "value": "4"
                            },
                            {
                              "name": "工作",
                              "value": "5"
                            },
                            {
                              "name": "其他",
                              "value": "6"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "睡前最常做的事",
                        "type": "radio"
                      },
                      {
                        "id": "Id7fc906cb-5fa3-4008-950c-53e8600ec046",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_6747ed",
                        "preps": {
                          "id": "Id7fc906cb-5fa3-4008-950c-53e8600ec046",
                          "label": "睡前最常做的事(其他请说明)",
                          "name": "field_6747ed",
                          "itemNameLabel": "睡前最常做的事(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "睡前最常做的事(其他请说明)",
                        "type": "input"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "睡眠与休息",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        },
        {
          "label": "心理健康与压力",
          "subTablePrimaryKey": "心理健康与压力",
          "subTableName": "心理健康与压力",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Id6231e307-bd42-4c6d-b9c4-8f85168f27f7",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "fieldF5B340",
              "preps": {
                "id": "Id6231e307-bd42-4c6d-b9c4-8f85168f27f7",
                "label": "心理健康与压力",
                "name": "fieldF5B340",
                "itemNameLabel": "心理健康与压力",
                "descTitle": "",
                "direction": "horizontal",
                "column": 2,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "心理健康与压力",
                    "subTablePrimaryKey": "心理健康与压力",
                    "subTableName": "心理健康与压力",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Idbcac5431-431b-41da-9f2f-4762d85b7844",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_71c458",
                        "preps": {
                          "id": "Idbcac5431-431b-41da-9f2f-4762d85b7844",
                          "label": "目前生活压力程度",
                          "name": "field_71c458",
                          "itemNameLabel": "目前生活压力程度",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入目前生活压力程度",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "非常大",
                              "value": "1"
                            },
                            {
                              "name": "较大",
                              "value": "2"
                            },
                            {
                              "name": "一般",
                              "value": "3"
                            },
                            {
                              "name": "较小",
                              "value": "4"
                            },
                            {
                              "name": "几乎没有",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "目前生活压力程度",
                        "type": "radio"
                      },
                      {
                        "id": "Idf72abc88-d271-4a82-ac7d-3303e0987e20",
                        "compType": "formItem",
                        "itemType": "checkbox",
                        "fieldName": "field_df9bfb",
                        "preps": {
                          "id": "Idf72abc88-d271-4a82-ac7d-3303e0987e20",
                          "label": "主要压力来源(多选)",
                          "name": "field_df9bfb",
                          "itemNameLabel": "主要压力来源(多选)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入主要压力来源(多选)",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "工作",
                              "value": "1"
                            },
                            {
                              "name": "经济",
                              "value": "2"
                            },
                            {
                              "name": "家庭",
                              "value": "3"
                            },
                            {
                              "name": "学业",
                              "value": "4"
                            },
                            {
                              "name": "人际关系",
                              "value": "5"
                            },
                            {
                              "name": "健康",
                              "value": "6"
                            },
                            {
                              "name": "其他",
                              "value": "7"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "主要压力来源(多选)",
                        "type": "checkbox"
                      },
                      {
                        "id": "Id2c965100-6af4-4306-9ade-a5f08bde93fc",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_677f06",
                        "preps": {
                          "id": "Id2c965100-6af4-4306-9ade-a5f08bde93fc",
                          "label": "主要压力来源(多选)(其他请说明)",
                          "name": "field_677f06",
                          "itemNameLabel": "主要压力来源(多选)(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "主要压力来源(多选)(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id97a669b6-de7b-4104-94f2-f33bffd8ff59",
                        "compType": "formItem",
                        "itemType": "checkbox",
                        "fieldName": "field_bcf091",
                        "preps": {
                          "id": "Id97a669b6-de7b-4104-94f2-f33bffd8ff59",
                          "label": "主要减压方式(多选)",
                          "name": "field_bcf091",
                          "itemNameLabel": "主要减压方式(多选)",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入主要减压方式(多选)",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "运动",
                              "value": "1"
                            },
                            {
                              "name": "听音乐",
                              "value": "2"
                            },
                            {
                              "name": "看电影/追剧",
                              "value": "3"
                            },
                            {
                              "name": "社交聚会",
                              "value": "4"
                            },
                            {
                              "name": "阅读",
                              "value": "5"
                            },
                            {
                              "name": "冥想",
                              "value": "6"
                            },
                            {
                              "name": "购物",
                              "value": "7"
                            },
                            {
                              "name": "其他",
                              "value": "8"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "主要减压方式(多选)",
                        "type": "checkbox"
                      },
                      {
                        "id": "Idd8cba5af-928b-422f-aadb-af7b19ee5d0c",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_f6b194",
                        "preps": {
                          "id": "Idd8cba5af-928b-422f-aadb-af7b19ee5d0c",
                          "label": "主要减压方式(多选)(其他请说明)",
                          "name": "field_f6b194",
                          "itemNameLabel": "主要减压方式(多选)(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "主要减压方式(多选)(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Idb327abaa-7867-4a4c-b00e-7beeed867bc3",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_9e94d1",
                        "preps": {
                          "id": "Idb327abaa-7867-4a4c-b00e-7beeed867bc3",
                          "label": "是否有焦虑情绪",
                          "name": "field_9e94d1",
                          "itemNameLabel": "是否有焦虑情绪",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否有焦虑情绪",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常",
                              "value": "1"
                            },
                            {
                              "name": "偶尔",
                              "value": "2"
                            },
                            {
                              "name": "很少",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否有焦虑情绪",
                        "type": "radio"
                      },
                      {
                        "id": "Id9f1d5b13-9f73-4666-a26c-93e67c5ccf6f",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_628cda",
                        "preps": {
                          "id": "Id9f1d5b13-9f73-4666-a26c-93e67c5ccf6f",
                          "label": "是否有抑郁情绪",
                          "name": "field_628cda",
                          "itemNameLabel": "是否有抑郁情绪",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否有抑郁情绪",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常",
                              "value": "1"
                            },
                            {
                              "name": "偶尔",
                              "value": "2"
                            },
                            {
                              "name": "很少",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否有抑郁情绪",
                        "type": "radio"
                      },
                      {
                        "id": "Idaa6cb94d-e27f-495b-a0b4-9d63ed47c071",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_e0f035",
                        "preps": {
                          "id": "Idaa6cb94d-e27f-495b-a0b4-9d63ed47c071",
                          "label": "是否寻求过心理咨询",
                          "name": "field_e0f035",
                          "itemNameLabel": "是否寻求过心理咨询",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否寻求过心理咨询",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "是，多次",
                              "value": "1"
                            },
                            {
                              "name": "是，偶尔",
                              "value": "2"
                            },
                            {
                              "name": "考虑过但没有",
                              "value": "3"
                            },
                            {
                              "name": "没有考虑过",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否寻求过心理咨询",
                        "type": "radio"
                      },
                      {
                        "id": "Id57c8013e-1925-4531-977f-3da0818d4a09",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_2072c5",
                        "preps": {
                          "id": "Id57c8013e-1925-4531-977f-3da0818d4a09",
                          "label": "情绪管理自评",
                          "name": "field_2072c5",
                          "itemNameLabel": "情绪管理自评",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入情绪管理自评",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "非常好",
                              "value": "1"
                            },
                            {
                              "name": "较好",
                              "value": "2"
                            },
                            {
                              "name": "一般",
                              "value": "3"
                            },
                            {
                              "name": "较差",
                              "value": "4"
                            },
                            {
                              "name": "很差",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "情绪管理自评",
                        "type": "radio"
                      },
                      {
                        "id": "Id99b96522-fe7c-41cb-8271-af6b940b035a",
                        "compType": "formItem",
                        "itemType": "rate",
                        "fieldName": "field_dd5f07",
                        "preps": {
                          "id": "Id99b96522-fe7c-41cb-8271-af6b940b035a",
                          "label": "心理健康状况自评",
                          "name": "field_dd5f07",
                          "itemNameLabel": "心理健康状况自评",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入心理健康状况自评",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "心理健康状况自评",
                        "type": "rate"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "心理健康与压力",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        },
        {
          "label": "生活习惯与健康",
          "subTablePrimaryKey": "生活习惯与健康",
          "subTableName": "生活习惯与健康",
          "subFormFlag": "Y",
          "formVisible": "Y",
          "items": [
            {
              "id": "Id1d4573e7-9c9c-4fa3-955d-c9e2117c9032",
              "compType": "container",
              "itemType": "descriptions",
              "fieldName": "field93136D",
              "preps": {
                "id": "Id1d4573e7-9c9c-4fa3-955d-c9e2117c9032",
                "label": "生活习惯与健康",
                "name": "field93136D",
                "itemNameLabel": "生活习惯与健康",
                "descTitle": "",
                "direction": "vertical",
                "column": 1,
                "border": true,
                "size": "default",
                "descItemLabelWidth": "120px",
                "descItemAlign": "left",
                "descItemLabelAlign": "",
                "descItemClassName": "",
                "descItemLabelClassName": "",
                "descExtra": "",
                "elements": [
                  {
                    "label": "生活习惯与健康",
                    "subTablePrimaryKey": "生活习惯与健康",
                    "subTableName": "生活习惯与健康",
                    "subFormFlag": "Y",
                    "formVisible": "Y",
                    "items": [
                      {
                        "id": "Id156410ba-2c38-4615-8bda-b8d68a72d91d",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_26c47a",
                        "preps": {
                          "id": "Id156410ba-2c38-4615-8bda-b8d68a72d91d",
                          "label": "是否吸烟",
                          "name": "field_26c47a",
                          "itemNameLabel": "是否吸烟",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否吸烟",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天吸",
                              "value": "1"
                            },
                            {
                              "name": "偶尔吸",
                              "value": "2"
                            },
                            {
                              "name": "已戒烟",
                              "value": "3"
                            },
                            {
                              "name": "从不吸烟",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否吸烟",
                        "type": "radio"
                      },
                      {
                        "id": "Ide78ca03c-8c9a-4542-9d2c-87c0560a03ad",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_4cd471",
                        "preps": {
                          "id": "Ide78ca03c-8c9a-4542-9d2c-87c0560a03ad",
                          "label": "饮酒频率",
                          "name": "field_4cd471",
                          "itemNameLabel": "饮酒频率",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入饮酒频率",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每天",
                              "value": "1"
                            },
                            {
                              "name": "经常",
                              "value": "2"
                            },
                            {
                              "name": "偶尔",
                              "value": "3"
                            },
                            {
                              "name": "很少",
                              "value": "4"
                            },
                            {
                              "name": "从不",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "饮酒频率",
                        "type": "radio"
                      },
                      {
                        "id": "Idebf40bfe-eef0-4d32-84b7-9766527af3ca",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_fd3430",
                        "preps": {
                          "id": "Idebf40bfe-eef0-4d32-84b7-9766527af3ca",
                          "label": "体检频率",
                          "name": "field_fd3430",
                          "itemNameLabel": "体检频率",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入体检频率",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "每年一次",
                              "value": "1"
                            },
                            {
                              "name": "每两年一次",
                              "value": "2"
                            },
                            {
                              "name": "偶尔",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "体检频率",
                        "type": "radio"
                      },
                      {
                        "id": "Idd230cbf2-24bb-47d7-9776-6fad234e29ab",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_9b47ad",
                        "preps": {
                          "id": "Idd230cbf2-24bb-47d7-9776-6fad234e29ab",
                          "label": "是否有慢性病",
                          "name": "field_9b47ad",
                          "itemNameLabel": "是否有慢性病",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否有慢性病",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "无",
                              "value": "1"
                            },
                            {
                              "name": "高血压",
                              "value": "2"
                            },
                            {
                              "name": "糖尿病",
                              "value": "3"
                            },
                            {
                              "name": "心脏病",
                              "value": "4"
                            },
                            {
                              "name": "其他",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否有慢性病",
                        "type": "radio"
                      },
                      {
                        "id": "Id9c61db0a-296f-4a00-863c-88d91723cc7d",
                        "compType": "formItem",
                        "itemType": "input",
                        "fieldName": "field_5846e9",
                        "preps": {
                          "id": "Id9c61db0a-296f-4a00-863c-88d91723cc7d",
                          "label": "是否有慢性病(其他请说明)",
                          "name": "field_5846e9",
                          "itemNameLabel": "是否有慢性病(其他请说明)",
                          "formVisible": false,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请填写具体说明",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "是否有慢性病(其他请说明)",
                        "type": "input"
                      },
                      {
                        "id": "Id934e6133-b56d-48b3-a318-e979db72aa16",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_4296ac",
                        "preps": {
                          "id": "Id934e6133-b56d-48b3-a318-e979db72aa16",
                          "label": "是否定期服用保健品",
                          "name": "field_4296ac",
                          "itemNameLabel": "是否定期服用保健品",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入是否定期服用保健品",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "经常",
                              "value": "1"
                            },
                            {
                              "name": "偶尔",
                              "value": "2"
                            },
                            {
                              "name": "很少",
                              "value": "3"
                            },
                            {
                              "name": "从不",
                              "value": "4"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "是否定期服用保健品",
                        "type": "radio"
                      },
                      {
                        "id": "Id759799ba-0cba-435f-bed1-eabac478dca8",
                        "compType": "formItem",
                        "itemType": "radio",
                        "fieldName": "field_e3c44f",
                        "preps": {
                          "id": "Id759799ba-0cba-435f-bed1-eabac478dca8",
                          "label": "每日屏幕使用时间",
                          "name": "field_e3c44f",
                          "itemNameLabel": "每日屏幕使用时间",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入每日屏幕使用时间",
                          "dataSource": "data",
                          "values": [
                            {
                              "name": "2小时以下",
                              "value": "1"
                            },
                            {
                              "name": "2-4小时",
                              "value": "2"
                            },
                            {
                              "name": "4-6小时",
                              "value": "3"
                            },
                            {
                              "name": "6-8小时",
                              "value": "4"
                            },
                            {
                              "name": "8小时以上",
                              "value": "5"
                            }
                          ],
                          "rules": [],
                          "helpMsg": "",
                          "hideLabel": true
                        },
                        "label": "每日屏幕使用时间",
                        "type": "radio"
                      },
                      {
                        "id": "Id46a037aa-0b40-47b3-aa79-b5337756c9ff",
                        "compType": "formItem",
                        "itemType": "rate",
                        "fieldName": "field_ea918d",
                        "preps": {
                          "id": "Id46a037aa-0b40-47b3-aa79-b5337756c9ff",
                          "label": "整体健康状况自评",
                          "name": "field_ea918d",
                          "itemNameLabel": "整体健康状况自评",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 255,
                          "placeholder": "请输入整体健康状况自评",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "整体健康状况自评",
                        "type": "rate"
                      },
                      {
                        "id": "Ide3de3cde-d910-41bf-9486-9583d5c15e1f",
                        "compType": "formItem",
                        "itemType": "textarea",
                        "fieldName": "field_097791",
                        "preps": {
                          "id": "Ide3de3cde-d910-41bf-9486-9583d5c15e1f",
                          "label": "您保持健康的秘诀或心得",
                          "name": "field_097791",
                          "itemNameLabel": "您保持健康的秘诀或心得",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 1000,
                          "placeholder": "请详细描述您的想法",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "您保持健康的秘诀或心得",
                        "type": "textarea"
                      },
                      {
                        "id": "Id30852e97-e6b6-4df5-85c1-0f44f3acdd35",
                        "compType": "formItem",
                        "itemType": "textarea",
                        "fieldName": "field_1f3d3d",
                        "preps": {
                          "id": "Id30852e97-e6b6-4df5-85c1-0f44f3acdd35",
                          "label": "您最想改善的健康问题",
                          "name": "field_1f3d3d",
                          "itemNameLabel": "您最想改善的健康问题",
                          "formVisible": true,
                          "listVisible": true,
                          "viewVisible": true,
                          "searchVisible": false,
                          "required": false,
                          "disabled": false,
                          "clearable": true,
                          "readonly": false,
                          "maxLength": 1000,
                          "placeholder": "请详细描述您的想法",
                          "values": [],
                          "rules": [],
                          "hideLabel": true
                        },
                        "label": "您最想改善的健康问题",
                        "type": "textarea"
                      }
                    ],
                    "span": 1,
                    "rowspan": 1,
                    "width": "",
                    "minWidth": "",
                    "labelWidth": "",
                    "align": "",
                    "labelAlign": "",
                    "className": "",
                    "labelClassName": ""
                  }
                ],
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true
              },
              "type": "descriptions"
            }
          ],
          "anchorTitle": "生活习惯与健康",
          "anchorHref": "",
          "anchorIcon": "",
          "anchorDisabled": false
        }
      ],
      "rules": [],
      "maxLength": 255,
      "formVisible": true,
      "listVisible": true,
      "viewVisible": true
    },
    "type": "anchor"
  }
];
onMounted(() => {
  const result = analysisCompDatas(fields);
  dataItem.value = result;
  console.log("fffffffff", result);
});
</script>

<style lang="scss" scoped></style>
