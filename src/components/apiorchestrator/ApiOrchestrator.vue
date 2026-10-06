<script setup lang="ts" name="ApiOrchestrator">
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { DesignerMobileShell } from "@/components/shared";
import { useApiOrchestrator } from "./composables/useApiOrchestrator";
import { SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS } from "./constants";
import ApiToolbar from "./panels/ApiToolbar.vue";
import ApiEndpointPanel from "./panels/ApiEndpointPanel.vue";
import ApiChainPanel from "./panels/ApiChainPanel.vue";
import ApiRightPanel from "./panels/ApiRightPanel.vue";
import type { ApiChain, MockResponse } from "./types";
import type { ApiSourceConfigModel } from "@/components/system/ApiSourceConfig/types";

const props = defineProps<{
  endpoints?: ApiSourceConfigModel[];
  mocks?: MockResponse[];
  chain?: Partial<ApiChain>;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (
    e: "save",
    data: {
      endpoints: ApiSourceConfigModel[];
      mocks: MockResponse[];
      chain: ApiChain;
    },
  ): void;
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
    <DesignerMobileShell
      :panels="[
        { key: 'endpoints', label: '接口', side: 'left', width: 240, min: 200 },
        { key: 'right', label: '详情', side: 'right', width: 400, min: 300 },
      ]"
      canvas-label="编辑"
    >
      <template #toolbar>
        <api-toolbar :state="state" @save="handleSave" />
      </template>
      <template #canvas>
        <api-chain-panel :state="state" />
      </template>
      <template #panel-endpoints>
        <api-endpoint-panel :state="state" />
      </template>
      <template #panel-right>
        <api-right-panel :state="state" />
      </template>
    </DesignerMobileShell>
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
}
</style>
