<script setup lang="ts" name="Areainfo">
import {onMounted, provide, ref} from "vue";
import {PageFieldInfo} from "@/components/types/PageFieldInfo";
import {StarHorseForm, StarHorseTableComp} from "@/components/comp";
import {apiInstance, closeLoad, dialogPreps, load} from "@/api/star_horse_utils";
import {download} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {ApiUrls} from "@/components/types";

const dataUrl: ApiUrls = apiInstance("userdb-manage", "generator/code");

const testFormValidRef = ref();
const outerData: any = {
  backgroundSize: "http你好%",
  qrcode: "http://www.baidu.com",
  barcode: "22222223333",
};
const fieldList = ref<PageFieldInfo>({
  fieldList: [ { "dytableList": [ [ { "label": "Html组件", "fieldName": "html2", "type": "html", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "rowNums": 1, "textContent": "<p style=\"text-align: center;\"><span style=\"font-size: 19px;\">惠州朵唯通信设备有限公司</span></p><p style=\"text-align: center;\"><span style=\"font-size: 19px;\">异常反馈单</span></p>", "colspan": 5, "viewVisible": true, "readonly": false, "formVisible": true, "elements": [ { "id": "sh4e7f9873-960c-4fbe-bfda-febc1108da17", "colIndex": 1, "columns": [ { "id": "she2d30714-d681-48e8-be06-c4e1093f765a", "colIndex": 1, "rowspan": 1, "colspan": 1, "items": [], "cellVisible": true } ] } ], "rowspan": 3, "columnNums": 1, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shdb288f86-bede-4d0a-b634-27be9280f3bb" }, { "label": "静态文本", "fieldName": "text3", "type": "text", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "185px", "textContent": "批准", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "appCompVisible": true, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh272263b2-64ee-49e0-8f03-081f4befe3ea" }, { "label": "静态文本", "fieldName": "text4", "type": "text", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "textContent": "审核", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "appCompVisible": true, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh623fdb70-b314-4ab8-8243-6004f382c6b8" }, { "label": "静态文本", "fieldName": "text5", "type": "text", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "textContent": "作成", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "appCompVisible": true, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh78e007ac-fa43-4cf9-81e9-80e527dddcc1" } ], [ { "label": "批准", "fieldName": "pizhun", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "185px", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入批准", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shac0fc43c-9515-4c7c-bc72-8e8befb155e9" }, { "label": "审核", "fieldName": "shenhe", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入审核", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh0d1abe78-a0b2-48fe-a2ab-b6f429816a06" }, { "label": "作成", "fieldName": "zuocheng", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入作成", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh7aa26678-4e58-4cde-8359-3ac1383a1544" } ], [ { "label": "批准时间", "fieldName": "pizhunshijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "185px", "type": "datetime", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请选择批准时间", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh5513989e-d01d-493f-919c-5ce15a262d75" }, { "label": "审核时间", "fieldName": "shenheshijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请选择审核时间", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh1d77c0c8-7df2-46e8-addc-e6c8db504da0" }, { "label": "作成时间", "fieldName": "zuochengshijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请选择作成时间", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh9a8987c4-1106-4ec6-b5a9-28b741a710f8" } ], [ { "label": "TO", "fieldName": "formTo", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入TO", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh828e9be4-d111-4f6c-82a3-21a12d7865d9" }, { "label": "CC", "fieldName": "chaosong", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "186px", "colspan": 4, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入CC", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shb043dcff-f307-4ca0-9396-bde2709450f4" }, { "label": "编号", "fieldName": "bianhao", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入编号", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh43355758-0f59-4c58-999e-dba032b13c41" } ], [ { "label": "机型", "fieldName": "jixing", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入机型", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh95fde466-3c98-482b-9617-8cf5a49ca10e" }, { "label": "生产批号", "fieldName": "shengchanpihao", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "186px", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入生产批号", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shc89eabf2-6ddf-42d1-afbc-a2c6d3abf689" }, { "label": "批量", "fieldName": "piliang", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colWidth": "172px", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入批量", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "she382caae-53b3-4193-bb40-978526db89c1" }, { "label": "发生时间", "fieldName": "fashengshijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入发生时间", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh7802503a-0fab-4a79-b7ab-bf7e132e8470" } ], [ { "label": "投入数", "fieldName": "tourushu", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "precision": 0, "colspan": 2, "viewVisible": true, "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "step": 1, "placeholder": "请输入投入数", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh041b920a-8e1b-40ca-be27-c7cd0759eba3" }, { "label": "不良数", "fieldName": "buliangshu", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "precision": 0, "colWidth": "186px", "colspan": 2, "viewVisible": true, "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "step": 1, "placeholder": "请输入不良数", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh1776fa92-fbe5-439c-890b-57041f83a636" }, { "label": "不良率", "fieldName": "bulianglv", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "precision": 0, "colWidth": "172px", "colspan": 2, "viewVisible": true, "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "step": 1, "placeholder": "请输入不良率", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh207680a2-2a3b-471e-84da-55d82b3c122a" }, { "label": "反馈时间", "fieldName": "fankuishijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请选择反馈时间", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh7ae3cc32-3cba-4e10-82f9-6edae73fd632" } ], [ { "label": "异常内容描述", "fieldName": "ycnrms", "type": "textarea", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 6, "colHeight": "127px", "viewVisible": true, "readonly": false, "formVisible": true, "labelPosition": "top", "rowspan": 1, "placeholder": "请输入异常内容描述", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shebddaed2-9e1b-4283-874c-fab336375418" }, { "label": "静态文本", "fieldName": "text24", "type": "text", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "textContent": "开出部门", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh86605876-ebf5-43cf-a6ad-5718d93f9505" }, { "label": "单选框", "fieldName": "kaichubumen", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "IPQC", "value": "ipqc" }, { "name": "FQC", "value": "fqc" }, { "name": "工程", "value": "gongcheng" }, { "name": "产线", "value": "chanxian" }, { "name": "其它", "value": "qita" } ], "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "hideLabel": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh31195e04-1718-41cb-9a13-cd2ec14856e8" } ], [ { "label": "根本原因分析（工程填写）", "fieldName": "gbyyfxgctx", "type": "textarea", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 6, "colHeight": "171px", "viewVisible": true, "readonly": false, "formVisible": true, "labelPosition": "top", "rowspan": 3, "placeholder": "请输入根本原因分析（工程填写）", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh23b6a0c8-c148-401c-ab9e-23394df58d95" }, { "label": "责任判定", "fieldName": "zherenpanding", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "设计不良", "value": "sjbl" }, { "name": "物料不良", "value": "wlbl" }, { "name": "制程不良", "value": "zcbl" }, { "name": "其它", "value": "qita" } ], "colspan": 6, "colHeight": "171px", "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 3, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh23b6a0c8-c148-401c-ab9e-23394df58d95" }, { "label": "分析人", "fieldName": "fenxiren", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入分析人", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sha9a88708-4bba-4e88-9788-934624e31f5d" } ], [ { "label": "QE确认", "fieldName": "qequeren", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入QE确认", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh1a647fd5-536b-4255-9d3e-262e02b8e106" } ], [ { "label": "工程经理", "fieldName": "gongchengjingli", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入工程经理", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh49253a3a-9b4d-477c-b2c9-a2e797102ad0" } ], [ { "label": "临时措施（责任部门填写）", "fieldName": "lscszrbmtx", "type": "textarea", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 6, "colHeight": "125px", "viewVisible": true, "readonly": false, "formVisible": true, "labelPosition": "top", "rowspan": 2, "placeholder": "请输入临时措施（责任部门填写）", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shf1f22cd1-a43d-48c4-9e1a-5ddde5ff51db" }, { "label": "制订人", "fieldName": "zhidingren", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入制订人", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh956c7896-4cbc-4a84-ac6f-867f41c1309d" } ], [ { "label": "制定时间", "fieldName": "shidingshijian", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入制定时间", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh932221c7-eb17-4722-a8c4-c2b72fe4807a" } ], [ { "label": "静态文本", "fieldName": "text34", "type": "text", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "textContent": "不良排查", "colspan": 1, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 2, "staticData": true, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh9679151e-ecfa-47d1-a3b5-5145605290fb" }, { "label": "1.原材料", "fieldName": "yuancailiao", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "需要", "value": "xuyao" }, { "name": "不需要", "value": "buxuyao" } ], "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shccb2fe0d-3b8f-42a5-80a9-e9b6939f5138" }, { "label": "2.在制半成品", "fieldName": "zzbcp", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "需要", "value": "xuyao" }, { "name": "不需要", "value": "buxuyao" } ], "colWidth": "172px", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shfeb9c678-5b89-4706-b05a-4a80cdc5fbda" }, { "label": "排查人员", "fieldName": "paicharenyuan", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 2, "placeholder": "请输入排查人员", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh35329b71-f884-4640-b668-9077092ecff3" } ], [ { "label": " 3.成品库存", "fieldName": "chengpinkucun", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "需要", "value": "xuyao" }, { "name": "不需要", "value": "buxuyao" } ], "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shf0dc5955-36d1-4841-a0f9-94b2e137ab46" }, { "label": "4.已出货品", "fieldName": "yichuhuopin", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "需要", "value": "xuyao" }, { "name": "不需要", "value": "buxuyao" } ], "colWidth": "172px", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shb47c7d86-8bea-4fbd-b221-489d84928ddc" } ], [ { "label": "长期预防措施", "fieldName": "cqyfcs", "type": "textarea", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 6, "colHeight": "150px", "viewVisible": true, "readonly": false, "formVisible": true, "labelPosition": "top", "rowspan": 3, "placeholder": "请输入长期预防措施", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh22a619c6-91e0-4649-8998-815428aae05d" }, { "label": "标准化", "fieldName": "biaozhunhua", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "作业标准修订", "value": "zybzxd" }, { "name": "图纸修订", "value": "tuzhixiuding" }, { "name": "研发/技术更改，ECN号", "value": "yf_jsgg" }, { "name": "其它", "value": "other" } ], "colspan": 6, "colHeight": "150px", "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 3, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh22a619c6-91e0-4649-8998-815428aae05d" }, { "label": "制定人", "fieldName": "zhidingren2", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入制定人", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh0372f8a5-6433-4ad4-9179-6c78088862b0" } ], [ { "label": "制定时间", "fieldName": "zhidingshijian2", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入制定时间", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh632737a0-4027-48a7-a957-d2c69e009fa1" } ], [ { "label": "部门经理", "fieldName": "bumenjingli", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入部门经理", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh0475571e-5528-44f4-8d1f-dbf6c8fc56e5" } ], [ { "label": "Html组件", "fieldName": "html46", "type": "html", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "rowNums": 1, "textContent": "<p style=\"text-align: left;\">改善措施效果确认</p>", "colspan": 6, "colHeight": "51px", "viewVisible": true, "readonly": false, "formVisible": true, "elements": [ { "id": "sh252b242f-43c2-4951-acbf-57444753e1d9", "colIndex": 1, "columns": [ { "id": "she33c19e0-72d4-4839-abf9-23b6efeb50bc", "colIndex": 1, "rowspan": 1, "colspan": 1, "items": [], "cellVisible": true } ] } ], "rowspan": 1, "styles": { "alignItems": "start" }, "staticData": true, "columnNums": 1, "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh633d02b5-feb9-4199-a178-694b9e728e5c" }, { "label": "QE确认", "fieldName": "qequeren2", "type": "input", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 2, "placeholder": "请输入QE确认", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh47aad720-f646-4501-8f21-238910723e9a" } ], [ { "label": "跟踪时段", "fieldName": "gzsd", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "format": "HH", "valueFormat": "HH", "type": "datetime", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请选择跟踪时段", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "she671b08e-b043-48b7-90fd-27ae5034dbc4" }, { "label": "投入数", "fieldName": "tourushu2", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "precision": 0, "colWidth": "62px", "colspan": 2, "viewVisible": true, "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "step": "1", "placeholder": "请输入投入数", "controlsPosition": "right", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh961e5ee0-4540-4e7a-a3f8-8c8bf0e63fef" }, { "label": "不良数", "fieldName": "buliangshu2", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "precision": 0, "colWidth": "185px", "colspan": 1, "viewVisible": true, "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "step": "1", "placeholder": "请输入不良数", "controlsPosition": "right", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shfd71552a-672f-4ad4-a6c0-d8e7fc025fa0" }, { "label": "不良率", "fieldName": "bulianglv2", "type": "number", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": false, "precision": 0, "label": "不良率", "colspan": 1, "viewVisible": true, "itemNameLabel": "数字输入框", "min": 0, "readonly": false, "formVisible": true, "rowspan": 1, "name": "bulianglv2", "step": "1", "id": "sh9c050143-3467-48cd-a0f2-3cb0ed729672", "placeholder": "请输入不良率", "maxLength": 10, "listVisible": true } } ], [ { "label": "判定", "fieldName": "panding", "type": "radio", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "values": [ { "name": "措施有效，可继续生产，进一步跟进效果", "value": "ok" }, { "name": "措施无效，需停线整改", "value": "ng" } ], "colspan": 6, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "valuesDefaultValue": [ {} ], "dataSource": "data", "analysisType": "func", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shc983efcb-8281-44eb-8164-ff36da17c67f" }, { "label": "确认时间", "fieldName": "qurenshijian2", "type": "datetime", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "type": "datetime", "colspan": 2, "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 2, "placeholder": "请选择确认时间", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "sh5935a9a0-a5ce-4365-9d81-c1f3f92a305b" } ], [ { "label": "备注", "fieldName": "formRemark", "type": "textarea", "required": false, "formVisible": true, "listVisible": true, "defaultValue": false, "preps": { "clearable": true, "cellVisible": true, "colspan": 6, "colHeight": "92px", "viewVisible": true, "readonly": false, "formVisible": true, "rowspan": 1, "placeholder": "请输入备注", "listVisible": true, "starHorseFieldSource": 1 }, "actions": {}, "id": "shfb90bfe2-43e0-4bb6-8438-48caf9e01b04" } ] ] }, { "label": "角色Id", "fieldName": "createdRoleId", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "创建人", "fieldName": "createdBy", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "修改人", "fieldName": "updatedBy", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "版本号", "fieldName": "version", "type": "number", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "是否删除", "fieldName": "isDel", "type": "number", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "数据编号", "fieldName": "dataNo", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "状态", "fieldName": "statusCode", "type": "select", "formVisible": false, "listVisible": false, "preps": { "urlOrDictName": "common", "name": "statusCode", "dataSource": "dict" }, "commonFlag": "Y" }, { "label": "状态名称", "fieldName": "statusName", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "国际编码", "fieldName": "local", "type": "input", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "备注", "fieldName": "remark", "type": "textarea", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" }, { "label": "租户", "fieldName": "tenantId", "type": "select", "formVisible": false, "listVisible": false, "preps": {}, "commonFlag": "Y" } ]

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
        urlOrDictName: "/system-config/system/usersinfo/pageList",
        displayName: "name",
        displayValue: "username",
      }
    },
  ],
});*/
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
