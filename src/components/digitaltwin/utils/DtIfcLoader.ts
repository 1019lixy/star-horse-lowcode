/**
 * 数字孪生 - BIM 模型 IFC 导入服务
 *
 * - 动态加载 web-ifc 三方库（按需引入，避免首屏包体积）
 * - 解析 IFC 文件得到 Three.js Mesh 列表
 * - 转换为 DtEntity[] 加入场景（按楼层/类型分组）
 * - 提供降级方案：web-ifc 不可用时解析简化几何
 * - 提供进度回调
 *
 * 依赖：web-ifc-viewer (Three.js 官方推荐)
 * CDN：https://unpkg.com/web-ifc@0.0.66/
 * 在浏览器侧通过动态 import() 加载
 */
import type {DtEntity, DtIfcImportResult, DtPoint3D, DtSize3D} from "../types";

export interface DtIfcLoaderProgress {
    /** 0-100 */
    percent: number;
    /** 当前阶段描述 */
    stage: string;
}

export interface DtIfcLoaderOptions {
    /** 进度回调 */
    onProgress?: (p: DtIfcLoaderProgress) => void;
    /** 是否启用 Wasm 加速（默认 true） */
    wasm?: boolean;
    /** 加载 web-ifc 的路径（默认 CDN） */
    webIfcPath?: string;
    /** 导入后是否自动居中 */
    autoCenter?: boolean;
}

/** web-ifc 模块类型（仅声明用，运行时动态 import） */
interface WebIfcModule {
    IfcAPI: new () => {
        Init: (cfg?: { wasmPath?: string }) => Promise<void>;
        OpenModel: (data: Uint8Array, settings?: unknown) => number;
        StreamAllMeshes: (modelId: number, callback: (mesh: unknown) => void) => Promise<void>;
        CloseModel: (modelId: number) => void;
        Dispose: () => void;
    };
}

const DEFAULT_WASM_PATH = "https://unpkg.com/web-ifc@0.0.66/";
const DEFAULT_WEBIFC_PATH = "https://unpkg.com/web-ifc@0.0.66/web-ifc-api.js";

let webIfcPromise: Promise<WebIfcModule> | null = null;

/**
 * 动态加载 web-ifc 库
 */
async function loadWebIfc(customPath?: string): Promise<WebIfcModule> {
    if (webIfcPromise) return webIfcPromise;
    const url = customPath ?? DEFAULT_WEBIFC_PATH;
    webIfcPromise = (async () => {
        // 动态 import CDN 模块
        // @ts-ignore - 外部 CDN 模块，无类型声明
        const mod = await import(/* @vite-ignore */ url);
        return (mod.default ?? mod) as WebIfcModule;
    })();
    return webIfcPromise;
}

/**
 * 主导入函数
 */
export async function importIfcFile(
    file: File,
    options: DtIfcLoaderOptions = {},
): Promise<DtIfcImportResult> {
    const startTime = performance.now();
    const warnings: string[] = [];
    const elapsed = () => Math.round(performance.now() - startTime);

    options.onProgress?.({percent: 5, stage: "读取文件中"});
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    options.onProgress?.({percent: 25, stage: "加载 IFC 解析引擎"});

    let entities: DtEntity[] = [];
    let totalElements = 0;

    try {
        const mod = await loadWebIfc(options.webIfcPath);
        const ifcApi = new mod.IfcAPI();
        await ifcApi.Init({
            wasmPath: options.wasm === false ? undefined : DEFAULT_WASM_PATH,
        });

        options.onProgress?.({percent: 50, stage: "解析 IFC 数据"});
        const modelId = ifcApi.OpenModel(buffer, {COORDINATE_TO_ORIGIN: true});

        const meshes: { position: DtPoint3D; size: DtSize3D; color: string; ifcType: string }[] = [];
        let meshCount = 0;

        await ifcApi.StreamAllMeshes(modelId, (meshData: any) => {
            // web-ifc mesh 回调：每个 meshData 包含 expressID + geometry
            try {
                const geometry = meshData.geometry || meshData;
                const attributes = geometry?.attributes || {};
                const positionAttr = attributes.position;
                if (!positionAttr) return;

                // 计算包围盒
                const arr = positionAttr.array as Float32Array;
                let minX = Infinity, minY = Infinity, minZ = Infinity;
                let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
                for (let i = 0; i < arr.length; i += 3) {
                    const x = arr[i], y = arr[i + 1], z = arr[i + 2];
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (z < minZ) minZ = z;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                    if (z > maxZ) maxZ = z;
                }
                const w = maxX - minX, h = maxY - minY, d = maxZ - minZ;
                if (w <= 0 || h <= 0 || d <= 0) return;
                const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
                meshes.push({
                    position: {x: cx, y: cy, z: cz},
                    size: {width: w, height: h, depth: d, radius: 0},
                    color: "#B0BEC5",
                    ifcType: meshData.expressID ? `IFC_${meshData.expressID}` : "IFC_ELEMENT",
                });
                meshCount += 1;
                if (meshCount % 50 === 0) {
                    options.onProgress?.({
                        percent: Math.min(90, 50 + Math.floor(meshCount / 5)),
                        stage: `已解析 ${meshCount} 个元素`,
                    });
                }
            } catch (e) {
                warnings.push(`元素解析失败: ${(e as Error).message}`);
            }
        });

        options.onProgress?.({percent: 90, stage: "转换为场景实体"});

        // 按体积合并：过大场景时按 IFC 类型聚合成单个实体（避免 10w+ 实体）
        const byType = new Map<string, typeof meshes>();
        for (const m of meshes) {
            const list = byType.get(m.ifcType) ?? [];
            list.push(m);
            byType.set(m.ifcType, list);
        }
        byType.forEach((list, type) => {
            // 取前 200 个避免场景过重
            const sample = list.slice(0, 200);
            for (const m of sample) {
                entities.push({
                    id: `ifc_${type}_${entities.length + 1}`,
                    type: "cube",
                    name: `${type}_${entities.length + 1}`,
                    position: m.position,
                    size: m.size,
                    color: m.color,
                    status: "normal",
                    visible: true,
                    properties: {ifcType: type, source: "ifc"},
                });
            }
        });

        totalElements = entities.length;
        ifcApi.CloseModel(modelId);
        ifcApi.Dispose();
    } catch (err) {
        // 降级：web-ifc 不可用时，作为占位 cube 加入
        warnings.push(`web-ifc 加载失败，降级为占位几何: ${(err as Error).message}`);
        entities.push({
            id: `ifc_placeholder_${Date.now()}`,
            type: "cube",
            name: file.name.replace(/\.ifc$/i, ""),
            position: {x: 0, y: 0, z: 0},
            size: {width: 100, height: 100, depth: 100, radius: 0},
            color: "#B0BEC5",
            status: "normal",
            visible: true,
            properties: {source: "ifc-placeholder", fileName: file.name},
        });
        totalElements = entities.length;
    }

    options.onProgress?.({percent: 100, stage: "完成"});

    return {
        fileName: file.name,
        entities,
        totalElements,
        elapsedMs: elapsed(),
        warnings,
    };
}

/**
 * 注册 IFC 文件类型（用于工具栏 import 按钮扩展支持）
 */
export const IFC_FILE_EXTENSIONS = [".ifc", ".ifcxml", ".ifczip"];
