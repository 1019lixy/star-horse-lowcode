/**
 * 数字孪生 - 光照系统
 *
 * 职责：
 *  - 环境光/半球光/平行光/聚光灯/点光源管理
 *  - HDR 环境贴图（PMREMGenerator，RGBELoader 动态 import）
 *  - 阴影开关与质量
 *  - 昼夜/工业/工作室预设
 *
 * 默认采用 industrial 预设，适配 VS Code 暗色主题。
 */

import {
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    SpotLight,
    PointLight,
    Color,
    PMREMGenerator,
    WebGLRenderer,
    Group,
} from "three";
import type { Light } from "three";
import type { DtEngine } from "./DtEngine";
import type {
    DtLightDescriptor,
    DtLightType,
    DtEnvironmentOptions,
    DtLightingPreset,
    DtShadowQuality,
} from "../types";

const SHADOW_MAP_SIZE: Record<DtShadowQuality, number> = {
    low: 1024,
    medium: 2048,
    high: 4096,
};

/** 光照预设配置 */
interface PresetConfig {
    ambient: { color: number; intensity: number };
    hemisphere?: { sky: number; ground: number; intensity: number };
    directional: Array<{
        color: number;
        intensity: number;
        position: [number, number, number];
        castShadow?: boolean;
    }>;
    envIntensity: number;
    backgroundFallback: number;
}

const PRESETS: Record<DtLightingPreset, PresetConfig> = {
    day: {
        ambient: { color: 0xffffff, intensity: 0.6 },
        hemisphere: { sky: 0xb1e1ff, ground: 0xb97a20, intensity: 0.4 },
        directional: [
            { color: 0xffffff, intensity: 1.2, position: [120, 200, 80], castShadow: true },
        ],
        envIntensity: 1.0,
        backgroundFallback: 0x1e1e1e,
    },
    dusk: {
        ambient: { color: 0xffa97a, intensity: 0.4 },
        hemisphere: { sky: 0xff8855, ground: 0x331100, intensity: 0.3 },
        directional: [
            { color: 0xff8855, intensity: 0.9, position: [80, 100, 60], castShadow: true },
        ],
        envIntensity: 0.7,
        backgroundFallback: 0x1e1e1e,
    },
    night: {
        ambient: { color: 0x4a5a8a, intensity: 0.25 },
        hemisphere: { sky: 0x223355, ground: 0x000011, intensity: 0.2 },
        directional: [
            { color: 0x6688cc, intensity: 0.5, position: [60, 120, 40], castShadow: true },
        ],
        envIntensity: 0.4,
        backgroundFallback: 0x111418,
    },
    industrial: {
        ambient: { color: 0xcfd8dc, intensity: 0.5 },
        hemisphere: { sky: 0xb0bec5, ground: 0x37474f, intensity: 0.4 },
        directional: [
            { color: 0xffffff, intensity: 1.0, position: [100, 180, 80], castShadow: true },
            { color: 0xcfd8dc, intensity: 0.4, position: [-80, 100, -60] },
        ],
        envIntensity: 0.8,
        backgroundFallback: 0x1e1e1e,
    },
    studio: {
        ambient: { color: 0xffffff, intensity: 0.7 },
        directional: [
            { color: 0xffffff, intensity: 1.0, position: [100, 100, 100] },
            { color: 0xffffff, intensity: 0.8, position: [-100, 80, -80] },
            { color: 0xffffff, intensity: 0.6, position: [0, 60, -120] },
        ],
        envIntensity: 1.0,
        backgroundFallback: 0x2a2a2a,
    },
};

export class DtLightingRig {
    /** 光源组（挂在场景根） */
    readonly group: Group;
    /** 光源映射（id → Light） */
    readonly lights: Map<string, Light> = new Map();
    /** PMREM 生成器（用于 HDR 环境贴图） */
    private pmrem: PMREMGenerator | null = null;
    /** 当前阴影质量 */
    private shadowQuality: DtShadowQuality = "medium";
    /** 阴影总开关 */
    private shadowsEnabled: boolean = true;
    private readonly engine: DtEngine;

    constructor(engine: DtEngine) {
        this.engine = engine;
        this.group = new Group();
        this.group.name = "lighting_rig";
    }

    /* ----------------------- 初始化 ----------------------- */

    /** 应用 industrial 预设作为默认 */
    init(): void {
        this.applyPreset("industrial");
    }

    dispose(): void {
        for (const light of this.lights.values()) {
            this.group.remove(light);
            if (light instanceof SpotLight) light.dispose();
        }
        this.lights.clear();
        this.pmrem?.dispose();
        this.pmrem = null;
    }

    /* ----------------------- 光源管理 ----------------------- */

    /** 添加光源 */
    addLight(desc: DtLightDescriptor): Light {
        const light = this.createLight(desc);
        this.lights.set(desc.id, light);
        this.group.add(light);
        this.engine.requestRender();
        return light;
    }

    /** 更新光源属性 */
    updateLight(id: string, patch: Partial<DtLightDescriptor>): void {
        const light = this.lights.get(id);
        if (!light) return;
        if (patch.color !== undefined) light.color = new Color(patch.color as number);
        if (patch.intensity !== undefined) light.intensity = patch.intensity;
        if (patch.position) light.position.set(patch.position[0], patch.position[1], patch.position[2]);
        if (patch.castShadow !== undefined && "castShadow" in light) {
            (light as DirectionalLight).castShadow = patch.castShadow;
            if (patch.castShadow) this.applyShadowParams(light as DirectionalLight);
        }
        this.engine.requestRender();
    }

    /** 移除光源 */
    removeLight(id: string): void {
        const light = this.lights.get(id);
        if (!light) return;
        this.group.remove(light);
        if (light instanceof SpotLight) light.dispose();
        this.lights.delete(id);
        this.engine.requestRender();
    }

    /** 列出所有光源描述 */
    listLights(): DtLightDescriptor[] {
        const list: DtLightDescriptor[] = [];
        for (const [id, light] of this.lights) {
            list.push({
                id,
                type: this.inferLightType(light),
                name: light.name || id,
                color: `#${light.color.getHexString()}`,
                intensity: light.intensity,
                position: [light.position.x, light.position.y, light.position.z],
                castShadow: (light as DirectionalLight).castShadow ?? false,
            });
        }
        return list;
    }

    /* ----------------------- HDR 环境 ----------------------- */

    /** 加载 HDR 环境贴图（动态 import RGBELoader） */
    async setEnvironment(opts: DtEnvironmentOptions): Promise<void> {
        if (!opts.hdriUrl) {
            this.applyFallbackEnvironment(opts.fallbackColor ?? 0x1e1e1e);
            return;
        }
        const renderer = this.engine.renderer;
        if (!this.pmrem) this.pmrem = new PMREMGenerator(renderer);
        try {
            const { RGBELoader } = await import(
                "three/examples/jsm/loaders/RGBELoader.js"
            );
            const loader = new RGBELoader();
            const texture = await loader.loadAsync(opts.hdriUrl);
            const envMap = this.pmrem.fromEquirectangular(texture).texture;
            this.engine.sceneManager.current.environment = envMap;
            if (opts.asBackground) {
                this.engine.sceneManager.current.background = envMap;
            }
            // 应用 envMapIntensity 到所有 PBR 材质
            this.engine.sceneManager.traverse((node) => {
                const mesh = node.object3D as unknown as { material?: unknown };
                const mat = mesh.material as { envMapIntensity?: number } | undefined;
                if (mat && "envMapIntensity" in mat) {
                    mat.envMapIntensity = opts.envMapIntensity ?? 1.0;
                }
            });
            texture.dispose();
            this.engine.requestRender();
        } catch (err) {
            console.warn("[DtLightingRig] HDR load failed, fallback:", err);
            this.applyFallbackEnvironment(opts.fallbackColor ?? 0x1e1e1e);
        }
    }

    private applyFallbackEnvironment(color: number | string): void {
        this.engine.sceneManager.current.background = new Color(color as number);
        this.engine.requestRender();
    }

    /* ----------------------- 阴影 ----------------------- */

    setShadowsEnabled(enabled: boolean): void {
        this.shadowsEnabled = enabled;
        const renderer = this.engine.renderer;
        renderer.shadowMap.enabled = enabled;
        for (const light of this.lights.values()) {
            if ("castShadow" in light) {
                (light as DirectionalLight).castShadow = enabled;
            }
        }
        this.engine.requestRender();
    }

    setShadowQuality(level: DtShadowQuality): void {
        this.shadowQuality = level;
        const size = SHADOW_MAP_SIZE[level];
        for (const light of this.lights.values()) {
            this.applyShadowParams(light as DirectionalLight, size);
        }
        this.engine.requestRender();
    }

    private applyShadowParams(light: DirectionalLight, size?: number): void {
        if (!light.shadow) return;
        const mapSize = size ?? SHADOW_MAP_SIZE[this.shadowQuality];
        light.shadow.mapSize.set(mapSize, mapSize);
        // 重置阴影贴图以应用新尺寸
        if (light.shadow.map) {
            light.shadow.map.dispose();
            light.shadow.map = null;
        }
        // 默认阴影区域
        const d = 200;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 1000;
        light.shadow.bias = -0.0005;
        light.shadow.camera.updateProjectionMatrix();
    }

    /* ----------------------- 预设 ----------------------- */

    /** 应用光照预设（清空现有光源，按预设重建） */
    applyPreset(preset: DtLightingPreset): void {
        // 清空
        for (const light of this.lights.values()) {
            this.group.remove(light);
            if (light instanceof SpotLight) light.dispose();
        }
        this.lights.clear();

        const cfg = PRESETS[preset];
        // 环境光
        const ambient = new AmbientLight(cfg.ambient.color, cfg.ambient.intensity);
        ambient.name = "ambient";
        this.group.add(ambient);
        this.lights.set("ambient", ambient);

        // 半球光
        if (cfg.hemisphere) {
            const hemi = new HemisphereLight(
                cfg.hemisphere.sky,
                cfg.hemisphere.ground,
                cfg.hemisphere.intensity,
            );
            hemi.name = "hemisphere";
            this.group.add(hemi);
            this.lights.set("hemisphere", hemi);
        }

        // 平行光
        cfg.directional.forEach((d, idx) => {
            const dir = new DirectionalLight(d.color, d.intensity);
            dir.name = `directional_${idx}`;
            dir.position.set(d.position[0], d.position[1], d.position[2]);
            if (d.castShadow && this.shadowsEnabled) {
                dir.castShadow = true;
                this.applyShadowParams(dir);
            }
            this.group.add(dir);
            this.lights.set(dir.name, dir);
        });

        // 环境光强度应用到 PBR
        this.engine.sceneManager.traverse((node) => {
            const mesh = node.object3D as unknown as { material?: unknown };
            const mat = mesh.material as { envMapIntensity?: number } | undefined;
            if (mat && "envMapIntensity" in mat) {
                mat.envMapIntensity = cfg.envIntensity;
            }
        });

        this.engine.sceneManager.current.background = new Color(cfg.backgroundFallback);
        this.engine.requestRender();
    }

    /* ----------------------- 内部工具 ----------------------- */

    private createLight(desc: DtLightDescriptor): Light {
        const color = new Color(desc.color as number);
        let light: Light;
        switch (desc.type) {
            case "ambient":
                light = new AmbientLight(color, desc.intensity);
                break;
            case "hemisphere":
                light = new HemisphereLight(color, 0x000000, desc.intensity);
                break;
            case "directional":
                light = new DirectionalLight(color, desc.intensity);
                if (desc.castShadow && this.shadowsEnabled) {
                    (light as DirectionalLight).castShadow = true;
                    this.applyShadowParams(light as DirectionalLight);
                }
                break;
            case "spot":
                light = new SpotLight(
                    color,
                    desc.intensity,
                    desc.distance ?? 0,
                    desc.angle ?? Math.PI / 4,
                    desc.penumbra ?? 0,
                    desc.decay ?? 2,
                );
                break;
            case "point":
                light = new PointLight(
                    color,
                    desc.intensity,
                    desc.distance ?? 0,
                    desc.decay ?? 2,
                );
                break;
            default:
                light = new AmbientLight(color, desc.intensity);
        }
        light.name = desc.name || desc.id;
        if (desc.position) {
            light.position.set(desc.position[0], desc.position[1], desc.position[2]);
        }
        return light;
    }

    private inferLightType(light: Light): DtLightType {
        if (light instanceof AmbientLight) return "ambient";
        if (light instanceof HemisphereLight) return "hemisphere";
        if (light instanceof DirectionalLight) return "directional";
        if (light instanceof SpotLight) return "spot";
        if (light instanceof PointLight) return "point";
        return "ambient";
    }
}

/** 工具：判断 WebGLRenderer 是否支持 WebGL2 */
export const dtIsWebGL2Available = (): boolean => {
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2"));
    } catch {
        return false;
    }
};
