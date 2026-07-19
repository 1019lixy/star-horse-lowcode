<script setup lang="ts" name="ApiOrchestrator">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { useApiOrchestrator } from "./composables/useApiOrchestrator";
import { SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS } from "./constants";
import ApiToolbar from "./panels/ApiToolbar.vue";
import ApiEndpointPanel from "./panels/ApiEndpointPanel.vue";
import ApiChainPanel from "./panels/ApiChainPanel.vue";
import ApiMockPanel from "./panels/ApiMockPanel.vue";
import type { ApiChain, ApiEndpoint, MockResponse } from "./types";

const props = defineProps<{
    endpoints?: ApiEndpoint[];
    mocks?: MockResponse[];
    chain?: Partial<ApiChain>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "save", data: {
        endpoints: ApiEndpoint[];
        mocks: MockResponse[];
        chain: ApiChain;
    }): void;
}>();

const state = useApiOrchestrator(
    props.endpoints ?? SAMPLE_ENDPOINTS,
    props.mocks ?? SAMPLE_MOCKS,
    props.chain ?? SAMPLE_CHAIN,
);

const logCollapsed = ref(false);

/** 由测试结果生成的执行日志（轻量级，避免引入 watch 依赖） */
const buildLogs = () => {
    const list: { time: string; level: "info" | "warn" | "error"; message: string }[] = [];
    if (state.isRunning.value) {
        list.push({
            time: new Date().toLocaleTimeString(),
            level: "info",
            message: i18n("api.status.running"),
        });
    }
    for (const r of state.testResults.value) {
        const time = new Date().toLocaleTimeString();
        if (r.success) {
            list.push({
                time,
                level: "info",
                message: `${r.stepName} → ${r.response.status} (${r.response.duration}ms)`,
            });
        } else {
            list.push({
                time,
                level: "error",
                message: `${r.stepName} ${i18n("api.status.error")} : ${r.error}`,
            });
        }
    }
    return list;
};

const handleSave = () => {
    const data = state.getData();
    emits("save", data);
    ElMessage.success(i18n("api.message.saved"));
};

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><polyline points="14 2 14 8 20 8"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
};
</script>

<template>
    <div class="api-orchestrator">
        <api-toolbar :state="state" @save="handleSave" />
        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="240px" min="180px" max="380px">
                <api-endpoint-panel :state="state" />
            </el-splitter-panel>
            <el-splitter-panel>
                <api-chain-panel :state="state" />
            </el-splitter-panel>
            <el-splitter-panel size="360px" min="260px" max="560px">
                <api-mock-panel :state="state" />
            </el-splitter-panel>
        </el-splitter>
        <div class="log-panel" :class="{ collapsed: logCollapsed }">
            <div class="log-header" @click="logCollapsed = !logCollapsed">
                <span class="log-title">
                <span class="svg-icon" v-html="icons.document"></span>
                    {{ i18n("api.test.title") }}
                    <span v-if="state.testResults.value.length" class="log-count">
                        ({{ state.testResults.value.length }})
                    </span>
                </span>
                <div class="log-actions" @click.stop>
                    <span class="svg-icon" v-html="logCollapsed ? icons.arrowDown : icons.arrowUp"></span>
                </div>
            </div>
            <div v-show="!logCollapsed" class="log-content">
                <div v-if="buildLogs().length === 0" class="log-empty">
                    {{ i18n("api.test.empty") }}
                </div>
                <div v-else class="log-list">
                    <div
                        v-for="(item, idx) in buildLogs()"
                        :key="idx"
                        class="log-item"
                        :class="`level-${item.level}`"
                    >
                        <span class="log-time">{{ item.time }}</span>
                        <span class="log-level">[{{ item.level }}]</span>
                        <span class="log-message">{{ item.message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.api-orchestrator {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .designer-body {
        flex: 1;
        overflow: hidden;
        min-height: 0;
    }

    .log-panel {
        height: 160px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--el-border-color);
        background: var(--el-bg-color);
        transition: height 0.2s;

        &.collapsed {
            height: 32px;
        }

        .log-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 12px;
            background: var(--el-fill-color-light);
            border-bottom: 1px solid var(--el-border-color-lighter);
            cursor: pointer;
            user-select: none;
            font-size: 12px;

            .log-title {
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: 600;

                .log-count {
                    color: var(--el-text-color-secondary);
                    font-weight: normal;
                }
            }

            .log-actions {
                display: flex;
                align-items: center;
                gap: 4px;

                .toggle-icon {
                    font-size: 12px;
                }
            }
        }

        .log-content {
            flex: 1;
            overflow: auto;
        }

        .log-empty {
            padding: 20px;
            text-align: center;
            color: var(--el-text-color-placeholder);
            font-size: 12px;
        }

        .log-list {
            padding: 4px 0;
            font-family: "Consolas", "Monaco", monospace;
            font-size: 12px;
        }

        .log-item {
            display: flex;
            gap: 8px;
            padding: 2px 12px;

            &.level-info {
                color: var(--el-text-color-regular);
            }

            &.level-warn {
                color: var(--el-color-warning);
            }

            &.level-error {
                color: var(--el-color-danger);
            }

            .log-time {
                color: var(--el-text-color-secondary);
                flex-shrink: 0;
            }

            .log-level {
                flex-shrink: 0;
                width: 60px;
            }

            .log-message {
                flex: 1;
                word-break: break-all;
            }
        }
    }
}
.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
