<template>
  <el-scrollbar>
    <dytable-container
        :formData="formData"
        :field="fields"
        :is-design="true"
        :show-form-item="true"
        :formInfo="{}"
    />
  </el-scrollbar>
</template>

<script lang="ts" setup>
import piniaInstance from "@/store";
import {useDesignFormStore} from "@/store/DesignForm";
import {onMounted, ref} from "vue";

let designForm = useDesignFormStore(piniaInstance);
const formData = ref<any>({
  test: "1-2-1",
});
/*const fields = ref<any>({
  id: "Idsh8daf59c9-bc67-4dc7-ab01-ca0f661e42d7",
  preps: {
    id: "Idsh8daf59c9-bc67-4dc7-ab01-ca0f661e42d7",
    label: "动态表格",
    itemNameLabel: "动态表格",
    name: "dytable1",
    elements: [
      {
        id: "sh8f8eaa81-83db-4544-8a36-3e6f7ba8ffc3",
        colIndex: 1,
        columns: [
          {
            id: "shce077120-e3f2-4f75-8e2a-a072c08fa56c",
            colIndex: 1,
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh67d46b76-adcf-482b-99c4-6ebd8a3b5a4f",
                preps: {
                  id: "Idsh67d46b76-adcf-482b-99c4-6ebd8a3b5a4f",
                  label: "姓    名",
                  textContent: "姓    名",
                  itemNameLabel: "静态文本",
                  name: "text3",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text3",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh78f6b62a-e394-4195-90d5-989c75fb0fb2",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "shcf1309e9-097a-43ed-a381-d5b627ec0efd",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsha8b039ed-8ace-496f-a8bb-c8bf3f948887",
                preps: {
                  id: "Idsha8b039ed-8ace-496f-a8bb-c8bf3f948887",
                  label: "工   号",
                  textContent: "工   号",
                  itemNameLabel: "静态文本",
                  name: "text6",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text6",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh4bab64af-4da6-42a8-b8ca-60561699d97c",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh9820b4c7-033f-49fd-b8a9-1fefb7ba5027",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idshdaea6e22-0dc0-458e-88f9-5174634597ee",
                preps: {
                  id: "Idshdaea6e22-0dc0-458e-88f9-5174634597ee",
                  label: "入职日期",
                  textContent: "入职日期",
                  itemNameLabel: "静态文本",
                  name: "text8",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text8",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "shd274c783-94dc-43a9-9ee9-22938713f4b4",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "shd99fc659-8388-4be7-af62-12d993098081",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh98ce9979-6b45-4a7b-adb7-cf886e3066ac",
                preps: {
                  id: "Idsh98ce9979-6b45-4a7b-adb7-cf886e3066ac",
                  label: "生效日期",
                  textContent: "生效日期",
                  itemNameLabel: "静态文本",
                  name: "text10",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text10",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh0f7178eb-5ca2-4043-827b-689c80f0cece",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh3e4ca9b1-fbf3-4d61-af75-de733a6886a0",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh8d23dd79-34e2-48cc-bb83-b8c039a4b5e1",
                preps: {
                  id: "Idsh8d23dd79-34e2-48cc-bb83-b8c039a4b5e1",
                  label: "一级部门",
                  textContent: "一级部门",
                  itemNameLabel: "静态文本",
                  name: "text4",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text4",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh15dd2d3d-3c74-41d5-9ae5-d0f501e7727f",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "shcdd9b25b-0c92-4049-9347-980650ab839b",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh5eee76b2-c2f9-487a-913c-89ab0dae4c8c",
                preps: {
                  id: "Idsh5eee76b2-c2f9-487a-913c-89ab0dae4c8c",
                  label: "二级部门",
                  textContent: "二级部门",
                  itemNameLabel: "静态文本",
                  name: "text7",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text7",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "shb4f00083-4284-4179-8ce0-ee8a4d8c4fd1",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh8c8f768b-3bca-441e-9099-b1c5a9ef04f5",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh3caeda6d-694e-4b23-8610-261bef82373c",
                preps: {
                  id: "Idsh3caeda6d-694e-4b23-8610-261bef82373c",
                  label: "三级部门",
                  textContent: "三级部门",
                  itemNameLabel: "静态文本",
                  name: "text9",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text9",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "shd55b17e9-e24b-4691-8818-96ffdbfff7c7",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh2c39d1ef-81b9-48cc-9fe0-7e3d3d993f9d",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh19b78d7c-a407-4999-8613-94eb248e27d9",
                preps: {
                  id: "Idsh19b78d7c-a407-4999-8613-94eb248e27d9",
                  label: "静态文本",
                  textContent: "岗位",
                  itemNameLabel: "静态文本",
                  name: "job",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "job",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh23bb82e1-120c-4063-a1b0-46faba49ae64",
            colspan: 1,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh2510b89e-4d7b-45b9-ac11-dc6c388a9bc7",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh4453a57e-0190-4095-85e6-52ff7e168d79",
                preps: {
                  id: "Idsh4453a57e-0190-4095-85e6-52ff7e168d79",
                  label: "责任类型",
                  textContent: "责任类型",
                  itemNameLabel: "静态文本",
                  name: "text5",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text5",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
            colHeight: "43.66668701171875px",
          },
          {
            id: "shbd2c878e-14ef-4b1e-bf7d-3b23fa969ec6",
            colspan: 7,
            rowspan: 1,
            items: [
              {
                id: "Idsh42887bd8-2ed8-49a3-a1c0-f508ab9139c0",
                preps: {
                  id: "Idsh42887bd8-2ed8-49a3-a1c0-f508ab9139c0",
                  label: "",
                  itemNameLabel: "单选框",
                  name: "radio12",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                  dataSource: "data",
                  analysisValue: "",
                  analysisType: "func",
                  values: [
                    {
                      name: "主要责任",
                      value: "1",
                      xh: 1,
                    },
                    {
                      name: "次要责任",
                      value: "2",
                      xh: 2,
                    },
                    {
                      name: "直接管理责任",
                      value: "3",
                      xh: 3,
                    },
                    {
                      name: "部门管理责任",
                      value: "4",
                      xh: 4,
                    },
                  ],
                },
                compType: "formItem",
                fieldName: "radio12",
                itemType: "radio",
                label: "单选框",
                type: "radio",
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh375ab120-f15b-4d20-9d9c-3ee84d18c77c",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idshde0b579d-070f-477f-a720-d931586a0b2a",
                preps: {
                  id: "Idshde0b579d-070f-477f-a720-d931586a0b2a",
                  label: "处分事由   （可附页）",
                  textContent: "处分事由   （可附页）",
                  itemNameLabel: "Html组件",
                  name: "html13",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                  helpMsg: "",
                },
                compType: "formItem",
                fieldName: "html13",
                itemType: "html",
                label: "Html组件",
                type: "html",
              },
            ],
            colHeight: "220.66666793823242px",
          },
          {
            id: "shd8780411-9711-4f9a-ab2c-39b07af0d28e",
            colspan: 7,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sha92a037a-7131-48b6-83c0-54b2424031c2",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsha86eb617-3793-44eb-a3e3-a8b8222694be",
                preps: {
                  id: "Idsha86eb617-3793-44eb-a3e3-a8b8222694be",
                  label: "公司损失",
                  textContent: "公司损失",
                  itemNameLabel: "静态文本",
                  name: "textxx",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "textxx",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh7afb1640-5586-4cd6-bfa7-c4220ee893d0",
            colspan: 7,
            rowspan: 1,
            items: [],
            colHeight: "250.66666793823242px",
          },
        ],
      },
      {
        columns: [
          {
            id: "shcd776a7a-a677-4053-a5a2-62686cbf5cc2",
            colspan: 1,
            rowspan: 1,
            items: [
              {
                id: "Idsh000ecc75-d948-4915-b113-931dbe1f87ed",
                preps: {
                  id: "Idsh000ecc75-d948-4915-b113-931dbe1f87ed",
                  label: "处分依据及处分决定",
                  textContent: "处分依据及处分决定",
                  itemNameLabel: "静态文本",
                  name: "text15",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text15",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "shfa93a0f5-7b6f-43dd-8a18-693fc9a4e5b2",
            colspan: 7,
            rowspan: 1,
            items: [],
            colHeight: "272.6666679382324px",
          },
        ],
      },
      {
        columns: [
          {
            id: "shcf383c57-d9cd-4be8-a443-b51fde6559f5",
            colspan: 8,
            rowspan: 1,
            items: [
              {
                id: "Idshb5e8ae36-83eb-4d12-b023-e1d665c8db17",
                preps: {
                  id: "Idshb5e8ae36-83eb-4d12-b023-e1d665c8db17",
                  label: "审批栏",
                  textContent: "审批栏",
                  itemNameLabel: "静态文本",
                  name: "text2",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text2",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh36be772e-4d92-4d1e-ba83-80f7dd3ce281",
            colspan: 2,
            rowspan: 1,
            items: [
              {
                id: "Idsh19728f53-17ac-4e02-919c-c846907b0765",
                preps: {
                  id: "Idsh19728f53-17ac-4e02-919c-c846907b0765",
                  label: "处分员工所在部门负责人",
                  textContent: "处分员工所在部门负责人",
                  itemNameLabel: "静态文本",
                  name: "text16",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text16",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh8f167347-f55b-4301-9817-0cd6e444d39e",
            colspan: 2,
            rowspan: 1,
            items: [
              {
                id: "Idshb4dda339-11b5-456c-8954-d9d11babbd58",
                preps: {
                  id: "Idshb4dda339-11b5-456c-8954-d9d11babbd58",
                  label: "人力资源中心",
                  textContent: "人力资源中心",
                  itemNameLabel: "静态文本",
                  name: "text17",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text17",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "shf2f0d181-7960-4776-8afc-9d40870299c9",
            colspan: 2,
            rowspan: 1,
            items: [
              {
                id: "Idshb3c60ae5-f974-4910-b6bb-b8ee1c9c45d4",
                preps: {
                  id: "Idshb3c60ae5-f974-4910-b6bb-b8ee1c9c45d4",
                  label: "副总裁审批",
                  textContent: "副总裁审批",
                  itemNameLabel: "静态文本",
                  name: "text18",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text18",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
          {
            id: "sh3c2b1f1f-9364-426b-8353-4f998d7c2e4a",
            colspan: 2,
            rowspan: 1,
            items: [
              {
                id: "Idsha323ecaa-3caa-4cc6-b9df-4c9246c363d0",
                preps: {
                  id: "Idsha323ecaa-3caa-4cc6-b9df-4c9246c363d0",
                  label: "员工本人签字确认",
                  textContent: "员工本人签字确认",
                  itemNameLabel: "静态文本",
                  name: "text19",
                  clearable: true,
                  readonly: false,
                  rules: [],
                  maxLength: 255,
                  formVisible: true,
                  listVisible: true,
                  viewVisible: true,
                },
                compType: "formItem",
                fieldName: "text19",
                itemType: "text",
                label: "静态文本",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            id: "shee55e609-b3c3-41c7-81b2-8ccbe6c1a98d",
            colspan: 2,
            rowspan: 1,
            items: [],
          },
          {
            id: "shf0f85495-e43b-42c5-8794-e35708b5e495",
            colspan: 2,
            rowspan: 1,
            items: [],
            colHeight: "179.66666793823242px",
          },
          {
            id: "sh66d392db-b5fa-41ef-95ba-379e5edbad22",
            colspan: 2,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh075809bc-03c1-4d90-ba40-0dad237d459f",
            colspan: 2,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh106a5fb6-9f37-4762-a81e-4fadad8e4c71",
            colspan: 8,
            rowspan: 1,
            items: [],
            colHeight: "128.66666793823242px",
          },
        ],
      },
    ],
    rowSpan: "",
    colSpan: "",
  },
  compType: "container",
  fieldName: "dytable1",
  itemType: "dytable",
  type: "dytable",
});*/
const fields = ref<any>({
  "id": "Idshb7874dd8-e4cc-405d-8761-a10f3ee37d4e",
  "preps": {
    "id": "Idshb7874dd8-e4cc-405d-8761-a10f3ee37d4e",
    "label": "动态表格",
    "itemNameLabel": "动态表格",
    "name": "dytable2",
    "elements": [
      {
        "id": "sh38bcee23-a94b-4e25-b236-bb37ebf13a61",
        "colIndex": 1,
        "columns": [
          {
            "id": "shcfa632dd-11d9-4bac-96be-3e9d7d83ad71",
            "colIndex": 1,
            "rowspan": 5,
            "colspan": 1,
            "items": [
              {
                "id": "Idshc4cf9fd4-86cc-4d99-b6a0-91d3d857e4cb",
                "preps": {
                  "id": "Idshc4cf9fd4-86cc-4d99-b6a0-91d3d857e4cb",
                  "label": "静态文本",
                  "itemNameLabel": "静态文本",
                  "name": "text4",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "staticData": true,
                  "textContent": "提出部门填写",
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "text4",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ],
            "colWidth": "61px"
          },
          {
            "id": "sh32fb3645-642e-45e3-9475-2a343196f4e4",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh6c0cfa6a-4271-4b65-a924-8ff3d5abbb88",
                "preps": {
                  "id": "Idsh6c0cfa6a-4271-4b65-a924-8ff3d5abbb88",
                  "label": "TO:",
                  "itemNameLabel": "单行文本框",
                  "name": "to",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入TO:",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "to",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh3427b6cd-4f2a-467d-9986-be6a1984c2e2",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": [
              {
                "id": "Idsh1c230fe6-6b27-4d70-9080-b14caffaca5a",
                "preps": {
                  "id": "Idsh1c230fe6-6b27-4d70-9080-b14caffaca5a",
                  "label": "CC",
                  "itemNameLabel": "单行文本框",
                  "name": "cc",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入CC",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "cc",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          }
        ]
      },
      {
        "id": "shb8e8bd56-37b6-45d1-8666-f4bd8eed6d00",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh76a8a943-d30d-48a4-bb8f-d329b58800fe",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idshbba44114-2ba8-493b-bb71-a847cbbce5fc",
                "preps": {
                  "id": "Idshbba44114-2ba8-493b-bb71-a847cbbce5fc",
                  "itemNameLabel": "单行文本框",
                  "name": "deviceType",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入机型",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "机型"
                },
                "compType": "formItem",
                "fieldName": "deviceType",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ],
            "colWidth": "61px"
          },
          {
            "id": "sh8ab218b2-cd08-49c3-a0db-6f137fbe4b68",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh71caa544-262b-4c15-ac74-aba16444c983",
                "preps": {
                  "id": "Idsh71caa544-262b-4c15-ac74-aba16444c983",
                  "itemNameLabel": "单行文本框",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入工单号",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "工单号",
                  "name": "orderNo"
                },
                "compType": "formItem",
                "fieldName": "orderNo",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh35003fe8-f10f-4925-9e0a-4ac9c2ae8f6f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh90983d6a-8441-4895-8afe-5aa298d7f115",
                "preps": {
                  "id": "Idsh90983d6a-8441-4895-8afe-5aa298d7f115",
                  "itemNameLabel": "单行文本框",
                  "name": "batchNo",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入批量",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "批量"
                },
                "compType": "formItem",
                "fieldName": "batchNo",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "shfd03b545-778a-405e-9076-3adc6b893d14",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh610414f8-aa74-433e-9020-536d58d8741c",
                "preps": {
                  "id": "Idsh610414f8-aa74-433e-9020-536d58d8741c",
                  "label": "发生时间",
                  "itemNameLabel": "日期选择器",
                  "name": "breakTime",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入发生时间",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "elements": [
                    {
                      "id": "sh6097f231-d047-42f9-a132-92c2b37330e8",
                      "colIndex": 1,
                      "columns": [
                        {
                          "id": "sh9840e116-1a06-49e2-b376-64dc07cc2ba8",
                          "colIndex": 1,
                          "rowspan": 1,
                          "colspan": 1,
                          "items": []
                        }
                      ]
                    }
                  ],
                  "rowNums": 1,
                  "columnNums": 1,
                  "type": "datetime"
                },
                "compType": "formItem",
                "fieldName": "breakTime",
                "itemType": "datetime",
                "label": "单行文本框",
                "type": "datetime"
              }
            ]
          }
        ]
      },
      {
        "id": "sh6391511e-a696-4251-a695-1553f55d2ae5",
        "colIndex": 1,
        "columns": [
          {
            "id": "shfddc7f5d-c256-4a3b-b42f-3ee3d176457e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh989a5707-fffd-4563-82d1-a96e5c68bad4",
                "preps": {
                  "id": "Idsh989a5707-fffd-4563-82d1-a96e5c68bad4",
                  "itemNameLabel": "数字输入框",
                  "name": "inputNums",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入投入数",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "投入数",
                  "step": 1,
                  "min": 0,
                  "precision": 0
                },
                "compType": "formItem",
                "fieldName": "inputNums",
                "itemType": "number",
                "label": "单行文本框",
                "type": "number"
              }
            ],
            "colWidth": "61px"
          },
          {
            "id": "sh331e8301-f9ca-46dc-ba43-983e414166cf",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh85dbcf84-3f19-4dc9-8ffd-a7544ef2df59",
                "preps": {
                  "id": "Idsh85dbcf84-3f19-4dc9-8ffd-a7544ef2df59",
                  "itemNameLabel": "数字输入框",
                  "name": "ngNums",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入不良数",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "不良数",
                  "step": 1,
                  "min": 0,
                  "precision": 0
                },
                "compType": "formItem",
                "fieldName": "ngNums",
                "itemType": "number",
                "label": "单行文本框",
                "type": "number"
              }
            ]
          },
          {
            "id": "shbf75dca9-f9fe-4a51-9a5a-ee0a96245cfd",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh3749d58e-8c2f-4ae7-acc2-6e4f223e83d9",
                "preps": {
                  "id": "Idsh3749d58e-8c2f-4ae7-acc2-6e4f223e83d9",
                  "itemNameLabel": "数字输入框",
                  "name": "ngPercent",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入不良率",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "不良率",
                  "step": 1,
                  "min": 0,
                  "precision": 0
                },
                "compType": "formItem",
                "fieldName": "ngPercent",
                "itemType": "number",
                "label": "单行文本框",
                "type": "number"
              }
            ]
          },
          {
            "id": "sh8ee3759b-3260-4c28-ac16-2f890b7edb51",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idshe2ca0871-1a69-4348-83b2-0babcf91f542",
                "preps": {
                  "id": "Idshe2ca0871-1a69-4348-83b2-0babcf91f542",
                  "itemNameLabel": "单行文本框",
                  "name": "lineNo",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入班线",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "班线"
                },
                "compType": "formItem",
                "fieldName": "lineNo",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          }
        ]
      },
      {
        "id": "shbef60254-39a4-4f7f-9829-cf60675104a4",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh89c4f005-82c6-4d0c-8099-80f82bf0e0c0",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 4,
            "items": [
              {
                "id": "Idshcc75dce8-51c1-4b5e-bedc-805d589cafa0",
                "preps": {
                  "id": "Idshcc75dce8-51c1-4b5e-bedc-805d589cafa0",
                  "itemNameLabel": "多行文本框",
                  "name": "eventDesc",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入停线事实描述",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "停线事实描述",
                  "autosize": true,
                  "labelPosition": "top"
                },
                "compType": "formItem",
                "fieldName": "eventDesc",
                "itemType": "textarea",
                "label": "多行文本框",
                "type": "textarea"
              }
            ],
            "colWidth": "61px",
            "colHeight": "134px"
          }
        ]
      },
      {
        "id": "sh276180f4-054f-4970-8f70-d0bdb91cd18b",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh66bcb347-9203-4e37-9be5-aa33670c536d",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idshaa6e9b33-38c5-4d9b-ba4c-79273fc2b413",
                "preps": {
                  "id": "Idshaa6e9b33-38c5-4d9b-ba4c-79273fc2b413",
                  "itemNameLabel": "日期选择器",
                  "name": "agreeTime",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择批准/时间",
                  "type": "datetime",
                  "disabledDate": "(e20) => t16.value.includes(e20.getDate().toString())",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "批准/时间"
                },
                "compType": "formItem",
                "fieldName": "agreeTime",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ],
            "colWidth": "61px"
          },
          {
            "id": "shac06b6d5-88ae-4aca-bdec-fb0cdac06626",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh92368ffa-453b-4435-b891-bdccd0cc25f4",
                "preps": {
                  "id": "Idsh92368ffa-453b-4435-b891-bdccd0cc25f4",
                  "label": "QE确认",
                  "itemNameLabel": "单行文本框",
                  "name": "qeConfirm",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入QE确认",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "qeConfirm",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          },
          {
            "id": "sh617a9dc5-d19e-4c63-b2fc-b2e5df520b85",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh1e735bc8-c4f2-4bc5-901b-5efeefac1a9e",
                "preps": {
                  "id": "Idsh1e735bc8-c4f2-4bc5-901b-5efeefac1a9e",
                  "label": "提出人/时间",
                  "itemNameLabel": "日期选择器",
                  "name": "applyTime",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请选择提出人/时间",
                  "type": "datetime",
                  "disabledDate": "(e20) => t16.value.includes(e20.getDate().toString())",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "applyTime",
                "itemType": "datetime",
                "label": "日期选择器",
                "type": "datetime"
              }
            ]
          },
          {
            "id": "sh98674768-74d0-45c6-ac52-067afc3976f7",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [
              {
                "id": "Idshd049d260-6476-447d-b581-f22900d880e8",
                "preps": {
                  "id": "Idshd049d260-6476-447d-b581-f22900d880e8",
                  "label": "提出部门",
                  "itemNameLabel": "单行文本框",
                  "name": "applyDept",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入提出部门",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true
                },
                "compType": "formItem",
                "fieldName": "applyDept",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          }
        ]
      },
      {
        "id": "shc0ee7ccc-1fcb-44a6-b05a-7f411e327671",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh6891de50-96eb-46fc-91a9-020eb4cb1224",
            "colIndex": 1,
            "rowspan": 2,
            "colspan": 1,
            "items": [
              {
                "id": "Idsh8953336f-8d54-4bb4-a0c3-e3356c94ea40",
                "preps": {
                  "id": "Idsh8953336f-8d54-4bb4-a0c3-e3356c94ea40",
                  "label": "静态文本",
                  "itemNameLabel": "静态文本",
                  "name": "text26",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "placeholder": "",
                  "staticData": true,
                  "textContent": "工程填写",
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "text26",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ],
            "colWidth": "61px"
          },
          {
            "id": "sh927870de-9893-415d-93ae-3e632a635cf2",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 4,
            "items": [{
              "id": "Idsh2ab87a1a-c12e-4463-8c6c-9b2be96b9511",
              "preps": {
                "id": "Idsh2ab87a1a-c12e-4463-8c6c-9b2be96b9511",
                "itemNameLabel": "多行文本框",
                "name": "text27",
                "clearable": true,
                "readonly": false,
                "rules": [],
                "maxLength": 255,
                "formVisible": true,
                "listVisible": true,
                "viewVisible": true,
                "placeholder": "请输入不良原因及临时措施实施情况",
                "label": "不良原因及临时措施实施情况"
              },
              "compType": "formItem",
              "fieldName": "text27",
              "itemType": "textarea",
              "label": "静态文本",
              "type": "textarea"
            },
              {
                "id": "Idshe83a64aa-1407-4ad3-9d4e-1f7c5182513b",
                "preps": {
                  "id": "Idshe83a64aa-1407-4ad3-9d4e-1f7c5182513b",
                  "itemNameLabel": "单行文本框",
                  "name": "input28",
                  "clearable": true,
                  "readonly": false,
                  "placeholder": "请输入出货交付影响",
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "label": "出货交付影响"
                },
                "compType": "formItem",
                "fieldName": "input28",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }],
            "colHeight": "189px"
          }
        ]
      },
      {
        "id": "sh080e0b20-c26a-4d0e-b877-048e7aea2236",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh9a63de93-650e-4fce-9ec2-f96d6f00e0c2",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 2,
            "items": []
          },

          {
            "id": "sh821cb553-f8e6-4e37-9a68-40906d9491d0",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "sh6f2c322e-dbd7-4bf9-98c0-285fffb3d390",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "sh27517fcc-f8b9-40ce-b2bc-ccaddad6945c",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh972a559e-4345-4cb0-a5d2-6f049f50e06f",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "colWidth": "61px"
          },
          {
            "id": "shaeb77a2c-ff67-4ace-b82a-1637019d57bc",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "colHeight": "43px"
          },
          {
            "id": "sh82606dac-ea01-4941-8b0e-1c4d543e8508",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "sh1094a993-d438-42a7-aa3e-4bc454cb3a6c",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "shbd885cda-5a0e-424e-8bf2-58bde893cf84",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "shad3f2336-e6fb-4f7a-93bd-34ec9a9e8ccf",
        "colIndex": 1,
        "columns": [
          {
            "id": "sh1ffd8ff7-e0f9-45fe-a7aa-fd48303f4732",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "colWidth": "61px"
          },
          {
            "id": "she851f8fd-31dd-45d1-95af-e8fc22dcf0b5",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "shbe000394-ce04-4efb-ba5d-22391d29f2c7",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "sh6e275ba0-1859-4ddd-9b3f-562778e8d1fe",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "sh5454f2ea-0811-4866-907e-2348f3a3c6ce",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "sh0e0ff5db-836e-4317-ad28-e001833fe871",
        "colIndex": 1,
        "columns": [
          {
            "id": "shc8948a53-401f-46c7-84c1-55b1089177dd",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": [],
            "colWidth": "61px"
          },
          {
            "id": "sh32dc4460-8f91-42ef-a03b-76411ca76c78",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "sh12fd81d9-68c9-41fb-b643-c8624388bc9e",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "sh0b6a5c8e-8e17-43e8-bcc7-6add1fb9b8f6",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          },
          {
            "id": "she028a637-8149-4fb0-8ee7-89f389ad0d4b",
            "colIndex": 1,
            "rowspan": 1,
            "colspan": 1,
            "items": []
          }
        ]
      }
    ],
    "rules": [],
    "maxLength": 255,
    "formVisible": true,
    "listVisible": true,
    "viewVisible": true,
    "rowNums": 10,
    "columnNums": 5
  },
  "compType": "container",
  "fieldName": "dytable2",
  "itemType": "dytable",
  "rowNums": 1,
  "columnNums": 1,
  "type": "dytable"
});
onMounted(() => {
  designForm.clearAll(true);
  const elements = fields.value.preps.elements;
  /*for (let i = 0; i < 35; i++) {
    const columns: any = [];
    const id = "r" + (i + 5);
    for (let j = 1; j <= 8; j++) {
      columns.push({
        "id": `${id + ("c" + j)}`,
        "colspan": 1,
        "rowspan": 1,
        "items": []
      });
    }
    elements.push({
      id: id,
      colIndex: 1,
      columns: columns,
    });
  }*/
});
</script>

<style lang="scss" scoped></style>
