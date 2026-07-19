/**
 * 数字孪生 - 场景管理 composable
 *
 * 职责：
 *  - 当前场景 ID 响应式状态
 *  - 选中节点 path（单选/多选）
 *  - 节点选择方法（selectNode/clearSelection）
 *  - 场景创建/切换
 *  - 添加 Object3D 节点
 *  - 节点可见性切换
 *  - 场景保存/加载（占位，批次 5 完整实现）
 *
 * 依赖 useDtEngine 提供的引擎实例。
 */

import { ref, computed, watch, type ShallowRef } from "vue";
import type { Object3D } from "three";
import type { DtEngine } from "../core/DtEngine";
import type { DtModelNode, DtSceneAsset } from "../types";

export interface UseDtSceneReturn {
    /** 场景列表 */
    scenes: ReturnType<typeof ref<DtSceneAsset[]>>;
    /** 当前场景 ID */
    currentSceneId: ReturnType<typeof ref<string | null>>;
    /** 当前选中节点 path（单选） */
    selectedNodePath: ReturnType<typeof ref<string | null>>;
    /** 多选节点 path 列表 */
    selectedNodePaths: ReturnType<typeof ref<string[]>>;
    /** 当前选中节点对象（响应式） */
    selectedNode: ReturnType<typeof computed<DtModelNode | null>>;
    /** 引擎是否就绪 */
    ready: ReturnType<typeof computed<boolean>>;
    /** 创建场景 */
    createScene: (id: string, opts?: Partial<Omit<DtSceneAsset, "id" | "root">>) => DtSceneAsset | null;
    /** 切换场景 */
    switchScene: (id: string) => void;
    /** 添加 Object3D 到当前场景 */
    addObject3D: (obj: Object3D, name?: string, parentPath?: string) => DtModelNode | null;
    /** 选中节点 */
    selectNode: (path: string | null, multi?: boolean) => void;
    /** 清空选中 */
    clearSelection: () => void;
    /** 设置节点可见性 */
    setNodeVisible: (path: string, visible: boolean) => void;
    /** 移除节点 */
    removeNode: (path: string) => void;
    /** 按 path 查找节点 */
    findNode: (path: string) => DtModelNode | null;
    /** 保存场景（占位，批次 5 实现完整序列化） */
    saveScene: () => string;
    /** 加载场景（占位，批次 5 实现完整反序列化） */
    loadScene: (json: string) => Promise<void>;
}

export function useDtScene(engineRef: ShallowRef<DtEngine | null>): UseDtSceneReturn {
    const scenes = ref<DtSceneAsset[]>([]);
    const currentSceneId = ref<string | null>(null);
    const selectedNodePath = ref<string | null>(null);
    const selectedNodePaths = ref<string[]>([]);

    const ready = computed(() => engineRef.value !== null);

    const selectedNode = computed<DtModelNode | null>(() => {
        const engine = engineRef.value;
        if (!engine || !selectedNodePath.value) return null;
        return engine.sceneManager.findByPath(selectedNodePath.value);
    });

    // 引擎就绪后，初始化场景列表
    watch(
        engineRef,
        (engine) => {
            if (!engine) {
                scenes.value = [];
                currentSceneId.value = null;
                return;
            }
            // 收集现有场景
            const list: DtSceneAsset[] = [];
            engine.sceneManager.scenes.forEach((asset) => list.push(asset));
            scenes.value = list;
            // 默认选中 default 场景
            if (!currentSceneId.value) {
                currentSceneId.value = "default";
            }
        },
        { immediate: true },
    );

    const createScene = (
        id: string,
        opts?: Partial<Omit<DtSceneAsset, "id" | "root">>,
    ): DtSceneAsset | null => {
        const engine = engineRef.value;
        if (!engine) return null;
        const asset = engine.sceneManager.createScene(id, opts);
        scenes.value = [...scenes.value, asset];
        return asset;
    };

    const switchScene = (id: string): void => {
        const engine = engineRef.value;
        if (!engine) return;
        engine.sceneManager.switchScene(id);
        currentSceneId.value = id;
        // 清空选中
        selectedNodePath.value = null;
        selectedNodePaths.value = [];
    };

    const addObject3D = (
        obj: Object3D,
        name?: string,
        parentPath?: string,
    ): DtModelNode | null => {
        const engine = engineRef.value;
        if (!engine) return null;
        const node = engine.sceneManager.addObject3D(obj, name, parentPath);
        return node;
    };

    const selectNode = (path: string | null, multi = false): void => {
        if (path === null) {
            selectedNodePath.value = null;
            selectedNodePaths.value = [];
            return;
        }
        if (multi) {
            const idx = selectedNodePaths.value.indexOf(path);
            if (idx >= 0) {
                selectedNodePaths.value = selectedNodePaths.value.filter((p) => p !== path);
            } else {
                selectedNodePaths.value = [...selectedNodePaths.value, path];
            }
            selectedNodePath.value = selectedNodePaths.value[selectedNodePaths.value.length - 1] ?? null;
        } else {
            selectedNodePath.value = path;
            selectedNodePaths.value = [path];
        }
    };

    const clearSelection = (): void => {
        selectedNodePath.value = null;
        selectedNodePaths.value = [];
    };

    const setNodeVisible = (path: string, visible: boolean): void => {
        engineRef.value?.sceneManager.setVisible(path, visible);
    };

    const removeNode = (path: string): void => {
        const engine = engineRef.value;
        if (!engine) return;
        engine.sceneManager.removeNode(path);
        // 清理选中状态
        if (selectedNodePath.value === path) {
            selectedNodePath.value = null;
        }
        selectedNodePaths.value = selectedNodePaths.value.filter((p) => p !== path && !p.startsWith(`${path}/`));
    };

    const findNode = (path: string): DtModelNode | null => {
        return engineRef.value?.sceneManager.findByPath(path) ?? null;
    };

    const saveScene = (): string => {
        // 占位：批次 5 通过 DtSceneSerializer 实现完整序列化
        const engine = engineRef.value;
        if (!engine) return "{}";
        const state = engine.cameraRig.getState();
        return JSON.stringify({
            version: "2.0-draft",
            sceneId: currentSceneId.value,
            camera: state,
            timestamp: Date.now(),
        });
    };

    const loadScene = async (_json: string): Promise<void> => {
        // 占位：批次 5 通过 DtSceneSerializer 实现完整反序列化
        // 当前仅做日志
        // eslint-disable-next-line no-console
        console.info("[useDtScene] loadScene will be implemented in batch 5");
    };

    return {
        scenes,
        currentSceneId,
        selectedNodePath,
        selectedNodePaths,
        selectedNode,
        ready,
        createScene,
        switchScene,
        addObject3D,
        selectNode,
        clearSelection,
        setNodeVisible,
        removeNode,
        findNode,
        saveScene,
        loadScene,
    };
}
