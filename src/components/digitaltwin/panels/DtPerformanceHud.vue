<script setup lang="ts" name="DtPerformanceHud">
/**
 * 数字孪生 - 性能 HUD 浮层
 *
 * 职责：
 *  - 订阅 engine.performance.onStats 实时显示性能指标
 *  - 显示 FPS / FrameTime / DrawCalls / Triangles / Geometries /
 *    Textures / Programs / InstancedMeshes / JS Heap
 *  - FPS 三色警示（绿 ≥55 / 黄 ≥30 / 红 <30）
 *  - 可折叠（折叠时仅显示 FPS）
 *
 * 注：onStats 由 DtPerformanceMonitor 内部每秒触发一次，无需额外 rAF 节流。
 *     不使用 jQuery，纯原生 + Vue 模板。
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import type { ShallowRef } from "vue";
import type { DtEngine } from "../core/DtEngine";
import type { DtPerformanceStats } from "../types";
import { i18n } from "@/lang";

const props = defineProps<{
    /** 引擎实例（ShallowRef） */
    engine: ShallowRef<DtEngine | null>;
    /** 兜底 FPS（来自父组件 onStats 同步，引擎未就绪时显示） */
    fps?: number;
}>();

/** 当前性能快照 */
const stats = ref<DtPerformanceStats | null>(null);
/** 是否展开（默认展开） */
const expanded = ref(true);
/** unsubscribe onStats 函数 */
let unsubscribe: (() => void) | null = null;

/** 当前显示的 FPS（优先用 stats，其次 props.fps 兜底） */
const displayFps = computed(() => stats.value?.fps ?? props.fps ?? 0);

/** FPS 颜色 class */
const fpsClass = computed(() => {
    const f = displayFps.value;
    if (f >= 55) return "fps-good";
    if (f >= 30) return "fps-warn";
    return "fps-bad";
});

/** 订阅引擎性能回调 */
const subscribe = (engine: DtEngine | null) => {
    // 先解绑旧订阅
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
    if (!engine) {
        stats.value = null;
        return;
    }
    // 立即同步一次当前快照（避免初始 1 秒空白）
    stats.value = { ...engine.performance.stats };
    unsubscribe = engine.performance.onStats((s) => {
        stats.value = { ...s };
    });
};

onMounted(() => {
    subscribe(props.engine.value);
});

onBeforeUnmount(() => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
});

// 引擎实例变化时重新订阅
watch(
    () => props.engine.value,
    (inst) => subscribe(inst),
);

/* ----------------------- 数值格式化 ----------------------- */
/** 大数字缩写：1234 → 1.2K，1234567 → 1.2M */
const formatLargeNumber = (n: number): string => {
    if (n < 1000) return String(n);
    if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`;
    return `${(n / 1_000_000).toFixed(2)}M`;
};

/** 字节 → MB */
const formatBytes = (bytes?: number): string => {
    if (bytes === undefined) return "-";
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/** 帧时间 → ms */
const formatFrameTime = (ms?: number): string => {
    if (ms === undefined) return "-";
    return `${ms.toFixed(2)} ms`;
};

/** 切换折叠 */
const toggleExpand = () => {
    expanded.value = !expanded.value;
};

// 阻止未使用变量告警
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
                <span class="dt-perf-value">{{ formatFrameTime(stats?.frameTime) }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.drawCalls") }}</span>
                <span class="dt-perf-value">{{ stats?.drawCalls ?? 0 }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.triangles") }}</span>
                <span class="dt-perf-value">{{ formatLargeNumber(stats?.triangles ?? 0) }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.geometries") }}</span>
                <span class="dt-perf-value">{{ stats?.geometries ?? 0 }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.textures") }}</span>
                <span class="dt-perf-value">{{ stats?.textures ?? 0 }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.programs") }}</span>
                <span class="dt-perf-value">{{ stats?.programs ?? 0 }}</span>
            </div>
            <div class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.instancedMeshes") }}</span>
                <span class="dt-perf-value">{{ stats?.instancedMeshes ?? 0 }}</span>
            </div>
            <div v-if="stats?.jsHeapSize !== undefined" class="dt-perf-row">
                <span class="dt-perf-label">{{ i18n("digitaltwin.performance.jsHeapSize") }}</span>
                <span class="dt-perf-value">{{ formatBytes(stats?.jsHeapSize) }}</span>
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

        &.fps-good {
            color: #52c41a;
        }
        &.fps-warn {
            color: #faad14;
        }
        &.fps-bad {
            color: #f5222d;
        }
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

        &.fps-good {
            color: #52c41a;
        }
        &.fps-warn {
            color: #faad14;
        }
        &.fps-bad {
            color: #f5222d;
        }
    }
}
</style>
