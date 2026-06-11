<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, computed} from "vue";
import type { MenuItemDef } from "./types";
import { IDE_THEMES } from "./theme";
import { i18n } from "@/lang/index";

const props = defineProps<{
  menus: MenuItemDef[];
  currentTheme: string;
}>();

const emit = defineEmits<{
  action: [item: MenuItemDef];
  "switch-theme": [theme: string];
}>();

const openIndex = ref<number | null>(null);
// ==================== 菜单定义 ====================
const defaultMenus: MenuItemDef[] = [
  {
    label: i18n("ide.menu.file"),
    children: [
      {label: i18n("ide.menu.file.newFile"), action: "new-file", shortcut: "Ctrl+N"},
      {label: i18n("ide.menu.file.newFolder"), action: "new-folder"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.openFile"), action: "open-file", shortcut: "Ctrl+O"},
      {label: i18n("ide.menu.file.openDirectory"), action: "open-directory"},
      {label: i18n("ide.menu.file.loadServer"), action: "load-server"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.save"), action: "save", shortcut: "Ctrl+S"},
      {label: i18n("ide.menu.file.saveAll"), action: "save-all", shortcut: "Ctrl+Shift+S"},
      {label: i18n("ide.menu.file.saveServer"), action: "save-server"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.closeTab"), action: "close-tab", shortcut: "Ctrl+W"},
      {label: i18n("ide.menu.file.closeAll"), action: "close-all"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.file.resolveConflict"), action: "resolve-conflict"},
    ],
  },
  {
    label: i18n("ide.menu.edit"),
    children: [
      {label: i18n("ide.menu.edit.undo"), action: "undo", shortcut: "Ctrl+Z"},
      {label: i18n("ide.menu.edit.redo"), action: "redo", shortcut: "Ctrl+Shift+Z"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.cut"), action: "cut", shortcut: "Ctrl+X"},
      {label: i18n("ide.menu.edit.copy"), action: "copy", shortcut: "Ctrl+C"},
      {label: i18n("ide.menu.edit.paste"), action: "paste", shortcut: "Ctrl+V"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.find"), action: "find", shortcut: "Ctrl+F"},
      {label: i18n("ide.menu.edit.replace"), action: "replace", shortcut: "Ctrl+H"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.selectAll"), action: "select-all", shortcut: "Ctrl+A"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.edit.formatDocument"), action: "format-document", shortcut: "Shift+Alt+F"},
    ],
  },
  {
    label: i18n("ide.menu.build"),
    children: [
      {label: i18n("ide.menu.build.compile"), action: "compile", shortcut: "Ctrl+Shift+B"},
      {label: i18n("ide.menu.build.compileRegister"), action: "compile-register"},
      {label: i18n("ide.menu.build.run"), action: "run", shortcut: "Ctrl+F5"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.draftSave"), action: "draft-save"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.unregisterAll"), action: "unregister-all"},
      {label: i18n("ide.menu.build.healthCheck"), action: "health-check"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.build.console"), action: "toggle-console", shortcut: "Ctrl+`"},
    ],
  },
  {
    label: i18n("ide.menu.view"),
    children: [
      {label: i18n("ide.menu.view.toggleSidebar"), action: "toggle-sidebar", shortcut: "Ctrl+B"},
      {label: i18n("ide.menu.view.toggleMinimap"), action: "toggle-minimap"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.view.zoomIn"), action: "zoom-in", shortcut: "Ctrl+="},
      {label: i18n("ide.menu.view.zoomOut"), action: "zoom-out", shortcut: "Ctrl+-"},
      {label: i18n("ide.menu.view.zoomReset"), action: "zoom-reset", shortcut: "Ctrl+0"},
      {divider: true, label: ""},
      {label: i18n("ide.menu.view.diffEditor"), action: "diff-editor", shortcut: "Ctrl+Shift+D"},
    ],
  },
];
const mergedMenus = computed(() => {
  if (props.menus.length > 0) return [...defaultMenus, ...props.menus];
  return defaultMenus;
});
const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i;
};

const close = () => {
  openIndex.value = null;
};

const handleAction = (item: MenuItemDef) => {
  close();
  if (item.action || item.children) {
    emit("action", item);
  }
};

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".sh-menubar")) close();
};

onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));
</script>

<template>
  <div class="sh-menubar" @click.stop>
    <div
      v-for="(menu, i) in mergedMenus"
      :key="i"
      class="menubar-item"
      :class="{ active: openIndex === i }"
      @click="toggle(i)"
      @mouseenter="openIndex !== null && (openIndex = i)"
    >
      <span class="menubar-label">{{ menu.label }}</span>
      <!-- 下拉菜单 -->
      <div v-if="openIndex === i && menu.children" class="menubar-dropdown">
        <template v-for="(child, ci) in menu.children" :key="ci">
          <div v-if="child.divider" class="dropdown-divider" />
          <div v-else class="dropdown-item" @click.stop="handleAction(child)">
            <span class="dropdown-label">{{ child.label }}</span>
            <span v-if="child.shortcut" class="dropdown-shortcut">{{ child.shortcut }}</span>
          </div>
        </template>
      </div>
    </div>

    <div class="menubar-spacer" />

    <!-- 主题切换 -->
    <div class="menubar-item theme-switcher" @click.stop>
      <el-dropdown trigger="click" @command="(v: string) => emit('switch-theme', v)">
        <span class="menubar-label cursor-pointer">
          {{ IDE_THEMES.find(t => t.value === currentTheme)?.name || i18n('ide.theme.dark') }} ▾
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="t in IDE_THEMES"
              :key="t.value"
              :command="t.value"
              :class="{ 'is-active': t.value === currentTheme }"
            >
              {{ t.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sh-menubar {
  height: 30px;
  display: flex;
  align-items: center;
  background: var(--ide-menubar-bg);
  border-bottom: 1px solid var(--ide-border);
  padding: 0 4px;
  user-select: none;
  flex-shrink: 0;
  z-index: 100;
}
.menubar-item {
  position: relative;
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12.5px;
  color: var(--ide-fg);
  &:hover, &.active { background: var(--ide-bg-hover); }
}
.menubar-label { white-space: nowrap; }
.menubar-spacer { flex: 1; }
.menubar-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 240px;
  background: var(--ide-dropdown-bg);
  border: 1px solid var(--ide-border);
  border-radius: 4px;
  padding: 4px 0;
  z-index: 200;
  box-shadow: 0 4px 16px var(--ide-dropdown-shadow);
}
.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
  cursor: pointer;
  color: var(--ide-fg);
  &:hover {
    background: var(--ide-accent);
    color: #fff;
  }
}
.dropdown-divider {
  height: 1px;
  background: var(--ide-border);
  margin: 4px 0;
}
.dropdown-shortcut {
  color: var(--ide-fg-dim);
  font-size: 11px;
  margin-left: 20px;
}
.dropdown-item:hover .dropdown-shortcut { color: rgba(255,255,255,0.7); }
.theme-switcher { font-size: 12px; }
</style>
