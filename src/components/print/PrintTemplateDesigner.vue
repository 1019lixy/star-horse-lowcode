<script setup lang="ts" name="PrintTemplateDesigner">
/**
 * 打印模板设计器 - 主组件
 *
 * 职责：编排左侧元素面板 / 中央画布 / 右侧属性面板 / 顶部工具栏 / 底部图层
 * 不直接处理渲染逻辑（由 renderers/* 负责）
 * 不直接处理数据源管理（由 PrintDataSourceDialog 负责）
 *
 * 用法：
 *   <print-template-designer
 *     v-model:template="tpl"
 *     :readonly="false"
 *     @save="onSave"
 *     @preview="onPreview"
 *   />
 */
import { computed, ref } from "vue";
import { i18n } from "@/lang";
import { usePrintDesigner } from "./composables/usePrintDesigner";
import PrintToolbar from "./panels/PrintToolbar.vue";
import PrintElementPanel from "./panels/PrintElementPanel.vue";
import PrintCanvas from "./panels/PrintCanvas.vue";
import PrintPropertyPanel from "./panels/PrintPropertyPanel.vue";
import PrintLayerPanel from "./panels/PrintLayerPanel.vue";
import PrintPreviewDialog from "./dialogs/PrintPreviewDialog.vue";
import PrintDataSourceDialog from "./dialogs/PrintDataSourceDialog.vue";
import PrintTemplateManagerDialog from "./dialogs/PrintTemplateManagerDialog.vue";
import type { PrintTemplate } from "./types";

const props = defineProps<{
    /** 双向绑定模板 */
    template?: PrintTemplate;
    /** 初始模板（v-model 未绑定时使用） */
    initialTemplate?: Partial<PrintTemplate>;
    /** 只读模式 */
    readonly?: boolean;
    /** 已保存模板列表（用于模板管理弹窗） */
    savedTemplates?: PrintTemplate[];
    /** 操作员名（预览时使用） */
    operator?: string;
    /** 打印机名（预览时使用） */
    printerName?: string;
}>();

const emits = defineEmits<{
    (e: "update:template", v: PrintTemplate): void;
    (e: "save", v: PrintTemplate): void;
    (e: "preview", v: PrintTemplate): void;
    (e: "load-template", v: PrintTemplate): void;
    (e: "delete-template", id: string): void;
    (e: "export-template", v: PrintTemplate): void;
}>();

const designer = usePrintDesigner(props.initialTemplate || props.template);

// 同步外部 template
if (props.template) {
    designer.loadTemplate(props.template);
}

const previewVisible = ref(false);
const dsVisible = ref(false);
const tplMgrVisible = ref(false);

const previewData = ref<Record<string, any>>({});

const handleAddElement = (type: string) => {
    designer.addElement(type);
};

const handleSave = () => {
    const tpl = designer.getTemplate();
    emits("update:template", tpl);
    emits("save", tpl);
};

const handlePreview = () => {
    // 生成预览数据（使用数据源中的 sample 值）
    const data: Record<string, any> = {};
    for (const ds of designer.state.template.dataSources) {
        const obj: Record<string, any> = {};
        for (const f of ds.fields) {
            obj[f.name] = f.sample;
        }
        data[ds.id] = obj;
    }
    previewData.value = data;
    previewVisible.value = true;
    const tpl = designer.getTemplate();
    emits("preview", tpl);
};

const handleDatasource = () => {
    dsVisible.value = true;
};

const handleManage = () => {
    tplMgrVisible.value = true;
};

const handleDsSave = (list: typeof designer.state.template.dataSources) => {
    designer.state.template.dataSources = list;
    designer.pushHistory();
};

const handleLoadTemplate = (tpl: PrintTemplate) => {
    designer.loadTemplate(tpl);
    emits("load-template", tpl);
};

const handleDeleteTemplate = (id: string) => {
    emits("delete-template", id);
};

const handleExportTemplate = (tpl: PrintTemplate) => {
    emits("export-template", tpl);
};

const handlePreviewPrint = (target: string, content: string) => {
    // 实际打印交由外部业务层处理（可能调用 Tauri printer 模块）
    console.log("[Print]", target, "content length:", content.length);
};

const savedTemplatesList = computed(() => props.savedTemplates || []);
</script>

<template>
    <div class="print-template-designer" :class="{ readonly }">
        <print-toolbar
            :designer="designer"
            :readonly="readonly"
            @save="handleSave"
            @preview="handlePreview"
            @datasource="handleDatasource"
            @manage="handleManage"
        />
        <div class="designer-body">
            <print-element-panel
                :readonly="readonly"
                @add="handleAddElement"
                @drag-start="() => {}"
            />
            <print-canvas :designer="designer"/>
            <div class="right-panel">
                <div class="right-top">
                    <print-property-panel :designer="designer"/>
                </div>
                <div class="right-bottom">
                    <print-layer-panel :designer="designer"/>
                </div>
            </div>
        </div>

        <!-- 预览弹窗 -->
        <print-preview-dialog
            v-model:visible="previewVisible"
            :template="designer.state.template"
            :data="previewData"
            :operator="operator"
            :printer-name="printerName"
            @print="handlePreviewPrint"
        />

        <!-- 数据源弹窗 -->
        <print-data-source-dialog
            v-model:visible="dsVisible"
            :data-sources="designer.state.template.dataSources"
            @save="handleDsSave"
        />

        <!-- 模板管理弹窗 -->
        <print-template-manager-dialog
            v-model:visible="tplMgrVisible"
            :saved-templates="savedTemplatesList"
            @load="handleLoadTemplate"
            @delete="handleDeleteTemplate"
            @export="handleExportTemplate"
        />
    </div>
</template>

<style lang="scss" scoped>
.print-template-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    &.readonly {
        opacity: 0.95;
    }

    .designer-body {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .right-panel {
        width: 280px;
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--el-border-color-lighter);
        flex-shrink: 0;

        .right-top {
            flex: 1;
            overflow: hidden;
            border-bottom: 1px solid var(--el-border-color-lighter);
        }

        .right-bottom {
            height: 240px;
            overflow: hidden;
            flex-shrink: 0;
        }
    }
}
</style>
