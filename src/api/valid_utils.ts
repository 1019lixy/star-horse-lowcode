import { SelectOption } from "@/components/types/SearchProps";
import { i18n } from "@/lang";

const validTypes: any = [
  {
    message: i18n("api.emailFormatIncorrect"),
    value: "email",
    pattern:
      /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
  },
  {
    message: i18n("api.phoneFormatIncorrect"),
    value: "phone",
    pattern: /^1[3456789]\d{9}$/,
  },
  {
    message: i18n("api.landlinePhoneFormatIncorrect"),
    value: "landlinePhone",
    pattern: /^(0\d{2,3})-?\d{7,8}$/,
  },
  {
    message: i18n("api.idCardInvalid"),
    value: "idCard",
    pattern:
      /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  },
  { message: i18n("api.digitsOnly"), value: "digit", pattern: /^[0-9]*$/ },
  {
    message: i18n("api.ipFormatIncorrect"),
    value: "ip",
    pattern:
      /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
  },
  {
    message: i18n("api.urlFormatIncorrect"),
    value: "url",
    pattern:
      /^((https?|ftp|file|git|svn):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
  {
    message: i18n("api.domainFormatIncorrect"),
    value: "domain",
    pattern:
      /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/,
  },
  { message: i18n("api.lettersOnly"), value: "letter", pattern: /^[a-zA-Z]*$/ },
  {
    message: i18n("api.lettersOrDigitsOnly"),
    value: "letterDigit",
    pattern: /^[a-zA-Z0-9]*$/,
  },
  {
    message: i18n("api.lengthRange"),
    value: "dataLength",
    pattern: (min: number, max: number) => new RegExp(`^.{${min},${max}}$`),
  },
  {
    message: i18n("api.lettersDigitsUnderscoreOnly"),
    value: "letterDigitUnderline",
    pattern: /^[a-zA-Z0-9_]*$/,
  },
  {
    message: i18n("api.lettersDigitsUnderscoreHyphenOnly"),
    value: "letterDigitUnderlineHyphen",
    pattern: /^[a-zA-Z0-9_\-]*$/,
  },
  {
    message: i18n("api.strongPassword"),
    value: "strongPassword",
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  },
  {
    message: i18n("api.dateFormat"),
    value: "dateFormat",
    pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
  },
  {
    message: i18n("api.postalCodeFormatIncorrect"),
    value: "postalCode",
    pattern: /^[1-9]\d{5}$/,
  },
  {
    message: i18n("api.chineseNameFormat"),
    value: "chineseName",
    pattern: /^[\u4e00-\u9fa5]{2,6}$/,
  },
  {
    message: i18n("api.creditCardFormatIncorrect"),
    value: "creditCard",
    pattern: /^4\d{15}$/,
  },
  {
    message: i18n("api.wechatIdFormatIncorrect"),
    value: "wechatId",
    pattern: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,
  },
  {
    message: i18n("api.licensePlateFormatIncorrect"),
    value: "licensePlate",
    pattern:
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{5}$/,
  },
  {
    message: i18n("api.hkMacaoPassFormatIncorrect"),
    value: "hkMacaoPass",
    pattern: /^[CW]\d{8}$/,
  },
  {
    message: i18n("api.taiwanPassFormatIncorrect"),
    value: "taiwanPass",
    pattern: /^([A-Z]\d{9}|\d{8})$/,
  },
  {
    message: i18n("api.hexColorFormatIncorrect"),
    value: "hexColor",
    pattern: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,
  },
  {
    message: i18n("api.internationalPhoneFormatIncorrect"),
    value: "internationalPhone",
    pattern: /^\+(?:[0-9] ?){6,14}[0-9]$/,
  },
];

export const validRulesList: Array<SelectOption> = [
  { name: i18n("api.email"), value: "email" },
  { name: i18n("api.phone"), value: "phone" },
  { name: i18n("api.landlinePhone"), value: "landlinePhone" },
  { name: i18n("api.idCard"), value: "idCard" },
  { name: i18n("api.digit"), value: "digit" },
  { name: i18n("api.letter"), value: "letter" },
  { name: i18n("api.ip"), value: "ip" },
  { name: i18n("api.url"), value: "url" },
  { name: i18n("api.domain"), value: "domain" },
  { name: i18n("api.letterDigit"), value: "letterDigit" },
  { name: i18n("api.letterDigitUnderline"), value: "letterDigitUnderline" },
  {
    name: i18n("api.letterDigitUnderlineHyphen"),
    value: "letterDigitUnderlineHyphen",
  },
  { name: i18n("api.dataLength"), value: "dataLength" },
  { name: i18n("api.strongPasswordRule"), value: "strongPassword" },
  { name: i18n("api.dateFormatRule"), value: "dateFormat" },
  { name: i18n("api.postalCode"), value: "postalCode" },
  { name: i18n("api.chineseName"), value: "chineseName" },
  { name: i18n("api.creditCard"), value: "creditCard" },
  { name: i18n("api.wechatId"), value: "wechatId" },
  { name: i18n("api.licensePlate"), value: "licensePlate" },
  { name: i18n("api.hkMacaoPass"), value: "hkMacaoPass" },
  { name: i18n("api.taiwanPass"), value: "taiwanPass" },
  { name: i18n("api.internationalPhone"), value: "internationalPhone" },
  { name: i18n("api.hexColor"), value: "hexColor" },
  { name: i18n("api.custom"), value: "custom" },
];

/**
 * 获取验证类型
 * @param type
 */
export function getValidType(type: any, options?: any) {
  const typeConfig = validTypes.find((item: any) => item.value === type);
  if (!typeConfig) return {};
  // 处理带参数的验证类型
  if (type === "dataLength") {
    return {
      message: typeConfig.message(options?.min ?? 2, options?.max ?? 6),
      pattern: typeConfig.pattern(options?.min ?? 2, options?.max ?? 6),
    };
  }
  return typeConfig;
}
