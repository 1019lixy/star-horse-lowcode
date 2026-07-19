<script setup lang="ts" name="GanttToolbar">
import {computed} from "vue";
import {i18n} from "@/lang";
import type {GanttDesigner} from "../composables/useGanttDesigner";
import {GANTT_TIME_UNIT_OPTIONS} from "../constants";
import type {GanttTimeUnit} from "../types";

const props = defineProps<{
  designer: GanttDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
  (e: "addTask"): void;
  (e: "insertBefore"): void;
  (e: "insertAfter"): void;
}>();

const selectedTaskId = computed(() => props.designer.selectedTaskId.value);
</script>

<template>
  <div class="gantt-toolbar">
    <div class="left-group">
      <el-button-group>
        <el-button :disabled="readonly" @click="emit('addTask')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          {{ i18n("gantt.btn.addTask") }}
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="emit('insertBefore')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 5v6M5 11h14M12 17v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          {{ i18n("gantt.btn.insertBefore") }}
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="emit('insertAfter')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 3v2M5 7h14M12 13v6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          {{ i18n("gantt.btn.insertAfter") }}
        </el-button>
        <el-button
            :disabled="readonly || !selectedTaskId"
            @click="selectedTaskId && designer.removeTask(selectedTaskId)"
        >
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M6 7h12M9 7V5h6v2M8 7v12h8V7M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ i18n("gantt.btn.removeTask") }}
        </el-button>
      </el-button-group>

      <el-button-group>
        <el-button :disabled="readonly" @click="designer.undo()">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M7 11L3 7l4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7h12a5 5 0 015 5v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          {{ i18n("gantt.btn.undo") }}
        </el-button>
        <el-button :disabled="readonly" @click="designer.redo()">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M17 11l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 7H9a5 5 0 00-5 5v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
          {{ i18n("gantt.btn.redo") }}
        </el-button>
      </el-button-group>

      <el-button-group>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.moveToTop(selectedTaskId)" :title="i18n('gantt.btn.moveToTop')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M6 4h12M12 20V8M7 12l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.moveUp(selectedTaskId)" :title="i18n('gantt.btn.moveUp')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 20V8M7 12l5-5 5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.moveDown(selectedTaskId)" :title="i18n('gantt.btn.moveDown')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 4v12M7 12l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.moveToBottom(selectedTaskId)" :title="i18n('gantt.btn.moveToBottom')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M6 20h12M12 4v12M7 12l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
      </el-button-group>

      <el-button-group>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.indent(selectedTaskId)" :title="i18n('gantt.btn.indent')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M4 7h16M4 12h10M4 17h6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
        <el-button :disabled="readonly || !selectedTaskId" @click="selectedTaskId && designer.outdent(selectedTaskId)" :title="i18n('gantt.btn.outdent')">
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M4 7h6M4 12h10M4 17h16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
      </el-button-group>
    </div>

    <div class="right-group">
      <el-select
          :model-value="designer.state.config.timeUnit"
          style="width: 100px !important;"
          @update:model-value="(v) => designer.updateConfig({ timeUnit: v as GanttTimeUnit })"
      >
        <el-option
            v-for="opt in GANTT_TIME_UNIT_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
        />
      </el-select>

      <el-tooltip :content="i18n('gantt.btn.toggleWeekend')">
        <el-button
            :type="designer.state.config.showWeekend ? 'primary' : 'default'"
            @click="designer.updateConfig({ showWeekend: !designer.state.config.showWeekend })"
        >
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="i18n('gantt.btn.toggleToday')">
        <el-button
            :type="designer.state.config.showToday ? 'primary' : 'default'"
            @click="designer.updateConfig({ showToday: !designer.state.config.showToday })"
        >
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="i18n('gantt.btn.toggleCritical')">
        <el-button
            :type="designer.state.config.showCritical ? 'danger' : 'default'"
            @click="designer.updateConfig({ showCritical: !designer.state.config.showCritical })"
        >
          <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/></svg>
        </el-button>
      </el-tooltip>

      <el-button @click="emit('preview')">
        <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        {{ i18n("gantt.btn.preview") }}
      </el-button>

      <el-button type="primary" :disabled="readonly" @click="emit('save')">
        <svg class="gantt-svg-icon" viewBox="0 0 24 24" width="16" height="16"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7 3v5h8V3M7 21v-8h10v8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.gantt-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  flex-wrap: wrap;
  gap: 8px;

  .left-group,
  .right-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .gantt-svg-icon {
    vertical-align: -0.15em;
    margin-right: 4px;
  }
}
</style>
