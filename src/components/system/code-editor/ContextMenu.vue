<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

export interface ContextMenuItem {
  label: string;
  action?: string;
  divider?: boolean;
  danger?: boolean;
  shortcut?: string;
  disabled?: boolean;
}

const props = defineProps<{
  items: ContextMenuItem[];
  position: { x: number; y: number };
}>();

const emit = defineEmits<{
  action: [action: string];
  close: [];
}>();

const menuRef = ref<HTMLElement>();
const adjustedPos = ref({ x: props.position.x, y: props.position.y });

const handleAction = (item: ContextMenuItem) => {
  if (item.disabled || !item.action) return;
  emit("action", item.action);
  emit("close");
};

const adjustPosition = () => {
  if (!menuRef.value) return;
  const rect = menuRef.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (rect.right > vw)
    adjustedPos.value.x = Math.max(0, props.position.x - rect.width);
  if (rect.bottom > vh)
    adjustedPos.value.y = Math.max(0, props.position.y - rect.height);
};

onMounted(async () => {
  await nextTick();
  adjustPosition();
  document.addEventListener("click", onDocClick, true);
  document.addEventListener("contextmenu", onDocCtx, true);
  document.addEventListener("keydown", onEsc);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("contextmenu", onDocCtx, true);
  document.removeEventListener("keydown", onEsc);
});

const onDocClick = (e: MouseEvent) => {
  if (menuRef.value?.contains(e.target as Node)) return;
  emit("close");
};
const onDocCtx = (e: Event) => {
  e.preventDefault();
  emit("close");
};
const onEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div
      ref="menuRef"
      class="sh-context-menu"
      :style="{ left: adjustedPos.x + 'px', top: adjustedPos.y + 'px' }"
      @click.stop
      @contextmenu.prevent
    >
      <template v-for="(item, i) in items" :key="i">
        <div v-if="item.divider" class="ctx-divider" />
        <div
          v-else
          class="ctx-item"
          :class="{ 'ctx-danger': item.danger, 'ctx-disabled': item.disabled }"
          @click="handleAction(item)"
        >
          <span class="ctx-label">{{ item.label }}</span>
          <span v-if="item.shortcut" class="ctx-shortcut">{{
            item.shortcut
          }}</span>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.sh-context-menu {
  position: fixed;
  min-width: 180px;
  background: var(--ide-dropdown-bg, #252526);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  padding: 4px 0;
  z-index: 10000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  font-size: 13px;
  user-select: none;
}

.ctx-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  cursor: pointer;
  color: var(--ide-fg, #cccccc);

  &:hover {
    background: var(--ide-accent, #007acc);
    color: #fff;
  }

  &.ctx-danger {
    color: #ff4d4f;

    &:hover {
      background: #ff4d4f;
      color: #fff;
    }
  }

  &.ctx-disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      background: none;
      color: inherit;
    }
  }
}

.ctx-divider {
  height: 1px;
  background: var(--ide-border, #3c3c3c);
  margin: 4px 0;
}

.ctx-shortcut {
  color: var(--ide-fg-dim, #858585);
  font-size: 11px;
  margin-left: 20px;
}

.ctx-item:hover .ctx-shortcut {
  color: rgba(255, 255, 255, 0.7);
}
</style>
