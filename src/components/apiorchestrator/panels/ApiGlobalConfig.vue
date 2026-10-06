<script setup lang="ts" name="ApiGlobalConfig">
/**
 * API 编排 - 全局参数
 * 编辑 chain.globalConfig：全局请求头 / 全局查询参数 / 全局变量，
 * 这三类参数会作用于编排链内的所有接口，并参与 {{变量}} 插值。
 */
import { computed, onMounted } from "vue";
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";
import type { GlobalConfig } from "../types";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

type SectionKey = keyof GlobalConfig;

const SECTIONS: SectionKey[] = ["headers", "query", "variables"];

const gc = computed<GlobalConfig>(() => props.state.chain.globalConfig);

// 兼容旧数据：确保三段结构存在
onMounted(() => {
  const c = props.state.chain as any;
  if (!c.globalConfig) {
    c.globalConfig = { headers: {}, query: {}, variables: {} };
  }
  for (const k of ["headers", "query", "variables"] as SectionKey[]) {
    if (!c.globalConfig[k]) c.globalConfig[k] = {};
  }
});

const entriesOf = (section: SectionKey): [string, any][] =>
  Object.entries(gc.value?.[section] ?? {});

const addRow = (section: SectionKey) => {
  const target = gc.value[section] as Record<string, any>;
  let key = i18n("api.global.newKey");
  let n = 1;
  while (key in target) key = `${i18n("api.global.newKey")}${n++}`;
  target[key] = "";
};

const updateKey = (section: SectionKey, oldKey: string, newKey: string) => {
  const target = gc.value[section] as Record<string, any>;
  if (newKey === oldKey) return;
  const val = target[oldKey];
  delete target[oldKey];
  target[newKey] = val;
};

const updateValue = (section: SectionKey, key: string, value: any) => {
  (gc.value[section] as Record<string, any>)[key] = value;
};

const removeKey = (section: SectionKey, key: string) => {
  delete (gc.value[section] as Record<string, any>)[key];
};
</script>

<template>
  <div class="api-global-config">
    <div class="section-title">{{ i18n("api.global.title") }}</div>
    <div class="global-body">
      <p class="global-desc">{{ i18n("api.global.desc") }}</p>

      <div class="group" v-for="section in SECTIONS" :key="section">
        <el-divider content-position="left">
          {{ i18n(`api.global.${section}`) }}
        </el-divider>
        <div class="hint">{{ i18n("api.endpoint.templateHint") }}</div>
        <div class="list-editor">
          <div
            v-for="([key, val], idx) in entriesOf(section)"
            :key="idx"
            class="list-row kv-row"
          >
            <el-input
              :model-value="key"
              placeholder="Key"
              @change="(v) => updateKey(section, key, String(v))"
            />
            <el-input
              :model-value="val"
              :placeholder="i18n('api.common.value')"
              @change="(v) => updateValue(section, key, String(v))"
            />
            <el-button text type="danger" @click="removeKey(section, key)">
              <ShSvgIcon name="delete" size="14px" />
            </el-button>
          </div>
          <el-button @click="addRow(section)">
            + {{ i18n("api.global.add") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-global-config {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .section-title {
    padding: 6px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-light);
    flex-shrink: 0;
  }

  .global-body {
    flex: 1;
    overflow: auto;
    padding: 8px 12px;
  }

  .global-desc {
    margin: 0 0 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
  }

  .hint {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    margin: -4px 0 6px;
  }

  .list-editor {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .list-row.kv-row {
      display: flex;
      align-items: center;
      gap: 4px;

      :deep(.el-input) {
        flex: 1;
      }
    }
  }
}
</style>
