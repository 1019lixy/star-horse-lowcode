<script setup lang="ts">
/**
 * 数字孪生 Demo - 工厂场景
 *
 * 1 个厂房（立方体）+ 3 个储罐（圆柱）+ 2 个设备（立方体）+ 地面（平面）+ 1 个点缀球体
 * 不同实体有不同状态（部分正常、部分警告、部分报警）
 * 实时数据模拟（温度/压力/转速每秒更新）
 */
import { ref } from "vue";
import { DigitalTwinViewer } from "@/components/digitaltwin";
import type { DtScene } from "@/components/digitaltwin";

/** 工厂场景 */
const scene = ref<DtScene>({
    id: "dt_factory_demo",
    name: "工厂场景",
    entities: [
        // 地面（平面）
        {
            id: "dt_ground",
            type: "plane",
            name: "工厂地面",
            position: { x: 0, y: 0, z: 0 },
            size: { width: 500, height: 0, depth: 500, radius: 0 },
            color: "#D9D9D9",
            status: "normal",
            properties: {},
            sensorData: {},
            visible: true,
        },
        // 厂房（立方体）- 正常
        {
            id: "dt_factory",
            type: "cube",
            name: "主厂房",
            position: { x: -120, y: 0, z: -80 },
            size: { width: 160, height: 100, depth: 120, radius: 0 },
            color: "#1890FF",
            status: "normal",
            properties: { area: "1200㎡" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 45 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 1500 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1200 },
            },
            visible: true,
        },
        // 设备 A（立方体）- 警告
        {
            id: "dt_device_a",
            type: "cube",
            name: "设备 A",
            position: { x: 80, y: 0, z: 60 },
            size: { width: 50, height: 60, depth: 50, radius: 0 },
            color: "#FAAD14",
            status: "warning",
            properties: { model: "DEV-A001" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 72 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 2400 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1800 },
            },
            visible: true,
        },
        // 设备 B（立方体）- 报警
        {
            id: "dt_device_b",
            type: "cube",
            name: "设备 B",
            position: { x: 160, y: 0, z: 60 },
            size: { width: 50, height: 60, depth: 50, radius: 0 },
            color: "#F5222D",
            status: "alarm",
            properties: { model: "DEV-B002" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 88 },
                speed: { labelKey: "digitaltwin.property.metric.speed", unitKey: "digitaltwin.property.unit.rpm", value: 2900 },
                power: { labelKey: "digitaltwin.property.metric.power", unitKey: "digitaltwin.property.unit.watt", value: 1950 },
            },
            visible: true,
        },
        // 储罐 1（圆柱）- 正常
        {
            id: "dt_tank_1",
            type: "cylinder",
            name: "储罐 1",
            position: { x: -180, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#52C41A",
            status: "normal",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 220 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 88 },
            },
            visible: true,
        },
        // 储罐 2（圆柱）- 警告
        {
            id: "dt_tank_2",
            type: "cylinder",
            name: "储罐 2",
            position: { x: -100, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#FAAD14",
            status: "warning",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 380 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 72 },
            },
            visible: true,
        },
        // 储罐 3（圆柱）- 离线
        {
            id: "dt_tank_3",
            type: "cylinder",
            name: "储罐 3",
            position: { x: -20, y: 0, z: 100 },
            size: { width: 0, height: 90, depth: 0, radius: 30 },
            color: "#722ED1",
            status: "offline",
            properties: { capacity: "50m³" },
            sensorData: {
                pressure: { labelKey: "digitaltwin.property.metric.pressure", unitKey: "digitaltwin.property.unit.pascal", value: 0 },
                efficiency: { labelKey: "digitaltwin.property.metric.efficiency", unitKey: "digitaltwin.property.unit.percent", value: 0 },
            },
            visible: true,
        },
        // 点缀球体 - 正常
        {
            id: "dt_decoration",
            type: "sphere",
            name: "监测球",
            position: { x: 200, y: 120, z: -100 },
            size: { width: 0, height: 0, depth: 0, radius: 20 },
            color: "#13C2C2",
            status: "normal",
            properties: { type: "环境监测" },
            sensorData: {
                temperature: { labelKey: "digitaltwin.property.metric.temperature", unitKey: "digitaltwin.property.unit.celsius", value: 28 },
            },
            visible: true,
        },
    ],
});

const handleSelectEntity = (id: string | null) => {
    // eslint-disable-next-line no-console
    console.log("selected entity:", id);
};
</script>

<template>
    <div class="demo-container">
        <DigitalTwinViewer
            :scene="scene"
            :auto-sim="true"
            @select-entity="handleSelectEntity"
        />
    </div>
</template>

<style scoped>
.demo-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
