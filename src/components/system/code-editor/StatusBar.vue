<script setup lang="ts">
import { i18n } from "@/lang/index";

defineProps<{
  cursorLine: number;
  cursorCol: number;
  language: string;
  lspConnected: boolean;
  showLsp: boolean;
  loading?: boolean;
  saving?: boolean;
  consoleVisible?: boolean;
}>();

const emit = defineEmits<{
  "toggle-console": [];
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
        LSP
        {{
          lspConnected
            ? i18n("ide.status.lspConnected")
            : i18n("ide.status.lspDisconnected")
        }}
      </span>
      <span v-if="loading" class="status-item status-loading"
        >⏳ {{ i18n("ide.status.loading") }}</span
      >
      <span v-if="saving" class="status-item status-saving"
        >💾 {{ i18n("ide.status.saving") }}</span
      >
    </div>
    <div class="status-right">
      <span class="status-item"
        >{{ i18n("ide.status.line") }} {{ cursorLine }},
        {{ i18n("ide.status.col") }} {{ cursorCol }}</span
      >
      <span class="status-item">{{ language }}</span>
      <span class="status-item">UTF-8</span>
      <span class="status-item">{{ i18n("ide.status.spaces") }}</span>
      <span
        class="status-item status-clickable"
        :class="{ 'status-console-active': consoleVisible }"
        :title="i18n('ide.status.toggleConsole')"
        @click="emit('toggle-console')"
        >{{ consoleVisible ? "⬛" : "⬜" }}
        {{ i18n("ide.console.title") }}</span
      >
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

.status-clickable {
  cursor: pointer;
  transition: background 0.15s;
  padding: 0 6px;
  border-radius: 3px;

  &:hover {
    background: var(--ide-statusbar-hover, rgba(255, 255, 255, 0.12));
  }
}

.status-console-active {
  background: var(--ide-statusbar-hover, rgba(255, 255, 255, 0.12));
}

.status-loading,
.status-saving {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
