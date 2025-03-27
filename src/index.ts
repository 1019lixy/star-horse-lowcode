import "virtual:svg-icons-register";
// 在文件最顶部添加以下代码
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {App, defineAsyncComponent} from "vue";
import piniaInstance from "@/store";
import '@/assets/css/index.scss';
import "highlight.js/styles/idea.css";
import "element-plus/theme-chalk/index.css";
import "@/assets/css/flow.scss";
import "tailwindcss/index.css";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ZhLocale from "element-plus/es/locale/lang/zh-cn";
export * from "@/api/star_horse_apis.ts";
export * from "@/api/star_horse_utils.ts";
export * from "@/api/system.ts";
export * from "@/api/user_func.ts";
const items = import.meta.glob([
    "@/components/comp/*.vue",
    "@/components/system/*.vue",
    "@/components/formcomp/items/*.vue",
    "@/components/formcomp/container/*.vue",
]);
// 插件安装方法
const install = (app: App<Element>) => {
    app.use(piniaInstance)
    Object.entries(items).forEach(([path, component]) => {
        const name = path
            .split("/").pop()  // 获取文件名
            ?.replace(/\.vue$/, ""); // 移除扩展名

        if (name) {
            app.component(name, defineAsyncComponent(component));
        }
    });
    app.use(ElementPlus, {
        locale: ZhLocale
    });
    /**
     * 加载elementplus 自己提供的图标
     */
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }
};

// 导出所有组件用于按需引入
export * from "@/components/comp";
export * from "@/components/formcomp/container";
export * from "@/components/formcomp/items";
export * from "@/components/system";
export * from "@/components/types";
// 导出所有store
export * from '@/store/ButtonPermission.ts';
export * from '@/store/ConsumerView.ts';
export * from '@/store/ContinusConfig.ts';
export * from '@/store/CopyerOperation.ts';
export * from '@/store/DesignForm.ts';
export * from '@/store/DesignGraph.ts';
export * from '@/store/DesignPage.ts';
export * from '@/store/DynamicForm.ts';
export * from '@/store/GlobalConfig.ts';
export * from '@/store/SelfOperation.ts';
export * from '@/store/UserInfo.ts';

export {default as piniaInstance} from '@/store'

export default {install};
