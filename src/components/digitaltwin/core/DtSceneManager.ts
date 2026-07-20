/**
 * 数字孪生 - 场景管理器
 *
 * 职责：
 *  - 管理场景图（THREE.Scene + Object3D 层级）
 *  - 多场景创建/切换/移除
 *  - 节点路径查找（"/" 分隔，如 "robot/arm/joint1"）
 *  - 节点遍历（for...of 语义）
 *  - 节点可见性/transform 设置
 *  - markDirty 触发按需重渲
 *  - 递归 dispose 防内存泄漏
 *
 * 注：本类不直接持有 WebGLRenderer，只管理场景图；渲染由 DtEngine 调度。
 */

import {
    Scene,
    Group,
    Color,
    Fog,
    Object3D,
    Mesh,
    Geometry,
    BufferGeometry,
    Material,
    MathUtils,
    Box3,
    Vector3,
} from "three";
import type { DtEngine } from "./DtEngine";
import type { DtSceneAsset, DtModelNode, DtNodeTransform } from "../types";

const DISPOSE_THRESHOLD = 0.0001;

/** 将 Object3D 世界位置/旋转/缩写回 transform */
const toTransform = (obj: Object3D): DtNodeTransform => ({
    position: [obj.position.x, obj.position.y, obj.position.z],
    rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
    scale: [obj.scale.x, obj.scale.y, obj.scale.z],
});

/** 递归释放 geometry/material/texture */
const disposeObject3D = (obj: Object3D): void => {
    obj.traverse((child) => {
        if (child instanceof Mesh) {
            const geo = child.geometry as BufferGeometry | Geometry;
            if (geo && typeof (geo as BufferGeometry).dispose === "function") {
                (geo as BufferGeometry).dispose();
            }
            const mat = child.material;
            if (Array.isArray(mat)) {
                for (const m of mat) disposeMaterial(m);
            } else if (mat) {
                disposeMaterial(mat);
            }
        }
    });
};

const disposeMaterial = (mat: Material): void => {
    // 释放贴图
    const anyMat = mat as unknown as Record<string, unknown>;
    for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap"]) {
        const tex = anyMat[key] as { dispose?: () => void } | undefined;
        if (tex && typeof tex.dispose === "function") tex.dispose();
    }
    if (typeof mat.dispose === "function") mat.dispose();
};

export class DtSceneManager {
    /** 当前激活场景 */
    current: Scene;
    /** 所有场景（id → 资产） */
    readonly scenes: Map<string, DtSceneAsset> = new Map();
    /** 节点路径索引（path → DtModelNode），仅当前场景 */
    private readonly nodeIndex: Map<string, DtModelNode> = new Map();
    /** 引擎引用（用于 markDirty） */
    private readonly engine: DtEngine;
    /** 当前场景根 Group */
    private currentRoot: Group;

    constructor(engine: DtEngine) {
        this.engine = engine;
        this.current = new Scene();
        this.currentRoot = new Group();
        this.currentRoot.name = "scene_root";
        this.current.add(this.currentRoot);
        // 默认场景
        const defaultAsset: DtSceneAsset = {
            id: "default",
            name: "默认场景",
            root: this.currentRoot,
        };
        this.scenes.set(defaultAsset.id, defaultAsset);
    }

    /* ----------------------- 场景管理 ----------------------- */

    /** 当前场景根 Group（供视口拾取/Gizmo 附加使用） */
    get root(): Group {
        return this.currentRoot;
    }

    /** 创建新场景（不切换） */
    createScene(id: string, opts?: Partial<Omit<DtSceneAsset, "id" | "root">>): DtSceneAsset {
        if (this.scenes.has(id)) {
            throw new Error(`Scene already exists: ${id}`);
        }
        const root = new Group();
        root.name = `scene_${id}`;
        const asset: DtSceneAsset = {
            id,
            name: opts?.name ?? id,
            root,
            background: opts?.background,
            fog: opts?.fog,
            metadata: opts?.metadata,
        };
        this.scenes.set(id, asset);
        return asset;
    }

    /** 切换到指定场景 */
    switchScene(id: string): void {
        const asset = this.scenes.get(id);
        if (!asset) throw new Error(`Scene not found: ${id}`);
        this.current.remove(this.currentRoot);
        this.currentRoot = asset.root;
        this.current.add(this.currentRoot);
        // 应用背景/雾
        if (typeof asset.background === "number") {
            this.current.background = new Color(asset.background);
        } else if (typeof asset.background === "string") {
            this.current.background = new Color(asset.background);
        }
        this.current.fog = asset.fog ?? null;
        // 重建索引
        this.rebuildNodeIndex();
        this.markDirty();
    }

    /** 移除场景（释放资源） */
    removeScene(id: string): void {
        if (id === "default") throw new Error("Cannot remove default scene");
        const asset = this.scenes.get(id);
        if (!asset) return;
        if (this.currentRoot === asset.root) {
            this.switchScene("default");
        }
        disposeObject3D(asset.root);
        this.scenes.delete(id);
    }

    /* ----------------------- 节点管理 ----------------------- */

    /** 添加 Object3D 到当前场景根，并登记到节点索引 */
    addModelRoot(node: DtModelNode, parentPath?: string): void {
        const parent = parentPath ? this.findByPath(parentPath) : null;
        const parentObj = parent?.object3D ?? this.currentRoot;
        parentObj.add(node.object3D);
        this.indexNode(node, parentPath);
        this.markDirty();
    }

    /** 直接添加 Object3D（自动生成 path 与 DtModelNode） */
    addObject3D(obj: Object3D, name?: string, parentPath?: string): DtModelNode {
        const parent = parentPath ? this.findByPath(parentPath) : null;
        const parentObj = parent?.object3D ?? this.currentRoot;
        obj.name = name ?? obj.name;
        parentObj.add(obj);
        const path = parentPath
            ? `${parentPath}/${obj.name}`
            : obj.name || `node_${obj.uuid.slice(0, 8)}`;
        const node: DtModelNode = {
            id: obj.uuid,
            name: obj.name,
            path,
            object3D: obj,
        };
        this.nodeIndex.set(path, node);
        this.markDirty();
        return node;
    }

    /** 按 path 查找节点 */
    findByPath(path: string): DtModelNode | null {
        return this.nodeIndex.get(path) ?? null;
    }

    /** 按 uuid 查找节点 */
    findByUuid(uuid: string): DtModelNode | null {
        for (const node of this.nodeIndex.values()) {
            if (node.object3D.uuid === uuid) return node;
        }
        return null;
    }

    /** 遍历所有节点（for...of 语义） */
    traverse(fn: (node: DtModelNode) => void): void {
        for (const node of this.nodeIndex.values()) {
            fn(node);
        }
    }

    /** 移除节点（递归 dispose geometry/material） */
    removeNode(path: string): void {
        const node = this.nodeIndex.get(path);
        if (!node) return;
        // 移除子节点索引
        const toRemove: string[] = [];
        for (const p of this.nodeIndex.keys()) {
            if (p === path || p.startsWith(`${path}/`)) toRemove.push(p);
        }
        for (const p of toRemove) this.nodeIndex.delete(p);
        // 从父级剥离并释放
        const obj = node.object3D;
        if (obj.parent) obj.parent.remove(obj);
        disposeObject3D(obj);
        this.markDirty();
    }

    /** 设置节点可见性 */
    setVisible(path: string, visible: boolean): void {
        const node = this.findByPath(path);
        if (!node) return;
        node.object3D.visible = visible;
        this.markDirty();
    }

    /** 设置节点 transform（批量设置，避免多次 markDirty） */
    setTransform(path: string, t: Partial<DtNodeTransform>): void {
        const node = this.findByPath(path);
        if (!node) return;
        const obj = node.object3D;
        if (t.position) {
            obj.position.set(t.position[0], t.position[1], t.position[2]);
        }
        if (t.rotation) {
            obj.rotation.set(t.rotation[0], t.rotation[1], t.rotation[2]);
        }
        if (t.scale) {
            obj.scale.set(t.scale[0], t.scale[1], t.scale[2]);
        }
        this.markDirty();
    }

    /** 读取节点 transform */
    getTransform(path: string): DtNodeTransform | null {
        const node = this.findByPath(path);
        return node ? toTransform(node.object3D) : null;
    }

    /** 计算节点世界包围盒（用于相机聚焦） */
    getNodeBoundingBox(path: string): Box3 | null {
        const node = this.findByPath(path);
        if (!node) return null;
        const box = new Box3();
        box.setFromObject(node.object3D);
        if (box.isEmpty()) return null;
        return box;
    }

    /** 计算整个场景的世界包围盒 */
    getSceneBoundingBox(): Box3 {
        const box = new Box3();
        box.setFromObject(this.currentRoot);
        return box;
    }

    /** 场景中心点（用于相机聚焦默认目标） */
    getSceneCenter(): Vector3 {
        const box = this.getSceneBoundingBox();
        if (box.isEmpty()) return new Vector3(0, 0, 0);
        const center = new Vector3();
        box.getCenter(center);
        return center;
    }

    /* ----------------------- 内部工具 ----------------------- */

    /** 重建节点索引（场景切换后调用） */
    private rebuildNodeIndex(): void {
        this.nodeIndex.clear();
        const stack: Array<{ obj: Object3D; parentPath: string }> = [
            { obj: this.currentRoot, parentPath: "" },
        ];
        while (stack.length > 0) {
            const { obj, parentPath } = stack.pop()!;
            const path = parentPath
                ? `${parentPath}/${obj.name}`
                : obj.name || `node_${obj.uuid.slice(0, 8)}`;
            if (path && obj !== this.currentRoot) {
                this.nodeIndex.set(path, {
                    id: obj.uuid,
                    name: obj.name,
                    path,
                    object3D: obj,
                });
            }
            for (const child of obj.children) {
                stack.push({ obj: child, parentPath: path });
            }
        }
    }

    /** 登记节点及其所有子节点到索引 */
    private indexNode(node: DtModelNode, parentPath?: string): void {
        this.nodeIndex.set(node.path, node);
        const stack: Array<{ obj: Object3D; parentPath: string }> = [];
        for (const child of node.object3D.children) {
            stack.push({ obj: child, parentPath: node.path });
        }
        while (stack.length > 0) {
            const { obj, parentPath } = stack.pop()!;
            const path = `${parentPath}/${obj.name || `node_${obj.uuid.slice(0, 8)}`}`;
            this.nodeIndex.set(path, {
                id: obj.uuid,
                name: obj.name,
                path,
                object3D: obj,
            });
            for (const child of obj.children) {
                stack.push({ obj: child, parentPath: path });
            }
        }
    }

    /** 标记场景需要重渲（on-demand 模式触发） */
    markDirty(): void {
        this.engine.requestRender();
    }

    /** 释放所有场景资源 */
    dispose(): void {
        for (const asset of this.scenes.values()) {
            disposeObject3D(asset.root);
        }
        this.scenes.clear();
        this.nodeIndex.clear();
    }
}

/** 工具：欧拉角弧度 ← 度（外部调用方便） */
export const dtDegToRad = (deg: number): number => MathUtils.degToRad(deg);
export const dtRadToDeg = (rad: number): number => MathUtils.radToDeg(rad);
