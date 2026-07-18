<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { IotAlarmCenter, IotDeviceTopology, IotRealtimeChart } from "@/components/iot";
import { SAMPLE_ALARMS, SAMPLE_DEVICES, SAMPLE_METRICS } from "@/components/iot";
import type { IotDevice } from "@/components/iot";

const activeTab = ref("topology");

const handleSelectDevice = (device: IotDevice | null) => {
    if (device) {
        ElMessage.success(`已选中：${device.name}`);
    }
};
</script>

<template>
    <div class="demo-container">
        <h3>IoT 监控 IotMonitoring</h3>
        <p>
            物联网设备监控模块，提供基于 SVG 的设备拓扑可视化（自动树形布局、状态着色、悬停详情）、告警中心（级别筛选、确认/解决、统计摘要）、以及基于 Canvas 的实时多线时序图表（自动滑动窗口、可配置刷新间隔）。纯浏览器 API 实现，无第三方图表库依赖。
        </p>
        <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
            <el-tab-pane label="设备拓扑" name="topology">
                <iot-device-topology
                    :devices="SAMPLE_DEVICES"
                    :height="420"
                    @select="handleSelectDevice"
                />
            </el-tab-pane>
            <el-tab-pane label="告警中心" name="alarm">
                <iot-alarm-center :alarms="SAMPLE_ALARMS" :height="420" />
            </el-tab-pane>
            <el-tab-pane label="实时图表" name="chart">
                <iot-realtime-chart
                    :series="SAMPLE_METRICS"
                    :config="{ title: '环境监测', unit: '', refreshInterval: 1500, windowSize: 30 }"
                    :height="420"
                />
            </el-tab-pane>
        </el-tabs>
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
.demo-tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.demo-tabs :deep(.el-tabs__content) {
    flex: 1;
    overflow: auto;
}
.demo-tabs :deep(.el-tab-pane) {
    height: 100%;
}
</style>
