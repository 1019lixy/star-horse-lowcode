<script setup lang="ts" name="MapField">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { i18n } from "@/lang";
import { useMapField } from "./composables/useMapField";
import { DEFAULT_MAP_BOUNDS, parseLngLat } from "./constants";
import { renderTiles, lngLatToPixel, pixelToLngLat } from "./utils/TileRenderer";
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

const canvasHeight = ref(props.height ?? 280);
const pickerVisible = ref(false);

const bounds = computed<MapBounds>(() => props.bounds ?? DEFAULT_MAP_BOUNDS);

/** 地图状态 */
const canvasRef = ref<HTMLCanvasElement | null>(null);
const centerLng = ref(116.397); // 北京
const centerLat = ref(39.908);
const zoom = ref(10);
let renderRaf = 0;

/** 拖拽状态 */
const isDragging = ref(false);
const dragStart = ref<{ x: number; y: number; centerLng: number; centerLat: number } | null>(null);

/** 悬浮坐标 */
const hoverLngLat = ref<{ lng: number; lat: number } | null>(null);

/** 标记点像素位置 */
const markerPosition = computed(() => {
    if (!field.lngLat.value || !canvasRef.value) return null;
    const canvas = canvasRef.value;
    const pos = lngLatToPixel(
        field.lngLat.value.lng,
        field.lngLat.value.lat,
        centerLng.value,
        centerLat.value,
        zoom.value,
        canvas.clientWidth,
        canvas.clientHeight,
    );
    // 检查是否在可视区域内
    if (pos.x < 0 || pos.x > canvas.clientWidth || pos.y < 0 || pos.y > canvas.clientHeight) return null;
    return pos;
});

/** 请求渲染（防抖） */
const requestRender = () => {
    if (renderRaf) cancelAnimationFrame(renderRaf);
    renderRaf = requestAnimationFrame(() => {
        const canvas = canvasRef.value;
        if (canvas) renderTiles(canvas, centerLng.value, centerLat.value, zoom.value);
    });
};

/** 获取 Canvas 的 CSS 像素尺寸 */
const getCanvasLogicalSize = () => {
    const canvas = canvasRef.value;
    if (!canvas) return { w: 0, h: 0 };
    return { w: canvas.clientWidth, h: canvas.clientHeight };
};

/** 点击地图设置标记 */
const handleClick = (e: MouseEvent) => {
    if (props.readonly || isDragging.value) return;
    const canvas = canvasRef.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { w, h } = getCanvasLogicalSize();
    const scaleX = canvas.width / w;
    const scaleY = canvas.height / h;
    const lngLat = pixelToLngLat(
        x * scaleX,
        y * scaleY,
        centerLng.value,
        centerLat.value,
        zoom.value,
        canvas.width,
        canvas.height,
    );
    field.setLngLat(lngLat.lng, lngLat.lat);
    emits("update:modelValue", field.value.value);
    emits("change", field.value.value);
};

/** 地图拖拽开始 */
const handleDragStart = (e: MouseEvent) => {
    if (props.readonly) return;
    isDragging.value = true;
    dragStart.value = {
        x: e.clientX,
        y: e.clientY,
        centerLng: centerLng.value,
        centerLat: centerLat.value,
    };
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
};

const handleDragMove = (e: MouseEvent) => {
    if (!isDragging.value || !dragStart.value) return;
    const canvas = canvasRef.value;
    if (!canvas) return;
    const dx = e.clientX - dragStart.value.x;
    const dy = e.clientY - dragStart.value.y;
    // 反向移动（拖拽方向 = 地图移动方向）
    const { w, h } = getCanvasLogicalSize();
    const scaleX = canvas.width / w;
    const scaleY = canvas.height / h;
    const delta = pixelToLngLat(
        (dragStart.value.x - dx) * scaleX,
        (dragStart.value.y - dy) * scaleY,
        dragStart.value.centerLng,
        dragStart.value.centerLat,
        zoom.value,
        canvas.width,
        canvas.height,
    );
    centerLng.value = delta.lng;
    centerLat.value = delta.lat;
    requestRender();
};

const handleDragEnd = () => {
    isDragging.value = false;
    dragStart.value = null;
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
};

/** 滚轮缩放 */
const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
};

const zoomIn = () => {
    if (zoom.value < 18) {
        zoom.value++;
        requestRender();
    }
};

const zoomOut = () => {
    if (zoom.value > 1) {
        zoom.value--;
        requestRender();
    }
};

/** 鼠标移动显示坐标 */
const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { w, h } = getCanvasLogicalSize();
    const scaleX = canvas.width / w;
    const scaleY = canvas.height / h;
    hoverLngLat.value = pixelToLngLat(
        x * scaleX,
        y * scaleY,
        centerLng.value,
        centerLat.value,
        zoom.value,
        canvas.width,
        canvas.height,
    );
};

const handleMouseLeave = () => {
    hoverLngLat.value = null;
};

/** 清除 */
const handleClear = () => {
    field.clear();
    emits("update:modelValue", "");
    emits("change", "");
};

/** 选点确认 */
const handlePickerConfirm = (v: string) => {
    field.setValue(v);
    emits("update:modelValue", v);
    emits("change", v);
    pickerVisible.value = false;
    // 定位到选中点
    const parsed = parseLngLat(v);
    if (parsed) {
        centerLng.value = parsed.lng;
        centerLat.value = parsed.lat;
        requestRender();
    }
};

/** 解析坐标值 */
const parsedValue = computed(() => parseLngLat(field.value.value));

/** 内联 SVG 图标 */
const icons = {
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
};

/** modelValue 变化时同步地图中心 */
watch(
    () => props.modelValue,
    (v) => {
        if (v) {
            const parsed = parseLngLat(v);
            if (parsed) {
                centerLng.value = parsed.lng;
                centerLat.value = parsed.lat;
                requestRender();
            }
        }
    },
);

/** ResizeObserver */
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    const canvas = canvasRef.value;
    if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        requestRender();
    }

    // ResizeObserver
    resizeObserver = new ResizeObserver(() => {
        const canvas = canvasRef.value;
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(dpr, dpr);
            requestRender();
        }
    });
    if (canvas?.parentElement) resizeObserver.observe(canvas.parentElement);
});

onBeforeUnmount(() => {
    if (renderRaf) cancelAnimationFrame(renderRaf);
    if (resizeObserver) resizeObserver.disconnect();
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
});
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
                <el-button @click="pickerVisible = true">
                    <span class="svg-icon" v-html="icons.location"></span>
                    {{ i18n("map.field.select") }}
                </el-button>
                <el-button :disabled="!field.hasValue.value" @click="handleClear">
                    <span class="svg-icon" v-html="icons.delete"></span>
                </el-button>
            </div>
        </div>
        <div class="field-canvas" :style="{ height: `${canvasHeight}px` }">
            <canvas
                ref="canvasRef"
                @click="handleClick"
                @wheel="handleWheel"
                @mousedown="handleDragStart"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
                :class="{ clickable: !readonly }"
            />
            <!-- 标记点覆盖层 -->
            <div
                v-if="markerPosition"
                class="marker-overlay"
                :style="{ left: `${markerPosition.x}px`, top: `${markerPosition.y}px` }"
            >
                <div class="marker-pin"></div>
                <div class="marker-pulse"></div>
            </div>
            <!-- 缩放控件 -->
            <div class="zoom-control">
                <el-button size="small" @click="zoomIn">+</el-button>
                <span class="zoom-level">{{ zoom }}</span>
                <el-button size="small" @click="zoomOut">-</el-button>
            </div>
            <!-- 坐标显示 -->
            <div class="coord-display" v-if="hoverLngLat">
                {{ hoverLngLat.lng.toFixed(4) }}, {{ hoverLngLat.lat.toFixed(4) }}
            </div>
            <!-- 标记点坐标 -->
            <div class="marker-coord" v-if="parsedValue">
                {{ parsedValue.lng.toFixed(4) }}, {{ parsedValue.lat.toFixed(4) }}
            </div>

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
        position: relative;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        overflow: hidden;
        background: var(--el-fill-color-light);
        cursor: grab;

        &:active {
            cursor: grabbing;
        }

        canvas {
            width: 100%;
            height: 100%;
            display: block;

            &.clickable {
                cursor: crosshair;
            }
        }

        .marker-overlay {
            position: absolute;
            transform: translate(-50%, -100%);
            pointer-events: none;

            .marker-pin {
                width: 20px;
                height: 20px;
                background: #f56c6c;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid #fff;
            }

            .marker-pulse {
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: rgba(245, 108, 108, 0.2);
                animation: pulse 2s infinite;
                left: -5px;
                top: -5px;
            }
        }

        .zoom-control {
            position: absolute;
            right: 12px;
            bottom: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            background: var(--el-bg-color);
            padding: 4px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            .zoom-level {
                font-size: 11px;
                color: var(--el-text-color-secondary);
                text-align: center;
                min-width: 20px;
            }
        }

        .coord-display {
            position: absolute;
            left: 12px;
            bottom: 12px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-family: monospace;
        }

        .marker-coord {
            position: absolute;
            left: 12px;
            top: 12px;
            background: rgba(64, 158, 255, 0.9);
            color: #fff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-family: monospace;
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

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
</style>
