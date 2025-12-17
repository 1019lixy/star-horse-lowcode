import {SelectOption} from "@/components/types/SearchProps";

/**
 * 组件属性
 */
export interface ItemType {
    /**
     * 名称
     */
    label: string;
    /**
     * 字段名
     */
    fieldName: string;
    /**
     * 字段类型
     */
    fieldType?: string;
    /**
     * 是否必填
     */
    required?: boolean;
    /**
     * 分类
     */
    category: 1 | 2 | 3 | 4;
    /**
     * 备选值
     */
    selectValues?: SelectOption[] | string | number;
    /**
     * 默认值
     */
    defaultValues?: any;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 帮助
     */
    helpMsg?: string;
    /**
     * 配置参数
     */
    configParams?: Array<any>;
}

/**
 * 组件操作
 */
export interface CompAction {

    /**
     * 操作图标
     */
    actionIcon?: string;
    /**
     * 事件名称
     */
    label: string;
    /**
     * 事件编码
     */
    actionName: string;
    /**
     * 组件类型
     */
    fieldType: string;
    funcCode?: Function | string;
}

/**
 * 组件类型
 */
export interface CompType {
    /**
     * 组件名称
     */
    itemName: string;
    /**
     * 组件类型
     */
    itemType: string;
    /**
     * 组件图标
     */
    itemIcon: string;
    /**
     * 组件分类
     */
    category: number;
    /**
     * 组件备注
     */
    remark?: string;
    /**
     * 基础属性
     */
    fields: ItemType[];
    /**
     * 高级属性
     */
    advancedFields: ItemType[];
    /**
     * 自定义属性
     */
    selfFields: ItemType[];
    /**
     * 组件操作
     */
    actions: CompAction[];
    /**
     * 组件属性
     */
    preps: ItemType[];
}
