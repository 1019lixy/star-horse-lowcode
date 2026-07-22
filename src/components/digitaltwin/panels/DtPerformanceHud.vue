<script setup lang="ts" name="DtPerformanceHud">
/**
 * 数字孪生 - 性能 HUD 浮层（TresJS 重构版）
 *
 * 职责：
 *  - 使用 requestAnimationFrame 自行计算 FPS / FrameTime
 *  - 可折叠（折叠时仅显示 FPS）
 *  - FPS 三色警示（绿 ≥55 / 黄 ≥30 / 红 <30）
 *
 * 注：v4.0 起不再依赖 DtEngine，改为独立 rAF 计数。
 *     不使用 jQuery，纯原生 + Vue 模板。
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { i18n } from "@/lang";

const props = defineProps<{
    /** 兜底 FPS（rAF 未启动时显示） */
    fps?: number;
}>();

/** 当前性能快照 */
const stats = ref<{ fps: number; frameTime: number }>({ fps: 0, frameTime: 0 });
/** 是否展开（默认展开） */
const expanded = ref(true);

/** rAF 句柄 */
let rafId: number | null = null;
/** 上一帧时间戳 */
let lastTime = 0;
/** 帧计数（每秒重置） */
let frameCount = 0;
/** 帧累计时间（每秒重置） */
let frameTimeAccum = 0;
/** 上一秒时间戳 */
let lastFpsTime = 0;

/** 当前显示的 FPS（优先用 stats，其次 props.fps 兜底） */
const displayFps = computed(() => stats.value.fps || props.fps || 0);

/** FPS 颜色 class */
const fpsClass = computed(() => {
    const f = displayFps.value;
    if (f >= 55) return "fps-good";
    if (f >= 30) return "fps-warn";
    return "fps-bad";
});

/** rAF 循环：计算 FPS 与帧时间 */
const tick = (now: number): void => {
    if (lastTime > 0) {
        const delta = now - lastTime;
        frameCount++;
        frameTimeAccum += delta;
        // 每秒结算一次
        if (now - lastFpsTime >= 1000) {
            const avgFrameTime = frameCount > 0 ? frameTimeAccum / frameCount : 0;
            stats.value = {
                fps: Math.round(frameCount * 1000 / (now - lastFpsTime)),
                frameTime: avgFrameTime,
            };
            frameCount = 0;
            frameTimeAccum = 0;
            lastFpsTime = now;
        }
    } else {
        lastFpsTime = now;
    }
    lastTime = now;
    rafId = requestAnimationFrame(tick);
};

onMounted(() => {
    rafId = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
});

/* ----------------------- 数值格式化 ----------------------- */
/** 帧时间 → ms */
const formatFrameTime = (ms: number): string => `${ms.toFixed(2)} ms`;

/** 切换折叠 */
const toggleExpand = (): void => {
    expanded.value = !expanded.value;
};

void props;
</script>

<template>
    <div class="dt-perf-hud" :class="{ collapsed: !expanded }">
        <div class="dt-perf-header" @click="toggleExpand">
            <span class="dt-perf-title">{{ i18n("digitaltwin.performance.title") }}</span>
            <span class="dt-perf-fps-mini" :class="fpsClass">{{ displayFps }} FPS</span>
            <el-icon class="dt-perf-toggle">
                <ArrowUp v-if="expanded" />
                <ArrowDown v-else />
            </el-icon>
        </div>
        <div v-show="expanded" class="dt-perf-body">
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.fps") }}</span>
                <span class="dt-perf-value" :class="fpsClass">{{ displayFps }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.frameTime") }}</span>
                <span class="dt-perf-value">{{ formatFrameTime(stats.frameTime) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
export default { components: { ArrowUp, ArrowDown } };
</script>

<style lang="scss" scoped>
.dt-perf-hud {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    min-width: 200px;
    font-size: 11px;
    font-family: var(--el-font-family-mono, "Cascadia Code", Consolas, monospace);
    color: rgba(255, 255, 255, 0.85);
    background: rgba(30, 30, 30, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
    user-select: none;
    pointer-events: auto;

    &.collapsed {
        min-width: 140px;
    }
}

.dt-perf-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    .dt-perf-title {
        font-weight: 600;
        font-size: 11px;
        letter-spacing: 0.3px;
        color: rgba(255, 255, 255, 0.7);
        flex: 1;
    }

    .dt-perf-fps-mini {
        font-weight: 700;
        font-size: 12px;

        &.fps-good { color: #52c41a; }
        &.fps-warn { color: #faad14; }
        &.fps-bad { color: #f5222d; }
    }

    .dt-perf-toggle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.55);
    }
}

.dt-perf-body {
    padding: 4px 10px 6px;
}

.dt-perf-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
    line-height: 1.5;

    .dt-perf-label {
        color: rgba(255, 255, 255, 0.55);
    }

    .dt-perf-value {
        color: rgba(255, 255, 255, 0.92);
        font-weight: 500;

        &.fps-good { color: #52c41a; }
        &.fps-warn { color: #faad14; }
        &.fps-bad { color: #f5222d; }
    }
}
</style>
