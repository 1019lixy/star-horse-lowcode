export declare interface DynamicNode {
    /**
     * 节点ID
     */
    id: string;
    /**
     * 节点标签
     */
    label: string;
    /**
     * 节点名称
     */
    name: string;
    /**
     * 节点图标
     */
    icon?: string;
    /**
     * 节点类型
     */
    type?: string;

    /**
     * 节点属性
     */
    preps?: Record<string, any>;
    /**
     * 节点样式
     */
    styles?: Record<string, any>;
    /**
     * 子节点
     */
    children?: DynamicNode[];
}
