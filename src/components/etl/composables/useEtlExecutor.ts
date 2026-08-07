/**
 * ETL 管道执行模拟器（前端模拟，真实场景需对接后端执行引擎）
 */
import {ref} from "vue";
import type {EtlNode, EtlPipeline} from "../types";
import {findPreset} from "../constants";

export const useEtlExecutor = () => {
    const isRunning = ref(false);
    const currentExecutingId = ref<string | null>(null);
    const log = ref<{ time: string; nodeId?: string; level: "info" | "warn" | "error"; message: string }[]>([]);

    const addLog = (level: "info" | "warn" | "error", message: string, nodeId?: string) => {
        log.value.push({
            time: new Date().toLocaleTimeString(),
            level,
            message,
            nodeId,
        });
    };

    const clearLog = () => {
        log.value.splice(0, log.value.length);
    };

    /** 拓扑排序 */
    const topologicalSort = (pipeline: EtlPipeline): EtlNode[] => {
        const inDegree = new Map<string, number>();
        const adjList = new Map<string, string[]>();
        for (const n of pipeline.nodes) {
            inDegree.set(n.id, 0);
            adjList.set(n.id, []);
        }
        for (const e of pipeline.edges) {
            adjList.get(e.source)?.push(e.target);
            inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
        }
        const queue: string[] = [];
        for (const [id, deg] of inDegree.entries()) {
            if (deg === 0) queue.push(id);
        }
        const sorted: EtlNode[] = [];
        while (queue.length > 0) {
            const id = queue.shift()!;
            const node = pipeline.nodes.find((n) => n.id === id);
            if (node) sorted.push(node);
            for (const next of adjList.get(id) ?? []) {
                inDegree.set(next, (inDegree.get(next) ?? 0) - 1);
                if (inDegree.get(next) === 0) queue.push(next);
            }
        }
        // 检查环
        if (sorted.length < pipeline.nodes.length) {
            addLog("error", "管道存在循环依赖，无法执行");
            return [];
        }
        return sorted;
    };

    /** 模拟执行单个节点 */
    const executeNode = async (node: EtlNode): Promise<{ rowCount: number }> => {
        const preset = findPreset(node.type);
        const start = performance.now();
        // 模拟处理时间
        await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 400));
        // 模拟行数
        let rowCount = 0;
        if (preset?.category === "source") {
            rowCount = Math.floor(50 + Math.random() * 500);
        } else if (preset?.category === "transform") {
            // 转换节点行数取上游
            rowCount = Math.floor(20 + Math.random() * 300);
        } else if (preset?.category === "destination") {
            rowCount = Math.floor(20 + Math.random() * 200);
        } else {
            rowCount = Math.floor(10 + Math.random() * 100);
        }
        const duration = Math.round(performance.now() - start);
        node.duration = duration;
        node.rowCount = rowCount;
        node.status = "success";
        return {rowCount};
    };

    /** 执行整个管道 */
    const execute = async (pipeline: EtlPipeline): Promise<boolean> => {
        if (isRunning.value) return false;
        isRunning.value = true;
        clearLog();
        addLog("info", "开始执行管道");

        // 重置状态
        for (const n of pipeline.nodes) {
            n.status = "idle";
            n.rowCount = undefined;
            n.error = undefined;
            n.duration = undefined;
        }

        const sorted = topologicalSort(pipeline);
        if (sorted.length === 0 && pipeline.nodes.length > 0) {
            isRunning.value = false;
            return false;
        }

        let success = true;
        for (const node of sorted) {
            currentExecutingId.value = node.id;
            node.status = "running";
            addLog("info", `执行节点: ${node.name}`, node.id);
            try {
                await executeNode(node);
                addLog("info", `节点完成: ${node.name}，处理 ${node.rowCount} 条记录`, node.id);
            } catch (err: any) {
                node.status = "error";
                node.error = err?.message ?? String(err);
                addLog("error", `节点失败: ${node.name} - ${node.error}`, node.id);
                success = false;
                break;
            }
        }

        currentExecutingId.value = null;
        if (success) {
            addLog("info", "管道执行完成");
        } else {
            addLog("warn", "管道执行中止");
        }
        isRunning.value = false;
        return success;
    };

    const stop = () => {
        isRunning.value = false;
        currentExecutingId.value = null;
        addLog("warn", "执行已手动停止");
    };

    return {
        isRunning,
        currentExecutingId,
        log,
        execute,
        stop,
        clearLog,
    };
};

export type EtlExecutor = ReturnType<typeof useEtlExecutor>;
