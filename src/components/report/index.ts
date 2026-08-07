/**
 * 报表设计器 - 模块导出
 */
export {default as ReportDesigner} from "./ReportDesigner.vue";
export {default as ReportToolbar} from "./panels/ReportToolbar.vue";
export {default as ReportCanvas} from "./panels/ReportCanvas.vue";
export {default as ReportPropertyPanel} from "./panels/ReportPropertyPanel.vue";
export {default as ReportDatasetDialog} from "./dialogs/ReportDatasetDialog.vue";
export {default as ReportPreviewDialog} from "./dialogs/ReportPreviewDialog.vue";
export {useReportDesigner} from "./composables/useReportDesigner";
export {
    colToLetter,
    letterToCol,
    toAddress,
    fromAddress,
    parseRange,
    rangeToAddresses,
    toRange,
    offsetAddress,
} from "./CellUtils";
export {
    evalFormula,
    extractCellRefs,
    extractDatasetRefs,
    type FormulaEvalContext,
} from "./ReportFormulaEngine";
export {renderReportHtml, renderReportPrintHtml} from "./renderers/ReportHtmlRenderer";
export type * from "./types";
