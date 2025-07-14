import { defineStore } from 'pinia';
import { MenusInfo } from '@/components/types/MenusInfo';
import { ref } from 'vue';

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfo = ref<any>({});
    const pageButtonPermission = ref<any>({});
    const permissionMenus = ref<any>([]);
    const dynamicMenus = ref<any>([]);
    const loginDialogVisible = ref<boolean>(false);

    const showLoginDialog = () => {
        loginDialogVisible.value = true;
    };
    const closeLoginDialog = () => {
        loginDialogVisible.value = false;
    };
    /**
     * 用户登录
     * @param data
     */
    const login = (data: any) => {
        userInfo.value = data;
    };
    /**
     * 用户登出
     */
    const logout = () => {
        // this.userInfo = {};
        permissionMenus.value = [];
        dynamicMenus.value = [];
    };
    /**
     * 权限菜单
     * @param data
     */
    const addPermissionMenus = (data: any) => {
        permissionMenus.value = data;
    };
    /**
     * 添加页面按钮权限
     * @param data
     */
    const addPageButtonPermission = (data: any) => {
        pageButtonPermission.value = data;
    };
    /**
     * 记录菜单权限
     * @param menuId
     * @param data
     */
    const pushPageButtonPermission = (menuId: string, data: any) => {
        pageButtonPermission.value[menuId] = data;
    };
    /**
     * 添加动态菜单
     * @param data
     */
    const addDynamicMenus = (data: MenusInfo) => {
        if (!dynamicMenus.value) {
            dynamicMenus.value = [];
        }
        if (data) {
            dynamicMenus.value.push(data);
        }
    };
    return {
        userInfo,
        pageButtonPermission,
        permissionMenus,
        dynamicMenus,
        showLoginDialog,
        loginDialogVisible,
        closeLoginDialog,
        login,
        logout,
        addPermissionMenus,
        addPageButtonPermission,
        pushPageButtonPermission,
        addDynamicMenus
    };
},
    {
        persist: true
    }
);
