<script setup lang="ts" name="ApiChainInputs">
/**
 * API 编排 - 入口参数
 * 编辑 chain.inputs：作为整条链运行时的基线变量，供接口 {{变量}} 插值、
 * dynamic 参数绑定与条件求值消费。
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import { CHAIN_INPUT_TYPES } from "../constants";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";
import type { ChainInput } from "../types";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

/** 兼容旧数据：确保 inputs 数组存在 */
if (!props.state.chain.inputs) props.state.chain.inputs = [];

const inputs = computed<ChainInput[]>(() => props.state.chain.inputs ?? []);

const addInput = () => {
  props.state.addChainInput({ name: "" });
};

const patch = (id: string, updates: Partial<ChainInput>) =>
  props.state.updateChainInput(id, updates);
</script>

<template>
  <div class="api-chain-inputs">
    <div class="section-title">
      <span>{{ i18n("api.inputs.title") }}</span>
      <el-button type="primary" plain size="small" @click="addInput">
        <ShSvgIcon name="plus" size="14px" />
        {{ i18n("api.inputs.add") }}
      </el-button>
    </div>
    <div class="inputs-body">
      <p class="inputs-desc">{{ i18n("api.inputs.desc") }}</p>

      <div v-if="!inputs.length" class="inputs-empty">
        {{ i18n("api.inputs.empty") }}
      </div>

      <div v-for="inp in inputs" :key="inp.id" class="input-card">
        <div class="input-row">
          <el-input
            :model-value="inp.name"
            size="small"
            :placeholder="i18n('api.inputs.name')"
            @change="(v) => patch(inp.id, { name: String(v) })"
          />
          <el-select
            :model-value="inp.type"
            size="small"
            style="width: 110px"
            @change="(v) => patch(inp.id, { type: v as ChainInput['type'] })"
          >
            <el-option
              v-for="t in CHAIN_INPUT_TYPES"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
          <el-tooltip :content="i18n('api.inputs.required')" placement="top">
            <el-checkbox
              :model-value="inp.required"
              @change="(v) => patch(inp.id, { required: Boolean(v) })"
            >
              {{ i18n("api.inputs.requiredShort") }}
            </el-checkbox>
          </el-tooltip>
          <el-button
            text
            size="small"
            type="danger"
            :title="i18n('api.btn.delete')"
            @click="state.removeChainInput(inp.id)"
          >
            <ShSvgIcon name="delete" size="14px" />
          </el-button>
        </div>
        <div class="input-row">
          <el-input
            :model-value="inp.defaultValue"
            size="small"
            :placeholder="i18n('api.inputs.defaultValue')"
            @change="(v) => patch(inp.id, { defaultValue: String(v) })"
          />
          <el-input
            :model-value="inp.description ?? ''"
            size="small"
            :placeholder="i18n('api.inputs.description')"
            @change="(v) => patch(inp.id, { description: String(v) })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-chain-inputs {
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
    flex-shrink: 0;
  }

  .inputs-body {
    flex: 1;
    overflow: auto;
    padding: 8px 12px;
  }

  .inputs-desc {
    margin: 0 0 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
  }

  .inputs-empty {
    padding: 24px 12px;
    text-align: center;
    font-size: 13px;
    color: var(--el-text-color-placeholder);
  }

  .input-card {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    padding: 8px;
    margin-bottom: 8px;
    background: var(--el-bg-color);

    .input-row {
      display: flex;
      align-items: center;
      gap: 6px;

      & + .input-row {
        margin-top: 6px;
      }

      :deep(.el-input) {
        flex: 1;
        min-width: 0;
      }
    }
  }
}
</style>
