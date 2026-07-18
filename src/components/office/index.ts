/**
 * Office 文档编辑模块导出
 */
export { default as OfficeEditor } from "./OfficeEditor.vue";
export { default as OfficeToolbar } from "./panels/OfficeToolbar.vue";
export { default as OfficeDocumentList } from "./panels/OfficeDocumentList.vue";
export { default as WordEditor } from "./panels/WordEditor.vue";
export { default as ExcelEditor } from "./panels/ExcelEditor.vue";
export { default as SlideEditor } from "./panels/SlideEditor.vue";
export { default as OfficeExportDialog } from "./dialogs/OfficeExportDialog.vue";
export { useOfficeDesigner } from "./composables/useOfficeDesigner";
export { useOfficeHistory } from "./composables/useOfficeHistory";
// 注意：parseRange 与 report 模块重名，
// 不通过 barrel 导出，外部如需使用请从 utils/OfficeFormulaUtils 直接导入
export {
    evaluateFormula,
    recalcSheet,
    parseCellRef,
    isFormula,
    cellNumericValue,
    buildCellMap,
} from "./utils/OfficeFormulaUtils";
export * from "./types";
export * from "./constants";
