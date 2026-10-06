<script setup lang="ts" name="ApiRightPanel">
/**
 * API 编排 - 右侧属性面板
 *
 * 四 Tab：Mock 配置 / 入口参数 / 全局参数 / 测试结果。
 * 接口配置改为「新增/点击接口」时弹出的弹窗（见 ApiEndpointPanel），
 * 此处不再内嵌接口编辑页签。
 */
import { ref } from "vue";
import { i18n } from "@/lang";
import ApiChainInputs from "./ApiChainInputs.vue";
import ApiGlobalConfig from "./ApiGlobalConfig.vue";
import ApiMockConfig from "./ApiMockConfig.vue";
import ApiTestResults from "./ApiTestResults.vue";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

const activeTab = ref<"mock" | "inputs" | "global" | "test">("mock");
</script>

<template>
  <div class="api-right-panel">
    <el-tabs v-model="activeTab" type="border-card" class="right-tabs">
      <el-tab-pane :label="i18n('api.mock.title')" name="mock">
        <ApiMockConfig :state="state" />
      </el-tab-pane>
      <el-tab-pane :label="i18n('api.inputs.title')" name="inputs">
        <ApiChainInputs :state="state" />
      </el-tab-pane>
      <el-tab-pane :label="i18n('api.global.title')" name="global">
        <ApiGlobalConfig :state="state" />
      </el-tab-pane>
      <el-tab-pane :label="i18n('api.test.title')" name="test">
        <ApiTestResults :state="state" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.api-right-panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color);

  .right-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
