import piniaInstance from "@/store";
import {useUserInfoStore} from "@/store/UserInfo";
import {useSelfOperationStore} from "@/store/SelfOperation";
import {useGlobalConfigStore} from "@/store/GlobalConfig";
import {useButtonPermissionStore} from "@/store/ButtonPermission";
import {useFormDataCacheStore} from "@/store/FormDataCache";

/**
 * Store 管理器 - 提供统一的 Store 获取函数
 * Pinia 的 useStore 是单例，所以直接返回即可，不需要缓存
 */

/**
 * 获取用户信息 Store
 */
export const getUserStore = () => useUserInfoStore(piniaInstance);

/**
 * 获取自定义操作 Store
 */
export const getSelfOperationStore = () => useSelfOperationStore(piniaInstance);

/**
 * 获取全局配置 Store
 */
export const getGlobalConfigStore = () => useGlobalConfigStore(piniaInstance);


/**
 * 获取按钮权限 Store
 */
export const getButtonPermissionStore = () =>
    useButtonPermissionStore(piniaInstance);


/**
 * 动态表单缓存
 */
export const getFormDataCacheStore = () => useFormDataCacheStore(piniaInstance);
export default {
    getUserStore,
    getSelfOperationStore,
    getGlobalConfigStore,
    getButtonPermissionStore,
    getFormDataCacheStore,
};
