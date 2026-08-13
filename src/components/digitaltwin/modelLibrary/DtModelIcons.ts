/**
 * 数字孪生 - 工业模型 SVG 图标库
 *
 * 每个图标为 24x24 viewBox 的 stroke-based SVG 字符串
 * 使用 currentColor 继承颜色，便于主题适配
 */

/** 通用 SVG 包裹（stroke 风格，24x24） */
const wrap = (paths: string): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">${paths}</svg>`;

/** 泵：底座 + 泵体(圆) + 电机(方) + 管口 */
const PUMP = wrap(
  '<rect x="3" y="16" width="18" height="4" rx="0.5"/>' +
    '<circle cx="10" cy="11" r="4"/>' +
    '<rect x="14" y="7" width="7" height="6" rx="0.5"/>' +
    '<line x1="6" y1="11" x2="3" y2="11"/>' +
    '<line x1="17.5" y1="7" x2="17.5" y2="4"/>',
);

/** 阀门：阀体(方) + 阀杆 + 手轮(圆) + 两端口 */
const VALVE = wrap(
  '<rect x="6" y="10" width="12" height="6" rx="0.5"/>' +
    '<line x1="12" y1="10" x2="12" y2="6"/>' +
    '<circle cx="12" cy="5" r="2.5"/>' +
    '<line x1="2" y1="13" x2="6" y2="13"/>' +
    '<line x1="18" y1="13" x2="22" y2="13"/>',
);

/** 储罐：罐体(圆筒) + 顶盖(半圆) + 支腿 */
const TANK = wrap(
  '<path d="M5 8 Q5 5 12 5 Q19 5 19 8 L19 18 Q19 20 17 20 L7 20 Q5 20 5 18 Z"/>' +
    '<line x1="6" y1="20" x2="6" y2="23"/>' +
    '<line x1="18" y1="20" x2="18" y2="23"/>' +
    '<line x1="12" y1="2" x2="12" y2="5"/>',
);

/** 换热器：横置圆筒 + 两端封头 + 接管 */
const HEAT_EXCHANGER = wrap(
  '<rect x="3" y="8" width="18" height="8" rx="4"/>' +
    '<line x1="3" y1="12" x2="1" y2="12"/>' +
    '<line x1="23" y1="12" x2="21" y2="12"/>' +
    '<line x1="6" y1="8" x2="6" y2="5"/>' +
    '<line x1="18" y1="16" x2="18" y2="19"/>' +
    '<line x1="7" y1="12" x2="17" y2="12" stroke-dasharray="1.5 1.5"/>',
);

/** 反应釜：罐体 + 顶盖 + 搅拌轴 + 叶片 */
const REACTOR = wrap(
  '<path d="M6 9 Q6 6 12 6 Q18 6 18 9 L18 18 Q18 20 16 20 L8 20 Q6 20 6 18 Z"/>' +
    '<line x1="12" y1="3" x2="12" y2="15"/>' +
    '<line x1="9" y1="15" x2="15" y2="15"/>' +
    '<line x1="7" y1="20" x2="7" y2="23"/>' +
    '<line x1="17" y1="20" x2="17" y2="23"/>',
);

/** 压缩机：底座 + 机体 + 电机 + 进排气口 */
const COMPRESSOR = wrap(
  '<rect x="2" y="15" width="20" height="5" rx="0.5"/>' +
    '<rect x="4" y="8" width="9" height="7" rx="0.5"/>' +
    '<rect x="13" y="9" width="7" height="6" rx="0.5"/>' +
    '<line x1="6" y1="8" x2="6" y2="5"/>' +
    '<line x1="11" y1="8" x2="11" y2="5"/>',
);

/** 锅炉：立置圆筒 + 顶盖 + 烟囱 */
const BOILER = wrap(
  '<rect x="7" y="7" width="10" height="13" rx="2"/>' +
    '<path d="M7 9 Q7 5 12 5 Q17 5 17 9"/>' +
    '<rect x="11" y="1" width="2" height="4"/>' +
    '<line x1="4" y1="20" x2="7" y2="20"/>' +
    '<line x1="17" y1="20" x2="20" y2="20"/>',
);

/** 冷却塔：截锥塔体 + 顶盖 + 风机 */
const COOLING_TOWER = wrap(
  '<path d="M4 20 L6 8 Q6 5 12 5 Q18 5 18 8 L20 20 Z"/>' +
    '<ellipse cx="12" cy="8" rx="6" ry="1.5"/>' +
    '<line x1="9" y1="8" x2="15" y2="8"/>' +
    '<line x1="12" y1="6" x2="12" y2="10"/>',
);

/** 传送带：框架 + 皮带 + 滚筒 */
const CONVEYOR = wrap(
  '<rect x="2" y="9" width="20" height="3" rx="0.5"/>' +
    '<circle cx="4" cy="10.5" r="2"/>' +
    '<circle cx="20" cy="10.5" r="2"/>' +
    '<line x1="4" y1="12.5" x2="4" y2="18"/>' +
    '<line x1="20" y1="12.5" x2="20" y2="18"/>' +
    '<line x1="2" y1="18" x2="6" y2="18"/>' +
    '<line x1="18" y1="18" x2="22" y2="18"/>' +
    '<line x1="7" y1="9" x2="7" y2="12" stroke-dasharray="1 1"/>' +
    '<line x1="12" y1="9" x2="12" y2="12" stroke-dasharray="1 1"/>' +
    '<line x1="17" y1="9" x2="17" y2="12" stroke-dasharray="1 1"/>',
);

/** 堆垛机：立柱 + 横梁 + 货叉 */
const STACKER = wrap(
  '<rect x="4" y="2" width="2" height="20"/>' +
    '<rect x="3" y="6" width="10" height="2"/>' +
    '<rect x="11" y="8" width="4" height="1.5"/>' +
    '<rect x="13" y="9.5" width="3" height="1"/>' +
    '<line x1="3" y1="22" x2="13" y2="22"/>',
);

/** AGV：车体 + 轮子 + 货架 */
const AGV = wrap(
  '<rect x="3" y="12" width="18" height="5" rx="0.5"/>' +
    '<circle cx="7" cy="19" r="2"/>' +
    '<circle cx="17" cy="19" r="2"/>' +
    '<rect x="7" y="6" width="10" height="6" rx="0.5"/>' +
    '<line x1="9" y1="9" x2="15" y2="9"/>',
);

/** 货架：立柱 + 多层横梁 */
const RACK = wrap(
  '<rect x="4" y="2" width="1.5" height="20"/>' +
    '<rect x="18.5" y="2" width="1.5" height="20"/>' +
    '<line x1="4" y1="7" x2="20" y2="7"/>' +
    '<line x1="4" y1="12" x2="20" y2="12"/>' +
    '<line x1="4" y1="17" x2="20" y2="17"/>' +
    '<rect x="6" y="8" width="6" height="3" rx="0.3"/>' +
    '<rect x="13" y="13" width="5" height="3" rx="0.3"/>',
);

/** 厂房：墙体 + 屋顶 + 门 */
const WORKSHOP = wrap(
  '<path d="M2 10 L12 3 L22 10 L22 21 L2 21 Z"/>' +
    '<rect x="9" y="14" width="6" height="7"/>' +
    '<line x1="2" y1="10" x2="22" y2="10"/>' +
    '<rect x="4" y="12" width="3" height="2"/>' +
    '<rect x="17" y="12" width="3" height="2"/>',
);

/** 管道：直管 + 法兰 */
const PIPELINE = wrap(
  '<rect x="2" y="10" width="20" height="4" rx="0.5"/>' +
    '<rect x="3" y="8" width="2" height="8"/>' +
    '<rect x="19" y="8" width="2" height="8"/>' +
    '<line x1="6" y1="10" x2="6" y2="14" stroke-dasharray="1 1"/>' +
    '<line x1="12" y1="10" x2="12" y2="14" stroke-dasharray="1 1"/>' +
    '<line x1="18" y1="10" x2="18" y2="14" stroke-dasharray="1 1"/>',
);

/** 照明灯：灯杆 + 灯罩 + 灯泡 */
const LAMP = wrap(
  '<line x1="12" y1="2" x2="12" y2="14"/>' +
    '<path d="M7 14 L17 14 L15 19 L9 19 Z"/>' +
    '<circle cx="12" cy="17" r="1.5"/>' +
    '<line x1="9" y1="21" x2="15" y2="21"/>',
);

/** 围栏：立柱 + 横杆 */
const FENCE = wrap(
  '<line x1="4" y1="4" x2="4" y2="20"/>' +
    '<line x1="10" y1="4" x2="10" y2="20"/>' +
    '<line x1="16" y1="4" x2="16" y2="20"/>' +
    '<line x1="22" y1="4" x2="22" y2="20"/>' +
    '<line x1="3" y1="9" x2="23" y2="9"/>' +
    '<line x1="3" y1="15" x2="23" y2="15"/>' +
    '<path d="M3 4 L5 2 L7 4" fill="none"/>' +
    '<path d="M9 4 L11 2 L13 4" fill="none"/>' +
    '<path d="M15 4 L17 2 L19 4" fill="none"/>',
);

/** 机柜：柜体 + 服务器插槽 + 指示灯 */
const SERVER_RACK = wrap(
  '<rect x="5" y="2" width="14" height="20" rx="0.5"/>' +
    '<line x1="5" y1="6" x2="19" y2="6"/>' +
    '<line x1="5" y1="10" x2="19" y2="10"/>' +
    '<line x1="5" y1="14" x2="19" y2="14"/>' +
    '<line x1="5" y1="18" x2="19" y2="18"/>' +
    '<circle cx="7" cy="4" r="0.5" fill="currentColor"/>' +
    '<circle cx="7" cy="8" r="0.5" fill="currentColor"/>' +
    '<circle cx="7" cy="12" r="0.5" fill="currentColor"/>' +
    '<circle cx="7" cy="16" r="0.5" fill="currentColor"/>',
);

/** 服务器：机身 + 面板 + 指示灯 */
const SERVER = wrap(
  '<rect x="2" y="6" width="20" height="12" rx="0.5"/>' +
    '<line x1="2" y1="10" x2="22" y2="10"/>' +
    '<line x1="2" y1="14" x2="22" y2="14"/>' +
    '<circle cx="5" cy="8" r="0.6" fill="currentColor"/>' +
    '<circle cx="5" cy="12" r="0.6" fill="currentColor"/>' +
    '<circle cx="5" cy="16" r="0.6" fill="currentColor"/>' +
    '<line x1="8" y1="8" x2="18" y2="8" stroke-dasharray="1 1"/>' +
    '<line x1="8" y1="12" x2="18" y2="12" stroke-dasharray="1 1"/>' +
    '<line x1="8" y1="16" x2="18" y2="16" stroke-dasharray="1 1"/>',
);

/** UPS：柜体 + 电池组 + 显示屏 */
const UPS = wrap(
  '<rect x="4" y="3" width="16" height="18" rx="0.5"/>' +
    '<rect x="6" y="5" width="12" height="3" rx="0.3"/>' +
    '<rect x="6" y="10" width="4" height="8" rx="0.3"/>' +
    '<rect x="11" y="10" width="4" height="8" rx="0.3"/>' +
    '<rect x="16" y="10" width="2" height="8" rx="0.3"/>' +
    '<line x1="7" y1="14" x2="9" y2="14"/>' +
    '<line x1="12" y1="14" x2="14" y2="14"/>',
);

/** 精密空调：柜体 + 风扇 + 显示屏 */
const CRAC = wrap(
  '<rect x="3" y="3" width="18" height="18" rx="0.5"/>' +
    '<circle cx="9" cy="12" r="3.5"/>' +
    '<line x1="9" y1="8.5" x2="9" y2="15.5"/>' +
    '<line x1="5.5" y1="12" x2="12.5" y2="12"/>' +
    '<line x1="6.5" y1="9.5" x2="11.5" y2="14.5"/>' +
    '<line x1="6.5" y1="14.5" x2="11.5" y2="9.5"/>' +
    '<rect x="15" y="9" width="5" height="3" rx="0.3"/>' +
    '<line x1="15" y1="15" x2="20" y2="15"/>' +
    '<line x1="15" y1="17" x2="20" y2="17"/>',
);

/** 太阳能板：面板(倾斜) + 支架 + 立柱 */
const SOLAR_PANEL = wrap(
  '<path d="M3 8 L21 5 L21 14 L3 17 Z"/>' +
    '<line x1="3" y1="8" x2="21" y2="5"/>' +
    '<line x1="3" y1="12.5" x2="21" y2="9.5"/>' +
    '<line x1="8" y1="7" x2="8" y2="16"/>' +
    '<line x1="14" y1="6" x2="14" y2="15"/>' +
    '<line x1="12" y1="17" x2="12" y2="22"/>' +
    '<line x1="9" y1="22" x2="15" y2="22"/>',
);

/** 风力发电机：塔筒 + 机舱 + 轮毂 + 叶片 */
const WIND_TURBINE = wrap(
  '<line x1="12" y1="8" x2="12" y2="22"/>' +
    '<rect x="11" y="6" width="4" height="2.5" rx="0.3"/>' +
    '<circle cx="12" cy="6" r="1"/>' +
    '<path d="M12 6 L12 1" stroke-width="1.5"/>' +
    '<path d="M12 6 L17 9" stroke-width="1.5"/>' +
    '<path d="M12 6 L7 9" stroke-width="1.5"/>' +
    '<line x1="9" y1="22" x2="15" y2="22"/>',
);

/** 变压器：本体 + 散热片 + 套管 */
const TRANSFORMER = wrap(
  '<rect x="5" y="9" width="14" height="11" rx="0.5"/>' +
    '<line x1="5" y1="12" x2="19" y2="12"/>' +
    '<line x1="5" y1="15" x2="19" y2="15"/>' +
    '<line x1="5" y1="18" x2="19" y2="18"/>' +
    '<line x1="8" y1="9" x2="8" y2="6"/>' +
    '<line x1="12" y1="9" x2="12" y2="5"/>' +
    '<line x1="16" y1="9" x2="16" y2="6"/>' +
    '<circle cx="8" cy="5" r="1"/>' +
    '<circle cx="12" cy="4" r="1"/>' +
    '<circle cx="16" cy="5" r="1"/>',
);

/** 配电柜：柜体 + 开关 + 指示灯 */
const DISTRIBUTION_BOX = wrap(
  '<rect x="4" y="3" width="16" height="18" rx="0.5"/>' +
    '<line x1="4" y1="8" x2="20" y2="8"/>' +
    '<rect x="6" y="5" width="3" height="2" rx="0.3"/>' +
    '<rect x="11" y="5" width="3" height="2" rx="0.3"/>' +
    '<rect x="16" y="5" width="2" height="2" rx="0.3"/>' +
    '<circle cx="7" cy="11" r="0.6" fill="currentColor"/>' +
    '<circle cx="12" cy="11" r="0.6" fill="currentColor"/>' +
    '<circle cx="17" cy="11" r="0.6" fill="currentColor"/>' +
    '<line x1="6" y1="14" x2="18" y2="14" stroke-dasharray="1 1"/>' +
    '<line x1="6" y1="17" x2="18" y2="17" stroke-dasharray="1 1"/>' +
    '<line x1="6" y1="19" x2="18" y2="19" stroke-dasharray="1 1"/>',
);

/** 树木：树干 + 树冠 */
const TREE = wrap(
  '<line x1="12" y1="14" x2="12" y2="22"/>' +
    '<line x1="11" y1="18" x2="13" y2="18"/>' +
    '<circle cx="12" cy="9" r="6"/>' +
    '<circle cx="9" cy="8" r="3" opacity="0.6"/>' +
    '<circle cx="15" cy="9" r="3" opacity="0.6"/>',
);

/** 道路：路面 + 标线 */
const ROAD = wrap(
  '<rect x="2" y="9" width="20" height="6" rx="0.5"/>' +
    '<line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="3 2"/>' +
    '<line x1="2" y1="10" x2="22" y2="10" stroke-width="0.8"/>' +
    '<line x1="2" y1="14" x2="22" y2="14" stroke-width="0.8"/>',
);

/** 人物：头 + 身体 + 四肢 */
const WORKER = wrap(
  '<circle cx="12" cy="5" r="2.5"/>' +
    '<path d="M8 22 L8 14 Q8 10 12 10 Q16 10 16 14 L16 22"/>' +
    '<line x1="8" y1="16" x2="4" y2="18"/>' +
    '<line x1="16" y1="16" x2="20" y2="18"/>' +
    '<line x1="9" y1="22" x2="9" y2="18"/>' +
    '<line x1="15" y1="22" x2="15" y2="18"/>' +
    '<rect x="10" y="11" width="4" height="3" rx="0.3" opacity="0.6"/>',
);

/** 图标映射表（按模型 type 索引） */
export const DT_MODEL_ICONS: Record<string, string> = {
  pump: PUMP,
  valve: VALVE,
  tank: TANK,
  heatExchanger: HEAT_EXCHANGER,
  reactor: REACTOR,
  compressor: COMPRESSOR,
  boiler: BOILER,
  coolingTower: COOLING_TOWER,
  conveyor: CONVEYOR,
  stacker: STACKER,
  agv: AGV,
  rackShelf: RACK,
  workshop: WORKSHOP,
  pipeline: PIPELINE,
  lamp: LAMP,
  fence: FENCE,
  serverRack: SERVER_RACK,
  server: SERVER,
  ups: UPS,
  crac: CRAC,
  solarPanel: SOLAR_PANEL,
  windTurbine: WIND_TURBINE,
  transformer: TRANSFORMER,
  distributionBox: DISTRIBUTION_BOX,
  tree: TREE,
  road: ROAD,
  worker: WORKER,
};

/** 获取模型图标（fallback 到通用方块图标） */
export const dtGetModelIcon = (type: string): string =>
  DT_MODEL_ICONS[type] ??
  wrap("<rect x='4' y='4' width='16' height='16' rx='1'/>");
