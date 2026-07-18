/**
 * IoT 告警中心状态管理
 */
import { computed, reactive, ref } from "vue";
import { createAlarm } from "../constants";
import type { IotAlarm, IotAlarmLevel, IotAlarmStats } from "../types";

export const useAlarmCenter = (initialAlarms: IotAlarm[] = []) => {
    // 告警列表（按时间倒序）
    const alarms = reactive<IotAlarm[]>(
        initialAlarms ? JSON.parse(JSON.stringify(initialAlarms)) : [],
    );
    // 级别过滤（null = 全部）
    const filterLevel = ref<IotAlarmLevel | null>(null);
    // 确认状态过滤（null = 全部, true = 已确认, false = 未确认）
    const filterAcknowledged = ref<boolean | null>(null);

    /** 过滤后的告警列表（按时间倒序） */
    const filteredAlarms = computed<IotAlarm[]>(() => {
        let list = alarms.slice();
        if (filterLevel.value) {
            list = list.filter((a) => a.level === filterLevel.value);
        }
        if (filterAcknowledged.value !== null) {
            list = list.filter((a) => a.acknowledged === filterAcknowledged.value);
        }
        return list.sort((a, b) => b.timestamp - a.timestamp);
    });

    /** 确认告警 */
    const acknowledgeAlarm = (id: string) => {
        const a = alarms.find((x) => x.id === id);
        if (a) a.acknowledged = true;
    };

    /** 解决告警 */
    const resolveAlarm = (id: string) => {
        const a = alarms.find((x) => x.id === id);
        if (a) {
            a.resolved = true;
            a.acknowledged = true;
        }
    };

    /** 新增告警 */
    const addAlarm = (alarm: Partial<IotAlarm> = {}): IotAlarm => {
        const a = createAlarm(alarm);
        alarms.push(a);
        return a;
    };

    /** 移除告警 */
    const removeAlarm = (id: string) => {
        const idx = alarms.findIndex((x) => x.id === id);
        if (idx >= 0) alarms.splice(idx, 1);
    };

    /** 按条件过滤告警 */
    const filterAlarms = (predicate: (a: IotAlarm) => boolean): IotAlarm[] =>
        alarms.filter(predicate);

    /** 统计告警数量 */
    const getStats = (): IotAlarmStats => {
        const stats: IotAlarmStats = {
            total: alarms.length,
            active: 0,
            acknowledged: 0,
            resolved: 0,
            byLevel: { info: 0, warning: 0, error: 0, critical: 0 },
        };
        for (const a of alarms) {
            stats.byLevel[a.level]++;
            if (a.resolved) {
                stats.resolved++;
            } else if (a.acknowledged) {
                stats.acknowledged++;
            } else {
                stats.active++;
            }
        }
        return stats;
    };

    /** 按设备 ID 获取告警 */
    const getAlarmsByDevice = (deviceId: string): IotAlarm[] =>
        alarms.filter((a) => a.deviceId === deviceId).sort((a, b) => b.timestamp - a.timestamp);

    return {
        alarms,
        filterLevel,
        filterAcknowledged,
        filteredAlarms,
        acknowledgeAlarm,
        resolveAlarm,
        addAlarm,
        removeAlarm,
        filterAlarms,
        getStats,
        getAlarmsByDevice,
    };
};
