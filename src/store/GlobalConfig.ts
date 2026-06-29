import { defineStore } from "pinia";
import { Config } from "@/api/settings";
import { ref } from "vue";
import JSON5 from "json5";

/**
 * 主题色对应的 CSS 变量映射表
 * 集中管理，便于维护和扩展
 */
const THEME_CSS_VARS = [
  "--star-horse-style",
  "--el-color-primary",
  "--el-select-input-color",
  "--el-pagination-button-color",
  "--el-tree-expand-icon-color",
  "--fc-button-bg-color",
  "--fc-button-border-color",
  "--fc-button-active-bg-color",
  "--fc-button-active-border-color",
  "--fc-button-hover-bg-color",
  "--fc-button-hover-border-color",
] as const;

// 主题色更新帧句柄，用于合并多次调用
let themeUpdateFrame: number | null = null;
let pendingThemeColor: string | null = null;

/**
 * 使用 requestAnimationFrame 合并主题色更新，避免连续调用引发多次样式重计算
 * @param color 主题色
 */
const scheduleThemeUpdate = (color: string) => {
  pendingThemeColor = color;
  if (themeUpdateFrame !== null) return;
  themeUpdateFrame = requestAnimationFrame(() => {
    const root = document.documentElement;
    const targetColor = pendingThemeColor!;
    // 批量写入 CSS 变量，浏览器会合并为一次样式重计算
    for (const varName of THEME_CSS_VARS) {
      root.style.setProperty(varName, targetColor);
    }
    themeUpdateFrame = null;
    pendingThemeColor = null;
  });
};

export const useGlobalConfigStore = defineStore(
  "globalConfig",
  () => {
    const configFormInfo = ref<any>({});
    /**
     *设置数据
     * @param data
     */
    const setConfigFormInfo = (data: any) => {
      configFormInfo.value = data;
      localStorage.setItem("starHorseConfigInfo", JSON5.stringify(data));
      Config.buttonStyle.value = data.buttonShowType || "dropdown";
      if (data.themeColor) {
        scheduleThemeUpdate(data.themeColor);
      }
    };
    /**
     * 清除所有Tab
     */
    const clearAll = (isDark: string = "N") => {
      configFormInfo.value = {
        tagsView: "Y",
        position: "left",
        menusCfg: "tradition",
        isDark,
      };
      const starHorseConfigInfo = localStorage.getItem("starHorseConfigInfo");
      if (starHorseConfigInfo) {
        setConfigFormInfo(JSON5.parse(starHorseConfigInfo));
      }
    };

    return {
      configFormInfo,
      setConfigFormInfo,
      clearAll,
    };
  },
  {
    persist: false,
  },
);
