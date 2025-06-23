import {App} from 'vue';
import type {Router} from 'vue-router';
import {registerGlobalComponents} from './components/register';
import {configureElementPlus} from './config/element';

// 声明全局变量（保持原有逻辑）
declare global {
    var __hostRouter__: Router | undefined;
    var __starHorseHostApp__: App<Element> | undefined;
}

// 插件安装方法（原 install 函数）
export const install = (app: App<Element>, options?: {
    router?: Router,
    elementPlusOptions?: any
}) => {
    // 注入宿主应用的 router 实例
    if (options?.router) {
        app.provide('starHorseRouter', options.router);
        window.__hostRouter__ = options.router;
    }

    // Element Plus 配置（拆分至 config/element.ts）
    configureElementPlus(app, options?.elementPlusOptions);

    // 全局组件注册（拆分至 components/register.ts）
    registerGlobalComponents(app);

    window.__starHorseHostApp__ = app;
};
