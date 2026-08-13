<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
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

watch(
  () => props.lines.length,
  () => scrollToBottom(),
);

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
  <div
    v-if="visible"
    class="console-panel"
    :style="{ height: innerHeight + 'px' }"
  >
    <div class="console-resize" @mousedown="handleResizeStart" />
    <div class="console-header">
      <span class="console-title">{{ i18n("ide.console.title") }}</span>
      <span v-if="busy" class="console-busy">{{
        i18n("ide.console.running")
      }}</span>
      <div class="console-actions">
        <button
          class="console-btn"
          :title="i18n('ide.console.clear')"
          @click="emit('clear')"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
            />
            <path
              fill-rule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        </button>
        <button
          class="console-btn"
          :title="i18n('ide.console.close')"
          @click="emit('update:visible', false)"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div ref="panelRef" class="console-scroll">
      <div
        v-for="(line, idx) in lines"
        :key="idx"
        class="console-line"
        :class="'console-' + line.type"
      >
        <span class="console-icon">
          <!-- info -->
          <svg
            v-if="line.type === 'info'"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
          >
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
            />
          </svg>
          <!-- success -->
          <svg
            v-else-if="line.type === 'success'"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l3.992-3.992a.75.75 0 0 0-1.07-1.07L7.5 9.439 5.53 7.47a.75.75 0 0 0-1.06 1.06l2.5 2.5z"
            />
          </svg>
          <!-- warning -->
          <svg
            v-else-if="line.type === 'warning'"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
          >
            <path
              d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
            />
            <path
              d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"
            />
          </svg>
          <!-- error -->
          <svg
            v-else
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="currentColor"
          >
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </span>
        <span class="console-time">{{ line.time }}</span>
        <span class="console-text">{{ line.text }}</span>
      </div>
      <div v-if="lines.length === 0" class="console-empty">
        {{ i18n("ide.console.empty") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.console-panel {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ide-border, #3c3c3c);
  background: var(--ide-bg, #1e1e1e);
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
  background: var(--ide-sidebar-bg, #252526);
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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.console-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.console-btn {
  background: none;
  border: none;
  color: var(--ide-fg-dim, #858585);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  line-height: 1;
  display: flex;
  align-items: center;
}

.console-btn:hover {
  background: var(--ide-bg-hover, #2a2d2e);
  color: var(--ide-fg, #cccccc);
}

.console-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ide-fg, #cccccc);
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
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.console-time {
  flex-shrink: 0;
  color: var(--ide-fg-dim, #858585);
  font-size: 11px;
}

.console-text {
  flex: 1;
  min-width: 0;
}

.console-info .console-icon {
  color: var(--ide-accent, #007acc);
}

.console-info .console-text {
  color: var(--ide-fg, #cccccc);
}

.console-success .console-icon {
  color: var(--ide-success, #89d185);
}

.console-success .console-text {
  color: var(--ide-success, #89d185);
}

.console-warning .console-icon {
  color: #cca700;
}

.console-warning .console-text {
  color: #cca700;
}

.console-error .console-icon {
  color: var(--ide-error, #f14c4c);
}

.console-error .console-text {
  color: var(--ide-error, #f14c4c);
}

.console-empty {
  color: var(--ide-fg-dim, #858585);
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}
</style>
