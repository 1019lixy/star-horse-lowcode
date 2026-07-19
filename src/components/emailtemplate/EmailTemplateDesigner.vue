<script setup lang="ts" name="EmailTemplateDesigner">
import { ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IDomEditor } from "@wangeditor/editor";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import { useEmailTemplateDesigner } from "./composables/useEmailTemplateDesigner";
import EmailVariablePanel from "./panels/EmailVariablePanel.vue";
import EmailAttachmentPanel from "./panels/EmailAttachmentPanel.vue";
import EmailVariableDialog from "./dialogs/EmailVariableDialog.vue";
import EmailAttachmentDialog from "./dialogs/EmailAttachmentDialog.vue";
import EmailPreviewDialog from "./dialogs/EmailPreviewDialog.vue";
import { EMAIL_CATEGORY_PRESETS, EMAIL_TOOLBAR_BUTTONS } from "./constants";
import type { EmailTemplate } from "./types";

const props = defineProps<{
    template?: EmailTemplate;
    initialTemplate?: Partial<EmailTemplate>;
    readonly?: boolean;
}>();

const emits = defineEmits<{
    (e: "update:template", v: EmailTemplate): void;
    (e: "save", v: EmailTemplate): void;
    (e: "send-test", to: string, subject: string, html: string): void;
}>();

const designer = useEmailTemplateDesigner(props.initialTemplate || props.template);
if (props.template) designer.loadData(props.template);

const editorRef = shallowRef<IDomEditor>();
const toolbarConfig = ref({ toolbarKeys: EMAIL_TOOLBAR_BUTTONS });
const editorConfig = ref({
    placeholder: i18n("emailtemplate.editor.placeholder"),
    readOnly: props.readonly,
    MENU_CONF: {},
});

const varDialogVisible = ref(false);
const editingVarId = ref<string | null>(null);
const attDialogVisible = ref(false);
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

const handleAddVariable = () => {
    editingVarId.value = null;
    varDialogVisible.value = true;
};

const handleEditVariable = (id: string) => {
    editingVarId.value = id;
    varDialogVisible.value = true;
};

const handleAddAttachment = () => {
    attDialogVisible.value = true;
};

const handleSendTest = (to: string, subject: string, html: string) => {
    emits("send-test", to, subject, html);
};

const handleSave = () => {
    const data = designer.getData();
    emits("update:template", data);
    emits("save", data);
    ElMessage.success(i18n("emailtemplate.message.saved"));
};
</script>

<template>
    <div class="email-template-designer">
        <div class="designer-toolbar">
            <div class="left-group">
                <el-input
                    v-model="designer.state.name"

                    style="width: 200px"
                    :placeholder="i18n('emailtemplate.template.namePlaceholder')"
                />
                <el-select
                    v-model="designer.state.category"

                    style="width: 140px"
                    :placeholder="i18n('emailtemplate.template.category')"
                >
                    <el-option
                        v-for="opt in EMAIL_CATEGORY_PRESETS"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </div>
            <div class="right-group">
                <el-button  @click="previewVisible = true">
                    <el-icon><View/></el-icon>
                    {{ i18n("emailtemplate.btn.preview") }}
                </el-button>
                <el-button  type="primary" :disabled="readonly" @click="handleSave">
                    <el-icon><Check/></el-icon>
                    {{ i18n("dialog.save") }}
                </el-button>
            </div>
        </div>

        <div class="designer-meta">
            <el-form label-width="80px"  :disabled="readonly">
                <el-form-item :label="i18n('emailtemplate.template.subject')">
                    <el-input v-model="designer.state.subject"/>
                </el-form-item>
                <el-form-item :label="i18n('emailtemplate.template.fromName')">
                    <el-input v-model="designer.state.fromName" style="width: 240px"/>
                </el-form-item>
                <el-form-item :label="i18n('emailtemplate.template.cc')">
                    <el-input v-model="designer.state.cc" style="width: 240px"/>
                </el-form-item>
                <el-form-item :label="i18n('emailtemplate.template.bcc')">
                    <el-input v-model="designer.state.bcc" style="width: 240px"/>
                </el-form-item>
            </el-form>
        </div>

        <el-splitter class="designer-body" direction="horizontal">
            <el-splitter-panel size="220px" min="160px" max="360px">
                <email-variable-panel
                    :designer="designer"
                    :readonly="readonly"
                    @insert="handleInsertVariable"
                    @edit="handleEditVariable"
                    @add="handleAddVariable"
                />
            </el-splitter-panel>
            <el-splitter-panel>
                <div class="editor-area">
                    <Toolbar
                        v-if="!readonly"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        mode="default"
                        class="email-toolbar"
                    />
                    <Editor
                        v-model="designer.state.content"
                        :defaultConfig="editorConfig"
                        mode="default"
                        class="email-editor"
                        @onChange="handleEditorChange"
                        @onCreated="handleEditorCreated"
                    />
                </div>
            </el-splitter-panel>
            <el-splitter-panel size="220px" min="160px" max="360px">
                <email-attachment-panel
                    :designer="designer"
                    :readonly="readonly"
                    @add="handleAddAttachment"
                />
            </el-splitter-panel>
        </el-splitter>

        <email-variable-dialog
            v-model:visible="varDialogVisible"
            :designer="designer"
            :var-id="editingVarId"
        />
        <email-attachment-dialog
            v-model:visible="attDialogVisible"
            :designer="designer"
        />
        <email-preview-dialog
            v-model:visible="previewVisible"
            :designer="designer"
            @send-test="handleSendTest"
        />
    </div>
</template>

<script lang="ts">
import { View, Check } from "@element-plus/icons-vue";
export default { components: { View, Check } };
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.email-template-designer {
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

    .designer-meta {
        padding: 6px 12px;
        background: var(--el-bg-color);
        border-bottom: 1px solid var(--el-border-color);

        :deep(.el-form-item) {
            margin-bottom: 6px;
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

            .email-toolbar {
                border-bottom: 1px solid var(--el-border-color-lighter);
            }

            .email-editor {
                flex: 1;
                overflow-y: auto;
            }
        }
    }
}
</style>
