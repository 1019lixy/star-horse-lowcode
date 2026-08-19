<script setup lang="ts" name="ApiEndpointPanel">
import { i18n } from "@/lang";
import { ShSvgIcon } from "@/components/shared";
import { METHOD_COLORS } from "../constants";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

const props = defineProps<{
  state: ApiOrchestratorState;
}>();

const handleAdd = () => props.state.addEndpoint();

const handleSelect = (id: string) => props.state.selectEndpoint(id);

const handleRemove = (id: string, e: Event) => {
  e.stopPropagation();
  props.state.removeEndpoint(id);
};
</script>

<template>
  <div class="api-endpoint-panel">
    <div class="panel-title">
      <span>{{ i18n("api.endpoint.title") }}</span>
      <el-button type="primary" plain @click="handleAdd">
        <ShSvgIcon name="plus" size="14px" />
        {{ i18n("api.btn.addEndpoint") }}
      </el-button>
    </div>
    <div class="panel-body">
      <div v-if="state.endpoints.length === 0" class="empty-tip">
        {{ i18n("api.endpoint.empty") }}
      </div>
      <div v-else class="endpoint-list">
        <div
          v-for="ep in state.endpoints"
          :key="ep.id"
          class="endpoint-item"
          :class="{ active: state.selectedEndpointId.value === ep.id }"
          @click="handleSelect(ep.id)"
          :title="i18n('api.endpoint.clickToEdit')"
        >
          <span
            class="method-badge"
            :style="{ background: METHOD_COLORS[ep.method] }"
          >
            {{ ep.method }}
          </span>
          <div class="endpoint-info">
            <div class="endpoint-name">{{ ep.name }}</div>
            <div class="endpoint-url">{{ ep.url }}</div>
          </div>
          <el-button text type="danger" @click="handleRemove(ep.id, $event)">
            <ShSvgIcon name="delete" size="14px" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.api-endpoint-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }

  .empty-tip {
    padding: 40px 12px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  .endpoint-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .endpoint-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--el-fill-color);
    }

    &.active {
      background: var(--el-color-primary-light-8);
      box-shadow: inset 2px 0 0 var(--el-color-primary);
    }

    .method-badge {
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 4px;
      border-radius: 3px;
      flex-shrink: 0;
      min-width: 38px;
      text-align: center;
    }

    .endpoint-info {
      flex: 1;
      overflow: hidden;

      .endpoint-name {
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .endpoint-url {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: "Consolas", "Monaco", monospace;
      }
    }
  }
}
</style>
