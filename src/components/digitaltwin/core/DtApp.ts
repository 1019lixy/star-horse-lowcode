/**
 * 应用单例（对标 Astral3D App）
 *
 * 核心职责：
 *  - 持有场景数据（DtEntity[]）
 *  - 当前选中实体
 *  - History 历史栈
 *  - Selector 选择器
 *  - 统一的命令执行入口（execute）
 *  - 信号驱动 UI 更新
 *
 * 与 Astral3D 的差异：
 *  - 场景数据为 DtEntity[]（业务实体），而非 THREE.Object3D 树
 *  - Object3D 由视口层从 DtEntity 自动同步（entityToObject3D）
 *  - 命令操作 DtEntity 数据层，信号通知视图刷新
 */
import { DtHistory } from "./DtHistory";
import { dtSignals, useDispatchSignal, useAddSignal, useSetSignalActive, SIGNAL_NAMES } from "./DtSignals";
export { useDispatchSignal, useAddSignal, useSetSignalActive, SIGNAL_NAMES, dtSignals };
import type { DtEntity } from "../types";

export class DtApp {
    /** 场景实体列表 */
    entities: DtEntity[] = [];
    /** 当前选中实体 ID */
    selectedId: string | null = null;
    /** 锁定实体 ID 集合 */
    lockedIds: Set<string> = new Set();
    /** 历史栈 */
    readonly history: DtHistory;

    constructor() {
        this.history = new DtHistory(100);
    }

    /* ----------------------- 数据操作 ----------------------- */

    /** 加载场景 */
    loadScene(entities: DtEntity[]): void {
        this.entities = JSON.parse(JSON.stringify(entities));
        this.selectedId = null;
        this.lockedIds.clear();
        this.history.clear();
        useDispatchSignal(SIGNAL_NAMES.sceneLoaded, this.entities);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }

    /** 获取场景数据（深拷贝） */
    getScene(): DtEntity[] {
        return JSON.parse(JSON.stringify(this.entities));
    }

    /** 清空场景 */
    clear(): void {
        this.entities = [];
        this.selectedId = null;
        this.lockedIds.clear();
        this.history.clear();
        useDispatchSignal(SIGNAL_NAMES.sceneCleared);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }

    /** 查找实体 */
    findEntity(id: string): DtEntity | undefined {
        return this.entities.find((e) => e.id === id);
    }

    /** 获取选中的实体 */
    getSelected(): DtEntity | null {
        if (!this.selectedId) return null;
        return this.findEntity(this.selectedId) ?? null;
    }

    /* ----------------------- 命令执行 ----------------------- */

    /** 执行命令 */
    execute(cmd: import("./commands").Command): void {
        this.history.execute(cmd);
    }

    /** 撤销 */
    undo(): void {
        this.history.undo();
    }

    /** 重做 */
    redo(): void {
        this.history.redo();
    }

    /* ----------------------- 选择 ----------------------- */

    /** 选中实体 */
    select(id: string | null): void {
        if (this.selectedId === id) return;
        this.selectedId = id;
        const entity = id ? this.findEntity(id) ?? null : null;
        if (entity) {
            useDispatchSignal(SIGNAL_NAMES.objectSelected, entity);
        } else {
            useDispatchSignal(SIGNAL_NAMES.objectDeselected);
        }
    }

    /** 通过实体选中 */
    selectEntity(entity: DtEntity | null): void {
        this.select(entity?.id ?? null);
    }

    /** 取消选中 */
    deselect(): void {
        this.select(null);
    }

    /* ----------------------- 锁定 ----------------------- */

    /** 锁定实体 */
    lock(id: string): void {
        this.lockedIds.add(id);
        const entity = this.findEntity(id);
        if (entity) {
            entity.locked = true;
            useDispatchSignal(SIGNAL_NAMES.objectLocked, entity);
        }
    }

    /** 解锁实体 */
    unlock(id: string): void {
        this.lockedIds.delete(id);
        const entity = this.findEntity(id);
        if (entity) {
            entity.locked = false;
            useDispatchSignal(SIGNAL_NAMES.objectUnlocked, entity);
        }
    }

    /** 是否锁定 */
    isLocked(id: string): boolean {
        return this.lockedIds.has(id);
    }

    /* ----------------------- 聚焦 ----------------------- */

    /** 聚焦实体（通知视口相机飞行） */
    focus(id: string): void {
        const entity = this.findEntity(id);
        if (entity) {
            useDispatchSignal(SIGNAL_NAMES.objectFocused, entity);
        }
    }

    /* ----------------------- 查询 ----------------------- */

    /** 根实体（无 parentId） */
    getRootEntities(): DtEntity[] {
        return this.entities.filter((e) => !e.parentId);
    }

    /** 子实体 */
    getChildren(parentId: string): DtEntity[] {
        return this.entities.filter((e) => e.parentId === parentId);
    }

    /* ----------------------- 信号 ----------------------- */

    /** 获取信号管理器 */
    get signals(): typeof dtSignals {
        return dtSignals;
    }
}

/** 全局单例 */
export const dtApp = new DtApp();
