import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import SampleLayout from "@/sample/SampleLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/test",
    name: "test",
    component: () => import("@/sample/test.vue"),
    props: true,
    meta: { title: "测试", keepAlive: "N" },
  },
  {
    path: "/test2",
    name: "test2",
    component: () => import("@/sample/NormalFormValidNoCalc.vue"),
    props: true,
    meta: { title: "测试", keepAlive: "N" },
  },
  {
    path: "/",
    component: SampleLayout,
    redirect: "/container/cron-task",
    children: [
      // ========== 容器控制验证 ==========
      {
        path: "/container",
        name: "container-group",
        meta: { title: "容器控制验证", icon: "box" },
        children: [
          {
            path: "/container/cron-task",
            name: "cron-task",
            component: () => import("@/sample/CronTaskUiDemo.vue"),
            meta: { title: "Tab容器控制" },
          },
          {
            path: "/container/collapse",
            name: "collapse-container",
            component: () => import("@/sample/CollapseContainerDemo.vue"),
            meta: { title: "Collapse容器控制" },
          },
          {
            path: "/container/card",
            name: "card-container",
            component: () => import("@/sample/CardContainerDemo.vue"),
            meta: { title: "Card容器控制" },
          },
          {
            path: "/container/splitter",
            name: "splitter-container",
            component: () => import("@/sample/SplitterContainerDemo.vue"),
            meta: { title: "Splitter容器控制" },
          },
        ],
      },
      // ========== 表单验证 ==========
      {
        path: "/form",
        name: "form-group",
        meta: { title: "表单验证", icon: "document" },
        children: [
          {
            path: "/form/normal",
            name: "normal-form",
            component: () => import("@/sample/NormalFormValid.vue"),
            meta: { title: "正常表单" },
          },
          {
            path: "/form/complex",
            name: "complex-form",
            component: () => import("@/sample/ComplexFormValid.vue"),
            meta: { title: "复杂表单验证" },
          },
          {
            path: "/form/analysis",
            name: "form-analysis",
            component: () => import("@/sample/ComplexFormAnalysis.vue"),
            meta: { title: "复杂表单分析" },
          },
          {
            path: "/form/relation",
            name: "form-relation",
            component: () => import("@/sample/FormRelationOperation.vue"),
            meta: { title: "表单联动操作" },
          },
          {
            path: "/form/dialog-relation",
            name: "dialog-relation",
            component: () => import("@/sample/ValidDialogFormRelation.vue"),
            meta: { title: "弹窗表单联动" },
          },
          {
            path: "/form/valid-relation",
            name: "valid-relation",
            component: () => import("@/sample/ValidRelation.vue"),
            meta: { title: "联动验证" },
          },
          {
            path: "/form/multi-same-tab",
            name: "multi-same-tab",
            component: () => import("@/sample/ValidMulitSameFormTab.vue"),
            meta: { title: "多相同表单Tab" },
          },
          {
            path: "/form/style",
            name: "form-style",
            component: () => import("@/sample/ValidStyle.vue"),
            meta: { title: "样式验证" },
          },
          {
            path: "/form/dialog",
            name: "form-dialog",
            component: () => import("@/sample/DialogValid.vue"),
            meta: { title: "弹窗验证" },
          },
          {
            path: "/form/rule-engine",
            name: "rule-engine-demo",
            component: () => import("@/sample/RuleEngineDemo.vue"),
            meta: { title: "规则引擎验证" },
          },
        ],
      },
      // ========== 动态表格/容器 ==========
      {
        path: "/dytable",
        name: "dytable-group",
        meta: { title: "动态表格/容器", icon: "grid" },
        children: [
          {
            path: "/dytable/instance",
            name: "dytable-instance",
            component: () =>
              import("@/sample/DytableContainerInstanceValid.vue"),
            meta: { title: "动态列表实例" },
          },
          {
            path: "/dytable/view",
            name: "dytable-view",
            component: () => import("@/sample/DytableContainerViewValid.vue"),
            meta: { title: "动态列表视图" },
          },
          {
            path: "/dytable/box-instance",
            name: "box-instance",
            component: () => import("@/sample/BoxContainerInstanceDemo.vue"),
            meta: { title: "动态Box实例" },
          },
          {
            path: "/dytable/box-view",
            name: "box-view",
            component: () => import("@/sample/BoxContainerViewDemo.vue"),
            meta: { title: "动态Box视图" },
          },
        ],
      },
      // ========== 组件测试 ==========
      {
        path: "/component",
        name: "component-group",
        meta: { title: "组件测试", icon: "setting" },
        children: [
          {
            path: "/component/tester",
            name: "component-tester",
            component: () => import("@/sample/ComponentTester.vue"),
            meta: { title: "组件测试器" },
          },
          {
            path: "/component/advanced",
            name: "advanced-components",
            component: () => import("@/sample/AdvancedComponentsDemo.vue"),
            meta: { title: "高级组件库" },
          },
          {
            path: "/component/datapicker",
            name: "datapicker-demo",
            component: () => import("@/sample/DataPickerDemo.vue"),
            meta: { title: "数据选择器" },
          },
          {
            path: "/component/select",
            name: "select-item",
            component: () => import("@/sample/SelectItem.vue"),
            meta: { title: "选择器组件" },
          },
          {
            path: "/component/transfer",
            name: "transfer-item",
            component: () => import("@/sample/TransferItem.vue"),
            meta: { title: "穿梭框组件" },
          },
          {
            path: "/component/dialog",
            name: "dialog-item",
            component: () => import("@/sample/DialogItem.vue"),
            meta: { title: "弹窗组件" },
          },
          {
            path: "/component/image-preview",
            name: "image-preview",
            component: () => import("@/sample/ImagePreviewTest.vue"),
            meta: { title: "图片预览" },
          },
          {
            path: "/component/barcode",
            name: "barcode-test",
            component: () => import("@/sample/BarcodeTest.vue"),
            meta: { title: "条形码测试" },
          },
          {
            path: "/component/signature",
            name: "signature-test",
            component: () => import("@/sample/SignatureTest.vue"),
            meta: { title: "签名测试" },
          },
          {
            path: "/component/signature-new",
            name: "signature-new",
            component: () => import("@/sample/SignatureTestNew.vue"),
            meta: { title: "签名测试(新)" },
          },
          {
            path: "/component/web-url",
            name: "web-url",
            component: () => import("@/sample/WebUrlComp.vue"),
            meta: { title: "WebUrl组件" },
          },
        ],
      },
      // ========== 编辑器 ==========
      {
        path: "/editor",
        name: "editor-group",
        meta: { title: "编辑器", icon: "edit" },
        children: [
          {
            path: "/editor/code",
            name: "code-editor",
            component: () => import("@/sample/CodeEditorTest.vue"),
            meta: { title: "代码编辑器" },
          },
          {
            path: "/editor/code-diff",
            name: "code-diff-editor",
            component: () => import("@/sample/CodeDiffEditorTest.vue"),
            meta: { title: "代码对比" },
          },
          {
            path: "/editor/editor",
            name: "editor-test",
            component: () => import("@/sample/EditorTest.vue"),
            meta: { title: "编辑器测试" },
          },
          {
            path: "/editor/json",
            name: "json-editor",
            component: () => import("@/sample/JsonEditor.vue"),
            meta: { title: "JSON编辑器" },
          },
          {
            path: "/editor/rich-text",
            name: "rich-text",
            component: () => import("@/sample/RichTextDemo.vue"),
            meta: { title: "富文本" },
          },
        ],
      },
      // ========== 高级功能 ==========
      {
        path: "/advanced",
        name: "advanced-group",
        meta: { title: "高级功能", icon: "star" },
        children: [
          {
            path: "/advanced/digital-twin",
            name: "digital-twin",
            component: () => import("@/sample/DigitalTwinDemo.vue"),
            meta: { title: "数字孪生" },
          },
          {
            path: "/advanced/pivot",
            name: "pivot-demo",
            component: () => import("@/sample/PivotDemo.vue"),
            meta: { title: "透视分析" },
          },
          {
            path: "/advanced/schedule",
            name: "schedule-demo",
            component: () => import("@/sample/ScheduleDemo.vue"),
            meta: { title: "排程" },
          },
          {
            path: "/advanced/gantt",
            name: "gantt-demo",
            component: () => import("@/sample/GanttDemo.vue"),
            meta: { title: "甘特图" },
          },
          {
            path: "/advanced/diagram",
            name: "diagram-demo",
            component: () => import("@/sample/DiagramDemo.vue"),
            meta: { title: "流程图" },
          },
          {
            path: "/advanced/whiteboard",
            name: "whiteboard-demo",
            component: () => import("@/sample/WhiteboardDemo.vue"),
            meta: { title: "白板" },
          },
          {
            path: "/advanced/pdf",
            name: "pdf-demo",
            component: () => import("@/sample/PdfDemo.vue"),
            meta: { title: "PDF设计器" },
          },
          {
            path: "/advanced/office",
            name: "office-demo",
            component: () => import("@/sample/OfficeDemo.vue"),
            meta: { title: "Office" },
          },
          {
            path: "/advanced/knowledge-graph",
            name: "knowledge-graph",
            component: () => import("@/sample/KnowledgeGraphDemo.vue"),
            meta: { title: "知识图谱" },
          },
          {
            path: "/advanced/iot",
            name: "iot-demo",
            component: () => import("@/sample/IotDemo.vue"),
            meta: { title: "IoT" },
          },
          {
            path: "/advanced/etl",
            name: "etl-demo",
            component: () => import("@/sample/EtlDemo.vue"),
            meta: { title: "ETL" },
          },
          {
            path: "/advanced/email-template",
            name: "email-template",
            component: () => import("@/sample/EmailTemplateDemo.vue"),
            meta: { title: "邮件模板" },
          },
          {
            path: "/advanced/doc-template",
            name: "doc-template",
            component: () => import("@/sample/DocTemplateDemo.vue"),
            meta: { title: "文档模板" },
          },
          {
            path: "/advanced/api-orchestrator",
            name: "api-orchestrator",
            component: () => import("@/sample/ApiOrchestratorDemo.vue"),
            meta: { title: "API编排" },
          },
          {
            path: "/advanced/ai-copilot",
            name: "ai-copilot",
            component: () => import("@/sample/AiCopilotDemo.vue"),
            meta: { title: "AI助手" },
          },
          {
            path: "/advanced/speak",
            name: "speak-demo",
            component: () => import("@/sample/SpeakDemo.vue"),
            meta: { title: "语音" },
          },
          {
            path: "/advanced/map",
            name: "map-demo",
            component: () => import("@/sample/MapDemo.vue"),
            meta: { title: "地图" },
          },
          {
            path: "/advanced/kanban",
            name: "kanban-demo",
            component: () => import("@/sample/KanbanDemo.vue"),
            meta: { title: "看板" },
          },
          {
            path: "/advanced/dashboard",
            name: "dashboard-demo",
            component: () => import("@/sample/Dashboard.vue"),
            meta: { title: "仪表盘" },
          },
        ],
      },
      // ========== 其他 ==========
      {
        path: "/misc",
        name: "misc-group",
        meta: { title: "其他", icon: "more" },
        children: [
          {
            path: "/misc/lang",
            name: "lang-test",
            component: () => import("@/sample/LangTest.vue"),
            meta: { title: "国际化" },
          },
          {
            path: "/misc/informations",
            name: "informations",
            component: () => import("@/sample/InformationsUi.vue"),
            meta: { title: "信息管理" },
          },
          {
            path: "/misc/draggable",
            name: "draggable-valid",
            component: () => import("@/sample/StarHorseDraggableValid.vue"),
            meta: { title: "拖拽验证" },
          },
        ],
      },

      // ========== 动态表单实例 ==========
      {
        path: "/general/page/:param",
        name: "NormalPage",
        component: () => import("@/sample/commonpage/NormalPage.vue"),
        props: true,
        meta: { title: "动态表单实例", keepAlive: "N" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "404" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
