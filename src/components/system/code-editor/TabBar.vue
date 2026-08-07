<script setup lang="ts">
import type {TabInfo} from "./types";
import {getFileIcon} from "./constants";
import {computed} from "vue";

const props = defineProps<{
  tabs: TabInfo[];
  activeId: string;
}>();

const emit = defineEmits<{
  switch: [id: string];
  close: [id: string];
}>();

/** 检测哪些 tab 存在同名冲突，需要显示路径 */
const needsPath = computed(() => {
  const nameCounts = new Map<string, number>();
  for (const tab of props.tabs) {
    nameCounts.set(tab.name, (nameCounts.get(tab.name) || 0) + 1);
  }
  return nameCounts;
});

const shouldShowPath = (tab: TabInfo) => {
  return (needsPath.value.get(tab.name) || 0) > 1 && !!tab.path;
};
</script>

<template>
  <div class="sh-tabbar">
    <div
        v-for="tab in tabs"
        :key="tab.id"
        class="ide-tab"
        :class="{ active: tab.id === activeId }"
        @click="emit('switch', tab.id)"
    >
      <span class="tab-icon">{{ getFileIcon(tab.name) }}</span>
      <span class="tab-name">
        {{ tab.name }}
        <span v-if="shouldShowPath(tab)" class="tab-path">{{ tab.path }}</span>
      </span>
      <span v-if="tab.modified" class="tab-modified">●</span>
      <span class="tab-close" @click.stop="emit('close', tab.id)">×</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sh-tabbar {
  display: flex;
  background: var(--ide-bg-tertiary);
  border-bottom: 1px solid var(--ide-border);
  overflow-x: auto;
  flex-shrink: 0;
  height: 35px;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--ide-scrollbar);
    border-radius: 2px;
  }
}

.ide-tab {
  display: flex;
  align-items: center;
  padding: 0 12px;
  min-width: 100px;
  max-width: 240px;
  cursor: pointer;
  background: var(--ide-tab-inactive-bg);
  border-right: 1px solid var(--ide-border);
  font-size: 12.5px;
  white-space: nowrap;
  user-select: none;
  position: relative;
  color: var(--ide-fg);

  &.active {
    background: var(--ide-tab-active-bg);
    border-top: 2px solid var(--ide-accent);
  }

  &:hover {
    background: var(--ide-bg-hover);
  }
}

.tab-icon {
  margin-right: 4px;
  font-size: 13px;
  flex-shrink: 0;
}

.tab-name {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.tab-path {
  font-size: 11px;
  color: var(--ide-fg-dim, #858585);
  opacity: 0.7;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.tab-modified {
  color: var(--ide-modified-dot);
  margin-left: 4px;
  font-size: 10px;
  flex-shrink: 0;
}

.tab-close {
  margin-left: 6px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: 16px;
  opacity: 0;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.ide-tab:hover .tab-close,
.ide-tab.active .tab-close {
  opacity: 0.7;
}
</style>
