import zh_CN from "@/lang/zh_CN";
import en_US from "@/lang/en_US";
import {LangType} from "@/theme/theme";
import {getLang} from "@/theme/localStorge";

const language = {
    zh_cn: zh_CN,
    en_us: en_US,
};
export const currentLang: LangType = window.__starHorseHostLang__ || getLang() || LangType.ZH_CN;
export const isEn = currentLang === LangType.EN_US;
export const isZH = currentLang === LangType.ZH_CN;
let langSet: Record<string, any> = language[currentLang];

/**
 *
 * @param key
 * @param args
 */
export function i18n(key: keyof typeof zh_CN, ...args: any[]) {
    const result = langSet[key];
    const resultList: Array<string> = [];
    if (result === undefined) {
        return `[${key}]`;
    } else {
        resultList.push(result);
        args.forEach((arg: any) => {
            const temp = langSet[arg];
            if (temp) {
                resultList.push(temp);
            }
        });
        return resultList.join("en_us" === LangType.EN_US ? " " : "");
    }
}
