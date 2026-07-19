import {
    Check,
    Delete,
    Download,
    FolderOpened,
    Calendar,
    FullScreen,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { ScheduleData } from "@/components/schedule";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 调度视图 Demo 示例数据
 *
 * 4 个资源（3 人 + 1 会议室）+ 8 个事件（会议/任务）。
 */
export const SAMPLE_SCHEDULE: ScheduleData = {
    name: "团队资源调度视图",
    resources: [
        { id: "r1", name: "张三", type: "person", color: "#409EFF", order: 0, enabled: true, workingHours: ["09:00-12:00", "13:00-18:00"] },
        { id: "r2", name: "李四", type: "person", color: "#67C23A", order: 1, enabled: true, workingHours: ["09:00-12:00", "13:00-18:00"] },
        { id: "r3", name: "王五", type: "person", color: "#E6A23C", order: 2, enabled: true, workingHours: ["10:00-12:00", "14:00-19:00"] },
        { id: "r4", name: "会议室 A", type: "room", color: "#9C27B0", order: 3, enabled: true, workingHours: ["08:00-20:00"] },
    ],
    events: [
        { id: "ev1", title: "晨会同步", description: "每日站会，同步昨日进度与今日计划", resourceId: "r1", startTime: "2026-07-18T09:00:00", endTime: "2026-07-18T09:30:00", type: "meeting", color: "#409EFF", location: "会议室 A", attendees: ["张三", "李四", "王五"] },
        { id: "ev2", title: "需求评审", resourceId: "r1", startTime: "2026-07-18T10:00:00", endTime: "2026-07-18T11:30:00", type: "meeting", color: "#409EFF", location: "会议室 A" },
        { id: "ev3", title: "方案设计", description: "数据库表结构设计", resourceId: "r1", startTime: "2026-07-18T13:00:00", endTime: "2026-07-18T17:00:00", type: "task", color: "#67C23A" },
        { id: "ev4", title: "代码开发", description: "用户模块接口实现", resourceId: "r2", startTime: "2026-07-18T09:30:00", endTime: "2026-07-18T12:00:00", type: "task", color: "#67C23A" },
        { id: "ev5", title: "联调测试", resourceId: "r2", startTime: "2026-07-18T14:00:00", endTime: "2026-07-18T16:00:00", type: "task", color: "#67C23A" },
        { id: "ev6", title: "UI 设计评审", resourceId: "r3", startTime: "2026-07-18T10:00:00", endTime: "2026-07-18T11:00:00", type: "meeting", color: "#E6A23C", location: "会议室 A" },
        { id: "ev7", title: "原型设计", resourceId: "r3", startTime: "2026-07-18T14:00:00", endTime: "2026-07-18T18:00:00", type: "task", color: "#E6A23C" },
        { id: "ev8", title: "项目周会", resourceId: "r4", startTime: "2026-07-18T15:00:00", endTime: "2026-07-18T16:30:00", type: "meeting", color: "#9C27B0", attendees: ["张三", "李四", "王五"] },
    ],
    config: {
        viewMode: "day",
        cellHeight: 30,
        cellWidth: 50,
        dayStartHour: 8,
        dayEndHour: 22,
        showWeekend: true,
        showGrid: true,
        showWorkingHours: true,
        allowOverlap: false,
        timeSlot: 30,
    },
};

/**
 * ScheduleDemo 主操作（左侧）
 */
export const SCHEDULE_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.schedule.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.schedule.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.schedule.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.schedule.toolbar.save", type: "primary" },
];

/**
 * ScheduleDemo 次要操作（右侧）
 */
export const SCHEDULE_SECONDARY: ShDemoAction[] = [
    { key: "toggleWeekend", icon: Calendar, tooltipKey: "advanced.schedule.toolbar.toggleWeekend", iconOnly: true, active: true },
    { key: "fitView", icon: FullScreen, tooltipKey: "advanced.schedule.toolbar.fitView", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.schedule.toolbar.help", iconOnly: true },
];
