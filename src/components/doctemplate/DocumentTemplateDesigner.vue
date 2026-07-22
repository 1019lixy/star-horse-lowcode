<script setup lang="ts" name="DocumentTemplateDesigner">
import { ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IDomEditor } from "@wangeditor/editor";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { ShSvgIcon, insertVariableBadge } from "@/components/shared";
import { useDocTemplateDesigner } from "./composables/useDocTemplateDesigner";
import DocVariablePanel from "./panels/DocVariablePanel.vue";
import DocVariableDialog from "./dialogs/DocVariableDialog.vue";
import DocPreviewDialog from "./dialogs/DocPreviewDialog.vue";
import { DOC_CATEGORY_PRESETS, DOC_TOOLBAR_BUTTONS } from "./constants";
import type { DocTemplate } from "./types";

const props = defineProps<{
    template?: DocTemplate;
    initialTemplate?: Partial<DocTemplate>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:template", v: DocTemplate): void;
    (e: "save", v: DocTemplate): void;
}>();

const designer = useDocTemplateDesigner(props.initialTemplate || props.template);
if (props.template) designer.loadData(props.template);

const editorRef = shallowRef<IDomEditor>();
const toolbarConfig = ref({ toolbarKeys: DOC_TOOLBAR_BUTTONS });
const editorConfig = ref({
    placeholder: i18n("doctemplate.editor.placeholder"),
    readOnly: props.readonly,
    MENU_CONF: {},
});

const varDialogVisible = ref(false);
const editingVarId = ref<string | null>(null);
const previewVisible = ref(false);

const handleEditorChange = (editor: IDomEditor) => {
    designer.setContent(editor.getHtml());
};

const handleEditorCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
    if (props.readonly) editor.disable();
};

const handleInsertVariable = (varName: string) => {
    const editor = editorRef.value;
    if (!editor) return;
    insertVariableBadge(editor, varName);
};

const handleEditVariable = (id: string) => {
    editingVarId.value = id;
    varDialogVisible.value = true;
};

const handleAddVariable = () => {
    editingVarId.value = null;
    varDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:template", data);
    emits("save", data);
    ElMessage.success(i18n("doctemplate.message.saved"));
};

/** 分类切换时加载对应预设内容 */
const handleCategoryChange = (category: string) => {
    const preset = DOC_CATEGORY_PRESETS.find((c) => c.value === category);
    if (preset?.template) {
        designer.setContent(preset.template);
        if (editorRef.value) {
            editorRef.value.setHtml(preset.template);
        }
    }
};
</script>

<template>
    <div class="doc-template-designer">
        <div class="designer-toolbar">
            <div class="left-group">
                <el-input
                    v-model="designer.state.name"

                    style="width: 200px"
                    :placeholder="i18n('doctemplate.template.namePlaceholder')"
                />
                <el-select
                    v-model="designer.state.category"
                    style="width: 140px"
                    :placeholder="i18n('doctemplate.template.category')"
                    @change="handleCategoryChange"
                >
                    <el-option
                        v-for="opt in DOC_CATEGORY_PRESETS"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </div>
            <div class="right-group">
                <el-button @click="previewVisible = true">
                    <ShSvgIcon name="preview" size="14px" />
                    {{ i18n("doctemplate.btn.preview") }}
                </el-button>
                <el-button type="primary" :disabled="readonly" @click="handleSave">
                    <ShSvgIcon name="save" size="14px" />
                    {{ i18n("dialog.save") }}
                </el-button>
            </div>
        </div>

        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="240px" min="180px" max="380px">
                <doc-variable-panel
                    :designer="designer"
                    :readonly="readonly"
                    @insert="handleInsertVariable"
                    @edit="handleEditVariable"
                    @add="handleAddVariable"
                />
            </el-splitter-panel>
            <el-splitter-panel>
                <div class="editor-area">
                    <div class="editor-toolbar-wrap" v-if="!readonly">
                        <Toolbar
                            :editor="editorRef"
                            :defaultConfig="toolbarConfig"
                            mode="default"
                            class="doc-toolbar"
                        />
                        <el-dropdown
                            trigger="click"
                            @command="(cmd: string) => handleInsertVariable(cmd)"
                            :disabled="designer.state.variables.length === 0"
                        >
                            <el-button class="var-btn">
                                <ShSvgIcon name="variable" size="14px" />
                                {{ i18n("template.variable.insertVariable") }}
                                <ShSvgIcon name="arrowDown" size="12px" />
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-for="v in designer.state.variables"
                                        :key="v.id"
                                        :command="v.name"
                                    >
                                        <span class="var-name">{{ v.name }}</span>
                                        <span class="var-label" v-if="v.label">{{ v.label }}</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="designer.state.variables.length === 0" disabled>
                                        {{ i18n("template.variable.noVariables") }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <Editor
                        v-model="designer.state.content"
                        :defaultConfig="editorConfig"
                        mode="default"
                        class="doc-editor"
                        @onChange="handleEditorChange"
                        @onCreated="handleEditorCreated"
                    />
                </div>
            </el-splitter-panel>
        </el-splitter>

        <doc-variable-dialog
            v-model:visible="varDialogVisible"
            :designer="designer"
            :var-id="editingVarId"
        />
        <doc-preview-dialog
            v-model:visible="previewVisible"
            :designer="designer"
        />
    </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
/* wangEditor 下拉菜单 z-index 提升，避免被 el-splitter-panel 遮挡 */
.w-e-toolbar .w-e-menu-tooltip-v5,
.w-e-toolbar .w-e-drop-panel,
.w-e-toolbar .w-e-modal,
.w-e-bar-item .w-e-drop-panel {
    z-index: 10000 !important;
}
</style>
<style lang="scss" scoped>
.doc-template-designer {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--el-bg-color-page);
    overflow: hidden;

    .designer-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color);

        .left-group,
        .right-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    .designer-body {
        flex: 1;
        overflow: hidden;

        .editor-area {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: var(--el-bg-color);

            .editor-toolbar-wrap {
                display: flex;
                align-items: center;
                border-bottom: 1px solid var(--el-border-color-lighter);
                background: var(--el-bg-color);
                position: relative;
                z-index: 100;
                .doc-toolbar {
                    flex: 1;
                    border-bottom: none;
                    overflow-x: auto;
                }
                .var-btn {
                    margin: 0 4px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }

            .doc-editor {
                flex: 1;
                overflow-y: auto;
            }
        }
    }
}
</style>
