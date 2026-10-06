<script setup lang="ts" name="ApiEndpointEditor">
/**
 * 接口配置弹窗
 * 承载 <star-horse-api-config>（与 dynamicform 接口配置逐字对齐的共享表单）。
 * 通过 v-model 控制显隐；点「确定」提交后把配置写回当前选中接口
 * （headers / 请求参数 / body 自动绑定），并把出参映射落到引用该接口的步骤，
 * 实现「上一接口结果 → 下一接口入参」。
 */
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import {success} from "@/utils/message";
import {METHOD_COLORS} from "../constants";
import StarHorsePanel from "@/components/comp/StarHorsePanel.vue";

import {StarHorseApiSourceConfig} from "@/components/system/ApiSourceConfig";
import type {ApiSourceConfigModel, ApiSourceSchemaOptions,} from "@/components/system/ApiSourceConfig/types";
import type {ApiOrchestratorState} from "../composables/useApiOrchestrator";

const props = defineProps<{
  state: ApiOrchestratorState;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const endpoint = computed(() => props.state.selectedEndpoint.value);
const apiCfgRef = ref<any>(null);

/**
 * 可用于动态绑定的运行时变量名集合：
 * 入口参数 + 全局变量 + 链累计变量 + 所有步骤的提取目标变量。
 */
const availableVars = computed<string[]>(() => {
  const names = new Set<string>();
  for (const inp of props.state.chain.inputs ?? []) {
    if (inp.name) names.add(inp.name);
  }
  const g = props.state.chain.globalConfig;
  if (g?.variables) Object.keys(g.variables).forEach((k) => names.add(k));
  if (props.state.chain.variables)
    Object.keys(props.state.chain.variables).forEach((k) => names.add(k));
  for (const s of props.state.chain.steps) {
    for (const e of s.variableExtractions) {
      if (e.targetVar) names.add(e.targetVar);
    }
  }
  return Array.from(names).sort();
});

/**
 * 传给 <star-horse-api-config> 的选项：
 * - mode='linkage'：响应 tab 出 fieldMappings 表（把响应字段传递到下游）
 * - showMeta=true：name/description 由 schema 顶部一行渲染
 * - apiValidUrl=''：关掉内置"校验接口"按钮（宿主代理地址未知）
 */
// schema 在组件 setup 时一次性创建，formFields 必须用稳定数组引用原地更新，
// 否则新增的入口参数/提取变量不会出现在绑定下拉里
const stableFormFields = ref<{name: string; value: string}[]>([]);
watch(
    availableVars,
    (names) => {
      const next = names.map((v) => ({name: v, value: v}));
      stableFormFields.value.splice(0, stableFormFields.value.length, ...next);
    },
    {immediate: true},
);

const cfgOptions = computed<ApiSourceSchemaOptions>(() => ({
  mode: "linkage",
  formFields: stableFormFields.value,
  showMeta: true,
  apiValidUrl: "",
}));

const cfgModel = ref<ApiSourceConfigModel|any>({});

/** 引用当前接口的编排步骤 */
const stepsForEndpoint = (endpointId: string) =>
    props.state.chain.steps.filter((s) => s.endpointId === endpointId);

/** 把当前 endpoint 灌入共享表单（接口对象本身就是 ApiSourceConfigModel，直接绑） */
const pushToCfg = () => {
  const ep = endpoint.value;
  if (!ep) return;
  const seen = new Set<string>();
  const mappings: ApiSourceConfigModel["fieldMappings"] = [...(ep.fieldMappings ?? [])];
  for (const s of stepsForEndpoint(ep.id ?? "")) {
    for (const e of s.variableExtractions) {
      if (!e.targetVar || seen.has(e.targetVar)) continue;
      seen.add(e.targetVar);
      mappings.push({sourceField: e.sourceVar, distField: e.targetVar, typeConvert: e.typeConvert ?? ""});
    }
  }
  // 深拷贝隔离 ep 的子表数组引用，弹窗编辑/取消不污染接口对象，提交时才写回
  cfgModel.value = JSON.parse(JSON.stringify({...ep, fieldMappings: mappings}));
};

// 弹窗打开 或 切换接口 时同步表单内容
watch(
    () => [props.modelValue, endpoint.value?.id] as const,
    ([open]) => {
      if (open) pushToCfg();
    },
    {immediate: true},
);

/** 提交：把表单数据直接写回接口对象（无桥接），出参映射落到引用步骤 */
const submit = () => {
  const ep = endpoint.value;
  if (!ep) return;
  const r = apiCfgRef.value;
  if (!r || typeof r.getFormData !== "function") return;
  const model = r.getFormData() as ApiSourceConfigModel;
  // id 由表单 schema 外部补齐，保证写回对象与新建默认结构完全一致
  props.state.updateEndpoint(ep.id ?? "", {...model, id: ep.id});
  const extractions = (model.fieldMappings ?? [])
    .filter((m) => m.sourceField && m.distField)
    .map((m) => ({
      sourceVar: m.sourceField,
      targetVar: m.distField,
      typeConvert: m.typeConvert ?? "",
    }));
  for (const s of stepsForEndpoint(ep.id ?? "")) {
    props.state.updateChainStep(s.id, {
      variableExtractions: extractions.map((e) => ({...e})),
    });
  }
  success(i18n("api.endpoint.applied"));
  visible.value = false;
};

const close = () => {
  visible.value = false;
};
</script>

<template>
  <StarHorsePanel
      v-model="visible"
      :title="i18n('api.endpoint.editor')"
      box-width="60%"
      boxHeight="80%"
      top="6vh"
      :show-close="true"
      :is-show-reset="false"
      :user-action="true"
      @merge="submit"
  >
    <div class="api-endpoint-dialog">
      <div v-if="endpoint" class="dialog-subhead">
        <span
            class="method-badge"
            :style="{ background: (METHOD_COLORS as Record<string, string>)[endpoint.apiInfo?.httpMethod] }"
        >
          {{ endpoint.apiInfo?.httpMethod }}
        </span>
        <span class="sub-name">{{ endpoint.name }}</span>
        <span class="sub-url">{{ endpoint.apiInfo?.url }}</span>
      </div>
      <div class="dialog-body">

        <StarHorseApiSourceConfig
            v-if="endpoint"
            ref="apiCfgRef"
            v-model="cfgModel"
            :options="cfgOptions"
        />
      </div>
    </div>
  </StarHorsePanel>
</template>

<style lang="scss" scoped>
.api-endpoint-dialog {
  .dialog-subhead {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    .method-badge {
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px;
      flex-shrink: 0;
    }

    .sub-name {
      font-weight: 600;
      font-size: 13px;
    }

    .sub-url {
      font-size: 11px;
      color: var(--el-text-color-placeholder);
      font-family: "Consolas", "Monaco", monospace;
    }
  }

  .dialog-body {
    max-height: 66vh;
    overflow: auto;
  }
}
</style>
