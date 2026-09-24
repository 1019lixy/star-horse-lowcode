<script setup lang="ts" name="KanbanToolbar">
import { computed } from "vue";
import { i18n } from "@/lang";
import { isMobile, isTablet } from "@/api/device";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";

const props = defineProps<{
  designer: KanbanDesigner;
  readonly?: boolean;
  hasCollapsed?: boolean;
  canAddCard?: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "add-card"): void;
  (e: "expand-all"): void;
}>();

const isCompact = computed(() => isMobile.value || isTablet.value);

/** 内联 SVG 图标 */
const icons: Record<string, string> = {
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4"/></svg>',
  redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  column:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="16" y="3" width="6" height="18" rx="1"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>',
  priority:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  expandAll:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 19l-7-7 7-7"/><path d="M22 19l-7-7 7-7"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>',
};

/** 下拉菜单命令 */
type DropdownCmd =
  | "undo"
  | "redo"
  | "addCard"
  | "addColumn"
  | "expandAll"
  | "toggleAvatar"
  | "toggleLabels"
  | "togglePriority";

const handleCommand = (cmd: DropdownCmd): void => {
  const d = props.designer;
  switch (cmd) {
    case "undo":
      d.undo();
      break;
    case "redo":
      d.redo();
      break;
    case "addCard":
      emit("add-card");
      break;
    case "addColumn":
      d.addColumn();
      break;
    case "expandAll":
      emit("expand-all");
      break;
    case "toggleAvatar":
      d.updateConfig({ showAvatar: !d.state.config.showAvatar });
      break;
    case "toggleLabels":
      d.updateConfig({ showLabels: !d.state.config.showLabels });
      break;
    case "togglePriority":
      d.updateConfig({ showPriority: !d.state.config.showPriority });
      break;
  }
};
</script>

<template>
  <div class="kanban-toolbar">
    <!-- ============ 移动端紧凑模式 ============ -->
    <template v-if="isCompact">
      <div class="left-group">
        <div class="kanban-title" v-if="title">{{ title }}</div>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            <span class="svg-icon" v-html="icons.plus"></span>
            <span>操作</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="undo" :disabled="readonly">{{
                i18n("kanban.btn.undo")
              }}</el-dropdown-item>
              <el-dropdown-item command="redo" :disabled="readonly">{{
                i18n("kanban.btn.redo")
              }}</el-dropdown-item>
              <el-dropdown-item
                command="addCard"
                :disabled="readonly"
                v-if="canAddCard"
                divided
              >
                {{ i18n("kanban.btn.addCard") }}
              </el-dropdown-item>
              <el-dropdown-item command="addColumn" :disabled="readonly"
                >{{ i18n("kanban.btn.addColumn") }}
              </el-dropdown-item>
              <el-dropdown-item command="expandAll" divided>{{
                i18n("kanban.btn.expandAll")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            <span class="svg-icon" v-html="icons.user"></span>
            <span>显示</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="toggleAvatar">
                {{ i18n("kanban.btn.showAvatar") }}
                <el-tag
                  size="small"
                  :type="designer.state.config.showAvatar ? 'primary' : 'info'"
                  class="ml-auto"
                >
                  {{ designer.state.config.showAvatar ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item command="toggleLabels">
                {{ i18n("kanban.btn.showLabels") }}
                <el-tag
                  size="small"
                  :type="designer.state.config.showLabels ? 'primary' : 'info'"
                  class="ml-auto"
                >
                  {{ designer.state.config.showLabels ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item command="togglePriority">
                {{ i18n("kanban.btn.showPriority") }}
                <el-tag
                  size="small"
                  :type="
                    designer.state.config.showPriority ? 'primary' : 'info'
                  "
                  class="ml-auto"
                >
                  {{ designer.state.config.showPriority ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="right-group">
        <el-button
          size="small"
          type="primary"
          :disabled="readonly"
          @click="emit('save')"
        >
          <span class="svg-icon" v-html="icons.save"></span>
          {{ i18n("dialog.save") }}
        </el-button>
      </div>
    </template>

    <!-- ============ PC端宽屏模式 ============ -->
    <template v-else>
      <div class="left-group">
        <div class="kanban-title" v-if="title">{{ title }}</div>

        <!-- 撤销重做组 -->
        <el-button-group>
          <el-button
            size="small"
            :disabled="readonly"
            @click="designer.undo()"
            :title="i18n('kanban.btn.undo')"
          >
            <span class="svg-icon" v-html="icons.undo"></span>
          </el-button>
          <el-button
            size="small"
            :disabled="readonly"
            @click="designer.redo()"
            :title="i18n('kanban.btn.redo')"
          >
            <span class="svg-icon" v-html="icons.redo"></span>
          </el-button>
        </el-button-group>

        <!-- 新增组（下拉） -->
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            <span class="svg-icon" v-html="icons.plus"></span>
            <span class="btn-label">新增</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="addCard"
                :disabled="readonly"
                v-if="canAddCard"
              >
                {{ i18n("kanban.btn.addCard") }}
              </el-dropdown-item>
              <el-dropdown-item
                command="addColumn"
                :disabled="readonly"
                :divided="!!canAddCard"
              >
                {{ i18n("kanban.btn.addColumn") }}
              </el-dropdown-item>
              <el-dropdown-item command="expandAll" divided>
                {{ i18n("kanban.btn.expandAll") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="right-group">
        <!-- 显示选项组（下拉） -->
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            <span class="svg-icon" v-html="icons.user"></span>
            <span class="btn-label">显示</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="toggleAvatar">
                {{ i18n("kanban.btn.showAvatar") }}
                <el-tag
                  size="small"
                  :type="designer.state.config.showAvatar ? 'primary' : 'info'"
                  class="ml-auto"
                >
                  {{ designer.state.config.showAvatar ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item command="toggleLabels">
                {{ i18n("kanban.btn.showLabels") }}
                <el-tag
                  size="small"
                  :type="designer.state.config.showLabels ? 'primary' : 'info'"
                  class="ml-auto"
                >
                  {{ designer.state.config.showLabels ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item command="togglePriority">
                {{ i18n("kanban.btn.showPriority") }}
                <el-tag
                  size="small"
                  :type="
                    designer.state.config.showPriority ? 'primary' : 'info'
                  "
                  class="ml-auto"
                >
                  {{ designer.state.config.showPriority ? "开" : "关" }}
                </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          size="small"
          type="primary"
          :disabled="readonly"
          @click="emit('save')"
        >
          <span class="svg-icon" v-html="icons.save"></span>
          <span class="btn-label">{{ i18n("dialog.save") }}</span>
        </el-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";

export default { components: { ArrowDown } };
</script>

<style lang="scss" scoped>
.kanban-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  gap: 8px;

  .left-group,
  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.kanban-title {
  font-weight: bold;
  color: var(--star-horse-style);
  font-size: 14px;
  margin: 0 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  margin-right: 4px;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* 移动端紧凑模式 */
@media (max-width: 768px) {
  .kanban-toolbar {
    padding: 4px 8px;

    .left-group,
    .right-group {
      gap: 4px;
    }
  }

  .btn-label {
    display: none;
  }

  .svg-icon {
    margin-right: 0;
  }

  .kanban-title {
    max-width: 100px;
    font-size: 13px;
    margin: 0 8px;
  }
}

/* el-dropdown-item 内部布局 */
:deep(.ml-auto) {
  margin-left: auto;
}
</style>
