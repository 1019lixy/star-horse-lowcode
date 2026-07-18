<script setup lang="ts" name="DocVariableDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { DocTemplateDesigner } from "../composables/useDocTemplateDesigner";
import { createVariable, DOC_VARIABLE_TYPE_PRESETS } from "../constants";
import type { DocVariable } from "../types";

const props = defineProps<{
    visible: boolean;
    designer: DocTemplateDesigner;
    varId?: string | null;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const form = ref<DocVariable>(createVariable());
const isNew = ref(true);

watch(
    () => [props.visible, props.varId] as const,
    ([visible]) => {
        if (!visible) return;
        if (props.varId) {
            const v = props.designer.state.variables.find((vv) => vv.id === props.varId);
            if (v) {
                form.value = { ...v, options: v.options ? [...v.options] : [] };
                isNew.value = false;
                return;
            }
        }
        form.value = createVariable();
        isNew.value = true;
    },
    { immediate: true },
);

const handleSubmit = () => {
    if (isNew.value) {
        props.designer.addVariable(form.value);
    } else {
        props.designer.updateVariable(form.value.id, form.value);
    }
    innerVisible.value = false;
};

const handleAddOption = () => {
    if (!form.value.options) form.value.options = [];
    form.value.options.push({ label: "", value: "" });
};

const handleRemoveOption = (idx: number) => {
    form.value.options?.splice(idx, 1);
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="isNew ? i18n('doctemplate.dialog.addVar') : i18n('doctemplate.dialog.editVar')"
        box-width="500px"
        :self-func="true"
        @merge="handleSubmit"
    >
        <el-form :model="form" label-width="100px" size="default">
            <el-form-item :label="i18n('doctemplate.variable.name')">
                <el-input v-model="form.name" :disabled="!isNew" :placeholder="i18n('doctemplate.variable.namePlaceholder')"/>
            </el-form-item>
            <el-form-item :label="i18n('doctemplate.variable.label')">
                <el-input v-model="form.label"/>
            </el-form-item>
            <el-form-item :label="i18n('doctemplate.variable.type')">
                <el-select v-model="form.type" style="width: 100%">
                    <el-option
                        v-for="opt in DOC_VARIABLE_TYPE_PRESETS"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="i18n('doctemplate.variable.defaultValue')">
                <el-input v-model="form.defaultValue"/>
            </el-form-item>
            <el-form-item :label="i18n('doctemplate.variable.required')">
                <el-switch v-model="form.required"/>
            </el-form-item>
            <el-form-item :label="i18n('doctemplate.variable.description')">
                <el-input v-model="form.description" type="textarea" :rows="2"/>
            </el-form-item>

            <template v-if="form.type === 'select'">
                <el-divider>{{ i18n("doctemplate.variable.options") }}</el-divider>
                <div v-for="(opt, idx) in form.options" :key="idx" class="opt-row">
                    <el-input v-model="opt.label"  :placeholder="i18n('doctemplate.variable.optionLabel')"/>
                    <el-input v-model="opt.value"  :placeholder="i18n('doctemplate.variable.optionValue')"/>
                    <el-button  text @click="handleRemoveOption(idx)">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
                <el-button  @click="handleAddOption" style="width: 100%; margin-top: 4px;">
                    <el-icon><Plus/></el-icon>
                    {{ i18n("doctemplate.variable.addOption") }}
                </el-button>
            </template>
        </el-form>
    </star-horse-dialog>
</template>

<script lang="ts">
import { Delete, Plus } from "@element-plus/icons-vue";
export default { components: { Delete, Plus } };
</script>

<style lang="scss" scoped>
.opt-row {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
}
</style>
