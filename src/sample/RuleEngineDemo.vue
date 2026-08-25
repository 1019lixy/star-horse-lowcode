<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import { StarHorseForm } from "@/components/comp";
import { PageFieldInfo } from "@/components/types/PageFieldInfo";
import {
  injectRuleCache,
  clearRuleCache,
  configureRuleEngine,
} from "@/components/formcomp/utils/ItemRuleEventUtils";
import { postRequest, getRequest } from "@/api/star_horse_apis";
import { allFlows } from "./demo-rule-flows";

defineOptions({ name: "RuleEngineDemo" });

// ==================== 规则引擎配置（业务层注入） ====================
// 核心库无状态，所有后端交互由业务层配置
configureRuleEngine({
  // 规则拉取：后端单接口返回 FormRulesRespDto，此处按 triggerEvent 分组为核心库缓存格式
  fetchRulesHandler: async (formId: string) => {
    const res = await postRequest(
      `/userdb-manage/userdb/ruleEngine/fetchRules/${formId}`,
      {},
    );
    const data = res?.data?.data;
    const rules: any[] = data?.rules || [];
    const grouped: Record<string, string[]> = {};
    for (const item of rules) {
      if (!item?.triggerEvent || !item?.flowContent) continue;
      if (!grouped[item.triggerEvent]) grouped[item.triggerEvent] = [];
      grouped[item.triggerEvent].push(item.flowContent);
    }
    return grouped;
  },
  // http-call 节点的 HTTP 调用
  httpCallHandler: async (url: string, method: string, body: any) => {
    if (method.toUpperCase() === "GET") {
      const res = await getRequest(url);
      return res?.data?.data ?? res?.data;
    }
    const res = await postRequest(url, body);
    return res?.data?.data ?? res?.data;
  },
});

// ==================== 日志面板 ====================
interface LogEntry {
  time: string;
  event: string;
  detail: string;
}
const logs = reactive<LogEntry[]>([]);
const addLog = (event: string, detail: string) => {
  const now = new Date();
  logs.unshift({
    time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`,
    event,
    detail,
  });
};
const clearLogs = () => logs.splice(0, logs.length);

// ==================== 规则模式切换 ====================
const DEMO_FORM_ID = "demo_rule_form_001";

/** false=本地注入模式（离线），true=后端拉取模式（在线） */
const backendMode = ref(false);

const setupRuleCache = () => {
  if (backendMode.value) {
    addLog("INIT", `后端模式：将从后端拉取规则定义 formId=${DEMO_FORM_ID}`);
    return;
  }
  const rules: Record<string, string[]> = {
    ON_LOAD: [
      JSON.stringify(allFlows.onLoadCustomerType),
      JSON.stringify(allFlows.onLoadVipDiscount),
      JSON.stringify(allFlows.onLoadRemark),
      JSON.stringify(allFlows.onLoadCitySearch),
    ],
    ON_CHANGE: [
      JSON.stringify(allFlows.onChangeCustomerType),
      JSON.stringify(allFlows.onChangeVipDiscount),
      JSON.stringify(allFlows.onChangeRemarkReadonly),
      JSON.stringify(allFlows.onChangeCitySearch),
    ],
    ON_BUTTON_CLICK: [
      JSON.stringify(allFlows.onSubmitBtn),
      JSON.stringify(allFlows.onResetBtn),
    ],
  };
  injectRuleCache(DEMO_FORM_ID, rules);
  addLog("INIT", "本地注入模式：规则缓存已注入（离线，零网络开销）");
};

const teardownRuleCache = () => {
  clearRuleCache(DEMO_FORM_ID);
};

const switchMode = (val: boolean) => {
  clearRuleCache(DEMO_FORM_ID);
  backendMode.value = val;
  setupRuleCache();
};

// ==================== 表单字段定义 ====================
const RULE_CONFIG = {
  formId: DEMO_FORM_ID,
};

const DATA_RELATION = {
  actionName: "change",
  relationDetails: [],
};

const fieldList = ref<PageFieldInfo>({
  fieldList: [
    {
      label: "客户类型",
      fieldName: "customerType",
      type: "radio",
      preps: {
        values: [
          { name: "个人", value: "personal" },
          { name: "企业", value: "enterprise" },
        ],
        required: true,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "企业名称",
      fieldName: "companyName",
      type: "input",
      preps: {
        placeholder: "请输入企业名称",
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "统一社会信用代码",
      fieldName: "creditCode",
      type: "input",
      preps: {
        placeholder: "请输入统一社会信用代码",
        maxLength: 18,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "身份证号",
      fieldName: "idCard",
      type: "input",
      preps: {
        placeholder: "请输入身份证号",
        maxLength: 18,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "是否VIP",
      fieldName: "isVip",
      type: "switch",
      preps: {
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "折扣率",
      fieldName: "discount",
      type: "number",
      preps: {
        placeholder: "请输入折扣率",
        min: 0,
        max: 1,
        precision: 2,
        disabled: true,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "备注",
      fieldName: "remark",
      type: "textarea",
      preps: {
        placeholder: "请输入备注",
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "搜索关键词",
      fieldName: "keyword",
      type: "input",
      preps: {
        placeholder: "输入关键词搜索城市",
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "城市",
      fieldName: "citySelect",
      type: "select",
      preps: {
        placeholder: "请选择城市",
        options: [],
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "审批结果",
      fieldName: "auditResult",
      type: "input",
      preps: {
        placeholder: "审批结果",
        disabled: true,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "审批状态",
      fieldName: "auditStatus",
      type: "input",
      preps: {
        placeholder: "审批状态",
        disabled: true,
        ruleEngineConfig: { ...RULE_CONFIG },
        dataRelation: { ...DATA_RELATION },
      },
    },
    {
      label: "提交审批",
      fieldName: "submitBtn",
      type: "button",
      preps: {
        ruleEngineConfig: { ...RULE_CONFIG },
      },
    },
    {
      label: "重置",
      fieldName: "resetBtn",
      type: "button",
      preps: {
        ruleEngineConfig: { ...RULE_CONFIG },
      },
    },
  ],
});

// ==================== 生命周期 ====================
onMounted(() => {
  setupRuleCache();
});

onBeforeUnmount(() => {
  teardownRuleCache();
});

// ==================== 手动触发测试 ====================
const formRef = ref<any>(null);
const triggerOnLoad = () => {
  addLog("MANUAL", "手动触发 ON_LOAD（重新挂载表单）");
  if (formRef.value) {
    const formData = formRef.value.getFormData();
    addLog("DEBUG", `当前 formData: ${JSON.stringify(formData.value)}`);
  }
};
</script>

<template>
  <div class="rule-engine-demo">
    <div class="demo-header">
      <h2>规则引擎验证 Demo</h2>
      <p class="demo-desc">
        验证规则引擎三种触发模式：ON_LOAD（加载）、ON_CHANGE（变更）、ON_BUTTON_CLICK（按钮点击）。
        规则引擎前端本地执行，加载时拉取规则定义并缓存，字段变更时零网络开销本地执行。
      </p>
      <div class="mode-switch">
        {{ backendMode }}
        <el-radio-group v-model="backendMode" @change="switchMode">
          <el-radio-button :value="false">本地注入（离线）</el-radio-button>
          <el-radio-button :value="true">后端拉取（在线）</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="demo-body">
      <!-- 左侧：表单 -->
      <div class="demo-form-panel">
        <div class="panel-title">表单区域</div>
        <div class="form-wrapper">
          <star-horse-form
            ref="formRef"
            :field-list="fieldList"
            :preview="true"
            form-size="default"
          />
        </div>
      </div>

      <!-- 右侧：日志面板 -->
      <div class="demo-log-panel">
        <div class="panel-title">
          <span>规则执行日志</span>
          <el-button size="small" link @click="clearLogs">清空</el-button>
        </div>
        <div class="log-list">
          <div v-if="logs.length === 0" class="log-empty">
            暂无日志，修改表单字段或点击按钮触发规则
          </div>
          <div v-for="(log, idx) in logs" :key="idx" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <el-tag
              size="small"
              :type="
                log.event === 'ON_LOAD'
                  ? 'info'
                  : log.event === 'ON_CHANGE'
                    ? 'warning'
                    : log.event === 'ON_BUTTON_CLICK'
                      ? 'danger'
                      : log.event === 'INIT'
                        ? 'success'
                        : ''
              "
              >{{ log.event }}</el-tag
            >
            <div class="log-detail">{{ log.detail }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部：说明 -->
    <div class="demo-footer">
      <div class="footer-section">
        <h3>触发模式说明</h3>
        <ul>
          <li>
            <strong>ON_LOAD</strong
            >：表单加载时从后端拉取规则定义并缓存，执行初始化规则
          </li>
          <li>
            <strong>ON_CHANGE</strong>：字段变更时本地执行缓存规则，零网络开销
          </li>
          <li><strong>ON_BUTTON_CLICK</strong>：按钮点击时本地执行缓存规则</li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>验证场景</h3>
        <ul>
          <li>
            切换<strong>客户类型</strong>：企业名称/身份证号显隐切换 + 必填切换
          </li>
          <li>切换<strong>是否VIP</strong>：折扣率禁用/启用 + 值赋值(0.8/1)</li>
          <li>企业客户时<strong>备注</strong>只读</li>
          <li>点击<strong>提交审批</strong>：审批结果/状态赋值 + 备注只读</li>
          <li>点击<strong>重置</strong>：清空审批结果/状态 + 备注可编辑</li>
        </ul>
      </div>
      <div class="footer-section">
        <h3>架构优势</h3>
        <ul>
          <li>规则加载一次，缓存到内存</li>
          <li>字段变更时本地执行，不调后端</li>
          <li>支持多用户并发，无后端瓶颈</li>
          <li>SET_VALUE 只写 formData，不覆盖字段选项</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rule-engine-demo {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  overflow: hidden;
}

.demo-header {
  margin-bottom: 12px;
  h2 {
    margin: 0 0 4px 0;
    font-size: 18px;
  }
  .demo-desc {
    margin: 0;
    font-size: 13px;
    color: #909399;
    line-height: 1.5;
  }
  .mode-switch {
    margin-top: 8px;
  }
}

.demo-body {
  display: flex;
  gap: 12px;
  flex: 1;
  min-height: 0;
}

.demo-form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.demo-log-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.panel-title {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-wrapper {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.log-list {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.log-empty {
  text-align: center;
  color: #c0c4cc;
  font-size: 13px;
  padding: 40px 0;
}

.log-item {
  padding: 6px 8px;
  margin-bottom: 6px;
  border-radius: 4px;
  background: #f9fafc;
  font-size: 12px;
  .log-time {
    color: #909399;
    margin-right: 8px;
    font-family: monospace;
  }
  .log-detail {
    margin-top: 4px;
    color: #606266;
    word-break: break-all;
    white-space: pre-wrap;
    font-family: monospace;
    max-height: 120px;
    overflow: auto;
  }
}

.demo-footer {
  margin-top: 12px;
  display: flex;
  gap: 16px;
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
}

.footer-section {
  flex: 1;
  h3 {
    margin: 0 0 6px 0;
    font-size: 13px;
  }
  ul {
    margin: 0;
    padding-left: 16px;
    li {
      font-size: 12px;
      color: #606266;
      line-height: 1.6;
    }
  }
}
</style>
