import {
    Check,
    Delete,
    Download,
    FolderOpened,
    Calendar,
    Warning,
    FullScreen,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { GanttData } from "@/components/gantt";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 甘特图 Demo 示例数据
 *
 * 7 个任务（需求调研/方案设计/UI设计/后端开发/前端开发/联调测试/上线发布）+ 7 条依赖。
 */
export const SAMPLE_GANTT: GanttData = {
    name: "产品研发项目计划",
    tasks: [
        { id: "t1", name: "需求调研", parentId: null, order: 0, level: 0, startDate: "2026-07-01", endDate: "2026-07-10", progress: 100, assignee: "张三", status: "completed", priority: "high", workHours: 40 },
        { id: "t2", name: "方案设计", parentId: null, order: 1, level: 0, startDate: "2026-07-11", endDate: "2026-07-20", progress: 80, assignee: "李四", status: "inProgress", priority: "high", workHours: 56 },
        { id: "t3", name: "UI 设计", parentId: null, order: 2, level: 0, startDate: "2026-07-15", endDate: "2026-07-25", progress: 60, assignee: "王五", status: "inProgress", priority: "medium", workHours: 48 },
        { id: "t4", name: "后端开发", parentId: null, order: 3, level: 0, startDate: "2026-07-21", endDate: "2026-08-10", progress: 35, assignee: "赵六", status: "inProgress", priority: "urgent", workHours: 120 },
        { id: "t5", name: "前端开发", parentId: null, order: 4, level: 0, startDate: "2026-07-26", endDate: "2026-08-15", progress: 20, assignee: "孙七", status: "inProgress", priority: "high", workHours: 112 },
        { id: "t6", name: "联调测试", parentId: null, order: 5, level: 0, startDate: "2026-08-16", endDate: "2026-08-25", progress: 0, assignee: "周八", status: "pending", priority: "high", workHours: 60 },
        { id: "t7", name: "上线发布", parentId: null, order: 6, level: 0, startDate: "2026-08-26", endDate: "2026-08-26", progress: 0, assignee: "吴九", status: "pending", priority: "urgent", isMilestone: true },
    ],
    links: [
        { id: "l1", source: "t1", target: "t2", type: "finishToStart" },
        { id: "l2", source: "t2", target: "t3", type: "finishToStart" },
        { id: "l3", source: "t2", target: "t4", type: "finishToStart" },
        { id: "l4", source: "t3", target: "t5", type: "finishToStart" },
        { id: "l5", source: "t4", target: "t6", type: "finishToStart" },
        { id: "l6", source: "t5", target: "t6", type: "finishToStart" },
        { id: "l7", source: "t6", target: "t7", type: "finishToStart" },
    ],
    config: {
        timeUnit: "day",
        projectStart: "2026-07-01",
        projectEnd: "2026-08-31",
        dayWidth: 40,
        rowHeight: 36,
        showWeekend: true,
        showToday: true,
        showGrid: true,
        showProgress: true,
        showLinks: true,
        showCritical: false,
        weekStart: 1,
    },
};

/**
 * GanttDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 GanttToolbar 的任务编辑/依赖连线等功能。
 */
export const GANTT_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.gantt.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.gantt.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.gantt.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.gantt.toolbar.save", type: "primary" },
];

/**
 * GanttDemo 次要操作（右侧）
 */
export const GANTT_SECONDARY: ShDemoAction[] = [
    { key: "toggleWeekend", icon: Calendar, tooltipKey: "advanced.gantt.toolbar.toggleWeekend", iconOnly: true, active: true },
    { key: "toggleCritical", icon: Warning, tooltipKey: "advanced.gantt.toolbar.toggleCritical", iconOnly: true },
    { key: "fitView", icon: FullScreen, tooltipKey: "advanced.gantt.toolbar.fitView", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.gantt.toolbar.help", iconOnly: true },
];
