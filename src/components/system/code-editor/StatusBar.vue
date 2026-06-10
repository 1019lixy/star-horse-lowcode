<script setup lang="ts">
defineProps<{
  cursorLine: number;
  cursorCol: number;
  language: string;
  lspConnected: boolean;
  showLsp: boolean;
}>();
</script>

<template>
  <div class="sh-statusbar">
    <div class="status-left">
      <span
        v-if="showLsp"
        class="status-item"
        :class="lspConnected ? 'status-ok' : 'status-err'"
      >
        <span class="status-dot" />
        LSP {{ lspConnected ? '已连接' : '未连接' }}
      </span>
    </div>
    <div class="status-right">
      <span class="status-item">行 {{ cursorLine }}, 列 {{ cursorCol }}</span>
      <span class="status-item">{{ language }}</span>
      <span class="status-item">UTF-8</span>
      <span class="status-item">空格: 4</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sh-statusbar {
  height: 22px;
  background: var(--ide-statusbar-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 12px;
  color: var(--ide-statusbar-fg);
  flex-shrink: 0;
}
.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  cursor: default;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.status-ok .status-dot {
  background: #52c41a;
  box-shadow: 0 0 4px #52c41a;
}
.status-err .status-dot {
  background: #ff4d4f;
}
</style>
