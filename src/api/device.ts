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
}

/**
 * 获取当前设备类型
 */
export function getDeviceInfo() {
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
    const isMobile = /iphone|ipod|android.*mobile|windows phone/i.test(ua);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua);
    const isIpad = /macintosh/i.test(ua) && "ontouchend" in document;

    if (isMobile || isTablet || isIpad) {
        info.type = isTablet || isIpad ? "tablet" : "mobile";
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

// 全局单例，只计算一次
export const device = getDeviceInfo();

// 快捷导出，随便用
//是否是电脑
export const isPc = device.type === "pc";
//是否是手机
export const isMobile = device.type === "mobile";
//是否是平板
export const isTablet = device.type === "tablet";
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
