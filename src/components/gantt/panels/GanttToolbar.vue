<script setup lang="ts" name="GanttToolbar">
import { computed } from "vue";
import { i18n } from "@/lang";
import { isMobile, isTablet } from "@/api/device";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import { GANTT_TIME_UNIT_OPTIONS } from "../constants";
import type { GanttTimeUnit } from "../types";

const props = defineProps<{
  designer: GanttDesigner;
  readonly?: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
  (e: "addTask"): void;
  (e: "insertBefore"): void;
  (e: "insertAfter"): void;
}>();

const selectedTaskId = computed(() => props.designer.selectedTaskId.value);
const isCompact = computed(() => isMobile || isTablet);

/** 下拉菜单项命令 */
type DropdownCmd =
  | "addTask"
  | "insertBefore"
  | "insertAfter"
  | "removeTask"
  | "undo"
  | "redo"
  | "moveToTop"
  | "moveUp"
  | "moveDown"
  | "moveToBottom"
  | "indent"
  | "outdent"
  | "toggleWeekend"
  | "toggleToday"
  | "toggleCritical"
  | "preview"
  | "save";

const handleCommand = (cmd: DropdownCmd): void => {
  const sid = selectedTaskId.value;
  const d = props.designer;
  switch (cmd) {
    case "addTask":
      emit("addTask");
      break;
    case "insertBefore":
      emit("insertBefore");
      break;
    case "insertAfter":
      emit("insertAfter");
      break;
    case "removeTask":
      if (sid) d.removeTask(sid);
      break;
    case "undo":
      d.undo();
      break;
    case "redo":
      d.redo();
      break;
    case "moveToTop":
      if (sid) d.moveToTop(sid);
      break;
    case "moveUp":
      if (sid) d.moveUp(sid);
      break;
    case "moveDown":
      if (sid) d.moveDown(sid);
      break;
    case "moveToBottom":
      if (sid) d.moveToBottom(sid);
      break;
    case "indent":
      if (sid) d.indent(sid);
      break;
    case "outdent":
      if (sid) d.outdent(sid);
      break;
    case "toggleWeekend":
      d.updateConfig({ showWeekend: !d.state.config.showWeekend });
      break;
    case "toggleToday":
      d.updateConfig({ showToday: !d.state.config.showToday });
      break;
    case "toggleCritical":
      d.updateConfig({ showCritical: !d.state.config.showCritical });
      break;
    case "preview":
      emit("preview");
      break;
    case "save":
      emit("save");
      break;
  }
};
</script>

<template>
  <div class="gantt-toolbar">
    <div class="gantt-toolbar_header" v-if="title">{{ title }}</div>
    <div class="gantt-toolbar_inner">
      <!-- ============ 移动端：全部收纳 ============ -->
      <template v-if="isCompact">
        <div class="left-group">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button size="small">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
              <span>{{ i18n("gantt.btn.addTask") }}</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="addTask" :disabled="readonly">
                  {{ i18n("gantt.btn.addTask") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="insertBefore"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.insertBefore") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="insertAfter"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.insertAfter") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="removeTask"
                  :disabled="readonly || !selectedTaskId"
                  divided
                >
                  {{ i18n("gantt.btn.removeTask") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click" @command="handleCommand">
            <el-button size="small">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M7 11L3 7l4-4M3 7h12a5 5 0 015 5v2"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>操作</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="undo" :disabled="readonly">{{
                  i18n("gantt.btn.undo")
                }}</el-dropdown-item>
                <el-dropdown-item command="redo" :disabled="readonly">{{
                  i18n("gantt.btn.redo")
                }}</el-dropdown-item>
                <el-dropdown-item
                  command="moveToTop"
                  :disabled="readonly || !selectedTaskId"
                  divided
                >
                  {{ i18n("gantt.btn.moveToTop") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveUp"
                  :disabled="readonly || !selectedTaskId"
                  >{{ i18n("gantt.btn.moveUp") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveDown"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.moveDown") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveToBottom"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.moveToBottom") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="indent"
                  :disabled="readonly || !selectedTaskId"
                  divided
                >
                  {{ i18n("gantt.btn.indent") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="outdent"
                  :disabled="readonly || !selectedTaskId"
                  >{{ i18n("gantt.btn.outdent") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click" @command="handleCommand">
            <el-button size="small">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  fill="none"
                />
                <path
                  d="M12 7v5l3 3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>视图</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="toggleWeekend">
                  {{ i18n("gantt.btn.toggleWeekend") }}
                  <el-tag
                    size="small"
                    :type="
                      designer.state.config.showWeekend ? 'primary' : 'info'
                    "
                    class="ml-auto"
                  >
                    {{ designer.state.config.showWeekend ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="toggleToday">
                  {{ i18n("gantt.btn.toggleToday") }}
                  <el-tag
                    size="small"
                    :type="designer.state.config.showToday ? 'primary' : 'info'"
                    class="ml-auto"
                  >
                    {{ designer.state.config.showToday ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="toggleCritical">
                  {{ i18n("gantt.btn.toggleCritical") }}
                  <el-tag
                    size="small"
                    :type="
                      designer.state.config.showCritical ? 'danger' : 'info'
                    "
                    class="ml-auto"
                  >
                    {{ designer.state.config.showCritical ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="preview" divided>{{
                  i18n("gantt.btn.preview")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="right-group">
          <el-select
            :model-value="designer.state.config.timeUnit"
            size="small"
            style="width: 90px !important"
            @update:model-value="
              (v) => designer.updateConfig({ timeUnit: v as GanttTimeUnit })
            "
          >
            <el-option
              v-for="opt in GANTT_TIME_UNIT_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-button
            size="small"
            type="primary"
            :disabled="readonly"
            @click="emit('save')"
          >
            <svg
              class="gantt-svg-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
              <path
                d="M7 3v5h8V3M7 21v-8h10v8"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
            </svg>
            {{ i18n("dialog.save") }}
          </el-button>
        </div>
      </template>

      <!-- ============ PC端宽屏：分组下拉 ============ -->
      <template v-else>
        <div class="left-group">
          <!-- 任务操作组 -->
          <el-button
            :disabled="readonly"
            @click="emit('addTask')"
            :title="i18n('gantt.btn.addTask')"
          >
            <svg
              class="gantt-svg-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
            <span class="btn-label">{{ i18n("gantt.btn.addTask") }}</span>
          </el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button :disabled="readonly || !selectedTaskId">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="insertBefore"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.insertBefore") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="insertAfter"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.insertAfter") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="removeTask"
                  :disabled="readonly || !selectedTaskId"
                  divided
                >
                  {{ i18n("gantt.btn.removeTask") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 撤销重做组 -->
          <el-button-group>
            <el-button
              :disabled="readonly"
              @click="designer.undo()"
              :title="i18n('gantt.btn.undo')"
            >
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M7 11L3 7l4-4M3 7h12a5 5 0 015 5v2"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </el-button>
            <el-button
              :disabled="readonly"
              @click="designer.redo()"
              :title="i18n('gantt.btn.redo')"
            >
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M17 11l4-4-4-4M21 7H9a5 5 0 00-5 5v2"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </el-button>
          </el-button-group>

          <!-- 移动排序组（下拉） -->
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            :disabled="readonly || !selectedTaskId"
          >
            <el-button :disabled="readonly || !selectedTaskId">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M6 4h12M12 20V8M7 12l5-5 5 5"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="btn-label">排序</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="moveToTop"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.moveToTop") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveUp"
                  :disabled="readonly || !selectedTaskId"
                  >{{ i18n("gantt.btn.moveUp") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveDown"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.moveDown") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="moveToBottom"
                  :disabled="readonly || !selectedTaskId"
                >
                  {{ i18n("gantt.btn.moveToBottom") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 缩进组（下拉） -->
          <el-dropdown
            trigger="click"
            @command="handleCommand"
            :disabled="readonly || !selectedTaskId"
          >
            <el-button :disabled="readonly || !selectedTaskId">
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M4 7h16M4 12h10M4 17h6"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="btn-label">层级</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  command="indent"
                  :disabled="readonly || !selectedTaskId"
                  >{{ i18n("gantt.btn.indent") }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="outdent"
                  :disabled="readonly || !selectedTaskId"
                  >{{ i18n("gantt.btn.outdent") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="right-group">
          <el-select
            :model-value="designer.state.config.timeUnit"
            style="width: 100px !important"
            @update:model-value="
              (v) => designer.updateConfig({ timeUnit: v as GanttTimeUnit })
            "
          >
            <el-option
              v-for="opt in GANTT_TIME_UNIT_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 视图选项组（下拉） -->
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button>
              <svg
                class="gantt-svg-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  fill="none"
                />
              </svg>
              <span class="btn-label">视图</span>
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="toggleWeekend">
                  {{ i18n("gantt.btn.toggleWeekend") }}
                  <el-tag
                    size="small"
                    :type="
                      designer.state.config.showWeekend ? 'primary' : 'info'
                    "
                    class="ml-auto"
                  >
                    {{ designer.state.config.showWeekend ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="toggleToday">
                  {{ i18n("gantt.btn.toggleToday") }}
                  <el-tag
                    size="small"
                    :type="designer.state.config.showToday ? 'primary' : 'info'"
                    class="ml-auto"
                  >
                    {{ designer.state.config.showToday ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="toggleCritical">
                  {{ i18n("gantt.btn.toggleCritical") }}
                  <el-tag
                    size="small"
                    :type="
                      designer.state.config.showCritical ? 'danger' : 'info'
                    "
                    class="ml-auto"
                  >
                    {{ designer.state.config.showCritical ? "开" : "关" }}
                  </el-tag>
                </el-dropdown-item>
                <el-dropdown-item command="preview" divided>{{
                  i18n("gantt.btn.preview")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button type="primary" :disabled="readonly" @click="emit('save')">
            <svg
              class="gantt-svg-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
              <path
                d="M7 3v5h8V3M7 21v-8h10v8"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
            </svg>
            <span class="btn-label">{{ i18n("dialog.save") }}</span>
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";

export default { components: { ArrowDown } };
</script>

<style lang="scss" scoped>
.gantt-toolbar {
  display: flex;
  flex-direction: column;
  width: 100%;

  .gantt-toolbar_header {
    font-size: 14px;
    font-weight: bold;
    margin: 15px;
  }

  .gantt-toolbar_inner {
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

  .gantt-svg-icon {
    vertical-align: -0.15em;
    margin-right: 4px;
  }

  /* 移动端紧凑模式 */
  @media (max-width: 768px) {
    .gantt-toolbar_inner {
      padding: 4px 8px;

      .left-group,
      .right-group {
        gap: 4px;
      }

      .btn-label {
        display: none;
      }

      .gantt-svg-icon {
        margin-right: 0;
      }
    }
  }
}

/* el-dropdown-item 内部布局 */
:deep(.ml-auto) {
  margin-left: auto;
}
</style>
