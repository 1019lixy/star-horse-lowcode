<script setup lang="ts" name="ApiChainSequence">
import { i18n } from "@/lang";
import { METHOD_COLORS } from "../constants";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";
import type { VariableExtraction } from "../types";

const props = defineProps<{
    state: ApiOrchestratorState;
}>();

const endpointName = (endpointId: string): string => {
    const ep = props.state.endpoints.find((e) => e.id === endpointId);
    return ep ? ep.name : "-";
};

const endpointMethod = (endpointId: string): string => {
    const ep = props.state.endpoints.find((e) => e.id === endpointId);
    return ep ? ep.method : "";
};

/** 添加步骤：默认选第一个接口 */
const handleAddStep = () => {
    if (props.state.endpoints.length === 0) return;
    const firstEp = props.state.endpoints[0];
    props.state.addChainStep(firstEp.id);
};

/** 变量提取操作 */
const addExtraction = (stepId: string) => {
    const step = props.state.chain.steps.find((s) => s.id === stepId);
    if (!step) return;
    const extractions: VariableExtraction[] = [
        ...step.variableExtractions,
        { sourceVar: "", targetVar: "" },
    ];
    props.state.updateChainStep(stepId, { variableExtractions: extractions });
};
const updateExtraction = (stepId: string, index: number, key: keyof VariableExtraction, value: string) => {
    const step = props.state.chain.steps.find((s) => s.id === stepId);
    if (!step) return;
    const extractions = [...step.variableExtractions];
    extractions[index] = { ...extractions[index], [key]: value };
    props.state.updateChainStep(stepId, { variableExtractions: extractions });
};
const removeExtraction = (stepId: string, index: number) => {
    const step = props.state.chain.steps.find((s) => s.id === stepId);
    if (!step) return;
    const extractions = [...step.variableExtractions];
    extractions.splice(index, 1);
    props.state.updateChainStep(stepId, { variableExtractions: extractions });
};
</script>

<template>
    <div class="api-chain-sequence">
        <div class="section-title">
            <span>{{ i18n("api.chain.steps") }}</span>
            <el-button  type="primary" plain @click="handleAddStep">
                <el-icon><Plus/></el-icon>
                {{ i18n("api.btn.addStep") }}
            </el-button>
        </div>
        <div class="sequence-body">
            <div v-if="state.chain.steps.length === 0" class="empty-tip">
                {{ i18n("api.chain.empty") }}
            </div>
            <div v-else class="step-list">
                <div
                    v-for="(step, idx) in state.chain.steps"
                    :key="step.id"
                    class="step-card"
                >
                    <div class="step-header">
                        <span class="step-index">{{ idx + 1 }}</span>
                        <el-input
                            :model-value="step.stepName"

                            style="flex: 1"
                            @change="(v) => state.updateChainStep(step.id, { stepName: String(v) })"
                        />
                        <el-select
                            :model-value="step.endpointId"

                            style="width: 160px"
                            @change="(v) => state.updateChainStep(step.id, { endpointId: String(v) })"
                        >
                            <el-option
                                v-for="ep in state.endpoints"
                                :key="ep.id"
                                :label="`${ep.method} ${ep.name}`"
                                :value="ep.id"
                            />
                        </el-select>
                        <span
                            class="method-badge"
                            :style="{ background: METHOD_COLORS[endpointMethod(step.endpointId)] }"
                            v-if="endpointMethod(step.endpointId)"
                        >
                            {{ endpointMethod(step.endpointId) }}
                        </span>
                        <el-button text  :disabled="idx === 0" @click="state.moveStep(step.id, -1)">
                            <el-icon><Top/></el-icon>
                        </el-button>
                        <el-button
                            text

                            :disabled="idx === state.chain.steps.length - 1"
                            @click="state.moveStep(step.id, 1)"
                        >
                            <el-icon><Bottom/></el-icon>
                        </el-button>
                        <el-button text type="danger"  @click="state.removeChainStep(step.id)">
                            <el-icon><Delete/></el-icon>
                        </el-button>
                    </div>
                    <div class="step-meta">
                        <span class="endpoint-ref">{{ endpointName(step.endpointId) }}</span>
                    </div>
                    <div class="step-extractions">
                        <div class="sub-title">{{ i18n("api.chain.variableExtractions") }}</div>
                        <div
                            v-for="(ext, eIdx) in step.variableExtractions"
                            :key="eIdx"
                            class="list-row ext-row"
                        >
                            <el-input
                                :model-value="ext.sourceVar"

                                :placeholder="i18n('api.extraction.sourceVar')"
                                @change="(v) => updateExtraction(step.id, Number(eIdx), 'sourceVar', String(v))"
                            />
                            <span class="arrow">→</span>
                            <el-input
                                :model-value="ext.targetVar"

                                :placeholder="i18n('api.extraction.targetVar')"
                                @change="(v) => updateExtraction(step.id, Number(eIdx), 'targetVar', String(v))"
                            />
                            <el-button text type="danger"  @click="removeExtraction(step.id, Number(eIdx))">
                                <el-icon><Delete/></el-icon>
                            </el-button>
                        </div>
                        <el-button  text @click="addExtraction(step.id)">
                            + {{ i18n("api.chain.variableExtractions") }}
                        </el-button>
                    </div>
                    <div class="step-condition">
                        <span class="sub-title">{{ i18n("api.chain.condition") }}</span>
                        <el-input
                            :model-value="step.condition"

                            placeholder='e.g. token != null'
                            @change="(v) => state.updateChainStep(step.id, { condition: String(v) })"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Plus, Top, Bottom, Delete } from "@element-plus/icons-vue";
export default { components: { Plus, Top, Bottom, Delete } };
</script>

<style lang="scss" scoped>
.api-chain-sequence {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-fill-color-light);
    }

    .sequence-body {
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

    .step-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .step-card {
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        padding: 8px;
        background: var(--el-bg-color);
        display: flex;
        flex-direction: column;
        gap: 6px;

        .step-header {
            display: flex;
            align-items: center;
            gap: 6px;

            .step-index {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--el-color-primary);
                color: #fff;
                font-size: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .method-badge {
                color: #fff;
                font-size: 10px;
                font-weight: 600;
                padding: 2px 4px;
                border-radius: 3px;
                flex-shrink: 0;
                min-width: 38px;
                text-align: center;
            }
        }

        .step-meta {
            font-size: 12px;
            color: var(--el-text-color-secondary);

            .endpoint-ref {
                font-family: "Consolas", "Monaco", monospace;
            }
        }

        .sub-title {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            margin-bottom: 2px;
        }

        .step-extractions,
        .step-condition {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .list-row.ext-row {
            display: flex;
            align-items: center;
            gap: 4px;

            .arrow {
                color: var(--el-text-color-secondary);
                font-size: 12px;
                flex-shrink: 0;
            }

            :deep(.el-input) {
                flex: 1;
            }
        }
    }
}
</style>
