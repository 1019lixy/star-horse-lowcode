/**
 * 热力图状态管理
 */
import {computed, reactive, ref} from "vue";
import {DEFAULT_HEAT_GRADIENT, DEFAULT_HEAT_RADIUS} from "../constants";
import type {HeatGradientStop, HeatPoint} from "../types";

export const useHeatmap = (initialPoints: HeatPoint[] = []) => {
    const points = reactive<HeatPoint[]>(JSON.parse(JSON.stringify(initialPoints)));
    const radius = ref(DEFAULT_HEAT_RADIUS);
    const gradient = ref<HeatGradientStop[]>([...DEFAULT_HEAT_GRADIENT]);
    const opacity = ref(0.6);

    const pointCount = computed(() => points.length);

    const maxWeight = computed(() => points.reduce((m, p) => Math.max(m, p.weight), 0));

    const addPoint = (p: HeatPoint) => {
        points.push({...p});
    };

    const addPoints = (ps: HeatPoint[]) => {
        points.push(...ps.map((p) => ({...p})));
    };

    const removePoint = (idx: number) => {
        points.splice(idx, 1);
    };

    const clear = () => {
        points.splice(0, points.length);
    };

    /** 按经纬度聚类聚合权重（格子法） */
    const aggregateByGrid = (gridSize: number) => {
        const map = new Map<string, HeatPoint>();
        for (const p of points) {
            const key = `${Math.floor(p.lng / gridSize)}_${Math.floor(p.lat / gridSize)}`;
            const ex = map.get(key);
            if (ex) {
                ex.lng = (ex.lng + p.lng) / 2;
                ex.lat = (ex.lat + p.lat) / 2;
                ex.weight += p.weight;
            } else {
                map.set(key, {...p});
            }
        }
        points.splice(0, points.length, ...Array.from(map.values()));
    };

    const setRadius = (r: number) => {
        radius.value = Math.max(1, r);
    };

    const setOpacity = (o: number) => {
        opacity.value = Math.max(0, Math.min(1, o));
    };

    const loadPoints = (data: HeatPoint[]) => {
        points.splice(0, points.length, ...JSON.parse(JSON.stringify(data)));
    };

    return {
        points,
        radius,
        gradient,
        opacity,
        pointCount,
        maxWeight,
        addPoint,
        addPoints,
        removePoint,
        clear,
        aggregateByGrid,
        setRadius,
        setOpacity,
        loadPoints,
    };
};

export type HeatmapState = ReturnType<typeof useHeatmap>;
