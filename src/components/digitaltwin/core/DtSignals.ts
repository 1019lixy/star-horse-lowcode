/**
 * 数字孪生 - 信号系统（对标 Astral3D Hooks/Signals）
 *
 * 发布-订阅模式，解耦组件间通信。
 * 所有信号集中注册在 SIGNAL_NAMES 中，对标 Astral3D 的 signalRegister.ts。
 *
 * 用法：
 *   import { dtSignals, SIGNAL_NAMES } from "./core/DtSignals";
 *   // 注册
 *   const off = dtSignals.on(SIGNAL_NAMES.objectSelected, (obj) => { ... });
 *   onBeforeUnmount(off);
 *   // 派发
 *   dtSignals.dispatch(SIGNAL_NAMES.objectSelected, object);
 */
type SignalListener = (...args: any[]) => void;

/** 信号名称常量（对标 Astral3D appSignals） */
export const SIGNAL_NAMES = {
  // 场景
  sceneGraphChanged: "sceneGraphChanged",
  sceneCleared: "sceneCleared",
  sceneLoaded: "sceneLoaded",
  // 对象
  objectAdded: "objectAdded",
  objectRemoved: "objectRemoved",
  objectChanged: "objectChanged",
  objectSelected: "objectSelected",
  objectDeselected: "objectDeselected",
  objectFocused: "objectFocused",
  objectLocked: "objectLocked",
  objectUnlocked: "objectUnlocked",
  // 历史
  historyChanged: "historyChanged",
  // 变换
  transformModeChanged: "transformModeChanged",
  spaceChanged: "spaceChanged",
  // 视口
  viewportModeChanged: "viewportModeChanged",
  viewportReady: "viewportReady",
  sceneResize: "sceneResize",
  // 渲染
  rendererCreated: "rendererCreated",
  sceneRendered: "sceneRendered",
} as const;

export type SignalName = (typeof SIGNAL_NAMES)[keyof typeof SIGNAL_NAMES];

class SignalManager {
  private listeners: Map<string, Set<SignalListener>> = new Map();
  private disabled: Set<string> = new Set();

  /** 注册监听，返回取消注册函数 */
  on(name: string, listener: SignalListener): () => void {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }
    this.listeners.get(name)!.add(listener);
    return () => this.off(name, listener);
  }

  /** 注册一次性监听 */
  once(name: string, listener: SignalListener): () => void {
    const wrapper: SignalListener = (...args) => {
      this.off(name, wrapper);
      listener(...args);
    };
    return this.on(name, wrapper);
  }

  /** 取消监听 */
  off(name: string, listener: SignalListener): void {
    this.listeners.get(name)?.delete(listener);
  }

  /** 派发信号 */
  dispatch(name: string, ...args: any[]): void {
    if (this.disabled.has(name)) return;
    const set = this.listeners.get(name);
    if (set) {
      set.forEach((fn) => {
        try {
          fn(...args);
        } catch (err) {
          console.error(`[DtSignals] Error in "${name}":`, err);
        }
      });
    }
  }

  /** 临时禁用某信号（不删除监听） */
  setActive(name: string, active: boolean): void {
    if (active) {
      this.disabled.delete(name);
    } else {
      this.disabled.add(name);
    }
  }

  /** 清除所有监听 */
  clear(): void {
    this.listeners.clear();
    this.disabled.clear();
  }
}

/** 全局信号管理器单例 */
export const dtSignals = new SignalManager();

/* ----------------------- Hooks 封装（对标 useAddSignal/useDispatchSignal） ----------------------- */

import { getCurrentInstance, onBeforeUnmount } from "vue";

/** 注册信号监听，自动在组件卸载时取消（对标 useAddSignal） */
export function useAddSignal(
  name: string,
  listener: SignalListener,
): () => void {
  const off = dtSignals.on(name, listener);
  if (getCurrentInstance()) {
    onBeforeUnmount(off);
  }
  return off;
}

/** 派发信号（对标 useDispatchSignal） */
export function useDispatchSignal(name: string, ...args: any[]): void {
  dtSignals.dispatch(name, ...args);
}

/** 临时启/禁信号（对标 useSetSignalActive） */
export function useSetSignalActive(name: string, active: boolean): void {
  dtSignals.setActive(name, active);
}
