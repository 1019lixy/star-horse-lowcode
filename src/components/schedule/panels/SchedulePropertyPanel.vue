<script setup lang="ts" name="SchedulePropertyPanel">
import { computed } from "vue";
import { i18n } from "@/lang";
import type { ScheduleDesigner } from "../composables/useScheduleDesigner";
import {
    SCHEDULE_EVENT_TYPE_PRESETS,
    SCHEDULE_RESOURCE_TYPE_PRESETS,
} from "../constants";
import { formatHourMinute, parseTime } from "../utils/ScheduleDateUtils";

const props = defineProps<{
    designer: ScheduleDesigner;
    readonly?: boolean;
}>();

/** 选中事件表单数据 */
const formData = computed(() => props.designer.selectedEvent.value);

/** 选中资源表单数据 */
const resourceData = computed(() => props.designer.selectedResource.value);

/** 是否有选中 */
const hasSelection = computed(() => formData.value || resourceData.value);

/** 事件类型标签 */
const getEventTypeLabel = (type: string) =>
    SCHEDULE_EVENT_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;

/** 资源类型标签 */
const getResTypeLabel = (type: string) =>
    SCHEDULE_RESOURCE_TYPE_PRESETS.find((t) => t.value === type)?.label ?? type;
</script>

<template>
    <div class="schedule-property-panel">
        <div class="panel-header">
            <span>{{ i18n("schedule.property.title") }}</span>
        </div>

        <!-- 事件属性 -->
        <div class="panel-body" v-if="formData">
            <el-form label-width="80px" :disabled="readonly">
                <el-form-item :label="i18n('schedule.event.title')">
                    <el-input v-model="formData.title"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.type')">
                    <el-select v-model="formData.type" style="width: 100%">
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
                <el-form-item :label="i18n('schedule.event.startTime')">
                    <el-date-picker
                        v-model="formData.startTime"
                        type="datetime"
                        value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                        style="width: 100%"
                    />
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.endTime')">
                    <el-date-picker
                        v-model="formData.endTime"
                        type="datetime"
                        value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                        style="width: 100%"
                    />
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.resource')">
                    <el-select v-model="formData.resourceId" style="width: 100%">
                        <el-option
                            v-for="r in designer.sortedResources.value"
                            :key="r.id"
                            :label="r.name"
                            :value="r.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.allDay')">
                    <el-switch v-model="formData.allDay"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.location')">
                    <el-input v-model="formData.location"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.description')">
                    <el-input v-model="formData.description" type="textarea" :rows="3"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.event.remark')">
                    <el-input v-model="formData.remark" type="textarea" :rows="2"/>
                </el-form-item>
            </el-form>
        </div>

        <!-- 资源属性 -->
        <div class="panel-body" v-else-if="resourceData">
            <el-form label-width="80px" :disabled="readonly">
                <el-form-item :label="i18n('schedule.resource.name')">
                    <el-input v-model="resourceData.name"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.resource.type')">
                    <el-select v-model="resourceData.type" style="width: 100%">
                        <el-option
                            v-for="t in SCHEDULE_RESOURCE_TYPE_PRESETS"
                            :key="t.value"
                            :label="t.label"
                            :value="t.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="i18n('schedule.resource.color')">
                    <el-color-picker v-model="resourceData.color"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.resource.avatar')">
                    <el-input v-model="resourceData.avatar"/>
                </el-form-item>
                <el-form-item :label="i18n('schedule.resource.enabled')">
                    <el-switch v-model="resourceData.enabled"/>
                </el-form-item>
            </el-form>
        </div>

        <!-- 无选中 -->
        <div class="panel-empty" v-else>
            <el-empty :description="i18n('schedule.property.empty')"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.schedule-property-panel {
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
