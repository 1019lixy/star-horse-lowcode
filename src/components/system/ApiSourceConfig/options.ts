/**
 * 第三方接口配置组件 —— 选项集
 * 复用 apiconfig/options 的枚举，精简掉 isolation 相关。
 */
import { i18n } from "@/lang";
import { dataType, httpMethod, searchMatchList } from "@/api/star_horse_utils";
import type { SelectOption } from "@/components/types/SearchProps";

/** 参数取值方式（精简：去掉 isolation） */
export const sourceValueTypeList: SelectOption[] = [
  { name: i18n("apiConfig.valueType.static"), value: "static" },
  { name: i18n("apiConfig.valueType.dynamic"), value: "dynamic" },
];

/** 返回模板 */
export const responseTemplateList: SelectOption[] = [
  { name: i18n("apiConfig.responseTemplate.string"), value: "string" },
  { name: i18n("apiConfig.responseTemplate.number"), value: "number" },
  { name: i18n("apiConfig.responseTemplate.result_data"), value: "result_data" },
  { name: i18n("apiConfig.responseTemplate.result_data_list"), value: "result_data_list" },
  { name: i18n("apiConfig.responseTemplate.result_data_map"), value: "result_data_map" },
  { name: i18n("apiConfig.responseTemplate.map"), value: "map" },
  { name: i18n("apiConfig.responseTemplate.list"), value: "list" },
];

/** 提取字段类型转换 */
export const typeConvertList: SelectOption[] = [
  { name: i18n("apiConfig.convert.string"), value: "string" },
  { name: i18n("apiConfig.convert.number"), value: "number" },
  { name: i18n("apiConfig.convert.boolean"), value: "boolean" },
  { name: i18n("apiConfig.convert.array"), value: "array" },
];

/** 接口类型 */
export const apiTypeList: SelectOption[] = [
  { name: i18n("apiConfig.apiType.systemApi"), value: "systemApi" },
  { name: i18n("apiConfig.apiType.thirdApi"), value: "thirdApi" },
];

/** 转发 star_horse_utils 枚举 */
export { dataType, httpMethod, searchMatchList };