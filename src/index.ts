// 在文件最顶部添加以下代码
import { App, defineAsyncComponent } from "vue";
import "tailwindcss/index.css";
import "@/assets/css/index.scss";
// import "element-plus/theme-chalk/index.css";
import "@/assets/icons.css";
import piniaInstance from "@/store";
import { AxiosInstance } from "axios";
import type { Router } from "vue-router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { starHorseAxios } from "@/api/star_horse_apis";
import { LangType } from "@/theme/theme";
import draggable from "vuedraggable-es";

export * from "@/api/star_horse_apis";
export * from "@/api/star_horse_utils";
export * from "@/api/WebSocketUtils";
export * from "@/api/date_utils";
export * from "@/api/system";
export * from "@/api/user_func";
export * from "@/utils/message";
export * from "@/api/finger_utils";
export * from "@/api/form_utils";
export * from "@/api/valid_utils";
export * from "@/api/device";

export * from "@/components/formcomp/utils/ItemRelationEventUtils";
export * from "@/components/formcomp/utils/prefixSuffixUtils";
const items = import.meta.glob([
  "@/components/comp/*.vue",
  "@/components/comp/items/*.vue",
  "@/components/system/*.vue",
  "@/components/formcomp/items/*.vue",
  "@/components/*.vue",
]);
// 声明全局变量存储宿主应用的 router
declare global {
  var __hostRouter__: Router | undefined;
  var __hostAxios__: AxiosInstance | undefined;
  var __starHorseHostApp__: App<Element> | undefined;
  var __starHorseHostLang__: LangType | undefined;
}
// 插件安装方法
const install = (
  app: App<Element>,
  options?: {
    router?: Router;
    axiosInstance?: AxiosInstance; //如果外部传入axios实例，就使用外部传入的，否则使用默认的
    elementPlusOptions?: Record<string, any>; // 添加Element Plus配置选项
    lang?: LangType; //国际化语言
    initElementPlus?: boolean; // 是否初始化element-plus
  },
) => {
  // 2. 然后使用star-horse-lowcode导出的piniaInstance来初始化其内部的store
  // 这是关键步骤，确保star-horse-lowcode组件内部的store能正确初始化
  app.use(piniaInstance);
  app.component("draggable", draggable);
  // 注入宿主应用的 router 实例
  if (options?.router) {
    window.__hostRouter__ = options.router;
  }
  // 注入axios实例
  if (options?.axiosInstance) {
    window.__hostAxios__ = options.axiosInstance;
  }
  if (options?.lang) {
    window.__starHorseHostLang__ = options.lang;
  } else {
    window.__starHorseHostLang__ = LangType.ZH_CN;
  }
  if (options?.initElementPlus ?? true) {
    // 只在没有配置时才设置中文
    if (Object.keys(options?.elementPlusOptions || {}).length > 0) {
      app.use(ElementPlus, options.elementPlusOptions);
    } else {
      const locale =
        !options?.lang || options?.lang == LangType.ZH_CN ? zhCn : en;
      app.use(ElementPlus, {
        locale: locale,
      });
    }
  }
  window.__starHorseHostApp__ = app;
  Object.entries(items).forEach(([path, component]) => {
    const name = path
      .split("/")
      .pop() // 获取文件名
      ?.replace(/\.vue$/, ""); // 移除扩展名

    // 跳过StarHorseCodeEditor，它依赖monaco-editor，需要按需加载
    if (name === "StarHorseCodeEditor") return;

    if (name) {
      app.component(name, defineAsyncComponent(component as any));
    }
  });
};
//表单组件增加调用参数source: { type: Number, default: 1 },//调用来源1 表单新增 2 表单编辑 3 查看视图 4 查询 5 列表 6 表单设计 7 页面设计
// 导出所有组件用于按需引入
export * from "@/components/comp";
export * from "@/components/formcomp/items";
export * from "@/components/system";
export * from "@/components/types";
// export * from "@/components/print";
// export * from "@/components/report";
// export * from "@/components/diagram";
export * from "@/components/gantt";
export * from "@/components/kanban";
// export * from "@/components/schedule";
// export * from "@/components/pivot";
// export * from "@/components/pdf";
// export * from "@/components/richtext";
// export * from "@/components/doctemplate";
// export * from "@/components/emailtemplate";
// export * from "@/components/map";
// export * from "@/components/etl";
// export * from "@/components/apiorchestrator";
// export * from "@/components/iot";
// export * from "@/components/office";
// export * from "@/components/whiteboard";
// export * from "@/components/knowledgegraph";
// export * from "@/components/digitaltwin";
// export * from "@/components/aicopilot";
// 导出所有store
export * from "@/store/ButtonPermission";

export * from "@/store/GlobalConfig";
export * from "@/store/SelfOperation";
export * from "@/store/UserInfo";
export * from "@/store/StoreManager";

//将pinia的实例导出，否则会导致在设计表单时数据不一致
export { piniaInstance, starHorseAxios };

export default {
  install,
  piniaInstance,
  starHorseAxios,
};
