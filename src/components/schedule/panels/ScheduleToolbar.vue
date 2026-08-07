<script setup lang="ts" name="ScheduleToolbar">
import {computed} from "vue";
import {i18n} from "@/lang";
import type {ScheduleDesigner} from "../composables/useScheduleDesigner";
import {SCHEDULE_VIEW_MODE_OPTIONS} from "../constants";
import {addDays, startOfWeek} from "../utils/ScheduleDateUtils";
import type {ScheduleViewMode} from "../types";

const props = defineProps<{
  designer: ScheduleDesigner;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "save"): void;
  (e: "preview"): void;
  (e: "addEvent"): void;
  (e: "insertBefore"): void;
  (e: "insertAfter"): void;
}>();

const selectedEventId = computed(() => props.designer.selectedEventId.value);

const handlePrev = () => {
  const mode = props.designer.state.config.viewMode;
  const cur = props.designer.anchorDate.value;
  if (mode === "day") props.designer.setAnchorDate(addDays(cur, -1));
  else if (mode === "week") props.designer.setAnchorDate(addDays(cur, -7));
  else {
    const d = new Date(cur);
    d.setMonth(d.getMonth() - 1);
    props.designer.setAnchorDate(d);
  }
};

const handleNext = () => {
  const mode = props.designer.state.config.viewMode;
  const cur = props.designer.anchorDate.value;
  if (mode === "day") props.designer.setAnchorDate(addDays(cur, 1));
  else if (mode === "week") props.designer.setAnchorDate(addDays(cur, 7));
  else {
    const d = new Date(cur);
    d.setMonth(d.getMonth() + 1);
    props.designer.setAnchorDate(d);
  }
};

const handleToday = () => {
  props.designer.setAnchorDate(new Date());
};

const handleModeChange = (mode: ScheduleViewMode) => {
  props.designer.setViewMode(mode);
  props.designer.setAnchorDate(startOfWeek(new Date()));
};
</script>

<template>
  <div class="schedule-toolbar">
    <div class="left-group">
      <!-- 添加/插入/删除事件 -->
      <el-button-group>
        <el-button :disabled="readonly" @click="emit('addEvent')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          {{ i18n("schedule.btn.addEvent") }}
        </el-button>
        <el-button :disabled="readonly || !selectedEventId" @click="emit('insertBefore')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 5v6M5 11h14M12 17v2" stroke="currentColor" stroke-width="2" fill="none"
                  stroke-linecap="round"/>
          </svg>
          {{ i18n("schedule.btn.insertBefore") }}
        </el-button>
        <el-button :disabled="readonly || !selectedEventId" @click="emit('insertAfter')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M12 3v2M5 7h14M12 13v6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          {{ i18n("schedule.btn.insertAfter") }}
        </el-button>
        <el-button
            :disabled="readonly || !selectedEventId"
            @click="selectedEventId && designer.removeEvent(selectedEventId)"
        >
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 7h12M9 7V5h6v2M8 7v12h8V7M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.5" fill="none"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ i18n("schedule.btn.removeEvent") }}
        </el-button>
      </el-button-group>

      <!-- 撤销/重做 -->
      <el-button-group>
        <el-button :disabled="readonly" @click="designer.undo()" :title="i18n('schedule.btn.undo')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M7 11L3 7l4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M3 7h12a5 5 0 015 5v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </el-button>
        <el-button :disabled="readonly" @click="designer.redo()" :title="i18n('schedule.btn.redo')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M17 11l4-4-4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M21 7H9a5 5 0 00-5 5v2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
        </el-button>
      </el-button-group>

      <!-- 导航 -->
      <el-button-group>
        <el-button @click="handlePrev" :title="i18n('schedule.btn.prev')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </el-button>
        <el-button @click="handleToday">
          {{ i18n("schedule.btn.today") }}
        </el-button>
        <el-button @click="handleNext" :title="i18n('schedule.btn.next')">
          <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </el-button>
      </el-button-group>

      <!-- 视图模式 -->
      <el-radio-group
          :model-value="designer.state.config.viewMode"
          @update:model-value="(v) => handleModeChange(v as ScheduleViewMode)"
      >
        <el-radio-button
            v-for="opt in SCHEDULE_VIEW_MODE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
        >
          {{ opt.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="right-group">
      <el-button @click="emit('preview')">
        <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.5"
                fill="none"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        {{ i18n("schedule.btn.preview") }}
      </el-button>
      <el-button type="primary" :disabled="readonly" @click="emit('save')">
        <svg class="sched-svg-icon" viewBox="0 0 24 24" width="16" height="16">
          <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" stroke="currentColor" stroke-width="1.5"
                fill="none"/>
          <path d="M7 3v5h8V3M7 21v-8h10v8" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.schedule-toolbar {
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

  .sched-svg-icon {
    vertical-align: -0.15em;
    margin-right: 4px;
  }
}
</style>
