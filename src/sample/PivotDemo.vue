<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { PivotTable } from "@/components/pivot";
import type { PivotData } from "@/components/pivot";
import ShDemoToolbar from "./components/ShDemoToolbar.vue";
import type { ShDemoAction } from "./components/demoTypes";
import { useElementHeight } from "./components/useElementHeight";

const buildSamplePivot = (): PivotData => ({
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

const pivotData = ref<PivotData>(buildSamplePivot());
const pivotRef = ref();

const { containerRef, height } = useElementHeight();

const actions: ShDemoAction[] = [
    {
        key: "loadSample",
        labelKey: "demo.action.loadSample",
        tooltipKey: "demo.action.loadSampleTip",
        icon: "fileAdd",
        group: "data",
    },
    {
        key: "dataManager",
        labelKey: "demo.action.dataManager",
        tooltipKey: "demo.action.dataManagerTip",
        icon: "database",
        group: "data",
    },
    {
        key: "clear",
        labelKey: "demo.action.clear",
        tooltipKey: "demo.action.clearTip",
        icon: "delete",
        group: "data",
    },
    {
        key: "exportJson",
        labelKey: "demo.action.exportJson",
        tooltipKey: "demo.action.exportJsonTip",
        icon: "export",
        group: "data",
    },
];

const handleAction = (key: string) => {
    switch (key) {
        case "loadSample":
            pivotData.value = buildSamplePivot();
            ElMessage.success("已加载示例数据");
            break;
        case "dataManager":
            pivotRef.value?.openDataManager();
            break;
        case "clear":
            pivotData.value = {
                name: "空透视表",
                records: [],
                fields: [],
                config: {
                    rows: [], columns: [], values: [], filters: [], sorts: [],
                    showTotal: true, showRowSubtotal: true, showColSubtotal: true,
                    numberFormat: "#,##0",
                },
            };
            ElMessage.success("已清空");
            break;
        case "exportJson": {
            const blob = new Blob([JSON.stringify(pivotData.value, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${pivotData.value.name || "pivot"}.json`;
            a.click();
            URL.revokeObjectURL(url);
            ElMessage.success("已导出 JSON");
            break;
        }
    }
};
</script>

<template>
    <div class="demo-page" ref="containerRef">
        <ShDemoToolbar
            :actions="actions"
            title-key="demo.title.pivot"
            @action="handleAction"
        />
        <div class="demo-stage" :style="{ height: `${height}px` }">
            <PivotTable
                ref="pivotRef"
                :initial-pivot="pivotData"
                @save="(d) => { pivotData = d; ElMessage.success('已保存'); }"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.demo-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: var(--el-bg-color-page);
}

.demo-stage {
    flex: 1;
    overflow: hidden;
    padding: 8px;
}
</style>
