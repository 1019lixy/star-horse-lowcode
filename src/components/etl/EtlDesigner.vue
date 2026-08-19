<script setup lang="ts" name="EtlDesigner">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { useEtlDesigner } from "./composables/useEtlDesigner";
import { useEtlExecutor } from "./composables/useEtlExecutor";
import EtlToolbar from "./panels/EtlToolbar.vue";
import EtlNodePanel from "./panels/EtlNodePanel.vue";
import EtlCanvas from "./panels/EtlCanvas.vue";
import EtlPropertyPanel from "./panels/EtlPropertyPanel.vue";
import EtlPreviewDialog from "./dialogs/EtlPreviewDialog.vue";
import { DesignerMobileShell } from "@/components/shared";
import type { EtlNodeType, EtlPipeline } from "./types";

const props = defineProps<{
  pipeline?: Partial<EtlPipeline>;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "save", v: EtlPipeline): void;
}>();

const designer = useEtlDesigner(props.pipeline);
const executor = useEtlExecutor();

const previewVisible = ref(false);
const logCollapsed = ref(false);

const handleAddNode = (type: EtlNodeType) => {
  // 网格布局：每次添加节点错开位置
  const count = designer.state.nodes.length;
  const x = 100 + (count % 4) * 180;
  const y = 100 + Math.floor(count / 4) * 100;
  designer.addNode(type, x, y);
};

const handleDropNode = (type: string, x: number, y: number) => {
  designer.addNode(type as EtlNodeType, x, y);
};

const handleSave = () => {
  const data = designer.getData();
  emits("save", data);
  ElMessage.success(i18n("etl.message.saved"));
};

const handleClearLog = () => executor.clearLog();

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
  document:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><polyline points="14 2 14 8 20 8"/></svg>',
  arrowUp:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  arrowDown:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
};
</script>

<template>
  <div class="etl-designer">
    <DesignerMobileShell
      :panels="[
        { key: 'nodes', label: '节点', side: 'left', width: 220, min: 180 },
        { key: 'props', label: '属性', side: 'right', width: 320, min: 240 },
      ]"
    >
      <template #toolbar>
        <etl-toolbar
          :designer="designer"
          :executor="executor"
          @preview="previewVisible = true"
          @save="handleSave"
        />
      </template>
      <template #canvas>
        <etl-canvas :designer="designer" @drop-node="handleDropNode" />
      </template>
      <template #panel-nodes>
        <etl-node-panel @add="handleAddNode" />
      </template>
      <template #panel-props>
        <etl-property-panel :designer="designer" />
      </template>
    </DesignerMobileShell>
    <div class="log-panel" :class="{ collapsed: logCollapsed }">
      <div class="log-header" @click="logCollapsed = !logCollapsed">
        <span class="log-title">
          <span class="svg-icon" v-html="icons.document"></span>
          {{ i18n("etl.log.title") }}
          <span v-if="executor.log.value.length" class="log-count"
            >({{ executor.log.value.length }})</span
          >
        </span>
        <div class="log-actions" @click.stop>
          <el-button
            v-if="executor.log.value.length"
            text
            @click="handleClearLog"
          >
            {{ i18n("etl.btn.clear") }}
          </el-button>
          <span
            class="svg-icon"
            v-html="logCollapsed ? icons.arrowDown : icons.arrowUp"
          ></span>
        </div>
      </div>
      <div v-show="!logCollapsed" class="log-content">
        <div v-if="executor.log.value.length === 0" class="log-empty">
          {{ i18n("etl.log.empty") }}
        </div>
        <div v-else class="log-list">
          <div
            v-for="(item, idx) in executor.log.value"
            :key="idx"
            class="log-item"
            :class="`level-${item.level}`"
          >
            <span class="log-time">{{ item.time }}</span>
            <span class="log-level"
              >[{{ i18n(`etl.log.level.${item.level}`) }}]</span
            >
            <span class="log-message">{{ item.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <etl-preview-dialog
      v-model:visible="previewVisible"
      :pipeline="designer.state"
    />
  </div>
</template>

<style lang="scss" scoped>
.etl-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color-page);
  overflow: hidden;

  .log-panel {
    height: 160px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    transition: height 0.2s;

    &.collapsed {
      height: 32px;
    }

    .log-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 12px;
      background: var(--el-fill-color-light);
      border-bottom: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
      user-select: none;
      font-size: 12px;

      .log-title {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 600;

        .log-count {
          color: var(--el-text-color-secondary);
          font-weight: normal;
        }
      }

      .log-actions {
        display: flex;
        align-items: center;
        gap: 4px;

        .toggle-icon {
          font-size: 12px;
        }
      }
    }

    .log-content {
      flex: 1;
      overflow: auto;
    }

    .log-empty {
      padding: 20px;
      text-align: center;
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }

    .log-list {
      padding: 4px 0;
      font-family: "Consolas", "Monaco", monospace;
      font-size: 12px;
    }

    .log-item {
      display: flex;
      gap: 8px;
      padding: 2px 12px;

      &.level-info {
        color: var(--el-text-color-regular);
      }

      &.level-warn {
        color: var(--el-color-warning);
      }

      &.level-error {
        color: var(--el-color-danger);
      }

      .log-time {
        color: var(--el-text-color-secondary);
        flex-shrink: 0;
      }

      .log-level {
        flex-shrink: 0;
        width: 60px;
      }

      .log-message {
        flex: 1;
        word-break: break-all;
      }
    }
  }
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
