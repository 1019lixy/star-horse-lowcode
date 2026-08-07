/**
 * AI Copilot - Provider 管理
 *
 * registerProvider / getProvider / mockProvider / streamResponse（打字机效果）
 */

import {AI_DEFAULT_SETTINGS, AI_STREAM_CHUNK_SIZE, AI_STREAM_INTERVAL} from "../constants";
import {aiGenerateMockResponse} from "../utils/AiMockEngine";
import type {AiProvider, AiProviderRequest, AiProviderResponse, AiStreamCallbacks,} from "../types";

/** Provider 注册表（模块级单例） */
const providerRegistry: Map<string, AiProvider> = new Map();

/** Mock Provider - 本地模拟 AI 响应 */
export const aiMockProvider: AiProvider = {
    name: "mock",
    async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
        // 模拟网络延迟
        const delay = 200 + Math.random() * 400;
        await new Promise<void>((resolve) => {
            setTimeout(resolve, delay);
        });
        return aiGenerateMockResponse(request.message, request.context);
    },
};

/** 注册 Provider */
export const registerProvider = (name: string, provider: AiProvider): void => {
    providerRegistry.set(name, provider);
};

/** 获取 Provider */
export const getProvider = (name: string): AiProvider | undefined => {
    return providerRegistry.get(name);
};

/** 获取所有已注册 Provider 名称 */
export const getRegisteredProviderNames = (): string[] => {
    return Array.from(providerRegistry.keys());
};

// 默认注册 mock provider
registerProvider("mock", aiMockProvider);

/**
 * 流式响应（打字机效果）
 *
 * @param text 完整文本
 * @param callbacks 回调
 * @returns 返回停止函数，调用后立即停止
 */
export const aiStreamResponse = (
    text: string,
    callbacks: AiStreamCallbacks,
): (() => void) => {
    let stopped = false;
    let index = 0;
    const total = text.length;

    const stop = (): void => {
        stopped = true;
    };

    const timer = setInterval(() => {
        if (stopped) {
            clearInterval(timer);
            callbacks.onDone?.(text.slice(0, index));
            return;
        }
        if (callbacks.shouldStop?.()) {
            stopped = true;
            clearInterval(timer);
            callbacks.onDone?.(text.slice(0, index));
            return;
        }
        if (index >= total) {
            clearInterval(timer);
            callbacks.onDone?.(text);
            return;
        }
        const next = Math.min(index + AI_STREAM_CHUNK_SIZE, total);
        const chunk = text.slice(index, next);
        index = next;
        callbacks.onChunk?.(chunk, text.slice(0, index));
    }, AI_STREAM_INTERVAL);

    return stop;
};

/**
 * 组合式函数：Provider 管理
 *
 * 提供响应式 currentProviderName（默认 mock）以及便捷方法
 */
export function useAiProvider() {
    /** 根据 settings 取得 provider */
    const resolveProvider = (name?: string): AiProvider => {
        const target = name ?? AI_DEFAULT_SETTINGS.provider;
        const provider = getProvider(target);
        if (!provider) {
            // 回退到 mock
            return aiMockProvider;
        }
        return provider;
    };

    return {
        registerProvider,
        getProvider,
        getRegisteredProviderNames,
        aiMockProvider,
        aiStreamResponse,
        resolveProvider,
    };
}

export type UseAiProviderReturn = ReturnType<typeof useAiProvider>;
