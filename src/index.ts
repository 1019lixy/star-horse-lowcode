import {App, defineAsyncComponent} from "vue";
import piniaInstance from "@/store";
const items = import.meta.glob([
    "@/components/comp/*.vue",
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
};

// 导出所有组件用于按需引入
export * from "@/components/comp";
export * from "@/components/formcomp/container";
export * from "@/components/formcomp/items";
export default {install};
