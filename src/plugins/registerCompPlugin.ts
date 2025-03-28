import {defineAsyncComponent} from "vue";


/**
 * 注册组件
 * @param app app
 * @param moduleName 模块名称
 */
const register = ({app, moduleName}) => {
    const items = import.meta.glob(`${moduleName}/*.vue`);
    for (const [key, value] of Object.entries(items)) {
        const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
        app.component(name, defineAsyncComponent(value));
    }
};
export {register};
