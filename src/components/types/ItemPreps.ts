import {ApiUrls} from "./ApiUrls";
import {FieldInfo, PageFieldInfo} from "./PageFieldInfo";
import {RedirectParams} from "./Params";
import {SelectOption} from "./SearchProps";

export interface ItemPreps {
    /**
     * 是否是设计模式

     */
    isDesign?: boolean;
    /**
     * 是否禁用
     */

    disabled?: boolean;
    /**
     * 是否显示在表单中
     */

    showFormItem?: boolean;
    /**
     * 是否是基础组件
     */

    bareFlag?: boolean;
    /**
     * 是否是搜索组件
     */

    isSearch?: boolean;
    /**
     * 组件属性
     */

    field: FieldInfo | any; // 建议替换为实际的Field接口
    /**
     * 父组件属性
     */

    parentField?: any;
    /**
     * 表单信息
     */

    formInfo?: any;
    // 可扩展其他共享属性
    parentId?: string;
    /**
     * 回调函数
     */
    callBack?: Function;
    /**
     * 组件来源
     */
    source?: number;
}

export interface ContainerPreps {
    /**
     * 组件url
     */
    compUrl?: ApiUrls;
    /**
     * 组件属性
     */
    fieldList?: PageFieldInfo | any;
    /**
     * 组件属性
     */
    item?: any;
    /**
     * 组件名称
     */
    objectName?: string;
    /**
     * 数据索引
     */
    dataIndex?: number;
    // 父节点名称
    propPrefix?: string;
    /**
     * 父组件属性
     */
    parentPreps?: any;
    /**
     * 子表单标识
     */
    subFormFlag?: string;
    /**
     * 批量操作名称
     */
    batchName?: string;
    /**
     * 批量操作字段名称
     */
    batchFieldName?: string;
    /**
     * 主键
     */
    primaryKey?: string | any;
    /**
     * 校验规则
     */
    rules?: any;
    /**
     * 组件大小
     */
    compSize: string;
    /**
     * 组件来源
     */
    source: number;
    /**
     * 层级深度（用于 children 递归渲染）
     */
    level?: number;
    /**
     * 格式化函数
     */
    commonFormat?: Function,
}

export interface FieldMappingItem {
    /**
     * 接口返回字段名
     */
    sourceField: string;
    /**
     * 表单字段名
     */
    targetField: string;
    /**
     * 类型转换: string/number/boolean/array（可选）
     */
    typeConvert?: string;
    /**
     * 转换表达式（如日期格式化: dateFormat:yyyy-MM-dd）
     */
    transform?: string;
}

/**
 * 请求参数项
 */
export interface RequestParamItem {
    /**
     * 参数名
     */
    paramName: string;
    /**
     * 参数值(支持动态占位符)
     */
    paramValue: string;
}

export interface ApiLinkageConfig {
    /**
     * 接口地址
     */
    url: string;
    /**
     * 请求方法 GET/POST
     */
    httpMethod?: string;
    /**
     * 数据格式 Form/JSON
     */
    dataType?: string;
    /**
     * 请求协议 http/https
     */
    protocol?: string;
    /**
     * 请求IP或域名或服务名
     */
    host?: string;
    /**
     * 请求端口
     */
    port?: number;
    /**
     * 系统环境后缀
     */
    env?: string;
    /**
     * 响应模板类型: map/result_data/result_data_list/list/result_data_map
     */
    responseTemplate?: string;
    /**
     * 成功状态码(默认0)
     */
    successCode?: number | string;
    /**
     * 响应码字段路径(默认code)
     */
    codePath?: string;
    /**
     * 响应数据字段路径(默认data)
     */
    dataPath?: string;
    /**
     * 响应消息字段路径(默认message)
     */
    messagePath?: string;
    /**
     * 字段映射列表
     */
    fieldMappings?: FieldMappingItem[];
    /**
     * 认证类型: none/login/basic/bearer/custom
     */
    authType?: string;
    /**
     * 认证信息(兼容旧配置)
     */
    authInfo?: Record<string, string>;
    /**
     * 自定义请求头(兼容旧配置)
     */
    headers?: Record<string, string>;
    /**
     * 请求参数(动态值占位符,如 {fieldName: "$formField.xxx"}) - 兼容旧JSON格式
     */
    requestParams?: Record<string, any> | RequestParamItem[];
    // ====== 登录接口配置(authType=login时) ======
    /**
     * 登录接口地址
     */
    loginUrl?: string;
    /**
     * 登录请求方法
     */
    loginMethod?: string;
    /**
     * 登录请求参数(JSON)
     */
    loginParams?: Record<string, any>;
    /**
     * 登录响应中Token的提取路径
     */
    loginTokenPath?: string;
    /**
     * 携带Token的请求头名称
     */
    loginHeaderName?: string;
    // ====== Basic认证(authType=basic时) ======
    /**
     * Basic认证用户名
     */
    basicUsername?: string;
    /**
     * Basic认证密码
     */
    basicPassword?: string;
    // ====== Bearer Token(authType=bearer时) ======
    /**
     * Bearer Token值
     */
    bearerToken?: string;
    // ====== 自定义请求头(authType=custom时) ======
    /**
     * 自定义请求头(JSON)
     */
    customHeaders?: Record<string, string>;
    /**
     * 请求超时时间（秒），默认120
     */
    timeout?: number;
    /**
     * Nacos服务名（用于微服务内部调用）
     */
    serviceName?: string;
}

export interface RelationDetail {
    /**
     * 控制条件
     */
    controlCondition:
        | "eqConditionDataLinkage"
        | "asParamDataLinkage"
        | "eqDisable"
        | "eqEditable"
        | "eqHide"
        | "eqVisible"
        | "eqRequired"
        | "eqUnRequired"
        | "assignValue"
        | "changeType"
        | "apiLinkage"
        | "clearLinkage"
        | "refreshLinkage"
        | string;
    /**
     * 关联字段
     */
    relationFields: string | Array<string>;

    /**
     * 匹配类型
     */
    matchType: string;
    /**
     * 匹配字段名称
     */
    matchFieldName: string;
    /**
     * 匹配字段值
     */
    matchFieldValue: Array<string> | string;
    /**
     * 关联参数
     */
    params: RedirectParams;
    /**
     * 关联静态数据,根据不同类型赋值
     */
    staticDatas: SelectOption[] | any;
    /**
     * 多次事件是否 working
     */
    isWorking: boolean;
    /**
     * 接口联动配置(controlCondition为apiLinkage时使用)
     */
    apiLinkageConfig?: ApiLinkageConfig;
}

export interface ItemRelation {
    /**
     * 关联事件名称
     */
    actionName: string;
    /**
     * 关联关系详情
     */
    relationDetails: RelationDetail[];
}
