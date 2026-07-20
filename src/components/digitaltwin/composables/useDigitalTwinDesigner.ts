/**
 * 数字孪生设计器 - 状态管理
 *
 * scene / camera / selectedEntity / addEntity / removeEntity / updateEntity / selectEntity
 * + undo/redo 历史栈
 * + save/import/export 场景 JSON
 * + moveEntityUp/moveEntityDown 层级管理
 */

import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { DT_DEFAULT_CAMERA } from "../constants";
import type {
    DtCamera,
    DtDesignerState,
    DtEntity,
    DtEntityStats,
    DtScene,
} from "../types";

const HISTORY_LIMIT = 50;

const createInitialState = (scene?: Partial<DtScene>): DtDesignerState => ({
    scene: {
        id: `dt_scene_${Date.now()}`,
        name: "",
        entities: [],
        ...scene,
    } as DtScene,
    camera: { ...DT_DEFAULT_CAMERA } as DtCamera,
    selectedEntityId: null,
    simRunning: false,
    statusFilter: "all",
});

export function useDigitalTwinDesigner(initial?: Partial<DtScene>) {
    const state = reactive<DtDesignerState>(createInitialState(initial));

    /* ----------------------- 历史栈 ----------------------- */
    const historyStack = ref<string[]>([]);
    const historyIndex = ref(-1);
    // 标记是否正在回放历史（避免 undo/redo 触发的 state 变更再次 pushHistory）
    const isReverting = ref(false);

    const canUndo = computed(() => historyIndex.value > 0);
    const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1);

    const pushHistory = (): void => {
        if (isReverting.value) return;
        const snapshot = JSON.stringify(state.scene);
        // 截断 redo 部分
        if (historyIndex.value < historyStack.value.length - 1) {
            historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
        }
        // 避免与最新快照完全相同
        if (historyStack.value.length > 0 && historyStack.value[historyStack.value.length - 1] === snapshot) {
            return;
        }
        historyStack.value.push(snapshot);
        if (historyStack.value.length > HISTORY_LIMIT) {
            historyStack.value.shift();
        } else {
            historyIndex.value++;
        }
    };

    const clearHistory = (): void => {
        historyStack.value = [];
        historyIndex.value = -1;
        pushHistory();
    };

    const undo = (): void => {
        if (!canUndo.value) return;
        isReverting.value = true;
        historyIndex.value--;
        state.scene = JSON.parse(historyStack.value[historyIndex.value]);
        state.selectedEntityId = null;
        isReverting.value = false;
        ElMessage.info(i18n("digitaltwin.message.undone"));
    };

    const redo = (): void => {
        if (!canRedo.value) return;
        isReverting.value = true;
        historyIndex.value++;
        state.scene = JSON.parse(historyStack.value[historyIndex.value]);
        state.selectedEntityId = null;
        isReverting.value = false;
        ElMessage.info(i18n("digitaltwin.message.redone"));
    };

    /** 显式提交一次更新到历史栈（供拖拽结束时调用） */
    const commitUpdate = (): void => {
        pushHistory();
    };

    // 初始化历史栈
    clearHistory();

    /* ----------------------- 派生状态 ----------------------- */
    const selectedEntity = computed<DtEntity | null>(() => {
        if (!state.selectedEntityId) return null;
        return state.scene.entities.find((e) => e.id === state.selectedEntityId) ?? null;
    });

    const filteredEntities = computed<DtEntity[]>(() => {
        if (state.statusFilter === "all") return state.scene.entities;
        return state.scene.entities.filter((e) => e.status === state.statusFilter);
    });

    const stats = computed<DtEntityStats>(() => {
        const entities = state.scene.entities;
        return {
            total: entities.length,
            normal: entities.filter((e) => e.status === "normal").length,
            warning: entities.filter((e) => e.status === "warning").length,
            alarm: entities.filter((e) => e.status === "alarm").length,
            offline: entities.filter((e) => e.status === "offline").length,
        };
    });

    /* ----------------------- 实体操作 ----------------------- */
    /** 新增实体 */
    const addEntity = (entity: DtEntity): void => {
        state.scene.entities.push(entity);
        pushHistory();
    };

    /** 移除实体 */
    const removeEntity = (id: string): void => {
        const idx = state.scene.entities.findIndex((e) => e.id === id);
        if (idx >= 0) {
            state.scene.entities.splice(idx, 1);
            if (state.selectedEntityId === id) {
                state.selectedEntityId = null;
            }
            pushHistory();
        }
    };

    /** 复制实体 */
    const duplicateEntity = (id: string): DtEntity | null => {
        const entity = state.scene.entities.find((e) => e.id === id);
        if (!entity) return null;
        const copy: DtEntity = structuredClone(entity);
        copy.id = `${entity.type}_${Date.now()}`;
        copy.name = `${entity.name}_copy`;
        copy.position = {
            x: entity.position.x + 20,
            y: entity.position.y,
            z: entity.position.z + 20,
        };
        state.scene.entities.push(copy);
        pushHistory();
        return copy;
    };

    /** 更新实体（部分更新；不自动 pushHistory，由调用方决定何时 commit） */
    const updateEntity = (id: string, patch: Partial<DtEntity>): void => {
        const entity = state.scene.entities.find((e) => e.id === id);
        if (!entity) return;
        Object.assign(entity, patch);
    };

    /** 更新实体并立即推入历史栈（用于非拖拽场景的离散更新） */
    const updateEntityWithHistory = (id: string, patch: Partial<DtEntity>): void => {
        updateEntity(id, patch);
        pushHistory();
    };

    /** 选中实体 */
    const selectEntity = (id: string | null): void => {
        state.selectedEntityId = id;
    };

    /** 设置状态筛选 */
    const setStatusFilter = (filter: DtDesignerState["statusFilter"]): void => {
        state.statusFilter = filter;
    };

    /** 上移实体层级（数组顺序即渲染顺序） */
    const moveEntityUp = (id: string): void => {
        const idx = state.scene.entities.findIndex((e) => e.id === id);
        if (idx > 0) {
            const arr = state.scene.entities;
            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
            pushHistory();
        }
    };

    /** 下移实体层级 */
    const moveEntityDown = (id: string): void => {
        const idx = state.scene.entities.findIndex((e) => e.id === id);
        if (idx >= 0 && idx < state.scene.entities.length - 1) {
            const arr = state.scene.entities;
            [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
            pushHistory();
        }
    };

    /* ----------------------- 场景管理 ----------------------- */
    /** 加载场景（重置历史） */
    const loadScene = (scene: DtScene): void => {
        state.scene = structuredClone(scene);
        state.selectedEntityId = null;
        clearHistory();
    };

    /** 获取当前场景（深拷贝，遵循项目约定使用 structuredClone） */
    const getScene = (): DtScene => structuredClone(state.scene);

    /** 新建空场景 */
    const newScene = (): void => {
        state.scene = {
            id: `dt_scene_${Date.now()}`,
            name: "",
            entities: [],
        };
        state.selectedEntityId = null;
        clearHistory();
    };

    /** 清空当前场景的实体 */
    const clearScene = (): void => {
        state.scene.entities = [];
        state.selectedEntityId = null;
        pushHistory();
    };

    /** 保存场景（返回深拷贝，供父组件持久化） */
    const saveScene = (): DtScene => structuredClone(state.scene);

    /** 导出场景为 JSON 字符串 */
    const exportSceneJson = (): string => JSON.stringify(state.scene, null, 2);

    /** 从 JSON 字符串导入场景 */
    const importSceneJson = (json: string): void => {
        const parsed = JSON.parse(json);
        if (!parsed || !Array.isArray(parsed.entities)) {
            throw new Error("Invalid scene JSON: missing entities array");
        }
        loadScene(parsed);
        ElMessage.success(i18n("digitaltwin.message.sceneImported"));
    };

    /** 设置模拟运行状态 */
    const setSimRunning = (running: boolean): void => {
        state.simRunning = running;
    };

    return {
        state,
        selectedEntity,
        filteredEntities,
        stats,
        // 历史
        canUndo,
        canRedo,
        pushHistory,
        commitUpdate,
        undo,
        redo,
        clearHistory,
        // 实体
        addEntity,
        removeEntity,
        duplicateEntity,
        updateEntity,
        updateEntityWithHistory,
        selectEntity,
        moveEntityUp,
        moveEntityDown,
        setStatusFilter,
        // 场景
        loadScene,
        getScene,
        newScene,
        clearScene,
        saveScene,
        exportSceneJson,
        importSceneJson,
        setSimRunning,
    };
}

export type UseDigitalTwinDesignerReturn = ReturnType<typeof useDigitalTwinDesigner>;
