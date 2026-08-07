<script setup lang="ts" name="ApiChainSequence">
import {computed, ref} from "vue";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {METHOD_COLORS, METHOD_LABELS} from "../constants";
import type {ApiOrchestratorState} from "../composables/useApiOrchestrator";
import type {VariableExtraction} from "../types";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

/** 展开的步骤详情 id 集合 */
const expandedStepIds = ref<Set<string>>(new Set());

/** 插入菜单显示状态 */
const insertMenu = ref<{ visible: boolean; refStepId: string | null; position: "before" | "after" }>({
  visible: false,
  refStepId: null,
  position: "after",
});

const endpointName = (endpointId: string): string => {
  const ep = props.state.endpoints.find((e) => e.id === endpointId);
  return ep ? ep.name : "-";
};

const endpointMethod = (endpointId: string): string => {
  const ep = props.state.endpoints.find((e) => e.id === endpointId);
  return ep ? ep.method : "";
};

const endpointPath = (endpointId: string): string => {
  const ep = props.state.endpoints.find((e) => e.id === endpointId);
  return ep ? ep.url : "";
};

/** 获取步骤测试结果 */
const stepResult = (stepId: string) => {
  return props.state.testResults.value.find((r) => r.stepId === stepId);
};

/** 添加步骤：默认选第一个接口 */
const handleAddStep = () => {
  if (props.state.endpoints.length === 0) return;
  const firstEp = props.state.endpoints[0];
  const step = props.state.addChainStep(firstEp.id);
  if (step) {
    expandedStepIds.value.add(step.id);
    expandedStepIds.value = new Set(expandedStepIds.value);
  }
};

/** 切换展开/折叠 */
const toggleExpand = (stepId: string) => {
  if (expandedStepIds.value.has(stepId)) {
    expandedStepIds.value.delete(stepId);
  } else {
    expandedStepIds.value.add(stepId);
  }
  expandedStepIds.value = new Set(expandedStepIds.value);
};

/** 显示插入菜单 */
const showInsertMenu = (refStepId: string, position: "before" | "after", e: MouseEvent) => {
  e.stopPropagation();
  insertMenu.value = {visible: true, refStepId, position};
};

/** 执行插入 */
const handleInsert = (endpointId: string) => {
  if (!insertMenu.value.refStepId) return;
  if (insertMenu.value.position === "before") {
    props.state.insertStepBefore(insertMenu.value.refStepId, endpointId);
  } else {
    props.state.insertStepAfter(insertMenu.value.refStepId, endpointId);
  }
  insertMenu.value.visible = false;
};

/** 关闭插入菜单 */
const closeInsertMenu = () => {
  insertMenu.value.visible = false;
};

/** 变量提取操作 */
const addExtraction = (stepId: string) => {
  const step = props.state.chain.steps.find((s) => s.id === stepId);
  if (!step) return;
  const extractions: VariableExtraction[] = [
    ...step.variableExtractions,
    {sourceVar: "", targetVar: ""},
  ];
  props.state.updateChainStep(stepId, {variableExtractions: extractions});
};
const updateExtraction = (stepId: string, index: number, key: keyof VariableExtraction, value: string) => {
  const step = props.state.chain.steps.find((s) => s.id === stepId);
  if (!step) return;
  const extractions = [...step.variableExtractions];
  extractions[index] = {...extractions[index], [key]: value};
  props.state.updateChainStep(stepId, {variableExtractions: extractions});
};
const removeExtraction = (stepId: string, index: number) => {
  const step = props.state.chain.steps.find((s) => s.id === stepId);
  if (!step) return;
  const extractions = [...step.variableExtractions];
  extractions.splice(index, 1);
  props.state.updateChainStep(stepId, {variableExtractions: extractions});
};

/** 状态颜色 */
const statusColor = (stepId: string): string => {
  const r = stepResult(stepId);
  if (!r) return "pending";
  return r.success ? "success" : "error";
};

/** 关闭菜单的全局点击 */
const handleGlobalClick = () => {
  if (insertMenu.value.visible) closeInsertMenu();
};

const hasSteps = computed(() => props.state.chain.steps.length > 0);
</script>

<template>
  <div class="api-chain-flow" @click="handleGlobalClick">
    <!-- 头部：标题 + 添加步骤按钮 -->
    <div class="flow-header">
      <div class="header-left">
        <ShSvgIcon name="apiFlow" size="16px"/>
        <span class="header-title">{{ i18n("api.chain.steps") }}</span>
        <span class="step-count">{{ state.chain.steps.length }}</span>
      </div>
      <el-button type="primary" plain size="small" @click.stop="handleAddStep" :disabled="state.endpoints.length === 0">
        <ShSvgIcon name="plus" size="14px"/>
        {{ i18n("api.btn.addStep") }}
      </el-button>
    </div>

    <!-- 流程图主体 -->
    <div class="flow-body">
      <!-- 起始节点 -->
      <div class="flow-start" v-if="hasSteps">
        <div class="start-node">
          <ShSvgIcon name="play" size="14px"/>
          <span>{{ i18n("api.flow.start") }}</span>
        </div>
        <div class="connector-line"/>
        <div class="insert-zone" @click.stop="showInsertMenu(state.chain.steps[0].id, 'before', $event)"
             v-if="hasSteps">
          <ShSvgIcon name="plus" size="12px"/>
        </div>
        <div class="connector-line" v-if="hasSteps"/>
      </div>

      <!-- 空状态 -->
      <div v-if="!hasSteps" class="empty-state">
        <ShSvgIcon name="apiFlow" size="48px"/>
        <p>{{ i18n("api.chain.empty") }}</p>
        <el-button type="primary" @click="handleAddStep" :disabled="state.endpoints.length === 0">
          <ShSvgIcon name="plus" size="14px"/>
          {{ i18n("api.btn.addStep") }}
        </el-button>
      </div>

      <!-- 步骤节点列表 -->
      <template v-if="hasSteps">
        <div
            v-for="(step, idx) in state.chain.steps"
            :key="step.id"
            class="step-flow-item"
            :class="[`status-${statusColor(step.id)}`, { expanded: expandedStepIds.has(step.id) }]"
        >
          <!-- 节点卡片 -->
          <div class="node-card" @click="toggleExpand(step.id)">
            <div class="node-left">
                            <span class="method-tag"
                                  :style="{ background: METHOD_COLORS[endpointMethod(step.endpointId)] }">
                                {{ METHOD_LABELS[endpointMethod(step.endpointId)] || endpointMethod(step.endpointId) }}
                            </span>
              <div class="node-info">
                <div class="node-title">
                  <span class="step-no">{{ idx + 1 }}</span>
                  <span class="step-name">{{ step.stepName }}</span>
                </div>
                <div class="node-path">{{ endpointPath(step.endpointId) }}</div>
              </div>
            </div>
            <div class="node-right">
                            <span class="status-dot" :class="`dot-${statusColor(step.id)}`" v-if="stepResult(step.id)">
                                {{ stepResult(step.id)?.response.status || "ERR" }}
                            </span>
              <el-button text size="small" :disabled="idx === 0" @click.stop="state.moveStep(step.id, -1)"
                         :title="i18n('api.btn.moveUp')">
                <ShSvgIcon name="moveUp" size="14px"/>
              </el-button>
              <el-button text size="small" :disabled="idx === state.chain.steps.length - 1"
                         @click.stop="state.moveStep(step.id, 1)" :title="i18n('api.btn.moveDown')">
                <ShSvgIcon name="moveDown" size="14px"/>
              </el-button>
              <el-button text size="small" type="danger" @click.stop="state.removeChainStep(step.id)"
                         :title="i18n('api.btn.delete')">
                <ShSvgIcon name="delete" size="14px"/>
              </el-button>
              <ShSvgIcon :name="expandedStepIds.has(step.id) ? 'arrowDown' : 'arrowRight'" size="12px"
                         class="expand-icon"/>
            </div>
          </div>

          <!-- 节点详情（展开时） -->
          <div class="node-detail" v-if="expandedStepIds.has(step.id)">
            <div class="detail-row">
              <label>{{ i18n("api.chain.stepName") }}</label>
              <el-input
                  :model-value="step.stepName"
                  style="flex: 1"
                  @click.stop
                  @change="(v) => state.updateChainStep(step.id, { stepName: String(v) })"
              />
            </div>
            <div class="detail-row">
              <label>{{ i18n("api.chain.endpoint") }}</label>
              <el-select
                  :model-value="step.endpointId"
                  style="flex: 1"
                  @click.stop
                  @change="(v) => state.updateChainStep(step.id, { endpointId: String(v) })"
              >
                <el-option
                    v-for="ep in state.endpoints"
                    :key="ep.id"
                    :label="`${ep.method} ${ep.name} (${ep.url})`"
                    :value="ep.id"
                />
              </el-select>
            </div>

            <div class="detail-section">
              <div class="section-label">
                <ShSvgIcon name="variable" size="12px"/>
                {{ i18n("api.chain.variableExtractions") }}
              </div>
              <div
                  v-for="(ext, eIdx) in step.variableExtractions"
                  :key="eIdx"
                  class="ext-row"
              >
                <el-input
                    :model-value="ext.sourceVar"
                    size="small"
                    :placeholder="i18n('api.extraction.sourceVar')"
                    @click.stop
                    @change="(v) => updateExtraction(step.id, Number(eIdx), 'sourceVar', String(v))"
                />
                <ShSvgIcon name="arrowRight" size="12px"/>
                <el-input
                    :model-value="ext.targetVar"
                    size="small"
                    :placeholder="i18n('api.extraction.targetVar')"
                    @click.stop
                    @change="(v) => updateExtraction(step.id, Number(eIdx), 'targetVar', String(v))"
                />
                <el-button text size="small" type="danger" @click.stop="removeExtraction(step.id, Number(eIdx))">
                  <ShSvgIcon name="delete" size="12px"/>
                </el-button>
              </div>
              <el-button text size="small" @click.stop="addExtraction(step.id)">
                <ShSvgIcon name="plus" size="12px"/>
                {{ i18n("api.chain.addExtraction") }}
              </el-button>
            </div>

            <div class="detail-section">
              <div class="section-label">
                <ShSvgIcon name="condition" size="12px"/>
                {{ i18n("api.chain.condition") }}
              </div>
              <el-input
                  :model-value="step.condition"
                  size="small"
                  placeholder='e.g. token != null'
                  @click.stop
                  @change="(v) => state.updateChainStep(step.id, { condition: String(v) })"
              />
            </div>

            <!-- 测试结果 -->
            <div class="detail-section" v-if="stepResult(step.id)">
              <div class="section-label">
                <ShSvgIcon name="document" size="12px"/>
                {{ i18n("api.test.result") }}
              </div>
              <div class="result-info" :class="{ 'result-error': !stepResult(step.id)?.success }">
                <span>Status: {{ stepResult(step.id)?.response.status }}</span>
                <span>Duration: {{ stepResult(step.id)?.response.duration }}ms</span>
                <span v-if="!stepResult(step.id)?.success" class="error-msg">{{ stepResult(step.id)?.error }}</span>
              </div>
            </div>
          </div>

          <!-- 连接器（节点间） -->
          <div class="node-connector" v-if="idx < state.chain.steps.length - 1">
            <div class="connector-line"/>
            <div class="insert-zone" @click.stop="showInsertMenu(state.chain.steps[idx + 1].id, 'before', $event)">
              <ShSvgIcon name="plus" size="12px"/>
            </div>
            <div class="connector-line"/>
          </div>
        </div>
      </template>

      <!-- 结束节点 -->
      <div class="flow-end" v-if="hasSteps">
        <div class="connector-line"/>
        <div class="insert-zone"
             @click.stop="showInsertMenu(state.chain.steps[state.chain.steps.length - 1].id, 'after', $event)">
          <ShSvgIcon name="plus" size="12px"/>
        </div>
        <div class="connector-line"/>
        <div class="end-node">
          <ShSvgIcon name="stop" size="14px"/>
          <span>{{ i18n("api.flow.end") }}</span>
        </div>
      </div>
    </div>

    <!-- 插入步骤菜单 -->
    <div
        v-if="insertMenu.visible"
        class="insert-menu"
        :style="{ left: '50%', transform: 'translateX(-50%)' }"
        @click.stop
    >
      <div class="insert-menu-header">
        {{ insertMenu.position === "before" ? i18n("api.chain.insertBefore") : i18n("api.chain.insertAfter") }}
      </div>
      <div class="insert-menu-list">
        <div
            v-for="ep in state.endpoints"
            :key="ep.id"
            class="insert-menu-item"
            @click="handleInsert(ep.id)"
        >
                    <span class="method-tag" :style="{ background: METHOD_COLORS[ep.method] }">
                        {{ METHOD_LABELS[ep.method] || ep.method }}
                    </span>
          <span class="ep-name">{{ ep.name }}</span>
          <span class="ep-path">{{ ep.url }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-chain-flow {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 13px;
  }

  .step-count {
    background: var(--el-color-primary);
    color: #fff;
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 10px;
    font-weight: normal;
  }
}

.flow-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);

  p {
    margin: 0;
    font-size: 13px;
  }
}

/* 起始/结束节点 */
.flow-start, .flow-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
}

.start-node, .end-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.connector-line {
  width: 2px;
  height: 16px;
  background: var(--el-border-color);
}

.insert-zone {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--el-bg-color);
  border: 2px dashed var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.15s;

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    transform: scale(1.1);
  }
}

/* 步骤节点 */
.step-flow-item {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;

  &.status-success .node-card {
    border-left: 3px solid var(--el-color-success);
  }

  &.status-error .node-card {
    border-left: 3px solid var(--el-color-danger);
  }

  &.status-pending .node-card {
    border-left: 3px solid var(--el-border-color);
  }
}

.node-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

.node-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.method-tag {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  min-width: 44px;
  text-align: center;
}

.node-info {
  flex: 1;
  min-width: 0;

  .node-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    .step-no {
      background: var(--el-fill-color-dark);
      color: var(--el-text-color-primary);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  }

  .node-path {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    font-family: "Consolas", "Monaco", monospace;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.node-right {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;

  .status-dot {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 4px;
    font-weight: 600;

    &.dot-success {
      background: var(--el-color-success-light-9);
      color: var(--el-color-success);
    }

    &.dot-error {
      background: var(--el-color-danger-light-9);
      color: var(--el-color-danger);
    }
  }

  .expand-icon {
    margin-left: 4px;
    color: var(--el-text-color-secondary);
    transition: transform 0.15s;
  }
}

.node-detail {
  padding: 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-top: none;
  border-radius: 0 0 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    width: 70px;
    flex-shrink: 0;
  }
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .section-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    font-weight: 600;
  }
}

.ext-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.result-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-family: "Consolas", "Monaco", monospace;
  padding: 6px 8px;
  background: var(--el-color-success-light-9);
  border-radius: 3px;
  color: var(--el-color-success);

  &.result-error {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }

  .error-msg {
    flex: 1;
  }
}

.node-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* 插入菜单 */
.insert-menu {
  position: fixed;
  z-index: 10000;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 320px;
  max-height: 320px;
  display: flex;
  flex-direction: column;

  .insert-menu-header {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-light);
  }

  .insert-menu-list {
    flex: 1;
    overflow: auto;
    padding: 4px 0;
  }

  .insert-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.15s;

    &:hover {
      background: var(--el-fill-color-light);
    }

    .method-tag {
      font-size: 9px;
      padding: 1px 4px;
      min-width: 36px;
    }

    .ep-name {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .ep-path {
      color: var(--el-text-color-secondary);
      font-family: "Consolas", "Monaco", monospace;
      font-size: 11px;
      margin-left: auto;
    }
  }
}
</style>
