/**
 * 命令历史栈（对标 Astral3D History）
 *
 * 维护 undos/redos 两个栈。
 * 支持可合并命令（updatable）：相同类型+相同实体的命令在 500ms 内合并。
 */
import { useDispatchSignal, SIGNAL_NAMES } from "./DtSignals";
import type { Command } from "./commands";

const MERGE_TIME_MS = 500;

interface HistoryEntry {
    cmd: Command;
    id: number;
    time: number;
}

export class DtHistory {
    private undos: HistoryEntry[] = [];
    private redos: HistoryEntry[] = [];
    private idCounter = 0;
    private readonly limit: number;

    constructor(limit = 100) {
        this.limit = limit;
    }

    /** 执行命令并推入历史栈 */
    execute(cmd: Command): void {
        const now = Date.now();
        const last = this.undos[this.undos.length - 1];
        // 判断是否可合并
        if (last && this.canMerge(last, cmd, now)) {
            last.cmd.update(cmd);
            last.time = now;
        } else {
            cmd.execute();
            const entry: HistoryEntry = { cmd, id: ++this.idCounter, time: now };
            this.undos.push(entry);
            // 超出上限移除最早
            if (this.undos.length > this.limit) {
                this.undos.shift();
            }
        }
        // 执行（合并时已 execute 过原始命令，此处仅合并不重复 execute）
        if (!last || !this.canMerge(last, cmd, now)) {
            // cmd.execute() 已在上面调用
        }
        // 清空 redo
        this.redos = [];
        useDispatchSignal(SIGNAL_NAMES.historyChanged, cmd);
    }

    /** 撤销 */
    undo(): void {
        const entry = this.undos.pop();
        if (!entry) return;
        entry.cmd.undo();
        this.redos.push(entry);
        useDispatchSignal(SIGNAL_NAMES.historyChanged, entry.cmd);
    }

    /** 重做 */
    redo(): void {
        const entry = this.redos.pop();
        if (!entry) return;
        entry.cmd.execute();
        this.undos.push(entry);
        useDispatchSignal(SIGNAL_NAMES.historyChanged, entry.cmd);
    }

    /** 是否可撤销 */
    get canUndo(): boolean {
        return this.undos.length > 0;
    }

    /** 是否可重做 */
    get canRedo(): boolean {
        return this.redos.length > 0;
    }

    /** 获取 undo 栈（用于历史列表显示） */
    getUndoList(): { id: number; name: string; type: string }[] {
        return this.undos.map((e) => ({
            id: e.id,
            name: (e.cmd as any).name || e.cmd.toJSON().name,
            type: e.cmd.toJSON().type,
        }));
    }

    /** 获取 redo 栈 */
    getRedoList(): { id: number; name: string; type: string }[] {
        return this.redos.map((e) => ({
            id: e.id,
            name: (e.cmd as any).name || e.cmd.toJSON().name,
            type: e.cmd.toJSON().type,
        }));
    }

    /** 清空历史 */
    clear(): void {
        this.undos = [];
        this.redos = [];
        useDispatchSignal(SIGNAL_NAMES.historyChanged);
    }

    /** 判断两命令是否可合并 */
    private canMerge(last: HistoryEntry, cmd: Command, now: number): boolean {
        const lastCmd = last.cmd;
        if (!lastCmd.updatable || !cmd.updatable) return false;
        if (lastCmd.toJSON().type !== cmd.toJSON().type) return false;
        if ((lastCmd as any).entityId !== (cmd as any).entityId) return false;
        if ((lastCmd as any).attributeName !== (cmd as any).attributeName) return false;
        if (now - last.time > MERGE_TIME_MS) return false;
        return true;
    }
}
