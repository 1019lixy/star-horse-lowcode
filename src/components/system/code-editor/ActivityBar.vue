<script setup lang="ts">
defineProps<{
  activePanel: string;
  sidebarVisible: boolean;
}>();

const emit = defineEmits<{
  "toggle-panel": [panel: string];
}>();
</script>

<template>
  <div class="sh-activitybar">
    <div
      class="activity-item"
      :class="{ active: activePanel === 'explorer' && sidebarVisible }"
      title="资源管理器"
      @click="emit('toggle-panel', 'explorer')"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/>
      </svg>
    </div>
    <div
      class="activity-item"
      :class="{ active: activePanel === 'search' && sidebarVisible }"
      title="搜索"
      @click="emit('toggle-panel', 'search')"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 21.82l1.12 1.05 8.05-8.1A8.25 8.25 0 1 0 15.25 0zm0 15a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z"/>
      </svg>
    </div>
    <div class="activity-spacer" />
    <div class="activity-item" title="设置" @click="emit('toggle-panel', 'settings')">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sh-activitybar {
  width: 48px;
  background: var(--ide-activitybar-bg);
  border-right: 1px solid var(--ide-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  flex-shrink: 0;
}
.activity-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ide-fg-dim);
  border-left: 2px solid transparent;
  opacity: 0.7;
  &:hover { opacity: 1; color: var(--ide-fg); }
  &.active {
    opacity: 1;
    color: var(--ide-fg-bright);
    border-left-color: var(--ide-accent);
  }
  svg { pointer-events: none; }
}
.activity-spacer { flex: 1; }
</style>
