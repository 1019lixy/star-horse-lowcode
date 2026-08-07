<script setup lang="ts" name="ApiChainPanel">
import ApiChainSequence from "./ApiChainSequence.vue";
import type {ApiOrchestratorState} from "../composables/useApiOrchestrator";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();
</script>

<template>
  <div class="api-chain-panel">
    <!-- 流程图占满整个中间区域 -->
    <ApiChainSequence :state="state"/>
  </div>
</template>

<style lang="scss" scoped>
.api-chain-panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  position: relative;
}
</style>
