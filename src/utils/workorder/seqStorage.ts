import type { WorkorderSeqStorage } from "./WorkorderTypes";

/**
 * 序列存储实现
 *
 * - LocalSeqStorage：基于 localStorage，浏览器多标签共享、同步原子递增
 * - MemorySeqStorage：基于 Map，测试/非浏览器环境/内存隔离场景
 * - createDefaultSeqStorage：自动选择，localStorage 不可用时回退内存
 *
 * JS 单线程 + localStorage 同步读写，next() 天然原子，无并发竞态。
 */

/** 基于 localStorage 的序列存储 */
export class LocalSeqStorage implements WorkorderSeqStorage {
  private readonly prefix: string;

  constructor(prefix: string = "shplugin:workorder:seq:") {
    this.prefix = prefix;
  }

  private key(key: string): string {
    return `${this.prefix}${key}`;
  }

  get(key: string): number | null {
    try {
      const raw = localStorage.getItem(this.key(key));
      if (raw == null) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }

  set(key: string, value: number): void {
    try {
      localStorage.setItem(this.key(key), String(value));
    } catch {
      // localStorage 写入失败（隐私模式/配额），静默降级
    }
  }

  next(key: string, start: number): number {
    const current = this.get(key);
    const nextVal =
      current == null || current < start - 1 ? start : current + 1;
    this.set(key, nextVal);
    return nextVal;
  }

  reset(key: string): void {
    try {
      localStorage.removeItem(this.key(key));
    } catch {
      // ignore
    }
  }
}

/** 基于内存 Map 的序列存储 */
export class MemorySeqStorage implements WorkorderSeqStorage {
  private readonly store = new Map<string, number>();

  get(key: string): number | null {
    return this.store.has(key) ? (this.store.get(key) as number) : null;
  }

  set(key: string, value: number): void {
    this.store.set(key, value);
  }

  next(key: string, start: number): number {
    const current = this.get(key);
    const nextVal =
      current == null || current < start - 1 ? start : current + 1;
    this.set(key, nextVal);
    return nextVal;
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

/** 默认存储单例（localStorage 不可用时回退内存） */
let defaultStorage: WorkorderSeqStorage | null = null;

export const createDefaultSeqStorage = (): WorkorderSeqStorage => {
  if (defaultStorage) return defaultStorage;
  try {
    if (typeof localStorage !== "undefined" && localStorage) {
      defaultStorage = new LocalSeqStorage();
      return defaultStorage;
    }
  } catch {
    // ignore
  }
  defaultStorage = new MemorySeqStorage();
  return defaultStorage;
};