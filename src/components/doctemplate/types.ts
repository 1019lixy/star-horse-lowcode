/**
 * 文档模板类型定义
 */

/** 变量类型 */
export type DocVariableType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "richtext"
  | "image"
  | "table";

/** 文档变量 */
export interface DocVariable {
  id: string;
  /** 变量名 */
  name: string;
  /** 显示标签 */
  label: string;
  /** 类型 */
  type: DocVariableType;
  /** 默认值 */
  defaultValue?: any;
  /** 选项（仅 select） */
  options?: { label: string; value: any }[];
  /** 是否必填 */
  required?: boolean;
  /** 描述 */
  description?: string;
}

/** 文档模板 */
export interface DocTemplate {
  id: string;
  name: string;
  /** 富文本内容（含变量占位符 ${varName}） */
  content: string;
  /** 变量列表 */
  variables: DocVariable[];
  /** 分类 */
  category?: string;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

/** 模板分类预设 */
export interface DocTemplateCategoryPreset {
  value: string;
  label: string;
  /** 分类对应的预设模板骨架内容 */
  template?: string;
}
