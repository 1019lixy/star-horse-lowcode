/**
 * 数字孪生 - 基础设施模型库（工业级）
 *
 * 包含：厂房 / 管道 / 照明灯 / 围栏 / 水塔
 * 厂房为工业级渲染：钢架结构 + 屋架桁架 + 通风设备 + 烟囱 + 多排窗户 + 装卸月台
 */
import type { DtModelPreset } from "../types";

/**
 * 厂房 Workshop（工业级）
 *
 * 结构组成：
 * - 混凝土基础 + 钢柱（8 根 I 型钢）
 * - 波纹金属墙面 + 横向装饰带
 * - 钢架屋架（人字形桁架）+ 屋面板 + 采光带
 * - 工业推拉大门 + 人员门 + 多排铝合金窗户
 * - 屋顶通风器（2 台）+ 烟囱（2 根）
 * - 装卸月台 + 雨棚
 * - 排水沟 + 落水管
 */
const DT_WORKSHOP_PRESET: DtModelPreset = {
    type: "workshop",
    labelKey: "digitaltwin.model.workshop",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "House",
    defaultColor: "#8C8C8C",
    defaultSize: { width: 240, height: 130, depth: 180, radius: 0 },
    parts: [
        // ─── 基础与钢结构 ───
        // 混凝土基础
        { id: "foundation", type: "cube", offset: { x: 0, y: -4, z: 0 }, size: { width: 240, height: 8, depth: 180, radius: 0 }, color: "#5C5C5C", labelKey: "digitaltwin.part.base" },
        // 8 根钢柱（I 型钢，深灰）
        { id: "col1", type: "cube", offset: { x: -115, y: 30, z: -85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col2", type: "cube", offset: { x: -115, y: 30, z: 85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col3", type: "cube", offset: { x: 115, y: 30, z: -85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col4", type: "cube", offset: { x: 115, y: 30, z: 85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col5", type: "cube", offset: { x: -115, y: 30, z: 0 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col6", type: "cube", offset: { x: 115, y: 30, z: 0 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col7", type: "cube", offset: { x: 0, y: 30, z: -85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "col8", type: "cube", offset: { x: 0, y: 30, z: 85 }, size: { width: 6, height: 100, depth: 6, radius: 0 }, color: "#3D3D3D" },
        // 横向钢梁（顶部圈梁）
        { id: "beamTop1", type: "cube", offset: { x: 0, y: 78, z: -85 }, size: { width: 240, height: 6, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "beamTop2", type: "cube", offset: { x: 0, y: 78, z: 85 }, size: { width: 240, height: 6, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "beamTop3", type: "cube", offset: { x: -115, y: 78, z: 0 }, size: { width: 6, height: 6, depth: 180, radius: 0 }, color: "#3D3D3D" },
        { id: "beamTop4", type: "cube", offset: { x: 115, y: 78, z: 0 }, size: { width: 6, height: 6, depth: 180, radius: 0 }, color: "#3D3D3D" },
        // 中部腰梁
        { id: "beamMid1", type: "cube", offset: { x: 0, y: 40, z: -85 }, size: { width: 240, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beamMid2", type: "cube", offset: { x: 0, y: 40, z: 85 }, size: { width: 240, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },

        // ─── 墙面板（波纹金属，浅灰） ───
        // 后墙
        { id: "wallBack", type: "cube", offset: { x: 0, y: 40, z: -83 }, size: { width: 230, height: 76, depth: 2, radius: 0 }, color: "#B8B8B8", labelKey: "digitaltwin.part.frame" },
        // 左墙
        { id: "wallLeft", type: "cube", offset: { x: -113, y: 40, z: 0 }, size: { width: 2, height: 76, depth: 170, radius: 0 }, color: "#B8B8B8" },
        // 右墙
        { id: "wallRight", type: "cube", offset: { x: 113, y: 40, z: 0 }, size: { width: 2, height: 76, depth: 170, radius: 0 }, color: "#B8B8B8" },
        // 前墙（带门洞，分两段）
        { id: "wallFrontL", type: "cube", offset: { x: -75, y: 40, z: 83 }, size: { width: 80, height: 76, depth: 2, radius: 0 }, color: "#B8B8B8" },
        { id: "wallFrontR", type: "cube", offset: { x: 75, y: 40, z: 83 }, size: { width: 80, height: 76, depth: 2, radius: 0 }, color: "#B8B8B8" },
        { id: "wallFrontTop", type: "cube", offset: { x: 0, y: 70, z: 83 }, size: { width: 90, height: 16, depth: 2, radius: 0 }, color: "#B8B8B8" },

        // 墙面横向装饰带（工业黄）
        { id: "trimBand1", type: "cube", offset: { x: 0, y: 20, z: -84 }, size: { width: 232, height: 4, depth: 1, radius: 0 }, color: "#F5A623" },
        { id: "trimBand2", type: "cube", offset: { x: 0, y: 60, z: -84 }, size: { width: 232, height: 4, depth: 1, radius: 0 }, color: "#F5A623" },

        // ─── 屋架与屋面 ───
        // 人字形屋架（钢桁架）
        { id: "truss1L", type: "cube", offset: { x: -60, y: 90, z: -85 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "truss1R", type: "cube", offset: { x: 60, y: 90, z: -85 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "truss2L", type: "cube", offset: { x: -60, y: 90, z: 0 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "truss2R", type: "cube", offset: { x: 60, y: 90, z: 0 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "truss3L", type: "cube", offset: { x: -60, y: 90, z: 85 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "truss3R", type: "cube", offset: { x: 60, y: 90, z: 85 }, size: { width: 70, height: 4, depth: 4, radius: 0 }, color: "#3D3D3D" },
        // 屋脊主梁
        { id: "ridgeBeam", type: "cube", offset: { x: 0, y: 108, z: 0 }, size: { width: 6, height: 6, depth: 180, radius: 0 }, color: "#3D3D3D" },
        // 屋面板（左/右坡，深灰金属）
        { id: "roofLeft", type: "cube", offset: { x: -58, y: 100, z: 0 }, size: { width: 110, height: 3, depth: 175, radius: 0 }, color: "#6E6E6E", labelKey: "digitaltwin.part.top" },
        { id: "roofRight", type: "cube", offset: { x: 58, y: 100, z: 0 }, size: { width: 110, height: 3, depth: 175, radius: 0 }, color: "#6E6E6E" },
        // 采光带（屋脊两侧，半透明蓝）
        { id: "skylight1", type: "cube", offset: { x: -10, y: 104, z: 0 }, size: { width: 8, height: 2, depth: 160, radius: 0 }, color: "#4A90E2" },
        { id: "skylight2", type: "cube", offset: { x: 10, y: 104, z: 0 }, size: { width: 8, height: 2, depth: 160, radius: 0 }, color: "#4A90E2" },

        // ─── 工业大门与人员门 ───
        // 主推拉门（双扇，深灰金属）
        { id: "doorMainL", type: "cube", offset: { x: -22, y: 35, z: 84 }, size: { width: 40, height: 70, depth: 3, radius: 0 }, color: "#4A4A4A", labelKey: "digitaltwin.part.body" },
        { id: "doorMainR", type: "cube", offset: { x: 22, y: 35, z: 84 }, size: { width: 40, height: 70, depth: 3, radius: 0 }, color: "#4A4A4A" },
        // 门体横向加强筋
        { id: "doorRail1", type: "cube", offset: { x: 0, y: 55, z: 86 }, size: { width: 84, height: 2, depth: 1, radius: 0 }, color: "#F5A623" },
        { id: "doorRail2", type: "cube", offset: { x: 0, y: 25, z: 86 }, size: { width: 84, height: 2, depth: 1, radius: 0 }, color: "#F5A623" },
        // 门把手
        { id: "doorHandleL", type: "cylinder", offset: { x: -5, y: 35, z: 88 }, size: { width: 0, height: 12, depth: 0, radius: 2 }, color: "#3D3D3D" },
        { id: "doorHandleR", type: "cylinder", offset: { x: 5, y: 35, z: 88 }, size: { width: 0, height: 12, depth: 0, radius: 2 }, color: "#3D3D3D" },
        // 人员门（右侧）
        { id: "personDoor", type: "cube", offset: { x: 100, y: 30, z: 84 }, size: { width: 20, height: 60, depth: 3, radius: 0 }, color: "#5A5A5A" },

        // ─── 多排铝合金窗户 ───
        // 后墙窗户（4 扇，上排）
        { id: "winB1", type: "cube", offset: { x: -75, y: 60, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2", labelKey: "digitaltwin.part.screen" },
        { id: "winB2", type: "cube", offset: { x: -25, y: 60, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        { id: "winB3", type: "cube", offset: { x: 25, y: 60, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        { id: "winB4", type: "cube", offset: { x: 75, y: 60, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        // 后墙窗户（4 扇，下排）
        { id: "winB5", type: "cube", offset: { x: -75, y: 30, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        { id: "winB6", type: "cube", offset: { x: -25, y: 30, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        { id: "winB7", type: "cube", offset: { x: 25, y: 30, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        { id: "winB8", type: "cube", offset: { x: 75, y: 30, z: -84 }, size: { width: 28, height: 18, depth: 1, radius: 0 }, color: "#4A90E2" },
        // 左侧墙窗户（3 扇）
        { id: "winL1", type: "cube", offset: { x: -114, y: 60, z: -50 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },
        { id: "winL2", type: "cube", offset: { x: -114, y: 60, z: 0 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },
        { id: "winL3", type: "cube", offset: { x: -114, y: 60, z: 50 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },
        // 右侧墙窗户（3 扇）
        { id: "winR1", type: "cube", offset: { x: 114, y: 60, z: -50 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },
        { id: "winR2", type: "cube", offset: { x: 114, y: 60, z: 0 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },
        { id: "winR3", type: "cube", offset: { x: 114, y: 60, z: 50 }, size: { width: 1, height: 18, depth: 28, radius: 0 }, color: "#4A90E2" },

        // ─── 屋顶通风设备 ───
        // 屋顶通风器（2 台，圆柱形）
        { id: "vent1", type: "cylinder", offset: { x: -60, y: 108, z: -40 }, size: { width: 0, height: 16, depth: 0, radius: 14 }, color: "#5A5A5A", labelKey: "digitaltwin.part.led" },
        { id: "vent1Cap", type: "cylinder", offset: { x: -60, y: 124, z: -40 }, size: { width: 0, height: 4, depth: 0, radius: 16 }, color: "#3D3D3D" },
        { id: "vent2", type: "cylinder", offset: { x: 60, y: 108, z: 40 }, size: { width: 0, height: 16, depth: 0, radius: 14 }, color: "#5A5A5A" },
        { id: "vent2Cap", type: "cylinder", offset: { x: 60, y: 124, z: 40 }, size: { width: 0, height: 4, depth: 0, radius: 16 }, color: "#3D3D3D" },

        // ─── 烟囱（2 根，不锈钢） ───
        { id: "stack1", type: "cylinder", offset: { x: -80, y: 108, z: 60 }, size: { width: 0, height: 50, depth: 0, radius: 8 }, color: "#9B9B9B", labelKey: "digitaltwin.part.outlet" },
        { id: "stack1Cap", type: "cylinder", offset: { x: -80, y: 158, z: 60 }, size: { width: 0, height: 4, depth: 0, radius: 10 }, color: "#3D3D3D" },
        { id: "stack2", type: "cylinder", offset: { x: 80, y: 108, z: -60 }, size: { width: 0, height: 50, depth: 0, radius: 8 }, color: "#9B9B9B" },
        { id: "stack2Cap", type: "cylinder", offset: { x: 80, y: 158, z: -60 }, size: { width: 0, height: 4, depth: 0, radius: 10 }, color: "#3D3D3D" },

        // ─── 排水系统 ───
        // 屋檐排水沟（前后各一根）
        { id: "gutter1", type: "cube", offset: { x: 0, y: 82, z: -88 }, size: { width: 230, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "gutter2", type: "cube", offset: { x: 0, y: 82, z: 88 }, size: { width: 230, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        // 落水管（4 根）
        { id: "downspout1", type: "cylinder", offset: { x: -115, y: 40, z: -88 }, size: { width: 0, height: 80, depth: 0, radius: 3 }, color: "#5A5A5A" },
        { id: "downspout2", type: "cylinder", offset: { x: 115, y: 40, z: -88 }, size: { width: 0, height: 80, depth: 0, radius: 3 }, color: "#5A5A5A" },
        { id: "downspout3", type: "cylinder", offset: { x: -115, y: 40, z: 88 }, size: { width: 0, height: 80, depth: 0, radius: 3 }, color: "#5A5A5A" },
        { id: "downspout4", type: "cylinder", offset: { x: 115, y: 40, z: 88 }, size: { width: 0, height: 80, depth: 0, radius: 3 }, color: "#5A5A5A" },

        // ─── 装卸月台 ───
        // 月台主体
        { id: "dockPlatform", type: "cube", offset: { x: 0, y: 8, z: 100 }, size: { width: 220, height: 16, depth: 30, radius: 0 }, color: "#6E6E6E", labelKey: "digitaltwin.part.base" },
        // 月台雨棚
        { id: "dockCanopy", type: "cube", offset: { x: 0, y: 70, z: 105 }, size: { width: 220, height: 3, depth: 20, radius: 0 }, color: "#5A5A5A" },
        // 雨棚支撑柱（4 根）
        { id: "dockPost1", type: "cube", offset: { x: -90, y: 40, z: 110 }, size: { width: 4, height: 60, depth: 4, radius: 0 }, color: "#3D3D3D" },
        { id: "dockPost2", type: "cube", offset: { x: 90, y: 40, z: 110 }, size: { width: 4, height: 60, depth: 4, radius: 0 }, color: "#3D3D3D" },
        // 月台警示带（黄黑相间）
        { id: "dockWarn1", type: "cube", offset: { x: -60, y: 16, z: 116 }, size: { width: 30, height: 3, depth: 1, radius: 0 }, color: "#F5A623" },
        { id: "dockWarn2", type: "cube", offset: { x: 0, y: 16, z: 116 }, size: { width: 30, height: 3, depth: 1, radius: 0 }, color: "#3D3D3D" },
        { id: "dockWarn3", type: "cube", offset: { x: 60, y: 16, z: 116 }, size: { width: 30, height: 3, depth: 1, radius: 0 }, color: "#F5A623" },
    ],
    parameters: [
        { name: "area", labelKey: "digitaltwin.param.area", type: "number", default: 1000, unitKey: "digitaltwin.property.unit.squareMeter" },
        { name: "floors", labelKey: "digitaltwin.param.layers", type: "number", default: 1 },
    ],
};

/** 管道 Pipeline：直管 + 法兰×2 + 支架 + 阀门标识 */
const DT_PIPELINE_PRESET: DtModelPreset = {
    type: "pipeline",
    labelKey: "digitaltwin.model.pipeline",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Connection",
    defaultColor: "#1890FF",
    defaultSize: { width: 120, height: 24, depth: 24, radius: 0 },
    parts: [
        // 主管道
        { id: "pipe", type: "cylinder", offset: { x: 0, y: 12, z: 0 }, size: { width: 0, height: 100, depth: 0, radius: 10 }, color: "#1890FF", labelKey: "digitaltwin.part.body" },
        // 法兰（两端）
        { id: "flange1", type: "cube", offset: { x: -55, y: 6, z: 0 }, size: { width: 10, height: 24, depth: 24, radius: 0 }, color: "#5A5A5A", labelKey: "digitaltwin.part.frame" },
        { id: "flange2", type: "cube", offset: { x: 55, y: 6, z: 0 }, size: { width: 10, height: 24, depth: 24, radius: 0 }, color: "#5A5A5A" },
        // 法兰螺栓孔标识（小凸起）
        { id: "bolt1", type: "sphere", offset: { x: -55, y: 18, z: 8 }, size: { width: 0, height: 0, depth: 0, radius: 2 }, color: "#3D3D3D" },
        { id: "bolt2", type: "sphere", offset: { x: -55, y: 18, z: -8 }, size: { width: 0, height: 0, depth: 0, radius: 2 }, color: "#3D3D3D" },
        { id: "bolt3", type: "sphere", offset: { x: 55, y: 18, z: 8 }, size: { width: 0, height: 0, depth: 0, radius: 2 }, color: "#3D3D3D" },
        { id: "bolt4", type: "sphere", offset: { x: 55, y: 18, z: -8 }, size: { width: 0, height: 0, depth: 0, radius: 2 }, color: "#3D3D3D" },
        // 管道支架
        { id: "support1", type: "cube", offset: { x: -20, y: 0, z: 0 }, size: { width: 4, height: 12, depth: 20, radius: 0 }, color: "#4A4A4A" },
        { id: "support2", type: "cube", offset: { x: 20, y: 0, z: 0 }, size: { width: 4, height: 12, depth: 20, radius: 0 }, color: "#4A4A4A" },
        // 流向标识（箭头形小色块）
        { id: "flowMark", type: "cube", offset: { x: 0, y: 22, z: 0 }, size: { width: 8, height: 2, depth: 4, radius: 0 }, color: "#F5A623" },
    ],
    parameters: [
        { name: "length", labelKey: "digitaltwin.param.length", type: "number", default: 5, unitKey: "digitaltwin.property.unit.meter" },
        { name: "diameter", labelKey: "digitaltwin.param.diameter", type: "number", default: 100, unitKey: "digitaltwin.property.unit.millimeter" },
    ],
};

/** 照明灯 Lamp：灯杆 + 灯罩 + 灯泡 + 底座（高杆灯） */
const DT_LAMP_PRESET: DtModelPreset = {
    type: "lamp",
    labelKey: "digitaltwin.model.lamp",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Sunny",
    defaultColor: "#FAAD14",
    defaultSize: { width: 40, height: 120, depth: 40, radius: 0 },
    parts: [
        // 底座
        { id: "base", type: "cube", offset: { x: 0, y: 2, z: 0 }, size: { width: 30, height: 4, depth: 30, radius: 0 }, color: "#4A4A4A", labelKey: "digitaltwin.part.base" },
        // 灯杆（带收口）
        { id: "pole", type: "cylinder", offset: { x: 0, y: 50, z: 0 }, size: { width: 0, height: 96, depth: 0, radius: 5 }, color: "#5A5A5A", labelKey: "digitaltwin.part.frame" },
        // 灯杆中部装饰环
        { id: "poleRing", type: "cylinder", offset: { x: 0, y: 60, z: 0 }, size: { width: 0, height: 3, depth: 0, radius: 7 }, color: "#3D3D3D" },
        // 灯臂（横挑）
        { id: "arm", type: "cube", offset: { x: 8, y: 96, z: 0 }, size: { width: 20, height: 3, depth: 3, radius: 0 }, color: "#4A4A4A" },
        // 灯罩
        { id: "shade", type: "cube", offset: { x: 18, y: 90, z: 0 }, size: { width: 28, height: 8, depth: 20, radius: 0 }, color: "#6E6E6E", labelKey: "digitaltwin.part.body" },
        // 灯泡（发光体）
        { id: "bulb", type: "sphere", offset: { x: 18, y: 94, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 8 }, color: "#FAAD14", labelKey: "digitaltwin.part.led" },
        // 顶部装饰球
        { id: "topCap", type: "sphere", offset: { x: 0, y: 100, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 6 }, color: "#3D3D3D" },
    ],
    parameters: [
        { name: "power", labelKey: "digitaltwin.param.power", type: "number", default: 100, unitKey: "digitaltwin.property.unit.watt" },
    ],
};

/** 围栏 Fence：立柱×N + 横杆×N + 底座 */
const DT_FENCE_PRESET: DtModelPreset = {
    type: "fence",
    labelKey: "digitaltwin.model.fence",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "Operation",
    defaultColor: "#52C41A",
    defaultSize: { width: 140, height: 60, depth: 6, radius: 0 },
    parts: [
        // 6 根立柱（含底座）
        { id: "post1", type: "cylinder", offset: { x: -60, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A", labelKey: "digitaltwin.part.frame" },
        { id: "post2", type: "cylinder", offset: { x: -36, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A" },
        { id: "post3", type: "cylinder", offset: { x: -12, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A" },
        { id: "post4", type: "cylinder", offset: { x: 12, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A" },
        { id: "post5", type: "cylinder", offset: { x: 36, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A" },
        { id: "post6", type: "cylinder", offset: { x: 60, y: 25, z: 0 }, size: { width: 0, height: 50, depth: 0, radius: 3 }, color: "#4A4A4A" },
        // 立柱顶帽（黄色警示）
        { id: "cap1", type: "sphere", offset: { x: -60, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        { id: "cap2", type: "sphere", offset: { x: -36, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        { id: "cap3", type: "sphere", offset: { x: -12, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        { id: "cap4", type: "sphere", offset: { x: 12, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        { id: "cap5", type: "sphere", offset: { x: 36, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        { id: "cap6", type: "sphere", offset: { x: 60, y: 50, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 4 }, color: "#F5A623" },
        // 横向栏杆（3 道）
        { id: "bar1", type: "cube", offset: { x: 0, y: 12, z: 0 }, size: { width: 130, height: 3, depth: 3, radius: 0 }, color: "#52C41A", labelKey: "digitaltwin.part.frame" },
        { id: "bar2", type: "cube", offset: { x: 0, y: 28, z: 0 }, size: { width: 130, height: 3, depth: 3, radius: 0 }, color: "#52C41A" },
        { id: "bar3", type: "cube", offset: { x: 0, y: 44, z: 0 }, size: { width: 130, height: 3, depth: 3, radius: 0 }, color: "#52C41A" },
        // 底座轨道
        { id: "baseRail", type: "cube", offset: { x: 0, y: 2, z: 0 }, size: { width: 130, height: 3, depth: 6, radius: 0 }, color: "#3D3D3D" },
    ],
    parameters: [
        { name: "length", labelKey: "digitaltwin.param.length", type: "number", default: 5, unitKey: "digitaltwin.property.unit.meter" },
    ],
};

/**
 * 水塔 WaterTower（工业级高位储水装置）
 *
 * 结构组成：
 * - 混凝土基础 + 4 根地脚螺栓
 * - 锥形钢架塔身（4 主柱 + 多层 X 形交叉斜撑）
 * - 顶部水箱（圆柱罐体 + 锥形顶盖 + 圆形底板）
 * - 进出水管 + 法兰 + 阀门标识
 * - 水位观察窗（玻璃管 + 蓝色液柱）
 * - 溢流管 + 排空管
 * - 防跌落爬梯（带护笼）
 * - 顶部环形检修平台 + 安全栏杆
 * - 避雷针 + 警示灯
 * - 设备铭牌
 */
const DT_WATER_TOWER_PRESET: DtModelPreset = {
    type: "waterTower",
    labelKey: "digitaltwin.model.waterTower",
    categoryKey: "digitaltwin.library.category.infrastructure",
    icon: "LocationInformation",
    defaultColor: "#13C2C2",
    defaultSize: { width: 100, height: 320, depth: 100, radius: 0 },
    defaultAnimation: { type: "blink", partId: "beacon", frequency: 1 },
    parts: [
        // ═══════════════ 基础与地脚 ═══════════════
        { id: "foundation", type: "cube", offset: { x: 0, y: -2, z: 0 }, size: { width: 100, height: 8, depth: 100, radius: 0 }, color: "#5C5C5C", labelKey: "digitaltwin.part.base" },
        { id: "foundationTrim", type: "cube", offset: { x: 0, y: 3, z: 0 }, size: { width: 102, height: 1, depth: 102, radius: 0 }, color: "#F5A623" },
        { id: "anchorBolt1", type: "cylinder", offset: { x: -42, y: 6, z: -42 }, size: { width: 0, height: 4, depth: 0, radius: 3 }, color: "#9B9B9B" },
        { id: "anchorBolt2", type: "cylinder", offset: { x: 42, y: 6, z: -42 }, size: { width: 0, height: 4, depth: 0, radius: 3 }, color: "#9B9B9B" },
        { id: "anchorBolt3", type: "cylinder", offset: { x: -42, y: 6, z: 42 }, size: { width: 0, height: 4, depth: 0, radius: 3 }, color: "#9B9B9B" },
        { id: "anchorBolt4", type: "cylinder", offset: { x: 42, y: 6, z: 42 }, size: { width: 0, height: 4, depth: 0, radius: 3 }, color: "#9B9B9B" },

        // ═══════════════ 塔架（4 主柱 + 多层 X 形斜撑） ═══════════════
        { id: "mainColumn1", type: "cube", offset: { x: -30, y: 110, z: -30 }, size: { width: 6, height: 220, depth: 6, radius: 0 }, color: "#3D3D3D", labelKey: "digitaltwin.part.frame" },
        { id: "mainColumn2", type: "cube", offset: { x: 30, y: 110, z: -30 }, size: { width: 6, height: 220, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "mainColumn3", type: "cube", offset: { x: -30, y: 110, z: 30 }, size: { width: 6, height: 220, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "mainColumn4", type: "cube", offset: { x: 30, y: 110, z: 30 }, size: { width: 6, height: 220, depth: 6, radius: 0 }, color: "#3D3D3D" },
        { id: "columnBase1", type: "cube", offset: { x: -30, y: 8, z: -30 }, size: { width: 12, height: 4, depth: 12, radius: 0 }, color: "#2A2A2A" },
        { id: "columnBase2", type: "cube", offset: { x: 30, y: 8, z: -30 }, size: { width: 12, height: 4, depth: 12, radius: 0 }, color: "#2A2A2A" },
        { id: "columnBase3", type: "cube", offset: { x: -30, y: 8, z: 30 }, size: { width: 12, height: 4, depth: 12, radius: 0 }, color: "#2A2A2A" },
        { id: "columnBase4", type: "cube", offset: { x: 30, y: 8, z: 30 }, size: { width: 12, height: 4, depth: 12, radius: 0 }, color: "#2A2A2A" },

        // ─── 横向连接梁（4 层） ───
        { id: "beam1F", type: "cube", offset: { x: 0, y: 30, z: -30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam1B", type: "cube", offset: { x: 0, y: 30, z: 30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam1L", type: "cube", offset: { x: -30, y: 30, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam1R", type: "cube", offset: { x: 30, y: 30, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam2F", type: "cube", offset: { x: 0, y: 80, z: -30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam2B", type: "cube", offset: { x: 0, y: 80, z: 30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam2L", type: "cube", offset: { x: -30, y: 80, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam2R", type: "cube", offset: { x: 30, y: 80, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam3F", type: "cube", offset: { x: 0, y: 130, z: -30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam3B", type: "cube", offset: { x: 0, y: 130, z: 30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam3L", type: "cube", offset: { x: -30, y: 130, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam3R", type: "cube", offset: { x: 30, y: 130, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam4F", type: "cube", offset: { x: 0, y: 180, z: -30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam4B", type: "cube", offset: { x: 0, y: 180, z: 30 }, size: { width: 60, height: 4, depth: 4, radius: 0 }, color: "#4A4A4A" },
        { id: "beam4L", type: "cube", offset: { x: -30, y: 180, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },
        { id: "beam4R", type: "cube", offset: { x: 30, y: 180, z: 0 }, size: { width: 4, height: 4, depth: 60, radius: 0 }, color: "#4A4A4A" },

        // ─── X 形交叉斜撑（4 个面 × 3 层 = 24 根斜杆） ───
        { id: "brace1FA", type: "cube", offset: { x: -15, y: 30, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1FB", type: "cube", offset: { x: 15, y: 30, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1BA", type: "cube", offset: { x: -15, y: 30, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1BB", type: "cube", offset: { x: 15, y: 30, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1LA", type: "cube", offset: { x: -30, y: 30, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1LB", type: "cube", offset: { x: -30, y: 30, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1RA", type: "cube", offset: { x: 30, y: 30, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace1RB", type: "cube", offset: { x: 30, y: 30, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2FA", type: "cube", offset: { x: -15, y: 80, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2FB", type: "cube", offset: { x: 15, y: 80, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2BA", type: "cube", offset: { x: -15, y: 80, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2BB", type: "cube", offset: { x: 15, y: 80, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2LA", type: "cube", offset: { x: -30, y: 80, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2LB", type: "cube", offset: { x: -30, y: 80, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2RA", type: "cube", offset: { x: 30, y: 80, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace2RB", type: "cube", offset: { x: 30, y: 80, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3FA", type: "cube", offset: { x: -15, y: 130, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3FB", type: "cube", offset: { x: 15, y: 130, z: -30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3BA", type: "cube", offset: { x: -15, y: 130, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3BB", type: "cube", offset: { x: 15, y: 130, z: 30 }, size: { width: 30, height: 3, depth: 3, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3LA", type: "cube", offset: { x: -30, y: 130, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3LB", type: "cube", offset: { x: -30, y: 130, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3RA", type: "cube", offset: { x: 30, y: 130, z: -15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },
        { id: "brace3RB", type: "cube", offset: { x: 30, y: 130, z: 15 }, size: { width: 3, height: 3, depth: 30, radius: 0 }, color: "#5A5A5A" },

        // ═══════════════ 顶部水箱 ═══════════════
        { id: "tankBasePlate", type: "cylinder", offset: { x: 0, y: 222, z: 0 }, size: { width: 0, height: 6, depth: 0, radius: 52 }, color: "#4A4A4A", labelKey: "digitaltwin.part.base" },
        { id: "tankBody", type: "cylinder", offset: { x: 0, y: 252, z: 0 }, size: { width: 0, height: 60, depth: 0, radius: 48 }, color: "#13C2C2", labelKey: "digitaltwin.part.body", animatable: true },
        { id: "tankRing", type: "cylinder", offset: { x: 0, y: 252, z: 0 }, size: { width: 0, height: 4, depth: 0, radius: 50 }, color: "#3D3D3D" },
        { id: "tankTopCone", type: "cylinder", offset: { x: 0, y: 288, z: 0 }, size: { width: 0, height: 24, depth: 0, radius: 48 }, color: "#722ED1", labelKey: "digitaltwin.part.top" },
        { id: "tankTopBall", type: "sphere", offset: { x: 0, y: 304, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 6 }, color: "#5A5A5A" },
        { id: "tankBandTop", type: "cylinder", offset: { x: 0, y: 280, z: 0 }, size: { width: 0, height: 2, depth: 0, radius: 50 }, color: "#2A2A2A" },
        { id: "tankBandBot", type: "cylinder", offset: { x: 0, y: 224, z: 0 }, size: { width: 0, height: 2, depth: 0, radius: 50 }, color: "#2A2A2A" },

        // ─── 水位观察窗（玻璃管 + 蓝色液柱） ───
        { id: "levelGlass", type: "cube", offset: { x: 0, y: 252, z: 50 }, size: { width: 6, height: 50, depth: 2, radius: 0 }, color: "#E6F7FF", labelKey: "digitaltwin.part.screen" },
        { id: "levelWater", type: "cube", offset: { x: 0, y: 246, z: 51 }, size: { width: 4, height: 32, depth: 1, radius: 0 }, color: "#1890FF" },
        { id: "levelMark1", type: "cube", offset: { x: 0, y: 270, z: 51 }, size: { width: 8, height: 1, depth: 1, radius: 0 }, color: "#3D3D3D" },
        { id: "levelMark2", type: "cube", offset: { x: 0, y: 260, z: 51 }, size: { width: 8, height: 1, depth: 1, radius: 0 }, color: "#3D3D3D" },
        { id: "levelMark3", type: "cube", offset: { x: 0, y: 250, z: 51 }, size: { width: 8, height: 1, depth: 1, radius: 0 }, color: "#3D3D3D" },
        { id: "levelMark4", type: "cube", offset: { x: 0, y: 240, z: 51 }, size: { width: 8, height: 1, depth: 1, radius: 0 }, color: "#3D3D3D" },
        { id: "levelMark5", type: "cube", offset: { x: 0, y: 230, z: 51 }, size: { width: 8, height: 1, depth: 1, radius: 0 }, color: "#3D3D3D" },

        // ═══════════════ 进出水管 ═══════════════
        { id: "inletPipe", type: "cylinder", offset: { x: -20, y: 296, z: 0 }, size: { width: 0, height: 24, depth: 0, radius: 6 }, color: "#1890FF", labelKey: "digitaltwin.part.inlet" },
        { id: "inletFlange", type: "cube", offset: { x: -20, y: 308, z: 0 }, size: { width: 16, height: 4, depth: 16, radius: 0 }, color: "#5A5A5A" },
        { id: "outletPipe", type: "cylinder", offset: { x: 50, y: 224, z: 0 }, size: { width: 0, height: 30, depth: 0, radius: 6 }, color: "#52C41A", labelKey: "digitaltwin.part.outlet" },
        { id: "outletFlange", type: "cube", offset: { x: 56, y: 224, z: 0 }, size: { width: 4, height: 16, depth: 16, radius: 0 }, color: "#5A5A5A" },
        { id: "outletValveWheel", type: "cylinder", offset: { x: 64, y: 224, z: 0 }, size: { width: 0, height: 4, depth: 0, radius: 10 }, color: "#F5A623" },

        // ─── 溢流管 + 排空管 ───
        { id: "overflowPipe", type: "cylinder", offset: { x: 20, y: 270, z: 0 }, size: { width: 0, height: 60, depth: 0, radius: 4 }, color: "#FAAD14" },
        { id: "drainPipe", type: "cylinder", offset: { x: -50, y: 220, z: 0 }, size: { width: 0, height: 20, depth: 0, radius: 4 }, color: "#8C8C8C" },

        // ═══════════════ 爬梯（带护笼） ═══════════════
        { id: "ladderRail1", type: "cube", offset: { x: 30, y: 110, z: 0 }, size: { width: 2, height: 220, depth: 2, radius: 0 }, color: "#9B9B9B" },
        { id: "ladderRail2", type: "cube", offset: { x: 34, y: 110, z: 0 }, size: { width: 2, height: 220, depth: 2, radius: 0 }, color: "#9B9B9B" },
        { id: "rung1", type: "cube", offset: { x: 32, y: 14, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung2", type: "cube", offset: { x: 32, y: 36, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung3", type: "cube", offset: { x: 32, y: 58, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung4", type: "cube", offset: { x: 32, y: 80, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung5", type: "cube", offset: { x: 32, y: 102, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung6", type: "cube", offset: { x: 32, y: 124, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung7", type: "cube", offset: { x: 32, y: 146, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung8", type: "cube", offset: { x: 32, y: 168, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung9", type: "cube", offset: { x: 32, y: 190, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "rung10", type: "cube", offset: { x: 32, y: 212, z: 0 }, size: { width: 6, height: 2, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "cageBar1", type: "cube", offset: { x: 30, y: 110, z: 8 }, size: { width: 2, height: 200, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "cageBar2", type: "cube", offset: { x: 34, y: 110, z: 8 }, size: { width: 2, height: 200, depth: 2, radius: 0 }, color: "#5A5A5A" },
        { id: "cageBar3", type: "cube", offset: { x: 32, y: 110, z: 12 }, size: { width: 2, height: 200, depth: 2, radius: 0 }, color: "#5A5A5A" },

        // ═══════════════ 顶部检修平台与栏杆 ═══════════════
        { id: "platform", type: "cylinder", offset: { x: 0, y: 218, z: 0 }, size: { width: 0, height: 4, depth: 0, radius: 60 }, color: "#4A4A4A", labelKey: "digitaltwin.part.frame" },
        { id: "platformTop", type: "cylinder", offset: { x: 0, y: 220, z: 0 }, size: { width: 0, height: 1, depth: 0, radius: 58 }, color: "#2A2A2A" },
        { id: "railTop", type: "cylinder", offset: { x: 0, y: 232, z: 0 }, size: { width: 0, height: 2, depth: 0, radius: 60 }, color: "#F5A623" },
        { id: "railMid", type: "cylinder", offset: { x: 0, y: 226, z: 0 }, size: { width: 0, height: 2, depth: 0, radius: 60 }, color: "#9B9B9B" },
        { id: "railPost1", type: "cylinder", offset: { x: -42, y: 226, z: -42 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost2", type: "cylinder", offset: { x: 42, y: 226, z: -42 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost3", type: "cylinder", offset: { x: -42, y: 226, z: 42 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost4", type: "cylinder", offset: { x: 42, y: 226, z: 42 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost5", type: "cylinder", offset: { x: -60, y: 226, z: 0 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost6", type: "cylinder", offset: { x: 60, y: 226, z: 0 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost7", type: "cylinder", offset: { x: 0, y: 226, z: -60 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },
        { id: "railPost8", type: "cylinder", offset: { x: 0, y: 226, z: 60 }, size: { width: 0, height: 12, depth: 0, radius: 1 }, color: "#4A4A4A" },

        // ═══════════════ 避雷针 + 警示灯 ═══════════════
        { id: "lightningBase", type: "cylinder", offset: { x: 0, y: 308, z: 0 }, size: { width: 0, height: 4, depth: 0, radius: 4 }, color: "#3D3D3D" },
        { id: "lightningRod", type: "cylinder", offset: { x: 0, y: 322, z: 0 }, size: { width: 0, height: 24, depth: 0, radius: 1 }, color: "#9B9B9B", labelKey: "digitaltwin.part.outlet" },
        { id: "lightningTip", type: "sphere", offset: { x: 0, y: 336, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 2 }, color: "#F5222D" },
        { id: "beacon", type: "sphere", offset: { x: 0, y: 312, z: 0 }, size: { width: 0, height: 0, depth: 0, radius: 3 }, color: "#F5222D", labelKey: "digitaltwin.part.led", animatable: true },

        // ═══════════════ 铭牌与警示标识 ═══════════════
        { id: "nameplate", type: "cube", offset: { x: 0, y: 252, z: -50 }, size: { width: 20, height: 14, depth: 1, radius: 0 }, color: "#C0C0C0" },
        { id: "warnSign", type: "cube", offset: { x: 0, y: 270, z: -50 }, size: { width: 10, height: 10, depth: 1, radius: 0 }, color: "#F5A623" },
        { id: "dangerBand", type: "cube", offset: { x: 0, y: 14, z: 0 }, size: { width: 96, height: 2, depth: 96, radius: 0 }, color: "#F5222D" },
    ],
    parameters: [
        { name: "capacity", labelKey: "digitaltwin.param.capacity", type: "number", default: 200, unitKey: "digitaltwin.property.unit.cubic" },
        { name: "height", labelKey: "digitaltwin.param.height", type: "number", default: 30, unitKey: "digitaltwin.property.unit.meter" },
        { name: "level", labelKey: "digitaltwin.param.level", type: "number", default: 70, unitKey: "digitaltwin.property.unit.percent" },
    ],
    sensorMetrics: ["level", "pressure", "temperature"],
};

/** 基础设施模型列表 */
export const DT_INFRASTRUCTURE_MODELS: DtModelPreset[] = [
    DT_WORKSHOP_PRESET,
    DT_PIPELINE_PRESET,
    DT_LAMP_PRESET,
    DT_FENCE_PRESET,
    DT_WATER_TOWER_PRESET,
];
