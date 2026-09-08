/**
 * 字符串不可见控制字符工具类
 * 控制字符范围：\x00-\x1F 以及 \x7F(DEL)，不包含普通空格 \x20
 */
export class StringCleanUtil {
    /**
     * 判断字符串是否包含不可见控制字符
     * @param str 待检测字符串
     */
    public static hasInvisibleChar(str: string | null | undefined): boolean {
        if (str === null || str === undefined) return false;
        // eslint-disable-next-line no-control-regex
        const reg = /[\x00-\x1F\x7F]/;
        return reg.test(str);
    }

    /**
     * 移除所有不可见控制字符
     * @param str 原始字符串
     */
    public static removeInvisibleChar(str: string | null | undefined): string {
        if (str === null || str === undefined) return "";
        // eslint-disable-next-line no-control-regex
        const reg = /[\x00-\x1F\x7F]/g;
        return str.replace(reg, "");
    }

    /**
     * 【调试用】把隐藏控制字符替换为可视标记，方便控制台排错
     */
    public static visualizeInvisible(str: string | null | undefined): string {
        if (str === null || str === undefined) return "";
        return [...str].map(c => {
            const code = c.charCodeAt(0);
            if ((code >= 0 && code <= 31) || code === 127) {
                return `{\\x${code.toString(16).padStart(2,"0")}}`;
            }
            return c;
        }).join("");
    }
}
