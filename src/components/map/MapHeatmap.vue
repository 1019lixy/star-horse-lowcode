<script setup lang="ts" name="MapHeatmap">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { i18n } from "@/lang";
import { useHeatmap } from "./composables/useHeatmap";
import { DEFAULT_HEAT_GRADIENT, DEFAULT_MAP_BOUNDS } from "./constants";
import { renderHeatmap } from "./utils/HeatmapRenderer";
import type { HeatPoint, MapBounds } from "./types";

const props = defineProps<{
  points?: HeatPoint[];
  bounds?: MapBounds;
  backgroundImage?: string;
  height?: number;
  radius?: number;
  opacity?: number;
}>();

const emits = defineEmits<{
  (e: "point-click", p: HeatPoint): void;
}>();

const heat = useHeatmap(props.points ?? []);
const canvasWidth = ref(900);
const canvasHeight = ref(props.height ?? 400);
const bounds = computed<MapBounds>(() => props.bounds ?? DEFAULT_MAP_BOUNDS);

const canvasRef = shallowRef<HTMLCanvasElement | null>(null);

const radius = ref(props.radius ?? 30);
const opacity = ref(props.opacity ?? 0.6);

watch(
  () =>
    [
      heat.points,
      radius.value,
      opacity.value,
      bounds.value,
      canvasWidth.value,
      canvasHeight.value,
    ] as const,
  () => {
    renderCanvas();
  },
  { deep: true },
);

const renderCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = canvasWidth.value;
  canvas.height = canvasHeight.value;
  renderHeatmap(
    canvas,
    heat.points,
    bounds.value,
    radius.value,
    DEFAULT_HEAT_GRADIENT,
    opacity.value,
  );
};

const handleResize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  if (rect.width > 0) {
    canvasWidth.value = Math.floor(rect.width);
    renderCanvas();
  }
};

let resizeObserver: ResizeObserver | null = null;
const handleMounted = (el: HTMLElement) => {
  resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(el);
  setTimeout(renderCanvas, 50);
};

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

const handleRadiusChange = (r: number) => {
  radius.value = r;
  heat.setRadius(r);
};

const handleOpacityChange = (o: number) => {
  opacity.value = o;
  heat.setOpacity(o);
};

const handleAggregate = () => {
  heat.aggregateByGrid(0.01);
};

const handleClear = () => heat.clear();
</script>

<template>
  <div class="map-heatmap">
    <div
      class="heatmap-canvas-wrapper"
      :style="{ height: `${canvasHeight}px` }"
      :ref="(el) => el && handleMounted(el as HTMLElement)"
    >
      <canvas ref="canvasRef" class="heatmap-canvas" />
      <div
        class="heatmap-bg"
        v-if="backgroundImage"
        :style="{ backgroundImage: `url(${backgroundImage})` }"
      />
      <div class="heatmap-empty" v-if="heat.points.length === 0">
        {{ i18n("map.heatmap.empty") }}
      </div>
    </div>
    <div class="heatmap-controls">
      <div class="control-group">
        <span class="control-label">{{ i18n("map.heatmap.radius") }}</span>
        <el-slider
          :model-value="radius"
          :min="5"
          :max="80"
          :show-tooltip="false"
          style="width: 140px"
          @input="handleRadiusChange"
        />
      </div>
      <div class="control-group">
        <span class="control-label">{{ i18n("map.heatmap.intensity") }}</span>
        <el-slider
          :model-value="opacity"
          :min="0.1"
          :max="1"
          :step="0.05"
          :show-tooltip="false"
          style="width: 120px"
          @input="handleOpacityChange"
        />
      </div>
      <div class="control-group">
        <span class="control-label">{{ i18n("map.heatmap.pointCount") }}</span>
        <el-tag>{{ heat.points.length }}</el-tag>
      </div>
      <div class="control-group">
        <el-button
          @click="handleAggregate"
          :disabled="heat.points.length === 0"
        >
          <el-icon>
            <Grid />
          </el-icon>
          {{ i18n("map.heatmap.aggregate") }}
        </el-button>
        <el-button @click="handleClear" :disabled="heat.points.length === 0">
          <el-icon>
            <Delete />
          </el-icon>
          {{ i18n("map.heatmap.clear") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Grid, Delete } from "@element-plus/icons-vue";

export default { components: { Grid, Delete } };
</script>

<style lang="scss" scoped>
.map-heatmap {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  .heatmap-canvas-wrapper {
    position: relative;
    flex: 1;
    background: var(--el-fill-color-light);
    overflow: hidden;

    .heatmap-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    .heatmap-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.4;
      pointer-events: none;
      z-index: -1;
    }

    .heatmap-empty {
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

  .heatmap-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    flex-wrap: wrap;

    .control-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .control-label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      white-space: nowrap;
    }
  }
}

/* ============ App 端（移动端/窄屏）响应式适配 ============ */
@media (max-width: 768px) {
  .map-heatmap {
    .heatmap-controls {
      gap: 6px;
      padding: 6px 8px;

      .control-group {
        flex: 1 1 100%;
        gap: 4px;

        /* 覆盖行内 style 固定 slider 宽度（140px / 120px） */
        :deep(.el-slider) {
          width: 100% !important;
          flex: 1;
          min-width: 0;
        }

        .control-label {
          font-size: 11px;
        }

        :deep(.el-button) {
          padding: 6px 8px;
          font-size: 11px;
        }
      }
    }
  }
}
</style>
