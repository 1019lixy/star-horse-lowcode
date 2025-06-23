import { App, defineAsyncComponent } from 'vue';

// 动态导入组件路径（保持原有逻辑）
const items = import.meta.glob([
    '@/components/comp/*.vue',
    '@/components/comp/items/*.vue',
    '@/components/system/*.vue',
    '@/components/formcomp/items/*.vue',
    '@/components/formcomp/container/*.vue',
]);

// 全局组件注册函数
export const registerGlobalComponents = (app: App<Element>) => {
    Object.entries(items).forEach(([path, component]) => {
        const name = path
            .split('/').pop()  // 获取文件名
            ?.replace(/\.vue$/, ''); // 移除扩展名

        if (name) {
            app.component(name, defineAsyncComponent(component as any));
        }
    });
};
