<script setup lang="ts" name="ApiMockPanel">
import ApiMockConfig from "./ApiMockConfig.vue";
import ApiTestResults from "./ApiTestResults.vue";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

defineProps<{
    state: ApiOrchestratorState;
}>();
</script>

<template>
    <div class="api-mock-panel">
        <div class="panel-section top-section">
            <ApiMockConfig :state="state" />
        </div>
        <div class="panel-section bottom-section">
            <ApiTestResults :state="state" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.api-mock-panel {
    width: 360px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-left: 1px solid var(--el-border-color);
    background: var(--el-bg-color);

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
