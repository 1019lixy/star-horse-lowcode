import {computed, ref} from "vue";
import {isMobile, isTablet} from "@/api/device";
import {i18n} from "@/lang";

/**
 * APP 端下拉分离逻辑（通用）
 *
 * 设计要点：
 * 1. 仅 APP 端（手机 / 平板）启用分离模式，PC 端完全走原逻辑
 * 2. 分离开关优先级：
 *    - 字段级 preps.mobileSeparateEnabled （true / false）
 *    - 全局 window._shMobileSeparateDisabled === true 时全局关闭
 * 3. 默认：APP 端开启分离
 *
 * 用法：
 *   const {
 *     isSeparate,        // 是否启用分离
 *     pickerVisible,     // 抽屉显隐
 *     placement,          // 顶部 / 底部
 *     openPicker,         // 打开抽屉
 *     closePicker,        // 关闭抽屉
 *   } = useMobilePicker(() => props.field);
 */
export function useMobilePicker(fieldGetter: () => any, source?: number) {
    const isApp = isMobile || isTablet;

    const pickerVisible = ref(false);

    /** 字段级开关：preps.mobileSeparateEnabled（默认 true） */
    const fieldLevelEnabled = computed<boolean>(() => {
        const field = fieldGetter();
        const val = field?.preps?.mobileSeparateEnabled;
        if (val === false || val === "false") return false;
        return true;
    });

    /** 全局开关：window._shMobileSeparateDisabled === true 时全局关闭 */
    const globalEnabled = computed<boolean>(() => {
        try {
            return (window as any)._shMobileSeparateDisabled !== true;
        } catch {
            return true;
        }
    });

    /** 最终是否分离 */
    const isSeparate = computed<boolean>(() => {
        if (!isApp) return false;
        if (!globalEnabled.value) return false;
        return fieldLevelEnabled.value;
    });

    /** 抽屉位置 */
    const placement = computed<"bottom" | "top">(() => {
        const field = fieldGetter();
        return field?.preps?.mobilePickerPlacement === "top" ? "top" : "bottom";
    });

    /** 抽屉尺寸 */
    const size = computed<string>(() => {
        const field = fieldGetter();
        return field?.preps?.mobilePickerSize || "55%";
    });

    /** 是否显示底部确认按钮（默认显示，单选场景可选关闭，点选即确认） */
    const showFooter = computed<boolean>(() => {
        const field = fieldGetter();
        const val = field?.preps?.mobilePickerShowFooter;
        if (val === false || val === "false") return false;
        return true;
    });

    /** 抽屉标题 */
    const title = computed<string>(() => {
        const field = fieldGetter();
        return field?.label || field?.preps?.label || i18n("starhorse.pleaseSelect") || "请选择";
    });

    const openPicker = () => {
        if (!isSeparate.value || source == 3) return;
        pickerVisible.value = true;
    };

    const closePicker = () => {
        pickerVisible.value = false;
    };

    return {
        isApp,
        isSeparate,
        pickerVisible,
        placement,
        size,
        showFooter,
        title,
        openPicker,
        closePicker,
    };
}

/**
 * 全局关闭 APP 端分离模式
 * 业务方调用 ShMobilePickerUtils.disableSeparate() 即可关闭全部分离
 */
export const ShMobilePickerUtils = {
    disableSeparate() {
        (window as any)._shMobileSeparateDisabled = true;
    },
    enableSeparate() {
        (window as any)._shMobileSeparateDisabled = false;
    },
};

/** 供 el-select / el-cascader 等使用，禁用 Popper 的 flip / preventOverflow 修饰符 */
export const MOBILE_POPPER_OPTIONS = {
    strategy: "absolute" as const,
    modifiers: [
        {name: "flip", enabled: false},
        {name: "preventOverflow", enabled: false},
        {name: "offset", options: {offset: [0, 0]}},
    ],
};
