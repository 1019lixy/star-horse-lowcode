<script setup lang="ts" name="GanttPropertyPanel">
import { computed, watch } from "vue";
import { i18n } from "@/lang";
import type { GanttDesigner } from "../composables/useGanttDesigner";
import { GANTT_PRIORITY_PRESETS, GANTT_STATUS_PRESETS } from "../constants";

const props = defineProps<{
  designer: GanttDesigner;
  readonly?: boolean;
}>();

/** 表单数据（直接引用选中任务，in-place 编辑） */
const formData = computed(() => props.designer.selectedTask.value);

/** 监听选中任务变化 */
watch(
  () => props.designer.selectedTaskId.value,
  () => {
    // 选中切换由 computed 自动响应
  },
);
</script>

<template>
  <div class="gantt-property-panel">
    <div class="panel-header">
      <span>{{ i18n("gantt.property.title") }}</span>
    </div>
    <div class="panel-body" v-if="formData">
      <el-form label-width="90px" :disabled="readonly">
        <el-form-item :label="i18n('gantt.task.name')">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.startDate')">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.endDate')">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.progress')">
          <el-slider v-model="formData.progress" :min="0" :max="100" />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.status')">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option
              v-for="s in GANTT_STATUS_PRESETS"
              :key="s.value"
              :label="s.label"
              :value="s.value"
            >
              <span :style="{ color: s.color }">●</span>
              {{ s.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.priority')">
          <el-select v-model="formData.priority" style="width: 100%">
            <el-option
              v-for="p in GANTT_PRIORITY_PRESETS"
              :key="p.value"
              :label="p.label"
              :value="p.value"
            >
              <span :style="{ color: p.color }">●</span>
              {{ p.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.assignee')">
          <el-input v-model="formData.assignee" />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.workHours')">
          <el-input-number
            v-model="formData.workHours"
            :min="0"
            :precision="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.isMilestone')">
          <el-switch v-model="formData.isMilestone" />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.isCritical')">
          <el-switch v-model="formData.isCritical" />
        </el-form-item>
        <el-form-item :label="i18n('gantt.task.remark')">
          <el-input v-model="formData.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </div>
    <div class="panel-empty" v-else>
      <el-empty :description="i18n('gantt.property.empty')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gantt-property-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  overflow: hidden;

  .panel-header {
    padding: 8px 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--el-border-color);
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 12px;
  }

  .panel-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
