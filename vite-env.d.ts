/// <reference types="vite/client" />
declare module "*.mjs"
declare module "*.d.ts"
declare module "element-plus/dist/locale/zh-cn" {
    const content: any;
    export default content;
}
declare module "*.vue" {
    import type {DefineComponent, ComponentOptions} from "vue";
    import Vue from "vue";
    const component: DefineComponent<{}, {}, any> | ComponentOptions | Vue;
    export default component;
}
interface ImportMeta {
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
}
