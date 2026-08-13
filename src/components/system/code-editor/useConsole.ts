import { ref } from "vue";
import type { ConsoleLine } from "./ConsolePanel.vue";

export function useConsole() {
  const consoleVisible = ref(false);
  const consoleLines = ref<ConsoleLine[]>([]);
  const consoleBusy = ref(false);

  const now = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const appendConsole = (type: ConsoleLine["type"], text: string) => {
    consoleLines.value.push({ type, text, time: now() });
  };

  const clearConsole = () => {
    consoleLines.value = [];
  };

  const toggleConsole = () => {
    consoleVisible.value = !consoleVisible.value;
  };

  return {
    consoleVisible,
    consoleLines,
    consoleBusy,
    appendConsole,
    clearConsole,
    toggleConsole,
  };
}
