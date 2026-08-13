/**
 * IoT 设备拓扑状态管理
 */
import { computed, reactive, ref } from "vue";
import { autoLayoutTopology, buildTopologyEdges } from "../constants";
import type {
  IotDevice,
  IotDeviceStatus,
  IotTopologyEdge,
  IotTopologyNode,
} from "../types";

export const useIotTopology = (initialDevices: IotDevice[] = []) => {
  // 设备列表（响应式）
  const devices = reactive<IotDevice[]>(
    initialDevices ? JSON.parse(JSON.stringify(initialDevices)) : [],
  );
  // 当前选中设备 ID
  const selectedDeviceId = ref<string | null>(null);

  // 拓扑节点（基于设备自动布局）
  const topologyNodes = computed<IotTopologyNode[]>(() =>
    autoLayoutTopology(devices),
  );
  // 拓扑连线（基于 parentId）
  const topologyEdges = computed<IotTopologyEdge[]>(() =>
    buildTopologyEdges(devices),
  );

  // 当前选中的设备对象
  const selectedDevice = computed<IotDevice | null>(
    () => devices.find((d) => d.id === selectedDeviceId.value) ?? null,
  );

  /** 选中设备 */
  const selectDevice = (id: string | null) => {
    selectedDeviceId.value = id;
  };

  /** 更新设备状态 */
  const updateDeviceStatus = (id: string, status: IotDeviceStatus) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev) return;
    dev.status = status;
    if (status === "online") {
      dev.lastSeen = Date.now();
    }
  };

  /** 更新设备指标 */
  const updateDeviceMetrics = (
    id: string,
    metrics: Record<string, number | string>,
  ) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev) return;
    const now = Date.now();
    for (const m of dev.metrics) {
      if (metrics[m.name] !== undefined) {
        m.value = metrics[m.name];
        m.timestamp = now;
      }
    }
  };

  /** 获取设备树（按 parentId 嵌套） */
  const getDeviceTree = (): Array<IotDevice & { children: IotDevice[] }> => {
    const build = (
      parentId: string | null,
    ): Array<IotDevice & { children: IotDevice[] }> => {
      return devices
        .filter((d) => (d.parentId ?? null) === parentId)
        .map((d) => ({ ...d, children: build(d.id) }));
    };
    return build(null);
  };

  /** 重新执行拓扑布局 */
  const layoutTopology = (): IotTopologyNode[] => autoLayoutTopology(devices);

  /** 新增设备 */
  const addDevice = (device: IotDevice) => {
    devices.push(device);
  };

  /** 移除设备 */
  const removeDevice = (id: string) => {
    const idx = devices.findIndex((d) => d.id === id);
    if (idx < 0) return;
    // 同时移除其子孙设备
    const toRemove = new Set<string>([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const d of devices) {
        if (d.parentId && toRemove.has(d.parentId) && !toRemove.has(d.id)) {
          toRemove.add(d.id);
          changed = true;
        }
      }
    }
    for (let i = devices.length - 1; i >= 0; i--) {
      if (toRemove.has(devices[i].id)) devices.splice(i, 1);
    }
    if (selectedDeviceId.value && toRemove.has(selectedDeviceId.value)) {
      selectedDeviceId.value = null;
    }
  };

  return {
    devices,
    selectedDeviceId,
    selectedDevice,
    topologyNodes,
    topologyEdges,
    selectDevice,
    updateDeviceStatus,
    updateDeviceMetrics,
    getDeviceTree,
    layoutTopology,
    addDevice,
    removeDevice,
  };
};
