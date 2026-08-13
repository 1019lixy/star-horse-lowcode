<script setup lang="ts" name="DtContextMenu">
/**
 * 数字孪生 - 右键上下文菜单
 *
 * 遵循 code-editor/ContextMenu.vue 范式：
 *  - Teleport to body
 *  - 自动避开视口边缘
 *  - document click/contextmenu/Escape 关闭
 * 差异点：使用 ShSvgIcon 渲染图标
 */
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ShSvgIcon } from "@/components/shared";

export interface DtContextMenuItem {
  label: string;
  action?: string;
  /** ShSvgIcon name */
  icon?: string;
  divider?: boolean;
  danger?: boolean;
  shortcut?: string;
  disabled?: boolean;
}

const props = defineProps<{
  items: DtContextMenuItem[];
  position: { x: number; y: number };
}>();

const emit = defineEmits<{
  (e: "action", action: string): void;
  (e: "close"): void;
}>();

const menuRef = ref<HTMLElement>();
const adjustedPos = ref({ x: props.position.x, y: props.position.y });

const handleAction = (item: DtContextMenuItem) => {
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
      class="dt-context-menu"
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
          <ShSvgIcon
            v-if="item.icon"
            :name="item.icon"
            size="14px"
            class="ctx-icon"
          />
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
.dt-context-menu {
  position: fixed;
  min-width: 200px;
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
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
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

.ctx-icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.ctx-label {
  flex: 1;
}

.ctx-divider {
  height: 1px;
  background: var(--ide-border, #3c3c3c);
  margin: 4px 0;
}

.ctx-shortcut {
  color: var(--ide-fg-dim, #858585);
  font-size: 11px;
  margin-left: 16px;
}

.ctx-item:hover .ctx-shortcut {
  color: rgba(255, 255, 255, 0.7);
}
</style>
