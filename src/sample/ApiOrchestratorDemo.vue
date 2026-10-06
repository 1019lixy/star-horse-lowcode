<script setup lang="ts">
/**
 * API 编排器测试页面
 *
 * 三个 Tab 演示本次改造的全部能力：
 * 1. 编排器 UI —— ApiOrchestrator 组件，可视化编排 + 接口配置弹窗（用新组件 StarHorseApiSourceConfig）
 * 2. 接口配置组件 —— StarHorseApiSourceConfig 独立演示，简版/完整版一键切换
 * 3. 编程式调用 —— useApiOrchestrator + runChain({ mode, inputs })，演示 mock/real 模式与外部传参
 */
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import type {
  ApiChain,
  ApiTestResult,
  MockResponse,
} from "@/components/apiorchestrator";
import {
  ApiOrchestrator,
  SAMPLE_CHAIN,
  SAMPLE_ENDPOINTS,
  SAMPLE_MOCKS,
  useApiOrchestrator,
} from "@/components/apiorchestrator";
import {StarHorseApiSourceConfig} from "@/components/system/ApiSourceConfig";
import type {
  ApiSourceConfigModel,
  ApiSourceSchemaOptions,
} from "@/components/system/ApiSourceConfig";

const activeTab = ref<"ui" | "config" | "prog">("ui");

// ── Tab1: 编排器 UI ──
const handleSave = (data: {
  endpoints: ApiSourceConfigModel[];
  mocks: MockResponse[];
  chain: ApiChain;
}) => {
  console.log("API orchestrator saved:", data);
  ElMessage.success(
    `编排已保存：${data.chain.name}（${data.endpoints.length} 接口 / ${data.chain.steps.length} 步骤）`,
  );
};

// ── Tab2: 接口配置组件演示 ──
const cfgVisible = ref(false);
const cfgSimple = ref(true);
const cfgRef = ref<any>(null);
const cfgModel = ref<ApiSourceConfigModel>({});
/** 用一个示例 endpoint 灌入配置表单 */
const sampleEndpoint = computed(() => SAMPLE_ENDPOINTS[1]);
const cfgOptions = computed<ApiSourceSchemaOptions>(() => ({
  mode: "linkage",
  formFields: [
    { name: "username", value: "username" },
    { name: "password", value: "password" },
    { name: "token", value: "token" },
    { name: "userId", value: "userId" },
  ],
  showMeta: true,
  apiValidUrl: "",
  simple: cfgSimple.value,
}));
const openCfg = () => {
  // v-model 双向绑定：赋值后组件挂载/监听自动灌入，无需 setTimeout 等待表单就绪
  cfgModel.value = {
    ...sampleEndpoint.value,
    fieldMappings: [{sourceField: "list.0.id", distField: "userId", typeConvert: "number"}],
  };
  cfgVisible.value = true;
};
const submitCfg = () => {
  const r = cfgRef.value;
  if (!r || typeof r.getFormData !== "function") return;
  const model = r.getFormData() as ApiSourceConfigModel;
  console.log("接口配置提交:", model);
  ElMessage.success(
    `已提交：${model.apiInfo?.httpMethod} ${model.apiInfo?.url}（提取 ${(model.fieldMappings ?? []).length} 个变量）`,
  );
  cfgVisible.value = false;
};

// ── Tab3: 编程式调用演示 ──
const progState = useApiOrchestrator(
  SAMPLE_ENDPOINTS,
  SAMPLE_MOCKS,
  SAMPLE_CHAIN,
);
const progRunning = computed(() => progState.isRunning.value);
const progResults = computed<ApiTestResult[]>(() => progState.testResults.value);
/** 外部传入参数（覆盖入口参数默认值） */
const externalInputs = ref("{\n  \"username\": \"admin\",\n  \"password\": \"123456\"\n}");
const parseInputs = (): Record<string, any> | null => {
  try {
    return JSON.parse(externalInputs.value);
  } catch {
    ElMessage.error("外部传入参数 JSON 解析失败");
    return null;
  }
};
const runMock = async () => {
  const ok = await progState.runChain({ mode: "mock" });
  ElMessage[ok ? "success" : "error"](`Mock 模式运行${ok ? "成功" : "失败"}`);
};
const runMockWithInputs = async () => {
  const inputs = parseInputs();
  if (!inputs) return;
  const ok = await progState.runChain({ mode: "mock", inputs });
  ElMessage[ok ? "success" : "error"](
    `Mock+外部传参运行${ok ? "成功" : "失败"}（传入 ${Object.keys(inputs).length} 个参数）`,
  );
};
const runReal = async () => {
  const ok = await progState.runChain({ mode: "real" });
  ElMessage[ok ? "success" : "error"](`Real 模式运行${ok ? "成功" : "失败"}`);
};
const runRealWithInputs = async () => {
  const inputs = parseInputs();
  if (!inputs) return;
  const ok = await progState.runChain({ mode: "real", inputs });
  ElMessage[ok ? "success" : "error"](
    `Real+外部传参运行${ok ? "成功" : "失败"}（传入 ${Object.keys(inputs).length} 个参数）`,
  );
};
const stopRun = () => progState.stop();
const resultStatus = (r: ApiTestResult) =>
  r.success ? "success" : "error";
</script>

<template>
  <div class="demo-container">
    <h3>API 编排器 ApiOrchestrator</h3>
    <p>
      可视化 API 调用链设计器。本次改造：接口配置改用
      <code>StarHorseApiSourceConfig</code>（弹窗模式，精简字段），执行器支持
      <code>runChain({ mode, inputs })</code>（mock/real 模式 + 外部传参），参数传递支持全局参数与上游结果抓取作为后续所有接口入参。
    </p>

    <el-tabs v-model="activeTab" type="border-card" class="demo-tabs">
      <!-- Tab1: 编排器 UI -->
      <el-tab-pane label="编排器 UI" name="ui">
        <div class="designer-wrapper">
          <ApiOrchestrator
            :endpoints="SAMPLE_ENDPOINTS"
            :mocks="SAMPLE_MOCKS"
            :chain="SAMPLE_CHAIN"
            @save="handleSave"
          />
        </div>
      </el-tab-pane>

      <!-- Tab2: 接口配置组件演示 -->
      <el-tab-pane label="接口配置组件" name="config">
        <div class="config-demo">
          <div class="config-toolbar">
            <el-form-item label="简版模式">
              <el-switch v-model="cfgSimple" />
              <span class="config-hint">
                {{ cfgSimple ? "只配接口地址 + 请求方式" : "完整配置（代理/入参/出参/解析/映射）" }}
              </span>
            </el-form-item>
            <el-button type="primary" @click="openCfg">
              打开接口配置弹窗
            </el-button>
          </div>
          <div class="config-info">
            <p>
              简版模式下弹窗只显示 <code>httpMethod</code> 与 <code>url</code>，右上角「高级配置」按钮可一键展开完整版（已填数据保留），再点「简版配置」切回。
            </p>
            <p>
              完整版配置：代理开关 / 接口类型 / 请求头 / 请求参数（dynamic 绑定变量）/ 返回解析（codePath/dataPath/successCode）/ 出参映射（响应字段 → 运行时变量）。
            </p>
          </div>
        </div>

        <el-dialog
          v-model="cfgVisible"
          :title="i18n('api.endpoint.editor')"
          width="960px"
          top="6vh"
          append-to-body
        >
          <div class="cfg-dialog-body">
            <star-horse-api-source-config
              ref="cfgRef"
              v-model="cfgModel"
              :options="cfgOptions"

            />
          </div>
          <template #footer>
            <el-button @click="cfgVisible = false">
              {{ i18n("api.btn.cancel") }}
            </el-button>
            <el-button type="primary" @click="submitCfg">
              {{ i18n("api.btn.confirm") }}
            </el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- Tab3: 编程式调用演示 -->
      <el-tab-pane label="编程式调用" name="prog">
        <div class="prog-demo">
          <div class="prog-section">
            <div class="prog-label">外部传入参数（JSON，覆盖入口参数默认值）</div>
            <el-input
              v-model="externalInputs"
              type="textarea"
              :rows="4"
              class="prog-inputs"
            />
          </div>
          <div class="prog-actions">
            <el-button :loading="progRunning" @click="runMock">
              Mock 运行
            </el-button>
            <el-button :loading="progRunning" type="primary" @click="runMockWithInputs">
              Mock + 外部传参
            </el-button>
            <el-divider direction="vertical" />
            <el-button :loading="progRunning" @click="runReal">
              Real 运行（真实 HTTP）
            </el-button>
            <el-button :loading="progRunning" type="primary" @click="runRealWithInputs">
              Real + 外部传参
            </el-button>
            <el-divider direction="vertical" />
            <el-button :disabled="!progRunning" type="danger" @click="stopRun">
              停止
            </el-button>
          </div>
          <div class="prog-results" v-if="progResults.length">
            <div class="prog-results-title">
              运行结果（{{ progResults.length }} 步）
            </div>
            <div
              v-for="r in progResults"
              :key="r.stepId"
              class="prog-result-item"
              :class="`is-${resultStatus(r)}`"
            >
              <div class="result-head">
                <span class="result-status">{{ r.success ? "✓" : "✗" }}</span>
                <span class="result-name">{{ r.stepName }}</span>
                <span class="result-http">{{ r.request.method }} {{ r.response.status }}</span>
                <span class="result-duration">{{ r.response.duration }}ms</span>
              </div>
              <div class="result-error" v-if="r.error">{{ r.error }}</div>
              <div class="result-extracted" v-if="Object.keys(r.extractedVars).length">
                <span class="ext-label">提取变量:</span>
                <code>{{ JSON.stringify(r.extractedVars) }}</code>
              </div>
            </div>
          </div>
          <div class="prog-empty" v-else>
            点击上方按钮运行编排，结果将显示在此处
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
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

.demo-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.demo-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
}

.designer-wrapper {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.config-demo {
  padding: 8px;
}

.config-toolbar {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 12px;
}

.config-hint {
  margin-left: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.config-info {
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
}

.cfg-dialog-body {
  max-height: 66vh;
  overflow: auto;
}

.prog-demo {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prog-section {
  max-width: 600px;
}

.prog-label {
  font-size: 13px;
  margin-bottom: 6px;
  color: var(--el-text-color-secondary);
}

.prog-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.prog-results {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 12px;
}

.prog-results-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.prog-result-item {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  background: var(--el-fill-color-lighter);
}

.prog-result-item.is-error {
  background: var(--el-color-danger-light-9);
}

.result-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-status {
  font-weight: 700;
}

.is-success .result-status {
  color: var(--el-color-success);
}

.is-error .result-status {
  color: var(--el-color-danger);
}

.result-name {
  font-weight: 600;
}

.result-http {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-family: monospace;
}

.result-duration {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: auto;
}

.result-error {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-color-danger);
}

.result-extracted {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.ext-label {
  margin-right: 4px;
}

.prog-empty {
  padding: 24px;
  text-align: center;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}
</style>
