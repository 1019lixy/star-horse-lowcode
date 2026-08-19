<script setup lang="ts" name="PrintLayerPanel">
/**
 * 打印模板设计器 - 图层面板
 * 职责：展示元素层级树，支持选中、显示切换、锁定、排序
 */
import { computed } from "vue";
import { i18n } from "@/lang";
import type { PrintElement } from "../types";
import type { UsePrintDesignerReturn } from "../composables/usePrintDesigner";

const props = defineProps<{
  designer: UsePrintDesignerReturn;
}>();

// 图层从上到下倒序展示（顶部元素在前）
const layers = computed<PrintElement[]>(() =>
  [...props.designer.state.template.elements].reverse(),
);

const selectedIds = computed(() => props.designer.state.selectedIds);

const handleClick = (el: PrintElement, e: MouseEvent) => {
  props.designer.selectElement(el.id, e.ctrlKey || e.metaKey);
};

const toggleVisible = (el: PrintElement) => {
  props.designer.updateElement(el.id, { visible: el.visible === false });
};

const toggleLocked = (el: PrintElement) => {
  props.designer.updateElement(el.id, { locked: !el.locked });
};
</script>

<template>
  <div class="print-layer-panel">
    <div class="layer-header">
      <span class="layer-title">{{ i18n("print.layer.title") }}</span>
      <span class="layer-count">{{ layers.length }}</span>
    </div>
    <div class="layer-list">
      <div
        v-for="el in layers"
        :key="el.id"
        class="layer-item"
        :class="{ selected: selectedIds.includes(el.id) }"
        @click="(e) => handleClick(el, e)"
      >
        <span
          class="layer-icon"
          @click.stop="toggleVisible(el)"
          :title="i18n('print.layer.toggleVisible')"
        >
          <star-horse-icon
            :icon-class="el.visible === false ? 'eye-close' : 'eye'"
            cursor="pointer"
          />
        </span>
        <span
          class="layer-icon"
          @click.stop="toggleLocked(el)"
          :title="i18n('print.layer.toggleLock')"
        >
          <star-horse-icon
            :icon-class="el.locked ? 'hide' : 'view'"
            cursor="pointer"
          />
        </span>
        <span class="layer-name">{{ el.name }}</span>
        <span class="layer-type">{{ el.type }}</span>
      </div>
      <div v-if="!layers.length" class="empty">
        {{ i18n("print.layer.empty") }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.print-layer-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);

  .layer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    .layer-count {
      background: var(--el-fill-color);
      padding: 1px 6px;
      border-radius: 8px;
      font-size: 11px;
    }
  }

  .layer-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
  }

  .layer-item {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    gap: 6px;
    font-size: 13px;
    border-left: 2px solid transparent;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.selected {
      background: var(--el-color-primary-light-9);
      border-left-color: var(--el-color-primary);
    }

    .layer-icon {
      display: flex;
      align-items: center;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }

    .layer-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layer-type {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      background: var(--el-fill-color-light);
      padding: 1px 6px;
      border-radius: 4px;
    }
  }

  .empty {
    padding: 20px;
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>
