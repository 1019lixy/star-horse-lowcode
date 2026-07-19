/**
 * 数字孪生模块 - 类型定义
 *
 * 3D 实体 / 场景 / 相机 / 传感器 / 视角预设
 *
 * 注：v3.2 起新增企业级 3D 引擎层类型（DtEngineOptions/DtSceneAsset/DtModelNode/...），
 *     旧的 DtEntity/DtScene/DtCamera 等保留向后兼容，标记 @deprecated。
 */

import type {
    WebGLRenderer,
    Scene,
    Camera,
    PerspectiveCamera,
    OrthographicCamera,
    Object3D,
    Group,
    LOD,
    InstancedMesh,
    Light,
    Fog,
    AnimationClip,
    AnimationMixer,
    Material,
    Texture,
    Color,
} from "three";

/** 实体类型 */
export type DtEntityType = "cube" | "cylinder" | "plane" | "sphere";

/** 实体状态 */
export type DtEntityStatus = "normal" | "warning" | "alarm" | "offline";

/** 视角预设 */
export type DtViewPreset = "top" | "front" | "side" | "iso";

/** 3D 点 */
export interface DtPoint3D {
    x: number;
    y: number;
    z: number;
}

/** 3D 尺寸（不同类型实体使用不同字段） */
export interface DtSize3D {
    /** 立方体/平面：宽度；圆柱/球体：半径相关 */
    width: number;
    /** 立方体/圆柱：高度 */
    height: number;
    /** 立方体/平面：深度 */
    depth: number;
    /** 圆柱/球体：半径 */
    radius: number;
}

/** 传感器数据项 */
export interface DtSensorMetric {
    /** i18n 标签 key */
    labelKey: string;
    /** 单位 i18n key */
    unitKey: string;
    /** 数值 */
    value: number;
}

/** 实体传感器数据集合 */
export type DtSensorData = Record<string, DtSensorMetric>;

/** 3D 实体 */
export interface DtEntity {
    id: string;
    /** 实体类型 */
    type: DtEntityType | string;
    /** 名称 */
    name: string;
    /** 位置 */
    position: DtPoint3D;
    /** 尺寸 */
    size: DtSize3D;
    /** 颜色 */
    color: string;
    /** 状态 */
    status: DtEntityStatus;
    /** 自定义属性 */
    properties?: Record<string, any>;
    /** 传感器数据 */
    sensorData?: DtSensorData;
    /** 是否可见 */
    visible?: boolean;
}

/** 相机状态 */
export interface DtCamera {
    /** 绕 Y 轴旋转角（度） */
    yaw: number;
    /** 绕 X 轴旋转角（度） */
    pitch: number;
    /** 缩放 */
    zoom: number;
    /** 平移 X */
    panX: number;
    /** 平移 Y */
    panY: number;
}

/** 场景 */
export interface DtScene {
    id: string;
    name: string;
    entities: DtEntity[];
}

/** 实体类型预设 */
export interface DtEntityTypePreset {
    type: DtEntityType;
    /** i18n 标签 key */
    labelKey: string;
    /** 默认颜色 */
    color: string;
    /** 默认尺寸 */
    defaultSize: Partial<DtSize3D>;
}

/** 状态预设 */
export interface DtStatusPreset {
    status: DtEntityStatus;
    /** i18n 标签 key */
    labelKey: string;
    /** i18n 颜色描述 key */
    colorLabelKey: string;
    /** 颜色 */
    color: string;
}

/** 视角预设项 */
export interface DtViewPresetItem {
    preset: DtViewPreset;
    /** i18n 标签 key */
    labelKey: string;
    /** 对应相机参数 */
    camera: Pick<DtCamera, "yaw" | "pitch">;
}

/** 投影后的 2D 点（含深度） */
export interface DtProjectedPoint {
    x: number;
    y: number;
    /** 深度（用于画家算法排序） */
    depth: number;
}

/** 设计器状态 */
export interface DtDesignerState {
    scene: DtScene;
    camera: DtCamera;
    /** 选中实体 ID */
    selectedEntityId: string | null;
    /** 是否正在模拟 */
    simRunning: boolean;
    /** 状态筛选 */
    statusFilter: DtEntityStatus | "all";
}

/** 实体统计 */
export interface DtEntityStats {
    total: number;
    normal: number;
    warning: number;
    alarm: number;
    offline: number;
}

/* ============================================================
 *  v3.2 企业级 3D 引擎层类型（基于 Three.js WebGL2）
 * ============================================================ */

/** 渲染模式：always 持续渲染；on-demand 按需渲染（场景静态时停止重渲） */
export type DtRenderMode = "always" | "on-demand";

/** 视口交互模式 */
export type DtViewportMode =
    | "view" // 查看（OrbitControls）
    | "edit" // 编辑（Gizmo + Picker）
    | "measure" // 测量
    | "annotation" // 标注
    | "inspection"; // 巡检

/** 引擎初始化选项 */
export interface DtEngineOptions {
    /** Canvas 元素（必需） */
    canvas: HTMLCanvasElement;
    /** 容器元素（必需，用于 ResizeObserver 与浮层定位） */
    container: HTMLElement;
    /** WebGL2 失败时降级为 WebGL1 */
    fallbackToWebGL1?: boolean;
    /** 抗锯齿（默认 true） */
    antialias?: boolean;
    /** DPR 上限（默认 2） */
    maxPixelRatio?: number;
    /** 是否启用阴影 */
    shadowMapEnabled?: boolean;
    /** 是否启用后处理（Bloom/SSAO 等，本批次预留） */
    enablePostProcessing?: boolean;
    /** 渲染频率 */
    renderMode?: DtRenderMode;
    /** 暗色主题背景色（默认 0x1e1e1e，VS Code 风格） */
    background?: number;
    /** 资源 CDN 基路径（Draco/GLB/HDR） */
    assetBase?: string;
    /** 初始相机 FOV（度，默认 50） */
    fov?: number;
    /** 相机近截面（默认 0.1） */
    near?: number;
    /** 相机远截面（默认 5000） */
    far?: number;
}

/** 场景资产（一个引擎可管理多场景） */
export interface DtSceneAsset {
    id: string;
    name: string;
    /** Three.js 场景根 */
    root: Group;
    /** 背景色（数字十六进制 0xRRGGBB 或 CSS 颜色字符串） */
    background?: number | string;
    /** 雾化 */
    fog?: Fog;
    /** 用户元数据（持久化用） */
    metadata?: Record<string, unknown>;
}

/** 节点 transform（位置/旋转/缩放，欧拉角弧度） */
export interface DtNodeTransform {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
}

/** 模型节点（场景图中的一个 Object3D 包装） */
export interface DtModelNode {
    id: string;
    name: string;
    /** 模型路径（GLTF/GLB/FBX/OBJ），加载后映射到 object3D */
    sourcePath?: string;
    /** 在父级中的相对路径，如 "robot/arm/joint1" */
    path: string;
    /** Three.js 对象引用 */
    object3D: Object3D;
    /** 是否为实例化根 */
    instanced?: boolean;
    instanceCount?: number;
    /** LOD 距离配置 */
    lods?: Array<{ distance: number; geometryId: string }>;
    /** 绑定的数据点位 ID 列表 */
    boundPointIds?: string[];
    /** 用户扩展属性 */
    userData?: Record<string, unknown>;
}

/** 相机模式 */
export type DtCameraMode = "orbit" | "first-person" | "inspection" | "fixed";

/** 3D 视角预设 */
export type DtViewPreset3D =
    | "top"
    | "front"
    | "side"
    | "iso"
    | "back"
    | "bottom";

/** 相机状态（可持久化） */
export interface DtCameraState {
    mode: DtCameraMode;
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    near: number;
    far: number;
    /** 第一人称视角高度 */
    eyeHeight?: number;
    /** 第一人称移动速度 */
    moveSpeed?: number;
}

/** 光源类型 */
export type DtLightType =
    | "ambient"
    | "hemisphere"
    | "directional"
    | "spot"
    | "point";

/** 光源描述 */
export interface DtLightDescriptor {
    id: string;
    type: DtLightType;
    name: string;
    color: string | number;
    intensity: number;
    position?: [number, number, number];
    target?: [number, number, number];
    /** 仅 spot/point */
    distance?: number;
    angle?: number;
    penumbra?: number;
    decay?: number;
    castShadow?: boolean;
    shadowMapSize?: number;
    shadowBias?: number;
}

/** HDR 环境贴图选项 */
export interface DtEnvironmentOptions {
    /** HDR 文件 URL（.hdr / .exr） */
    hdriUrl?: string;
    /** 环境光强度倍率 */
    envMapIntensity?: number;
    /** 是否生成场景背景 */
    asBackground?: boolean;
    /** 无 HDR 时使用的纯色环境 */
    fallbackColor?: string | number;
}

/** 光照预设 */
export type DtLightingPreset =
    | "day"
    | "dusk"
    | "night"
    | "industrial"
    | "studio";

/** 阴影质量 */
export type DtShadowQuality = "low" | "medium" | "high";

/** 射线拾取结果 */
export interface DtPickResult {
    /** 命中节点路径 */
    nodePath: string;
    /** Three.js 对象 */
    object3D: Object3D;
    /** 命中点世界坐标 */
    point: [number, number, number];
    /** 命中面法线 */
    normal?: [number, number, number];
    /** 命中距离 */
    distance: number;
}

/** 性能统计快照 */
export interface DtPerformanceStats {
    fps: number;
    frameTime: number;
    drawCalls: number;
    triangles: number;
    geometries: number;
    textures: number;
    programs: number;
    instancedMeshes: number;
    /** Chrome performance.memory（仅 Chromium） */
    jsHeapSize?: number;
    timestamp: number;
}

/** 性能阈值（超出触发回调与自动降级） */
export interface DtPerformanceThreshold {
    minFps?: number;
    maxTriangles?: number;
    maxDrawCalls?: number;
    maxFrameTime?: number;
}

/** 材质预设 ID */
export type DtMaterialPresetId =
    | "metal-brushed"
    | "metal-painted"
    | "glass"
    | "ceramic"
    | "plastic"
    | "rubber"
    | "emissive-glow"
    | "scanline"
    | "heatmap"
    | "wireframe"
    | "xray"
    | "highlight-pulse";

/** 材质描述 */
export interface DtMaterialDescriptor {
    id: string;
    preset: DtMaterialPresetId | "custom";
    name: string;
    baseColor?: string | number;
    metalness?: number;
    roughness?: number;
    emissive?: string | number;
    emissiveIntensity?: number;
    opacity?: number;
    transparent?: boolean;
    map?: string;
    normalMap?: string;
    roughnessMap?: string;
    metalnessMap?: string;
    /** 自定义着色器（仅 custom） */
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: Record<string, { value: unknown }>;
}

/* ============================================================
 *  Three.js 实例类型别名（便于 composables/panels 引用）
 *
 *  注：保留旧 DtScene（entities 数组）与 DtCamera（yaw/pitch/zoom）
 *      作为 @deprecated 向后兼容；新代码请使用 Three.js 原类型
 *      Scene/Camera/PerspectiveCamera 等，或下方 Dt*3D 别名。
 * ============================================================ */
export type DtWebGLRenderer = WebGLRenderer;
export type DtScene3D = Scene;
export type DtCamera3D = Camera;
export type DtPerspectiveCamera = PerspectiveCamera;
export type DtOrthographicCamera = OrthographicCamera;
export type DtObject3D = Object3D;
export type DtGroup = Group;
export type DtLOD = LOD;
export type DtInstancedMesh = InstancedMesh;
export type DtLight = Light;
export type DtFog = Fog;
export type DtAnimationClip = AnimationClip;
export type DtAnimationMixer = AnimationMixer;
export type DtMaterial = Material;
export type DtTexture = Texture;
export type DtColor = Color;
