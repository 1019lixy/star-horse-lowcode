<script setup lang="ts">
import {ElMessage} from "element-plus";
import type {ApiChain, ApiEndpoint, MockResponse} from "@/components/apiorchestrator";
import {ApiOrchestrator, SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS} from "@/components/apiorchestrator";

const handleSave = (data: {
  endpoints: ApiEndpoint[];
  mocks: MockResponse[];
  chain: ApiChain;
}) => {
  // eslint-disable-next-line no-console
  console.log("API orchestrator saved:", data);
  ElMessage.success(`编排已保存：${data.chain.name}（${data.endpoints.length} 接口 / ${data.chain.steps.length} 步骤）`);
};
</script>

<template>
  <div class="demo-container">
    <h3>API 编排器 ApiOrchestrator</h3>
    <p>可视化 API 调用链设计器，支持接口管理、Mock 响应配置、变量提取与插值、编排步骤顺序执行。预置"用户登录并查询详情"示例：登录提取
      token → 查询用户列表提取 userId → 查询用户详情，点击运行可查看每步请求/响应与提取变量。</p>
    <div class="designer-wrapper">
      <ApiOrchestrator
          :endpoints="SAMPLE_ENDPOINTS"
          :mocks="SAMPLE_MOCKS"
          :chain="SAMPLE_CHAIN"
          @save="handleSave"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demo-container h3 {
  margin: 0 0 4px;
}

.demo-container p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.designer-wrapper {
  flex: 1;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
