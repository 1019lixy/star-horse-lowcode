import {
    Plus,
    Check,
    FolderOpened,
    Download,
    View,
    Switch,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { PdfTemplate, PdfSignatureInfo } from "@/components/pdf";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * PDF 模板 Demo 示例数据
 *
 * 销售合同模板，包含标题/文本/日期/段落/表格/分割线/金额/签章/二维码等元素。
 */
export const SAMPLE_PDF_TEMPLATE: PdfTemplate = {
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
};

/**
 * PDF 签章 Demo 示例数据
 */
export const SAMPLE_PDF_SIGNATURES: PdfSignatureInfo[] = [
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
];

/**
 * PdfDemo 主操作（左侧）
 */
export const PDF_ACTIONS: ShDemoAction[] = [
    { key: "newTemplate", icon: Plus, labelKey: "advanced.pdf.toolbar.newTemplate", type: "primary" },
    { key: "saveTemplate", icon: Check, labelKey: "advanced.pdf.toolbar.saveTemplate" },
    { key: "loadTemplate", icon: FolderOpened, labelKey: "advanced.pdf.toolbar.loadTemplate" },
    { key: "exportPdf", icon: Download, tooltipKey: "advanced.pdf.toolbar.exportPdf", iconOnly: true },
    { key: "preview", icon: View, tooltipKey: "advanced.pdf.toolbar.preview", iconOnly: true },
];

/**
 * PdfDemo 次要操作（右侧）
 */
export const PDF_SECONDARY: ShDemoAction[] = [
    { key: "toggleSigner", icon: Switch, tooltipKey: "advanced.pdf.toolbar.toggleSigner", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.pdf.toolbar.help", iconOnly: true },
];
