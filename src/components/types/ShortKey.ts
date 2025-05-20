export type ShortKey = {
    /**
     * 快捷键
     */
    key: string,
    /**
     * 动作名称
     */
    action: string,
    /**
     * 是否需要alt 键组合
     */
    alt?: boolean,
    /**
     * 是否需要ctrl 键组合
     */
    ctrl?: boolean,
    /**
     * 是否需要shift 键组合
     */
    shift?: boolean,
    /**
     * 其他键
     */
    other?: Array<string> | string,
    /**
     * 处理函数
     */
    handler?: Function
};
