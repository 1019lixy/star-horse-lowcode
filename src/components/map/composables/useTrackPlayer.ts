/**
 * 轨迹回放状态管理
 */
import {computed, reactive, ref, shallowRef} from "vue";
import {interpolate} from "../utils/MapProjection";
import type {LngLat, TrackData, TrackPoint} from "../types";

export const useTrackPlayer = (initialTracks: TrackData[] = []) => {
    const tracks = reactive<TrackData[]>(JSON.parse(JSON.stringify(initialTracks)));
    const currentTrackId = ref<string | null>(tracks[0]?.id ?? null);
    const isPlaying = ref(false);
    const progress = ref(0); // 0-1
    const speed = ref(1);
    const currentIndex = ref(0);
    const currentPosition = ref<LngLat | null>(null);

    const animationFrameId = shallowRef<number | null>(null);
    const lastTimestamp = shallowRef<number>(0);
    const elapsed = ref(0); // 已播放时长（毫秒）

    const currentTrack = computed<TrackData | null>(
        () => tracks.find((t) => t.id === currentTrackId.value) ?? null,
    );

    const totalPoints = computed(() => currentTrack.value?.points.length ?? 0);

    const totalDuration = computed(() => {
        const pts = currentTrack.value?.points;
        if (!pts || pts.length < 2) return 0;
        const first = pts[0].time ?? 0;
        const last = pts[pts.length - 1].time ?? 0;
        return Math.max(0, last - first);
    });

    /** 当前点（含插值位置） */
    const currentPoint = computed<{ point: TrackPoint; position: LngLat; index: number } | null>(() => {
        const track = currentTrack.value;
        if (!track || track.points.length === 0) return null;
        const idx = currentIndex.value;
        const pt = track.points[idx];
        if (!pt) return null;
        return {point: pt, position: currentPosition.value ?? {lng: pt.lng, lat: pt.lat}, index: idx};
    });

    const setCurrentTrack = (id: string) => {
        currentTrackId.value = id;
        stop();
        seek(0);
    };

    const play = () => {
        if (!currentTrack.value || totalPoints.value < 2) return;
        isPlaying.value = true;
        lastTimestamp.value = performance.now();
        tick(performance.now());
    };

    const pause = () => {
        isPlaying.value = false;
        if (animationFrameId.value !== null) {
            cancelAnimationFrame(animationFrameId.value);
            animationFrameId.value = null;
        }
    };

    const stop = () => {
        pause();
        seek(0);
    };

    const seek = (p: number) => {
        const clamped = Math.max(0, Math.min(1, p));
        progress.value = clamped;
        const track = currentTrack.value;
        if (!track || track.points.length === 0) return;
        const idx = Math.floor(clamped * (track.points.length - 1));
        currentIndex.value = idx;
        const next = track.points[idx + 1];
        const cur = track.points[idx];
        if (next && cur) {
            const localT = clamped * (track.points.length - 1) - idx;
            currentPosition.value = interpolate({lng: cur.lng, lat: cur.lat}, {lng: next.lng, lat: next.lat}, localT);
        } else if (cur) {
            currentPosition.value = {lng: cur.lng, lat: cur.lat};
        }
        elapsed.value = clamped * totalDuration.value;
    };

    const tick = (now: number) => {
        if (!isPlaying.value) return;
        const delta = now - lastTimestamp.value;
        lastTimestamp.value = now;
        const total = totalDuration.value;
        if (total <= 0) {
            // 无时间戳，按点数推进
            elapsed.value += delta * speed.value;
            const perPoint = 1000; // 1秒一个点
            const newIdx = Math.floor(elapsed.value / perPoint);
            if (newIdx >= totalPoints.value - 1) {
                seek(1);
                pause();
                return;
            }
            currentIndex.value = newIdx;
            const cur = currentTrack.value!.points[newIdx];
            currentPosition.value = {lng: cur.lng, lat: cur.lat};
            progress.value = newIdx / (totalPoints.value - 1);
        } else {
            elapsed.value += delta * speed.value;
            if (elapsed.value >= total) {
                seek(1);
                pause();
                return;
            }
            seek(elapsed.value / total);
        }
        animationFrameId.value = requestAnimationFrame(tick);
    };

    const setSpeed = (s: number) => {
        speed.value = Math.max(0.1, s);
    };

    const loadTracks = (data: TrackData[]) => {
        tracks.splice(0, tracks.length, ...JSON.parse(JSON.stringify(data)));
        currentTrackId.value = tracks[0]?.id ?? null;
        stop();
    };

    const addTrack = (track: TrackData) => {
        tracks.push(track);
        if (!currentTrackId.value) currentTrackId.value = track.id;
    };

    const removeTrack = (id: string) => {
        const idx = tracks.findIndex((t) => t.id === id);
        if (idx < 0) return;
        tracks.splice(idx, 1);
        if (currentTrackId.value === id) {
            currentTrackId.value = tracks[0]?.id ?? null;
            stop();
        }
    };

    return {
        tracks,
        currentTrackId,
        currentTrack,
        isPlaying,
        progress,
        speed,
        currentIndex,
        currentPoint,
        totalPoints,
        totalDuration,
        elapsed,
        play,
        pause,
        stop,
        seek,
        setSpeed,
        setCurrentTrack,
        loadTracks,
        addTrack,
        removeTrack,
    };
};

export type TrackPlayerState = ReturnType<typeof useTrackPlayer>;
