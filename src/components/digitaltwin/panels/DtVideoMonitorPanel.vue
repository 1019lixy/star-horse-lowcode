<script setup lang="ts" name="DtVideoMonitorPanel">
/**
 * 数字孪生 - 视频监控面板
 *
 * - 左侧摄像头列表（在线/离线状态指示）
 * - 右侧视频播放区（mock 流使用 canvas 渲染动态画面）
 * - 支持多路切换、PTZ 模拟控制
 * - 点击列表项 → emit('locate-camera', cameraId) 在 3D 场景中高亮点位
 */
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { UseDtVideoMonitorReturn } from "../composables/useDtVideoMonitor";
import type { DtVideoCamera } from "../types";

const props = defineProps<{
    videoMonitor: UseDtVideoMonitorReturn;
    floating?: boolean;
}>();

const emit = defineEmits<{
    (e: "locate-camera", cameraId: string): void;
    (e: "close"): void;
}>();

const videoMonitor = props.videoMonitor;
const activeCamera = computed<DtVideoCamera | null>(() => {
    const id = videoMonitor.activeCameraId.value;
    if (!id) return null;
    return videoMonitor.cameras.value.find((c) => c.id === id) ?? null;
});

// mock 视频流渲染
const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId: number | null = null;

const renderMockStream = (): void => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    // 背景：渐变深色
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1a2336");
    bg.addColorStop(1, "#0a0e1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 模拟工业场景：移动的车间轮廓
    const t = Date.now() / 1000;
    ctx.strokeStyle = "#3a5a8a";
    ctx.lineWidth = 1.5;

    // 远景轮廓
    for (let i = 0; i < 5; i++) {
        const x = (i * 120 + (t * 30) % 120) % (W + 100) - 50;
        const h = 60 + Math.sin(i) * 20;
        ctx.strokeRect(x, H - h - 40, 80, h);
    }

    // 中央前景设备
    ctx.strokeStyle = "#6a8aca";
    ctx.strokeRect(W * 0.3, H * 0.4, 80, 100);
    ctx.strokeRect(W * 0.6, H * 0.5, 60, 80);

    // 移动的小点（模拟人员/AGV）
    for (let i = 0; i < 3; i++) {
        const px = (t * 50 + i * 200) % W;
        ctx.fillStyle = "#ffcc00";
        ctx.beginPath();
        ctx.arc(px, H - 50, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // 顶部 HUD
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "11px monospace";
    const ts = new Date();
    ctx.fillText(
        `${ts.toLocaleDateString()} ${ts.toLocaleTimeString()}`,
        10,
        16,
    );
    if (activeCamera.value) {
        ctx.fillText(`● ${activeCamera.value.name}`, 10, 32);
        ctx.fillText(`CAM-${activeCamera.value.id.slice(-4)}`, 10, 48);
    }

    // 边框
    ctx.strokeStyle = activeCamera.value?.online ? "#67c23a" : "#f56c6c";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    rafId = requestAnimationFrame(renderMockStream);
};

watch(activeCamera, () => {
    // 切换摄像头时无需重启 raf
});

onMounted(() => {
    if (canvasRef.value) {
        canvasRef.value.width = 480;
        canvasRef.value.height = 270;
        rafId = requestAnimationFrame(renderMockStream);
    }
});

onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
});

const handleSelect = (c: DtVideoCamera): void => {
    if (!c.online) return;
    videoMonitor.activate(c.id);
};

const handleLocate = (c: DtVideoCamera): void => {
    emit("locate-camera", c.id);
};

const handleClose = (): void => {
    videoMonitor.deactivate();
    emit("close");
};

// PTZ 模拟控制
const handlePtz = (direction: string): void => {
    // 模拟云台控制（mock）
    // eslint-disable-next-line no-console
    console.log("PTZ:", direction);
};
</script>

<template>
    <div class="dt-video-monitor" :class="{ floating }">
        <div class="panel-header">
            <span class="panel-title">
                <ShSvgIcon name="camera" />
                {{ i18n("digitaltwin.video.title") }}
            </span>
            <span class="online-count">
                {{ videoMonitor.onlineCount.value }}/{{ videoMonitor.totalCount.value }}
            </span>
            <div style="flex:1" />
            <el-button text size="small" @click="handleClose">
                <ShSvgIcon name="close" />
            </el-button>
        </div>

        <div class="video-body">
            <!-- 左侧摄像头列表 -->
            <div class="camera-list">
                <div
                    v-for="c in videoMonitor.cameras.value"
                    :key="c.id"
                    class="camera-item"
                    :class="{ active: c.id === videoMonitor.activeCameraId.value, offline: !c.online }"
                    @click="handleSelect(c)"
                >
                    <span class="online-dot" :class="c.online ? 'online' : 'offline'" />
                    <span class="camera-name">{{ c.name }}</span>
                    <el-button
                        size="small"
                        link
                        :disabled="!c.online"
                        @click.stop="handleLocate(c)"
                        :title="i18n('digitaltwin.video.locate')"
                    >
                        <ShSvgIcon name="location" />
                    </el-button>
                </div>
            </div>

            <!-- 右侧视频播放区 -->
            <div class="video-stage">
                <div v-if="!activeCamera" class="placeholder">
                    {{ i18n("digitaltwin.video.placeholder") }}
                </div>
                <template v-else>
                    <canvas ref="canvasRef" class="video-canvas" />
                    <div class="video-overlay">
                        <div class="overlay-info">
                            <span class="overlay-name">{{ activeCamera.name }}</span>
                            <span class="overlay-type">{{ activeCamera.cameraType?.toUpperCase() }}</span>
                        </div>
                        <!-- PTZ 控制（仅 ptz 类型） -->
                        <div v-if="activeCamera.cameraType === 'ptz'" class="ptz-control">
                            <el-button size="small" @click="handlePtz('up')">↑</el-button>
                            <div class="ptz-row">
                                <el-button size="small" @click="handlePtz('left')">←</el-button>
                                <el-button size="small" @click="handlePtz('home')">●</el-button>
                                <el-button size="small" @click="handlePtz('right')">→</el-button>
                            </div>
                            <el-button size="small" @click="handlePtz('down')">↓</el-button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dt-video-monitor {
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border-radius: 6px;
    overflow: hidden;
    height: 100%;
    min-height: 360px;

    &.floating {
        position: fixed;
        top: 60px;
        right: 16px;
        width: 640px;
        height: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        border: 1px solid var(--el-border-color-lighter);
        z-index: 2000;
        backdrop-filter: blur(8px);
        background: rgba(var(--el-bg-color-rgb, 255, 255, 255), 0.95);
    }

    .panel-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .panel-title {
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .online-count {
            font-size: 11px;
            padding: 1px 8px;
            border-radius: 10px;
            background: var(--el-color-success-light-9);
            color: var(--el-color-success);
            font-weight: 600;
        }
    }

    .video-body {
        flex: 1;
        display: flex;
        overflow: hidden;

        .camera-list {
            width: 180px;
            border-right: 1px solid var(--el-border-color-lighter);
            overflow-y: auto;
            padding: 6px;

            .camera-item {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-bottom: 2px;

                &:hover {
                    background: var(--el-fill-color-light);
                }
                &.active {
                    background: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);
                    font-weight: 600;
                }
                &.offline {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .online-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    &.online {
                        background: #67c23a;
                        box-shadow: 0 0 4px #67c23a;
                    }
                    &.offline {
                        background: #909399;
                    }
                }

                .camera-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .video-stage {
            flex: 1;
            position: relative;
            background: #0a0e1a;
            display: flex;
            align-items: center;
            justify-content: center;

            .placeholder {
                color: #6a7aa0;
                font-size: 13px;
            }

            .video-canvas {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .video-overlay {
                position: absolute;
                inset: 0;
                pointer-events: none;

                .overlay-info {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    color: #fff;
                    font-size: 11px;
                    font-family: monospace;
                    text-shadow: 0 0 4px #000;

                    .overlay-name {
                        display: block;
                        font-weight: 600;
                    }
                    .overlay-type {
                        font-size: 10px;
                        color: #ffcc00;
                    }
                }

                .ptz-control {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    pointer-events: auto;

                    .ptz-row {
                        display: flex;
                        gap: 4px;
                    }
                    :deep(.el-button) {
                        width: 32px;
                        height: 32px;
                        padding: 0;
                        min-height: auto;
                    }
                }
            }
        }
    }
}
</style>
