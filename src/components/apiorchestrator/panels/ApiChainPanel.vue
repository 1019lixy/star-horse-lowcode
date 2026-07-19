<script setup lang="ts" name="ApiChainPanel">
import ApiEndpointEditor from "./ApiEndpointEditor.vue";
import ApiChainSequence from "./ApiChainSequence.vue";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

defineProps<{
    state: ApiOrchestratorState;
}>();
</script>

<template>
    <div class="api-chain-panel">
        <div class="panel-section top-section">
            <ApiEndpointEditor :state="state" />
        </div>
        <div class="panel-section bottom-section">
            <ApiChainSequence :state="state" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.api-chain-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;

    .panel-section {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .top-section {
        flex: 1;
        border-bottom: 1px solid var(--el-border-color);
        min-height: 0;
    }

    .bottom-section {
        flex: 1;
        min-height: 0;
    }
}
</style>
