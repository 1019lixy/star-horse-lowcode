import {SearchParams} from "@/components/types/Params";

/**
 * 组件用到的属性
 */
export type ApiUrls = {
    /**
     * 分页接口
     */
    pageListUrl: string;
    /**
     * merge接口
     */
    mergeUrl: string;
    /**
     * merge暂存接口
     */
    mergeDraftUrl: string;
    /**
     * 批量Merge接口
     */
    batchMergeUrl: string;
    /**
     * 批量暂存接口
     */
    batchMergeDraftUrl: string;
    /**
     * 根据Id获取数据接口
     */
    loadByIdUrl: string;
    /**
     * 根据Id获取数据接口
     */
    loadByIdForViewUrl: string;
    /**
     * 删除数据接口
     */
    deleteUrl: string;
    /**
     * 根据条件删除数据
     */
    deleteByConditionUrl?: string;
    /**
     * 导出数据接口
     */
    exportAllUrl?: string;
    /**
     * 下载模板接口
     */
    downloadTemplateUrl?: string;
    /**
     * 自定义查询接口 返回满足条件的所有数据
     */
    listConditionUrl?: string;
    /**
     * 自定义查询接口 返回满足条件的一条数据
     */
    oneConditionUrl?: string;
    /**
     * 上载接口
     */
    uploadUrl?: string;
    /**
     * 导入数据接口
     */
    importUrl?: string;
    /**
     * 执行接口
     */
    executeUrl?: string;
    /**
     * 修改字段接口
     */
    modifyColumnsUrl?: string;
    /**
     * 接口路径前缀
     */
    basePrefix?: string;
    /**
     * 权限接口,此接口需要用户自己赋值,如果不赋值则使用系统默认接口
     */
    permissionsUrl?: string;
    /**
     * 重定向执行接口
     */
    redirectExecutionUrl?: string;
    /**
     * 重定向分页接口
     */
    redirectPageListUrl?: string;
    /**
     * 应用名称或者接口前缀路径
     */
    appName?: string;
    /**
     * 子路径
     */
    subPrefix?: string;
    /**
     * 权限隔离属性字段，如果提供则所有Post请求都会带上该字段
     * 接口过滤条件
     */
    condition?: Array<SearchParams>;
    /**
     * 是否接口转发
     */
    redirect?: boolean;
    /**
     * 接口请求方式
     */
    httpMethod?: string;
    /**
     * 数据请求方式
     */
    dataType?: string;
    /**
     * 分页接口
     */
    pageAction?: Function;
    /**
     * 编辑接口
     */
    mergeAction?: Function;
    /**
     * 编辑暂存接口
     */
    mergeDraftAction?: Function;
    /**
     * 批量编辑接口
     */
    batchMergeAction?: Function;
    /**
     * 批量编辑暂存接口
     */
    batchMergeDraftAction?: Function;
    /**
     * 根据Id获取数据接口
     */
    loadByIdAction?: Function;
    /**
     * 删除数据接口
     */
    deleteAction?: Function;
    /**
     * 根据条件删除数据
     */
    deleteByConditionAction?: Function;
    /**
     * 导出数据接口
     */
    exportDataAction?: Function;
    /**
     * 下载模板接口
     */
    downloadTemplateAction?: Function;
    /**
     * 自定义查询接口
     */
    queryConditionAction?: Function;
    /**
     * 自定义查询接口
     */
    queryOneByConditionAction?: Function;
    /**
     * 上载接口
     */
    uploadAction?: Function;
    /**
     * 导入数据接口
     */
    importAction?: Function;
    /**
     * 执行接口
     */
    executeAction?: Function;
    /**
     * 修改字段接口,
     * 接收的参数为：{
     *   columnsInfo：{},//要修改的字段及修改后的值
     *   conditions：[] //修改条件
     * }
     */
    modifyColumnsAction?: Function;
};
