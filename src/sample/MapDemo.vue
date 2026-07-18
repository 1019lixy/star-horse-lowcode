<script setup lang="ts">
import { ref } from "vue";
import { MapField, MapTrackPlayer, MapHeatmap } from "@/components/map";
import type { MapBounds, TrackData, HeatPoint } from "@/components/map";

const activeTab = ref("field");

const beijingBounds: MapBounds = [116.0, 39.5, 116.8, 40.2];

const fieldValue = ref("116.407400,39.904200");

const tracks: TrackData[] = [
    {
        id: "track_1",
        name: "配送车辆轨迹 - 京A12345",
        color: "#409EFF",
        traveledColor: "#67C23A",
        points: [
            { lng: 116.18, lat: 39.62, time: Date.parse("2026-07-18T08:00:00"), speed: 35 },
            { lng: 116.24, lat: 39.68, time: Date.parse("2026-07-18T08:20:00"), speed: 42 },
            { lng: 116.30, lat: 39.73, time: Date.parse("2026-07-18T08:40:00"), speed: 38 },
            { lng: 116.36, lat: 39.78, time: Date.parse("2026-07-18T09:00:00"), speed: 45 },
            { lng: 116.40, lat: 39.82, time: Date.parse("2026-07-18T09:20:00"), speed: 30 },
            { lng: 116.44, lat: 39.86, time: Date.parse("2026-07-18T09:40:00"), speed: 28 },
            { lng: 116.48, lat: 39.90, time: Date.parse("2026-07-18T10:00:00"), speed: 50 },
            { lng: 116.52, lat: 39.94, time: Date.parse("2026-07-18T10:20:00"), speed: 36 },
            { lng: 116.56, lat: 39.98, time: Date.parse("2026-07-18T10:40:00"), speed: 40 },
            { lng: 116.60, lat: 40.05, time: Date.parse("2026-07-18T11:00:00"), speed: 32 },
        ],
    },
];

const heatPoints: HeatPoint[] = [
    { lng: 116.20, lat: 39.65, weight: 0.3 },
    { lng: 116.25, lat: 39.70, weight: 0.5 },
    { lng: 116.30, lat: 39.75, weight: 0.8 },
    { lng: 116.35, lat: 39.78, weight: 0.6 },
    { lng: 116.38, lat: 39.80, weight: 0.9 },
    { lng: 116.40, lat: 39.82, weight: 1.0 },
    { lng: 116.42, lat: 39.85, weight: 0.7 },
    { lng: 116.45, lat: 39.88, weight: 0.85 },
    { lng: 116.48, lat: 39.90, weight: 0.95 },
    { lng: 116.50, lat: 39.92, weight: 0.65 },
    { lng: 116.52, lat: 39.95, weight: 0.55 },
    { lng: 116.55, lat: 39.98, weight: 0.4 },
    { lng: 116.58, lat: 40.00, weight: 0.75 },
    { lng: 116.60, lat: 40.05, weight: 0.5 },
    { lng: 116.22, lat: 39.85, weight: 0.45 },
    { lng: 116.28, lat: 39.90, weight: 0.6 },
    { lng: 116.33, lat: 39.93, weight: 0.7 },
    { lng: 116.46, lat: 39.75, weight: 0.35 },
    { lng: 116.50, lat: 39.80, weight: 0.5 },
    { lng: 116.15, lat: 39.75, weight: 0.25 },
];
</script>

<template>
    <div class="demo-container">
        <h3>地图 GIS 组件 MapField / MapTrackPlayer / MapHeatmap</h3>
        <p>基于 SVG/Canvas 自研的轻量级地图 GIS 组件套件，无需依赖第三方地图 SDK。包含坐标选点、轨迹回放、热力图三大组件，以北京区域（[116.0, 39.5, 116.8, 40.2]）为例展示。</p>

        <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
            <el-tab-pane label="坐标选点 MapField" name="field" class="h-full">
                <p class="tab-desc">点击地图选取坐标点，或点击“选点”按钮在弹窗中精确选择。</p>
                <MapField v-model="fieldValue" :bounds="beijingBounds" :height="380" />
            </el-tab-pane>

            <el-tab-pane label="轨迹回放 MapTrackPlayer" name="track" class="h-full">
                <p class="tab-desc">配送车辆 10 个轨迹点的回放演示，支持播放/暂停/停止、进度拖拽、倍速切换。</p>
                <MapTrackPlayer :tracks="tracks" :bounds="beijingBounds" :height="380" />
            </el-tab-pane>

            <el-tab-pane label="热力图 MapHeatmap" name="heatmap" class="h-full">
                <p class="tab-desc">北京区域 20 个热力点分布，支持半径与强度调节、网格聚合。</p>
                <MapHeatmap :points="heatPoints" :bounds="beijingBounds" :height="380" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.demo-container {
    padding: 16px;
    height: 100%;
    overflow: auto;
}
.demo-tabs {
    height: 620px;
    display: flex;
    flex-direction: column;
}
.demo-tabs :deep(.el-tabs__content) {
    flex: 1;
    overflow: auto;
}
.tab-desc {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
}
</style>
