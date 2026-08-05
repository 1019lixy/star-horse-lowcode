<script setup lang="ts" name="PivotTable">
import { ref } from "vue";
import { usePivotDesigner } from "./composables/usePivotDesigner";
import PivotToolbar from "./panels/PivotToolbar.vue";
import PivotFieldPanel from "./panels/PivotFieldPanel.vue";
import PivotTablePanel from "./panels/PivotTablePanel.vue";
import PivotChartPanel from "./panels/PivotChartPanel.vue";
import PivotFieldDialog from "./dialogs/PivotFieldDialog.vue";
import PivotDataDialog from "./dialogs/PivotDataDialog.vue";
import { DesignerMobileShell } from "@/components/shared";
import type { PivotData } from "./types";

const props = defineProps<{
    pivot?: PivotData;
    initialPivot?: Partial<PivotData>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:pivot", v: PivotData): void;
    (e: "save", v: PivotData): void;
}>();

const designer = usePivotDesigner(props.initialPivot || props.pivot);
if (props.pivot) designer.loadData(props.pivot);

const fieldDialogVisible = ref(false);
const editingFieldName = ref<string | null>(null);
const dataDialogVisible = ref(false);

const handleEditField = (name: string) => {
    editingFieldName.value = name;
    fieldDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:pivot", data);
    emits("save", data);
};

/** 打开数据管理弹窗（供父组件通过 ref 调用） */
const openDataManager = () => {
    dataDialogVisible.value = true;
};

defineExpose({
    openDataManager,
    designer,
});
</script>

<template>
    <div class="pivot-table-component">
        <DesignerMobileShell
            :panels="[
                { key: 'fields', label: '字段', side: 'left', width: 260, min: 200 },
            ]"
        >
            <template #toolbar>
                <pivot-toolbar
                    :designer="designer"
                    :readonly="readonly"
                    @save="handleSave"
                    @preview="dataDialogVisible = true"
                />
            </template>
            <template #canvas>
                <div class="content-area">
                    <pivot-chart-panel v-if="designer.showChart" :designer="designer"/>
                    <pivot-table-panel v-else :designer="designer"/>
                </div>
            </template>
            <template #panel-fields>
                <pivot-field-panel
                    :designer="designer"
                    :readonly="readonly"
                    @edit-field="handleEditField"
                />
            </template>
        </DesignerMobileShell>

        <pivot-field-dialog
            v-model:visible="fieldDialogVisible"
            :designer="designer"
            :field-name="editingFieldName"
        />
        <pivot-data-dialog
            v-model:visible="dataDialogVisible"
            :designer="designer"
        />
    </div>
</template>

<style lang="scss" scoped>
.pivot-table-component {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .content-area {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>
