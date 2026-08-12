<script setup lang="ts" name="GanttTaskDialog">
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {GanttDesigner} from "../composables/useGanttDesigner";
import {createTask, GANTT_PRIORITY_PRESETS, GANTT_STATUS_PRESETS} from "../constants";
import type {GanttTask} from "../types";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: GanttDesigner;
  /** 任务ID，为空时新建 */
  taskId?: string | null;
  /** 父任务ID */
  parentId?: string | null;
  dialogType?:"dialog"|"drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

/** 表单副本（避免直接 mutate） */
const form = ref<GanttTask>(createTask());
const isNew = ref(true);

watch(
    () => [props.visible, props.taskId] as const,
    ([visible]) => {
      if (!visible) return;
      if (props.taskId) {
        const task = props.designer.state.tasks.find((t) => t.id === props.taskId);
        if (task) {
          form.value = {...task};
          isNew.value = false;
          return;
        }
      }
      // 新建任务
      const parent = props.parentId
          ? props.designer.state.tasks.find((t) => t.id === props.parentId)
          : null;
      form.value = createTask({
        parentId: props.parentId ?? null,
        level: parent ? parent.level + 1 : 0,
      });
      isNew.value = true;
    },
    {immediate: true},
);

const handleSubmit = () => {
  if (isNew.value) {
    props.designer.addTask(form.value);
  } else {
    props.designer.updateTask(form.value.id, form.value);
  }
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="isNew ? i18n('gantt.dialog.addTask') : i18n('gantt.dialog.editTask')"
      box-width="600px"
      :self-func="true"
      @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('gantt.task.name')">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.startDate')">
            <el-date-picker
                v-model="form.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.endDate')">
            <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.status')">
            <el-select v-model="form.status" style="width: 100%">
              <el-option
                  v-for="s in GANTT_STATUS_PRESETS"
                  :key="s.value"
                  :label="s.label"
                  :value="s.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.priority')">
            <el-select v-model="form.priority" style="width: 100%">
              <el-option
                  v-for="p in GANTT_PRIORITY_PRESETS"
                  :key="p.value"
                  :label="p.label"
                  :value="p.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.assignee')">
            <el-input v-model="form.assignee"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.workHours')">
            <el-input-number v-model="form.workHours" :min="0" :precision="1" style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="i18n('gantt.task.progress')">
        <el-slider v-model="form.progress"/>
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.isMilestone')">
            <el-switch v-model="form.isMilestone"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('gantt.task.isCritical')">
            <el-switch v-model="form.isCritical"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="i18n('gantt.task.remark')">
        <el-input v-model="form.remark" type="textarea" :rows="3"/>
      </el-form-item>
    </el-form>
  </star-horse-panel>
</template>
