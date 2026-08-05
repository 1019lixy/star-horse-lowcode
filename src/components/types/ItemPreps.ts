import {ApiUrls} from "./ApiUrls";
import {FieldInfo, FieldMapping, PageFieldInfo} from "./PageFieldInfo";
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
    commonFormat?: Function;
    /**
     * 是否添加运行子节点
     */
    enableSubNode?: boolean;
}

/**
 * 规则属性
 */
export interface RulePreps {
    /**
     * 代理执行接口
     */
    proxyUrl: string;
    /**
     * 表单Id
     */
    formId?: string;
    /**
     * 规则配置信息
     */
    config?: Record<string, any>;
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
        | "assignValue"
        | "changeType"
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
     * 规则引擎配置
     */
    ruleEngineConfig?: RulePreps;
    /**
     * 控制目标：field(默认,普通组件) | container(容器项,如tab/collapse/card/splitter子项)
     * - field: 走原有 controlFieldProps 逻辑,relationFields 为 fieldName
     * - container: 走容器控制逻辑,relationFields 为容器项的 tabName
     */
    controlTarget?: "field" | "container";
    /**
     * 当 controlTarget=container 时,指定容器所在 field 的 fieldName(如配置了 tabList 的 field)
     * 不指定则全局查找所有容器
     */
    containerField?: string;
}

export interface ApiParam {
    /**
     * 值类型，如果是动态值，需要提取value 中的${xx},替换为具体的xx
     */
    valueType: "dynamic" | "static";
    /**
     * 名称
     */
    paramName?: string;
    /**
     * 值
     */
    paramValue?: string;
    /**
     * 数据匹配方式
     */
    matchType?: string;
}

export interface ApiInfo {
    /**
     * 请求头
     */
    headers?: ApiParam[];
    /**
     * 请求参数
     */
    requestParams?: ApiParam[];
    /**
     * 数据返回模板
     */
    responseTemplate?: string;
    /**
     * 消息路径,如：返回数据位 {code:0,msg:'xxx',data:业务数据},这里的路径是msg
     * 返回数据位 {code:0,data:{
     *     msg:'xxx',
     *     instanceData:{}
     * }},这里的路径是data.msg
     */
    messagePath?: string;
    /**
     * 编码路径，参考messagePath
     */
    codePath?: string;
    /**
     * 业务数据路径,参考messagePath
     */
    dataPath?: string;
    /**
     * 成功码
     */
    successCode?: string;
    /**
     * 请求方式
     */
    httpMethod?: string;
    /**
     * 请求数据类型
     */
    requestDataType?: "form" | "json" | "binary";
    /**
     * 接口地址
     */
    url?: string;
    /**
     * 请求协议
     */
    protocol?: string;
    /**
     * 超时
     */
    timeout?: number;
    /**
     * 接口类型
     */
    apiType: "systemApi" | "thirdApi";
    /*******************以下参数是systemApi专属**********************/
    /**
     * 是否代理
     */
    redirect?: boolean;
    /**
     * 接口调用方法
     */
    method?: string;
    /**
     * 接口名称
     */
    interfaceName?: string;
    /**
     * 服务名
     */
    serviceName?: string;
}

export interface OptionField {
    /**
     * 显示属性
     */
    displayField: string;
    /**
     * 值属性
     */
    valueField: string;
    /**
     * 子节点属性
     */
    childrenField?: string;
    /**
     * 是否叶子节点属性
     */
    leafField?: string;
    /**
     * 禁用属性
     */
    disabledField?: string;
}

/**
 * 第三方接口
 */
export interface ApiLinkageDetail {
    /**
     * 业务接口
     */
    apiInfo: ApiInfo;
    /**
     * 认证信息
     */
    authInfo?: ApiInfo;
    /**
     * 字段映射，接口字段与表单字段之间的转换关系
     */
    fieldMappings?: FieldMapping[];
    /**
     * 数据源中数据返回后的显示属性配置
     */
    optionField?: OptionField;

    /**
     * 代理接口
     */
    proxyUrl?: string;
    /**
     * 赋值方式
     */
    assignValueType?: "form" | "datasource";
    /** 接口来源模式 */
    apiMode: "system" | "custom";
}

/**
 * 联动对象
 */
export interface ItemRelation {
    /**
     * 关联事件名称
     */
    actionName: string;
    /**
     * 关联关系详情
     */
    relationDetails?: RelationDetail[];
    /**
     * 动态接口
     */
    apiLinkage?: ApiLinkageDetail;
}
