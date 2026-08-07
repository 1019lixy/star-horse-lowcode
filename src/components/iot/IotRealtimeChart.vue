<script setup lang="ts" name="IotRealtimeChart">
import {computed, onBeforeUnmount, ref, shallowRef, watch} from "vue";
import {i18n} from "@/lang";
import {useRealtimeChart} from "./composables/useRealtimeChart";
import {renderLineChart} from "./utils/IotChartRenderer";
import type {IotChartConfig, IotChartSeries} from "./types";

const props = defineProps<{
  series?: IotChartSeries[];
  config?: Partial<IotChartConfig>;
  height?: number;
}>();

const chart = useRealtimeChart(props.series ?? [], props.config);

const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
const canvasWidth = ref(900);
const canvasHeight = computed(() => props.height ?? 420);
const showConfig = ref(false);

/** 渲染 Canvas 图表 */
const renderCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvasWidth.value;
  const h = canvasHeight.value;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderLineChart(ctx, chart.series, chart.config, w, h);
};

/** 监听数据与配置变化重绘 */
watch(
    () => [chart.series, chart.config, canvasWidth.value, canvasHeight.value] as const,
    () => renderCanvas(),
    {deep: true},
);

/** 响应式调整画布尺寸 */
let resizeObserver: ResizeObserver | null = null;
const handleWrapperMount = (el: HTMLElement) => {
  resizeObserver = new ResizeObserver(() => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      canvasWidth.value = Math.floor(rect.width);
      renderCanvas();
    }
  });
  resizeObserver.observe(el);
  setTimeout(renderCanvas, 50);
};

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  chart.stop();
});

/** 刷新间隔（秒） */
const refreshIntervalSec = computed({
  get: () => chart.config.refreshInterval / 1000,
  set: (v: number) => chart.updateConfig({refreshInterval: Math.max(0.2, v) * 1000}),
});

/** 系列选择列表 */
const seriesList = computed(() =>
    chart.series.map((s, idx) => ({
      index: idx,
      name: s.name,
      color: s.color,
      visible: s.visible ?? true,
      count: s.data.length,
    })),
);

/** 标题输入 */
const titleValue = computed({
  get: () => chart.config.title,
  set: (v: string) => chart.updateConfig({title: v}),
});

/** 单位输入 */
const unitValue = computed({
  get: () => chart.config.unit,
  set: (v: string) => chart.updateConfig({unit: v}),
});

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  setting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
  videoPause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  videoPlay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
};
</script>

<template>
  <div class="iot-realtime-chart">
    <div class="chart-toolbar">
      <span class="title">{{ i18n("iot.chart.title") }}</span>
      <div class="toolbar-actions">
        <el-tag v-if="chart.isRunning.value" type="success" effect="dark">
          {{ i18n("iot.chart.start") }}
        </el-tag>
        <el-tag v-else type="info">
          {{ i18n("iot.chart.pause") }}
        </el-tag>
        <el-button

            :type="chart.isRunning.value ? 'danger' : 'primary'"
            @click="chart.toggle()"
        >
          <span class="svg-icon" v-html="chart.isRunning.value ? icons.videoPause : icons.videoPlay"></span>
          {{ chart.isRunning.value ? i18n("iot.chart.stop") : i18n("iot.chart.start") }}
        </el-button>
        <el-button @click="showConfig = !showConfig">
          <span class="svg-icon" v-html="icons.setting"></span>
          {{ i18n("iot.btn.filter") }}
        </el-button>
        <el-button @click="chart.clear()" :disabled="chart.series.length === 0">
          <span class="svg-icon" v-html="icons.delete"></span>
          {{ i18n("iot.chart.clear") }}
        </el-button>
      </div>
    </div>
    <!-- 配置面板 -->
    <div v-show="showConfig" class="config-panel">
      <div class="config-row">
        <label>{{ i18n("iot.chart.title") }}</label>
        <el-input v-model="titleValue" style="width: 160px"/>
      </div>
      <div class="config-row">
        <label>{{ i18n("iot.chart.unit") }}</label>
        <el-input v-model="unitValue" style="width: 100px"/>
      </div>
      <div class="config-row">
        <label>{{ i18n("iot.chart.refreshInterval") }}(s)</label>
        <el-input-number
            v-model="refreshIntervalSec"

            :min="0.2"
            :max="60"
            :step="0.5"
            style="width: 110px"
        />
      </div>
      <div class="config-row series-row">
        <label>{{ i18n("iot.chart.series") }}</label>
        <div class="series-list">
          <el-checkbox
              v-for="s in seriesList"
              :key="s.index"
              :model-value="s.visible"
              @change="chart.toggleSeries(Number(s.index))"
          >
            <span class="series-dot" :style="{ background: s.color }"></span>
            {{ s.name }} ({{ s.count }})
          </el-checkbox>
        </div>
      </div>
    </div>
    <!-- 图表画布 -->
    <div
        class="canvas-wrapper"
        :style="{ height: `${canvasHeight}px` }"
        :ref="(el) => el && handleWrapperMount(el as HTMLElement)"
    >
      <canvas ref="canvasRef" class="chart-canvas"/>
      <div
          v-if="chart.series.length === 0 || chart.series.every((s) => s.data.length === 0)"
          class="empty"
      >
        {{ i18n("iot.chart.noData") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.iot-realtime-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  .chart-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    gap: 8px;

    .title {
      font-weight: 600;
      font-size: 14px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .config-panel {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-wrap: wrap;
    background: var(--el-bg-color);

    .config-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;

      label {
        color: var(--el-text-color-secondary);
        white-space: nowrap;
      }
    }

    .series-row {
      flex-basis: 100%;

      .series-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .series-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
          vertical-align: middle;
        }
      }
    }
  }

  .canvas-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
    background: rgba(250, 250, 252, 0.6);

    .chart-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    .empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-placeholder);
      font-size: 14px;
      pointer-events: none;
    }
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ============ App 端（移动端/窄屏）响应式适配 ============ */
@media (max-width: 768px) {
  .iot-realtime-chart {
    .chart-toolbar {
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px 8px;

      .title {
        font-size: 13px;
        flex: 1 1 100%;
      }

      .toolbar-actions {
        flex-wrap: wrap;
        gap: 6px;
        width: 100%;

        :deep(.el-button) {
          padding: 6px 8px;
          font-size: 12px;
        }

        :deep(.el-tag) {
          font-size: 11px;
          padding: 0 6px;
          height: 22px;
        }
      }
    }

    .config-panel {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 8px;

      .config-row {
        width: 100%;

        label {
          flex-shrink: 0;
          min-width: 70px;
        }

        /* 覆盖行内 style 的固定宽度 */
        :deep(.el-input) {
          width: 100% !important;
        }

        :deep(.el-input-number) {
          width: 100% !important;
        }

        &.series-row {
          .series-list {
            gap: 8px;
          }
        }
      }
    }
  }
}
</style>
