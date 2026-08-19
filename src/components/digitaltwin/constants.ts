/**
 * 数字孪生模块 - 常量定义
 *
 * 实体类型预设 / 状态预设 / 视角预设 / 默认颜色 / 工厂函数
 */

import type {
  DtAlarmEvent,
  DtCamera,
  DtCruisePath,
  DtEntity,
  DtEntityType,
  DtEntityTypePreset,
  DtSceneTemplate,
  DtSensorData,
  DtSize3D,
  DtStatusPreset,
  DtVideoCamera,
  DtViewPresetItem,
} from "./types";

/** 实体类型预设 */
export const DT_ENTITY_TYPE_PRESETS: DtEntityTypePreset[] = [
  {
    type: "cube",
    labelKey: "digitaltwin.type.cube",
    color: "#1890FF",
    defaultSize: { width: 60, height: 60, depth: 60, radius: 0 },
  },
  {
    type: "cylinder",
    labelKey: "digitaltwin.type.cylinder",
    color: "#722ED1",
    defaultSize: { width: 0, height: 80, depth: 0, radius: 30 },
  },
  {
    type: "plane",
    labelKey: "digitaltwin.type.plane",
    color: "#8C8C8C",
    defaultSize: { width: 200, height: 0, depth: 200, radius: 0 },
  },
  {
    type: "sphere",
    labelKey: "digitaltwin.type.sphere",
    color: "#13C2C2",
    defaultSize: { width: 0, height: 0, depth: 0, radius: 25 },
  },
];

/** 状态预设 */
export const DT_STATUS_PRESETS: DtStatusPreset[] = [
  {
    status: "normal",
    labelKey: "digitaltwin.status.normal",
    colorLabelKey: "digitaltwin.status.normal.color",
    color: "#52C41A",
  },
  {
    status: "warning",
    labelKey: "digitaltwin.status.warning",
    colorLabelKey: "digitaltwin.status.warning.color",
    color: "#FAAD14",
  },
  {
    status: "alarm",
    labelKey: "digitaltwin.status.alarm",
    colorLabelKey: "digitaltwin.status.alarm.color",
    color: "#F5222D",
  },
  {
    status: "offline",
    labelKey: "digitaltwin.status.offline",
    colorLabelKey: "digitaltwin.status.offline.color",
    color: "#8C8C8C",
  },
];

/** 视角预设 */
export const DT_VIEW_PRESETS: DtViewPresetItem[] = [
  {
    preset: "top",
    labelKey: "digitaltwin.toolbar.view.top",
    camera: { yaw: 0, pitch: 90 },
  },
  {
    preset: "front",
    labelKey: "digitaltwin.toolbar.view.front",
    camera: { yaw: 0, pitch: 0 },
  },
  {
    preset: "side",
    labelKey: "digitaltwin.toolbar.view.side",
    camera: { yaw: 90, pitch: 0 },
  },
  {
    preset: "iso",
    labelKey: "digitaltwin.toolbar.view.iso",
    camera: { yaw: 45, pitch: 30 },
  },
];

/** 默认颜色（未指定状态时） */
export const DT_DEFAULT_COLORS = {
  cube: "#1890FF",
  cylinder: "#722ED1",
  plane: "#8C8C8C",
  sphere: "#13C2C2",
  highlight: "#FAAD14",
  grid: "#E8E8E8",
  axisX: "#F5222D",
  axisY: "#52C41A",
  axisZ: "#1890FF",
};

/** 默认相机 */
export const DT_DEFAULT_CAMERA: DtCamera = {
  yaw: 45,
  pitch: 30,
  zoom: 1,
  panX: 0,
  panY: 0,
};

/** 缩放上下限 */
export const DT_ZOOM_MIN = 0.3;
export const DT_ZOOM_MAX = 3;

/** pitch 上下限（度） */
export const DT_PITCH_MIN = 0;
export const DT_PITCH_MAX = 90;

/** 投影基础缩放 */
export const DT_PROJECTION_SCALE = 1;

/** 默认模拟间隔（ms） */
export const DT_DEFAULT_SIM_INTERVAL = 1000;

/** 网格大小 */
export const DT_GRID_SIZE = 50;
export const DT_GRID_DIVISIONS = 10;

/** 工具：取得类型预设 */
export const dtGetEntityTypePreset = (
  type: string,
): DtEntityTypePreset | undefined =>
  DT_ENTITY_TYPE_PRESETS.find((p) => p.type === type);

/** 工具：取得状态预设 */
export const dtGetStatusPreset = (status: string): DtStatusPreset | undefined =>
  DT_STATUS_PRESETS.find((p) => p.status === status);

/** 工具：根据状态取得颜色（离线实体用灰色，否则用实体自身颜色） */
export const dtGetEntityColor = (entity: DtEntity): string => {
  if (entity.status === "offline") {
    return dtGetStatusPreset("offline")?.color ?? "#8C8C8C";
  }
  return entity.color;
};

/** 生成唯一 ID */
export const dtGenId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 根据类型生成默认传感器数据 */
export const dtCreateSensorData = (
  type: DtEntityType | string,
): DtSensorData => {
  const rand = (min: number, max: number) =>
    Math.round((min + Math.random() * (max - min)) * 100) / 100;
  switch (type) {
    case "cube":
      return {
        temperature: {
          labelKey: "digitaltwin.property.metric.temperature",
          unitKey: "digitaltwin.property.unit.celsius",
          value: rand(40, 80),
        },
        speed: {
          labelKey: "digitaltwin.property.metric.speed",
          unitKey: "digitaltwin.property.unit.rpm",
          value: rand(1000, 3000),
        },
        power: {
          labelKey: "digitaltwin.property.metric.power",
          unitKey: "digitaltwin.property.unit.watt",
          value: rand(500, 2000),
        },
      };
    case "cylinder":
      return {
        pressure: {
          labelKey: "digitaltwin.property.metric.pressure",
          unitKey: "digitaltwin.property.unit.pascal",
          value: rand(100, 500),
        },
        efficiency: {
          labelKey: "digitaltwin.property.metric.efficiency",
          unitKey: "digitaltwin.property.unit.percent",
          value: rand(60, 95),
        },
      };
    case "sphere":
      return {
        temperature: {
          labelKey: "digitaltwin.property.metric.temperature",
          unitKey: "digitaltwin.property.unit.celsius",
          value: rand(20, 60),
        },
      };
    default:
      return {};
  }
};

/** 默认尺寸（按类型） */
export const dtDefaultSize = (type: DtEntityType | string): DtSize3D => {
  const preset = dtGetEntityTypePreset(type);
  const ds = preset?.defaultSize ?? {};
  return {
    width: ds.width ?? 0,
    height: ds.height ?? 0,
    depth: ds.depth ?? 0,
    radius: ds.radius ?? 0,
  };
};

/** 创建实体 */
export const createDtEntity = (
  type: DtEntityType | string,
  name: string,
  position = { x: 0, y: 0, z: 0 },
  size?: Partial<DtSize3D>,
  color?: string,
  status: DtEntity["status"] = "normal",
  properties?: Record<string, any>,
): DtEntity => {
  const preset = dtGetEntityTypePreset(type);
  const baseSize = dtDefaultSize(type);
  return {
    id: dtGenId("dt"),
    type,
    name,
    position: { ...position },
    size: { ...baseSize, ...size },
    color: color ?? preset?.color ?? "#8C8C8C",
    status,
    properties: properties ? { ...properties } : {},
    sensorData: dtCreateSensorData(type),
    visible: true,
  };
};

// ==================== 场景模板 ====================

/** 场景模板缩略图 SVG（简化示意图） */
const DT_TEMPLATE_THUMBNAIL_FACTORY =
  '<svg viewBox="0 0 120 80"><rect x="10" y="20" width="100" height="50" fill="#8C8C8C"/><circle cx="30" cy="60" r="8" fill="#13C2C2"/><circle cx="60" cy="60" r="8" fill="#13C2C2"/><circle cx="90" cy="60" r="8" fill="#13C2C2"/><rect x="20" y="40" width="20" height="20" fill="#1890FF"/></svg>';
const DT_TEMPLATE_THUMBNAIL_DATACENTER =
  '<svg viewBox="0 0 120 80"><rect x="5" y="10" width="110" height="60" fill="#8C8C8C"/><rect x="15" y="20" width="10" height="40" fill="#1890FF"/><rect x="35" y="20" width="10" height="40" fill="#1890FF"/><rect x="55" y="20" width="10" height="40" fill="#1890FF"/><rect x="75" y="20" width="10" height="40" fill="#1890FF"/><rect x="95" y="20" width="10" height="40" fill="#1890FF"/></svg>';
const DT_TEMPLATE_THUMBNAIL_ENERGY =
  '<svg viewBox="0 0 120 80"><rect x="5" y="55" width="40" height="20" fill="#1890FF"/><circle cx="80" cy="30" r="12" fill="#FFFFFF" stroke="#8C8C8C"/><rect x="78" y="30" width="4" height="25" fill="#8C8C8C"/><rect x="80" y="10" width="20" height="3" fill="#8C8C8C" transform="rotate(45 80 30)"/><rect x="50" y="55" width="40" height="20" fill="#722ED1"/></svg>';

/** 创建模型实例（用于模板中预置模型实体） */
export const dtCreateModelInstance = (
  modelType: string,
  name: string,
  position: { x: number; y: number; z: number },
  status: DtEntity["status"] = "normal",
  animation?: any,
): DtEntity => {
  return {
    id: dtGenId("model"),
    type: modelType,
    name,
    position: { ...position },
    size: { width: 60, height: 60, depth: 60, radius: 0 },
    color: "#8C8C8C",
    status,
    properties: {},
    sensorData: {},
    visible: true,
    // modelType 等扩展字段（DtModelInstance）
    ...({
      modelType,
      parameterValues: {},
      animation,
    } as any),
  };
};

/** 场景模板列表 */
export const DT_SCENE_TEMPLATES: DtSceneTemplate[] = [
  {
    id: "tpl_factory",
    labelKey: "digitaltwin.template.factory",
    descKey: "digitaltwin.template.desc.factory",
    thumbnail: DT_TEMPLATE_THUMBNAIL_FACTORY,
    camera: { yaw: 45, pitch: 30, zoom: 0.8 },
    entities: [
      // 地面
      createDtEntity(
        "plane",
        "工厂地面",
        { x: 0, y: 0, z: 0 },
        {
          width: 700,
          height: 0,
          depth: 500,
          radius: 0,
        },
        "#D9D9D9",
      ),
      // 厂房
      dtCreateModelInstance("workshop", "主厂房", { x: 0, y: 0, z: -150 }),
      // 4 储罐（原料区）
      dtCreateModelInstance(
        "tank",
        "原料罐 T1",
        { x: -200, y: 0, z: 50 },
        "normal",
      ),
      dtCreateModelInstance(
        "tank",
        "原料罐 T2",
        { x: -100, y: 0, z: 50 },
        "warning",
      ),
      dtCreateModelInstance(
        "tank",
        "成品罐 T3",
        { x: 100, y: 0, z: 50 },
        "normal",
      ),
      dtCreateModelInstance(
        "tank",
        "成品罐 T4",
        { x: 200, y: 0, z: 50 },
        "normal",
      ),
      // 2 泵
      dtCreateModelInstance(
        "pump",
        "进料泵 P1",
        { x: -200, y: 0, z: 150 },
        "normal",
        {
          type: "rotation",
          partId: "motor",
          axis: "y",
          speed: 360,
        },
      ),
      dtCreateModelInstance(
        "pump",
        "出料泵 P2",
        { x: 200, y: 0, z: 150 },
        "alarm",
        {
          type: "rotation",
          partId: "motor",
          axis: "y",
          speed: 720,
        },
      ),
      // 2 阀门
      dtCreateModelInstance(
        "valve",
        "阀 V1",
        { x: -50, y: 0, z: 150 },
        "normal",
        {
          type: "rotation",
          partId: "wheel",
          axis: "y",
          speed: 90,
        },
      ),
      dtCreateModelInstance(
        "valve",
        "阀 V2",
        { x: 50, y: 0, z: 150 },
        "normal",
        {
          type: "rotation",
          partId: "wheel",
          axis: "y",
          speed: 90,
        },
      ),
      // 1 换热器
      dtCreateModelInstance(
        "heatExchanger",
        "换热器 E1",
        { x: 0, y: 0, z: 220 },
        "normal",
      ),
      // 1 控制室
      createDtEntity(
        "cube",
        "控制室",
        { x: 250, y: 0, z: -100 },
        {
          width: 100,
          height: 60,
          depth: 80,
          radius: 0,
        },
        "#722ED1",
      ),
      // 装卸区物流设备（工业级）
      // 半挂车（停泊在月台）
      dtCreateModelInstance(
        "trailerTruck",
        "半挂车 T1",
        { x: 0, y: 0, z: 105 },
        "normal",
        {
          type: "rotation",
          partId: "frontWheelL",
          axis: "x",
          speed: 360,
        },
      ),
      // 2 传送带（生产线输送）
      dtCreateModelInstance(
        "conveyor",
        "传送带 C1",
        { x: -260, y: 0, z: -10 },
        "normal",
        {
          type: "rotation",
          partId: "roller1",
          axis: "x",
          speed: 360,
        },
      ),
      dtCreateModelInstance(
        "conveyor",
        "传送带 C2",
        { x: 260, y: 0, z: -10 },
        "normal",
        {
          type: "rotation",
          partId: "roller1",
          axis: "x",
          speed: 360,
        },
      ),
      // 2 货架（仓储区）
      dtCreateModelInstance(
        "rackShelf",
        "货架 R1",
        { x: -280, y: 0, z: -180 },
        "normal",
      ),
      dtCreateModelInstance(
        "rackShelf",
        "货架 R2",
        { x: 280, y: 0, z: -180 },
        "normal",
      ),
      // 2 AGV（智能搬运）
      dtCreateModelInstance(
        "agv",
        "AGV A1",
        { x: -150, y: 0, z: 120 },
        "normal",
        {
          type: "translation",
          partId: "body",
          translateAxis: "x",
          range: 80,
          translateSpeed: 0.3,
        },
      ),
      dtCreateModelInstance(
        "agv",
        "AGV A2",
        { x: 150, y: 0, z: 120 },
        "normal",
        {
          type: "translation",
          partId: "body",
          translateAxis: "x",
          range: 80,
          translateSpeed: 0.4,
        },
      ),
      // 5 管道
      dtCreateModelInstance(
        "pipeline",
        "管道 L1",
        { x: -200, y: 0, z: 100 },
        "normal",
      ),
      dtCreateModelInstance(
        "pipeline",
        "管道 L2",
        { x: 200, y: 0, z: 100 },
        "normal",
      ),
      dtCreateModelInstance(
        "pipeline",
        "管道 L3",
        { x: -100, y: 0, z: 200 },
        "normal",
      ),
      dtCreateModelInstance(
        "pipeline",
        "管道 L4",
        { x: 100, y: 0, z: 200 },
        "normal",
      ),
      dtCreateModelInstance(
        "pipeline",
        "管道 L5",
        { x: 0, y: 0, z: 250 },
        "normal",
      ),
      // 1 水塔（高位储水系统，工厂级落地组件）
      dtCreateModelInstance(
        "waterTower",
        "高位水塔 W1",
        { x: -320, y: 0, z: -200 },
        "normal",
        {
          type: "blink",
          partId: "beacon",
          frequency: 1,
        },
      ),
    ],
    hierarchy: {
      id: "node_factory",
      type: "site",
      labelKey: "digitaltwin.template.factory",
      expanded: true,
      children: [
        {
          id: "node_raw_area",
          type: "zone",
          labelKey: "digitaltwin.hierarchy.zone",
          name: "原料区",
          expanded: true,
          children: [
            {
              id: "node_t1",
              type: "equipment",
              name: "原料罐 T1",
              entityId: "",
            },
            {
              id: "node_t2",
              type: "equipment",
              name: "原料罐 T2",
              entityId: "",
            },
            {
              id: "node_p1",
              type: "equipment",
              name: "进料泵 P1",
              entityId: "",
            },
          ],
        },
        {
          id: "node_prod_area",
          type: "zone",
          labelKey: "digitaltwin.hierarchy.zone",
          name: "生产区",
          expanded: true,
          children: [
            {
              id: "node_e1",
              type: "equipment",
              name: "换热器 E1",
              entityId: "",
            },
            { id: "node_v1", type: "equipment", name: "阀 V1", entityId: "" },
          ],
        },
        {
          id: "node_ctrl_area",
          type: "zone",
          labelKey: "digitaltwin.hierarchy.zone",
          name: "控制区",
          expanded: true,
          children: [
            {
              id: "node_ctrl_room",
              type: "equipment",
              name: "控制室",
              entityId: "",
            },
          ],
        },
      ],
    },
  },
  {
    id: "tpl_datacenter",
    labelKey: "digitaltwin.template.datacenter",
    descKey: "digitaltwin.template.desc.datacenter",
    thumbnail: DT_TEMPLATE_THUMBNAIL_DATACENTER,
    camera: { yaw: 30, pitch: 35, zoom: 0.7 },
    entities: [
      createDtEntity(
        "plane",
        "机房地面",
        { x: 0, y: 0, z: 0 },
        {
          width: 600,
          height: 0,
          depth: 400,
          radius: 0,
        },
        "#D9D9D9",
      ),
      dtCreateModelInstance("workshop", "主机房", { x: 0, y: 0, z: -100 }),
      // 6 机柜两排
      dtCreateModelInstance(
        "serverRack",
        "机柜 R1",
        { x: -180, y: 0, z: 0 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 2,
        },
      ),
      dtCreateModelInstance(
        "serverRack",
        "机柜 R2",
        { x: -90, y: 0, z: 0 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 1.5,
        },
      ),
      dtCreateModelInstance(
        "serverRack",
        "机柜 R3",
        { x: 0, y: 0, z: 0 },
        "warning",
        {
          type: "blink",
          partId: "led1",
          frequency: 3,
        },
      ),
      dtCreateModelInstance(
        "serverRack",
        "机柜 R4",
        { x: -180, y: 0, z: 120 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 1.8,
        },
      ),
      dtCreateModelInstance(
        "serverRack",
        "机柜 R5",
        { x: -90, y: 0, z: 120 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 2.2,
        },
      ),
      dtCreateModelInstance(
        "serverRack",
        "机柜 R6",
        { x: 0, y: 0, z: 120 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 2,
        },
      ),
      // 2 精密空调
      dtCreateModelInstance(
        "crac",
        "精密空调 A",
        { x: 150, y: 0, z: 0 },
        "normal",
        {
          type: "rotation",
          partId: "fan1",
          axis: "y",
          speed: 720,
        },
      ),
      dtCreateModelInstance(
        "crac",
        "精密空调 B",
        { x: 150, y: 0, z: 150 },
        "normal",
        {
          type: "rotation",
          partId: "fan1",
          axis: "y",
          speed: 720,
        },
      ),
      // 1 UPS
      dtCreateModelInstance("ups", "UPS", { x: 220, y: 0, z: 75 }, "normal"),
      // 2 工作人员
      dtCreateModelInstance(
        "worker",
        "运维人员 W1",
        { x: -120, y: 0, z: 220 },
        "normal",
      ),
      dtCreateModelInstance(
        "worker",
        "运维人员 W2",
        { x: 60, y: 0, z: 220 },
        "normal",
      ),
    ],
    hierarchy: {
      id: "node_dc",
      type: "site",
      labelKey: "digitaltwin.template.datacenter",
      expanded: true,
      children: [
        {
          id: "node_roomA",
          type: "zone",
          name: "机房 A",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            { id: "node_r1", type: "equipment", name: "机柜 R1", entityId: "" },
            { id: "node_r2", type: "equipment", name: "机柜 R2", entityId: "" },
            { id: "node_r3", type: "equipment", name: "机柜 R3", entityId: "" },
          ],
        },
        {
          id: "node_roomB",
          type: "zone",
          name: "机房 B",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            { id: "node_r4", type: "equipment", name: "机柜 R4", entityId: "" },
            { id: "node_r5", type: "equipment", name: "机柜 R5", entityId: "" },
            { id: "node_r6", type: "equipment", name: "机柜 R6", entityId: "" },
          ],
        },
        {
          id: "node_aux",
          type: "zone",
          name: "辅助区",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            {
              id: "node_crac1",
              type: "equipment",
              name: "精密空调 A",
              entityId: "",
            },
            {
              id: "node_crac2",
              type: "equipment",
              name: "精密空调 B",
              entityId: "",
            },
            { id: "node_ups", type: "equipment", name: "UPS", entityId: "" },
          ],
        },
      ],
    },
  },
  {
    id: "tpl_energy",
    labelKey: "digitaltwin.template.energystation",
    descKey: "digitaltwin.template.desc.energystation",
    thumbnail: DT_TEMPLATE_THUMBNAIL_ENERGY,
    camera: { yaw: 30, pitch: 25, zoom: 0.6 },
    entities: [
      createDtEntity(
        "plane",
        "能源站地面",
        { x: 0, y: 0, z: 0 },
        {
          width: 800,
          height: 0,
          depth: 600,
          radius: 0,
        },
        "#D9D9D9",
      ),
      // 4 太阳能板阵列
      dtCreateModelInstance(
        "solarPanel",
        "太阳能板 S1",
        { x: -250, y: 0, z: -100 },
        "normal",
      ),
      dtCreateModelInstance(
        "solarPanel",
        "太阳能板 S2",
        { x: -150, y: 0, z: -100 },
        "normal",
      ),
      dtCreateModelInstance(
        "solarPanel",
        "太阳能板 S3",
        { x: -250, y: 0, z: 0 },
        "normal",
      ),
      dtCreateModelInstance(
        "solarPanel",
        "太阳能板 S4",
        { x: -150, y: 0, z: 0 },
        "normal",
      ),
      // 2 风力发电机
      dtCreateModelInstance(
        "windTurbine",
        "风机 WT1",
        { x: 150, y: 0, z: -100 },
        "normal",
        {
          type: "rotation",
          partId: "blade1",
          axis: "z",
          speed: 360,
        },
      ),
      dtCreateModelInstance(
        "windTurbine",
        "风机 WT2",
        { x: 150, y: 0, z: 100 },
        "normal",
        {
          type: "rotation",
          partId: "blade1",
          axis: "z",
          speed: 360,
        },
      ),
      // 1 变压器
      dtCreateModelInstance(
        "transformer",
        "变压器 T1",
        { x: 280, y: 0, z: -100 },
        "normal",
      ),
      // 2 配电柜
      dtCreateModelInstance(
        "distributionBox",
        "配电柜 D1",
        { x: 280, y: 0, z: 0 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 1.5,
        },
      ),
      dtCreateModelInstance(
        "distributionBox",
        "配电柜 D2",
        { x: 280, y: 0, z: 100 },
        "normal",
        {
          type: "blink",
          partId: "led1",
          frequency: 1.5,
        },
      ),
    ],
    hierarchy: {
      id: "node_es",
      type: "site",
      labelKey: "digitaltwin.template.energystation",
      expanded: true,
      children: [
        {
          id: "node_pv",
          type: "zone",
          name: "光伏区",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            {
              id: "node_s1",
              type: "equipment",
              name: "太阳能板 S1",
              entityId: "",
            },
            {
              id: "node_s2",
              type: "equipment",
              name: "太阳能板 S2",
              entityId: "",
            },
            {
              id: "node_s3",
              type: "equipment",
              name: "太阳能板 S3",
              entityId: "",
            },
            {
              id: "node_s4",
              type: "equipment",
              name: "太阳能板 S4",
              entityId: "",
            },
          ],
        },
        {
          id: "node_wind",
          type: "zone",
          name: "风电区",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            {
              id: "node_wt1",
              type: "equipment",
              name: "风机 WT1",
              entityId: "",
            },
            {
              id: "node_wt2",
              type: "equipment",
              name: "风机 WT2",
              entityId: "",
            },
          ],
        },
        {
          id: "node_dist",
          type: "zone",
          name: "变配电区",
          labelKey: "digitaltwin.hierarchy.zone",
          expanded: true,
          children: [
            {
              id: "node_trans",
              type: "equipment",
              name: "变压器 T1",
              entityId: "",
            },
            {
              id: "node_d1",
              type: "equipment",
              name: "配电柜 D1",
              entityId: "",
            },
            {
              id: "node_d2",
              type: "equipment",
              name: "配电柜 D2",
              entityId: "",
            },
          ],
        },
      ],
    },
  },
];

// ==================== 企业级运营扩展预设 ====================

/**
 * 巡航路径预设
 *
 * 对标古河 IBDT 的"巡检漫游"功能：预设 3 条工厂巡检路径
 */
export const DT_CRUISE_PATH_PRESETS: DtCruisePath[] = [
  {
    id: "cruise_overview",
    name: "全景概览",
    loop: true,
    waypoints: [
      {
        id: "wp1",
        name: "主入口",
        position: { x: 400, y: 250, z: 400 },
        target: { x: 0, y: 50, z: 0 },
        stayMs: 2000,
        transitionMs: 4000,
      },
      {
        id: "wp2",
        name: "厂房正面",
        position: { x: 0, y: 200, z: 500 },
        target: { x: 0, y: 50, z: 0 },
        stayMs: 2500,
        transitionMs: 4000,
      },
      {
        id: "wp3",
        name: "储罐区",
        position: { x: -400, y: 250, z: 200 },
        target: { x: -200, y: 0, z: 0 },
        stayMs: 2500,
        transitionMs: 4000,
      },
      {
        id: "wp4",
        name: "水塔俯瞰",
        position: { x: -500, y: 400, z: -300 },
        target: { x: -320, y: 160, z: -200 },
        stayMs: 2500,
        transitionMs: 4000,
      },
      {
        id: "wp5",
        name: "俯视图",
        position: { x: 0, y: 600, z: 0 },
        target: { x: 0, y: 0, z: 0 },
        stayMs: 2000,
        transitionMs: 4000,
      },
    ],
  },
  {
    id: "cruise_pump_zone",
    name: "泵区巡检",
    loop: false,
    waypoints: [
      {
        id: "wp1",
        name: "P1 进料泵",
        position: { x: 150, y: 80, z: 200 },
        target: { x: 150, y: 30, z: 0 },
        stayMs: 3000,
        transitionMs: 3000,
      },
      {
        id: "wp2",
        name: "P2 出料泵",
        position: { x: 220, y: 80, z: 200 },
        target: { x: 220, y: 30, z: 0 },
        stayMs: 3000,
        transitionMs: 3000,
      },
      {
        id: "wp3",
        name: "换热器",
        position: { x: 300, y: 100, z: 150 },
        target: { x: 300, y: 30, z: 0 },
        stayMs: 3000,
        transitionMs: 3000,
      },
      {
        id: "wp4",
        name: "V1 主阀",
        position: { x: 0, y: 80, z: 200 },
        target: { x: 0, y: 30, z: 0 },
        stayMs: 3000,
        transitionMs: 3000,
      },
    ],
  },
  {
    id: "cruise_perimeter",
    name: "周界安防",
    loop: true,
    waypoints: [
      {
        id: "wp1",
        name: "东南角",
        position: { x: 500, y: 150, z: 500 },
        target: { x: 200, y: 0, z: 200 },
        stayMs: 1500,
        transitionMs: 5000,
      },
      {
        id: "wp2",
        name: "东北角",
        position: { x: 500, y: 150, z: -500 },
        target: { x: 200, y: 0, z: -200 },
        stayMs: 1500,
        transitionMs: 5000,
      },
      {
        id: "wp3",
        name: "西北角",
        position: { x: -500, y: 150, z: -500 },
        target: { x: -200, y: 0, z: -200 },
        stayMs: 1500,
        transitionMs: 5000,
      },
      {
        id: "wp4",
        name: "西南角",
        position: { x: -500, y: 150, z: 500 },
        target: { x: -200, y: 0, z: 200 },
        stayMs: 1500,
        transitionMs: 5000,
      },
    ],
  },
];

/**
 * 视频监控点位预设（工厂车间模板）
 *
 * 部署 6 个摄像头覆盖关键区域，2 个离线模拟故障
 */
export const DT_CAMERA_PRESETS: DtVideoCamera[] = [
  {
    id: "cam_main_gate",
    name: "主出入口",
    position: { x: 0, y: 120, z: 250 },
    streamUrl: "mock://cam_main_gate",
    cameraType: "ptz",
    online: true,
    fov: 75,
    heading: 0,
  },
  {
    id: "cam_tank_area",
    name: "储罐区",
    position: { x: -200, y: 100, z: 100 },
    streamUrl: "mock://cam_tank_area",
    cameraType: "fixed",
    online: true,
    fov: 60,
    heading: 90,
  },
  {
    id: "cam_pump_zone",
    name: "泵区",
    position: { x: 200, y: 100, z: 100 },
    streamUrl: "mock://cam_pump_zone",
    cameraType: "fixed",
    online: true,
    fov: 60,
    heading: 270,
  },
  {
    id: "cam_workshop",
    name: "厂房顶部",
    position: { x: 0, y: 150, z: 0 },
    streamUrl: "mock://cam_workshop",
    cameraType: "panoramic",
    online: true,
    fov: 360,
    heading: 0,
  },
  {
    id: "cam_tower",
    name: "水塔附近",
    position: { x: -320, y: 100, z: -100 },
    streamUrl: "mock://cam_tower",
    cameraType: "fixed",
    online: false,
    fov: 60,
    heading: 180,
  },
  {
    id: "cam_perimeter_e",
    name: "东侧周界",
    position: { x: 400, y: 100, z: 0 },
    streamUrl: "mock://cam_perimeter_e",
    cameraType: "ptz",
    online: false,
    fov: 75,
    heading: 270,
  },
];

/**
 * 预设告警事件（演示）
 *
 * 模拟工厂运行中的常见告警：温度过高、压力异常、设备离线
 */
export const DT_ALARM_EVENT_PRESETS: DtAlarmEvent[] = [
  {
    id: "alarm_001",
    entityId: undefined, // 模板中实体 id 是动态生成的，这里留空，运行时绑定
    entityName: "出料泵 P2",
    title: "出料泵 P2 振动超标",
    description: "电机前轴承振动值 7.2mm/s，超过告警阈值 5.0mm/s",
    level: "alarm",
    status: "active",
    timestamp: Date.now() - 3 * 60 * 1000,
    source: "threshold",
    metric: "vibration=7.2mm/s",
  },
  {
    id: "alarm_002",
    entityName: "原料罐 T2",
    title: "原料罐 T2 液位低",
    description: "当前液位 18%，低于警告阈值 20%",
    level: "warning",
    status: "active",
    timestamp: Date.now() - 8 * 60 * 1000,
    source: "threshold",
    metric: "level=18%",
  },
  {
    id: "alarm_003",
    entityName: "水塔附近摄像头",
    title: "摄像头离线",
    description: "cam_tower 已离线超过 5 分钟，请检查网络连接",
    level: "info",
    status: "active",
    timestamp: Date.now() - 15 * 60 * 1000,
    source: "system",
  },
  {
    id: "alarm_004",
    entityName: "主出水阀 V1",
    title: "阀门开度异常",
    description: "V1 开度 95% 与设定值 70% 偏差超过 25%",
    level: "warning",
    status: "acknowledged",
    timestamp: Date.now() - 25 * 60 * 1000,
    acknowledgedAt: Date.now() - 22 * 60 * 1000,
    source: "system",
    metric: "opening=95%",
  },
];
