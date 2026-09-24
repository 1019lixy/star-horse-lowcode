import { computed, ref } from "vue";

// 窗口宽度断点常量
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

let isTest: boolean = false;
let deviceType: string;

/**
 * 设置测试
 * @param testFlag
 * @param type
 */
export function setTest(testFlag: boolean, type?: string): void {
  isTest = testFlag;
  deviceType = type;
  // 测试模式下同步更新布局形态
  if (isTest) {
    _layoutType.value = (deviceType ?? "mobile") as "mobile" | "tablet" | "pc";
  }
}

/**
 * 获取当前设备类型（纯 UA 判断，不含窗口宽度）
 */
export function getDeviceInfo() {
  // SSR 守卫
  if (typeof navigator === "undefined") {
    return {
      type: "pc" as "mobile" | "tablet" | "pc",
      os: "unknown" as
        | "windows"
        | "mac"
        | "linux"
        | "android"
        | "ios"
        | "harmony"
        | "openHarmony"
        | "unknown",
      isHuawei: false,
      isHarmony: false,
      isOpenHarmony: false,
    };
  }

  const ua = navigator.userAgent.toLowerCase();

  const info: any = {
    type: "pc" as "mobile" | "tablet" | "pc",
    os: "unknown" as
      | "windows"
      | "mac"
      | "linux"
      | "android"
      | "ios"
      | "harmony"
      | "openHarmony"
      | "unknown",
    isHuawei: false,
    isHarmony: false,
    isOpenHarmony: false,
  };
  if (isTest || (window as any)._isDebug_) {
    return {
      type: deviceType ?? "mobile",
      os: "unknown",
    };
  }

  info.isHuawei = /huawei/i.test(ua);
  info.isHarmony = /harmonyos/i.test(ua);
  info.isOpenHarmony = /openharmony/i.test(ua) && /arkweb/i.test(ua);

  // 鸿蒙优先判断
  if (info.isHarmony || info.isOpenHarmony) {
    info.os = info.isOpenHarmony ? "openHarmony" : "harmony";
    if (/phone/i.test(ua)) {
      info.type = "mobile";
    } else if (/tablet/i.test(ua)) {
      info.type = "tablet";
    } else if (/pc/i.test(ua)) {
      info.type = "pc";
    } else {
      info.type = "ontouchend" in document ? "mobile" : "pc";
    }
    return info;
  }

  // 移动端判断
  const uaMobile = /iphone|ipod|android.*mobile|windows phone/i.test(ua);
  const uaTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua);
  const uaIpad = /macintosh/i.test(ua) && "ontouchend" in document;

  if (uaMobile || uaTablet || uaIpad) {
    info.type = uaTablet || uaIpad ? "tablet" : "mobile";
    info.os = /iphone|ipad|ipod/i.test(ua) ? "ios" : "android";
  } else {
    // PC 端：Windows > Mac > Linux
    info.type = "pc";
    if (/windows/i.test(ua)) {
      info.os = "windows";
    } else if (/macintosh/i.test(ua)) {
      info.os = "mac";
    } else if (/linux/i.test(ua)) {
      info.os = "linux";
    }
  }

  return info;
}

// 全局单例，只计算一次（纯 UA 设备信息）
export const device = getDeviceInfo();

// OS 判断保持 const（OS 不随窗口变化）
//是否是windows
export const isWindows = device.os === "windows";
//是否是Mac
export const isMac = device.os === "mac";
//是否是Linux
export const isLinux = device.os === "linux";
//是否是Android
export const isAndroid = device.os === "android";
//是否是Ios
export const isIos = device.os === "ios";
//是否是鸿蒙
export const isHarmony = device.isHarmony || device.isOpenHarmony;
//是否华为
export const isHuawei = device.isHuawei;

// UA 一次性判断（非响应式，供 .ts 非 Vue 上下文用）
export const isMobileRaw = device.type === "mobile";
export const isTabletRaw = device.type === "tablet";
export const isPcRaw = device.type === "pc";

/**
 * 计算布局形态：移动设备 UA 锁定，PC UA 按窗口宽度切换
 */
function computeLayoutType(): "mobile" | "tablet" | "pc" {
  const uaType = device.type;
  // 移动设备 UA 永远锁定，不受窗口宽度影响
  if (uaType === "mobile") return "mobile";
  if (uaType === "tablet") return "tablet";
  // PC UA：按窗口宽度切换
  if (typeof window === "undefined") return "pc";
  const w = window.innerWidth;
  if (w < MOBILE_BREAKPOINT) return "mobile";
  if (w < TABLET_BREAKPOINT) return "tablet";
  return "pc";
}

// 布局形态 ref（resize 回调更新）
const _layoutType = ref<"mobile" | "tablet" | "pc">("pc");

// 初始化
_layoutType.value = computeLayoutType();

// resize/orientationchange 监听
if (typeof window !== "undefined") {
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const next = computeLayoutType();
      if (next !== _layoutType.value) {
        _layoutType.value = next;
      }
    }, 150);
  });
  window.addEventListener("orientationchange", () => {
    _layoutType.value = computeLayoutType();
  });
}

// 响应式导出（<script setup> 模板自动解包）
//是否是电脑（响应式，随窗口变化）
export const isPc = computed(() => _layoutType.value === "pc");
//是否是手机（响应式，随窗口变化）
export const isMobile = computed(() => _layoutType.value === "mobile");
//是否是平板（响应式，随窗口变化）
export const isTablet = computed(() => _layoutType.value === "tablet");

/**
 * 设备判断 composable，返回响应式布局判断 + UA 设备信息
 */
export function useDevice() {
  return {
    isMobile: computed(() => _layoutType.value === "mobile"),
    isTablet: computed(() => _layoutType.value === "tablet"),
    isPc: computed(() => _layoutType.value === "pc"),
    layoutType: _layoutType,
    device,
  };
}
