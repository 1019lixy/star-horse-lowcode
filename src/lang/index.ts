import zh_CN from "@/lang/zh_CN";
import en_US from "@/lang/en_US";
import zh_TW from "@/lang/zh_TW";
import ja_JP from "@/lang/ja_JP";
import de_DE from "@/lang/de_DE";
import {LangType} from "@/theme/theme";
import {getLang} from "@/theme/localStorge";

const language: Record<LangType, Record<string, string | Function>> = {
    [LangType.ZH_CN]: zh_CN,
    [LangType.EN_US]: en_US,
    [LangType.ZH_TW]: zh_TW,
    [LangType.JA_JP]: ja_JP,
    [LangType.DE_DE]: de_DE,
};
export const currentLang: LangType =
    window.__starHorseHostLang__ || getLang() || LangType.ZH_CN;
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
    if (result === undefined) {
        return `[${key}]`;
    } else {
        // 处理函数类型的翻译项
        if (typeof result === 'function') {
            // 如果提供了参数，执行函数并返回结果
            if (args.length > 0) {
                return result(...args);
            }
            // 如果没有提供参数，返回函数本身
            return result;
        }
        
        // 处理普通字符串类型的翻译项
        const resultList: Array<string> = [result];
        args.forEach((arg: any) => {
            const temp = langSet[arg];
            if (temp) {
                resultList.push(temp);
            }
        });
        return resultList.join("en_US" === LangType.EN_US ? " " : "");
    }
}
