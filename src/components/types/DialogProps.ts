import {ApiUrls} from '@/components/types/ApiUrls';

/**
 * 弹窗属性
 */
export type DialogProps = {
    /**
     * 批量编辑标题
     */
    batchDialogTitle?: string,
    /**
     * 编辑标题
     */
    dialogTitle?: string,
    /**
     * 批量编辑弹窗控制变量
     */
    batchEditVisible?: boolean,
    /**
     * 编辑弹窗控制变量
     */
    editVisible?: boolean,
    /**
     * 上传组件控制变量
     */
    uploadVisible?: boolean,
    /**
     * 查看数据控制变量
     */
    viewVisible?: boolean,
    /**
     * 弹窗显示/隐藏备用1
     */
    bakeVisible1?: boolean,
    /**
     * 弹窗显示/隐藏备用2
     */
    bakeVisible2?: boolean,
    /**
     * 弹窗显示/隐藏备用3
     */
    bakeVisible3?: boolean,
    /**
     * 数据id
     */
    ids?: number | string | undefined | null,
    /**
     * 是否扩展表
     */
    isExpand?: boolean,
    /**
     * 扩展表的接口API
     */
    expandUrl?: ApiUrls
}
