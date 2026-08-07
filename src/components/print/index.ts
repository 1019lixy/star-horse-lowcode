/**
 * 打印模板设计器 - 模块导出
 *
 * 单一职责：仅做导出聚合，不包含业务逻辑
 */

export {default as PrintTemplateDesigner} from "./PrintTemplateDesigner.vue";
export {default as PrintToolbar} from "./panels/PrintToolbar.vue";
export {default as PrintElementPanel} from "./panels/PrintElementPanel.vue";
export {default as PrintCanvas} from "./panels/PrintCanvas.vue";
export {default as PrintPropertyPanel} from "./panels/PrintPropertyPanel.vue";
export {default as PrintLayerPanel} from "./panels/PrintLayerPanel.vue";
export {default as PrintPreviewDialog} from "./dialogs/PrintPreviewDialog.vue";
export {default as PrintDataSourceDialog} from "./dialogs/PrintDataSourceDialog.vue";
export {default as PrintTemplateManagerDialog} from "./dialogs/PrintTemplateManagerDialog.vue";
export {usePrintDesigner} from "./composables/usePrintDesigner";
export {renderPrintHtml, renderPageHtml} from "./renderers/HtmlRenderer";
export {renderZpl} from "./renderers/ZplRenderer";
export {renderTspl} from "./renderers/TsplRenderer";
export {
    PRESET_PAPERS,
    DEFAULT_PAPER,
    DEFAULT_DATA_FIELDS,
    ELEMENT_FACTORIES,
    SYSTEM_VAR_OPTIONS,
    BARCODE_SYMBOLOGY_OPTIONS,
    FONT_SIZE_PRESETS,
    COLOR_PRESETS,
    MM_TO_PX,
    PX_TO_MM,
    MM_TO_PT,
    PT_TO_MM,
} from "./constants";
export type * from "./types";
