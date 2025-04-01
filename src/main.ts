import "element-plus/theme-chalk/index.css";
import "@/assets/css/index.scss";
import "@/assets/css/flow.scss";
import "tailwindcss/index.css";
import userComponent from "@/components/comp/selfcomp";
import userContainerComponent from "@/components/comp/items/callitem";
import itemComponent from "@/components/formcomp/items/allitem";
import containerComponent from "@/components/formcomp/container/callitem";
import commonComponent from "@/components/common/index";
import systemComponent from "@/components/system/SystemComp";
import App from "@/App.vue";
import {createApp} from "vue";
import ElementPlus from "element-plus";
// 导入svg图标
import "virtual:svg-icons-register";
import "highlight.js/styles/idea.css"; //这里有多个样式，自己可以根据需要切换
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "animate.css";
import ZhLocale from "element-plus/es/locale/lang/zh-cn"; // 中文
import draggable from "vuedraggable";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import piniaInstance from "@/store";
import VMEditor from "v-md-editor";
import "v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "v-md-editor/lib/theme/vuepress.js";
import "v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import "prismjs/components/prism-json.js";
import hljs from "highlight.js";


const app = createApp(App);
// window.app = app;
app.component("draggable", draggable);
/**
 * 加载elementplus 自己提供的图标
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(userComponent);
app.use(itemComponent);
app.use(commonComponent);
app.use(userContainerComponent);
app.use(systemComponent);
app.use(containerComponent);

app.use(piniaInstance);
VMEditor.use(vuepressTheme, {
    Prism,
    Hljs: hljs
});
app.use(VMEditor);
app.use(ElementPlus, {
    locale: ZhLocale
});
app.use(hljsVuePlugin);
app.config.performance = true;
/**
 * 处理未捕获异常
 * @param err
 * @param instance
 * @param info
 */
app.config.errorHandler = (err, instance, info) => {
    console.log(err);
    console.log(instance);
    console.log(info);
};
/**
 * 处理警告
 * @param err
 * @param instance
 * @param info
 */
app.config.warnHandler = () => null;
// app.config.warnHandler=(msg, instance, trace)=>{
//     console.log(msg);
//     console.log(instance);
//     console.log(trace);
// }
app.mount("#app");
