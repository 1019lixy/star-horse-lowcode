export declare interface DynamicNode {
    /**
     * 节点ID
     */
    id: string,
    /**
     * 层级
     */
    zIndex?: number,
    /**
     * 节点的宽度
     */
    width: number,
    /**
     * 节点的高度
     */
    height: number,
    /**
     * 节点的left位置
     */
    left: number,
    /**
     * 节点的Top位置
     */
    top: number,
    /**
     * 节点名称
     */
    name: string,
    /**
     * 节点类型
     */
    type?: string,
    /**
     * 节点属性
     */
    properties?: any,
    /**
     * 子节点
     */
    children?: DynamicNode[]
}
