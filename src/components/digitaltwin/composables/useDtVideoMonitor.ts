/**
 * 数字孪生 - 视频监控点位管理
 *
 * - 维护摄像头列表（在线/离线状态）
 * - 支持 mock/rtsp/hls/webrtc 多协议源
 * - 提供 addCamera / removeCamera / updateCamera 方法
 * - 通过 onCameraClick 回调通知 UI 弹出视频播放器
 * - 默认 mock 流：使用 canvas 渲染循环动画模拟视频
 */
import {computed, type ComputedRef, ref} from "vue";
import type {DtPoint3D, DtVideoCamera} from "../types";

export interface UseDtVideoMonitorReturn {
    /** 摄像头列表 */
    cameras: ReturnType<typeof ref<DtVideoCamera[]>>;
    /** 在线数 */
    onlineCount: ComputedRef<number>;
    /** 总数 */
    totalCount: ComputedRef<number>;
    /** 当前激活的摄像头 id */
    activeCameraId: ReturnType<typeof ref<string | null>>;
    /** 添加摄像头 */
    addCamera: (camera: Omit<DtVideoCamera, "id"> & Partial<Pick<DtVideoCamera, "id">>) => DtVideoCamera;
    /** 删除 */
    removeCamera: (id: string) => void;
    /** 更新 */
    updateCamera: (id: string, patch: Partial<DtVideoCamera>) => void;
    /** 触发查看（打开视频面板） */
    activate: (id: string) => void;
    /** 关闭视频面板 */
    deactivate: () => void;
    /** 根据绑定实体 id 查询 */
    getByEntityId: (entityId: string) => DtVideoCamera | undefined;
    /** 生成默认 mock 流地址 */
    genMockStream: () => string;
}

let cameraIdCounter = 0;
const genCameraId = (): string => {
    cameraIdCounter += 1;
    return `cam_${Date.now()}_${cameraIdCounter}`;
};

export function useDtVideoMonitor(): UseDtVideoMonitorReturn {
    const cameras = ref<DtVideoCamera[]>([]);
    const activeCameraId = ref<string | null>(null);

    const onlineCount = computed(() => cameras.value.filter((c) => c.online).length);
    const totalCount = computed(() => cameras.value.length);

    const addCamera: UseDtVideoMonitorReturn["addCamera"] = (input) => {
        const camera: DtVideoCamera = {
            id: input.id ?? genCameraId(),
            ...input,
        };
        cameras.value.push(camera);
        return camera;
    };

    const removeCamera = (id: string): void => {
        const idx = cameras.value.findIndex((c) => c.id === id);
        if (idx >= 0) cameras.value.splice(idx, 1);
        if (activeCameraId.value === id) activeCameraId.value = null;
    };

    const updateCamera = (id: string, patch: Partial<DtVideoCamera>): void => {
        const cam = cameras.value.find((c) => c.id === id);
        if (cam) Object.assign(cam, patch);
    };

    const activate = (id: string): void => {
        if (cameras.value.find((c) => c.id === id)) {
            activeCameraId.value = id;
        }
    };

    const deactivate = (): void => {
        activeCameraId.value = null;
    };

    const getByEntityId = (entityId: string): DtVideoCamera | undefined =>
        cameras.value.find((c) => c.entityId === entityId);

    const genMockStream = (): string => `mock://stream/${Date.now()}`;

    return {
        cameras,
        onlineCount,
        totalCount,
        activeCameraId,
        addCamera,
        removeCamera,
        updateCamera,
        activate,
        deactivate,
        getByEntityId,
        genMockStream,
    };
}

/**
 * 工厂级预设摄像头点位生成器（基于场景实体自动布局）
 */
export function genDefaultCamerasForScene(entities: Array<{
    id: string;
    name: string;
    position: DtPoint3D
}>): DtVideoCamera[] {
    const result: DtVideoCamera[] = [];
    entities.forEach((e, idx) => {
        result.push({
            id: `cam_preset_${idx + 1}`,
            name: `监控-${e.name}`,
            position: {x: e.position.x + 50, y: e.position.y + 80, z: e.position.z + 50},
            streamUrl: `mock://camera/${e.id}`,
            cameraType: idx % 3 === 0 ? "ptz" : "fixed",
            online: idx % 5 !== 0,
            entityId: e.id,
            fov: 75,
            heading: 225,
        });
    });
    return result;
}
