import {
    FolderOpened,
    Delete,
    Download,
    Warning,
    Lock,
    DataAnalysis,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { KanbanData } from "@/components/kanban";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 看板 Demo 示例数据
 *
 * 4 列看板（待办/进行中/测试中/已完成）+ 7 张卡片，覆盖 WIP 限制、标签、优先级、负责人等。
 */
export const SAMPLE_KANBAN: KanbanData = {
    name: "敏捷开发看板",
    columns: [
        {
            id: "col_todo",
            name: "待办",
            color: "#909399",
            order: 0,
            wipLimit: { enabled: false, max: 10, strategy: "warn" },
            removable: true,
        },
        {
            id: "col_doing",
            name: "进行中",
            color: "#409EFF",
            order: 1,
            wipLimit: { enabled: true, max: 5, strategy: "warn" },
            removable: true,
        },
        {
            id: "col_testing",
            name: "测试中",
            color: "#E6A23C",
            order: 2,
            wipLimit: { enabled: false, max: 5, strategy: "warn" },
            removable: true,
        },
        {
            id: "col_done",
            name: "已完成",
            color: "#67C23A",
            order: 3,
            isDone: true,
            removable: false,
        },
    ],
    cards: [
        {
            id: "c1",
            title: "用户登录页面开发",
            description: "完成账号密码登录、验证码登录以及第三方登录入口",
            columnId: "col_todo",
            order: 0,
            labels: [
                { text: "前端", color: "#409EFF" },
                { text: "P0", color: "#F56C6C" },
            ],
            assignee: "孙七",
            priority: "high",
            dueDate: "2026-07-25",
            estimate: 16,
            createdAt: "2026-07-10T08:00:00Z",
            updatedAt: "2026-07-10T08:00:00Z",
        },
        {
            id: "c2",
            title: "数据导出功能",
            description: "支持 Excel、CSV 格式导出，包含筛选条件",
            columnId: "col_todo",
            order: 1,
            labels: [{ text: "后端", color: "#67C23A" }],
            assignee: "赵六",
            priority: "medium",
            dueDate: "2026-07-30",
            estimate: 12,
            createdAt: "2026-07-11T08:00:00Z",
            updatedAt: "2026-07-11T08:00:00Z",
        },
        {
            id: "c3",
            title: "权限管理模块",
            description: "基于角色的权限控制 RBAC 实现",
            columnId: "col_doing",
            order: 0,
            labels: [
                { text: "后端", color: "#67C23A" },
                { text: "核心", color: "#9C27B0" },
            ],
            assignee: "赵六",
            priority: "urgent",
            dueDate: "2026-07-22",
            estimate: 24,
            createdAt: "2026-07-05T08:00:00Z",
            updatedAt: "2026-07-15T08:00:00Z",
        },
        {
            id: "c4",
            title: "首页改版",
            description: "Dashboard 数据看板重构",
            columnId: "col_doing",
            order: 1,
            labels: [{ text: "前端", color: "#409EFF" }],
            assignee: "孙七",
            priority: "high",
            dueDate: "2026-07-28",
            estimate: 20,
            createdAt: "2026-07-08T08:00:00Z",
            updatedAt: "2026-07-14T08:00:00Z",
        },
        {
            id: "c5",
            title: "支付流程联调",
            description: "微信、支付宝支付链路联调测试",
            columnId: "col_testing",
            order: 0,
            labels: [{ text: "测试", color: "#E6A23C" }],
            assignee: "周八",
            priority: "urgent",
            dueDate: "2026-07-20",
            estimate: 8,
            createdAt: "2026-07-12T08:00:00Z",
            updatedAt: "2026-07-16T08:00:00Z",
        },
        {
            id: "c6",
            title: "数据库表结构设计",
            description: "核心业务表设计与评审",
            columnId: "col_done",
            order: 0,
            labels: [{ text: "设计", color: "#9C27B0" }],
            assignee: "李四",
            priority: "high",
            dueDate: "2026-07-10",
            completedDate: "2026-07-09",
            estimate: 16,
            createdAt: "2026-06-25T08:00:00Z",
            updatedAt: "2026-07-09T08:00:00Z",
        },
        {
            id: "c7",
            title: "需求文档输出",
            description: "PRD 文档撰写与评审",
            columnId: "col_done",
            order: 1,
            labels: [{ text: "文档", color: "#909399" }],
            assignee: "张三",
            priority: "medium",
            dueDate: "2026-07-08",
            completedDate: "2026-07-07",
            estimate: 12,
            createdAt: "2026-06-20T08:00:00Z",
            updatedAt: "2026-07-07T08:00:00Z",
        },
    ],
    config: {
        cardStyle: "default",
        showAvatar: true,
        showLabels: true,
        showPriority: true,
        showDueDate: true,
        showEstimate: true,
        draggable: true,
        columnWidth: 280,
    },
};

/**
 * KanbanDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 KanbanToolbar 的卡片拖拽/列编辑。
 */
export const KANBAN_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.kanban.toolbar.loadSample" },
    { key: "clear", icon: Delete, labelKey: "advanced.kanban.toolbar.clear", type: "danger" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.kanban.toolbar.exportJson", iconOnly: true },
    { key: "toggleWipLimit", icon: Warning, tooltipKey: "advanced.kanban.toolbar.toggleWipLimit", iconOnly: true, active: true },
    { key: "toggleReadonly", icon: Lock, tooltipKey: "advanced.kanban.toolbar.toggleReadonly", iconOnly: true },
];

/**
 * KanbanDemo 次要操作（右侧）
 */
export const KANBAN_SECONDARY: ShDemoAction[] = [
    { key: "stats", icon: DataAnalysis, tooltipKey: "advanced.kanban.toolbar.stats", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.kanban.toolbar.help", iconOnly: true },
];
