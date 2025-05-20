/**
 * 组件信息
 */
interface CompInfo {
    //ID
    id?: string;
    //属性名称
    name: string;
    //标签名称
    label: string;
    //是否允许拖拽，默认允许
    disableDrag: boolean;
    //子元素
    items?: Array<any>;
}

/**
 * 定义折叠面板数据格式
 */
export interface CustomerItem {
    //折叠面板名称
    name: string;
    //折叠面板标题
    title: string;
    //面板内的数据元素
    compItems?: Array<CompInfo>;
}

/**
 * 节点信息
 */
export interface NodeInfo {
    //节点Id
    id?: string;
    //节点索引
    index: number;
    //节点样式
    shape: string;
    //节点名称
    name: string;
    //节点类型为空则取normal
    compType?: string;
    //标签名称
    label: string;
    //业务数据
    data?: any;
    //节点的x坐标
    posX?: number;
    //节点的y坐标
    posY?: number;
    //节点图标
    icon?: string;
    //节点宽度
    width?: number;
    //行高
    lineHeight?: number;
    //表格时的字段属性
    items?: Array<any>;
}

/**
 * 边构建信息
 */
export interface EdgeInfo {
    //边Id
    id?: string;
    //连接起点组件Id
    sourceId: string;
    //链接终点组件Id
    targetId: string;
    //链接起点桩
    sourcePoint: string;
    //链接终点桩
    targetPoint: string;
    //业务数据
    data?: any;
    //标签名称
    label: string;
    //标签颜色
    color: string;
}
