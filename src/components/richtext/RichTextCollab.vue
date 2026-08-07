<script setup lang="ts" name="RichTextCollab">
import {computed, onBeforeUnmount, ref, shallowRef, watch} from "vue";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import type {IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {i18n} from "@/lang";
import {useCollabEditor} from "./composables/useCollabEditor";
import {createCollabUser, TOOLBAR_PRESETS} from "./constants";
import {isMobile} from "@/api/device";

const props = defineProps<{
  html?: string;
  config?: Partial<ReturnType<typeof useCollabEditor>["config"]>;
  readonly?: boolean;
  toolbarMode?: "default" | "simple" | "full";
}>();

const emits = defineEmits<{
  (e: "update:html", v: string): void;
  (e: "change", v: string): void;
}>();

const editor = useCollabEditor({
  html: props.html,
  config: {...props.config, readonly: props.readonly},
});

const editorRef = shallowRef<IDomEditor>();
const mode = computed(() => props.toolbarMode ?? editor.config.toolbarMode);
const toolbarConfig = ref<Partial<IToolbarConfig>>({});
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: editor.config.placeholder,
  readOnly: editor.config.readonly,
  MENU_CONF: {},
});

/** 当前工具栏按钮 */
const currentToolbarButtons = computed(() => {
  const preset = TOOLBAR_PRESETS.find((p) => p.mode === mode.value);
  return preset?.buttons ?? TOOLBAR_PRESETS[1].buttons;
});

watch(
    () => props.readonly,
    (val) => {
      editor.updateConfig({readonly: val});
      editorConfig.value.readOnly = val;
      if (val) {
        editorRef.value?.disable();
      } else {
        editorRef.value?.enable();
      }
    },
);

const handleChange = (newEditor: IDomEditor) => {
  const html = newEditor.getHtml();
  editor.onContentChange(html);
  emits("update:html", html);
  emits("change", html);
};

const handleCreated = (newEditor: IDomEditor) => {
  editorRef.value = newEditor;
  if (props.readonly) newEditor.disable();
};

/** 模拟协同：加入当前用户 */
const handleJoinCollab = () => {
  if (editor.config.enableCollaboration && !editor.currentUser.value) {
    editor.joinCollab(createCollabUser({name: i18n("richtext.user.me")}));
  }
};

if (editor.config.enableCollaboration) {
  handleJoinCollab();
}

onBeforeUnmount(() => {
  const e = editorRef.value;
  if (e) e.destroy();
});
</script>

<template>
  <div class="rich-text-collab">
    <!-- 协同用户栏 -->
    <div class="collab-bar" v-if="editor.config.enableCollaboration">
      <div class="user-list">
        <el-tooltip
            v-for="user in editor.onlineUsers"
            :key="user.id"
            :content="user.name"
            :trigger="isMobile ? 'click' : 'hover'"
        >
          <el-avatar
              :size="24"
              :src="user.avatar"
              :style="{ border: `2px solid ${user.color}` }"
          >
            {{ user.name.charAt(0) }}
          </el-avatar>
        </el-tooltip>
      </div>
      <span class="online-count">
                {{ editor.onlineUsers.length }} {{ i18n("richtext.collab.online") }}
            </span>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar-wrapper" v-if="editor.config.showToolbar && !editor.config.readonly">
      <Toolbar
          :editor="editorRef"
          :defaultConfig="{ ...toolbarConfig, toolbarKeys: currentToolbarButtons }"
          :mode="mode"
          class="rich-text-toolbar"
      />
    </div>

    <!-- 编辑器 -->
    <div class="editor-wrapper">
      <Editor
          v-model="editor.html.value"
          :defaultConfig="editorConfig"
          :mode="mode"
          class="rich-text-editor"
          @onChange="handleChange"
          @onCreated="handleCreated"
      />
    </div>

    <!-- 字数统计 -->
    <div class="footer-bar" v-if="editor.config.maxLength">
            <span class="word-count">
                {{ editor.text.value.length }} / {{ editor.config.maxLength }}
            </span>
    </div>
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.rich-text-collab {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  .collab-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);

    .user-list {
      display: flex;
      gap: -4px;

      .el-avatar {
        margin-left: -8px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .online-count {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .toolbar-wrapper {
    border-bottom: 1px solid var(--el-border-color-lighter);

    .rich-text-toolbar {
      border-bottom: none;
    }
  }

  .editor-wrapper {
    flex: 1;
    overflow: hidden;

    .rich-text-editor {
      height: 100%;
      overflow-y: auto;
    }
  }

  .footer-bar {
    padding: 4px 12px;
    text-align: right;
    background: var(--el-fill-color-light);
    border-top: 1px solid var(--el-border-color-lighter);

    .word-count {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

/* App 端（窄屏）响应式适配 */
@media (max-width: 768px) {
  .rich-text-collab {
    .toolbar-wrapper {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;

      :deep(.w-e-bar) {
        flex-wrap: nowrap;
      }

      :deep(.w-e-bar-item-btn) {
        padding: 4px 6px;
      }
    }

    .footer-bar .word-count {
      font-size: 11px;
    }
  }
}
</style>
