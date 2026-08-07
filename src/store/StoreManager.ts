import piniaInstance from "@/store";
import {useUserInfoStore} from "@/store/UserInfo";
import {useSelfOperationStore} from "@/store/SelfOperation";
import {useGlobalConfigStore} from "@/store/GlobalConfig";
import {useDynamicFormStore} from "@/store/DynamicForm";
import {useDesignPageStore} from "@/store/DesignPage";
import {useCopyerOperationStore} from "@/store/CopyerOperation";
import {useConsumerViewStore} from "@/store/ConsumerView";
import {useButtonPermissionStore} from "@/store/ButtonPermission";
import {useDesignFormStore} from "@/store/DesignForm";
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
 * 获取动态表单 Store
 */
export const getDynamicFormStore = () => useDynamicFormStore(piniaInstance);

/**
 * 获取设计页面 Store
 */
export const getDesignPageStore = () => useDesignPageStore(piniaInstance);

/**
 * 获取拷贝操作 Store
 */
export const getCopyerOperationStore = () =>
    useCopyerOperationStore(piniaInstance);

/**
 * 获取消费者视图 Store
 */
export const getConsumerViewStore = () => useConsumerViewStore(piniaInstance);

/**
 * 获取按钮权限 Store
 */
export const getButtonPermissionStore = () =>
    useButtonPermissionStore(piniaInstance);

/**
 * 获取设计表单 Store
 */
export const getDesignFormStore = () => useDesignFormStore(piniaInstance);
/**
 * 动态表单缓存
 */
export const getFormDataCacheStore = () => useFormDataCacheStore(piniaInstance);
export default {
    getUserStore,
    getSelfOperationStore,
    getGlobalConfigStore,
    getDynamicFormStore,
    getDesignPageStore,
    getCopyerOperationStore,
    getConsumerViewStore,
    getButtonPermissionStore,
    getDesignFormStore,
    getFormDataCacheStore,
};
