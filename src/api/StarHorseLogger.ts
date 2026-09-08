/**
 * 前端分级日志工具，自动解析调用栈获取调用位置
 * 级别顺序：DEBUG=0, INFO=1, WARN=2, ERROR=3, OFF=99
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 99,
}

interface LoggerConfig {
    globalLevel: LogLevel;
    enableStackInfo: boolean; // 是否打印调用栈位置信息
}

export class StarHorseLogger {
    private static config: LoggerConfig = {
        globalLevel: LogLevel.DEBUG,
        enableStackInfo: true,
    };

    /** 设置全局日志级别 */
    public static setGlobalLevel(level: LogLevel): void {
        StarHorseLogger.config.globalLevel = level;
    }

    /** 是否开启调用位置打印，生产建议关闭 */
    public static setEnableStackInfo(enable: boolean): void {
        StarHorseLogger.config.enableStackInfo = enable;
    }

    /** 完全关闭日志 */
    public static disableAll(): void {
        StarHorseLogger.config.globalLevel = LogLevel.OFF;
    }

    public static enableAll(): void {
        StarHorseLogger.config.globalLevel = LogLevel.DEBUG;
    }

    /**
     * 解析调用栈，拿到调用本日志方法的那一层栈帧
     * new Error().stack 拿栈，过滤掉Logger自身的栈帧
     */
    private static getCallerPosition(): string | null {
        if (!StarHorseLogger.config.enableStackInfo) return null;
        const stack = new Error().stack;
        if (!stack) return null;

        const lines = stack.split("\n");
        // 栈结构示例：
        // Error
        //     at FrontLogger.getCallerPosition (xxx.ts:xx:xx)
        //     at FrontLogger.debug (xxx.ts:xx:xx)
        //     at xxx业务代码 (xxx.vue:123:45) <--我们要这一行
        // 跳过前3行：Error行 + getCallerPosition + debug/info/warn/error，取第4行
        for (let i = 3; i < lines.length; i++) {
            const line = lines[i].trim();
            // 过滤掉框架内部、vite、webpack、runtime等无关栈
            if (!line.includes("FrontLogger")) {
                return line;
            }
        }
        return null;
    }

    private readonly moduleTag: string;

    /**
     * @param moduleTag 业务模块标记（可选，用于业务分组，不替代自动栈位置）
     */
    constructor(moduleTag = "APP") {
        this.moduleTag = moduleTag;
    }

    private canPrint(targetLevel: LogLevel): boolean {
        return StarHorseLogger.config.globalLevel !== LogLevel.OFF && targetLevel >= StarHorseLogger.config.globalLevel;
    }

    public debug(...args: unknown[]): void {
        if (!this.canPrint(LogLevel.DEBUG)) return;
        const pos = StarHorseLogger.getCallerPosition();
        console.debug(`[${this.moduleTag}] DEBUG ${pos ?? ""}`, ...args);
    }

    public info(...args: unknown[]): void {
        if (!this.canPrint(LogLevel.INFO)) return;
        const pos = StarHorseLogger.getCallerPosition();
        console.info(`[${this.moduleTag}] INFO ${pos ?? ""}`, ...args);
    }

    public warn(...args: unknown[]): void {
        if (!this.canPrint(LogLevel.WARN)) return;
        const pos = StarHorseLogger.getCallerPosition();
        console.warn(`[${this.moduleTag}] WARN ${pos ?? ""}`, ...args);
    }

    public error(...args: unknown[]): void {
        if (!this.canPrint(LogLevel.ERROR)) return;
        const pos = StarHorseLogger.getCallerPosition();
        console.error(`[${this.moduleTag}] ERROR ${pos ?? ""}`, ...args);
    }
}
