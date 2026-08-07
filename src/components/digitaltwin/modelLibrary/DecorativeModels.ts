/**
 * 数字孪生 - 装饰物模型库
 *
 * 包含：树木 / 道路 / 人物
 */
import type {DtModelPreset} from "../types";

/** 树木 Tree：树干 + 树冠 */
const DT_TREE_PRESET: DtModelPreset = {
    type: "tree",
    labelKey: "digitaltwin.model.tree",
    categoryKey: "digitaltwin.library.category.decorative",
    icon: "Tree",
    defaultColor: "#52C41A",
    defaultSize: {width: 40, height: 100, depth: 40, radius: 0},
    parts: [
        {
            id: "trunk",
            type: "cylinder",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 0, height: 50, depth: 0, radius: 6},
            color: "#8B4513",
            labelKey: "digitaltwin.part.trunk"
        },
        {
            id: "crown",
            type: "sphere",
            offset: {x: 0, y: 60, z: 0},
            size: {width: 0, height: 0, depth: 0, radius: 25},
            color: "#52C41A",
            labelKey: "digitaltwin.part.crown"
        },
    ],
    parameters: [],
};

/** 道路 Road：路面 + 标线 */
const DT_ROAD_PRESET: DtModelPreset = {
    type: "road",
    labelKey: "digitaltwin.model.road",
    categoryKey: "digitaltwin.library.category.decorative",
    icon: "Guide",
    defaultColor: "#595959",
    defaultSize: {width: 200, height: 1, depth: 30, radius: 0},
    parts: [
        {
            id: "surface",
            type: "plane",
            offset: {x: 0, y: 0, z: 0},
            size: {width: 200, height: 0, depth: 30, radius: 0},
            color: "#595959",
            labelKey: "digitaltwin.part.body"
        },
        ...Array.from({length: 5}, (_, i) => ({
            id: `marking${i + 1}`,
            type: "cube" as const,
            offset: {x: -80 + i * 40, y: 0.5, z: 0},
            size: {width: 20, height: 1, depth: 3, radius: 0},
            color: "#FFFFFF",
            labelKey: "digitaltwin.part.body",
        })),
    ],
    parameters: [
        {
            name: "length",
            labelKey: "digitaltwin.param.length",
            type: "number",
            default: 20,
            unitKey: "digitaltwin.property.unit.meter"
        },
    ],
};

/** 人物 Worker：身体 + 头 + 四肢 */
const DT_WORKER_PRESET: DtModelPreset = {
    type: "worker",
    labelKey: "digitaltwin.model.worker",
    categoryKey: "digitaltwin.library.category.decorative",
    icon: "User",
    defaultColor: "#1890FF",
    defaultSize: {width: 30, height: 90, depth: 20, radius: 0},
    parts: [
        {
            id: "body",
            type: "cylinder",
            offset: {x: 0, y: 30, z: 0},
            size: {width: 0, height: 40, depth: 0, radius: 8},
            color: "#1890FF",
            labelKey: "digitaltwin.part.body"
        },
        {
            id: "head",
            type: "sphere",
            offset: {x: 0, y: 75, z: 0},
            size: {width: 0, height: 0, depth: 0, radius: 8},
            color: "#FFDAB9",
            labelKey: "digitaltwin.part.head"
        },
        {
            id: "armL",
            type: "cube",
            offset: {x: -12, y: 35, z: 0},
            size: {width: 4, height: 30, depth: 4, radius: 0},
            color: "#1890FF",
            labelKey: "digitaltwin.part.limbs"
        },
        {
            id: "armR",
            type: "cube",
            offset: {x: 12, y: 35, z: 0},
            size: {width: 4, height: 30, depth: 4, radius: 0},
            color: "#1890FF"
        },
        {
            id: "legL",
            type: "cube",
            offset: {x: -5, y: 0, z: 0},
            size: {width: 5, height: 30, depth: 5, radius: 0},
            color: "#262626"
        },
        {
            id: "legR",
            type: "cube",
            offset: {x: 5, y: 0, z: 0},
            size: {width: 5, height: 30, depth: 5, radius: 0},
            color: "#262626"
        },
    ],
    parameters: [],
};

/** 装饰物模型列表 */
export const DT_DECORATIVE_MODELS: DtModelPreset[] = [
    DT_TREE_PRESET,
    DT_ROAD_PRESET,
    DT_WORKER_PRESET,
];
