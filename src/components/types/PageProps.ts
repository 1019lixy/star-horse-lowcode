import {ApiUrls} from "@/components/types/ApiUrls";
import type {ExpandTable, OrderByInfo, PageFieldInfo, UserFuncInfo,} from "@/components/types/PageFieldInfo";
import type {BtnHideCondition, SearchInfo, SearchParams} from "@/components/types/Params";
import type {PreValid} from "@/components/types/BtnAuth";
import type {EditCondition} from "@/components/types/SearchProps";

/**
 * 页面数据信息
 */
export declare interface PageProps {
    /**
     * 数据总条数
     */
    totalData?: number;
    /**
     * 每页数据条数
     */
    pageSize?: number;
    /**
     * 页码
     */
    currentPage?: number;
    /**
     * 总页数
     */
    totalPage?: number;
    /**
     * 数据
     */
    dataList?: Array<any> | null;
}

export declare interface DataListProps {
    /**
     * 接口地址
     */
    compUrl: ApiUrls | any;
    /**
     * 主键
     */
    primaryKey: string | any;
    /**
     * 页面信息
     */
    fieldList: PageFieldInfo;
    /**
     * 隐藏按钮条件
     */
    hideBtnCondition: BtnHideCondition[];
    /**
     * 是否显示批量属性
     */
    showBatchField: boolean;
    /**
     * 格式化函数
     */
    dataFormat: Function;
    /**
     * 禁用列表按钮
     */
    disableAction: boolean;
    /**
     * 弹窗模式
     */
    dialogInput: boolean;
    /**
     * 高度
     */
    height: string;
    /**
     * 数据过滤条
     */
    filterCondition: SearchParams[];
    /**
     * 排序条件
     */
    orderBy: OrderByInfo[];
    /**
     * 是否显示分页条
     */
    showPageBar: boolean;
    /**
     * 列表数据
     */
    tableDataList: Array<any>;
    // Echo data list
    reverseDataList: Array<any>;
    /**
     * 是否运行选择父节点
     */
    allowSelectParent: boolean;
    /**
     *是否默认展开所有子节点
     */
    expand: boolean;
    /**
     * 是否需要加载遮罩
     */
    needLoad: boolean;
    /**
     * 标题
     */
    title: string;
    /**
     * 用户自定义按钮
     */
    extendBtns: UserFuncInfo[];
    /**
     * 按钮是否可以点击的前置条件
     */
    preValidFunc: PreValid[];
    /**
     * 是否运行多选
     */
    multipleSelect: boolean;
    /**
     * 行高
     */
    lineHeight: string;
    /**
     * 是否显示选择框
     */
    showSelection: boolean;
    /**
     * 嵌套表信息
     */
    expandTable: ExpandTable;
    /**
     * 帮助提示
     */
    helpMsg: string;
    /**
     * 全局配置
     */
    globalConfig: Record<string, any>;
    /**
     * 是否动态表
     */
    isDynamic: boolean;
    /**
     * 需要隐藏的按钮
     */
    hideButtonList: boolean;

    /**
     * Data sharer
     *   Get information shared by others
     *   let resultData = await loadData('/system-config/system/dataPermission/currentMenuPermissionPerson', {});
     *   The above interface mainly returns the account of the sharer
     *   commonPersons.value = resultData?.data;
     */
    commonPersons: Array<any>;
    /**
     * 在数据提权的时候需要指定通过那个字段做关联条件
     */
    userColumnName: string;
    /**
     * 按钮自定义权限
     */
    btnPermissions: Record<string, string>;
    /**
     * 每页数据备选项
     */
    pageCombList: number[];
    /**
     * 分页条布局
     */
    pageBarLayout: string;
    /**
     * 编辑条件
     */
    editCondition: EditCondition[];
    /**
     * 翻页保留历史数据
     */
    pageKeepOldData: boolean;
    /**
     * 是否预览模式
     */
    preview: boolean;
    /**
     * APP 端查询表单配置（传入后 APP 端顶部显示查询图标）
     */
    searchFormData?: SearchInfo;
    /**
     * 弹窗类型
     */
    dialogType: "dialog" | "drawer";
}
