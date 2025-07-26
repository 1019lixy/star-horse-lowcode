// 在文件最顶部添加以下代码
import {App, defineAsyncComponent} from "vue";
import "tailwindcss/index.css";
import "@/assets/css/index.scss";
// import 'element-plus/theme-chalk/index.css';
import "@/assets/icons.css";
import piniaInstance from "@/store";
import {AxiosInstance} from "axios";
import type {Router} from "vue-router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import {starHorseAxios} from "@/api/star_horse_apis";

export * from "@/api/star_horse_apis";
export * from "@/api/star_horse_utils";

export * from "@/api/date_utils";
export * from "@/api/system";
export * from "@/api/user_func";
export * from "@/utils/message";
export * from "@/api/finger_utils";
const items = import.meta.glob([
    "@/components/comp/*.vue",
    "@/components/comp/items/*.vue",
    "@/components/system/*.vue",
    "@/components/formcomp/items/*.vue",
    "@/components/formcomp/container/*.vue",
]);
// 声明全局变量存储宿主应用的 router
declare global {
    var __hostRouter__: Router | undefined;
    var __hostAxios__: AxiosInstance | undefined;
    var __starHorseHostApp__: App<Element> | undefined;
}
// 插件安装方法
const install = (
    app: App<Element>,
    options?: {
        router?: Router;
        axiosInstance?: AxiosInstance;//如果外部传入axios实例，就使用外部传入的，否则使用默认的
        elementPlusOptions?: any; // 添加Element Plus配置选项
    },
) => {
    // 注入宿主应用的 router 实例
    if (options?.router) {
        window.__hostRouter__ = options.router;
    }
    // 注入axios实例
    if (options?.axiosInstance) {
        window.__hostAxios__ = options.axiosInstance;
    }
    // 只在没有配置时才设置中文
    if (!options?.elementPlusOptions?.locale) {
        app.use(ElementPlus, {
            locale: zhCn,
        });
    } else {
        app.use(ElementPlus, options.elementPlusOptions);
    }
    window.__starHorseHostApp__ = app;
    Object.entries(items).forEach(([path, component]) => {
        const name = path
            .split("/")
            .pop() // 获取文件名
            ?.replace(/\.vue$/, ""); // 移除扩展名

        if (name) {
            app.component(name, defineAsyncComponent(component as any));
        }
    });
};
//表单组件增加调用参数source: { type: Number, default: 1 },//调用来源1 表单新增 2 表单编辑 3 查看视图 4 查询 5 列表 6 表单设计 7 页面设计
// 导出所有组件用于按需引入
export * from "@/components/comp";
export * from "@/components/formcomp/container";
export * from "@/components/formcomp/items";
export * from "@/components/system";
export * from "@/components/types";
// 导出所有store
export * from "@/store/ButtonPermission";
export * from "@/store/ConsumerView";
export * from "@/store/ContinusConfig";
export * from "@/store/CopyerOperation";
export * from "@/store/DesignForm";
export * from "@/store/DesignPage";
export * from "@/store/DynamicForm";
export * from "@/store/GlobalConfig";
export * from "@/store/SelfOperation";
export * from "@/store/UserInfo";

//将pinia的实例导出，否则会导致在设计表单时数据不一致
export {piniaInstance, starHorseAxios};

export default {
    install,
    piniaInstance,
    starHorseAxios
};
