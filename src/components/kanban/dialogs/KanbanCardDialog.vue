<script setup lang="ts" name="KanbanCardDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { KanbanDesigner } from "../composables/useKanbanDesigner";
import { createCard, KANBAN_PRIORITY_PRESETS } from "../constants";
import type { KanbanCard, KanbanCardLabel } from "../types";

const props = defineProps<{
    visible: boolean;
    designer: KanbanDesigner;
    cardId?: string | null;
    columnId?: string;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const form = ref<KanbanCard>(createCard());
const isNew = ref(true);
const labelInput = ref("");

watch(
    () => [props.visible, props.cardId] as const,
    ([visible]) => {
        if (!visible) return;
        if (props.cardId) {
            const card = props.designer.state.cards.find((c) => c.id === props.cardId);
            if (card) {
                form.value = { ...card, labels: card.labels ? [...card.labels] : [] };
                isNew.value = false;
                return;
            }
        }
        form.value = createCard({ columnId: props.columnId || "col_todo" });
        isNew.value = true;
    },
    { immediate: true },
);

const handleSubmit = () => {
    if (isNew.value) {
        props.designer.addCard(form.value.columnId, form.value);
    } else {
        props.designer.updateCard(form.value.id, form.value);
    }
    innerVisible.value = false;
};

const handleAddLabel = () => {
    if (!labelInput.value.trim()) return;
    if (!form.value.labels) form.value.labels = [];
    form.value.labels.push({ text: labelInput.value.trim(), color: "#409EFF" });
    labelInput.value = "";
};

const handleRemoveLabel = (idx: number) => {
    form.value.labels?.splice(idx, 1);
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="isNew ? i18n('kanban.dialog.addCard') : i18n('kanban.dialog.editCard')"
        box-width="600px"
        :self-func="true"
        @merge="handleSubmit"
    >
        <el-form :model="form" label-width="90px" size="default">
            <el-form-item :label="i18n('kanban.card.title')">
                <el-input v-model="form.title"/>
            </el-form-item>
            <el-form-item :label="i18n('kanban.card.column')">
                <el-select v-model="form.columnId" style="width: 100%">
                    <el-option
                        v-for="col in designer.sortedColumns.value"
                        :key="col.id"
                        :label="col.name"
                        :value="col.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="i18n('kanban.card.description')">
                <el-input v-model="form.description" type="textarea" :rows="3"/>
            </el-form-item>
            <el-row :gutter="12">
                <el-col :span="12">
                    <el-form-item :label="i18n('kanban.card.priority')">
                        <el-select v-model="form.priority" style="width: 100%">
                            <el-option
                                v-for="p in KANBAN_PRIORITY_PRESETS"
                                :key="p.value"
                                :label="p.label"
                                :value="p.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n('kanban.card.assignee')">
                        <el-input v-model="form.assignee"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="12">
                <el-col :span="12">
                    <el-form-item :label="i18n('kanban.card.dueDate')">
                        <el-date-picker
                            v-model="form.dueDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="i18n('kanban.card.estimate')">
                        <el-input-number v-model="form.estimate" :min="0" :precision="1" style="width: 100%"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item :label="i18n('kanban.card.labels')">
                <div class="labels-row">
                    <el-tag
                        v-for="(label, idx) in form.labels"
                        :key="idx"
                        :color="label.color"
                        effect="dark"
                        closable
                        @close="handleRemoveLabel(idx)"
                    >
                        {{ label.text }}
                    </el-tag>
                    <el-input
                        v-model="labelInput"

                        style="width: 120px"
                        @keyup.enter="handleAddLabel"
                    />
                    <el-button  @click="handleAddLabel">
                        {{ i18n("kanban.btn.addLabel") }}
                    </el-button>
                </div>
            </el-form-item>
        </el-form>
    </star-horse-dialog>
</template>

<style lang="scss" scoped>
.labels-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
</style>
