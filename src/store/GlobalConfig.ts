import { defineStore } from "pinia";
import { Config } from "@/api/settings";
import { ref } from "vue";

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
      localStorage.setItem("starHorseConfigInfo", JSON.stringify(data));
      Config.buttonStyle.value = data.buttonShowType || "dropdown";
      if (data.themeColor) {
        document.documentElement.style.setProperty(
          "--star-horse-style",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--el-color-primary",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--el-select-input-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--el-pagination-button-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--el-tree-expand-icon-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-bg-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-border-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-active-bg-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-active-border-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-hover-bg-color",
          data.themeColor,
        );
        document.documentElement.style.setProperty(
          "--fc-button-hover-border-color",
          data.themeColor,
        );
        // document.documentElement.style.setProperty('--fc-button-text-color', "#000");
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
        setConfigFormInfo(JSON.parse(starHorseConfigInfo));
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
