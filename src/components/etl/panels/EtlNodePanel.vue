<script setup lang="ts" name="EtlNodePanel">
import {i18n} from "@/lang";
import {ETL_NODE_GROUPS} from "../constants";
import type {EtlNodeType} from "../types";

const emit = defineEmits<{
  (e: "add", type: EtlNodeType): void;
}>();

const handleDragStart = (e: DragEvent, type: EtlNodeType) => {
  e.dataTransfer?.setData("etl-node-type", type);
};

const handleClick = (type: EtlNodeType) => {
  emit("add", type);
};

/** 内联 SVG 图标映射（替代 Element Plus 图标，减少依赖） */
const svgIconMap: Record<string, string> = {
  Coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9h4.5a1.5 1.5 0 010 3H9"/></svg>',
  Link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  Document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/><polyline points="14 2 14 8 20 8"/></svg>',
  Files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 2v6h6M2 8a2 2 0 012-2h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z"/><path d="M6 2h8l4 4v2"/></svg>',
  Tickets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3M2 9v6a3 3 0 003 3h14a3 3 0 003-3V9M2 9a3 3 0 003 3h0a3 3 0 003-3M9 3v4M15 3v4M9 17v4M15 17v4"/></svg>',
  Filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  Operation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  Connection: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  DataAnalysis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  Sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h12M3 18h6"/></svg>',
  CopyDocument: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="12" height="16" rx="2"/><path d="M4 6h12v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/></svg>',
  MagicStick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 11.8L11 13M12.2 6.2L11 5M15 9l-6.5 6.5"/></svg>',
  Promotion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  Merge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v6l4 4 4-4V3M12 13v8M4 7h4M16 7h4"/></svg>',
  Share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>',
};
</script>

<template>
  <div class="etl-node-panel">
    <div class="panel-title">{{ i18n("etl.nodeLibrary.title") }}</div>
    <div class="panel-body">
      <div v-for="group in ETL_NODE_GROUPS" :key="group.category" class="node-group">
        <div class="group-title">{{ group.label }}</div>
        <div class="group-items">
          <div
              v-for="preset in group.presets"
              :key="preset.type"
              class="node-item"
              draggable="true"
              @dragstart="handleDragStart($event, preset.type)"
              @click="handleClick(preset.type)"
              :style="{ borderLeftColor: preset.color }"
          >
            <span class="svg-icon node-icon" :style="{ color: preset.color }"
                  v-html="svgIconMap[preset.icon] || svgIconMap.Document"></span>
            <div class="node-info">
              <div class="node-label">{{ preset.label }}</div>
              <div class="node-desc">{{ preset.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.etl-node-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-title {
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }

  .node-group {
    margin-bottom: 12px;

    .group-title {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-bottom: 4px;
      padding: 0 4px;
    }

    .group-items {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .node-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      background: var(--el-fill-color-light);
      border-left: 3px solid transparent;
      border-radius: 4px;
      cursor: grab;
      transition: background 0.2s;

      &:hover {
        background: var(--el-fill-color);
      }

      &:active {
        cursor: grabbing;
      }

      .node-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .node-info {
        flex: 1;
        overflow: hidden;

        .node-label {
          font-size: 12px;
          font-weight: 500;
        }

        .node-desc {
          font-size: 11px;
          color: var(--el-text-color-placeholder);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
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
