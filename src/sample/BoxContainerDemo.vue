<template>
  <box-container
    :formData="formData"
    :field="fields"
    :isDesign="true"
    :formInfo="{}"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import piniaInstance from "@/store";
import { useDesignFormStore } from "@/store/designForm";

let designForm = useDesignFormStore(piniaInstance);
let currenetId = computed(() => designForm.currentItemId);
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
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "shcf1309e9-097a-43ed-a381-d5b627ec0efd",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh9820b4c7-033f-49fd-b8a9-1fefb7ba5027",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "shd99fc659-8388-4be7-af62-12d993098081",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh3e4ca9b1-fbf3-4d61-af75-de733a6886a0",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "shcdd9b25b-0c92-4049-9347-980650ab839b",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh8c8f768b-3bca-441e-9099-b1c5a9ef04f5",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh2c39d1ef-81b9-48cc-9fe0-7e3d3d993f9d",
            colspan: 3,
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
            colspan: 3,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh2510b89e-4d7b-45b9-ac11-dc6c388a9bc7",
            colspan: 3,
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
            colspan: 21,
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
            colspan: 3,
            rowspan: 1,
            items: [
              {
                id: "Idshde0b579d-070f-477f-a720-d931586a0b2a",
                preps: {
                  id: "Idshde0b579d-070f-477f-a720-d931586a0b2a",
                  label: "处分事由   （可附页）",
                  textContent: "处分事由   （可附页）",
                  staticData: true,
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
            colspan: 21,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sha92a037a-7131-48b6-83c0-54b2424031c2",
            colspan: 3,
            rowspan: 1,
            items: [
              {
                id: "Idsha86eb617-3793-44eb-a3e3-a8b8222694be",
                preps: {
                  id: "Idsha86eb617-3793-44eb-a3e3-a8b8222694be",
                  label: "公司损失",
                  textContent: "公司损失",
                  staticData: true,
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
            colspan: 21,
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
            colspan: 3,
            rowspan: 1,
            items: [
              {
                id: "Idsh000ecc75-d948-4915-b113-931dbe1f87ed",
                preps: {
                  id: "Idsh000ecc75-d948-4915-b113-931dbe1f87ed",
                  label: "处分依据及处分决定",
                  textContent: "处分依据及处分决定",
                  staticData: true,
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
            colspan: 21,
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
            colspan: 24,
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
            colspan: 6,
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
            colspan: 6,
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
            colspan: 6,
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
            colspan: 6,
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
            colspan: 6,
            rowspan: 1,
            items: [],
          },
          {
            id: "shf0f85495-e43b-42c5-8794-e35708b5e495",
            colspan: 6,
            rowspan: 1,
            items: [],
            colHeight: "179.66666793823242px",
          },
          {
            id: "sh66d392db-b5fa-41ef-95ba-379e5edbad22",
            colspan: 6,
            rowspan: 1,
            items: [],
          },
          {
            id: "sh075809bc-03c1-4d90-ba40-0dad237d459f",
            colspan: 6,
            rowspan: 1,
            items: [],
          },
        ],
      },
      {
        columns: [
          {
            id: "sh106a5fb6-9f37-4762-a81e-4fadad8e4c71",
            colspan: 24,
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
  fieldName: "box1",
  itemType: "box",
  type: "box",
});*/

const fields=ref<any>({
  "id": "Idsh5d0dae94-d250-4e19-b655-04dc860f722d",
  "preps": {
    "id": "Idsh5d0dae94-d250-4e19-b655-04dc860f722d",
    "label": "动态表格",
    "itemNameLabel": "动态表格",
    "name": "dytable1",
    "elements": [
      {
        "id": "r1",
        "colIndex": 1,
        "columns": [
          {
            "id": "r1c1",
            "colIndex": 1,
            "colspan": 1,
            "rowspan": 1,
            "items": [],
            "colWidth": "40.95833396911621px"
          },
          {
            "id": "r1c2",
            "colspan": 1,
            "rowspan": 1,
            "items": [],
            "colWidth": "35.47917175292969px"
          },
          {
            "id": "r1c3",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r1c4",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r1c5",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r1c6",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r1c7",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "r2",
        "colIndex": 1,
        "columns": [
          {
            "id": "r2c1",
            "colspan": 1,
            "rowspan": 1,
            "items": [],
            "colWidth": "40.95833396911621px"
          },
          {
            "id": "r2c2",
            "colspan": 1,
            "rowspan": 1,
            "items": [],
            "colWidth": "35.47917175292969px"
          },
          {
            "id": "r2c3",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r2c4",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r2c5",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r2c6",
            "colspan": 1,
            "rowspan": 1,
            "items": [
              {
                "id": "Idsh6ef71f47-2050-4960-af45-f8303c6996f9",
                "preps": {
                  "id": "Idsh6ef71f47-2050-4960-af45-f8303c6996f9",
                  "label": "静态文本",
                  "itemNameLabel": "静态文本",
                  "name": "text3",
                  "clearable": true,
                  "readonly": false,
                  "rules": [],
                  "maxLength": 255,
                  "formVisible": true,
                  "listVisible": true,
                  "viewVisible": true,
                  "hideLabel": true,
                  "staticData": true,
                  "textContent": "生产工单号",
                  "placeholder": ""
                },
                "compType": "formItem",
                "fieldName": "text3",
                "itemType": "text",
                "label": "静态文本",
                "type": "text"
              }
            ],
            "colHeight": "22.666667938232422px"
          },
          {
            "id": "r2c7",
            "colspan": 1,
            "rowspan": 1,
            "items": [
              {
                "id": "Idsh7b11f3b7-4aaf-41ce-a1b8-1763d6b1ad78",
                "preps": {
                  "id": "Idsh7b11f3b7-4aaf-41ce-a1b8-1763d6b1ad78",
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
                  "viewVisible": true,
                  "hideLabel": true
                },
                "compType": "formItem",
                "fieldName": "input2",
                "itemType": "input",
                "label": "单行文本框",
                "type": "input"
              }
            ]
          }
        ]
      },
      {
        "id": "r3",
        "colIndex": 1,
        "columns": [
          {
            "id": "r3c1",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c2",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c3",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c4",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c5",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c6",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r3c7",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "r4",
        "colIndex": 1,
        "columns": [
          {
            "id": "r4c1",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c2",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c3",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c4",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c5",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c6",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r4c7",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          }
        ]
      },
      {
        "id": "r5",
        "colIndex": 1,
        "columns": [
          {
            "id": "r5c1",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c2",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c3",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c4",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c5",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c6",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          },
          {
            "id": "r5c7",
            "colspan": 1,
            "rowspan": 1,
            "items": []
          }
        ]
      }
    ]
  },
  compType: "container",
  fieldName: "box1",
  itemType: "box",
  type: "box",
});
onMounted(() => {
  designForm.clearAll(true);
  designForm.addCurrentCompEditUserInfo("sh0aacfdf0-a223-463d-9b9b-xxx", {
    userId: "测试",
    name: "测试",
    username: "测试",
  });
});
</script>

<style lang="scss" scoped></style>
