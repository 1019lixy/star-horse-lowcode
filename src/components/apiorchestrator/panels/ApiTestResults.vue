<script setup lang="ts" name="ApiTestResults">
import { ref } from "vue";
import { i18n } from "@/lang";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

defineProps<{
    state: ApiOrchestratorState;
}>();

/** 展开的结果 stepId 集合 */
const expanded = ref<Set<string>>(new Set());

const toggle = (stepId: string) => {
    if (expanded.value.has(stepId)) {
        expanded.value.delete(stepId);
    } else {
        expanded.value.add(stepId);
    }
};

const formatJson = (str: string): string => {
    if (!str) return "";
    try {
        return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
        return str;
    }
};
</script>

<template>
    <div class="api-test-results">
        <div class="section-title">{{ i18n("api.test.title") }}</div>
        <div class="results-body">
            <div v-if="state.testResults.value.length === 0" class="empty-tip">
                {{ i18n("api.test.empty") }}
            </div>
            <div v-else class="result-list">
                <div
                    v-for="(r, idx) in state.testResults.value"
                    :key="r.stepId + idx"
                    class="result-item"
                    :class="{ success: r.success, error: !r.success }"
                >
                    <div class="result-header" @click="toggle(r.stepId)">
                        <span class="result-index">{{ idx + 1 }}</span>
                        <span class="result-name">{{ r.stepName }}</span>
                        <el-tag
                            :type="r.success ? 'success' : 'danger'"

                            effect="light"
                        >
                            {{ r.success ? i18n("api.status.success") : i18n("api.status.error") }}
                        </el-tag>
                        <span class="result-status" v-if="r.response.status">
                            {{ r.response.status }} · {{ r.response.duration }}ms
                        </span>
                        <el-icon class="toggle-icon">
                            <ArrowDown v-if="!expanded.has(r.stepId)"/>
                            <ArrowUp v-else/>
                        </el-icon>
                    </div>
                    <div v-show="expanded.has(r.stepId)" class="result-detail">
                        <div v-if="r.error" class="error-box">{{ r.error }}</div>
                        <div class="detail-section">
                            <div class="detail-title">{{ i18n("api.test.request") }}</div>
                            <div class="kv-line">
                                <span class="k">{{ i18n("api.endpoint.method") }}:</span>
                                <span class="v">{{ r.request.method }}</span>
                            </div>
                            <div class="kv-line">
                                <span class="k">{{ i18n("api.endpoint.url") }}:</span>
                                <span class="v mono">{{ r.request.url }}</span>
                            </div>
                            <div v-if="Object.keys(r.request.headers).length" class="kv-block">
                                <span class="k">{{ i18n("api.endpoint.headers") }}:</span>
                                <pre class="v mono">{{ JSON.stringify(r.request.headers, null, 2) }}</pre>
                            </div>
                            <div v-if="r.request.body" class="kv-block">
                                <span class="k">{{ i18n("api.endpoint.body") }}:</span>
                                <pre class="v mono">{{ formatJson(r.request.body) }}</pre>
                            </div>
                        </div>
                        <div class="detail-section">
                            <div class="detail-title">{{ i18n("api.test.response") }}</div>
                            <div class="kv-line">
                                <span class="k">{{ i18n("api.test.status") }}:</span>
                                <span class="v">{{ r.response.status }} {{ r.response.statusText }}</span>
                            </div>
                            <div class="kv-line">
                                <span class="k">{{ i18n("api.test.duration") }}:</span>
                                <span class="v">{{ r.response.duration }} ms</span>
                            </div>
                            <div v-if="r.response.body" class="kv-block">
                                <span class="k">{{ i18n("api.mock.body") }}:</span>
                                <pre class="v mono">{{ formatJson(r.response.body) }}</pre>
                            </div>
                        </div>
                        <div v-if="Object.keys(r.extractedVars).length" class="detail-section">
                            <div class="detail-title">{{ i18n("api.test.extractedVars") }}</div>
                            <pre class="v mono extracted">{{ JSON.stringify(r.extractedVars, null, 2) }}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
export default { components: { ArrowUp, ArrowDown } };
</script>

<style lang="scss" scoped>
.api-test-results {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .section-title {
        padding: 6px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-fill-color-light);
        flex-shrink: 0;
    }

    .results-body {
        flex: 1;
        overflow: auto;
        padding: 8px;
    }

    .empty-tip {
        padding: 40px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }

    .result-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .result-item {
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        overflow: hidden;

        &.success {
            border-left: 3px solid var(--el-color-success);
        }

        &.error {
            border-left: 3px solid var(--el-color-danger);
        }

        .result-header {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 8px;
            cursor: pointer;
            background: var(--el-fill-color-light);

            .result-index {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--el-color-primary);
                color: #fff;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .result-name {
                flex: 1;
                font-size: 12px;
                font-weight: 500;
            }

            .result-status {
                font-size: 11px;
                color: var(--el-text-color-secondary);
                font-family: "Consolas", "Monaco", monospace;
            }

            .toggle-icon {
                font-size: 12px;
                color: var(--el-text-color-secondary);
            }
        }

        .result-detail {
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .error-box {
                background: var(--el-color-danger-light-9);
                color: var(--el-color-danger);
                padding: 6px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            .detail-section {
                display: flex;
                flex-direction: column;
                gap: 2px;

                .detail-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--el-text-color-primary);
                    margin-bottom: 2px;
                }

                .kv-line {
                    display: flex;
                    gap: 4px;
                    font-size: 11px;

                    .k {
                        color: var(--el-text-color-secondary);
                        flex-shrink: 0;
                    }

                    .v {
                        word-break: break-all;
                    }

                    .mono {
                        font-family: "Consolas", "Monaco", monospace;
                    }
                }

                .kv-block {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-size: 11px;

                    .k {
                        color: var(--el-text-color-secondary);
                    }

                    .v {
                        word-break: break-all;
                        white-space: pre-wrap;
                    }

                    .mono {
                        font-family: "Consolas", "Monaco", monospace;
                        background: var(--el-fill-color-light);
                        padding: 4px;
                        border-radius: 3px;
                    }

                    .extracted {
                        background: var(--el-color-success-light-9);
                    }
                }
            }
        }
    }
}
</style>
