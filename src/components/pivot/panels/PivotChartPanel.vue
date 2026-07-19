<script setup lang="ts" name="PivotChartPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import { computePivotChart } from "../PivotEngine";
import { PIVOT_CHART_COLORS, PIVOT_CHART_TYPE_PRESETS } from "../constants";

const props = defineProps<{
    designer: PivotDesigner;
}>();

const result = computed(() =>
    computePivotChart(
        props.designer.state.records,
        props.designer.state.fields,
        props.designer.state.config,
        props.designer.selectedChartType.value,
    ),
);

/** 计算 SVG 尺寸 */
const chartWidth = computed(() => 800);
const chartHeight = computed(() => 360);
const padding = { top: 30, right: 30, bottom: 60, left: 60 };

/** 计算最大值 */
const maxValue = computed(() => {
    let max = 0;
    for (const s of result.value.series) {
        for (const v of s.data) {
            if (v && v > max) max = v;
        }
    }
    return max || 1;
});

/** 柱状图柱子宽度 */
const barWidth = computed(() => {
    const total = result.value.categories.length;
    if (total === 0) return 0;
    const inner = chartWidth.value - padding.left - padding.right;
    const groupWidth = inner / total;
    return Math.max(2, Math.min(40, (groupWidth * 0.7) / Math.max(1, result.value.series.length)));
});

/** 计算柱子 X 坐标 */
const getBarX = (catIdx: number, seriesIdx: number) => {
    const total = result.value.categories.length;
    const inner = chartWidth.value - padding.left - padding.right;
    const groupWidth = inner / total;
    const groupStart = padding.left + groupWidth * catIdx;
    return groupStart + (groupWidth - barWidth.value * result.value.series.length) / 2 + barWidth.value * seriesIdx;
};

/** 计算 Y 坐标 */
const getBarY = (val: number | null) => {
    const inner = chartHeight.value - padding.top - padding.bottom;
    if (val === null) return padding.top + inner;
    return padding.top + inner - (val / maxValue.value) * inner;
};

/** 折线点坐标 */
const linePoints = computed(() =>
    result.value.series.map((s) =>
        s.data
            .map((v, idx) => {
                const total = result.value.categories.length;
                const inner = chartWidth.value - padding.left - padding.right;
                const x = padding.left + (inner / Math.max(1, total - 1)) * idx;
                const y = v === null ? null : getBarY(v);
                return y === null ? null : `${x},${y}`;
            })
            .filter(Boolean)
            .join(" "),
    ),
);

/** 饼图数据 */
const pieData = computed(() => {
    const totals = result.value.categories.map((cat, idx) => ({
        name: cat,
        value: result.value.series.reduce((sum, s) => sum + (s.data[idx] ?? 0), 0),
    }));
    const total = totals.reduce((sum, d) => sum + d.value, 0) || 1;
    let accAngle = 0;
    return totals.map((d) => {
        const angle = (d.value / total) * Math.PI * 2;
        const startAngle = accAngle;
        accAngle += angle;
        const cx = chartWidth.value / 2;
        const cy = chartHeight.value / 2;
        const r = Math.min(chartWidth.value, chartHeight.value) / 3;
        const x1 = cx + r * Math.sin(startAngle);
        const y1 = cy - r * Math.cos(startAngle);
        const x2 = cx + r * Math.sin(accAngle);
        const y2 = cy - r * Math.cos(accAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        return {
            name: d.name,
            value: d.value,
            path: `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`,
            color: PIVOT_CHART_COLORS[totals.indexOf(d) % PIVOT_CHART_COLORS.length],
        };
    });
});

/** Y 轴刻度 */
const yAxisTicks = computed(() => {
    const ticks: { y: number; label: string }[] = [];
    const step = 5;
    for (let i = 0; i <= step; i++) {
        const value = (maxValue.value * i) / step;
        ticks.push({
            y: getBarY(value),
            label: Math.round(value).toLocaleString(),
        });
    }
    return ticks;
});
</script>

<template>
    <div class="pivot-chart-panel">
        <div class="chart-toolbar">
            <el-radio-group
                :model-value="designer.selectedChartType.value"

                @update:model-value="(v) => designer.setChartType(v as any)"
            >
                <el-radio-button
                    v-for="opt in PIVOT_CHART_TYPE_PRESETS"
                    :key="opt.value"
                    :value="opt.value"
                >
                    {{ opt.label }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <div class="chart-container">
            <svg :width="chartWidth" :height="chartHeight" v-if="result.categories.length > 0">
                <!-- 柱状图 -->
                <template v-if="designer.selectedChartType.value === 'bar'">
                    <!-- Y 轴 -->
                    <g class="axis-y">
                        <line
                            :x1="padding.left"
                            :y1="padding.top"
                            :x2="padding.left"
                            :y2="chartHeight - padding.bottom"
                            stroke="#999"
                        />
                        <g v-for="(tick, idx) in yAxisTicks" :key="idx">
                            <line
                                :x1="padding.left"
                                :y1="tick.y"
                                :x2="chartWidth - padding.right"
                                :y2="tick.y"
                                stroke="#eee"
                                stroke-dasharray="4,4"
                            />
                            <text :x="padding.left - 8" :y="tick.y + 4" text-anchor="end" font-size="11" fill="#666">
                                {{ tick.label }}
                            </text>
                        </g>
                    </g>
                    <!-- 柱子 -->
                    <g v-for="(series, sIdx) in result.series" :key="sIdx">
                        <rect
                            v-for="(val, cIdx) in series.data"
                            :key="cIdx"
                            :x="getBarX(cIdx, sIdx)"
                            :y="getBarY(val)"
                            :width="barWidth - 2"
                            :height="(chartHeight - padding.bottom) - getBarY(val)"
                            :fill="PIVOT_CHART_COLORS[sIdx % PIVOT_CHART_COLORS.length]"
                        />
                    </g>
                    <!-- X 轴标签 -->
                    <g class="axis-x">
                        <line
                            :x1="padding.left"
                            :y1="chartHeight - padding.bottom"
                            :x2="chartWidth - padding.right"
                            :y2="chartHeight - padding.bottom"
                            stroke="#999"
                        />
                        <text
                            v-for="(cat, idx) in result.categories"
                            :key="idx"
                            :x="padding.left + ((chartWidth - padding.left - padding.right) / Math.max(1, result.categories.length)) * (idx + 0.5)"
                            :y="chartHeight - padding.bottom + 16"
                            text-anchor="middle"
                            font-size="11"
                            fill="#666"
                        >
                            {{ cat.length > 8 ? cat.slice(0, 8) + "..." : cat }}
                        </text>
                    </g>
                </template>

                <!-- 折线图/面积图 -->
                <template v-else-if="['line', 'area'].includes(designer.selectedChartType.value)">
                    <g class="axis-y">
                        <line :x1="padding.left" :y1="padding.top" :x2="padding.left" :y2="chartHeight - padding.bottom" stroke="#999"/>
                        <g v-for="(tick, idx) in yAxisTicks" :key="idx">
                            <line :x1="padding.left" :y1="tick.y" :x2="chartWidth - padding.right" :y2="tick.y" stroke="#eee" stroke-dasharray="4,4"/>
                            <text :x="padding.left - 8" :y="tick.y + 4" text-anchor="end" font-size="11" fill="#666">{{ tick.label }}</text>
                        </g>
                    </g>
                    <g v-for="(points, sIdx) in linePoints" :key="sIdx">
                        <path
                            v-if="designer.selectedChartType.value === 'area'"
                            :d="`M ${padding.left},${chartHeight - padding.bottom} L ${points} L ${chartWidth - padding.right},${chartHeight - padding.bottom} Z`"
                            :fill="PIVOT_CHART_COLORS[sIdx % PIVOT_CHART_COLORS.length]"
                            fill-opacity="0.3"
                        />
                        <polyline
                            :points="points"
                            fill="none"
                            :stroke="PIVOT_CHART_COLORS[sIdx % PIVOT_CHART_COLORS.length]"
                            stroke-width="2"
                        />
                    </g>
                    <g class="axis-x">
                        <text
                            v-for="(cat, idx) in result.categories"
                            :key="idx"
                            :x="padding.left + ((chartWidth - padding.left - padding.right) / Math.max(1, result.categories.length - 1)) * idx"
                            :y="chartHeight - padding.bottom + 16"
                            text-anchor="middle"
                            font-size="11"
                            fill="#666"
                        >{{ cat.length > 8 ? cat.slice(0, 8) + "..." : cat }}</text>
                    </g>
                </template>

                <!-- 饼图 -->
                <template v-else-if="designer.selectedChartType.value === 'pie'">
                    <g v-for="(slice, idx) in pieData" :key="idx">
                        <path :d="slice.path" :fill="slice.color" stroke="#FFFFFF" stroke-width="1"/>
                        <text
                            :x="chartWidth / 2"
                            :y="chartHeight / 2"
                            text-anchor="middle"
                            font-size="11"
                            fill="#666"
                            v-if="idx === 0"
                        >{{ slice.name }}</text>
                    </g>
                    <!-- 图例 -->
                    <g class="legend">
                        <g v-for="(slice, idx) in pieData" :key="idx" :transform="`translate(${chartWidth - 100}, ${20 + idx * 18})`">
                            <rect width="12" height="12" :fill="slice.color"/>
                            <text x="16" y="10" font-size="11" fill="#666">{{ slice.name }}: {{ slice.value }}</text>
                        </g>
                    </g>
                </template>

                <!-- 其他图表类型占位 -->
                <template v-else>
                    <text :x="chartWidth / 2" :y="chartHeight / 2" text-anchor="middle" fill="#999">
                        {{ i18n("pivot.chart.unsupported") }}
                    </text>
                </template>

                <!-- 图例（非饼图） -->
                <g class="legend" v-if="designer.selectedChartType.value !== 'pie' && result.series.length > 1">
                    <g v-for="(s, idx) in result.series" :key="idx" :transform="`translate(${padding.left + idx * 120}, 10)`">
                        <rect width="12" height="12" :fill="PIVOT_CHART_COLORS[idx % PIVOT_CHART_COLORS.length]"/>
                        <text x="16" y="10" font-size="11" fill="#666">{{ s.name }}</text>
                    </g>
                </g>
            </svg>
            <div v-else class="chart-empty">
                <el-empty :description="i18n('pivot.empty.noData')"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pivot-chart-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--el-bg-color);

    .chart-toolbar {
        padding: 8px;
        border-bottom: 1px solid var(--el-border-color);
    }

    .chart-container {
        flex: 1;
        overflow: auto;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            background: var(--el-bg-color);
        }
    }

    .chart-empty {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
