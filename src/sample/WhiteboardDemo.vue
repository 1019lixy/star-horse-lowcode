<script setup lang="ts">
import { ref } from "vue";
import type { WhiteboardElement } from "@/components/whiteboard";
import { Whiteboard } from "@/components/whiteboard";

/**
 * 演示场景：流程图示例
 * 开始 → 处理 → 判断 → 结束
 * 包含 2 个矩形 + 1 个圆形 + 1 条箭头 + 2 个文本框 + 1 条手绘曲线
 */
const initialElements = ref<WhiteboardElement[]>([
  // 1. 矩形：开始节点
  {
    id: "wb_demo_rect_1",
    type: "shape",
    shape: "rect",
    x: 80,
    y: 80,
    width: 140,
    height: 60,
    stroke: "#52C41A",
    fill: "#F6FFED",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "开始",
  } as WhiteboardElement,
  // 2. 矩形：处理节点
  {
    id: "wb_demo_rect_2",
    type: "shape",
    shape: "rect",
    x: 320,
    y: 80,
    width: 160,
    height: 60,
    stroke: "#1890FF",
    fill: "#E6F7FF",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "处理",
  } as WhiteboardElement,
  // 3. 圆形：判断节点
  {
    id: "wb_demo_circle_1",
    type: "shape",
    shape: "circle",
    x: 580,
    y: 60,
    width: 100,
    height: 100,
    stroke: "#FAAD14",
    fill: "#FFF7E6",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "判断",
  } as WhiteboardElement,
  // 4. 箭头：从开始指向处理
  {
    id: "wb_demo_arrow_1",
    type: "line",
    arrow: true,
    x1: 220,
    y1: 110,
    x2: 320,
    y2: 110,
    stroke: "#333333",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "箭头1",
  } as WhiteboardElement,
  // 5. 文本框：开始标签
  {
    id: "wb_demo_text_1",
    type: "text",
    x: 110,
    y: 95,
    width: 80,
    height: 30,
    text: "开始",
    fontSize: 16,
    color: "#389E0D",
    fontWeight: "bold",
    textAlign: "center",
    opacity: 1,
    visible: true,
    name: "文本1",
  } as WhiteboardElement,
  // 6. 文本框：处理标签
  {
    id: "wb_demo_text_2",
    type: "text",
    x: 350,
    y: 95,
    width: 100,
    height: 30,
    text: "业务处理",
    fontSize: 16,
    color: "#096DD9",
    fontWeight: "bold",
    textAlign: "center",
    opacity: 1,
    visible: true,
    name: "文本2",
  } as WhiteboardElement,
  // 7. 手绘曲线：装饰性路径
  {
    id: "wb_demo_pen_1",
    type: "pen",
    points: [
      { x: 80, y: 240 },
      { x: 100, y: 230 },
      { x: 130, y: 250 },
      { x: 170, y: 220 },
      { x: 220, y: 260 },
      { x: 280, y: 230 },
      { x: 340, y: 250 },
      { x: 400, y: 220 },
      { x: 460, y: 260 },
      { x: 520, y: 230 },
      { x: 580, y: 250 },
      { x: 640, y: 220 },
    ],
    stroke: "#722ED1",
    strokeWidth: 3,
    opacity: 0.8,
    visible: true,
    name: "手绘曲线",
  } as WhiteboardElement,
  // 第二条箭头：处理 → 判断
  {
    id: "wb_demo_arrow_2",
    type: "line",
    arrow: true,
    x1: 480,
    y1: 110,
    x2: 580,
    y2: 110,
    stroke: "#333333",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "箭头2",
  } as WhiteboardElement,
  // 第三条箭头：判断 → 结束（向下方）
  {
    id: "wb_demo_arrow_3",
    type: "line",
    arrow: true,
    x1: 630,
    y1: 160,
    x2: 630,
    y2: 320,
    stroke: "#333333",
    strokeWidth: 2,
    opacity: 1,
    visible: true,
    name: "箭头3",
  } as WhiteboardElement,
  // 文本：判断标签
  {
    id: "wb_demo_text_3",
    type: "text",
    x: 600,
    y: 95,
    width: 60,
    height: 30,
    text: "判断?",
    fontSize: 14,
    color: "#D48806",
    fontWeight: "bold",
    textAlign: "center",
    opacity: 1,
    visible: true,
    name: "文本3",
  } as WhiteboardElement,
  // 文本：结束标签
  {
    id: "wb_demo_text_4",
    type: "text",
    x: 595,
    y: 320,
    width: 80,
    height: 30,
    text: "结束",
    fontSize: 16,
    color: "#CF1322",
    fontWeight: "bold",
    textAlign: "center",
    opacity: 1,
    visible: true,
    name: "文本4",
  } as WhiteboardElement,
]);

const handleChange = (els: WhiteboardElement[]) => {
  // 可在此处持久化元素
  // console.log("elements changed", els.length);
};
</script>

<template>
  <div class="demo-container">
    <h3>{{ "白板组件 Whiteboard" }}</h3>
    <p>
      基于 SVG
      的协作风格白板组件，支持画笔、橡皮擦、形状（矩形/圆形/三角形/菱形/箭头）、直线、文本、
      图层管理、撤销/重做、滚轮缩放、空格平移、框选、双击编辑文本、导出
      PNG/SVG/JSON。 预置了一个"开始 → 处理 → 判断 → 结束"的流程图示例。
    </p>
    <div class="demo-canvas">
      <Whiteboard :elements="initialElements" @change="handleChange" />
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
  height: 600px;
}
</style>
