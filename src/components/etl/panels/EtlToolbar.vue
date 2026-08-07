<script setup lang="ts" name="EtlToolbar">
import {i18n} from "@/lang";
import type {EtlDesignerState} from "../composables/useEtlDesigner";
import type {EtlExecutor} from "../composables/useEtlExecutor";

const props = defineProps<{
  designer: EtlDesignerState;
  executor: EtlExecutor;
}>();

const emit = defineEmits<{
  (e: "preview"): void;
  (e: "save"): void;
}>();

const handleRun = () => {
  props.executor.execute(props.designer.state);
};

const handleStop = () => {
  props.executor.stop();
};

const handlePreview = () => emit("preview");
const handleSave = () => emit("save");

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  switchButton: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
  videoPlay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>',
};
</script>

<template>
  <div class="etl-toolbar">
    <div class="left-group">
      <el-input
          v-model="designer.state.name"

          style="width: 200px"
          :placeholder="i18n('etl.pipeline.namePlaceholder')"
      />
    </div>
    <div class="right-group">
      <el-button @click="handlePreview" :disabled="designer.state.nodes.length === 0">
        <span class="svg-icon" v-html="icons.view"></span>
        {{ i18n("etl.btn.preview") }}
      </el-button>
      <el-button

          type="danger"
          @click="handleStop"
          v-if="executor.isRunning.value"
      >
        <span class="svg-icon" v-html="icons.switchButton"></span>
        {{ i18n("etl.btn.stop") }}
      </el-button>
      <el-button

          type="primary"
          @click="handleRun"
          :disabled="designer.state.nodes.length === 0 || executor.isRunning.value"
          v-else
      >
        <span class="svg-icon" v-html="icons.videoPlay"></span>
        {{ i18n("etl.btn.run") }}
      </el-button>
      <el-button @click="handleSave">
        <span class="svg-icon" v-html="icons.check"></span>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.etl-toolbar {
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
