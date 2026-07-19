/**
 * 数字孪生模块 - 类型定义
 *
 * 3D 实体 / 场景 / 相机 / 传感器 / 视角预设
 */

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

// ==================== 工业组件库扩展类型 ====================

/** 模型部件类型（复用现有 DtEntityType） */
export type DtModelPartType = "cube" | "cylinder" | "plane" | "sphere";

/** 模型部件（相对模型原点的偏移几何体） */
export interface DtModelPart {
    id: string;
    type: DtModelPartType;
    /** 相对模型原点的偏移 */
    offset: DtPoint3D;
    /** 相对尺寸（具体字段按 type 使用） */
    size: DtSize3D;
    /** 部件颜色（不传则使用模型默认色） */
    color?: string;
    /** 部件标签（如"底座"/"泵体"）i18n key */
    labelKey?: string;
    /** 是否可动画（动画目标部件） */
    animatable?: boolean;
}

/** 模型参数类型 */
export type DtModelParameterType = "number" | "string" | "select";

/** 模型参数定义 */
export interface DtModelParameter {
    name: string;
    /** i18n 标签 key */
    labelKey: string;
    type: DtModelParameterType;
    default: any;
    options?: { label: string; value: any }[];
    /** 单位 i18n key */
    unitKey?: string;
}

/** 模型分类 key（用于 i18n 翻译） */
export type DtModelCategoryKey =
    | "digitaltwin.library.category.industrial"
    | "digitaltwin.library.category.logistics"
    | "digitaltwin.library.category.infrastructure"
    | "digitaltwin.library.category.datacenter"
    | "digitaltwin.library.category.energy"
    | "digitaltwin.library.category.decorative";

/** 模型分类项 */
export interface DtModelCategory {
    key: DtModelCategoryKey;
    /** 模型类型列表 */
    modelTypes: string[];
}

/** 动画类型 */
export type DtAnimationType = "rotation" | "translation" | "blink" | "color";

/** 动画配置 */
export interface DtAnimation {
    type: DtAnimationType;
    /** 目标部件 id（不指定则应用于整个模型） */
    partId?: string;
    /** 旋转轴（rotation 类型使用） */
    axis?: "x" | "y" | "z";
    /** 旋转速度（度/秒） */
    speed?: number;
    /** 平移轴（translation 类型使用） */
    translateAxis?: "x" | "y" | "z";
    /** 平移范围 */
    range?: number;
    /** 平移速度（单位/秒） */
    translateSpeed?: number;
    /** 闪烁频率（次/秒，blink 类型使用） */
    frequency?: number;
}

/** 模型预设（组件库定义） */
export interface DtModelPreset {
    /** 模型类型唯一标识，如 "pump"、"valve"、"tank" */
    type: string;
    /** i18n 标签 key */
    labelKey: string;
    /** 分类 i18n key */
    categoryKey: DtModelCategoryKey;
    /** 图标（Element Plus 图标名或 SVG path） */
    icon?: string;
    /** 部件列表 */
    parts: DtModelPart[];
    /** 参数定义 */
    parameters: DtModelParameter[];
    /** 默认颜色 */
    defaultColor: string;
    /** 默认尺寸（包围盒） */
    defaultSize: DtSize3D;
    /** 默认动画配置 */
    defaultAnimation?: DtAnimation;
    /** 默认传感器指标 keys（引用 i18n） */
    sensorMetrics?: string[];
}

/** 数据绑定源类型 */
export type DtBindingSourceType = "mqtt" | "http" | "websocket" | "iot" | "mock";

/** 告警运算符 */
export type DtAlarmOp = ">" | "<" | ">=" | "<=" | "==";

/** 告警级别 */
export type DtAlarmLevel = "warning" | "alarm";

/** 告警阈值 */
export interface DtAlarmThreshold {
    op: DtAlarmOp;
    value: number;
    level: DtAlarmLevel;
}

/** 数据绑定配置 */
export interface DtDataBinding {
    id: string;
    /** 绑定名称 */
    name: string;
    /** 数据源类型 */
    source: DtBindingSourceType;
    /** 数据源地址（MQTT topic / HTTP URL / WS URL / IoT 设备 ID） */
    address: string;
    /** 数据路径（如 "value.temperature"） */
    path: string;
    /** 绑定到实体的属性（"status" / "sensorData.xxx" / "property.xxx"） */
    targetProperty: string;
    /** 值变换（如 "x * 0.01"） */
    transform?: string;
    /** 告警阈值（超过则自动报警） */
    alarmThreshold?: DtAlarmThreshold;
    /** 采样间隔（ms） */
    interval?: number;
}

/** 场景层级节点类型 */
export type DtSceneNodeType = "site" | "building" | "floor" | "zone" | "equipment";

/** 场景层级节点 */
export interface DtSceneNode {
    id: string;
    /** 节点类型 */
    type: DtSceneNodeType;
    /** i18n 标签 key（site/building/floor/zone 用） */
    labelKey?: string;
    /** 名称（equipment 用） */
    name?: string;
    /** 子节点 */
    children?: DtSceneNode[];
    /** 关联实体 ID（equipment 类型） */
    entityId?: string;
    /** 是否展开 */
    expanded?: boolean;
}

/** 场景模板 */
export interface DtSceneTemplate {
    id: string;
    /** i18n 标签 key */
    labelKey: string;
    /** i18n 描述 key */
    descKey: string;
    /** 缩略图（SVG 字符串） */
    thumbnail?: string;
    /** 模板包含的实体（已配置好位置/尺寸/状态/绑定） */
    entities: DtEntity[];
    /** 模板场景层级 */
    hierarchy?: DtSceneNode;
    /** 模板默认相机 */
    camera?: Partial<DtCamera>;
}

/** 模型实例（场景中的复合模型实体） */
export interface DtModelInstance extends DtEntity {
    /** 模型类型（引用 DtModelPreset.type） */
    modelType: string;
    /** 参数值 */
    parameterValues: Record<string, any>;
    /** 动画配置（覆盖默认） */
    animation?: DtAnimation;
    /** 数据绑定列表 */
    bindings?: DtDataBinding[];
}
