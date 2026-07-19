<script setup lang="ts">
import {ref} from "vue";
import {DiagramDesigner} from "@/components/diagram";
import type {DiagramData} from "@/components/diagram";

const diagramData = ref<DiagramData>({
  id: "demo_diagram",
  name: "流程图示例",
  nodes: [
    {
      id: "n1",
      type: "flow-start",
      shape: "roundedRect",
      text: "开始",
      x: 80,
      y: 80,
      width: 100,
      height: 40,
      style: {fill: "#52C41A", stroke: "#389E0D", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold"},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
    {
      id: "n2",
      type: "flow-process",
      shape: "rect",
      text: "数据校验",
      x: 260,
      y: 80,
      width: 120,
      height: 50,
      style: {fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
    {
      id: "n3",
      type: "flow-decision",
      shape: "diamond",
      text: "是否通过?",
      x: 460,
      y: 70,
      width: 120,
      height: 80,
      style: {fill: "#FAAD14", stroke: "#D48806", textColor: "#FFFFFF", fontSize: 13},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
    {
      id: "n4",
      type: "flow-process",
      shape: "rect",
      text: "业务处理",
      x: 660,
      y: 80,
      width: 120,
      height: 50,
      style: {fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
    {
      id: "n5",
      type: "flow-end",
      shape: "roundedRect",
      text: "结束",
      x: 860,
      y: 80,
      width: 100,
      height: 40,
      style: {fill: "#F5222D", stroke: "#CF1322", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold"},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
    {
      id: "n6",
      type: "flow-io",
      shape: "parallelogram",
      text: "错误记录",
      x: 460,
      y: 220,
      width: 120,
      height: 50,
      style: {fill: "#13C2C2", stroke: "#08979C", textColor: "#FFFFFF", fontSize: 13},
      ports: [
        {id: "top", position: "top", input: true, output: true},
        {id: "right", position: "right", input: true, output: true},
        {id: "bottom", position: "bottom", input: true, output: true},
        {id: "left", position: "left", input: true, output: true},
      ],
    },
  ],
  edges: [
    {id: "e1", source: "n1", sourcePort: "right", target: "n2", targetPort: "left", type: "orthogonal"},
    {id: "e2", source: "n2", sourcePort: "right", target: "n3", targetPort: "left", type: "orthogonal"},
    {id: "e3", source: "n3", sourcePort: "right", target: "n4", targetPort: "left", type: "orthogonal", label: "是"},
    {id: "e4", source: "n4", sourcePort: "right", target: "n5", targetPort: "left", type: "orthogonal"},
    {id: "e5", source: "n3", sourcePort: "bottom", target: "n6", targetPort: "top", type: "orthogonal", label: "否"},
  ],
  layers: [
    {
      id: "layer_1",
      name: "默认图层",
      visible: true,
      locked: false,
      nodeIds: ["n1", "n2", "n3", "n4", "n5", "n6"],
      edgeIds: ["e1", "e2", "e3", "e4", "e5"],
    },
  ],
  activeLayerId: "layer_1",
  canvas: {
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    gridSize: 10,
    snap: true,
    snapThreshold: 5,
    backgroundColor: "#FFFFFF",
    width: 0,
    height: 0,
  },
});
</script>

<template>
  <div class="demo-container">
    <h3>流程图设计器 DiagramDesigner</h3>
    <p>基于 SVG 自研的图编辑器，支持节点拖拽、连线、属性编辑。可用于流程设计、ER
      图、架构图等场景。左侧为节点面板，中间为画布，右侧为属性面板。</p>
    <div class="demo-canvas">
      <DiagramDesigner :initial-diagram="diagramData"/>
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
  flex:1;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  height: 600px;
}
</style>
