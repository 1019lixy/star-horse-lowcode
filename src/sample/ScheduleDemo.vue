<script setup lang="ts">
import { ref } from "vue";
import { ScheduleView } from "@/components/schedule";
import type { ScheduleData } from "@/components/schedule";

const scheduleData = ref<ScheduleData>({
    name: "团队资源调度视图",
    resources: [
        {
            id: "r1",
            name: "张三",
            type: "person",
            color: "#409EFF",
            order: 0,
            enabled: true,
            workingHours: ["09:00-12:00", "13:00-18:00"],
        },
        {
            id: "r2",
            name: "李四",
            type: "person",
            color: "#67C23A",
            order: 1,
            enabled: true,
            workingHours: ["09:00-12:00", "13:00-18:00"],
        },
        {
            id: "r3",
            name: "王五",
            type: "person",
            color: "#E6A23C",
            order: 2,
            enabled: true,
            workingHours: ["10:00-12:00", "14:00-19:00"],
        },
        {
            id: "r4",
            name: "会议室 A",
            type: "room",
            color: "#9C27B0",
            order: 3,
            enabled: true,
            workingHours: ["08:00-20:00"],
        },
    ],
    events: [
        {
            id: "ev1",
            title: "晨会同步",
            description: "每日站会，同步昨日进度与今日计划",
            resourceId: "r1",
            startTime: "2026-07-18T09:00:00",
            endTime: "2026-07-18T09:30:00",
            type: "meeting",
            color: "#409EFF",
            location: "会议室 A",
            attendees: ["张三", "李四", "王五"],
        },
        {
            id: "ev2",
            title: "需求评审",
            resourceId: "r1",
            startTime: "2026-07-18T10:00:00",
            endTime: "2026-07-18T11:30:00",
            type: "meeting",
            color: "#409EFF",
            location: "会议室 A",
        },
        {
            id: "ev3",
            title: "方案设计",
            description: "数据库表结构设计",
            resourceId: "r1",
            startTime: "2026-07-18T13:00:00",
            endTime: "2026-07-18T17:00:00",
            type: "task",
            color: "#67C23A",
        },
        {
            id: "ev4",
            title: "代码开发",
            description: "用户模块接口实现",
            resourceId: "r2",
            startTime: "2026-07-18T09:30:00",
            endTime: "2026-07-18T12:00:00",
            type: "task",
            color: "#67C23A",
        },
        {
            id: "ev5",
            title: "联调测试",
            resourceId: "r2",
            startTime: "2026-07-18T14:00:00",
            endTime: "2026-07-18T16:00:00",
            type: "task",
            color: "#67C23A",
        },
        {
            id: "ev6",
            title: "UI 设计评审",
            resourceId: "r3",
            startTime: "2026-07-18T10:00:00",
            endTime: "2026-07-18T11:00:00",
            type: "meeting",
            color: "#E6A23C",
            location: "会议室 A",
        },
        {
            id: "ev7",
            title: "原型设计",
            resourceId: "r3",
            startTime: "2026-07-18T14:00:00",
            endTime: "2026-07-18T18:00:00",
            type: "task",
            color: "#E6A23C",
        },
        {
            id: "ev8",
            title: "项目周会",
            resourceId: "r4",
            startTime: "2026-07-18T15:00:00",
            endTime: "2026-07-18T16:30:00",
            type: "meeting",
            color: "#9C27B0",
            attendees: ["张三", "李四", "王五"],
        },
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
});
</script>

<template>
    <div class="demo-container">
        <h3>调度视图 ScheduleView</h3>
        <p>资源调度视图组件，支持按人/设备/房间等资源维度进行事件排期，支持日/周/月视图、工作时间、重叠检测等。左侧为资源列表，右侧为时间轴事件区。</p>
        <div class="demo-canvas">
            <ScheduleView :initial-schedule="scheduleData" />
        </div>
    </div>
</template>

<style scoped>
.demo-container {
    padding: 16px;
    height: 100%;
    overflow: auto;
}
.demo-canvas {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;
    height: 620px;
}
</style>
