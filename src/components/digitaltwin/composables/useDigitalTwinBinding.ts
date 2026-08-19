/**
 * 数字孪生 - 数据绑定管理
 *
 * 管理实体与外部数据源的绑定关系
 * 实际项目中业务可注入真实 Provider（MQTT/HTTP/WS）
 */
import { reactive, ref } from "vue";
import type { DtBindingSourceType, DtDataBinding } from "../types";

/** 数据绑定 Provider 接口 */
export interface DtBindingProvider {
  type: DtBindingSourceType;

  connect(address: string): Promise<void>;

  subscribe(path: string, callback: (value: any) => void): void;

  disconnect(): void;
}

/** Mock Provider（模拟随机数据） */
export const createMockProvider = (): DtBindingProvider => {
  let timer: number | null = null;
  return {
    type: "mock",
    async connect() {
      /* mock 无需连接 */
    },
    subscribe(_path, callback) {
      timer = window.setInterval(() => {
        callback(Math.random() * 100);
      }, 1000);
    },
    disconnect() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    },
  };
};

/** 数据绑定管理 composable */
export const useDigitalTwinBinding = () => {
  const bindings = ref<DtDataBinding[]>([]);
  const providers = reactive<Record<string, DtBindingProvider>>({});

  /** 新增绑定 */
  const addBinding = (binding: DtDataBinding): void => {
    bindings.value.push(binding);
  };

  /** 移除绑定 */
  const removeBinding = (id: string): void => {
    bindings.value = bindings.value.filter((b) => b.id !== id);
  };

  /** 更新绑定 */
  const updateBinding = (id: string, patch: Partial<DtDataBinding>): void => {
    const binding = bindings.value.find((b) => b.id === id);
    if (binding) {
      Object.assign(binding, patch);
    }
  };

  /** 取得实体的所有绑定 */
  const getBindingsByEntity = (entityId: string): DtDataBinding[] => {
    // 约定：绑定 id 中携带 entityId（在 dialog 中生成），或通过 name 字段匹配
    return bindings.value.filter(
      (b) => b.id.startsWith(`${entityId}_`) || b.name.includes(entityId),
    );
  };

  /** 注册 Provider */
  const registerProvider = (
    type: DtBindingSourceType,
    provider: DtBindingProvider,
  ): void => {
    providers[type] = provider;
  };

  /** 清空所有绑定 */
  const clearBindings = (): void => {
    bindings.value = [];
  };

  return {
    bindings,
    providers,
    addBinding,
    removeBinding,
    updateBinding,
    getBindingsByEntity,
    registerProvider,
    clearBindings,
  };
};

export type UseDigitalTwinBindingReturn = ReturnType<
  typeof useDigitalTwinBinding
>;
