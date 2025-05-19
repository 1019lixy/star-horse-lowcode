// import 'virtual:svg-icons-register';
// 在文件最顶部添加以下代码
import {App, defineAsyncComponent} from 'vue';
import '@/assets/css/index.scss';
// import "highlight.js/styles/idea.css";
import 'element-plus/theme-chalk/index.css';
import '@/assets/css/flow.scss';
import 'tailwindcss/index.css';
import '@/assets/icons.css';
import piniaInstance from '@/store';
import type {Router} from 'vue-router';

export * from '@/api/star_horse_apis';
export * from '@/api/star_horse_utils';
export * from '@/api/date_utils';
export * from '@/api/system';
export * from '@/api/user_func';
export * from '@/utils/message';
export * from '@/api/finger_utils';
const items = import.meta.glob([
    '@/components/comp/*.vue',
    '@/components/system/*.vue',
    '@/components/formcomp/items/*.vue',
    '@/components/formcomp/container/*.vue',
]);
// 声明全局变量存储宿主应用的 router
declare global {
    var __hostRouter__: Router | undefined;
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
            .split('/').pop()  // 获取文件名
            ?.replace(/\.vue$/, ''); // 移除扩展名

        if (name) {
            app.component(name, defineAsyncComponent(component as any));
        }
    });

};

// 导出所有组件用于按需引入
export * from '@/components/comp';
export * from '@/components/formcomp/container';
export * from '@/components/formcomp/items';
export * from '@/components/system';
export * from '@/components/types';
// 导出所有store
export * from '@/store/ButtonPermission';
export * from '@/store/ConsumerView';
export * from '@/store/ContinusConfig';
export * from '@/store/CopyerOperation';
export * from '@/store/DesignForm';
export * from '@/store/DesignPage';
export * from '@/store/DynamicForm';
export * from '@/store/GlobalConfig';
export * from '@/store/SelfOperation';
export * from '@/store/UserInfo';
//将pinia的实例导出，否则会导致在设计表单时数据不一致
export {piniaInstance};

export default {
    install,
    piniaInstance
};
