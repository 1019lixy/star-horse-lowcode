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
    pattern: /^1[3-9]\d{9}$/,
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
  { message: i18n("api.digitsOnly"), value: "digit", pattern: /^[0-9]+$/ },
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
  { message: i18n("api.lettersOnly"), value: "letter", pattern: /^[a-zA-Z]+$/ },
  {
    message: i18n("api.lettersOrDigitsOnly"),
    value: "letterDigit",
    pattern: /^[a-zA-Z0-9]+$/,
  },
  {
    message: i18n("api.lengthRange"),
    value: "dataLength",
    pattern: (min: number, max: number) => new RegExp(`^.{${min},${max}}$`),
  },
  {
    message: i18n("api.lettersDigitsUnderscoreOnly"),
    value: "letterDigitUnderline",
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  {
    message: i18n("api.lettersDigitsUnderscoreHyphenOnly"),
    value: "letterDigitUnderlineHyphen",
    pattern: /^[a-zA-Z0-9_-]+$/,
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
    pattern: /^[\u4e00-\u9fa5·]{2,20}$/,
  },
  {
    message: i18n("api.creditCardFormatIncorrect"),
    value: "creditCard",
    pattern: /^[1-9]\d{14,18}$/,
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
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
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
    pattern: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
  },
  {
    message: i18n("api.internationalPhoneFormatIncorrect"),
    value: "internationalPhone",
    pattern: /^\+(?:[0-9] ?){6,14}[0-9]$/,
  },
  // ===== 新增常见业务正则 =====
  {
    message: i18n("api.ipv6FormatIncorrect"),
    value: "ipv6",
    pattern:
      /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:):([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4})$/,
  },
  {
    message: i18n("api.macFormatIncorrect"),
    value: "mac",
    pattern: /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/,
  },
  {
    message: i18n("api.chineseOnly"),
    value: "chinese",
    pattern: /^[\u4e00-\u9fa5]+$/,
  },
  {
    message: i18n("api.numberRange"),
    value: "numberRange",
    pattern: (min: number, max: number) => {
      const regex = new RegExp("^-?\\d+(\\.\\d+)?$");
      return {
        test: (val: string) => {
          if (!regex.test(val)) return false;
          const num = Number(val);
          return num >= min && num <= max;
        },
      };
    },
  },
  {
    message: i18n("api.decimalFormat"),
    value: "decimal",
    pattern: (intLen: number = 10, decLen: number = 2) =>
      new RegExp(`^-?\\d{1,${intLen}}(\\.\\d{1,${decLen}})?$`),
  },
  {
    message: i18n("api.positiveInteger"),
    value: "positiveInteger",
    pattern: /^[1-9]\d*$/,
  },
  {
    message: i18n("api.negativeInteger"),
    value: "negativeInteger",
    pattern: /^-[1-9]\d*$/,
  },
  {
    message: i18n("api.nonNegativeInteger"),
    value: "nonNegativeInteger",
    pattern: /^(0|[1-9]\d*)$/,
  },
  {
    message: i18n("api.positiveNumber"),
    value: "positiveNumber",
    pattern: /^(0?[1-9]\d*(\.\d+)?|0\.\d*[1-9])$/,
  },
  {
    message: i18n("api.passwordFormat"),
    value: "mediumPassword",
    pattern: /^(?=.*\d)(?=.*[a-zA-Z])[A-Za-z\d@$!%*?&_-]{6,20}$/,
  },
  {
    message: i18n("api.timeFormat"),
    value: "timeFormat",
    pattern: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
  },
  {
    message: i18n("api.datetimeFormat"),
    value: "datetimeFormat",
    pattern:
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
  },
  {
    message: i18n("api.portFormat"),
    value: "port",
    pattern:
      /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  },
  {
    message: i18n("api.taxNumberFormat"),
    value: "taxNumber",
    pattern: /^[A-Z0-9]{15,20}$/,
  },
  {
    message: i18n("api.socialCreditCodeFormat"),
    value: "socialCreditCode",
    pattern: /^[0-9A-HJ-NP-RT-UW-Y]{2}\d{6}[0-9A-HJ-NP-RT-UW-Y]{10}$/,
  },
  {
    message: i18n("api.bankCardFormat"),
    value: "bankCard",
    pattern: /^[1-9]\d{9,29}$/,
  },
  {
    message: i18n("api.coordinateFormat"),
    value: "coordinate",
    pattern:
      /^-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*-?(90(\.0+)?|([1-8]?\d)(\.\d+)?)$/,
  },
  {
    message: i18n("api.semverFormat"),
    value: "semver",
    pattern:
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?(?:\+[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?$/,
  },
  {
    message: i18n("api.jsonFormat"),
    value: "jsonFormat",
    pattern: /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/,
  },
  {
    message: i18n("api.base64Format"),
    value: "base64",
    pattern: /^[A-Za-z0-9+/]+(={0,2})$/,
  },
  {
    message: i18n("api.uuidFormat"),
    value: "uuid",
    pattern:
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  },
  {
    message: i18n("api.chinesePhoneFormat"),
    value: "chinesePhone",
    pattern: /(^\d{3,4}-\d{7,8}$)|(^1[3-9]\d{9}$)/,
  },
];

export const validRulesList: Array<SelectOption> = [
  { name: i18n("api.email"), value: "email" },
  { name: i18n("api.phone"), value: "phone" },
  { name: i18n("api.landlinePhone"), value: "landlinePhone" },
  { name: i18n("api.chinesePhone"), value: "chinesePhone" },
  { name: i18n("api.idCard"), value: "idCard" },
  { name: i18n("api.digit"), value: "digit" },
  { name: i18n("api.positiveInteger"), value: "positiveInteger" },
  { name: i18n("api.nonNegativeInteger"), value: "nonNegativeInteger" },
  { name: i18n("api.positiveNumber"), value: "positiveNumber" },
  { name: i18n("api.decimal"), value: "decimal" },
  { name: i18n("api.numberRange"), value: "numberRange" },
  { name: i18n("api.letter"), value: "letter" },
  { name: i18n("api.ip"), value: "ip" },
  { name: i18n("api.ipv6"), value: "ipv6" },
  { name: i18n("api.mac"), value: "mac" },
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
  { name: i18n("api.mediumPasswordRule"), value: "mediumPassword" },
  { name: i18n("api.dateFormatRule"), value: "dateFormat" },
  { name: i18n("api.timeFormatRule"), value: "timeFormat" },
  { name: i18n("api.datetimeFormatRule"), value: "datetimeFormat" },
  { name: i18n("api.postalCode"), value: "postalCode" },
  { name: i18n("api.chineseName"), value: "chineseName" },
  { name: i18n("api.chineseOnly"), value: "chinese" },
  { name: i18n("api.creditCard"), value: "creditCard" },
  { name: i18n("api.bankCard"), value: "bankCard" },
  { name: i18n("api.wechatId"), value: "wechatId" },
  { name: i18n("api.licensePlate"), value: "licensePlate" },
  { name: i18n("api.hkMacaoPass"), value: "hkMacaoPass" },
  { name: i18n("api.taiwanPass"), value: "taiwanPass" },
  { name: i18n("api.internationalPhone"), value: "internationalPhone" },
  { name: i18n("api.hexColor"), value: "hexColor" },
  { name: i18n("api.port"), value: "port" },
  { name: i18n("api.taxNumber"), value: "taxNumber" },
  { name: i18n("api.socialCreditCode"), value: "socialCreditCode" },
  { name: i18n("api.coordinate"), value: "coordinate" },
  { name: i18n("api.semver"), value: "semver" },
  { name: i18n("api.jsonFormat"), value: "jsonFormat" },
  { name: i18n("api.base64"), value: "base64" },
  { name: i18n("api.uuid"), value: "uuid" },
  { name: i18n("api.custom"), value: "custom" },
];

/**
 * 获取验证类型
 * @param type 验证类型名称
 * @param options 参数选项（dataLength: {min, max}, decimal: {intLen, decLen}, numberRange: {min, max}）
 */
export function getValidType(type: any, options?: any) {
  const typeConfig = validTypes.find((item: any) => item.value === type);
  if (!typeConfig) return {};
  // 处理带参数的验证类型
  if (typeof typeConfig.pattern === "function") {
    if (type === "dataLength") {
      return {
        message: typeConfig.message(options?.min ?? 2, options?.max ?? 6),
        pattern: typeConfig.pattern(options?.min ?? 2, options?.max ?? 6),
      };
    }
    if (type === "decimal") {
      return {
        message: typeConfig.message,
        pattern: typeConfig.pattern(
          options?.intLen ?? 10,
          options?.decLen ?? 2,
        ),
      };
    }
    if (type === "numberRange") {
      const min = options?.min ?? 0;
      const max = options?.max ?? 100;
      return {
        message: typeConfig.message,
        pattern: typeConfig.pattern(min, max),
      };
    }
    // 通用函数型 pattern 回退
    return {
      message: typeConfig.message,
      pattern: typeConfig.pattern(options),
    };
  }
  return typeConfig;
}
