/**
 * 公共 API 接口配置组件 —— 选项集
 * 复用 star_horse_utils 中的 httpMethod/dataType/searchMatchList，
 * 其余枚举在这里以 apiConfig.* i18n 命名空间自建，
 * 与参考 (ApiSharedConfig) 的 responseTemplateList/valueTypeList/typeConvertList 一一对应。
 */
import { i18n } from "@/lang";
import { dataType, httpMethod, searchMatchList } from "@/api/star_horse_utils";
import type { SelectOption } from "@/components/types/SearchProps";

/** 参数取值方式（对齐参考 valueTypeList） */
export const valueTypeList: SelectOption[] = [
  { name: i18n("apiConfig.valueType.static"), value: "static" },
  { name: i18n("apiConfig.valueType.dynamic"), value: "dynamic" },
  { name: i18n("apiConfig.valueType.isolation"), value: "isolation" },
];

/** 返回模板（对齐参考 responseTemplateList，7 项） */
export const responseTemplateList: SelectOption[] = [
  { name: i18n("apiConfig.responseTemplate.string"), value: "string" },
  { name: i18n("apiConfig.responseTemplate.number"), value: "number" },
  {
    name: i18n("apiConfig.responseTemplate.result_data"),
    value: "result_data",
  },
  {
    name: i18n("apiConfig.responseTemplate.result_data_list"),
    value: "result_data_list",
  },
  {
    name: i18n("apiConfig.responseTemplate.result_data_map"),
    value: "result_data_map",
  },
  { name: i18n("apiConfig.responseTemplate.map"), value: "map" },
  { name: i18n("apiConfig.responseTemplate.list"), value: "list" },
];

/** 提取字段类型转换（对齐参考 typeConvertList） */
export const typeConvertList: SelectOption[] = [
  { name: i18n("apiConfig.convert.string"), value: "string" },
  { name: i18n("apiConfig.convert.number"), value: "number" },
  { name: i18n("apiConfig.convert.boolean"), value: "boolean" },
  { name: i18n("apiConfig.convert.array"), value: "array" },
];

/** 隔离类型（对齐参考） */
export const isolationTypeList: SelectOption[] = [
  { name: "IP", value: "ip" },
  { name: i18n("apiConfig.isolationType.role"), value: "role" },
];

/** 接口类型（对齐参考 apiType radio） */
export const apiTypeList: SelectOption[] = [
  { name: i18n("apiConfig.apiType.systemApi"), value: "systemApi" },
  { name: i18n("apiConfig.apiType.thirdApi"), value: "thirdApi" },
];

/** 响应模式（对齐参考 responseMode radio） */
export const responseModeList: SelectOption[] = [
  { name: i18n("apiConfig.responseMode.options"), value: "options" },
  { name: i18n("apiConfig.responseMode.mapping"), value: "mapping" },
  { name: i18n("apiConfig.responseMode.list"), value: "list" },
];

/** 转发 star_horse_utils 的三个枚举函数，让消费方一次 import 就够 */
export { dataType, httpMethod, searchMatchList };
