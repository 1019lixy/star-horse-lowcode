/**
 * Office 模块预设常量、工厂函数与示例数据
 */
import { i18n } from "@/lang";
import type {
  ExcelCell,
  ExcelSheet,
  OfficeDocType,
  OfficeDocTypePreset,
  OfficeDocument,
  OfficeFontPreset,
  OfficeFontSizePreset,
  OfficeShapePreset,
  OfficeTextAlignPreset,
  Slide,
  SlideElement,
  WordContent,
} from "./types";

/** 文档类型预设 */
export const OFFICE_DOC_TYPE_PRESETS: OfficeDocTypePreset[] = [
  {
    type: "word",
    label: i18n("office.docType.word"),
    icon: "Document",
    color: "#409EFF",
  },
  {
    type: "excel",
    label: i18n("office.docType.excel"),
    icon: "Grid",
    color: "#67C23A",
  },
  {
    type: "slide",
    label: i18n("office.docType.slide"),
    icon: "Film",
    color: "#E6A23C",
  },
];

/** 字体预设 */
export const OFFICE_FONT_FAMILY_PRESETS: OfficeFontPreset[] = [
  { value: "SimSun", label: "宋体" },
  { value: "KaiTi", label: "楷体" },
  { value: "SimHei", label: "黑体" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
];

/** 字号预设 */
export const OFFICE_FONT_SIZE_PRESETS: OfficeFontSizePreset[] = [
  { value: 12, label: "12" },
  { value: 14, label: "14" },
  { value: 16, label: "16" },
  { value: 18, label: "18" },
  { value: 20, label: "20" },
  { value: 24, label: "24" },
  { value: 28, label: "28" },
  { value: 32, label: "32" },
  { value: 36, label: "36" },
  { value: 48, label: "48" },
];

/** 文本对齐预设 */
export const OFFICE_TEXT_ALIGN_PRESETS: OfficeTextAlignPreset[] = [
  { value: "left", label: i18n("office.word.alignLeft"), icon: "DCaret" },
  {
    value: "center",
    label: i18n("office.word.alignCenter"),
    icon: "Operation",
  },
  { value: "right", label: i18n("office.word.alignRight"), icon: "DCaret" },
  {
    value: "justify",
    label: i18n("office.word.alignJustify"),
    icon: "Operation",
  },
];

/** 形状预设 */
export const OFFICE_SHAPE_TYPE_PRESETS: OfficeShapePreset[] = [
  { type: "rect", label: i18n("office.slide.shape.rect"), icon: "FullScreen" },
  { type: "circle", label: i18n("office.slide.shape.circle"), icon: "Sunny" },
  {
    type: "triangle",
    label: i18n("office.slide.shape.triangle"),
    icon: "CaretTop",
  },
  { type: "arrow", label: i18n("office.slide.shape.arrow"), icon: "Right" },
];

/** 幻灯片默认画布宽度（16:9） */
export const OFFICE_SLIDE_CANVAS_WIDTH = 960;
/** 幻灯片默认画布高度（16:9） */
export const OFFICE_SLIDE_CANVAS_HEIGHT = 540;
/** Excel 默认列宽 */
export const OFFICE_EXCEL_COL_WIDTH = 100;
/** Excel 默认行高 */
export const OFFICE_EXCEL_ROW_HEIGHT = 32;
/** Excel 最大行列 */
export const OFFICE_EXCEL_MAX_ROWS = 100;
export const OFFICE_EXCEL_MAX_COLS = 26;

/** 根据文档类型查找预设 */
export const findOfficeDocPreset = (
  type: OfficeDocType,
): OfficeDocTypePreset | undefined =>
  OFFICE_DOC_TYPE_PRESETS.find((p) => p.type === type);

/** 生成唯一 ID */
export const genOfficeId = (prefix = "office"): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 创建 Excel 单元格 */
export const createExcelCell = (
  row: number,
  col: number,
  value = "",
): ExcelCell => ({
  row,
  col,
  value,
});

/** 创建 Excel 工作表 */
export const createExcelSheet = (
  rows = 5,
  cols = 5,
  name = "Sheet1",
): ExcelSheet => ({
  id: genOfficeId("sheet"),
  name,
  rows,
  cols,
  cells: [],
});

/** 创建幻灯片元素 */
export const createSlideElement = (
  type: SlideElement["type"],
  overrides: Partial<SlideElement> = {},
): SlideElement => ({
  id: genOfficeId("elem"),
  type,
  x: overrides.x ?? 100,
  y: overrides.y ?? 100,
  width: overrides.width ?? 200,
  height: overrides.height ?? 60,
  text: overrides.text ?? "",
  fontSize: overrides.fontSize ?? 18,
  color: overrides.color ?? "#333333",
  shape: overrides.shape ?? "rect",
  fill: overrides.fill ?? "#409EFF",
  src: overrides.src ?? "",
  rotate: overrides.rotate ?? 0,
});

/** 创建幻灯片 */
export const createSlide = (elements: SlideElement[] = []): Slide => ({
  id: genOfficeId("slide"),
  elements,
  bg: "#FFFFFF",
});

/** 创建 Word 内容 */
export const createWordContent = (html = ""): WordContent => ({ html });

/** 列索引转字母（0 -> A, 1 -> B, ..., 26 -> AA） */
export const officeColIndexToLetter = (col: number): string => {
  let result = "";
  let n = col;
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
};

/** 字母转列索引（A -> 0, B -> 1, ..., AA -> 26） */
export const officeColLetterToIndex = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
};

/** 创建 Office 文档 */
export const createOfficeDoc = (
  overrides: Partial<OfficeDocument> = {},
): OfficeDocument => {
  const now = new Date().toISOString();
  const type = overrides.type ?? "word";
  const doc: OfficeDocument = {
    id: overrides.id ?? genOfficeId("doc"),
    name: overrides.name ?? i18n("office.docList.create"),
    type,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
  // 根据类型初始化对应内容（不覆盖外部传入的内容）
  if (type === "word")
    doc.wordContent = overrides.wordContent ?? createWordContent("<p><br></p>");
  if (type === "excel") {
    doc.excelContent = overrides.excelContent ?? {
      sheets: [createExcelSheet()],
      activeSheetId: undefined,
    };
    if (
      !doc.excelContent!.activeSheetId &&
      doc.excelContent!.sheets.length > 0
    ) {
      doc.excelContent!.activeSheetId = doc.excelContent!.sheets[0].id;
    }
  }
  if (type === "slide") {
    doc.slideContent = overrides.slideContent ?? {
      slides: [createSlide()],
      canvasWidth: OFFICE_SLIDE_CANVAS_WIDTH,
      canvasHeight: OFFICE_SLIDE_CANVAS_HEIGHT,
    };
  }
  return doc;
};
