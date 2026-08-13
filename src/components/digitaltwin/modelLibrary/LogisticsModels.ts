/**
 * 数字孪生 - 物流设备模型库（工业级）
 *
 * 包含：传送带 / 堆垛机 / AGV / 货架 / 半挂车
 */
import type { DtModelPreset } from "../types";

/**
 * 半挂车 TrailerTruck（工业级重型运输车）
 *
 * 结构组成：
 * - 牵引车（驾驶室 + 引擎舱 + 前桥 + 油箱 + 排气筒 + 牵引盘）
 * - 挂车（厢式车身 + 后门 + 双联桥 + 支撑腿 + 挡泥板）
 * - 灯光系统（前大灯 + 侧标志灯 + 尾灯 + 反光标识）
 * - 后视镜 + 气喇叭 + 空滤器
 */
const DT_TRAILER_TRUCK_PRESET: DtModelPreset = {
  type: "trailerTruck",
  labelKey: "digitaltwin.model.trailerTruck",
  categoryKey: "digitaltwin.library.category.logistics",
  icon: "Van",
  defaultColor: "#1890FF",
  defaultSize: { width: 360, height: 90, depth: 70, radius: 0 },
  defaultAnimation: {
    type: "rotation",
    partId: "frontWheelL",
    axis: "x",
    speed: 720,
  },
  parts: [
    // ═══════════════ 牵引车（车头） ═══════════════
    // ─── 底盘大梁 ───
    {
      id: "chassis",
      type: "cube",
      offset: { x: -130, y: 18, z: 0 },
      size: { width: 160, height: 6, depth: 50, radius: 0 },
      color: "#2A2A2A",
      labelKey: "digitaltwin.part.frame",
    },
    // 底盘横梁
    {
      id: "crossBeam1",
      type: "cube",
      offset: { x: -200, y: 16, z: 0 },
      size: { width: 4, height: 8, depth: 50, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "crossBeam2",
      type: "cube",
      offset: { x: -160, y: 16, z: 0 },
      size: { width: 4, height: 8, depth: 50, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "crossBeam3",
      type: "cube",
      offset: { x: -80, y: 16, z: 0 },
      size: { width: 4, height: 8, depth: 50, radius: 0 },
      color: "#3D3D3D",
    },

    // ─── 引擎舱（前部隆起） ───
    // 引擎舱主体
    {
      id: "hood",
      type: "cube",
      offset: { x: -195, y: 30, z: 0 },
      size: { width: 50, height: 30, depth: 50, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.body",
    },
    // 引擎舱顶盖（略凸）
    {
      id: "hoodTop",
      type: "cube",
      offset: { x: -195, y: 46, z: 0 },
      size: { width: 48, height: 4, depth: 48, radius: 0 },
      color: "#0070C0",
    },
    // 引擎舱侧面散热格栅
    {
      id: "grille1",
      type: "cube",
      offset: { x: -195, y: 30, z: 26 },
      size: { width: 40, height: 22, depth: 1, radius: 0 },
      color: "#2A2A2A",
    },
    {
      id: "grille2",
      type: "cube",
      offset: { x: -195, y: 30, z: -26 },
      size: { width: 40, height: 22, depth: 1, radius: 0 },
      color: "#2A2A2A",
    },
    // 前格栅（进气格栅）
    {
      id: "frontGrille",
      type: "cube",
      offset: { x: -220, y: 28, z: 0 },
      size: { width: 2, height: 24, depth: 40, radius: 0 },
      color: "#2A2A2A",
    },
    // 前保险杠
    {
      id: "frontBumper",
      type: "cube",
      offset: { x: -222, y: 16, z: 0 },
      size: { width: 4, height: 8, depth: 56, radius: 0 },
      color: "#3D3D3D",
    },

    // ─── 前大灯与标志灯 ───
    // 左前大灯
    {
      id: "headlightL",
      type: "cube",
      offset: { x: -220, y: 30, z: -18 },
      size: { width: 2, height: 8, depth: 10, radius: 0 },
      color: "#FAFAFA",
    },
    // 右前大灯
    {
      id: "headlightR",
      type: "cube",
      offset: { x: -220, y: 30, z: 18 },
      size: { width: 2, height: 8, depth: 10, radius: 0 },
      color: "#FAFAFA",
    },
    // 前雾灯（黄色）
    {
      id: "fogLightL",
      type: "sphere",
      offset: { x: -220, y: 18, z: -22 },
      size: { width: 0, height: 0, depth: 0, radius: 3 },
      color: "#F5A623",
    },
    {
      id: "fogLightR",
      type: "sphere",
      offset: { x: -220, y: 18, z: 22 },
      size: { width: 0, height: 0, depth: 0, radius: 3 },
      color: "#F5A623",
    },

    // ─── 驾驶室 ───
    // 驾驶室主体
    {
      id: "cab",
      type: "cube",
      offset: { x: -145, y: 40, z: 0 },
      size: { width: 60, height: 50, depth: 54, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.body",
    },
    // 驾驶室顶部（白色顶罩）
    {
      id: "cabRoof",
      type: "cube",
      offset: { x: -145, y: 66, z: 0 },
      size: { width: 58, height: 3, depth: 52, radius: 0 },
      color: "#FAFAFA",
    },
    // 前挡风玻璃（深蓝半透明）
    {
      id: "windshield",
      type: "cube",
      offset: { x: -174, y: 48, z: 0 },
      size: { width: 1, height: 22, depth: 44, radius: 0 },
      color: "#2A4A6E",
    },
    // 左侧车窗
    {
      id: "sideWindowL",
      type: "cube",
      offset: { x: -145, y: 50, z: -28 },
      size: { width: 40, height: 18, depth: 1, radius: 0 },
      color: "#2A4A6E",
    },
    // 右侧车窗
    {
      id: "sideWindowR",
      type: "cube",
      offset: { x: -145, y: 50, z: 28 },
      size: { width: 40, height: 18, depth: 1, radius: 0 },
      color: "#2A4A6E",
    },
    // 后窗
    {
      id: "rearWindow",
      type: "cube",
      offset: { x: -116, y: 50, z: 0 },
      size: { width: 1, height: 16, depth: 36, radius: 0 },
      color: "#2A4A6E",
    },
    // 驾驶室车门把手
    {
      id: "doorHandleL",
      type: "cube",
      offset: { x: -160, y: 38, z: -28 },
      size: { width: 6, height: 2, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "doorHandleR",
      type: "cube",
      offset: { x: -160, y: 38, z: 28 },
      size: { width: 6, height: 2, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },

    // ─── 后视镜（左侧+右侧） ───
    // 左后视镜支架
    {
      id: "mirrorArmL",
      type: "cube",
      offset: { x: -170, y: 50, z: -32 },
      size: { width: 2, height: 12, depth: 2, radius: 0 },
      color: "#2A2A2A",
    },
    // 左后视镜镜面
    {
      id: "mirrorL",
      type: "cube",
      offset: { x: -172, y: 50, z: -36 },
      size: { width: 2, height: 14, depth: 8, radius: 0 },
      color: "#9B9B9B",
    },
    // 右后视镜支架
    {
      id: "mirrorArmR",
      type: "cube",
      offset: { x: -170, y: 50, z: 32 },
      size: { width: 2, height: 12, depth: 2, radius: 0 },
      color: "#2A2A2A",
    },
    // 右后视镜镜面
    {
      id: "mirrorR",
      type: "cube",
      offset: { x: -172, y: 50, z: 36 },
      size: { width: 2, height: 14, depth: 8, radius: 0 },
      color: "#9B9B9B",
    },

    // ─── 排气筒与气喇叭 ───
    // 排气筒（垂直，驾驶室后方）
    {
      id: "exhaustStack",
      type: "cylinder",
      offset: { x: -110, y: 50, z: -28 },
      size: { width: 0, height: 40, depth: 0, radius: 5 },
      color: "#5A5A5A",
      labelKey: "digitaltwin.part.outlet",
    },
    // 排气筒防雨帽
    {
      id: "exhaustCap",
      type: "cylinder",
      offset: { x: -110, y: 70, z: -28 },
      size: { width: 0, height: 3, depth: 0, radius: 7 },
      color: "#2A2A2A",
    },
    // 气喇叭（驾驶室顶部）
    {
      id: "horn1",
      type: "cylinder",
      offset: { x: -135, y: 72, z: -15 },
      size: { width: 0, height: 8, depth: 0, radius: 3 },
      color: "#C0C0C0",
    },
    {
      id: "horn2",
      type: "cylinder",
      offset: { x: -135, y: 72, z: 15 },
      size: { width: 0, height: 8, depth: 0, radius: 3 },
      color: "#C0C0C0",
    },
    // 空气滤清器
    {
      id: "airFilter",
      type: "cylinder",
      offset: { x: -110, y: 35, z: 28 },
      size: { width: 0, height: 30, depth: 0, radius: 8 },
      color: "#3D3D3D",
    },

    // ─── 油箱（圆柱形，侧置） ───
    {
      id: "fuelTank",
      type: "cylinder",
      offset: { x: -130, y: 22, z: -28 },
      size: { width: 0, height: 50, depth: 0, radius: 10 },
      color: "#5A5A5A",
    },
    // 油箱箍带
    {
      id: "tankStrap1",
      type: "cube",
      offset: { x: -140, y: 22, z: -28 },
      size: { width: 2, height: 22, depth: 1, radius: 0 },
      color: "#2A2A2A",
    },
    {
      id: "tankStrap2",
      type: "cube",
      offset: { x: -120, y: 22, z: -28 },
      size: { width: 2, height: 22, depth: 1, radius: 0 },
      color: "#2A2A2A",
    },

    // ─── 牵引盘（第五轮） ───
    // 牵引盘底座
    {
      id: "fifthWheelBase",
      type: "cube",
      offset: { x: -80, y: 22, z: 0 },
      size: { width: 16, height: 6, depth: 30, radius: 0 },
      color: "#3D3D3D",
    },
    // 牵引盘（半圆形）
    {
      id: "fifthWheel",
      type: "cylinder",
      offset: { x: -80, y: 28, z: 0 },
      size: { width: 0, height: 4, depth: 0, radius: 14 },
      color: "#9B9B9B",
    },

    // ─── 前桥车轮（转向桥，2 轮） ───
    // 左前轮
    {
      id: "frontWheelL",
      type: "cylinder",
      offset: { x: -200, y: 12, z: -28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
      labelKey: "digitaltwin.part.rollers",
      animatable: true,
    },
    // 左前轮毂
    {
      id: "frontHubL",
      type: "cylinder",
      offset: { x: -200, y: 12, z: -28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 右前轮
    {
      id: "frontWheelR",
      type: "cylinder",
      offset: { x: -200, y: 12, z: 28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
    },
    // 右前轮毂
    {
      id: "frontHubR",
      type: "cylinder",
      offset: { x: -200, y: 12, z: 28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },

    // ═══════════════ 挂车（车厢） ═══════════════
    // ─── 厢式车身 ───
    // 挂车底盘
    {
      id: "trailerChassis",
      type: "cube",
      offset: { x: 70, y: 18, z: 0 },
      size: { width: 220, height: 6, depth: 50, radius: 0 },
      color: "#2A2A2A",
    },
    // 挂车主体（厢式）
    {
      id: "trailerBody",
      type: "cube",
      offset: { x: 70, y: 50, z: 0 },
      size: { width: 200, height: 60, depth: 56, radius: 0 },
      color: "#FAFAFA",
      labelKey: "digitaltwin.part.body",
    },
    // 挂车顶部
    {
      id: "trailerRoof",
      type: "cube",
      offset: { x: 70, y: 81, z: 0 },
      size: { width: 200, height: 3, depth: 54, radius: 0 },
      color: "#E0E0E0",
    },
    // 挂车前部（连接处）
    {
      id: "trailerFront",
      type: "cube",
      offset: { x: -32, y: 50, z: 0 },
      size: { width: 8, height: 60, depth: 56, radius: 0 },
      color: "#E0E0E0",
    },
    // 挂车侧面加强筋（左侧）
    {
      id: "trailerRib1L",
      type: "cube",
      offset: { x: 0, y: 50, z: -29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib2L",
      type: "cube",
      offset: { x: 40, y: 50, z: -29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib3L",
      type: "cube",
      offset: { x: 80, y: 50, z: -29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib4L",
      type: "cube",
      offset: { x: 120, y: 50, z: -29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib5L",
      type: "cube",
      offset: { x: 160, y: 50, z: -29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    // 挂车侧面加强筋（右侧）
    {
      id: "trailerRib1R",
      type: "cube",
      offset: { x: 0, y: 50, z: 29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib2R",
      type: "cube",
      offset: { x: 40, y: 50, z: 29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib3R",
      type: "cube",
      offset: { x: 80, y: 50, z: 29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib4R",
      type: "cube",
      offset: { x: 120, y: 50, z: 29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "trailerRib5R",
      type: "cube",
      offset: { x: 160, y: 50, z: 29 },
      size: { width: 2, height: 56, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },

    // ─── 后门（双开门） ───
    // 左后门
    {
      id: "rearDoorL",
      type: "cube",
      offset: { x: 170, y: 50, z: -14 },
      size: { width: 2, height: 56, depth: 26, radius: 0 },
      color: "#D0D0D0",
      labelKey: "digitaltwin.part.body",
    },
    // 右后门
    {
      id: "rearDoorR",
      type: "cube",
      offset: { x: 170, y: 50, z: 14 },
      size: { width: 2, height: 56, depth: 26, radius: 0 },
      color: "#D0D0D0",
    },
    // 后门把手
    {
      id: "doorHandleRL",
      type: "cylinder",
      offset: { x: 172, y: 50, z: -2 },
      size: { width: 0, height: 30, depth: 0, radius: 2 },
      color: "#5A5A5A",
    },
    {
      id: "doorHandleRR",
      type: "cylinder",
      offset: { x: 172, y: 50, z: 2 },
      size: { width: 0, height: 30, depth: 0, radius: 2 },
      color: "#5A5A5A",
    },
    // 后门门栓
    {
      id: "doorLatch1",
      type: "cube",
      offset: { x: 171, y: 70, z: 0 },
      size: { width: 4, height: 2, depth: 6, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "doorLatch2",
      type: "cube",
      offset: { x: 171, y: 30, z: 0 },
      size: { width: 4, height: 2, depth: 6, radius: 0 },
      color: "#3D3D3D",
    },

    // ─── 后尾灯组合 ───
    // 左尾灯（红色）
    {
      id: "tailLightL",
      type: "cube",
      offset: { x: 171, y: 30, z: -22 },
      size: { width: 1, height: 12, depth: 8, radius: 0 },
      color: "#F5222D",
    },
    // 右尾灯（红色）
    {
      id: "tailLightR",
      type: "cube",
      offset: { x: 171, y: 30, z: 22 },
      size: { width: 1, height: 12, depth: 8, radius: 0 },
      color: "#F5222D",
    },
    // 牌照灯
    {
      id: "licenseLight",
      type: "cube",
      offset: { x: 171, y: 18, z: 0 },
      size: { width: 1, height: 3, depth: 14, radius: 0 },
      color: "#FAFAFA",
    },
    // 牌照
    {
      id: "license",
      type: "cube",
      offset: { x: 172, y: 14, z: 0 },
      size: { width: 1, height: 6, depth: 14, radius: 0 },
      color: "#FAFAFA",
    },

    // ─── 双联桥车轮（4 轮） ───
    // 左后轮 1
    {
      id: "rearWheelL1",
      type: "cylinder",
      offset: { x: 140, y: 12, z: -28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
      labelKey: "digitaltwin.part.rollers",
    },
    {
      id: "rearHubL1",
      type: "cylinder",
      offset: { x: 140, y: 12, z: -28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 左后轮 2
    {
      id: "rearWheelL2",
      type: "cylinder",
      offset: { x: 160, y: 12, z: -28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
    },
    {
      id: "rearHubL2",
      type: "cylinder",
      offset: { x: 160, y: 12, z: -28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 右后轮 1
    {
      id: "rearWheelR1",
      type: "cylinder",
      offset: { x: 140, y: 12, z: 28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
    },
    {
      id: "rearHubR1",
      type: "cylinder",
      offset: { x: 140, y: 12, z: 28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 右后轮 2
    {
      id: "rearWheelR2",
      type: "cylinder",
      offset: { x: 160, y: 12, z: 28 },
      size: { width: 0, height: 12, depth: 0, radius: 12 },
      color: "#1A1A1A",
    },
    {
      id: "rearHubR2",
      type: "cylinder",
      offset: { x: 160, y: 12, z: 28 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },

    // ─── 挡泥板 ───
    // 左挡泥板
    {
      id: "mudFlapL",
      type: "cube",
      offset: { x: 175, y: 8, z: -28 },
      size: { width: 4, height: 14, depth: 2, radius: 0 },
      color: "#1A1A1A",
    },
    // 右挡泥板
    {
      id: "mudFlapR",
      type: "cube",
      offset: { x: 175, y: 8, z: 28 },
      size: { width: 4, height: 14, depth: 2, radius: 0 },
      color: "#1A1A1A",
    },

    // ─── 支撑腿（驻车时放下） ───
    // 左支撑腿
    {
      id: "landingGearL",
      type: "cylinder",
      offset: { x: -20, y: 12, z: -28 },
      size: { width: 0, height: 24, depth: 0, radius: 4 },
      color: "#5A5A5A",
    },
    // 左支撑腿底座
    {
      id: "landingPadL",
      type: "cube",
      offset: { x: -20, y: 0, z: -28 },
      size: { width: 12, height: 4, depth: 12, radius: 0 },
      color: "#3D3D3D",
    },
    // 右支撑腿
    {
      id: "landingGearR",
      type: "cylinder",
      offset: { x: -20, y: 12, z: 28 },
      size: { width: 0, height: 24, depth: 0, radius: 4 },
      color: "#5A5A5A",
    },
    // 右支撑腿底座
    {
      id: "landingPadR",
      type: "cube",
      offset: { x: -20, y: 0, z: 28 },
      size: { width: 12, height: 4, depth: 12, radius: 0 },
      color: "#3D3D3D",
    },

    // ─── 侧标志灯与反光标识 ───
    // 侧标志灯（黄色，每侧 3 个）
    {
      id: "sideMarkerL1",
      type: "sphere",
      offset: { x: 0, y: 80, z: -29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    {
      id: "sideMarkerL2",
      type: "sphere",
      offset: { x: 70, y: 80, z: -29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    {
      id: "sideMarkerL3",
      type: "sphere",
      offset: { x: 140, y: 80, z: -29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    {
      id: "sideMarkerR1",
      type: "sphere",
      offset: { x: 0, y: 80, z: 29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    {
      id: "sideMarkerR2",
      type: "sphere",
      offset: { x: 70, y: 80, z: 29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    {
      id: "sideMarkerR3",
      type: "sphere",
      offset: { x: 140, y: 80, z: 29 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5A623",
    },
    // 反光标识带（红色+黄色交替）
    {
      id: "reflectorL1",
      type: "cube",
      offset: { x: 30, y: 25, z: -29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "reflectorL2",
      type: "cube",
      offset: { x: 60, y: 25, z: -29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "reflectorL3",
      type: "cube",
      offset: { x: 90, y: 25, z: -29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "reflectorL4",
      type: "cube",
      offset: { x: 120, y: 25, z: -29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "reflectorR1",
      type: "cube",
      offset: { x: 30, y: 25, z: 29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "reflectorR2",
      type: "cube",
      offset: { x: 60, y: 25, z: 29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "reflectorR3",
      type: "cube",
      offset: { x: 90, y: 25, z: 29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "reflectorR4",
      type: "cube",
      offset: { x: 120, y: 25, z: 29 },
      size: { width: 16, height: 3, depth: 1, radius: 0 },
      color: "#F5A623",
    },

    // ─── 工具箱（挂车侧面） ───
    {
      id: "toolBox",
      type: "cube",
      offset: { x: -10, y: 25, z: -28 },
      size: { width: 20, height: 14, depth: 4, radius: 0 },
      color: "#4A4A4A",
    },

    // ─── 备胎架（挂车底部） ───
    {
      id: "spareTire",
      type: "cylinder",
      offset: { x: 30, y: 12, z: -28 },
      size: { width: 0, height: 10, depth: 0, radius: 10 },
      color: "#1A1A1A",
    },
  ],
  parameters: [
    {
      name: "load",
      labelKey: "digitaltwin.param.load",
      type: "number",
      default: 30,
      unitKey: "digitaltwin.property.unit.ton",
    },
    {
      name: "speed",
      labelKey: "digitaltwin.param.speed",
      type: "number",
      default: 80,
      unitKey: "digitaltwin.property.unit.kmh",
    },
  ],
  sensorMetrics: ["speed", "efficiency"],
};

/** 传送带 Conveyor：框架 + 皮带 + 6 滚筒 + 2 支腿（工业级） */
const DT_CONVEYOR_PRESET: DtModelPreset = {
  type: "conveyor",
  labelKey: "digitaltwin.model.conveyor",
  categoryKey: "digitaltwin.library.category.logistics",
  icon: "Right",
  defaultColor: "#1890FF",
  defaultSize: { width: 220, height: 50, depth: 60, radius: 0 },
  defaultAnimation: {
    type: "rotation",
    partId: "roller1",
    axis: "x",
    speed: 360,
  },
  parts: [
    // 主框架（钢结构）
    {
      id: "frame",
      type: "cube",
      offset: { x: 0, y: 25, z: 0 },
      size: { width: 220, height: 8, depth: 50, radius: 0 },
      color: "#3D3D3D",
      labelKey: "digitaltwin.part.frame",
    },
    // 框架加强筋
    {
      id: "frameRib1",
      type: "cube",
      offset: { x: -80, y: 30, z: 0 },
      size: { width: 4, height: 6, depth: 46, radius: 0 },
      color: "#2A2A2A",
    },
    {
      id: "frameRib2",
      type: "cube",
      offset: { x: 80, y: 30, z: 0 },
      size: { width: 4, height: 6, depth: 46, radius: 0 },
      color: "#2A2A2A",
    },
    // 皮带
    {
      id: "belt",
      type: "cube",
      offset: { x: 0, y: 33, z: 0 },
      size: { width: 210, height: 2, depth: 36, radius: 0 },
      color: "#1A1A1A",
      labelKey: "digitaltwin.part.belt",
    },
    // 6 滚筒（驱动+从动+托辊）
    {
      id: "roller1",
      type: "cylinder",
      offset: { x: -100, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
      labelKey: "digitaltwin.part.rollers",
      animatable: true,
    },
    {
      id: "roller2",
      type: "cylinder",
      offset: { x: -60, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
    },
    {
      id: "roller3",
      type: "cylinder",
      offset: { x: -20, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
    },
    {
      id: "roller4",
      type: "cylinder",
      offset: { x: 20, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
    },
    {
      id: "roller5",
      type: "cylinder",
      offset: { x: 60, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
    },
    {
      id: "roller6",
      type: "cylinder",
      offset: { x: 100, y: 32, z: 0 },
      size: { width: 0, height: 36, depth: 0, radius: 9 },
      color: "#8C8C8C",
    },
    // 滚筒端盖（黄色）
    {
      id: "roller1Cap",
      type: "cylinder",
      offset: { x: -100, y: 32, z: 18 },
      size: { width: 0, height: 2, depth: 0, radius: 9 },
      color: "#F5A623",
    },
    {
      id: "roller6Cap",
      type: "cylinder",
      offset: { x: 100, y: 32, z: 18 },
      size: { width: 0, height: 2, depth: 0, radius: 9 },
      color: "#F5A623",
    },
    // 2 支腿（带底板）
    {
      id: "leg1",
      type: "cube",
      offset: { x: -100, y: 10, z: 0 },
      size: { width: 6, height: 24, depth: 30, radius: 0 },
      color: "#5A5A5A",
      labelKey: "digitaltwin.part.legs",
    },
    {
      id: "leg2",
      type: "cube",
      offset: { x: 100, y: 10, z: 0 },
      size: { width: 6, height: 24, depth: 30, radius: 0 },
      color: "#5A5A5A",
    },
    // 支腿底板
    {
      id: "leg1Base",
      type: "cube",
      offset: { x: -100, y: 0, z: 0 },
      size: { width: 16, height: 4, depth: 40, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "leg2Base",
      type: "cube",
      offset: { x: 100, y: 0, z: 0 },
      size: { width: 16, height: 4, depth: 40, radius: 0 },
      color: "#3D3D3D",
    },
    // 驱动电机（侧面）
    {
      id: "driveMotor",
      type: "cube",
      offset: { x: -100, y: 32, z: 28 },
      size: { width: 14, height: 14, depth: 10, radius: 0 },
      color: "#722ED1",
      labelKey: "digitaltwin.part.motor",
    },
    // 驱动链条护罩
    {
      id: "chainGuard",
      type: "cube",
      offset: { x: -100, y: 32, z: 22 },
      size: { width: 8, height: 12, depth: 2, radius: 0 },
      color: "#F5A623",
    },
  ],
  parameters: [
    {
      name: "length",
      labelKey: "digitaltwin.param.length",
      type: "number",
      default: 5,
      unitKey: "digitaltwin.property.unit.meter",
    },
    {
      name: "speed",
      labelKey: "digitaltwin.param.speed",
      type: "number",
      default: 1.5,
      unitKey: "digitaltwin.property.unit.meterPerSecond",
    },
  ],
  sensorMetrics: ["speed", "efficiency"],
};

/**
 * 堆垛机 Stacker（工业级 - 自动化立体仓库核心设备）
 *
 * 结构组成：
 * - 双立柱钢结构 + 顶部横梁 + 行走底座
 * - 载货台（带升降导轮 + 安全钳）
 * - 货叉机构（双深位伸缩叉）
 * - 电气控制柜 + 状态指示灯 + 激光测距仪
 * - 滑触线 + 电缆拖链
 * - 检修爬梯 + 安全护栏
 */
const DT_STACKER_PRESET: DtModelPreset = {
  type: "stacker",
  labelKey: "digitaltwin.model.stacker",
  categoryKey: "digitaltwin.library.category.logistics",
  icon: "Rank",
  defaultColor: "#FAAD14",
  defaultSize: { width: 80, height: 240, depth: 80, radius: 0 },
  defaultAnimation: {
    type: "translation",
    partId: "carrier",
    translateAxis: "y",
    range: 160,
    translateSpeed: 0.5,
  },
  parts: [
    // ─── 行走底座 ───
    // 底盘主梁（重型钢）
    {
      id: "baseFrame",
      type: "cube",
      offset: { x: 0, y: 4, z: 0 },
      size: { width: 70, height: 8, depth: 60, radius: 0 },
      color: "#2A2A2A",
      labelKey: "digitaltwin.part.base",
    },
    // 底盘加强筋
    {
      id: "baseRib1",
      type: "cube",
      offset: { x: -20, y: 8, z: 0 },
      size: { width: 4, height: 6, depth: 56, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "baseRib2",
      type: "cube",
      offset: { x: 20, y: 8, z: 0 },
      size: { width: 4, height: 6, depth: 56, radius: 0 },
      color: "#3D3D3D",
    },
    // 行走轮（2 个）
    {
      id: "travelWheel1",
      type: "cylinder",
      offset: { x: -25, y: 2, z: 0 },
      size: { width: 0, height: 14, depth: 0, radius: 8 },
      color: "#1A1A1A",
      labelKey: "digitaltwin.part.rollers",
    },
    {
      id: "travelWheel2",
      type: "cylinder",
      offset: { x: 25, y: 2, z: 0 },
      size: { width: 0, height: 14, depth: 0, radius: 8 },
      color: "#1A1A1A",
    },
    // 行走轮导轨
    {
      id: "rail1",
      type: "cube",
      offset: { x: -25, y: -2, z: 0 },
      size: { width: 8, height: 2, depth: 70, radius: 0 },
      color: "#5A5A5A",
    },
    {
      id: "rail2",
      type: "cube",
      offset: { x: 25, y: -2, z: 0 },
      size: { width: 8, height: 2, depth: 70, radius: 0 },
      color: "#5A5A5A",
    },

    // ─── 双立柱（I 型钢） ───
    // 左立柱
    {
      id: "pillarL",
      type: "cube",
      offset: { x: -28, y: 120, z: 0 },
      size: { width: 10, height: 240, depth: 14, radius: 0 },
      color: "#FAAD14",
      labelKey: "digitaltwin.part.frame",
    },
    // 左立柱翼缘板
    {
      id: "pillarLFlange1",
      type: "cube",
      offset: { x: -28, y: 120, z: 7 },
      size: { width: 14, height: 240, depth: 2, radius: 0 },
      color: "#D48806",
    },
    {
      id: "pillarLFlange2",
      type: "cube",
      offset: { x: -28, y: 120, z: -7 },
      size: { width: 14, height: 240, depth: 2, radius: 0 },
      color: "#D48806",
    },
    // 右立柱
    {
      id: "pillarR",
      type: "cube",
      offset: { x: 28, y: 120, z: 0 },
      size: { width: 10, height: 240, depth: 14, radius: 0 },
      color: "#FAAD14",
    },
    // 右立柱翼缘板
    {
      id: "pillarRFlange1",
      type: "cube",
      offset: { x: 28, y: 120, z: 7 },
      size: { width: 14, height: 240, depth: 2, radius: 0 },
      color: "#D48806",
    },
    {
      id: "pillarRFlange2",
      type: "cube",
      offset: { x: 28, y: 120, z: -7 },
      size: { width: 14, height: 240, depth: 2, radius: 0 },
      color: "#D48806",
    },

    // ─── 顶部横梁与导轨 ───
    // 顶部主横梁
    {
      id: "topBeam",
      type: "cube",
      offset: { x: 0, y: 232, z: 0 },
      size: { width: 70, height: 12, depth: 14, radius: 0 },
      color: "#FAAD14",
    },
    // 顶部天轨（导轨）
    {
      id: "topRail",
      type: "cube",
      offset: { x: 0, y: 222, z: 0 },
      size: { width: 4, height: 4, depth: 60, radius: 0 },
      color: "#5A5A5A",
    },
    // 顶部检修平台
    {
      id: "topPlatform",
      type: "cube",
      offset: { x: 0, y: 226, z: 16 },
      size: { width: 60, height: 3, depth: 14, radius: 0 },
      color: "#3D3D3D",
    },
    // 顶部安全护栏（4 立杆 + 横杆）
    {
      id: "railingPost1",
      type: "cube",
      offset: { x: -28, y: 234, z: 22 },
      size: { width: 2, height: 12, depth: 2, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "railingPost2",
      type: "cube",
      offset: { x: 28, y: 234, z: 22 },
      size: { width: 2, height: 12, depth: 2, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "railingTop",
      type: "cube",
      offset: { x: 0, y: 244, z: 22 },
      size: { width: 56, height: 2, depth: 2, radius: 0 },
      color: "#F5A623",
    },

    // ─── 载货台（带导轮与安全钳） ───
    // 载货台主体
    {
      id: "carrier",
      type: "cube",
      offset: { x: 0, y: 120, z: 0 },
      size: { width: 50, height: 20, depth: 30, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.body",
      animatable: true,
    },
    // 载货台侧板（装饰）
    {
      id: "carrierSide1",
      type: "cube",
      offset: { x: -26, y: 120, z: 0 },
      size: { width: 2, height: 18, depth: 28, radius: 0 },
      color: "#0070C0",
    },
    {
      id: "carrierSide2",
      type: "cube",
      offset: { x: 26, y: 120, z: 0 },
      size: { width: 2, height: 18, depth: 28, radius: 0 },
      color: "#0070C0",
    },
    // 导向轮（左右各 2 个，贴立柱）
    {
      id: "guideRoller1",
      type: "cylinder",
      offset: { x: -23, y: 110, z: 8 },
      size: { width: 0, height: 8, depth: 0, radius: 4 },
      color: "#1A1A1A",
    },
    {
      id: "guideRoller2",
      type: "cylinder",
      offset: { x: -23, y: 130, z: 8 },
      size: { width: 0, height: 8, depth: 0, radius: 4 },
      color: "#1A1A1A",
    },
    {
      id: "guideRoller3",
      type: "cylinder",
      offset: { x: 23, y: 110, z: 8 },
      size: { width: 0, height: 8, depth: 0, radius: 4 },
      color: "#1A1A1A",
    },
    {
      id: "guideRoller4",
      type: "cylinder",
      offset: { x: 23, y: 130, z: 8 },
      size: { width: 0, height: 8, depth: 0, radius: 4 },
      color: "#1A1A1A",
    },
    // 安全钳（防坠器，红色）
    {
      id: "safetyCatch1",
      type: "cube",
      offset: { x: -22, y: 116, z: -8 },
      size: { width: 4, height: 6, depth: 6, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "safetyCatch2",
      type: "cube",
      offset: { x: 22, y: 116, z: -8 },
      size: { width: 4, height: 6, depth: 6, radius: 0 },
      color: "#F5222D",
    },

    // ─── 货叉机构（双深位伸缩叉） ───
    // 固定叉
    {
      id: "forkFixed",
      type: "cube",
      offset: { x: 0, y: 110, z: 18 },
      size: { width: 40, height: 4, depth: 20, radius: 0 },
      color: "#5A5A5A",
      labelKey: "digitaltwin.part.frame",
    },
    // 中叉（可伸缩）
    {
      id: "forkMiddle",
      type: "cube",
      offset: { x: 0, y: 110, z: 32 },
      size: { width: 50, height: 4, depth: 20, radius: 0 },
      color: "#8C8C8C",
    },
    // 顶叉（可伸缩）
    {
      id: "forkTop",
      type: "cube",
      offset: { x: 0, y: 110, z: 46 },
      size: { width: 60, height: 3, depth: 18, radius: 0 },
      color: "#B8B8B8",
    },

    // ─── 电气与控制系统 ───
    // 电气控制柜
    {
      id: "controlBox",
      type: "cube",
      offset: { x: -28, y: 60, z: 12 },
      size: { width: 8, height: 30, depth: 18, radius: 0 },
      color: "#3D3D3D",
      labelKey: "digitaltwin.part.led",
    },
    // 控制柜显示屏
    {
      id: "display",
      type: "cube",
      offset: { x: -28, y: 68, z: 22 },
      size: { width: 6, height: 8, depth: 1, radius: 0 },
      color: "#52C41A",
    },
    // 状态指示灯（3 灯塔，红黄绿）
    {
      id: "beaconBase",
      type: "cylinder",
      offset: { x: -28, y: 78, z: 12 },
      size: { width: 0, height: 4, depth: 0, radius: 4 },
      color: "#2A2A2A",
    },
    {
      id: "beaconRed",
      type: "cylinder",
      offset: { x: -28, y: 82, z: 12 },
      size: { width: 0, height: 6, depth: 0, radius: 4 },
      color: "#F5222D",
    },
    {
      id: "beaconYellow",
      type: "cylinder",
      offset: { x: -28, y: 88, z: 12 },
      size: { width: 0, height: 6, depth: 0, radius: 4 },
      color: "#F5A623",
    },
    {
      id: "beaconGreen",
      type: "cylinder",
      offset: { x: -28, y: 94, z: 12 },
      size: { width: 0, height: 6, depth: 0, radius: 4 },
      color: "#52C41A",
    },
    // 激光测距仪
    {
      id: "laserSensor",
      type: "cube",
      offset: { x: 0, y: 232, z: 10 },
      size: { width: 6, height: 4, depth: 4, radius: 0 },
      color: "#1A1A1A",
    },

    // ─── 滑触线与电缆拖链 ───
    // 滑触线导管
    {
      id: "conductorRail",
      type: "cube",
      offset: { x: -28, y: 120, z: -10 },
      size: { width: 4, height: 4, depth: 220, radius: 0 },
      color: "#5A5A5A",
    },
    // 电缆拖链
    {
      id: "cableChain1",
      type: "cube",
      offset: { x: -22, y: 110, z: -10 },
      size: { width: 2, height: 6, depth: 4, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "cableChain2",
      type: "cube",
      offset: { x: -22, y: 100, z: -10 },
      size: { width: 2, height: 6, depth: 4, radius: 0 },
      color: "#3D3D3D",
    },

    // ─── 检修爬梯 ───
    // 爬梯侧杆
    {
      id: "ladderRail1",
      type: "cube",
      offset: { x: 32, y: 120, z: 0 },
      size: { width: 2, height: 220, depth: 2, radius: 0 },
      color: "#5A5A5A",
    },
    {
      id: "ladderRail2",
      type: "cube",
      offset: { x: 38, y: 120, z: 0 },
      size: { width: 2, height: 220, depth: 2, radius: 0 },
      color: "#5A5A5A",
    },
    // 爬梯横档
    {
      id: "ladderRung1",
      type: "cube",
      offset: { x: 35, y: 30, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung2",
      type: "cube",
      offset: { x: 35, y: 60, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung3",
      type: "cube",
      offset: { x: 35, y: 90, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung4",
      type: "cube",
      offset: { x: 35, y: 120, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung5",
      type: "cube",
      offset: { x: 35, y: 150, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung6",
      type: "cube",
      offset: { x: 35, y: 180, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "ladderRung7",
      type: "cube",
      offset: { x: 35, y: 210, z: 0 },
      size: { width: 8, height: 2, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },

    // ─── 厂家铭牌 ───
    {
      id: "nameplate",
      type: "cube",
      offset: { x: 0, y: 120, z: 16 },
      size: { width: 12, height: 6, depth: 1, radius: 0 },
      color: "#C0C0C0",
    },
  ],
  parameters: [
    {
      name: "height",
      labelKey: "digitaltwin.param.height",
      type: "number",
      default: 12,
      unitKey: "digitaltwin.property.unit.meter",
    },
    {
      name: "load",
      labelKey: "digitaltwin.param.load",
      type: "number",
      default: 1.5,
      unitKey: "digitaltwin.property.unit.ton",
    },
    {
      name: "speed",
      labelKey: "digitaltwin.param.speed",
      type: "number",
      default: 2.0,
      unitKey: "digitaltwin.property.unit.meterPerSecond",
    },
  ],
  sensorMetrics: ["speed", "efficiency"],
};

/**
 * AGV 自动导引车（工业级 - 智能物流搬运设备）
 *
 * 结构组成：
 * - 低位车体（带防撞裙边 + 反光警示带）
 * - 麦克纳姆轮/舵轮（4 轮独立驱动）
 * - 顶升机构（液压/电动）
 * - 货物承载平台
 * - 激光雷达导航 + 反光板
 * - 声光报警 + 急停按钮 + 状态指示灯
 * - 电池组 + 充电极板
 */
const DT_AGV_PRESET: DtModelPreset = {
  type: "agv",
  labelKey: "digitaltwin.model.agv",
  categoryKey: "digitaltwin.library.category.logistics",
  icon: "Position",
  defaultColor: "#722ED1",
  defaultSize: { width: 120, height: 90, depth: 100, radius: 0 },
  defaultAnimation: {
    type: "translation",
    partId: "body",
    translateAxis: "x",
    range: 80,
    translateSpeed: 0.3,
  },
  parts: [
    // ─── 车体底盘 ───
    // 主车体（深紫）
    {
      id: "body",
      type: "cube",
      offset: { x: 0, y: 18, z: 0 },
      size: { width: 100, height: 18, depth: 90, radius: 0 },
      color: "#722ED1",
      labelKey: "digitaltwin.part.body",
      animatable: true,
    },
    // 车体顶板
    {
      id: "bodyTop",
      type: "cube",
      offset: { x: 0, y: 28, z: 0 },
      size: { width: 100, height: 3, depth: 90, radius: 0 },
      color: "#531DAB",
    },
    // 防撞裙边（黄色橡胶）
    {
      id: "bumperSkirt1",
      type: "cube",
      offset: { x: 0, y: 12, z: 46 },
      size: { width: 100, height: 4, depth: 2, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "bumperSkirt2",
      type: "cube",
      offset: { x: 0, y: 12, z: -46 },
      size: { width: 100, height: 4, depth: 2, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "bumperSkirt3",
      type: "cube",
      offset: { x: -51, y: 12, z: 0 },
      size: { width: 2, height: 4, depth: 90, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "bumperSkirt4",
      type: "cube",
      offset: { x: 51, y: 12, z: 0 },
      size: { width: 2, height: 4, depth: 90, radius: 0 },
      color: "#F5A623",
    },
    // 反光警示带（前后）
    {
      id: "warningBand1",
      type: "cube",
      offset: { x: 0, y: 22, z: 46 },
      size: { width: 90, height: 6, depth: 1, radius: 0 },
      color: "#F5222D",
    },
    {
      id: "warningBand2",
      type: "cube",
      offset: { x: 0, y: 22, z: -46 },
      size: { width: 90, height: 6, depth: 1, radius: 0 },
      color: "#F5222D",
    },

    // ─── 麦克纳姆轮（4 轮，可全向移动） ───
    // 左前轮
    {
      id: "wheelLF",
      type: "cylinder",
      offset: { x: -45, y: 8, z: -35 },
      size: { width: 0, height: 12, depth: 0, radius: 14 },
      color: "#1A1A1A",
      labelKey: "digitaltwin.part.rollers",
    },
    // 左前轮轮毂
    {
      id: "hubLF",
      type: "cylinder",
      offset: { x: -45, y: 8, z: -35 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 麦克纳姆轮辊子（4 个，斜向）
    {
      id: "rollerLF1",
      type: "cylinder",
      offset: { x: -45, y: 14, z: -35 },
      size: { width: 0, height: 6, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },
    {
      id: "rollerLF2",
      type: "cylinder",
      offset: { x: -45, y: 2, z: -35 },
      size: { width: 0, height: 6, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },
    // 右前轮
    {
      id: "wheelRF",
      type: "cylinder",
      offset: { x: 45, y: 8, z: -35 },
      size: { width: 0, height: 12, depth: 0, radius: 14 },
      color: "#1A1A1A",
    },
    {
      id: "hubRF",
      type: "cylinder",
      offset: { x: 45, y: 8, z: -35 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 左后轮
    {
      id: "wheelLR",
      type: "cylinder",
      offset: { x: -45, y: 8, z: 35 },
      size: { width: 0, height: 12, depth: 0, radius: 14 },
      color: "#1A1A1A",
    },
    {
      id: "hubLR",
      type: "cylinder",
      offset: { x: -45, y: 8, z: 35 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },
    // 右后轮
    {
      id: "wheelRR",
      type: "cylinder",
      offset: { x: 45, y: 8, z: 35 },
      size: { width: 0, height: 12, depth: 0, radius: 14 },
      color: "#1A1A1A",
    },
    {
      id: "hubRR",
      type: "cylinder",
      offset: { x: 45, y: 8, z: 35 },
      size: { width: 0, height: 14, depth: 0, radius: 6 },
      color: "#5A5A5A",
    },

    // ─── 顶升机构（电动缸） ───
    // 顶升电机
    {
      id: "liftMotor",
      type: "cylinder",
      offset: { x: 0, y: 30, z: 0 },
      size: { width: 0, height: 8, depth: 0, radius: 10 },
      color: "#5A5A5A",
      labelKey: "digitaltwin.part.motor",
    },
    // 顶升导向柱（4 根）
    {
      id: "liftGuide1",
      type: "cylinder",
      offset: { x: -30, y: 30, z: -30 },
      size: { width: 0, height: 14, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },
    {
      id: "liftGuide2",
      type: "cylinder",
      offset: { x: 30, y: 30, z: -30 },
      size: { width: 0, height: 14, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },
    {
      id: "liftGuide3",
      type: "cylinder",
      offset: { x: -30, y: 30, z: 30 },
      size: { width: 0, height: 14, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },
    {
      id: "liftGuide4",
      type: "cylinder",
      offset: { x: 30, y: 30, z: 30 },
      size: { width: 0, height: 14, depth: 0, radius: 3 },
      color: "#9B9B9B",
    },

    // ─── 承载平台（顶升板） ───
    {
      id: "loadPlatform",
      type: "cube",
      offset: { x: 0, y: 42, z: 0 },
      size: { width: 90, height: 4, depth: 80, radius: 0 },
      color: "#1890FF",
      labelKey: "digitaltwin.part.frame",
    },
    // 平台防滑纹
    {
      id: "platformGrip1",
      type: "cube",
      offset: { x: -30, y: 44, z: 0 },
      size: { width: 2, height: 1, depth: 70, radius: 0 },
      color: "#0070C0",
    },
    {
      id: "platformGrip2",
      type: "cube",
      offset: { x: 0, y: 44, z: 0 },
      size: { width: 2, height: 1, depth: 70, radius: 0 },
      color: "#0070C0",
    },
    {
      id: "platformGrip3",
      type: "cube",
      offset: { x: 30, y: 44, z: 0 },
      size: { width: 2, height: 1, depth: 70, radius: 0 },
      color: "#0070C0",
    },

    // ─── 激光雷达导航 ───
    // 顶部激光雷达（前后各 1）
    {
      id: "lidar1",
      type: "cylinder",
      offset: { x: -35, y: 30, z: -45 },
      size: { width: 0, height: 8, depth: 0, radius: 6 },
      color: "#1A1A1A",
    },
    {
      id: "lidar1Top",
      type: "cylinder",
      offset: { x: -35, y: 34, z: -45 },
      size: { width: 0, height: 2, depth: 0, radius: 5 },
      color: "#5A5A5A",
    },
    {
      id: "lidar2",
      type: "cylinder",
      offset: { x: 35, y: 30, z: 45 },
      size: { width: 0, height: 8, depth: 0, radius: 6 },
      color: "#1A1A1A",
    },
    {
      id: "lidar2Top",
      type: "cylinder",
      offset: { x: 35, y: 34, z: 45 },
      size: { width: 0, height: 2, depth: 0, radius: 5 },
      color: "#5A5A5A",
    },
    // 反光板（导航参考点，4 角）
    {
      id: "reflector1",
      type: "cube",
      offset: { x: -50, y: 22, z: -45 },
      size: { width: 2, height: 8, depth: 2, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "reflector2",
      type: "cube",
      offset: { x: 50, y: 22, z: -45 },
      size: { width: 2, height: 8, depth: 2, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "reflector3",
      type: "cube",
      offset: { x: -50, y: 22, z: 45 },
      size: { width: 2, height: 8, depth: 2, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "reflector4",
      type: "cube",
      offset: { x: 50, y: 22, z: 45 },
      size: { width: 2, height: 8, depth: 2, radius: 0 },
      color: "#FAFAFA",
    },

    // ─── 声光报警 + 急停 + 指示灯 ───
    // 声光报警器（蓝灯）
    {
      id: "beaconBase",
      type: "cylinder",
      offset: { x: -30, y: 32, z: 0 },
      size: { width: 0, height: 4, depth: 0, radius: 5 },
      color: "#2A2A2A",
    },
    {
      id: "beaconBlue",
      type: "cylinder",
      offset: { x: -30, y: 38, z: 0 },
      size: { width: 0, height: 8, depth: 0, radius: 5 },
      color: "#1890FF",
    },
    // 急停按钮（红色蘑菇头）
    {
      id: "estopBase",
      type: "cylinder",
      offset: { x: 30, y: 30, z: 0 },
      size: { width: 0, height: 4, depth: 0, radius: 5 },
      color: "#2A2A2A",
    },
    {
      id: "estopButton",
      type: "cylinder",
      offset: { x: 30, y: 36, z: 0 },
      size: { width: 0, height: 5, depth: 0, radius: 5 },
      color: "#F5222D",
    },
    // 状态指示灯条（绿）
    {
      id: "statusLight1",
      type: "cube",
      offset: { x: 0, y: 24, z: 46 },
      size: { width: 20, height: 2, depth: 1, radius: 0 },
      color: "#52C41A",
    },
    {
      id: "statusLight2",
      type: "cube",
      offset: { x: 0, y: 24, z: -46 },
      size: { width: 20, height: 2, depth: 1, radius: 0 },
      color: "#52C41A",
    },

    // ─── 电池组与充电极板 ───
    // 电池组
    {
      id: "battery",
      type: "cube",
      offset: { x: 0, y: 14, z: 0 },
      size: { width: 40, height: 8, depth: 30, radius: 0 },
      color: "#262626",
      labelKey: "digitaltwin.part.base",
    },
    // 电池状态指示
    {
      id: "batteryIndicator",
      type: "cube",
      offset: { x: 0, y: 19, z: 16 },
      size: { width: 16, height: 2, depth: 1, radius: 0 },
      color: "#52C41A",
    },
    // 侧充电极板
    {
      id: "chargePlate1",
      type: "cube",
      offset: { x: -51, y: 18, z: 0 },
      size: { width: 1, height: 10, depth: 20, radius: 0 },
      color: "#C0C0C0",
    },
    {
      id: "chargePlate2",
      type: "cube",
      offset: { x: 51, y: 18, z: 0 },
      size: { width: 1, height: 10, depth: 20, radius: 0 },
      color: "#C0C0C0",
    },

    // ─── 厂家铭牌 ───
    {
      id: "nameplate",
      type: "cube",
      offset: { x: -20, y: 22, z: 46 },
      size: { width: 14, height: 6, depth: 1, radius: 0 },
      color: "#FAFAFA",
    },
  ],
  parameters: [
    {
      name: "load",
      labelKey: "digitaltwin.param.load",
      type: "number",
      default: 2,
      unitKey: "digitaltwin.property.unit.ton",
    },
    {
      name: "speed",
      labelKey: "digitaltwin.param.speed",
      type: "number",
      default: 1.5,
      unitKey: "digitaltwin.property.unit.meterPerSecond",
    },
    {
      name: "battery",
      labelKey: "digitaltwin.param.battery",
      type: "number",
      default: 80,
      unitKey: "digitaltwin.property.unit.percent",
    },
  ],
  sensorMetrics: ["speed", "efficiency"],
};

/**
 * 货架 RackShelf（工业级 - 重型仓储货架）
 *
 * 结构组成：
 * - 4 根立柱（带孔调节孔 + 螺栓底板）
 * - 多层横梁 + 加强斜撑
 * - 货物托盘（多层不同货物）
 * - 安全销 + 防撞护脚
 * - 货位标签
 */
const DT_RACK_SHELF_PRESET: DtModelPreset = {
  type: "rackShelf",
  labelKey: "digitaltwin.model.rack.shelf",
  categoryKey: "digitaltwin.library.category.logistics",
  icon: "Grid",
  defaultColor: "#FA8C16",
  defaultSize: { width: 140, height: 160, depth: 60, radius: 0 },
  parts: [
    // ─── 立柱底板与螺栓 ───
    // 4 个立柱底板
    {
      id: "basePlate1",
      type: "cube",
      offset: { x: -65, y: 0, z: -25 },
      size: { width: 16, height: 4, depth: 16, radius: 0 },
      color: "#3D3D3D",
      labelKey: "digitaltwin.part.base",
    },
    {
      id: "basePlate2",
      type: "cube",
      offset: { x: 65, y: 0, z: -25 },
      size: { width: 16, height: 4, depth: 16, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "basePlate3",
      type: "cube",
      offset: { x: -65, y: 0, z: 25 },
      size: { width: 16, height: 4, depth: 16, radius: 0 },
      color: "#3D3D3D",
    },
    {
      id: "basePlate4",
      type: "cube",
      offset: { x: 65, y: 0, z: 25 },
      size: { width: 16, height: 4, depth: 16, radius: 0 },
      color: "#3D3D3D",
    },
    // 底板锚固螺栓（每板 4 颗）
    {
      id: "bolt1a",
      type: "sphere",
      offset: { x: -70, y: 4, z: -30 },
      size: { width: 0, height: 0, depth: 0, radius: 1.5 },
      color: "#5A5A5A",
    },
    {
      id: "bolt1b",
      type: "sphere",
      offset: { x: -60, y: 4, z: -20 },
      size: { width: 0, height: 0, depth: 0, radius: 1.5 },
      color: "#5A5A5A",
    },
    {
      id: "bolt2a",
      type: "sphere",
      offset: { x: 60, y: 4, z: -30 },
      size: { width: 0, height: 0, depth: 0, radius: 1.5 },
      color: "#5A5A5A",
    },
    {
      id: "bolt2b",
      type: "sphere",
      offset: { x: 70, y: 4, z: -20 },
      size: { width: 0, height: 0, depth: 0, radius: 1.5 },
      color: "#5A5A5A",
    },

    // ─── 4 根立柱（带翼缘） ───
    // 左前立柱
    {
      id: "pillar1",
      type: "cube",
      offset: { x: -65, y: 80, z: -25 },
      size: { width: 8, height: 160, depth: 8, radius: 0 },
      color: "#FA8C16",
      labelKey: "digitaltwin.part.frame",
    },
    {
      id: "pillar1Web",
      type: "cube",
      offset: { x: -65, y: 80, z: -25 },
      size: { width: 2, height: 160, depth: 12, radius: 0 },
      color: "#D46B08",
    },
    // 右前立柱
    {
      id: "pillar2",
      type: "cube",
      offset: { x: 65, y: 80, z: -25 },
      size: { width: 8, height: 160, depth: 8, radius: 0 },
      color: "#FA8C16",
    },
    {
      id: "pillar2Web",
      type: "cube",
      offset: { x: 65, y: 80, z: -25 },
      size: { width: 2, height: 160, depth: 12, radius: 0 },
      color: "#D46B08",
    },
    // 左后立柱
    {
      id: "pillar3",
      type: "cube",
      offset: { x: -65, y: 80, z: 25 },
      size: { width: 8, height: 160, depth: 8, radius: 0 },
      color: "#FA8C16",
    },
    {
      id: "pillar3Web",
      type: "cube",
      offset: { x: -65, y: 80, z: 25 },
      size: { width: 2, height: 160, depth: 12, radius: 0 },
      color: "#D46B08",
    },
    // 右后立柱
    {
      id: "pillar4",
      type: "cube",
      offset: { x: 65, y: 80, z: 25 },
      size: { width: 8, height: 160, depth: 8, radius: 0 },
      color: "#FA8C16",
    },
    {
      id: "pillar4Web",
      type: "cube",
      offset: { x: 65, y: 80, z: 25 },
      size: { width: 2, height: 160, depth: 12, radius: 0 },
      color: "#D46B08",
    },

    // ─── 横梁（4 层，每层前后 2 根） ───
    // 第 1 层（底）
    {
      id: "beam1F",
      type: "cube",
      offset: { x: 0, y: 32, z: -25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
      labelKey: "digitaltwin.part.frame",
    },
    {
      id: "beam1B",
      type: "cube",
      offset: { x: 0, y: 32, z: 25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    // 第 2 层
    {
      id: "beam2F",
      type: "cube",
      offset: { x: 0, y: 68, z: -25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    {
      id: "beam2B",
      type: "cube",
      offset: { x: 0, y: 68, z: 25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    // 第 3 层
    {
      id: "beam3F",
      type: "cube",
      offset: { x: 0, y: 104, z: -25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    {
      id: "beam3B",
      type: "cube",
      offset: { x: 0, y: 104, z: 25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    // 第 4 层（顶）
    {
      id: "beam4F",
      type: "cube",
      offset: { x: 0, y: 140, z: -25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },
    {
      id: "beam4B",
      type: "cube",
      offset: { x: 0, y: 140, z: 25 },
      size: { width: 130, height: 6, depth: 6, radius: 0 },
      color: "#595959",
    },

    // 横梁安全销（红色，每端 1 个，第 1-3 层）
    {
      id: "safetyPin1",
      type: "sphere",
      offset: { x: -65, y: 32, z: -25 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5222D",
    },
    {
      id: "safetyPin2",
      type: "sphere",
      offset: { x: 65, y: 32, z: -25 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5222D",
    },
    {
      id: "safetyPin3",
      type: "sphere",
      offset: { x: -65, y: 68, z: 25 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5222D",
    },
    {
      id: "safetyPin4",
      type: "sphere",
      offset: { x: 65, y: 68, z: 25 },
      size: { width: 0, height: 0, depth: 0, radius: 2 },
      color: "#F5222D",
    },

    // ─── 加强斜撑（背部交叉撑） ───
    {
      id: "brace1",
      type: "cube",
      offset: { x: -30, y: 50, z: 28 },
      size: { width: 50, height: 3, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "brace2",
      type: "cube",
      offset: { x: 30, y: 50, z: 28 },
      size: { width: 50, height: 3, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "brace3",
      type: "cube",
      offset: { x: -30, y: 122, z: 28 },
      size: { width: 50, height: 3, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },
    {
      id: "brace4",
      type: "cube",
      offset: { x: 30, y: 122, z: 28 },
      size: { width: 50, height: 3, depth: 2, radius: 0 },
      color: "#8C8C8C",
    },

    // ─── 防撞护脚（黄色，4 个） ───
    {
      id: "guardFoot1",
      type: "cube",
      offset: { x: -65, y: 4, z: -32 },
      size: { width: 12, height: 12, depth: 4, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "guardFoot2",
      type: "cube",
      offset: { x: 65, y: 4, z: -32 },
      size: { width: 12, height: 12, depth: 4, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "guardFoot3",
      type: "cube",
      offset: { x: -65, y: 4, z: 32 },
      size: { width: 12, height: 12, depth: 4, radius: 0 },
      color: "#F5A623",
    },
    {
      id: "guardFoot4",
      type: "cube",
      offset: { x: 65, y: 4, z: 32 },
      size: { width: 12, height: 12, depth: 4, radius: 0 },
      color: "#F5A623",
    },

    // ─── 货物托盘（4 层不同货物） ───
    // 第 1 层：木托盘 + 纸箱
    {
      id: "pallet1",
      type: "cube",
      offset: { x: 0, y: 36, z: 0 },
      size: { width: 110, height: 6, depth: 45, radius: 0 },
      color: "#8B5A2B",
      labelKey: "digitaltwin.part.base",
    },
    {
      id: "cargo1a",
      type: "cube",
      offset: { x: -30, y: 48, z: 0 },
      size: { width: 38, height: 24, depth: 38, radius: 0 },
      color: "#D4A574",
      labelKey: "digitaltwin.part.body",
    },
    {
      id: "cargo1b",
      type: "cube",
      offset: { x: 30, y: 48, z: 0 },
      size: { width: 38, height: 24, depth: 38, radius: 0 },
      color: "#A0522D",
    },
    // 第 2 层：蓝色塑料箱
    {
      id: "pallet2",
      type: "cube",
      offset: { x: 0, y: 72, z: 0 },
      size: { width: 110, height: 6, depth: 45, radius: 0 },
      color: "#8B5A2B",
    },
    {
      id: "cargo2a",
      type: "cube",
      offset: { x: 0, y: 86, z: 0 },
      size: { width: 80, height: 22, depth: 38, radius: 0 },
      color: "#1890FF",
    },
    // 第 3 层：绿色货物
    {
      id: "pallet3",
      type: "cube",
      offset: { x: 0, y: 108, z: 0 },
      size: { width: 110, height: 6, depth: 45, radius: 0 },
      color: "#8B5A2B",
    },
    {
      id: "cargo3a",
      type: "cube",
      offset: { x: -25, y: 122, z: 0 },
      size: { width: 36, height: 24, depth: 36, radius: 0 },
      color: "#52C41A",
    },
    {
      id: "cargo3b",
      type: "cube",
      offset: { x: 25, y: 122, z: 0 },
      size: { width: 36, height: 24, depth: 36, radius: 0 },
      color: "#722ED1",
    },

    // ─── 货位标签 ───
    {
      id: "label1",
      type: "cube",
      offset: { x: -65, y: 36, z: -29 },
      size: { width: 6, height: 6, depth: 1, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "label2",
      type: "cube",
      offset: { x: -65, y: 72, z: -29 },
      size: { width: 6, height: 6, depth: 1, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "label3",
      type: "cube",
      offset: { x: -65, y: 108, z: -29 },
      size: { width: 6, height: 6, depth: 1, radius: 0 },
      color: "#FAFAFA",
    },
    {
      id: "label4",
      type: "cube",
      offset: { x: -65, y: 140, z: -29 },
      size: { width: 6, height: 6, depth: 1, radius: 0 },
      color: "#FAFAFA",
    },
  ],
  parameters: [
    {
      name: "layers",
      labelKey: "digitaltwin.param.layers",
      type: "number",
      default: 4,
    },
    {
      name: "load",
      labelKey: "digitaltwin.param.load",
      type: "number",
      default: 5,
      unitKey: "digitaltwin.property.unit.ton",
    },
  ],
};

/** 物流设备模型列表 */
export const DT_LOGISTICS_MODELS: DtModelPreset[] = [
  DT_TRAILER_TRUCK_PRESET,
  DT_CONVEYOR_PRESET,
  DT_STACKER_PRESET,
  DT_AGV_PRESET,
  DT_RACK_SHELF_PRESET,
];
