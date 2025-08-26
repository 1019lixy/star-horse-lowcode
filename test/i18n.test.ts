import { i18n } from "@/lang";
import { parseDateByType } from "@/api/date_utils";
import { validMsg } from "@/api/form_utils";
import { commonParseCodeToName } from "@/api/star_horse_utils";

// Test i18n functionality
console.log("Testing i18n functionality...");

// Test date_utils
console.log("Testing date_utils...");
console.log(i18n("api.to")); // Should output "至" in Chinese, "to" in English
console.log(i18n("api.weekPrefix")); // Should output "第" in Chinese, "Week " in English

// Test form_utils strings
console.log("Testing form_utils...");
console.log(i18n("api.cannotBeEmpty")); // Should output "不能为空" in Chinese, "cannot be empty" in English
console.log(i18n("api.numberRangeFormat")); // Should output '格式应为"最小值-最大值"（如：2-3）' in Chinese, 'Format should be "min-max" (e.g.: 2-3)' in English

// Test star_horse_utils strings
console.log("Testing star_horse_utils...");
console.log(i18n("api.yes")); // Should output "是" in Chinese, "Yes" in English
console.log(i18n("api.no")); // Should output "否" in Chinese, "No" in English

console.log("i18n tests completed.");
