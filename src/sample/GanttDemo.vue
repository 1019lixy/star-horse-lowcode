<script setup lang="ts">
import { ref } from "vue";
import type { GanttData } from "@/components/gantt";
import { GanttChart } from "@/components/gantt";

const ganttData = ref<GanttData>({
  name: "产品研发项目计划",
  tasks: [
    {
      id: "t1",
      name: "需求调研",
      parentId: null,
      order: 0,
      level: 0,
      startDate: "2026-07-01",
      endDate: "2026-07-10",
      progress: 100,
      assignee: "张三",
      status: "completed",
      priority: "high",
      workHours: 40,
    },
    {
      id: "t2",
      name: "方案设计",
      parentId: null,
      order: 1,
      level: 0,
      startDate: "2026-07-11",
      endDate: "2026-07-20",
      progress: 80,
      assignee: "李四",
      status: "inProgress",
      priority: "high",
      workHours: 56,
    },
    {
      id: "t3",
      name: "UI 设计",
      parentId: null,
      order: 2,
      level: 0,
      startDate: "2026-07-15",
      endDate: "2026-07-25",
      progress: 60,
      assignee: "王五",
      status: "inProgress",
      priority: "medium",
      workHours: 48,
    },
    {
      id: "t4",
      name: "后端开发",
      parentId: null,
      order: 3,
      level: 0,
      startDate: "2026-07-21",
      endDate: "2026-08-10",
      progress: 35,
      assignee: "赵六",
      status: "inProgress",
      priority: "urgent",
      workHours: 120,
    },
    {
      id: "t5",
      name: "前端开发",
      parentId: null,
      order: 4,
      level: 0,
      startDate: "2026-07-26",
      endDate: "2026-08-15",
      progress: 20,
      assignee: "孙七",
      status: "inProgress",
      priority: "high",
      workHours: 112,
    },
    {
      id: "t6",
      name: "联调测试",
      parentId: null,
      order: 5,
      level: 0,
      startDate: "2026-08-16",
      endDate: "2026-08-25",
      progress: 0,
      assignee: "周八",
      status: "pending",
      priority: "high",
      workHours: 60,
    },
    {
      id: "t7",
      name: "上线发布",
      parentId: null,
      order: 6,
      level: 0,
      startDate: "2026-08-26",
      endDate: "2026-08-26",
      progress: 0,
      assignee: "吴九",
      status: "pending",
      priority: "urgent",
      isMilestone: true,
    },
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
});
</script>

<template>
  <div class="demo-container">
    <h3>甘特图 GanttChart</h3>
    <p>
      项目管理甘特图组件，支持任务 WBS
      树形结构、依赖关系连线、进度展示、里程碑、关键路径等。左侧为任务列表，中间为时间轴条形图，右侧为属性面板。
    </p>
    <div class="demo-canvas">
      <GanttChart :initial-gantt="ganttData" />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.demo-canvas {
  flex: 1;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  height: 620px;
}
</style>
