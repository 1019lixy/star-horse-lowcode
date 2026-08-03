import zh_CN from "@/lang/zh_CN";
// 仅导入必要的类型和工具函数
import { LangType } from "@/theme/theme";
import { getLang, setLang } from "@/theme/localStorge";
import { SelectOption } from "@/components/types";

export const langList: SelectOption[] = [
  { name: "中文", value: "zh_CN" },
  { name: "English", value: "en_US" },
];
// 当前语言包缓存
let langCache: Record<LangType, Record<string, string | Function>> | any = {};

// 当前语言设置
export let currentLang: LangType =
  window.__starHorseHostLang__ || getLang() || LangType.ZH_CN;

// 当前语言数据
export let langSet: Record<string, any> = {};

// 语言切换回调函数列表
let langChangeCallbacks: Array<() => void> = [];

// 语言包动态导入映射
const langImporters: Record<LangType, () => Promise<any>> = {
  [LangType.ZH_CN]: () => import("@/lang/zh_CN"),
  [LangType.EN_US]: () => import("@/lang/en_US"),
};

// 加载语言包（异步）
export async function loadLanguage(lang: LangType): Promise<boolean> {
  try {
    // 检查是否已缓存
    if (langCache[lang]) {
      langSet = langCache[lang];
      return true;
    }

    // 动态导入语言包
    const module = await langImporters[lang]();
    const langData = module.default || module;

    // 缓存语言包
    langCache[lang] = langData;
    langSet = langData;

    return true;
  } catch (error) {
    console.error(`Failed to load language: ${lang}`, error);

    // 加载失败时回退到中文
    if (lang !== LangType.ZH_CN) {
      await loadLanguage(LangType.ZH_CN);
    }
    return false;
  }
}

// 切换语言
export async function changeLanguage(lang: LangType): Promise<void> {
  if (lang === currentLang && langSet) {
    return; // 语言相同且已加载，无需切换
  }

  // 加载新语言
  const success = await loadLanguage(lang);

  if (success) {
    // 更新当前语言设置
    currentLang = lang;
    setLang(lang);

    // 触发所有回调
    langChangeCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in language change callback:", error);
      }
    });
  }
}

// 注册语言变化监听器
export function onLanguageChange(callback: () => void): () => void {
  langChangeCallbacks.push(callback);

  // 返回取消注册函数
  return () => {
    const index = langChangeCallbacks.indexOf(callback);
    if (index > -1) {
      langChangeCallbacks.splice(index, 1);
    }
  };
}

// 初始化加载当前语言包
(async () => {
  await loadLanguage(currentLang);
})();

// 语言辅助函数
export const isEn = () => currentLang === LangType.EN_US;
export const isZH = () => currentLang === LangType.ZH_CN;

/**
 *
 * @param key
 * @param args
 */
export function i18n(key: keyof typeof zh_CN, ...args: any[]): any;
export function i18n(key: string, ...args: any[]): any;
export function i18n(key: string, ...args: any[]) {
  // 优先从当前语言包获取
  if (Object.keys(langSet || {}).length === 0) {
    langSet = zh_CN;
  }
  const result = langSet[key];
  if (result === undefined) {
    return `[${key}]`;
  } else {
    // 处理函数类型的翻译项
    if (typeof result === "function") {
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
