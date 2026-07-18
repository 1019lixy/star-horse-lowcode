<script setup lang="ts" name="EtlToolbar">
import { i18n } from "@/lang";
import type { EtlDesignerState } from "../composables/useEtlDesigner";
import type { EtlExecutor } from "../composables/useEtlExecutor";

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
            <el-button  @click="handlePreview" :disabled="designer.state.nodes.length === 0">
                <el-icon><View/></el-icon>
                {{ i18n("etl.btn.preview") }}
            </el-button>
            <el-button

                type="danger"
                @click="handleStop"
                v-if="executor.isRunning.value"
            >
                <el-icon><SwitchButton/></el-icon>
                {{ i18n("etl.btn.stop") }}
            </el-button>
            <el-button

                type="primary"
                @click="handleRun"
                :disabled="designer.state.nodes.length === 0 || executor.isRunning.value"
                v-else
            >
                <el-icon><VideoPlay/></el-icon>
                {{ i18n("etl.btn.run") }}
            </el-button>
            <el-button  @click="handleSave">
                <el-icon><Check/></el-icon>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { View, SwitchButton, VideoPlay, Check } from "@element-plus/icons-vue";
export default { components: { View, SwitchButton, VideoPlay, Check } };
</script>

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
</style>
