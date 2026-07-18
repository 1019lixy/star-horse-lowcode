<script setup lang="ts">
import { ref } from "vue";
import DiagramDemo from "./DiagramDemo.vue";
import GanttDemo from "./GanttDemo.vue";
import KanbanDemo from "./KanbanDemo.vue";
import ScheduleDemo from "./ScheduleDemo.vue";
import PivotDemo from "./PivotDemo.vue";
import PdfDemo from "./PdfDemo.vue";
import RichTextDemo from "./RichTextDemo.vue";
import DocTemplateDemo from "./DocTemplateDemo.vue";
import EmailTemplateDemo from "./EmailTemplateDemo.vue";
import MapDemo from "./MapDemo.vue";
import EtlDemo from "./EtlDemo.vue";
import ApiOrchestratorDemo from "./ApiOrchestratorDemo.vue";
import IotDemo from "./IotDemo.vue";
import OfficeDemo from "./OfficeDemo.vue";
import WhiteboardDemo from "./WhiteboardDemo.vue";
import KnowledgeGraphDemo from "./KnowledgeGraphDemo.vue";
import DigitalTwinDemo from "./DigitalTwinDemo.vue";
import AiCopilotDemo from "./AiCopilotDemo.vue";

const activeTab = ref("diagram");

const tabs = [
    { label: "流程图", name: "diagram", component: DiagramDemo },
    { label: "甘特图", name: "gantt", component: GanttDemo },
    { label: "看板", name: "kanban", component: KanbanDemo },
    { label: "调度视图", name: "schedule", component: ScheduleDemo },
    { label: "透视分析", name: "pivot", component: PivotDemo },
    { label: "PDF模板", name: "pdf", component: PdfDemo },
    { label: "协同富文本", name: "richtext", component: RichTextDemo },
    { label: "文档模板", name: "doctemplate", component: DocTemplateDemo },
    { label: "邮件模板", name: "emailtemplate", component: EmailTemplateDemo },
    { label: "地图GIS", name: "map", component: MapDemo },
    { label: "ETL管道", name: "etl", component: EtlDemo },
    { label: "API编排", name: "api", component: ApiOrchestratorDemo },
    { label: "IoT监控", name: "iot", component: IotDemo },
    { label: "Office编辑", name: "office", component: OfficeDemo },
    { label: "白板", name: "whiteboard", component: WhiteboardDemo },
    { label: "知识图谱", name: "knowledgegraph", component: KnowledgeGraphDemo },
    { label: "数字孪生", name: "digitaltwin", component: DigitalTwinDemo },
    { label: "AI助手", name: "aicopilot", component: AiCopilotDemo },
];
</script>

<template>
    <div class="advanced-components-demo">
        <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
            <el-tab-pane
                v-for="tab in tabs"
                :key="tab.name"
                :label="tab.label"
                :name="tab.name"
                class="h-full"
            >
                <component :is="tab.component" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.advanced-components-demo {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
.demo-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.demo-tabs :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
}
.demo-tabs :deep(.el-tab-pane) {
    height: 100%;
}
</style>
