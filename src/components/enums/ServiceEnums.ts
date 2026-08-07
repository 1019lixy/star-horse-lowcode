export enum ServiceEnums {
    /**
     * 系统服务
     */
    SYSTEM_SERVICE = "system-config",
    /**
     * 数据库服务
     */
    DBUSER_SERVICE = "dbuser-manage",
    /**
     * 公共接口前缀
     */
    GLOBAL_PREFIX = `${SYSTEM_SERVICE}/global/`,
    /**
     * 系统服务接口前缀
     */
    SYSTEM_PREFIX = `${SYSTEM_SERVICE}/system/`,
}
