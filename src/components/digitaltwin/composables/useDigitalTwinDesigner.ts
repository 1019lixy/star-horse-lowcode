/**
 * 数字孪生设计器 - 状态管理
 *
 * scene / camera / selectedEntity / addEntity / removeEntity / updateEntity / selectEntity
 */

import { computed, reactive } from "vue";
import { DT_DEFAULT_CAMERA } from "../constants";
import type {
    DtCamera,
    DtDesignerState,
    DtEntity,
    DtEntityStats,
    DtScene,
} from "../types";

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

    /** 新增实体 */
    const addEntity = (entity: DtEntity): void => {
        state.scene.entities.push(entity);
    };

    /** 移除实体 */
    const removeEntity = (id: string): void => {
        const idx = state.scene.entities.findIndex((e) => e.id === id);
        if (idx >= 0) {
            state.scene.entities.splice(idx, 1);
            if (state.selectedEntityId === id) {
                state.selectedEntityId = null;
            }
        }
    };

    /** 更新实体（部分更新） */
    const updateEntity = (id: string, patch: Partial<DtEntity>): void => {
        const entity = state.scene.entities.find((e) => e.id === id);
        if (!entity) return;
        Object.assign(entity, patch);
    };

    /** 选中实体 */
    const selectEntity = (id: string | null): void => {
        state.selectedEntityId = id;
    };

    /** 设置状态筛选 */
    const setStatusFilter = (filter: DtDesignerState["statusFilter"]): void => {
        state.statusFilter = filter;
    };

    /** 加载场景 */
    const loadScene = (scene: DtScene): void => {
        state.scene = JSON.parse(JSON.stringify(scene));
        state.selectedEntityId = null;
    };

    /** 获取当前场景（深拷贝） */
    const getScene = (): DtScene => JSON.parse(JSON.stringify(state.scene));

    /** 设置模拟运行状态 */
    const setSimRunning = (running: boolean): void => {
        state.simRunning = running;
    };

    return {
        state,
        selectedEntity,
        filteredEntities,
        stats,
        addEntity,
        removeEntity,
        updateEntity,
        selectEntity,
        setStatusFilter,
        loadScene,
        getScene,
        setSimRunning,
    };
}

export type UseDigitalTwinDesignerReturn = ReturnType<typeof useDigitalTwinDesigner>;
