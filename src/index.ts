import "virtual:svg-icons-register";
// 在文件最顶部添加以下代码
import {App, defineAsyncComponent} from "vue";
import '@/assets/css/index.scss';
// import "highlight.js/styles/idea.css";
import "element-plus/theme-chalk/index.css";
import "@/assets/css/flow.scss";
import "tailwindcss/index.css";
import piniaInstance from "@/store";
import type {Router} from 'vue-router';

export * from "@/api/star_horse_apis.ts";
export * from "@/api/star_horse_utils.ts";
export * from "@/api/date_utils.ts";
export * from "@/api/system.ts";
export * from "@/api/user_func.ts";
export * from "@/utils/message.ts";
export * from "@/api/finger_utils.ts"
const items = import.meta.glob([
    "@/components/comp/*.vue",
    "@/components/system/*.vue",
    "@/components/formcomp/items/*.vue",
    "@/components/formcomp/container/*.vue",
]);
// 声明全局变量存储宿主应用的 router
declare global {
    var __hostRouter__: Router | undefined
}
// 插件安装方法
const install = (app: App<Element>, options?: { router?: Router }) => {
    // 注入宿主应用的 router 实例
    if (options?.router) {
        app.provide('starHorseRouter', options.router);
        window.__hostRouter__ = options.router;
    }
    Object.entries(items).forEach(([path, component]) => {
        const name = path
            .split("/").pop()  // 获取文件名
            ?.replace(/\.vue$/, ""); // 移除扩展名

        if (name) {
            app.component(name, defineAsyncComponent(component as any));
        }
    });

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
export * from '@/store/DesignPage.ts';
export * from '@/store/DynamicForm.ts';
export * from '@/store/GlobalConfig.ts';
export * from '@/store/SelfOperation.ts';
export * from '@/store/UserInfo.ts';
//将pinia的实例导出，否则会导致在设计表单时数据不一致
export {piniaInstance};

export default {
    install,
    piniaInstance
};
