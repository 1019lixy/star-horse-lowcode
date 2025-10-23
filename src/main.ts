import "tailwindcss/index.css";
// import 'element-plus/theme-chalk/index.css';
import "@/assets/css/index.scss";
import "@/assets/icons.css";
import userComponent from "@/components/comp/selfcomp";
import userContainerComponent from "@/components/comp/items/callitem";
import itemComponent from "@/components/formcomp/items/allitem";
import containerComponent from "@/components/formcomp/container/callitem";
import systemComponent from "@/components/system/SystemComp";
// @ts-ignore
import App from "@/App.vue";
import { createApp } from "vue";
import draggable from "vuedraggable";
import piniaInstance from "@/store";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const app = createApp(App);
// window.app = app;
app.component("draggable", draggable);
/**
 * 加载elementplus 自己提供的图标
 */
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component);
// }
app.use(userComponent);
app.use(itemComponent);
app.use(userContainerComponent);
app.use(systemComponent);
app.use(containerComponent);

app.use(piniaInstance);

app.use(ElementPlus, {
  locale: zhCn,
});
app.config.performance = true;
/**
 * 处理未捕获异常
 * @param err
 * @param instance
 * @param info
 */
app.config.errorHandler = (err, instance, info) => {
  console.error(err, instance, info);
};
/**
 * 处理警告
 * @param err
 * @param instance
 * @param info
 */
app.config.warnHandler = () => null;

app.mount("#app");
