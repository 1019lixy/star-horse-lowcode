/**
 * 页面数据信息
 */
export declare interface PageProps {
    /**
     * 数据总条数
     */
    totalData?: number,
    /**
     * 每页数据条数
     */
    pageSize?: number,
    /**
     * 页码
     */
    currentPage?: number,
    /**
     * 总页数
     */
    totalPage?: number,
    /**
     * 数据
     */
    dataList?: Array<any> | null
}
