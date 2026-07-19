import type { Component } from "vue";

/**
 * ShDemoToolbar 声明式按钮定义
 *
 * 用于 16 个高级组件 Demo 的统一工具栏。
 * 每个 Demo 在自己的 constants.ts 中定义 ACTIONS / SECONDARY_ACTIONS 数组，
 * 传入 ShDemoToolbar 即可渲染。
 */
export interface ShDemoAction {
    /** 唯一 key，触发 action 事件回传 */
    key: string;
    /** Element Plus 图标组件（@element-plus/icons-vue） */
    icon?: Component;
    /** 主标签 i18n key（iconOnly 时可省略） */
    labelKey?: string;
    /** tooltip i18n key（iconOnly 时必填） */
    tooltipKey?: string;
    type?: "default" | "primary" | "success" | "warning" | "danger";
    disabled?: boolean;
    /** toggle 类按钮激活态（初始值，响应式切换由 Demo.vue 通过 computed 控制） */
    active?: boolean;
    /** 纯图标按钮（强制要求 tooltipKey） */
    iconOnly?: boolean;
    /** 该按钮前插入 el-divider direction="vertical" */
    dividerBefore?: boolean;
    /** 同 group 字符串归入同一 el-button-group */
    group?: string;
}

/**
 * ShDemoToolbar Props
 */
export interface ShDemoToolbarProps {
    /** 标题 i18n key */
    titleKey?: string;
    /** 主操作按钮组（左侧） */
    actions?: ShDemoAction[];
    /** 次要操作按钮组（右侧 margin-left:auto） */
    secondaryActions?: ShDemoAction[];
    /** 模块 key，用于调试 */
    module?: string;
}

/**
 * 按钮分组结果（供 ShDemoToolbar 内部使用）
 */
export interface ShDemoActionGroup {
    /** 组名（同 group 字段的按钮归入同一 el-button-group） */
    group?: string;
    /** 该组的按钮列表 */
    items: ShDemoAction[];
}

/**
 * 将 ShDemoAction[] 按 group 字段分组
 *
 * 分组规则：
 *  - 相邻且 group 相同的按钮归入同一组
 *  - group 为 undefined 的按钮独立成组（不包 el-button-group）
 *  - dividerBefore: true 强制开启新组
 */
export const groupActions = (actions: ShDemoAction[]): ShDemoActionGroup[] => {
    const groups: ShDemoActionGroup[] = [];
    let current: ShDemoActionGroup | null = null;
    for (const action of actions) {
        const needNewGroup =
            !current || current.group !== action.group || action.dividerBefore;
        if (needNewGroup) {
            current = { group: action.group, items: [] };
            groups.push(current);
        }
        current.items.push(action);
    }
    return groups;
};
