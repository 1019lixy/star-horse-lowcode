/**
 * Office 文档撤销/重做栈：维护 past 与 future 两个快照栈
 */
import { computed, ref } from "vue";

export interface OfficeHistory<T> {
    past: T[];
    future: T[];
    /** 当前状态（独立保存，不在 past/future 中） */
    current: T;
    /** 最大历史长度 */
    maxLen: number;
}

export const useOfficeHistory = <T>(initial: T, maxLen = 50) => {
    const past = ref<T[]>([]) as unknown as { value: T[] };
    const future = ref<T[]>([]) as unknown as { value: T[] };
    const current = ref<T>(initial) as unknown as { value: T };

    /** 当前是否可撤销 */
    const canUndo = computed(() => past.value.length > 0);
    /** 当前是否可重做 */
    const canRedo = computed(() => future.value.length > 0);

    /** 深拷贝快照（JSON 方式，适用于纯数据结构） */
    const snapshot = (val: T): T =>
        val === null || val === undefined
            ? val
            : (JSON.parse(JSON.stringify(val)) as T);

    /** 推入新状态：当前状态压入 past 栈，清空 future 栈，更新当前 */
    const push = (next: T) => {
        // 当前状态压入 past
        past.value.push(snapshot(current.value));
        // 限制历史长度
        if (past.value.length > maxLen) past.value.shift();
        // 更新当前
        current.value = snapshot(next);
        // 清空 future
        future.value.splice(0, future.value.length);
    };

    /** 直接替换当前状态（不进入历史栈，用于外部加载/初始化） */
    const replace = (next: T) => {
        current.value = snapshot(next);
    };

    /** 撤销：past 弹出 -> current 入 future，past 顶部成为新 current */
    const undo = (): T | null => {
        if (past.value.length === 0) return null;
        // 当前状态入 future
        future.value.push(snapshot(current.value));
        // 从 past 弹出顶部作为新的当前
        const prev = past.value.pop()!;
        current.value = prev;
        return current.value;
    };

    /** 重做：future 弹出 -> current 入 past，future 顶部成为新 current */
    const redo = (): T | null => {
        if (future.value.length === 0) return null;
        // 当前状态入 past
        past.value.push(snapshot(current.value));
        // 从 future 弹出顶部作为新的当前
        const nextVal = future.value.pop()!;
        current.value = nextVal;
        return current.value;
    };

    /** 清空历史栈（保留当前状态） */
    const clear = () => {
        past.value.splice(0, past.value.length);
        future.value.splice(0, future.value.length);
    };

    /** 重置到指定状态并清空历史 */
    const reset = (val: T) => {
        past.value.splice(0, past.value.length);
        future.value.splice(0, future.value.length);
        current.value = snapshot(val);
    };

    return {
        past,
        future,
        current,
        canUndo,
        canRedo,
        push,
        replace,
        undo,
        redo,
        clear,
        reset,
    };
};
