import {OrderByInfo} from "@/components/types/PageFieldInfo";

/**
 * 查询条件组装数据对象
 */
export declare interface SearchParams {
    /**
     * 属性名称
     */
    propertyName?: string;
    /**
     * 匹配方式 eq,lk,gt,gte,lt,lte,llk,rlk,in ,nin,exits
     */
    operation?: string | null;
    /**
     * 查询值
     */
    value?: any;
    /**
     * 或查询
     */
    orOperList?: SearchParams[];
}

/**
 * 查询条件组装数据对象
 */
export declare interface JoinSearchParams {
    /**
     * 属性名称
     */
    leftFieldName: string;
    /**
     * 匹配方式 eq,neq,gt,gte,lt,lte
     */
    operation?: string | null;
    /**
     * 查询值
     */
    rightFieldName: string;
    /**
     * 或查询
     */
    or?: JoinSearchParams[];
}

/**
 * 查询对象
 */
export declare interface SearchInfo {
    /**
     * 每页数据量大小
     */
    pageSize?: number;
    /**
     * 页码
     */
    currentPage?: number;
    /**
     * 总数据量
     */
    totalDatas?: number;
    /**
     * 总页数
     */
    totalPages?: number;
    /**
     * 查询条件
     */
    fieldList?: SearchParams[];
    /**
     * 排序条件
     */
    orderBy?: OrderByInfo[];
}

/**
 * 列表按钮隐藏条件
 */
export declare interface BtnHideCondition {
    /**
     * 属性名
     */
    fieldName: string;
    /**
     * 按钮
     */
    btnName: Array<string> | string;
    /**
     * 值
     */
    value: any;
    /**
     * 是否可见
     */
    visible: boolean;
}

/**
 * 接口重定向参数
 */
export declare interface RedirectParams {
    /**
     * 接口地址
     */
    url: string;
    /**
     * 主机或者域名
     */
    host?: string;
    /**
     * 端口
     */
    port?: string;
    /**
     * 协议
     */
    protocol?: string;
    /**
     * 环境
     */
    env?: string;
    /**
     * http方法
     */
    httpMethod?: string;
    /**
     * 数据类型
     */
    dataType?: string;
    /**
     * 查询条件
     */
    queryParams?: SearchParams[];
    /**
     * 分页信息
     */
    searchInfo?: SearchInfo;
    /**
     * 主键
     */
    primaryKey?: any;
    /**
     * 标签名称
     */
    labelName?: string;
    /**
     * 值名称
     */
    valueName?: string;
}
