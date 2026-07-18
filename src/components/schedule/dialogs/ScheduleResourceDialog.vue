<script setup lang="ts" name="ScheduleResourceDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { ScheduleDesigner } from "../composables/useScheduleDesigner";
import { createResource, SCHEDULE_RESOURCE_TYPE_PRESETS } from "../constants";
import type { ScheduleResource } from "../types";

const props = defineProps<{
    visible: boolean;
    designer: ScheduleDesigner;
    resourceId?: string | null;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const form = ref<ScheduleResource>(createResource());
const isNew = ref(true);

watch(
    () => [props.visible, props.resourceId] as const,
    ([visible]) => {
        if (!visible) return;
        if (props.resourceId) {
            const r = props.designer.state.resources.find((res) => res.id === props.resourceId);
            if (r) {
                form.value = { ...r, workingHours: r.workingHours ? [...r.workingHours] : [] };
                isNew.value = false;
                return;
            }
        }
        form.value = createResource();
        isNew.value = true;
    },
    { immediate: true },
);

const handleSubmit = () => {
    if (isNew.value) {
        props.designer.addResource(form.value);
    } else {
        props.designer.updateResource(form.value.id, form.value);
    }
    innerVisible.value = false;
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="isNew ? i18n('schedule.dialog.addResource') : i18n('schedule.dialog.editResource')"
        box-width="500px"
        :self-func="true"
        @merge="handleSubmit"
    >
        <el-form :model="form" label-width="100px" size="default">
            <el-form-item :label="i18n('schedule.resource.name')">
                <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item :label="i18n('schedule.resource.type')">
                <el-select v-model="form.type" style="width: 100%">
                    <el-option
                        v-for="t in SCHEDULE_RESOURCE_TYPE_PRESETS"
                        :key="t.value"
                        :label="t.label"
                        :value="t.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="i18n('schedule.resource.color')">
                <el-color-picker v-model="form.color"/>
            </el-form-item>
            <el-form-item :label="i18n('schedule.resource.avatar')">
                <el-input v-model="form.avatar" :placeholder="i18n('schedule.resource.avatarPlaceholder')"/>
            </el-form-item>
            <el-form-item :label="i18n('schedule.resource.enabled')">
                <el-switch v-model="form.enabled"/>
            </el-form-item>
        </el-form>
    </star-horse-dialog>
</template>
