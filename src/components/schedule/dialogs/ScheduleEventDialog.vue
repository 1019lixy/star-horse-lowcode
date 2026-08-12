<script setup lang="ts" name="ScheduleEventDialog">
import {computed, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type {ScheduleDesigner} from "../composables/useScheduleDesigner";
import {createEvent, SCHEDULE_EVENT_TYPE_PRESETS} from "../constants";
import type {ScheduleEvent} from "../types";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  designer: ScheduleDesigner;
  eventId?: string | null;
  defaultStartTime?: string;
  defaultResourceId?: string;
  dialogType?:"dialog"|"drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<ScheduleEvent>(createEvent());
const isNew = ref(true);

watch(
    () => [props.visible, props.eventId] as const,
    ([visible]) => {
      if (!visible) return;
      if (props.eventId) {
        const event = props.designer.state.events.find((e) => e.id === props.eventId);
        if (event) {
          form.value = {...event};
          isNew.value = false;
          return;
        }
      }
      form.value = createEvent({
        startTime: props.defaultStartTime ?? new Date().toISOString(),
        resourceId: props.defaultResourceId ?? "",
      });
      isNew.value = true;
    },
    {immediate: true},
);

const handleSubmit = () => {
  if (!form.value.resourceId) {
    ElMessage.warning(i18n("schedule.message.resourceRequired"));
    return;
  }
  if (isNew.value) {
    const added = props.designer.addEvent(form.value);
    if (!added) {
      ElMessage.warning(i18n("schedule.message.conflict"));
      return;
    }
  } else {
    props.designer.updateEvent(form.value.id, form.value);
  }
  innerVisible.value = false;
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="isNew ? i18n('schedule.dialog.addEvent') : i18n('schedule.dialog.editEvent')"
      box-width="600px"
      :self-func="true"
      @merge="handleSubmit"
  >
    <el-form :model="form" label-width="100px" size="default">
      <el-form-item :label="i18n('schedule.event.title')">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item :label="i18n('schedule.event.resource')">
        <el-select v-model="form.resourceId" style="width: 100%">
          <el-option
              v-for="r in designer.sortedResources.value"
              :key="r.id"
              :label="r.name"
              :value="r.id"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item :label="i18n('schedule.event.startTime')">
            <el-date-picker
                v-model="form.startTime"
                type="datetime"
                value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="i18n('schedule.event.endTime')">
            <el-date-picker
                v-model="form.endTime"
                type="datetime"
                value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="i18n('schedule.event.type')">
        <el-select v-model="form.type" style="width: 100%">
          <el-option
              v-for="t in SCHEDULE_EVENT_TYPE_PRESETS"
              :key="t.value"
              :label="t.label"
              :value="t.value"
          >
            <span :style="{ color: t.color }">●</span>
            {{ t.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n('schedule.event.allDay')">
        <el-switch v-model="form.allDay"/>
      </el-form-item>
      <el-form-item :label="i18n('schedule.event.location')">
        <el-input v-model="form.location"/>
      </el-form-item>
      <el-form-item :label="i18n('schedule.event.description')">
        <el-input v-model="form.description" type="textarea" :rows="3"/>
      </el-form-item>
      <el-form-item :label="i18n('schedule.event.remark')">
        <el-input v-model="form.remark" type="textarea" :rows="2"/>
      </el-form-item>
    </el-form>
  </star-horse-panel>
</template>
