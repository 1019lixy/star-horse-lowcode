import "tailwindcss/index.css";
import "@/assets/css/index.scss";
import "@/assets/icons.css";
import userComponent from "@/components/comp/selfcomp";
import userContainerComponent from "@/components/comp/items/callitem";
import itemComponent from "@/components/formcomp/items/allitem";
import systemComponent from "@/components/system/SystemComp";
// @ts-ignore
import App from "@/App.vue";
import { createApp } from "vue";
import draggable from "vuedraggable-es";
import piniaInstance from "@/store";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const app = createApp(App);
app.component("draggable", draggable);

app.use(userComponent);
app.use(itemComponent);
app.use(userContainerComponent);
app.use(systemComponent);

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
