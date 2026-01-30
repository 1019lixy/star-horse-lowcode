/**
 * 角色信息
 */
export interface RoleInfo {
    /**
     * 角色Id
     */
    roleId: string;
    /**
     * 角色名称
     */
    roleName: string;
    /**
     * 角色编码
     */
    roleCode?: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 姓名
     */
    name: string;
    /**
     * 用户名
     */
    username: string;
    /**
     * 邮箱地址
     */
    email?: string;
    /**
     * 联系电话
     */
    phone?: string;
    /**
     * 角色信息
     */
    roles?: RoleInfo[];

}
