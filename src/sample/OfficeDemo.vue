<script setup lang="ts">
import { OfficeEditor } from "@/components/office";
import { createOfficeDoc, createSlide, createSlideElement } from "@/components/office";
import type { OfficeDocument } from "@/components/office";

/** 示例 Word 文档 1（普通） */
const wordDoc1 = createOfficeDoc({
    name: "示例 Word 文档",
    type: "word",
    wordContent: {
        html: `
<h1>欢迎使用 Office 文档编辑器</h1>
<p>这是一个基于 <b>Vue 3 + TypeScript</b> 的纯前端 Office 文档编辑组件。</p>
<h2>主要特性</h2>
<ul>
    <li>Word：富文本编辑（<i>粗体</i>、<u>下划线</u>、颜色、对齐等）</li>
    <li>Excel：单元格编辑、行列管理、公式求值</li>
    <li>PowerPoint：SVG 幻灯片编辑、元素拖拽</li>
</ul>
<h3>使用说明</h3>
<p>点击工具栏的"新建"按钮，或在左侧列表选择一个文档开始编辑。</p>
<blockquote>提示：可使用撤销/重做按钮回溯修改。</blockquote>
`,
    },
});

/** 示例 Word 文档 2（含表格） */
const wordDoc2 = createOfficeDoc({
    name: "Word 表格示例",
    type: "word",
    wordContent: {
        html: `
<h2>季度销售报表</h2>
<p>下表展示了四个季度的销售数据：</p>
<table style="border-collapse:collapse;width:100%;">
    <tr><th style="border:1px solid #ddd;padding:6px;">季度</th><th style="border:1px solid #ddd;padding:6px;">销售额</th><th style="border:1px solid #ddd;padding:6px;">增长率</th></tr>
    <tr><td style="border:1px solid #ddd;padding:6px;">Q1</td><td style="border:1px solid #ddd;padding:6px;">¥1,200,000</td><td style="border:1px solid #ddd;padding:6px;">+5%</td></tr>
    <tr><td style="border:1px solid #ddd;padding:6px;">Q2</td><td style="border:1px solid #ddd;padding:6px;">¥1,580,000</td><td style="border:1px solid #ddd;padding:6px;">+31.7%</td></tr>
    <tr><td style="border:1px solid #ddd;padding:6px;">Q3</td><td style="border:1px solid #ddd;padding:6px;">¥1,420,000</td><td style="border:1px solid #ddd;padding:6px;">-10.1%</td></tr>
    <tr><td style="border:1px solid #ddd;padding:6px;">Q4</td><td style="border:1px solid #ddd;padding:6px;">¥1,860,000</td><td style="border:1px solid #ddd;padding:6px;">+31%</td></tr>
</table>
<p><b>总计：</b> ¥6,060,000</p>
`,
    },
});

/** 示例 Excel 文档（5×5 含 SUM/AVG/MIN/MAX 公式） */
const excelDoc = createOfficeDoc({
    name: "Excel 公式示例",
    type: "excel",
    excelContent: {
        sheets: [
            {
                id: "sheet_demo_1",
                name: "Sales",
                rows: 5,
                cols: 5,
                cells: [
                    { row: 0, col: 0, value: "产品" },
                    { row: 0, col: 1, value: "Q1" },
                    { row: 0, col: 2, value: "Q2" },
                    { row: 0, col: 3, value: "Q3" },
                    { row: 0, col: 4, value: "Q4" },
                    { row: 1, col: 0, value: "产品A" },
                    { row: 1, col: 1, value: "120" },
                    { row: 1, col: 2, value: "158" },
                    { row: 1, col: 3, value: "142" },
                    { row: 1, col: 4, value: "186" },
                    { row: 2, col: 0, value: "产品B" },
                    { row: 2, col: 1, value: "98" },
                    { row: 2, col: 2, value: "112" },
                    { row: 2, col: 3, value: "135" },
                    { row: 2, col: 4, value: "148" },
                    { row: 3, col: 0, value: "产品C" },
                    { row: 3, col: 1, value: "210" },
                    { row: 3, col: 2, value: "195" },
                    { row: 3, col: 3, value: "228" },
                    { row: 3, col: 4, value: "245" },
                    { row: 4, col: 0, value: "总计" },
                    { row: 4, col: 1, value: "=SUM(B2:B4)", isFormula: true, display: "" },
                    { row: 4, col: 2, value: "=SUM(C2:C4)", isFormula: true, display: "" },
                    { row: 4, col: 3, value: "=SUM(D2:D4)", isFormula: true, display: "" },
                    { row: 4, col: 4, value: "=AVG(E2:E4)", isFormula: true, display: "" },
                ],
            },
        ],
        activeSheetId: "sheet_demo_1",
    },
});

/** 示例 PPT 文档（3 张幻灯片） */
const slideDoc = createOfficeDoc({
    name: "PPT 演示示例",
    type: "slide",
    slideContent: {
        slides: [
            createSlide([
                createSlideElement("text", {
                    text: "Office 演示文稿",
                    x: 200,
                    y: 200,
                    width: 560,
                    height: 80,
                    fontSize: 48,
                    color: "#409EFF",
                }),
                createSlideElement("shape", {
                    shape: "rect",
                    x: 200,
                    y: 320,
                    width: 560,
                    height: 8,
                    fill: "#409EFF",
                }),
                createSlideElement("text", {
                    text: "基于 SVG 的幻灯片编辑器",
                    x: 240,
                    y: 360,
                    width: 480,
                    height: 40,
                    fontSize: 24,
                    color: "#666666",
                }),
            ]),
            createSlide([
                createSlideElement("text", {
                    text: "核心功能",
                    x: 80,
                    y: 60,
                    width: 400,
                    height: 60,
                    fontSize: 36,
                    color: "#333333",
                }),
                createSlideElement("shape", { shape: "rect", x: 80, y: 180, width: 240, height: 120, fill: "#409EFF" }),
                createSlideElement("shape", { shape: "circle", x: 360, y: 180, width: 120, height: 120, fill: "#67C23A" }),
                createSlideElement("shape", { shape: "triangle", x: 520, y: 180, width: 120, height: 120, fill: "#E6A23C" }),
                createSlideElement("shape", { shape: "arrow", x: 700, y: 200, width: 180, height: 80, fill: "#F56C6C" }),
                createSlideElement("text", {
                    text: "矩形、圆形、三角形、箭头四种形状",
                    x: 80,
                    y: 360,
                    width: 600,
                    height: 40,
                    fontSize: 20,
                    color: "#666666",
                }),
            ]),
            createSlide([
                createSlideElement("text", {
                    text: "Thank You",
                    x: 320,
                    y: 220,
                    width: 320,
                    height: 80,
                    fontSize: 64,
                    color: "#333333",
                }),
                createSlideElement("shape", { shape: "circle", x: 380, y: 340, width: 200, height: 200, fill: "#409EFF" }),
                createSlideElement("text", {
                    text: "Q & A",
                    x: 420,
                    y: 410,
                    width: 120,
                    height: 50,
                    fontSize: 36,
                    color: "#FFFFFF",
                }),
            ]),
        ],
        canvasWidth: 960,
        canvasHeight: 540,
    },
});

const docs: OfficeDocument[] = [wordDoc1, wordDoc2, excelDoc, slideDoc];
</script>

<template>
    <div class="demo-container">
        <h3>Office 文档编辑 OfficeEditor</h3>
        <p>
            纯前端 Office 文档编辑组件，支持 Word 富文本编辑（粗体/斜体/下划线/标题/列表/对齐/字体/字号/颜色/表格/图片）、Excel 表格编辑（行列管理/单元格合并/SUM/AVG/MIN/MAX/COUNT 公式）、PowerPoint 幻灯片编辑（SVG 元素拖拽/形状/文本/图片）。所有实现基于浏览器原生 API，无重依赖。
        </p>
        <office-editor :documents="docs" :height="640"/>
    </div>
</template>

<style scoped>
.demo-container {
    padding: 16px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.demo-container h3 {
    margin: 0 0 4px;
}
.demo-container p {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
}
</style>
