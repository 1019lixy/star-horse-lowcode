/**
 * IoT 实时图表状态管理（模拟实时数据推送）
 */
import {onBeforeUnmount, reactive, ref, shallowRef} from "vue";
import type {IotChartConfig, IotChartSeries, IotTimeSeriesPoint} from "../types";

export const useRealtimeChart = (
    initialSeries: IotChartSeries[] = [],
    initialConfig?: Partial<IotChartConfig>,
) => {
    // 图表系列
    const series = reactive<IotChartSeries[]>(
        initialSeries ? JSON.parse(JSON.stringify(initialSeries)) : [],
    );
    // 图表配置
    const config = reactive<IotChartConfig>({
        title: initialConfig?.title ?? "",
        unit: initialConfig?.unit ?? "",
        yMin: initialConfig?.yMin,
        yMax: initialConfig?.yMax,
        refreshInterval: initialConfig?.refreshInterval ?? 2000,
        windowSize: initialConfig?.windowSize ?? 30,
    });
    // 运行状态
    const isRunning = ref(false);
    // 定时器句柄
    const timer = shallowRef<ReturnType<typeof setInterval> | null>(null);

    /** 推送一个新数据点到指定系列 */
    const pushPoint = (index: number, point: IotTimeSeriesPoint) => {
        const s = series[index];
        if (!s) return;
        s.data.push(point);
        // 维护滑动窗口
        const win = config.windowSize ?? 30;
        if (s.data.length > win) {
            s.data.splice(0, s.data.length - win);
        }
    };

    /** 模拟生成下一个数据点（基于上一值 + 平滑波动） */
    const generateNextPoint = (s: IotChartSeries): IotTimeSeriesPoint => {
        const last = s.data.length > 0 ? s.data[s.data.length - 1] : null;
        const lastVal = last ? Number(last.value) : 50;
        const delta = (Math.random() - 0.5) * 8;
        const nextVal = Number(Math.max(0, lastVal + delta).toFixed(2));
        return {timestamp: Date.now(), value: nextVal};
    };

    /** 开始实时推送 */
    const start = () => {
        if (isRunning.value) return;
        isRunning.value = true;
        const tick = () => {
            for (let i = 0; i < series.length; i++) {
                if (series[i].visible !== false) {
                    pushPoint(i, generateNextPoint(series[i]));
                }
            }
        };
        tick();
        timer.value = setInterval(tick, Math.max(200, config.refreshInterval));
    };

    /** 停止推送 */
    const stop = () => {
        isRunning.value = false;
        if (timer.value) {
            clearInterval(timer.value);
            timer.value = null;
        }
    };

    /** 切换运行/暂停 */
    const toggle = () => {
        if (isRunning.value) stop();
        else start();
    };

    /** 清空所有数据 */
    const clear = () => {
        for (const s of series) s.data.splice(0, s.data.length);
    };

    /** 新增系列 */
    const addSeries = (s: IotChartSeries) => {
        series.push(s);
    };

    /** 移除系列 */
    const removeSeries = (index: number) => {
        if (index >= 0 && index < series.length) series.splice(index, 1);
    };

    /** 切换系列可见性 */
    const toggleSeries = (index: number) => {
        const s = series[index];
        if (s) s.visible = !(s.visible ?? true);
    };

    /** 更新配置 */
    const updateConfig = (updates: Partial<IotChartConfig>) => {
        Object.assign(config, updates);
        // 若运行中且间隔改变，重启定时器
        if (updates.refreshInterval !== undefined && isRunning.value) {
            stop();
            start();
        }
    };

    onBeforeUnmount(() => {
        stop();
    });

    return {
        series,
        config,
        isRunning,
        start,
        stop,
        toggle,
        clear,
        addSeries,
        removeSeries,
        toggleSeries,
        updateConfig,
    };
};
