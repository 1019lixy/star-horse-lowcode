<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { i18n } from "@/lang/index";

export interface ConsoleLine {
  type: "info" | "success" | "warning" | "error";
  text: string;
  time: string;
}

const props = defineProps<{
  visible: boolean;
  lines: ConsoleLine[];
  height?: number;
  busy?: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [val: boolean];
  clear: [];
}>();

const panelRef = ref<HTMLElement>();
const innerHeight = ref(props.height || 200);

const scrollToBottom = async () => {
  await nextTick();
  const el = panelRef.value?.querySelector(".console-scroll") as HTMLElement;
  if (el) el.scrollTop = el.scrollHeight;
};

watch(() => props.lines.length, () => scrollToBottom());

const TYPE_ICONS: Record<string, string> = {
  info: "ℹ",
  success: "✔",
  warning: "⚠",
  error: "✖",
};

const handleResizeStart = (e: MouseEvent) => {
  e.preventDefault();
  const startY = e.clientY;
  const startH = innerHeight.value;
  const onMove = (ev: MouseEvent) => {
    const delta = startY - ev.clientY;
    innerHeight.value = Math.max(80, Math.min(600, startH + delta));
  };
  const onUp = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
};
</script>

<template>
  <div v-if="visible" class="console-panel" :style="{ height: innerHeight + 'px' }">
    <!-- 拖拽调整高度 -->
    <div class="console-resize" @mousedown="handleResizeStart" />
    <!-- 头部工具栏 -->
    <div class="console-header">
      <span class="console-title">{{ i18n('ide.console.title') }}</span>
      <span v-if="busy" class="console-busy">{{ i18n('ide.console.running') }}</span>
      <div class="console-actions">
        <button class="console-btn" :title="i18n('ide.console.clear')" @click="emit('clear')">🗑</button>
        <button class="console-btn" :title="i18n('ide.console.close')" @click="emit('update:visible', false)">✕</button>
      </div>
    </div>
    <!-- 日志内容 -->
    <div ref="panelRef" class="console-scroll">
      <div
        v-for="(line, idx) in lines"
        :key="idx"
        class="console-line"
        :class="'console-' + line.type"
      >
        <span class="console-icon">{{ TYPE_ICONS[line.type] }}</span>
        <span class="console-time">{{ line.time }}</span>
        <span class="console-text">{{ line.text }}</span>
      </div>
      <div v-if="lines.length === 0" class="console-empty">{{ i18n('ide.console.empty') }}</div>
    </div>
  </div>
</template>

<style scoped>
.console-panel {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ide-border, #3c3c3c);
  background: var(--ide-panel-bg, #1e1e1e);
  position: relative;
  flex-shrink: 0;
}

.console-resize {
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
  height: 6px;
  cursor: ns-resize;
  z-index: 10;
}

.console-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: var(--ide-titlebar-bg, #252526);
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
  font-size: 12px;
  color: var(--ide-fg, #cccccc);
  flex-shrink: 0;
}

.console-title {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.console-busy {
  color: var(--ide-accent, #007acc);
  font-size: 11px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.console-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.console-btn {
  background: none;
  border: none;
  color: var(--ide-fg, #cccccc);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 3px;
  line-height: 1;
}
.console-btn:hover {
  background: var(--ide-hover, #2a2d2e);
}

.console-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  font-size: 12px;
  line-height: 1.6;
}

.console-line {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 1px 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.console-icon {
  flex-shrink: 0;
  width: 14px;
  text-align: center;
}

.console-time {
  flex-shrink: 0;
  color: var(--ide-fg-muted, #888);
  font-size: 11px;
}

.console-text {
  flex: 1;
  min-width: 0;
}

.console-info .console-icon { color: var(--ide-accent, #007acc); }
.console-success .console-icon { color: #89d185; }
.console-success .console-text { color: #89d185; }
.console-warning .console-icon { color: #cca700; }
.console-warning .console-text { color: #cca700; }
.console-error .console-icon { color: #f14c4c; }
.console-error .console-text { color: #f14c4c; }

.console-empty {
  color: var(--ide-fg-muted, #888);
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}
</style>
