/**
 * 数字孪生遥测 - 实时数据模拟
 *
 * startSim / stopSim / updateSensorData / getEntityMetrics
 */

import {ref} from "vue";
import {DT_DEFAULT_SIM_INTERVAL, dtCreateSensorData} from "../constants";
import type {DtEntity, DtSensorData} from "../types";

const rand = (min: number, max: number) =>
    Math.round((min + Math.random() * (max - min)) * 100) / 100;

export function useDigitalTwinTelemetry() {
    const simRunning = ref(false);
    let timer: number | null = null;

    /** 更新单个实体的传感器数据（在原值附近波动） */
    const updateSensorData = (entity: DtEntity): void => {
        if (!entity.sensorData) {
            entity.sensorData = dtCreateSensorData(entity.type);
            return;
        }
        const updated: DtSensorData = {};
        Object.entries(entity.sensorData).forEach(([key, metric]) => {
            // 在当前值 ±5% 范围内波动，且保持在 [value*0.8, value*1.2]
            const base = metric.value;
            const delta = base * 0.05;
            const next = rand(base - delta, base + delta);
            updated[key] = {...metric, value: next};
        });
        entity.sensorData = updated;
    };

    /** 启动模拟 */
    const startSim = (
        getEntities: () => DtEntity[],
        intervalMs: number = DT_DEFAULT_SIM_INTERVAL,
    ): void => {
        if (simRunning.value) return;
        simRunning.value = true;
        timer = window.setInterval(() => {
            getEntities().forEach((e) => {
                if (e.status !== "offline") {
                    updateSensorData(e);
                }
            });
        }, intervalMs);
    };

    /** 停止模拟 */
    const stopSim = (): void => {
        if (timer !== null) {
            window.clearInterval(timer);
            timer = null;
        }
        simRunning.value = false;
    };

    /** 切换模拟状态 */
    const toggleSim = (getEntities: () => DtEntity[]): void => {
        if (simRunning.value) {
            stopSim();
        } else {
            startSim(getEntities);
        }
    };

    /** 取得实体的指标列表（用于属性面板展示） */
    const getEntityMetrics = (entity: DtEntity): {
        key: string;
        labelKey: string;
        unitKey: string;
        value: number
    }[] => {
        if (!entity.sensorData) return [];
        return Object.entries(entity.sensorData).map(([key, m]) => ({
            key,
            labelKey: m.labelKey,
            unitKey: m.unitKey,
            value: m.value,
        }));
    };

    return {
        simRunning,
        startSim,
        stopSim,
        toggleSim,
        updateSensorData,
        getEntityMetrics,
    };
}

export type UseDigitalTwinTelemetryReturn = ReturnType<typeof useDigitalTwinTelemetry>;
