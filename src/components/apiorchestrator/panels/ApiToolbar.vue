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
</script>

<template>
    <div class="api-toolbar">
        <div class="left-group">
            <el-input
                v-model="state.chain.name"

                style="width: 240px"
                :placeholder="i18n('api.chain.namePlaceholder')"
            />
            <el-tag v-if="state.isRunning.value" type="warning"  effect="light">
                {{ i18n("api.status.running") }}
            </el-tag>
        </div>
        <div class="right-group">
            <el-button

                type="danger"
                @click="handleStop"
                v-if="state.isRunning.value"
            >
                <el-icon><SwitchButton/></el-icon>
                {{ i18n("api.btn.stop") }}
            </el-button>
            <el-button

                type="primary"
                @click="handleRun"
                :disabled="state.chain.steps.length === 0 || state.isRunning.value"
                v-else
            >
                <el-icon><VideoPlay/></el-icon>
                {{ i18n("api.btn.run") }}
            </el-button>
            <el-button  @click="handleSave">
                <el-icon><Check/></el-icon>
                {{ i18n("api.btn.save") }}
            </el-button>
            <el-button

                @click="handleClear"
                :disabled="state.testResults.value.length === 0"
            >
                <el-icon><Delete/></el-icon>
                {{ i18n("api.btn.clear") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { SwitchButton, VideoPlay, Check, Delete } from "@element-plus/icons-vue";
export default { components: { SwitchButton, VideoPlay, Check, Delete } };
</script>

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
</style>
