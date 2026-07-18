/**
 * 白板组件 - 撤销/重做栈
 *
 * 维护 past / future 两个快照栈
 * 通过 push(snapshot) 推入新状态、undo/redo 进行切换
 */
import { computed, ref } from "vue";

export const useWhiteboardHistory = <T>(initial: T, maxLen = 50) => {
    const past = ref<T[]>([]) as unknown as { value: T[] };
    const future = ref<T[]>([]) as unknown as { value: T[] };
    const current = ref<T>(initial) as unknown as { value: T };

    const canUndo = computed(() => past.value.length > 0);
    const canRedo = computed(() => future.value.length > 0);

    /** 深拷贝快照 */
    const snapshot = (val: T): T =>
        val === null || val === undefined
            ? val
            : (JSON.parse(JSON.stringify(val)) as T);

    /** 推入新状态：当前压入 past，清空 future，更新当前 */
    const push = (next: T) => {
        past.value.push(snapshot(current.value));
        if (past.value.length > maxLen) past.value.shift();
        current.value = snapshot(next);
        future.value.splice(0, future.value.length);
    };

    /** 直接替换当前（不入栈） */
    const replace = (next: T) => {
        current.value = snapshot(next);
    };

    /** 撤销 */
    const undo = (): T | null => {
        if (past.value.length === 0) return null;
        future.value.push(snapshot(current.value));
        const prev = past.value.pop() as T;
        current.value = prev;
        return current.value;
    };

    /** 重做 */
    const redo = (): T | null => {
        if (future.value.length === 0) return null;
        past.value.push(snapshot(current.value));
        const nextVal = future.value.pop() as T;
        current.value = nextVal;
        return current.value;
    };

    /** 清空历史 */
    const clear = () => {
        past.value.splice(0, past.value.length);
        future.value.splice(0, future.value.length);
    };

    /** 重置到指定状态 */
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

export type UseWhiteboardHistoryReturn<T> = ReturnType<typeof useWhiteboardHistory<T>>;
