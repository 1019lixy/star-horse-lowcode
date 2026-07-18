<script setup lang="ts" name="GraphQueryBuilderPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import { ElMessage } from "element-plus";
import {
    KG_EDGE_TYPE_PRESETS,
    KG_NODE_TYPE_PRESETS,
    KG_OPERATOR_PRESETS,
} from "../constants";
import type { KgQueryCondition, KgQueryStep } from "../types";
import type { UseGraphQueryBuilderReturn } from "../composables/useGraphQueryBuilder";

const props = defineProps<{
    builder: UseGraphQueryBuilderReturn;
}>();

const builder = props.builder;

const query = computed(() => builder.state.query);

const emit = defineEmits<{
    (e: "run"): void;
    (e: "open-template"): void;
}>();

const handleRun = () => emit("run");
const handleClear = () => builder.clearQuery();
const handleOpenTemplate = () => emit("open-template");

const handleAddStep = () => builder.addStep();
const handleRemoveStep = (id: string) => builder.removeStep(id);

const handleAddStartCondition = () => builder.addStartCondition();
const handleRemoveStartCondition = (id: string) => builder.removeStartCondition(id);

const handleAddStepCondition = (stepId: string) => builder.addStepCondition(stepId);
const handleRemoveStepCondition = (stepId: string, condId: string) =>
    builder.removeStepCondition(stepId, condId);

const onRunResult = () => {
    ElMessage.success(i18n("knowledgegraph.message.queryExecuted"));
};

const runQuery = () => {
    handleRun();
    onRunResult();
};

const stepIndex = (step: KgQueryStep): number => query.value.steps.indexOf(step) + 1;
</script>

<template>
    <div class="kg-query-panel">
        <div class="panel-header">
            <span>{{ i18n("knowledgegraph.query.title") }}</span>
            <div class="header-actions">
                <el-button  @click="handleOpenTemplate">
                    <el-icon><FolderOpened /></el-icon>
                    {{ i18n("knowledgegraph.query.template.title") }}
                </el-button>
                <el-button  @click="handleClear">
                    {{ i18n("knowledgegraph.query.clear") }}
                </el-button>
                <el-button  type="primary" @click="runQuery">
                    <el-icon><VideoPlay /></el-icon>
                    {{ i18n("knowledgegraph.query.run") }}
                </el-button>
            </div>
        </div>

        <div class="panel-body">
            <!-- 起始节点 -->
            <div class="query-section">
                <div class="section-title">
                    <span class="step-badge">0</span>
                    {{ i18n("knowledgegraph.query.startNode") }}
                </div>
                <div class="section-content">
                    <el-form label-width="90px" >
                        <el-form-item :label="i18n('knowledgegraph.query.nodeType')">
                            <el-select v-model="query.startNodeType" style="width: 100%">
                                <el-option
                                    v-for="opt in KG_NODE_TYPE_PRESETS"
                                    :key="opt.type"
                                    :label="i18n(opt.labelKey)"
                                    :value="opt.type"
                                />
                            </el-select>
                        </el-form-item>
                        <div v-if="query.startConditions.length > 0" class="conditions">
                            <div
                                v-for="cond in query.startConditions"
                                :key="cond.id"
                                class="condition-row"
                            >
                                <el-input
                                    :model-value="cond.property"
                                    @update:model-value="(v) => builder.updateStartCondition(cond.id, { property: v })"
                                    placeholder="prop"
                                    style="width: 90px"
                                />
                                <el-select
                                    :model-value="cond.operator"
                                    @update:model-value="(v) => builder.updateStartCondition(cond.id, { operator: v })"
                                    style="width: 100px"
                                >
                                    <el-option
                                        v-for="op in KG_OPERATOR_PRESETS"
                                        :key="op.value"
                                        :label="i18n(op.labelKey)"
                                        :value="op.value"
                                    />
                                </el-select>
                                <el-input
                                    :model-value="cond.value"
                                    @update:model-value="(v) => builder.updateStartCondition(cond.id, { value: v })"
                                    placeholder="value"
                                    style="flex: 1"
                                />
                                <el-button

                                    type="danger"
                                    link
                                    @click="handleRemoveStartCondition(cond.id)"
                                >
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </div>
                        <el-button  link @click="handleAddStartCondition">
                            <el-icon><Plus /></el-icon>
                            {{ i18n("knowledgegraph.query.condition") }}
                        </el-button>
                    </el-form>
                </div>
            </div>

            <!-- 关系步骤 -->
            <div
                v-for="step in query.steps"
                :key="step.id"
                class="query-section"
            >
                <div class="section-title">
                    <span class="step-badge">{{ stepIndex(step) }}</span>
                    {{ i18n("knowledgegraph.query.step") }}
                    <el-button

                        type="danger"
                        link
                        style="margin-left: auto"
                        @click="handleRemoveStep(step.id)"
                    >
                        <el-icon><Delete /></el-icon>
                        {{ i18n("knowledgegraph.query.removeStep") }}
                    </el-button>
                </div>
                <div class="section-content">
                    <el-form label-width="90px" >
                        <el-form-item :label="i18n('knowledgegraph.query.direction')">
                            <el-radio-group
                                :model-value="step.direction"
                                @update:model-value="(v) => builder.updateStep(step.id, { direction: v })"
                            >
                                <el-radio-button value="out">{{ i18n("knowledgegraph.query.direction.out") }}</el-radio-button>
                                <el-radio-button value="in">{{ i18n("knowledgegraph.query.direction.in") }}</el-radio-button>
                                <el-radio-button value="both">{{ i18n("knowledgegraph.query.direction.both") }}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="i18n('knowledgegraph.query.edgeType')">
                            <el-select
                                :model-value="step.edgeType"
                                @update:model-value="(v) => builder.updateStep(step.id, { edgeType: v })"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="opt in KG_EDGE_TYPE_PRESETS"
                                    :key="opt.type"
                                    :label="i18n(opt.labelKey)"
                                    :value="opt.type"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="i18n('knowledgegraph.query.nodeType')">
                            <el-select
                                :model-value="step.nodeType"
                                @update:model-value="(v) => builder.updateStep(step.id, { nodeType: v })"
                                style="width: 100%"
                            >
                                <el-option
                                    v-for="opt in KG_NODE_TYPE_PRESETS"
                                    :key="opt.type"
                                    :label="i18n(opt.labelKey)"
                                    :value="opt.type"
                                />
                            </el-select>
                        </el-form-item>
                        <div v-if="step.conditions.length > 0" class="conditions">
                            <div
                                v-for="cond in step.conditions"
                                :key="cond.id"
                                class="condition-row"
                            >
                                <el-input
                                    :model-value="cond.property"
                                    @update:model-value="(v) => builder.updateStepCondition(step.id, cond.id, { property: v })"
                                    placeholder="prop"
                                    style="width: 90px"
                                />
                                <el-select
                                    :model-value="cond.operator"
                                    @update:model-value="(v) => builder.updateStepCondition(step.id, cond.id, { operator: v })"
                                    style="width: 100px"
                                >
                                    <el-option
                                        v-for="op in KG_OPERATOR_PRESETS"
                                        :key="op.value"
                                        :label="i18n(op.labelKey)"
                                        :value="op.value"
                                    />
                                </el-select>
                                <el-input
                                    :model-value="cond.value"
                                    @update:model-value="(v) => builder.updateStepCondition(step.id, cond.id, { value: v })"
                                    placeholder="value"
                                    style="flex: 1"
                                />
                                <el-button

                                    type="danger"
                                    link
                                    @click="handleRemoveStepCondition(step.id, cond.id)"
                                >
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </div>
                        <el-button  link @click="handleAddStepCondition(step.id)">
                            <el-icon><Plus /></el-icon>
                            {{ i18n("knowledgegraph.query.condition") }}
                        </el-button>
                    </el-form>
                </div>
            </div>

            <div class="add-step-row">
                <el-button type="primary" plain @click="handleAddStep" style="width: 100%">
                    <el-icon><Plus /></el-icon>
                    {{ i18n("knowledgegraph.query.addStep") }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FolderOpened, VideoPlay, Delete, Plus } from "@element-plus/icons-vue";
export default { components: { FolderOpened, VideoPlay, Delete, Plus } };
</script>

<style lang="scss" scoped>
.kg-query-panel {
    width: 380px;
    height: 100%;
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;

    .panel-header {
        padding: 8px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-shrink: 0;

        .header-actions {
            display: flex;
            gap: 6px;
        }
    }

    .panel-body {
        flex: 1;
        overflow: auto;
        padding: 12px;
    }

    .query-section {
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        margin-bottom: 12px;
        background: var(--el-fill-color-blank);

        .section-title {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            background: var(--el-fill-color-light);
            border-bottom: 1px solid var(--el-border-color-lighter);
            border-radius: 4px 4px 0 0;
            font-size: 13px;
            font-weight: 600;

            .step-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: var(--star-horse-style, #1890FF);
                color: #FFF;
                font-size: 12px;
                font-weight: 600;
            }
        }

        .section-content {
            padding: 8px 10px;
        }
    }

    .conditions {
        margin-bottom: 6px;

        .condition-row {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 4px;
        }
    }

    .add-step-row {
        margin-top: 8px;
    }
}
</style>
