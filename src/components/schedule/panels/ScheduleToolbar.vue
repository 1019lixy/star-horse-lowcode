<script setup lang="ts" name="ScheduleToolbar">
import { i18n } from "@/lang";
import type { ScheduleDesigner } from "../composables/useScheduleDesigner";
import { SCHEDULE_VIEW_MODE_OPTIONS } from "../constants";
import { addDays, startOfWeek } from "../utils/ScheduleDateUtils";
import type { ScheduleViewMode } from "../types";

const props = defineProps<{
    designer: ScheduleDesigner;
    readonly?: boolean;
}>();

const emit = defineEmits<{
    (e: "save"): void;
    (e: "preview"): void;
    (e: "addEvent"): void;
}>();

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
    // 切换模式时锚点跳到本周一
    props.designer.setAnchorDate(startOfWeek(new Date()));
};
</script>

<template>
    <div class="schedule-toolbar">
        <div class="left-group">
            <el-button-group>
                <el-button  :disabled="readonly" @click="designer.undo()">
                    <el-icon><Back/></el-icon>
                </el-button>
                <el-button  :disabled="readonly" @click="designer.redo()">
                    <el-icon><Right/></el-icon>
                </el-button>
            </el-button-group>

            <el-button-group>
                <el-button  @click="handlePrev">
                    <el-icon><ArrowLeft/></el-icon>
                </el-button>
                <el-button  @click="handleToday">
                    {{ i18n("schedule.btn.today") }}
                </el-button>
                <el-button  @click="handleNext">
                    <el-icon><ArrowRight/></el-icon>
                </el-button>
            </el-button-group>

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
            <el-button  :disabled="readonly" @click="emit('addEvent')">
                <el-icon><Plus/></el-icon>
                {{ i18n("schedule.btn.addEvent") }}
            </el-button>
            <el-button  @click="emit('preview')">
                <el-icon><View/></el-icon>
                {{ i18n("schedule.btn.preview") }}
            </el-button>
            <el-button  type="primary" :disabled="readonly" @click="emit('save')">
                <el-icon><Check/></el-icon>
                {{ i18n("dialog.save") }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { Back, Right, ArrowLeft, ArrowRight, Plus, View, Check } from "@element-plus/icons-vue";
export default { components: { Back, Right, ArrowLeft, ArrowRight, Plus, View, Check } };
</script>

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
}
</style>
