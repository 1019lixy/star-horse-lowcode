<script setup lang="ts">
import { ref } from "vue";
import { PivotTable } from "@/components/pivot";
import type { PivotData } from "@/components/pivot";

const pivotData = ref<PivotData>({
    name: "销售数据透视分析",
    records: [
        { region: "华东", product: "产品A", month: "1月", amount: 12500, quantity: 50 },
        { region: "华东", product: "产品A", month: "2月", amount: 15200, quantity: 61 },
        { region: "华东", product: "产品A", month: "3月", amount: 18900, quantity: 75 },
        { region: "华东", product: "产品B", month: "1月", amount: 8800, quantity: 32 },
        { region: "华东", product: "产品B", month: "2月", amount: 9600, quantity: 35 },
        { region: "华东", product: "产品B", month: "3月", amount: 11200, quantity: 41 },
        { region: "华东", product: "产品C", month: "1月", amount: 6300, quantity: 18 },
        { region: "华东", product: "产品C", month: "2月", amount: 7100, quantity: 21 },
        { region: "华东", product: "产品C", month: "3月", amount: 8400, quantity: 24 },
        { region: "华南", product: "产品A", month: "1月", amount: 10800, quantity: 43 },
        { region: "华南", product: "产品A", month: "2月", amount: 13400, quantity: 53 },
        { region: "华南", product: "产品A", month: "3月", amount: 16100, quantity: 64 },
        { region: "华南", product: "产品B", month: "1月", amount: 7200, quantity: 26 },
        { region: "华南", product: "产品B", month: "2月", amount: 8500, quantity: 31 },
        { region: "华南", product: "产品B", month: "3月", amount: 9900, quantity: 36 },
        { region: "华南", product: "产品C", month: "1月", amount: 5400, quantity: 15 },
        { region: "华南", product: "产品C", month: "2月", amount: 6200, quantity: 18 },
        { region: "华南", product: "产品C", month: "3月", amount: 7300, quantity: 21 },
        { region: "华北", product: "产品A", month: "1月", amount: 9600, quantity: 38 },
        { region: "华北", product: "产品A", month: "2月", amount: 11800, quantity: 47 },
        { region: "华北", product: "产品A", month: "3月", amount: 14200, quantity: 56 },
        { region: "华北", product: "产品B", month: "1月", amount: 6500, quantity: 23 },
        { region: "华北", product: "产品B", month: "2月", amount: 7800, quantity: 28 },
        { region: "华北", product: "产品B", month: "3月", amount: 9100, quantity: 33 },
        { region: "华北", product: "产品C", month: "1月", amount: 4800, quantity: 14 },
        { region: "华北", product: "产品C", month: "2月", amount: 5600, quantity: 16 },
        { region: "华北", product: "产品C", month: "3月", amount: 6700, quantity: 19 },
        { region: "西南", product: "产品A", month: "1月", amount: 7400, quantity: 29 },
        { region: "西南", product: "产品B", month: "2月", amount: 5200, quantity: 19 },
        { region: "西南", product: "产品C", month: "3月", amount: 3900, quantity: 11 },
    ],
    fields: [
        { name: "region", label: "区域", type: "string" },
        { name: "product", label: "产品", type: "string" },
        { name: "month", label: "月份", type: "string" },
        { name: "amount", label: "销售额", type: "number", aggregation: "sum", format: "¥#,##0.00" },
        { name: "quantity", label: "销量", type: "number", aggregation: "sum", format: "#,##0" },
    ],
    config: {
        rows: ["region"],
        columns: ["product"],
        values: ["amount"],
        filters: [],
        sorts: [],
        showTotal: true,
        showRowSubtotal: true,
        showColSubtotal: true,
        numberFormat: "¥#,##0.00",
    },
});
</script>

<template>
    <div class="demo-container">
        <h3>透视分析 PivotTable</h3>
        <p>数据透视表组件，支持行/列/值/过滤字段拖拽配置、多种聚合方式（求和/计数/平均/最大/最小）、合计小计、图表展示。示例为销售数据按区域和产品透视销售额。</p>
        <div class="demo-canvas">
            <PivotTable :initial-pivot="pivotData" />
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
