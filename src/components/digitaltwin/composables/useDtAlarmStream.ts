/**
 * 数字孪生 - 告警事件流
 *
 * - 维护告警事件列表（active/acknowledged/resolved）
 * - 支持手动/系统/阈值/定时 4 种来源
 * - 提供 push / acknowledge / resolve / clear 方法
 * - 支持按级别、状态、来源过滤
 * - 通过 onNewAlarm 回调通知 UI 弹窗
 * - 提供 stats computed（按级别统计）
 */
import {computed, type ComputedRef, ref} from "vue";
import type {DtAlarmEvent, DtAlarmEventLevel, DtAlarmEventStatus} from "../types";

export interface UseDtAlarmStreamOptions {
    /** 最大保留条数（默认 200） */
    maxItems?: number;
    /** 新告警到达时的回调（用于弹窗提示） */
    onNewAlarm?: (event: DtAlarmEvent) => void;
}

export interface DtAlarmFilter {
    level?: DtAlarmEventLevel | "all";
    status?: DtAlarmEventStatus | "all";
    source?: DtAlarmEvent["source"] | "all";
    keyword?: string;
}

export interface UseDtAlarmStreamReturn {
    /** 全量事件（按时间倒序） */
    events: ReturnType<typeof ref<DtAlarmEvent[]>>;
    /** 当前过滤器 */
    filter: ReturnType<typeof ref<DtAlarmFilter>>;
    /** 过滤后的列表 */
    filteredEvents: ComputedRef<DtAlarmEvent[]>;
    /** 未确认数 */
    activeCount: ComputedRef<number>;
    /** 各级别统计 */
    stats: ComputedRef<{ info: number; warning: number; alarm: number; critical: number }>;
    /** 未读事件计数（用于徽标） */
    unreadCount: ReturnType<typeof ref<number>>;
    /** 推送新告警 */
    push: (event: Omit<DtAlarmEvent, "id" | "timestamp" | "status"> & Partial<Pick<DtAlarmEvent, "id" | "timestamp" | "status">>) => DtAlarmEvent;
    /** 确认告警 */
    acknowledge: (id: string) => void;
    /** 确认全部 active */
    acknowledgeAll: () => void;
    /** 解决告警 */
    resolve: (id: string) => void;
    /** 清空已解决 */
    clearResolved: () => void;
    /** 清空全部 */
    clearAll: () => void;
    /** 标记全部为已读 */
    markAllRead: () => void;
}

let idCounter = 0;
const genId = (): string => {
    idCounter += 1;
    return `alarm_${Date.now()}_${idCounter}`;
};

export function useDtAlarmStream(options: UseDtAlarmStreamOptions = {}): UseDtAlarmStreamReturn {
    const maxItems = options.maxItems ?? 200;
    const events = ref<DtAlarmEvent[]>([]);
    const filter = ref<DtAlarmFilter>({level: "all", status: "all", source: "all", keyword: ""});
    const unreadCount = ref(0);

    const filteredEvents = computed(() => {
        const f = filter.value;
        let list = events.value;
        if (f.level && f.level !== "all") list = list.filter((e) => e.level === f.level);
        if (f.status && f.status !== "all") list = list.filter((e) => e.status === f.status);
        if (f.source && f.source !== "all") list = list.filter((e) => e.source === f.source);
        if (f.keyword) {
            const kw = f.keyword.toLowerCase();
            list = list.filter(
                (e) =>
                    e.title.toLowerCase().includes(kw) ||
                    (e.entityName ?? "").toLowerCase().includes(kw) ||
                    (e.description ?? "").toLowerCase().includes(kw),
            );
        }
        return list;
    });

    const activeCount = computed(() => events.value.filter((e) => e.status === "active").length);

    const stats = computed(() => {
        const result = {info: 0, warning: 0, alarm: 0, critical: 0};
        for (const e of events.value) {
            if (e.status === "active") {
                result[e.level] += 1;
            }
        }
        return result;
    });

    const push: UseDtAlarmStreamReturn["push"] = (input) => {
        const event: DtAlarmEvent = {
            id: input.id ?? genId(),
            timestamp: input.timestamp ?? Date.now(),
            status: input.status ?? "active",
            ...input,
        };
        events.value.unshift(event);
        // 超出上限裁剪尾部
        if (events.value.length > maxItems) {
            events.value = events.value.slice(0, maxItems);
        }
        if (event.status === "active") {
            unreadCount.value += 1;
            options.onNewAlarm?.(event);
        }
        return event;
    };

    const acknowledge = (id: string): void => {
        const e = events.value.find((it) => it.id === id);
        if (e && e.status === "active") {
            e.status = "acknowledged";
            e.acknowledgedAt = Date.now();
        }
    };

    const acknowledgeAll = (): void => {
        for (const e of events.value) {
            if (e.status === "active") {
                e.status = "acknowledged";
                e.acknowledgedAt = Date.now();
            }
        }
    };

    const resolve = (id: string): void => {
        const e = events.value.find((it) => it.id === id);
        if (e && e.status !== "resolved") {
            e.status = "resolved";
            e.resolvedAt = Date.now();
        }
    };

    const clearResolved = (): void => {
        events.value = events.value.filter((e) => e.status !== "resolved");
    };

    const clearAll = (): void => {
        events.value = [];
        unreadCount.value = 0;
    };

    const markAllRead = (): void => {
        unreadCount.value = 0;
    };

    return {
        events,
        filter,
        filteredEvents,
        activeCount,
        stats,
        unreadCount,
        push,
        acknowledge,
        acknowledgeAll,
        resolve,
        clearResolved,
        clearAll,
        markAllRead,
    };
}
