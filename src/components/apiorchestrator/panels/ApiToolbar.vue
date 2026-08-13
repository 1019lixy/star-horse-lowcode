<script setup lang="ts" name="ApiToolbar">
import { i18n } from "@/lang";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

const emit = defineEmits<{
  (e: "save"): void;
}>();

const handleRun = () => {
  void props.state.runChain();
};

const handleStop = () => {
  props.state.stop();
};

const handleSave = () => emit("save");

const handleClear = () => props.state.clearResults();

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  switchButton:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
  videoPlay:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>',
  delete:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>',
};
</script>

<template>
  <div class="api-toolbar">
    <div class="left-group">
      <el-input
        v-model="state.chain.name"
        style="width: 240px"
        :placeholder="i18n('api.chain.namePlaceholder')"
      />
      <el-tag v-if="state.isRunning.value" type="warning" effect="light">
        {{ i18n("api.status.running") }}
      </el-tag>
    </div>
    <div class="right-group">
      <el-button type="danger" @click="handleStop" v-if="state.isRunning.value">
        <span class="svg-icon" v-html="icons.switchButton"></span>
        {{ i18n("api.btn.stop") }}
      </el-button>
      <el-button
        type="primary"
        @click="handleRun"
        :disabled="state.chain.steps.length === 0 || state.isRunning.value"
        v-else
      >
        <span class="svg-icon" v-html="icons.videoPlay"></span>
        {{ i18n("api.btn.run") }}
      </el-button>
      <el-button @click="handleSave">
        <span class="svg-icon" v-html="icons.check"></span>
        {{ i18n("api.btn.save") }}
      </el-button>
      <el-button
        @click="handleClear"
        :disabled="state.testResults.value.length === 0"
      >
        <span class="svg-icon" v-html="icons.delete"></span>
        {{ i18n("api.btn.clear") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);

  .left-group,
  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
