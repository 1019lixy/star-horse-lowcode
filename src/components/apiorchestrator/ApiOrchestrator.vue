<script setup lang="ts" name="ApiOrchestrator">
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { useApiOrchestrator } from "./composables/useApiOrchestrator";
import { SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS } from "./constants";
import ApiToolbar from "./panels/ApiToolbar.vue";
import ApiEndpointPanel from "./panels/ApiEndpointPanel.vue";
import ApiChainPanel from "./panels/ApiChainPanel.vue";
import ApiRightPanel from "./panels/ApiRightPanel.vue";
import type { ApiChain, ApiEndpoint, MockResponse } from "./types";

const props = defineProps<{
    endpoints?: ApiEndpoint[];
    mocks?: MockResponse[];
    chain?: Partial<ApiChain>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "save", data: {
        endpoints: ApiEndpoint[];
        mocks: MockResponse[];
        chain: ApiChain;
    }): void;
}>();

const state = useApiOrchestrator(
    props.endpoints ?? SAMPLE_ENDPOINTS,
    props.mocks ?? SAMPLE_MOCKS,
    props.chain ?? SAMPLE_CHAIN,
);

const handleSave = () => {
    const data = state.getData();
    emits("save", data);
    ElMessage.success(i18n("api.message.saved"));
};

</script>

<template>
    <div class="api-orchestrator">
        <api-toolbar :state="state" @save="handleSave" />
        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="240px" min="180px" max="380px">
                <api-endpoint-panel :state="state" />
            </el-splitter-panel>
            <el-splitter-panel>
                <api-chain-panel :state="state" />
            </el-splitter-panel>
            <el-splitter-panel size="400px" min="300px" max="600px">
                <api-right-panel :state="state" />
            </el-splitter-panel>
        </el-splitter>
    </div>
</template>

<style lang="scss" scoped>
.api-orchestrator {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .designer-body {
        flex: 1;
        overflow: hidden;
        min-height: 0;
    }
}</style>
