/**
 * Meta 信息
 */
interface Meta {
    /**
     * 标题
     */
    title: string;
    /**
     * 菜单Id
     */
    menuId: string;
    /**
     * 是否缓存页面
     */
    keepAlive: boolean;
    /**
     * 菜单图标
     */
    menuIcon: string;
}

/**
 * 菜单信息
 */
export declare interface MenusInfo {
    /**
     * 菜单路径
     */
    path: string;
    /* @vite-ignore */
    component: object;
    /**
     * 菜单名称
     */
    name: string;
    /**
     * 子菜单
     */
    children: Array<MenusInfo>;
    /**
     * 菜单meta 信息
     */
    meta: Meta;
}
