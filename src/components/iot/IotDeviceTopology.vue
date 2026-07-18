<script setup lang="ts" name="IotDeviceTopology">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { useIotTopology } from "./composables/useIotTopology";
import {
    IOT_STATUS_COLORS,
    STATUS_LABELS,
    TOPOLOGY_NODE_HEIGHT,
    TOPOLOGY_NODE_WIDTH,
    computeTopologySize,
    findDevicePreset,
} from "./constants";
import type { IotDevice } from "./types";
import IotDeviceDetailDialog from "./dialogs/IotDeviceDetailDialog.vue";

const props = defineProps<{
    devices?: IotDevice[];
    height?: number;
}>();

const emit = defineEmits<{
    (e: "select", device: IotDevice | null): void;
}>();

const topology = useIotTopology(props.devices ?? []);
const hoverId = ref<string | null>(null);
const detailVisible = ref(false);

const svgHeight = computed(() => props.height ?? 420);
const svgSize = computed(() => computeTopologySize(topology.topologyNodes.value));

/** 节点状态颜色 */
const statusColor = (device: IotDevice) => IOT_STATUS_COLORS[device.status] ?? "#909399";
/** 节点类型颜色 */
const typeColor = (device: IotDevice) => findDevicePreset(device.type)?.color ?? "#409EFF";
/** 节点类型标签 */
const typeLabel = (device: IotDevice) => findDevicePreset(device.type)?.label ?? device.type;
/** 状态标签 */
const statusLabel = (device: IotDevice) => STATUS_LABELS[device.status] ?? device.status;

/** 计算连线路径：父节点底部 -> 子节点顶部（贝塞尔曲线） */
const edgePath = (sourceId: string, targetId: string): string => {
    const src = topology.topologyNodes.value.find((n) => n.device.id === sourceId);
    const tgt = topology.topologyNodes.value.find((n) => n.device.id === targetId);
    if (!src || !tgt) return "";
    const x1 = src.x + TOPOLOGY_NODE_WIDTH / 2;
    const y1 = src.y + TOPOLOGY_NODE_HEIGHT;
    const x2 = tgt.x + TOPOLOGY_NODE_WIDTH / 2;
    const y2 = tgt.y;
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
};

/** 选中或悬停节点 */
const handleNodeClick = (device: IotDevice) => {
    topology.selectDevice(device.id);
    emit("select", device);
};

const handleDetail = (device: IotDevice) => {
    topology.selectDevice(device.id);
    detailVisible.value = true;
};

/** 图例数据 */
const legendItems = computed(() =>
    Object.entries(IOT_STATUS_COLORS).map(([status, color]) => ({
        status: status as IotDevice["status"],
        color,
        label: STATUS_LABELS[status as IotDevice["status"]],
    })),
);

/** 当前选中/悬停的设备 */
const activeDevice = computed<IotDevice | null>(
    () =>
        topology.devices.find((d) => d.id === (hoverId.value ?? topology.selectedDeviceId.value)) ??
        null,
);
</script>

<template>
    <div class="iot-topology">
        <div class="topology-header">
            <span class="title">{{ i18n("iot.topology.title") }}</span>
            <div class="legend">
                <span class="legend-label">{{ i18n("iot.topology.legend") }}:</span>
                <span
                    v-for="item in legendItems"
                    :key="item.status"
                    class="legend-item"
                >
                    <span class="dot" :style="{ background: item.color }"></span>
                    {{ item.label }}
                </span>
            </div>
        </div>
        <div class="topology-canvas" :style="{ height: `${svgHeight}px` }">
            <div v-if="topology.devices.length === 0" class="empty">
                {{ i18n("iot.message.noDevices") }}
            </div>
            <svg
                v-else
                class="topology-svg"
                :width="svgSize.width"
                :height="Math.max(svgSize.height, svgHeight)"
                :viewBox="`0 0 ${svgSize.width} ${Math.max(svgSize.height, svgHeight)}`"
            >
                <defs>
                    <marker
                        id="iot-arrow"
                        markerWidth="8"
                        markerHeight="8"
                        refX="4"
                        refY="4"
                        orient="auto"
                    >
                        <path d="M0,0 L8,4 L0,8 Z" fill="rgba(144,147,153,0.6)" />
                    </marker>
                </defs>
                <!-- 连线 -->
                <g class="edges">
                    <path
                        v-for="(edge, idx) in topology.topologyEdges.value"
                        :key="`edge-${idx}`"
                        :d="edgePath(edge.source, edge.target)"
                        fill="none"
                        stroke="rgba(144,147,153,0.45)"
                        stroke-width="1.5"
                        :marker-end="`url(#iot-arrow)`"
                    />
                </g>
                <!-- 节点 -->
                <g
                    v-for="node in topology.topologyNodes.value"
                    :key="node.device.id"
                    class="node-group"
                    :class="{
                        selected: topology.selectedDeviceId.value === node.device.id,
                        hovered: hoverId === node.device.id,
                    }"
                    :transform="`translate(${node.x}, ${node.y})`"
                    @click.stop="handleNodeClick(node.device)"
                    @mouseenter="hoverId = node.device.id"
                    @mouseleave="hoverId = null"
                    @dblclick.stop="handleDetail(node.device)"
                >
                    <!-- 节点主体 -->
                    <rect
                        :width="TOPOLOGY_NODE_WIDTH"
                        :height="TOPOLOGY_NODE_HEIGHT"
                        rx="6"
                        ry="6"
                        :fill="`rgba(255,255,255,0.95)`"
                        :stroke="statusColor(node.device)"
                        stroke-width="2"
                    />
                    <!-- 类型色条 -->
                    <rect
                        x="0"
                        y="0"
                        width="4"
                        :height="TOPOLOGY_NODE_HEIGHT"
                        rx="2"
                        ry="2"
                        :fill="typeColor(node.device)"
                    />
                    <!-- 状态指示点 -->
                    <circle
                        :cx="TOPOLOGY_NODE_WIDTH - 12"
                        :cy="12"
                        r="4"
                        :fill="statusColor(node.device)"
                    >
                        <animate
                            v-if="node.device.status === 'error' || node.device.status === 'warning'"
                            attributeName="opacity"
                            values="1;0.3;1"
                            dur="1.2s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <!-- 设备名称 -->
                    <text
                        :x="12"
                        :y="22"
                        class="node-name"
                    >{{ node.device.name }}</text>
                    <!-- 类型 + 状态 -->
                    <text :x="12" :y="40" class="node-meta">
                        {{ typeLabel(node.device) }} · {{ statusLabel(node.device) }}
                    </text>
                </g>
            </svg>
            <!-- 悬浮信息卡 -->
            <div
                v-if="activeDevice && hoverId"
                class="hover-card"
            >
                <div class="hc-title">{{ activeDevice.name }}</div>
                <div class="hc-row">
                    <span class="hc-key">{{ i18n("iot.device.type") }}</span>
                    <span class="hc-val">{{ typeLabel(activeDevice) }}</span>
                </div>
                <div class="hc-row">
                    <span class="hc-key">{{ i18n("iot.device.status") }}</span>
                    <span class="hc-val" :style="{ color: statusColor(activeDevice) }">
                        {{ statusLabel(activeDevice) }}
                    </span>
                </div>
                <div class="hc-row">
                    <span class="hc-key">{{ i18n("iot.device.location") }}</span>
                    <span class="hc-val">{{ activeDevice.location || "-" }}</span>
                </div>
                <div class="hc-tip">{{ i18n("iot.topology.selectDevice") }}</div>
            </div>
        </div>
        <!-- 设备详情弹窗 -->
        <iot-device-detail-dialog
            v-model:visible="detailVisible"
            :device="topology.selectedDevice.value"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: "IotDeviceTopology",
};
</script>

<style lang="scss" scoped>
.iot-topology {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .topology-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color-lighter);
        flex-wrap: wrap;
        gap: 8px;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .legend {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            flex-wrap: wrap;

            .legend-label {
                color: var(--el-text-color-secondary);
            }

            .legend-item {
                display: inline-flex;
                align-items: center;
                gap: 4px;

                .dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
            }
        }
    }

    .topology-canvas {
        flex: 1;
        overflow: auto;
        position: relative;
        background:
            linear-gradient(0deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
        background-size: 20px 20px;

        .topology-svg {
            display: block;
            min-width: 100%;
        }

        .empty {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--el-text-color-placeholder);
            font-size: 14px;
        }

        .node-group {
            cursor: pointer;
            transition: opacity 0.15s;

            .node-name {
                fill: var(--el-text-color-primary);
                font-size: 12px;
                font-weight: 600;
            }
            .node-meta {
                fill: var(--el-text-color-secondary);
                font-size: 10px;
            }

            &.selected rect {
                stroke-width: 3;
                filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.5));
            }
            &.hovered rect {
                fill: rgba(64, 158, 255, 0.08);
            }
        }
    }

    .hover-card {
        position: absolute;
        top: 8px;
        right: 8px;
        min-width: 200px;
        padding: 8px 10px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
        font-size: 12px;
        z-index: 5;
        pointer-events: none;

        .hc-title {
            font-weight: 600;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px dashed var(--el-border-color-lighter);
        }
        .hc-row {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin: 2px 0;
        }
        .hc-key {
            color: var(--el-text-color-secondary);
        }
        .hc-tip {
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px dashed var(--el-border-color-lighter);
            color: var(--el-text-color-placeholder);
            font-size: 11px;
        }
    }
}
</style>
