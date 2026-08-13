export { default as StarHorseButtonList } from "./StarHorseButtonList.vue";
export { default as StarHorseMenu } from "./StarHorseMenu.vue";
export { default as StarHorseSvg } from "./StarHorseSvg.vue";
export { default as ContentMenu } from "./ContentMenu.vue";
export { default as StarHorseEditor } from "./StarHorseEditor.vue";
// StarHorseCodeEditor 和 StarHorseDiffEditor 依赖 monaco-editor/codemirror 等重型依赖
// 不应从主入口导出，避免消费方 Vite 预构建时产生 HTTP2 协议错误
// 使用方式: import { StarHorseCodeEditor } from 'star-horse-lowcode/dist/assets/StarHorseCodeEditor.vue'
// 或通过 defineAsyncComponent 按需加载
export { default as StarHorseSidebar } from "./StarHorseSidebar.vue";
export { default as SvgLoader } from "./SvgLoader.vue";
export { default as PageConfig } from "./PageConfig.vue";
