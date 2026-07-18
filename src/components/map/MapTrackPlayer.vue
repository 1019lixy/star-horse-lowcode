<script setup lang="ts" name="MapTrackPlayer">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { i18n } from "@/lang";
import { useTrackPlayer } from "./composables/useTrackPlayer";
import { DEFAULT_MAP_BOUNDS, DEFAULT_TRACK_COLOR, DEFAULT_TRAVELED_COLOR, TRACK_SPEED_PRESETS } from "./constants";
import { project } from "./utils/MapProjection";
import type { MapBounds, TrackData } from "./types";

const props = defineProps<{
    tracks?: TrackData[];
    bounds?: MapBounds;
    backgroundImage?: string;
    height?: number;
    autoPlay?: boolean;
}>();

const emits = defineEmits<{
    (e: "reach-end", trackId: string): void;
    (e: "point-change", idx: number): void;
}>();

const player = useTrackPlayer(props.tracks ?? []);
const canvasWidth = ref(900);
const canvasHeight = ref(props.height ?? 400);
const bounds = computed<MapBounds>(() => props.bounds ?? DEFAULT_MAP_BOUNDS);

/** 所有轨迹的像素路径 */
const trackPaths = computed(() =>
    player.tracks.map((track) => {
        const pts = track.points.map((p) => project({ lng: p.lng, lat: p.lat }, bounds.value, canvasWidth.value, canvasHeight.value, 10));
        const fullPath = pts.length > 0 ? `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ") : "";
        return {
            id: track.id,
            name: track.name,
            color: track.color ?? DEFAULT_TRACK_COLOR,
            traveledColor: track.traveledColor ?? DEFAULT_TRAVELED_COLOR,
            fullPath,
            points: pts,
            totalCount: pts.length,
        };
    }),
);

/** 当前轨迹的已走过路径像素坐标 */
const currentTraveledPath = computed(() => {
    const track = player.currentTrack.value;
    if (!track || track.points.length === 0) return "";
    const idx = player.currentIndex.value;
    const pts = track.points.slice(0, idx + 1).map((p) => project({ lng: p.lng, lat: p.lat }, bounds.value, canvasWidth.value, canvasHeight.value, 10));
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    let path = `M ${pts[0].x},${pts[0].y} `;
    for (let i = 1; i < pts.length; i++) {
        path += `L ${pts[i].x},${pts[i].y} `;
    }
    return path;
});

/** 当前移动点像素 */
const currentMarker = computed(() => {
    const pos = player.currentPoint.value;
    if (!pos) return null;
    return project(pos.position, bounds.value, canvasWidth.value, canvasHeight.value, 10);
});

const handlePlayPause = () => {
    if (player.isPlaying.value) {
        player.pause();
    } else {
        player.play();
    }
};

const handleStop = () => player.stop();

const handleSeek = (p: number) => player.seek(p);

const handleSpeedChange = (s: number) => player.setSpeed(s);

const handleTrackChange = (id: string) => player.setCurrentTrack(id);

watch(
    () => player.currentIndex.value,
    (idx) => emits("point-change", idx),
);

watch(
    () => player.progress.value,
    (p) => {
        if (p >= 1) {
            const track = player.currentTrack.value;
            if (track) emits("reach-end", track.id);
        }
    },
);

onBeforeUnmount(() => {
    player.pause();
});

const formatTime = (ms: number) => {
    if (!ms) return "--";
    const date = new Date(ms);
    return date.toLocaleTimeString();
};
</script>

<template>
    <div class="map-track-player">
        <div class="player-canvas" :style="{ height: `${canvasHeight}px` }">
            <svg
                :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
            >
                <image
                    v-if="backgroundImage"
                    :href="backgroundImage"
                    :x="10" :y="10"
                    :width="canvasWidth - 20"
                    :height="canvasHeight - 20"
                    preserveAspectRatio="xMidYMid slice"
                    opacity="0.4"
                />
                <rect
                    :x="10" :y="10"
                    :width="canvasWidth - 20"
                    :height="canvasHeight - 20"
                    fill="none"
                    stroke="var(--el-border-color)"
                />
                <!-- 所有轨迹（灰色底层） -->
                <path
                    v-for="tp in trackPaths"
                    :key="tp.id"
                    :d="tp.fullPath"
                    fill="none"
                    :stroke="tp.color"
                    stroke-width="2"
                    stroke-opacity="0.35"
                />
                <!-- 当前轨迹已走过部分（高亮） -->
                <path
                    v-if="currentTraveledPath"
                    :d="currentTraveledPath"
                    fill="none"
                    :stroke="DEFAULT_TRAVELED_COLOR"
                    stroke-width="3"
                />
                <!-- 当前位置标记 -->
                <g v-if="currentMarker">
                    <circle
                        :cx="currentMarker.x"
                        :cy="currentMarker.y"
                        :r="8"
                        fill="#409EFF"
                        stroke="#FFFFFF"
                        stroke-width="2"
                    />
                    <circle :cx="currentMarker.x" :cy="currentMarker.y" :r="14" fill="none" stroke="#409EFF" stroke-width="1" stroke-opacity="0.5">
                        <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="stroke-opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                </g>
                <!-- 空状态 -->
                <text
                    v-if="trackPaths.length === 0"
                    :x="canvasWidth / 2"
                    :y="canvasHeight / 2"
                    text-anchor="middle"
                    font-size="14"
                    fill="var(--el-text-color-placeholder)"
                >
                    {{ i18n("map.track.empty") }}
                </text>
            </svg>
        </div>
        <div class="player-controls">
            <div class="left-controls">
                <el-button  @click="handlePlayPause" :disabled="player.totalPoints.value < 2">
                    <el-icon>
                        <VideoPlay v-if="!player.isPlaying.value"/>
                        <VideoPause v-else/>
                    </el-icon>
                    {{ player.isPlaying.value ? i18n("map.track.pause") : i18n("map.track.play") }}
                </el-button>
                <el-button  @click="handleStop">
                    <el-icon><SwitchButton/></el-icon>
                    {{ i18n("map.track.stop") }}
                </el-button>
                <el-select
                    v-if="player.tracks.length > 1"
                    :model-value="player.currentTrackId.value"

                    style="width: 180px"
                    @change="handleTrackChange"
                >
                    <el-option
                        v-for="t in player.tracks"
                        :key="t.id"
                        :label="t.name || t.id"
                        :value="t.id"
                    />
                </el-select>
            </div>
            <div class="center-controls">
                <span class="control-label">{{ i18n("map.track.progress") }}</span>
                <el-slider
                    :model-value="player.progress.value"
                    :max="1"
                    :step="0.001"
                    :show-tooltip="false"
                    style="flex: 1; margin: 0 12px;"
                    @input="handleSeek"
                />
                <span class="progress-text">
                    {{ player.currentIndex.value + 1 }} / {{ player.totalPoints.value }}
                </span>
            </div>
            <div class="right-controls">
                <span class="control-label">{{ i18n("map.track.speed") }}</span>
                <el-select
                    :model-value="player.speed.value"

                    style="width: 90px"
                    @change="handleSpeedChange"
                >
                    <el-option
                        v-for="opt in TRACK_SPEED_PRESETS"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
                <span class="current-time" v-if="player.currentPoint.value?.point.time">
                    {{ formatTime(player.currentPoint.value.point.time) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { VideoPlay, VideoPause, SwitchButton } from "@element-plus/icons-vue";
export default { components: { VideoPlay, VideoPause, SwitchButton } };
</script>

<style lang="scss" scoped>
.map-track-player {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .player-canvas {
        flex: 1;
        background: var(--el-fill-color-light);
        overflow: hidden;

        svg {
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    .player-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: var(--el-bg-color);
        border-top: 1px solid var(--el-border-color);
        flex-wrap: wrap;

        .left-controls,
        .center-controls,
        .right-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .center-controls {
            flex: 1;
            min-width: 280px;
        }

        .control-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            white-space: nowrap;
        }

        .progress-text {
            font-size: 12px;
            color: var(--el-text-color-regular);
            min-width: 60px;
            text-align: right;
        }

        .current-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            font-family: monospace;
        }
    }
}
</style>
