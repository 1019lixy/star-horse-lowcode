<script setup lang="ts" name="MapPickerDialog">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { DEFAULT_MAP_BOUNDS, formatLngLat, parseLngLat } from "../constants";
import { generateGridLines, project, unproject } from "../utils/MapProjection";
import type { MapBounds } from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  initialValue?: string;
  bounds?: MapBounds;
  backgroundImage?: string;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "confirm", v: string): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const canvasWidth = ref(900);
const canvasHeight = ref(500);
const currentValue = ref<string>(props.initialValue ?? "");
const searchKeyword = ref("");

const bounds = computed<MapBounds>(() => props.bounds ?? DEFAULT_MAP_BOUNDS);

const gridLines = computed(() => {
  const span = bounds.value[2] - bounds.value[0];
  const step = span > 50 ? 10 : span > 10 ? 5 : 1;
  return generateGridLines(bounds.value, step, step);
});

const lngLineCoords = computed(() =>
  gridLines.value.lngs.map((lng) => {
    const top = project(
      { lng, lat: bounds.value[3] },
      bounds.value,
      canvasWidth.value,
      canvasHeight.value,
      10,
    );
    const bottom = project(
      { lng, lat: bounds.value[1] },
      bounds.value,
      canvasWidth.value,
      canvasHeight.value,
      10,
    );
    return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y };
  }),
);

const latLineCoords = computed(() =>
  gridLines.value.lats.map((lat) => {
    const left = project(
      { lng: bounds.value[0], lat },
      bounds.value,
      canvasWidth.value,
      canvasHeight.value,
      10,
    );
    const right = project(
      { lng: bounds.value[2], lat },
      bounds.value,
      canvasWidth.value,
      canvasHeight.value,
      10,
    );
    return { x1: left.x, y1: left.y, x2: right.x, y2: right.y };
  }),
);

const markerPixel = computed(() => {
  const parsed = parseLngLat(currentValue.value);
  if (!parsed) return null;
  return project(
    parsed,
    bounds.value,
    canvasWidth.value,
    canvasHeight.value,
    10,
  );
});

const handleClick = (e: MouseEvent) => {
  const svg = e.currentTarget as SVGElement;
  const rect = svg.getBoundingClientRect();
  const scaleX = canvasWidth.value / rect.width;
  const scaleY = canvasHeight.value / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  const lngLat = unproject(
    { x, y },
    bounds.value,
    canvasWidth.value,
    canvasHeight.value,
    10,
  );
  currentValue.value = formatLngLat(lngLat.lng, lngLat.lat);
};

const handleManualInput = (lng: number, lat: number) => {
  currentValue.value = formatLngLat(lng, lat);
};

const parsedCurrent = computed(() => parseLngLat(currentValue.value));

const manualLng = ref<number | undefined>(undefined);
const manualLat = ref<number | undefined>(undefined);

const handleApplyManual = () => {
  if (manualLng.value === undefined || manualLat.value === undefined) return;
  handleManualInput(manualLng.value, manualLat.value);
};

const handleConfirm = () => {
  if (!currentValue.value) {
    ElMessage.warning(i18n("map.field.empty"));
    return;
  }
  emit("confirm", currentValue.value);
};

const handleOpened = () => {
  currentValue.value = props.initialValue ?? "";
  const parsed = parseLngLat(currentValue.value);
  manualLng.value = parsed?.lng;
  manualLat.value = parsed?.lat;
};

const handleSearch = () => {
  if (!searchKeyword.value) return;
  ElMessage.info(i18n("map.field.searchTip"));
};
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('map.field.select')"
    box-width="960px"
    :self-func="true"
    @merge="handleConfirm"
    @open="handleOpened"
  >
    <div class="map-picker-dialog">
      <div class="picker-layout">
        <div class="picker-sidebar">
          <div class="sidebar-section">
            <div class="section-title">{{ i18n("map.field.search") }}</div>
            <el-input
              v-model="searchKeyword"
              :placeholder="i18n('map.field.searchPlaceholder')"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon>
                    <Search />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="sidebar-section">
            <div class="section-title">{{ i18n("map.field.manualInput") }}</div>
            <el-form label-width="60px">
              <el-form-item :label="i18n('map.field.lng')">
                <el-input-number
                  v-model="manualLng"
                  :controls="false"
                  style="width: 100%"
                  @change="handleApplyManual"
                />
              </el-form-item>
              <el-form-item :label="i18n('map.field.lat')">
                <el-input-number
                  v-model="manualLat"
                  :controls="false"
                  style="width: 100%"
                  @change="handleApplyManual"
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="sidebar-section" v-if="parsedCurrent">
            <div class="section-title">{{ i18n("map.field.selected") }}</div>
            <div class="selected-coord">
              <el-tag
                >{{ i18n("map.field.lng") }}:
                {{ parsedCurrent.lng.toFixed(6) }}</el-tag
              >
              <el-tag
                >{{ i18n("map.field.lat") }}:
                {{ parsedCurrent.lat.toFixed(6) }}</el-tag
              >
            </div>
          </div>
        </div>
        <div class="picker-canvas">
          <svg
            :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            @click="handleClick"
            class="picker-svg"
          >
            <image
              v-if="backgroundImage"
              :href="backgroundImage"
              :x="10"
              :y="10"
              :width="canvasWidth - 20"
              :height="canvasHeight - 20"
              preserveAspectRatio="xMidYMid slice"
              opacity="0.4"
            />
            <g class="grid" v-if="!backgroundImage">
              <line
                v-for="(c, i) in lngLineCoords"
                :key="`lng-${i}`"
                :x1="c.x1"
                :y1="c.y1"
                :x2="c.x2"
                :y2="c.y2"
              />
              <line
                v-for="(c, i) in latLineCoords"
                :key="`lat-${i}`"
                :x1="c.x1"
                :y1="c.y1"
                :x2="c.x2"
                :y2="c.y2"
              />
            </g>
            <rect
              :x="10"
              :y="10"
              :width="canvasWidth - 20"
              :height="canvasHeight - 20"
              fill="none"
              stroke="var(--el-border-color)"
            />
            <g v-if="markerPixel">
              <circle
                :cx="markerPixel.x"
                :cy="markerPixel.y"
                :r="10"
                fill="#F56C6C"
                stroke="#FFFFFF"
                stroke-width="2"
              />
              <text
                :x="markerPixel.x"
                :y="markerPixel.y - 16"
                text-anchor="middle"
                font-size="12"
                fill="#333"
              >
                {{ parsedCurrent?.lng.toFixed(4) }},{{
                  parsedCurrent?.lat.toFixed(4)
                }}
              </text>
            </g>
            <text
              v-else
              :x="canvasWidth / 2"
              :y="canvasHeight / 2"
              text-anchor="middle"
              font-size="14"
              fill="var(--el-text-color-placeholder)"
            >
              {{ i18n("map.field.clickToSelect") }}
            </text>
          </svg>
        </div>
      </div>
    </div>
  </star-horse-panel>
</template>

<script lang="ts">
import { Search } from "@element-plus/icons-vue";

export default { components: { Search } };
</script>

<style lang="scss" scoped>
.map-picker-dialog {
  .picker-layout {
    display: flex;
    gap: 12px;
    height: 60vh;

    .picker-sidebar {
      width: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: auto;
      padding-right: 8px;
      border-right: 1px solid var(--el-border-color);

      .sidebar-section {
        .section-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-secondary);
          margin-bottom: 6px;
        }

        .selected-coord {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }
    }

    .picker-canvas {
      flex: 1;
      overflow: hidden;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      background: var(--el-fill-color-light);

      .picker-svg {
        display: block;
        width: 100%;
        height: 100%;
        cursor: crosshair;

        .grid line {
          stroke: var(--el-border-color-lighter);
          stroke-width: 0.5;
        }
      }
    }
  }
}
</style>
