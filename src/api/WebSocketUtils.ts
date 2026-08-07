/**
 * WebSocket 重连配置项接口
 */
import {i18n} from "@/lang";

interface WebSocketOptions {
    /** 重连间隔（毫秒），默认 3000 */
    reconnectInterval?: number;
    /** 最大重连次数，0 表示无限重试，默认 10 */
    maxReconnectAttempts?: number;
    /** 心跳间隔（毫秒），默认 10000 */
    heartbeatInterval?: number;
    /** 心跳消息内容，默认 "ping" */
    heartbeatMsg?: string;
}

/**
 * 自定义回调函数类型
 */
interface WebSocketCallbacks {
    /** 连接成功回调 */
    onopen?: (event: Event) => void;
    /** 连接关闭回调 */
    onclose?: (event: CloseEvent) => void;
    /** 连接错误回调 */
    onerror?: (event: Event) => void;
    /** 接收消息回调 */
    onmessage?: (event: MessageEvent) => void;
    /** 达到最大重连次数回调 */
    onmaxreconnect?: () => void;
}

/**
 * 带自动重连和心跳检测的 WebSocket 类（TS 版本）
 */
class WebSocketUtils implements WebSocketCallbacks {
    private readonly url: string;
    private readonly reconnectInterval: number;
    private readonly maxReconnectAttempts: number;
    private readonly heartbeatInterval: number;
    private readonly heartbeatMsg: string;

    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private isManualClose = false;
    private heartbeatTimer: NodeJS.Timeout | null = null;

    // 自定义回调函数
    onopen?: (event: Event) => void;
    onclose?: (event: CloseEvent) => void;
    onerror?: (event: Event) => void;
    onmessage?: (event: MessageEvent) => void;
    onmaxreconnect?: () => void;

    constructor(url: string, options: WebSocketOptions = {}) {
        this.url = url;
        // 初始化配置项（带默认值）
        this.reconnectInterval = options.reconnectInterval ?? 3000;
        this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
        this.heartbeatInterval = options.heartbeatInterval ?? 10000;
        this.heartbeatMsg = options.heartbeatMsg ?? "ping";

        // 绑定事件处理函数（确保 this 指向当前实例）
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.sendHeartbeat = this.sendHeartbeat.bind(this);

        // 初始化连接
        this.connect();
    }

    /**
     * 初始化/重连 WebSocket 连接
     */
    private connect(): void {
        // 关闭已有连接
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        try {
            this.ws = new WebSocket(this.url);

            // 绑定原生事件
            this.ws.onopen = this.handleOpen;
            this.ws.onclose = this.handleClose;
            this.ws.onerror = this.handleError;
            this.ws.onmessage = this.handleMessage;
        } catch (error) {
            console.error("WebSocket 连接创建失败:", error);
            this.scheduleReconnect();
        }
    }

    /**
     * 连接成功事件处理
     */
    private handleOpen(event: Event): void {
        console.log("WebSocket 连接成功", event);
        // 重置重连状态
        this.reconnectAttempts = 0;
        this.isManualClose = false;
        // 启动心跳检测
        this.startHeartbeat();
        // 触发自定义回调
        this.onopen?.(event);
    }

    /**
     * 连接关闭事件处理
     */
    private handleClose(event: CloseEvent): void {
        console.log("WebSocket 连接关闭", event);
        // 停止心跳检测
        this.stopHeartbeat();

        // 手动关闭则不触发重连
        if (this.isManualClose) {
            console.log("手动关闭连接，不执行重连");
            this.onclose?.(event);
            return;
        }

        // 触发重连逻辑
        this.scheduleReconnect();
        // 触发自定义回调
        this.onclose?.(event);
    }

    /**
     * 连接错误事件处理
     */
    private handleError(event: Event): void {
        console.error("WebSocket 连接错误:", event);
        this.onerror?.(event);
    }

    /**
     * 消息接收事件处理
     */
    private handleMessage(event: MessageEvent): void {
        console.log("收到 WebSocket 消息:", event.data);
        // 过滤心跳响应消息
        if (event.data === "pong") return;
        // 触发自定义消息回调
        this.onmessage?.(event);
    }

    /**
     * 调度重连（带指数退避策略）
     */
    private scheduleReconnect(): void {
        // 检查是否达到最大重连次数
        if (
            this.maxReconnectAttempts > 0 &&
            this.reconnectAttempts >= this.maxReconnectAttempts
        ) {
            console.error(
                `已达到最大重连次数(${this.maxReconnectAttempts})，停止重连`,
            );
            this.onmaxreconnect?.();
            return;
        }

        this.reconnectAttempts++;
        const delay =
            this.reconnectInterval * Math.min(2 ** this.reconnectAttempts, 8); // 最大8倍间隔
        console.log(
            `第 ${this.reconnectAttempts} 次重连，${delay / 1000} 秒后重试...`,
        );

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    /**
     * 发送心跳消息
     */
    private sendHeartbeat(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(this.heartbeatMsg);
            console.log("发送心跳消息:", this.heartbeatMsg);
        }
    }

    /**
     * 启动心跳检测
     */
    private startHeartbeat(): void {
        // 先停止已有心跳定时器
        this.stopHeartbeat();

        // 启动新的心跳定时器
        this.heartbeatTimer = setInterval(
            this.sendHeartbeat,
            this.heartbeatInterval,
        );
    }

    /**
     * 停止心跳检测
     */
    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * 对外暴露：发送消息
     * @param data 要发送的消息（支持 string/ArrayBuffer/Blob）
     */
    public send(data: string | ArrayBuffer | Blob): void {
        if (!this.ws) {
            console.error("WebSocket 实例未初始化，无法发送消息");
            return;
        }

        if (this.ws.readyState !== WebSocket.OPEN) {
            console.error(
                "WebSocket 未处于连接状态，无法发送消息（当前状态：",
                this.getReadyStateText(),
                "）",
            );
            return;
        }

        this.ws.send(data);
    }

    /**
     * 对外暴露：手动关闭连接（不会触发重连）
     * @param code 关闭码（默认 1000，表示正常关闭）
     * @param reason 关闭原因
     */
    public close(code: number = 1000, reason?: string): void {
        this.isManualClose = true;
        this.stopHeartbeat();

        if (this.ws) {
            this.ws.close(code, reason);
        }
    }

    /**
     * 辅助方法：获取连接状态文本
     */
    public getReadyStateText(): string {
        if (!this.ws) return i18n("ws.notInitialized");

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return i18n("ws.connecting");
            case WebSocket.OPEN:
                return i18n("ws.connected");
            case WebSocket.CLOSING:
                return i18n("ws.closing");
            case WebSocket.CLOSED:
                return i18n("ws.closed");
            default:
                return i18n("ws.unknownState");
        }
    }
}

// 导出供外部使用
export default WebSocketUtils;
