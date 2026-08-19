<script setup lang="ts">
import { ref } from "vue";
import type { PdfSignatureInfo, PdfTemplate } from "@/components/pdf";
import { PdfSigner, PdfTemplateDesigner } from "@/components/pdf";

const pdfTemplate = ref<PdfTemplate>({
  name: "销售合同模板",
  page: {
    width: 595,
    height: 842,
    marginTop: 56,
    marginBottom: 56,
    marginLeft: 56,
    marginRight: 56,
    background: "#FFFFFF",
    header: {
      text: "销售合同",
      align: "center",
      font: { family: "SimSun", size: 10, color: "#999999" },
    },
    footer: {
      text: "第 ${page} 页 / 共 ${totalPage} 页",
      align: "center",
      font: { family: "SimSun", size: 9, color: "#999999" },
      showPageNumber: true,
    },
  },
  elements: [
    {
      id: "el_title",
      type: "heading",
      x: 56,
      y: 80,
      width: 483,
      height: 36,
      text: "产品销售合同",
      font: { family: "SimHei", size: 22, weight: "bold", color: "#333333" },
      align: "center",
    },
    {
      id: "el_contract_no",
      type: "text",
      x: 56,
      y: 130,
      width: 240,
      height: 20,
      text: "合同编号:",
      font: { family: "SimSun", size: 11, color: "#333333" },
      align: "left",
      dataField: "contractNo",
    },
    {
      id: "el_sign_date",
      type: "date",
      x: 300,
      y: 130,
      width: 239,
      height: 20,
      text: "签订日期:",
      font: { family: "SimSun", size: 11, color: "#333333" },
      align: "right",
      dataField: "signDate",
    },
    {
      id: "el_party_a",
      type: "text",
      x: 56,
      y: 165,
      width: 483,
      height: 20,
      text: "甲方（买方）：",
      font: { family: "SimSun", size: 12, color: "#333333" },
      align: "left",
      dataField: "partyA",
    },
    {
      id: "el_party_b",
      type: "text",
      x: 56,
      y: 190,
      width: 483,
      height: 20,
      text: "乙方（卖方）：",
      font: { family: "SimSun", size: 12, color: "#333333" },
      align: "left",
      dataField: "partyB",
    },
    {
      id: "el_desc",
      type: "paragraph",
      x: 56,
      y: 225,
      width: 483,
      height: 50,
      text: "经双方友好协商，就产品买卖事宜达成如下协议：",
      font: { family: "SimSun", size: 11, color: "#333333" },
      align: "left",
    },
    {
      id: "el_table",
      type: "table",
      x: 56,
      y: 290,
      width: 483,
      height: 120,
      columns: [
        { field: "name", label: "产品名称", width: 180, align: "left" },
        { field: "spec", label: "规格", width: 120, align: "center" },
        { field: "qty", label: "数量", width: 80, align: "right" },
        { field: "price", label: "单价(元)", width: 103, align: "right" },
      ],
      dataSource: "items",
      headerBgColor: "#F5F7FA",
      borderColor: "#DCDFE6",
    },
    {
      id: "el_divider",
      type: "divider",
      x: 56,
      y: 430,
      width: 483,
      height: 1,
      color: "#DCDFE6",
      thickness: 1,
      style: "dashed",
    },
    {
      id: "el_amount",
      type: "text",
      x: 300,
      y: 445,
      width: 239,
      height: 24,
      text: "合计金额：¥",
      font: { family: "SimHei", size: 14, weight: "bold", color: "#F56C6C" },
      align: "right",
      dataField: "totalAmount",
    },
    {
      id: "el_sign_a",
      type: "signature",
      x: 80,
      y: 680,
      width: 160,
      height: 60,
      fit: "contain",
      dataField: "signA",
    },
    {
      id: "el_sign_b",
      type: "signature",
      x: 350,
      y: 680,
      width: 160,
      height: 60,
      fit: "contain",
      dataField: "signB",
    },
    {
      id: "el_qrcode",
      type: "qrcode",
      x: 460,
      y: 760,
      width: 70,
      height: 70,
      value: "https://example.com/contract/verify",
      format: "QR",
    },
  ],
});

const signatures = ref<PdfSignatureInfo[]>([
  {
    id: "sig1",
    signer: "张三",
    signedAt: "2026-07-18T10:30:00Z",
    x: 30,
    y: 40,
    width: 100,
    height: 40,
    page: 1,
  },
]);
</script>

<template>
  <div class="demo-container">
    <h3>PDF 模板设计器与签章 PdfTemplateDesigner / PdfSigner</h3>
    <p>
      PDF
      模板设计器支持文本、标题、段落、图片、表格、分割线、二维码、签章等元素的可视化排版，支持数据字段绑定。下方
      PdfSigner 提供手写签名采集与签章管理能力。
    </p>

    <h4 class="section-title">一、PDF 模板设计器</h4>
    <div class="demo-canvas designer-canvas">
      <PdfTemplateDesigner :initial-template="pdfTemplate" />
    </div>

    <h4 class="section-title">二、PDF 签章组件</h4>
    <div class="demo-canvas signer-canvas">
      <PdfSigner :signatures="signatures" />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.section-title {
  margin: 16px 0 8px;
  color: var(--el-text-color-primary);
}

.demo-canvas {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.designer-canvas {
  height: 620px;
}

.signer-canvas {
  height: 360px;
}
</style>
