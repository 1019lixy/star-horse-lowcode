/**
 * PDF 模板与签章类型定义
 */

/** PDF 元素类型 */
export type PdfElementType =
  | "text"
  | "heading"
  | "paragraph"
  | "image"
  | "table"
  | "divider"
  | "pageBreak"
  | "barcode"
  | "qrcode"
  | "signature"
  | "checkbox"
  | "date";

/** 对齐方式 */
export type PdfAlignment = "left" | "center" | "right";

/** 字体 */
export interface PdfFont {
  family: string;
  size: number;
  weight?: "normal" | "bold";
  style?: "normal" | "italic";
  color?: string;
}

/** PDF 元素基础 */
export interface PdfElementBase {
  id: string;
  type: PdfElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
}

/** 文本元素 */
export interface PdfTextElement extends PdfElementBase {
  type: "text" | "heading" | "paragraph" | "date";
  text: string;
  font: PdfFont;
  align: PdfAlignment;
  /** 是否绑定数据字段 */
  dataField?: string;
}

/** 图片元素 */
export interface PdfImageElement extends PdfElementBase {
  type: "image" | "signature";
  src?: string;
  dataField?: string;
  fit: "contain" | "cover" | "fill";
}

/** 表格元素 */
export interface PdfTableElement extends PdfElementBase {
  type: "table";
  columns: {
    field: string;
    label: string;
    width: number;
    align: PdfAlignment;
  }[];
  /** 数据源字段 */
  dataSource?: string;
  headerBgColor?: string;
  borderColor?: string;
}

/** 分割线 */
export interface PdfDividerElement extends PdfElementBase {
  type: "divider";
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted";
}

/** 分页符 */
export interface PdfPageBreakElement extends PdfElementBase {
  type: "pageBreak";
}

/** 条码 */
export interface PdfBarcodeElement extends PdfElementBase {
  type: "barcode" | "qrcode";
  dataField?: string;
  value?: string;
  format?: "CODE128" | "EAN13" | "QR";
}

/** 复选框 */
export interface PdfCheckboxElement extends PdfElementBase {
  type: "checkbox";
  label?: string;
  dataField?: string;
  checked?: boolean;
}

/** PDF 元素联合类型 */
export type PdfElement =
  | PdfTextElement
  | PdfImageElement
  | PdfTableElement
  | PdfDividerElement
  | PdfPageBreakElement
  | PdfBarcodeElement
  | PdfCheckboxElement;

/** PDF 页面 */
export interface PdfPage {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  background?: string;
  /** 页眉 */
  header?: {
    text: string;
    align: PdfAlignment;
    font?: PdfFont;
  };
  /** 页脚 */
  footer?: {
    text: string;
    align: PdfAlignment;
    font?: PdfFont;
    showPageNumber?: boolean;
  };
}

/** PDF 模板 */
export interface PdfTemplate {
  name: string;
  page: PdfPage;
  elements: PdfElement[];
}

/** 签名信息 */
export interface PdfSignatureInfo {
  id: string;
  /** 签名人 */
  signer: string;
  /** 签名图片 dataURL */
  imageDataUrl?: string;
  /** 签名时间 */
  signedAt?: string;
  /** 位置 X */
  x: number;
  /** 位置 Y */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 页码 */
  page: number;
  /** 证书信息 */
  certificate?: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    serialNumber: string;
  };
}

/** 签章配置 */
export interface PdfSignConfig {
  /** 原始模板/文档URL */
  sourceUrl?: string;
  /** 已有签名列表 */
  signatures: PdfSignatureInfo[];
  /** 是否启用数字证书 */
  enableCertificate: boolean;
  /** 签名颜色 */
  penColor: string;
  /** 签名笔宽 */
  penWidth: number;
}

/** 元素类型预设 */
export interface PdfElementTypePreset {
  type: PdfElementType;
  label: string;
  icon: string;
}
