import {
    Check,
    Back,
    Right,
    View,
    Delete,
    Download,
    Grid,
    FullScreen,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { DiagramData } from "@/components/diagram";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 流程图 Demo 示例数据
 *
 * 包含 6 个节点（开始/数据校验/是否通过/业务处理/结束/错误记录）+ 5 条边。
 * 用于 DiagramDemo.vue 的初始加载与 loadSample 操作。
 */
export const SAMPLE_DIAGRAM: DiagramData = {
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
            style: { fill: "#52C41A", stroke: "#389E0D", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
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
            style: { fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13 },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
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
            style: { fill: "#FAAD14", stroke: "#D48806", textColor: "#FFFFFF", fontSize: 13 },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
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
            style: { fill: "#1890FF", stroke: "#096DD9", textColor: "#FFFFFF", fontSize: 13 },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
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
            style: { fill: "#F5222D", stroke: "#CF1322", textColor: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
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
            style: { fill: "#13C2C2", stroke: "#08979C", textColor: "#FFFFFF", fontSize: 13 },
            ports: [
                { id: "top", position: "top", input: true, output: true },
                { id: "right", position: "right", input: true, output: true },
                { id: "bottom", position: "bottom", input: true, output: true },
                { id: "left", position: "left", input: true, output: true },
            ],
        },
    ],
    edges: [
        { id: "e1", source: "n1", sourcePort: "right", target: "n2", targetPort: "left", type: "orthogonal" },
        { id: "e2", source: "n2", sourcePort: "right", target: "n3", targetPort: "left", type: "orthogonal" },
        { id: "e3", source: "n3", sourcePort: "right", target: "n4", targetPort: "left", type: "orthogonal", label: "是" },
        { id: "e4", source: "n4", sourcePort: "right", target: "n5", targetPort: "left", type: "orthogonal" },
        { id: "e5", source: "n3", sourcePort: "bottom", target: "n6", targetPort: "top", type: "orthogonal", label: "否" },
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
};

/**
 * DiagramDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 DiagramToolbar 的节点拖拽/连线/属性编辑。
 */
export const DIAGRAM_ACTIONS: ShDemoAction[] = [
    { key: "save", icon: Check, labelKey: "advanced.diagram.toolbar.save", type: "primary" },
    { key: "undo", icon: Back, tooltipKey: "advanced.diagram.toolbar.undo", iconOnly: true, group: "history" },
    { key: "redo", icon: Right, tooltipKey: "advanced.diagram.toolbar.redo", iconOnly: true, group: "history" },
    { key: "preview", icon: View, labelKey: "advanced.diagram.toolbar.preview" },
    { key: "clear", icon: Delete, labelKey: "advanced.diagram.toolbar.clear", type: "danger" },
    { key: "exportSvg", icon: Download, tooltipKey: "advanced.diagram.toolbar.exportSvg", iconOnly: true },
];

/**
 * DiagramDemo 次要操作（右侧）
 */
export const DIAGRAM_SECONDARY: ShDemoAction[] = [
    { key: "toggleGrid", icon: Grid, tooltipKey: "advanced.diagram.toolbar.toggleGrid", iconOnly: true, active: true },
    { key: "fitView", icon: FullScreen, tooltipKey: "advanced.diagram.toolbar.fitView", iconOnly: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.diagram.toolbar.help", iconOnly: true },
];
