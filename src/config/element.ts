import { App } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

// Element Plus 配置函数
export const configureElementPlus = (app: App<Element>, options?: any) => {
  // 只在没有配置时才设置中文
  if (!options?.locale) {
    app.use(ElementPlus, {
      locale: zhCn,
    });
  } else {
    app.use(ElementPlus, options);
  }
};
