<script setup lang="ts" name="MapField">
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { useMapField } from "./composables/useMapField";
import { DEFAULT_MAP_BOUNDS, parseLngLat } from "./constants";
import { generateGridLines, project, unproject } from "./utils/MapProjection";
import type { MapBounds } from "./types";
import MapPickerDialog from "./dialogs/MapPickerDialog.vue";

const props = defineProps<{
    modelValue?: string;
    bounds?: MapBounds;
    backgroundImage?: string;
    readonly?: boolean;
    height?: number;
    placeholder?: string;
}>();

const emits = defineEmits<{
    (e: "update:modelValue", v: string): void;
    (e: "change", v: string): void;
}>();

const field = useMapField(props.modelValue, props.bounds ?? DEFAULT_MAP_BOUNDS);
if (props.bounds) field.setBounds(props.bounds);

const canvasWidth = ref(800);
const canvasHeight = ref(props.height ?? 280);
const pickerVisible = ref(false);

const bounds = computed<MapBounds>(() => props.bounds ?? DEFAULT_MAP_BOUNDS);

const gridLines = computed(() => {
    const span = bounds.value[2] - bounds.value[0];
    const step = span > 50 ? 10 : span > 10 ? 5 : 1;
    return generateGridLines(bounds.value, step, step);
});

/** 经线像素坐标（竖向线） */
const lngLineCoords = computed(() =>
    gridLines.value.lngs.map((lng) => {
        const top = project({ lng, lat: bounds.value[3] }, bounds.value, canvasWidth.value, canvasHeight.value, 10);
        const bottom = project({ lng, lat: bounds.value[1] }, bounds.value, canvasWidth.value, canvasHeight.value, 10);
        return { x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y };
    }),
);

/** 纬线像素坐标（横向线） */
const latLineCoords = computed(() =>
    gridLines.value.lats.map((lat) => {
        const left = project({ lng: bounds.value[0], lat }, bounds.value, canvasWidth.value, canvasHeight.value, 10);
        const right = project({ lng: bounds.value[2], lat }, bounds.value, canvasWidth.value, canvasHeight.value, 10);
        return { x1: left.x, y1: left.y, x2: right.x, y2: right.y };
    }),
);

const markerPixel = computed(() => {
    if (!field.lngLat.value) return null;
    return project(field.lngLat.value, bounds.value, canvasWidth.value, canvasHeight.value, 10);
});

const handleClick = (e: MouseEvent) => {
    if (props.readonly) return;
    const svg = e.currentTarget as SVGElement;
    const rect = svg.getBoundingClientRect();
    const scaleX = canvasWidth.value / rect.width;
    const scaleY = canvasHeight.value / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const lngLat = unproject({ x, y }, bounds.value, canvasWidth.value, canvasHeight.value, 10);
    field.setLngLat(lngLat.lng, lngLat.lat);
    emits("update:modelValue", field.value.value);
    emits("change", field.value.value);
};

const handleClear = () => {
    field.clear();
    emits("update:modelValue", "");
    emits("change", "");
};

const handlePickerConfirm = (v: string) => {
    field.setValue(v);
    emits("update:modelValue", v);
    emits("change", v);
    pickerVisible.value = false;
};

const parsedValue = computed(() => parseLngLat(field.value.value));
</script>

<template>
    <div class="map-field">
        <div class="field-header">
            <el-input
                :model-value="field.value.value"
                :placeholder="placeholder || i18n('map.field.placeholder')"
                :readonly="true"

                class="coord-input"
            >
                <template #prepend>
                    <span class="coord-label">{{ i18n("map.field.lngLat") }}</span>
                </template>
            </el-input>
            <div class="field-actions" v-if="!readonly">
                <el-button  @click="pickerVisible = true">
                    <el-icon><Location/></el-icon>
                    {{ i18n("map.field.select") }}
                </el-button>
                <el-button  :disabled="!field.hasValue.value" @click="handleClear">
                    <el-icon><Delete/></el-icon>
                </el-button>
            </div>
        </div>
        <div class="field-canvas" :style="{ height: `${canvasHeight}px` }">
            <svg
                :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                @click="handleClick"
                :class="{ clickable: !readonly }"
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
                        :x1="c.x1" :y1="c.y1" :x2="c.x2" :y2="c.y2"
                    />
                    <line
                        v-for="(c, i) in latLineCoords"
                        :key="`lat-${i}`"
                        :x1="c.x1" :y1="c.y1" :x2="c.x2" :y2="c.y2"
                    />
                </g>
                <rect
                    :x="10" :y="10"
                    :width="canvasWidth - 20"
                    :height="canvasHeight - 20"
                    fill="none"
                    stroke="var(--el-border-color)"
                    stroke-width="1"
                />
                <g v-if="markerPixel">
                    <circle
                        :cx="markerPixel.x"
                        :cy="markerPixel.y"
                        :r="8"
                        fill="#F56C6C"
                        stroke="#FFFFFF"
                        stroke-width="2"
                    />
                    <text
                        :x="markerPixel.x"
                        :y="markerPixel.y - 14"
                        text-anchor="middle"
                        font-size="11"
                        fill="#333"
                    >
                        {{ parsedValue?.lng.toFixed(4) }},{{ parsedValue?.lat.toFixed(4) }}
                    </text>
                </g>
                <text
                    v-else
                    :x="canvasWidth / 2"
                    :y="canvasHeight / 2"
                    text-anchor="middle"
                    font-size="13"
                    fill="var(--el-text-color-placeholder)"
                >
                    {{ i18n("map.field.empty") }}
                </text>
            </svg>
        </div>
        <map-picker-dialog
            v-model:visible="pickerVisible"
            :initial-value="field.value.value"
            :bounds="bounds"
            :background-image="backgroundImage"
            @confirm="handlePickerConfirm"
        />
    </div>
</template>

<script lang="ts">
import { Location, Delete } from "@element-plus/icons-vue";
export default { components: { Location, Delete } };
</script>

<style lang="scss" scoped>
.map-field {
    width: 100%;

    .field-header {
        display: flex;
        gap: 8px;
        margin-bottom: 6px;

        .coord-input {
            flex: 1;
        }

        .coord-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }

        .field-actions {
            display: flex;
            gap: 4px;
        }
    }

    .field-canvas {
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        overflow: hidden;
        background: var(--el-fill-color-light);

        svg {
            display: block;
            width: 100%;
            height: 100%;

            &.clickable {
                cursor: crosshair;
            }

            .grid line {
                stroke: var(--el-border-color-lighter);
                stroke-width: 0.5;
            }
        }
    }
}
</style>
