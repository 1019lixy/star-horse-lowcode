/**
 * 邮件模板类型定义
 */

/** 变量类型 */
export type EmailVariableType =
  "string" | "number" | "date" | "boolean" | "select";

/** 邮件变量 */
export interface EmailVariable {
  id: string;
  name: string;
  label: string;
  type?: EmailVariableType;
  defaultValue?: string;
  description?: string;
}

/** 邮件附件 */
export interface EmailAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
}

/** 邮件模板 */
export interface EmailTemplate {
  id: string;
  name: string;
  /** 主题（支持变量） */
  subject: string;
  /** 发件人名称 */
  fromName?: string;
  /** 抄送 */
  cc?: string;
  /** 密送 */
  bcc?: string;
  /** HTML 内容 */
  content: string;
  /** 纯文本备用 */
  textContent?: string;
  /** 变量 */
  variables: EmailVariable[];
  /** 附件 */
  attachments: EmailAttachment[];
  /** 分类 */
  category?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** 邮件分类预设 */
export interface EmailCategoryPreset {
  value: string;
  label: string;
}
