<script setup lang="ts" name="DocumentTemplateDesigner">
import { ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IDomEditor } from "@wangeditor/editor";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
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
    editor.insertText(`\${${varName}}`);
};

const handleEditVariable = (id: string) => {
    editingVarId.value = id;
    varDialogVisible.value = true;
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:template", data);
    emits("save", data);
    ElMessage.success(i18n("doctemplate.message.saved"));
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
                <el-button  @click="previewVisible = true">
                    <el-icon><View/></el-icon>
                    {{ i18n("doctemplate.btn.preview") }}
                </el-button>
                <el-button  type="primary" :disabled="readonly" @click="handleSave">
                    <el-icon><Check/></el-icon>
                    {{ i18n("dialog.save") }}
                </el-button>
            </div>
        </div>

        <div class="designer-body">
            <doc-variable-panel
                :designer="designer"
                :readonly="readonly"
                @insert="handleInsertVariable"
                @edit="handleEditVariable"
            />
            <div class="editor-area">
                <Toolbar
                    v-if="!readonly"
                    :editor="editorRef"
                    :defaultConfig="toolbarConfig"
                    mode="default"
                    class="doc-toolbar"
                />
                <Editor
                    v-model="designer.state.content"
                    :defaultConfig="editorConfig"
                    mode="default"
                    class="doc-editor"
                    @onChange="handleEditorChange"
                    @onCreated="handleEditorCreated"
                />
            </div>
        </div>

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

<script lang="ts">
import { View, Check } from "@element-plus/icons-vue";
export default { components: { View, Check } };
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
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
        display: flex;
        overflow: hidden;

        .editor-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--el-bg-color);

            .doc-toolbar {
                border-bottom: 1px solid var(--el-border-color-lighter);
            }

            .doc-editor {
                flex: 1;
                overflow-y: auto;
            }
        }
    }
}
</style>
