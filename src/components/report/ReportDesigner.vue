<script setup lang="ts" name="ReportDesigner">
/**
 * 单元格报表设计器 - 主组件
 *
 * 编排：工具栏 + 画布 + 属性面板 + 数据集弹窗 + 预览弹窗
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { useReportDesigner } from "./composables/useReportDesigner";
import ReportToolbar from "./panels/ReportToolbar.vue";
import ReportCanvas from "./panels/ReportCanvas.vue";
import ReportPropertyPanel from "./panels/ReportPropertyPanel.vue";
import ReportDatasetDialog from "./dialogs/ReportDatasetDialog.vue";
import ReportPreviewDialog from "./dialogs/ReportPreviewDialog.vue";
import { DesignerMobileShell } from "@/components/shared";
import type { ReportTemplate } from "./types";

const props = defineProps<{
    template?: ReportTemplate;
    initialTemplate?: Partial<ReportTemplate>;
    readonly?: boolean;
    operator?: string;
}>();

const emits = defineEmits<{
    (e: "update:template", v: ReportTemplate): void;
    (e: "save", v: ReportTemplate): void;
    (e: "preview", v: ReportTemplate): void;
}>();

const designer = useReportDesigner(props.initialTemplate || props.template);
if (props.template) designer.loadTemplate(props.template);

const datasetVisible = ref(false);
const previewVisible = ref(false);
const previewData = ref<Record<string, any[]>>({});

const handleSave = () => {
    const tpl = designer.getTemplate();
    emits("update:template", tpl);
    emits("save", tpl);
};

const handlePreview = () => {
    previewData.value = {};
    for (const ds of designer.state.template.datasets) {
        previewData.value[ds.name] = [];
    }
    previewVisible.value = true;
    emits("preview", designer.getTemplate());
};

const handleDataset = () => {
    datasetVisible.value = true;
};

const handleDatasetSave = (list: typeof designer.state.template.datasets) => {
    designer.state.template.datasets = list;
    designer.pushHistory();
};
</script>

<template>
    <div class="report-designer" :class="{ readonly }">
        <DesignerMobileShell
            :panels="[
                { key: 'props', label: '属性', side: 'right', width: 280, min: 220 },
            ]"
        >
            <template #toolbar>
                <report-toolbar
                    :designer="designer"
                    :readonly="readonly"
                    @save="handleSave"
                    @preview="handlePreview"
                    @dataset="handleDataset"
                    @param="() => {}"
                    @paper="() => {}"
                />
            </template>
            <template #canvas>
                <report-canvas :designer="designer"/>
            </template>
            <template #panel-props>
                <report-property-panel :designer="designer"/>
            </template>
        </DesignerMobileShell>

        <report-dataset-dialog
            v-model:visible="datasetVisible"
            :datasets="designer.state.template.datasets"
            @save="handleDatasetSave"
        />
        <report-preview-dialog
            v-model:visible="previewVisible"
            :template="designer.state.template"
            :data="previewData"
            :operator="operator"
        />
    </div>
</template>

<style lang="scss" scoped>
.report-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;
}
</style>
