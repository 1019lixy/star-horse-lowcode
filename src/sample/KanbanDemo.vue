<script setup lang="ts">
import {ref} from "vue";
import type {KanbanData} from "@/components/kanban";
import {KanbanBoard} from "@/components/kanban";

const kanbanData = ref<KanbanData>({
  name: "敏捷开发看板",
  columns: [
    {
      id: "col_todo",
      name: "待办",
      color: "#909399",
      order: 0,
      wipLimit: {enabled: false, max: 10, strategy: "warn"},
      removable: true,
    },
    {
      id: "col_doing",
      name: "进行中",
      color: "#409EFF",
      order: 1,
      wipLimit: {enabled: true, max: 5, strategy: "warn"},
      removable: true,
    },
    {
      id: "col_testing",
      name: "测试中",
      color: "#E6A23C",
      order: 2,
      wipLimit: {enabled: false, max: 5, strategy: "warn"},
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
        {text: "前端", color: "#409EFF"},
        {text: "P0", color: "#F56C6C"},
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
      labels: [{text: "后端", color: "#67C23A"}],
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
        {text: "后端", color: "#67C23A"},
        {text: "核心", color: "#9C27B0"},
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
      labels: [{text: "前端", color: "#409EFF"}],
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
      labels: [{text: "测试", color: "#E6A23C"}],
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
      labels: [{text: "设计", color: "#9C27B0"}],
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
      labels: [{text: "文档", color: "#909399"}],
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
});
const saveData = (data: any) => {
  console.log(data);
};
</script>

<template>
  <div class="demo-container">
    <h3>看板 KanbanBoard</h3>
    <p>敏捷开发看板组件，支持多列卡片流转、WIP
      限制、拖拽排序、优先级、标签、负责人等。适用于任务管理、需求流转、状态跟踪等场景。</p>
    <div class="demo-canvas">
      <KanbanBoard :initial-kanban="kanbanData" @save="saveData"/>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

.demo-canvas {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  flex: 1;
}
</style>
