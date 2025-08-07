import {defineStore} from "pinia";
import {ref, unref} from "vue";
import {RouteLocationNormalized} from "vue-router";
import {postRequest} from "@/api/star_horse_apis";
import {getUserInfo} from "@/utils/auth";
import {warning} from "@/utils/message";

/**
 * 用户权限控制
 */
export const useButtonPermissionStore = defineStore("buttonPermission", () => {
    const pageBtnPermisson = ref<any>({});
    const currentPermission = ref<any>({});
    const permissionUrlPrefix = ref<string>(
        "/system-config/system/resources/permissionResources/",
    );
    const addRoute = async (route: RouteLocationNormalized) => {
        //如果当前路由为空，则获取宿主的路由
        let data: any =
            route ?? (window.__hostRouter__?.currentRoute || window.__hostRouter__);
        const meta: any = unref(data)?.meta;
        return await getPagePermission(meta?.menuId);
    };
    const setPermissionUrl = (url: string) => {
        permissionUrlPrefix.value = url ?? permissionUrlPrefix.value;
    };
    /**
     * 添加单个权限
     * @param menuId
     * @param data
     */
    const addPermission = (menuId: string, data: any) => {
        pageBtnPermisson.value[menuId] = data;
    };
    /**
     * 删除某个菜单权限
     * @param menuId
     */
    const removePermission = (menuId: string) => {
        delete pageBtnPermisson.value[menuId];
    };
    /**
     *
     * @param data
     */
    const addAllPermission = (data: any) => {
        pageBtnPermisson.value = data;
    };
    /**
     * 清空所有权限
     */
    const cleanPermission = () => {
        pageBtnPermisson.value = {};
    };
    const getPagePermission = async (menuId: string) => {
        currentPermission.value = [];
        if (menuId) {
            menuId = menuId.split("_")[1];
            let permissons: any = [];
            if (!permissons || permissons.length == 0) {
                const userId = getUserInfo()?.idUsersinfo;
                if (!userId) {
                    warning("Session 失效");
                    return;
                }
                //没拿到则到数据库中去取
                await postRequest(
                    `${permissionUrlPrefix.value}${userId}/${menuId}`,
                    {},
                ).then((res) => {
                    if (res.data.code) {
                        console.log(res.data.cnMessage);
                        return;
                    }
                    permissons = res.data.data;
                });
                if (permissons && permissons.length > 0) {
                    addPermission(menuId, permissons);
                } else {
                    warning("没有页面按钮操作权限,请联系系统管理员授权");
                }
            }
            const permission: any = {};
            permissons?.forEach((item: any) => {
                permission[item.resCode] = item.resCode;
            });
            currentPermission.value = permission;
        }
        return currentPermission.value;
    };
    return {
        pageBtnPermisson,
        currentPermission,
        setPermissionUrl,
        addPermission,
        addAllPermission,
        addRoute,
        removePermission,
        cleanPermission,
    };
});
