<script setup lang="ts" name="StarHorseEditor">
import { nextTick, onMounted, PropType, ref, computed } from "vue";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { historyKeymap, insertTab, standardKeymap } from "@codemirror/commands";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import {
  javascript,
  javascriptLanguage,
  scopeCompletionSource,
} from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { css } from "@codemirror/lang-css";
import { vue } from "@codemirror/lang-vue";
import { html } from "@codemirror/lang-html";
import { cpp } from "@codemirror/lang-cpp";
import { xml } from "@codemirror/lang-xml";
import { markdown } from "@codemirror/lang-markdown";
import { go } from "@codemirror/lang-go";
import { sql } from "@codemirror/lang-sql";
import { showMinimap } from "@replit/codemirror-minimap";
import {
  amy,
  ayuLight,
  barf,
  bespin,
  birdsOfParadise,
  boysAndGirls,
  clouds,
  dracula,
} from "thememirror";
import StarHorseSidebar from "@/components/system/StarHorseSidebar.vue";
import { i18n } from "@/lang";
import { ArrowDown } from "@element-plus/icons-vue";

/**
 * ToolbarItem - 外部配置的工具栏按钮
 * id:       唯一标识
 * label:    显示文字
 * icon:     图标class（传给 star-horse-icon）
 * position: 'left' | 'right'，按钮显示在哪一侧
 * type:     'button' 普通按钮 | 'dropdown' 下拉菜单
 * handler:  type='button' 时的点击回调
 * children: type='dropdown' 时的下拉选项 { label, handler }[]
 */
interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  position?: "left" | "right";
  type?: "button" | "dropdown";
  handler?: () => void;
  children?: Array<{ label: string; handler: () => void }>;
}

const model = defineModel("value", { default: "" });
const editorLang = ref<any>(javascript());
const editorTheme = ref<any>(dracula);
const props = defineProps({
  funcName: { type: String, default: "" },
  fieldName: { type: String, default: "" },
  lang: { type: String, default: null },
  theme: { type: String, default: "dracula" },
  boxHeight: { type: String, default: "95%" },
  btnList: { type: Object as PropType<Array<any>>, default: () => [] },
  helpMsg: { type: String },
  /** 外部配置的工具栏按钮 */
  toolbarItems: {
    type: Array as PropType<ToolbarItem[]>,
    default: () => [],
  },
  /** 是否显示工具栏 */
  showToolbar: { type: Boolean, default: true },
});

// 分离用户配置的左右按钮
const userLeftItems = computed(() =>
  (props.toolbarItems || []).filter((i) => i.position !== "right"),
);
const userRightItems = computed(() =>
  (props.toolbarItems || []).filter((i) => i.position === "right"),
);

// Editor settings state
const fontSize = ref(17);
const showMinimapEnabled = ref(true);
const languageConf = new Compartment();
const config = ref<any>({
  defaultSchema: "test",
  tables: [],
  defaultTable: "",
  schema: {},
});
const languages = ref<Array<any>>([
  { name: "Java", value: "java", obj: java(), icon: "setting" },
  { name: "Python", value: "python", obj: python(), icon: "setting" },
  { name: "JSON", value: "json", obj: json(), icon: "setting" },
  { name: "Sql", value: "sql", obj: sql(config.value), icon: "setting" },
  {
    name: "JavaScript",
    value: "javascript",
    obj: javascript(),
    icon: "setting",
  },
  { name: "Vue", value: "vue", obj: vue(), icon: "setting" },
  { name: "Css", value: "css", obj: css(), icon: "setting" },
  { name: "YAML", value: "yaml", obj: yaml(), icon: "setting" },
  { name: "XML", value: "xml", obj: xml(), icon: "setting" },
  { name: "Markdown", value: "markdown", obj: markdown(), icon: "setting" },
  { name: "Go", value: "go", obj: go(), icon: "setting" },
  { name: "C++", value: "cpp", obj: cpp(), icon: "setting" },
  { name: "Html", value: "html", obj: html(), icon: "setting" },
]);
const themesConf = new Compartment();
const themes = ref<Array<any>>([
  {
    name: "BirdsOfParadise",
    value: "birdsOfParadise",
    obj: birdsOfParadise,
    icon: "setting",
  },
  {
    name: "BoysAndGirls",
    value: "boysAndGirls",
    obj: boysAndGirls,
    icon: "setting",
  },
  { name: "Amy", value: "amy", obj: amy, icon: "setting" },
  { name: "AyuLight", value: "ayuLight", obj: ayuLight, icon: "setting" },
  { name: "Bespin", value: "bespin", obj: bespin, icon: "setting" },
  { name: "Clouds", value: "clouds", obj: clouds, icon: "setting" },
  { name: "Barf", value: "barf", obj: barf, icon: "setting" },
  { name: "Dracula", value: "dracula", obj: dracula, icon: "setting" },
]);
const editor = ref<EditorView>();
const codemirror = ref();

// 当前选中的语言/主题标签（工具栏显示用）
const currentLangLabel = computed(() => {
  const found = languages.value.find(
    (l) => l.value === (props.lang || "javascript"),
  );
  return found?.name || "JavaScript";
});
const currentThemeLabel = computed(() => {
  const found = themes.value.find((t) => t.value === props.theme);
  return found?.name || "Dracula";
});

const customerTheme = (theme: string) => {
  let fdata = themes.value.find((item) => item.value == theme);
  editorTheme.value = fdata.obj;
  editor.value?.dispatch({
    effects: themesConf.reconfigure(editorTheme.value),
  });
};

const changeFontSize = (size: number) => {
  fontSize.value = size;
  init();
};

const toggleMinimap = () => {
  showMinimapEnabled.value = !showMinimapEnabled.value;
  init();
};

const currentValFun = (_val: string) => {
  // console.log(val);
};

// 自定义自动完成函数
const jsHint = (context: CompletionContext) => {
  let word: any = context.matchBefore(/\w*/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      {
        label: "currentField",
        detail: i18n("item.currentProperty"),
        apply: "currentField",
      },
      {
        label: "formInstance",
        detail: i18n("item.formInstance"),
        apply: "formInstance",
      },
      { label: "formData", detail: i18n("item.formData"), apply: "formData" },
      {
        label: "formFields",
        detail: i18n("item.formFields"),
        apply: "formFields",
      },
      { label: "userInfo", detail: i18n("item.userInfo"), apply: "userInfo" },
      {
        label: "postRequest",
        detail: "PostRequest",
        apply: "postRequest(url,params)",
      },
      { label: "getRequest", detail: "GetRequest", apply: "getRequest(url)" },
      {
        label: "download",
        detail: i18n("item.download"),
        apply: "download(url)",
      },
      {
        label: "upload",
        detail: i18n("item.upload"),
        apply: "upload(url,params)",
      },
    ],
  };
};

const langInfo = (lang: string) => {
  let fdata = languages.value.find((item) => item.value == lang);
  if (lang == "sql") {
    editorLang.value = sql(config.value);
  } else {
    editorLang.value = fdata.obj;
  }
  let disData = {
    effects: languageConf.reconfigure(editorLang.value),
  };
  editor.value?.dispatch(disData);
};

const windowCompletions = javascriptLanguage.data.of({
  autocomplete: scopeCompletionSource(window),
});
const jsCompletions = javascriptLanguage.data.of({
  autocomplete: jsHint,
});

const init = async () => {
  if (typeof editor.value !== "undefined") {
    if (editor.value instanceof EditorView) {
      editor.value.destroy();
    }
  }
  await nextTick(() => {
    if (!codemirror.value) {
      return;
    }
    let create = (_v: EditorView) => {
      const dom = document.createElement("div");
      return { dom };
    };
    editor.value = new EditorView({
      doc: model.value,
      extensions: [
        basicSetup,
        themesConf.of(editorTheme.value),
        ...[windowCompletions, jsCompletions],
        keymap.of([
          ...standardKeymap,
          ...historyKeymap,
          { key: "Tab", run: insertTab },
        ]),
        languageConf.of(editorLang.value),
        autocompletion({
          activateOnTyping: true,
          maxRenderedOptions: 20,
        }),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            model.value = v.state.doc.toString();
            currentValFun(model.value);
          }
        }),
        ...(showMinimapEnabled.value
          ? [
              showMinimap.compute(["doc"], (_state: any) => {
                return {
                  create,
                  displayText: "blocks",
                  showOverlay: "always",
                  gutters: [{ 1: "#00FF00", 2: "#00FF00" }],
                };
              }),
            ]
          : []),
        EditorView.theme({
          "&": { fontSize: `${fontSize.value}px` },
        }),
      ],
      parent: codemirror.value,
    });
  });
};

onMounted(async () => {
  await nextTick(() => {
    langInfo(props.lang || "javascript");
    init();
  });
});

const setAutoCompletion = (dbName: string, datas: any) => {
  config.value["tables"] = [];
  config.value["schema"] = {};
  config.value["defaultSchema"] = dbName;
  datas.forEach((item: any) => {
    config.value["tables"]?.push({
      label: item.comment || item.tableName,
      apply: item.tableName,
    });
    config.value["schema"][dbName + "." + item.tableName] = item.fields.map(
      (sitem: any) => sitem.fieldName,
    );
  });
  langInfo("sql");
};

const setValue = (val: any) => {
  editor.value?.dispatch({
    changes: { from: 0, to: editor.value.state.doc.length, insert: val },
  });
};

defineExpose({
  editor,
  setValue,
  setAutoCompletion,
});
</script>
<template>
  <div class="star-horse-editor-container">
    <!-- 工具栏 -->
    <div class="editor-toolbar" v-if="showToolbar">
      <!-- 左侧：用户自定义左按钮 -->
      <div class="toolbar-left">
        <template v-for="item in userLeftItems" :key="item.id">
          <!-- dropdown 类型 -->
          <el-dropdown trigger="click" v-if="item.type === 'dropdown'">
            <span class="toolbar-btn">
              <star-horse-icon
                v-if="item.icon"
                :icon-class="item.icon"
                size="15px"
              />
              <span v-if="item.label">{{ item.label }}</span>
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(child, ci) in item.children"
                  :key="ci"
                  @click="child.handler"
                >
                  {{ child.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- button 类型 -->
          <el-tooltip v-else :content="item.label || ''" placement="bottom">
            <span class="toolbar-btn" @click="item.handler">
              <star-horse-icon
                v-if="item.icon"
                :icon-class="item.icon"
                size="15px"
              />
              <span v-if="item.label && !item.icon">{{ item.label }}</span>
            </span>
          </el-tooltip>
        </template>
      </div>

      <!-- 右侧：默认配置 + 用户自定义右按钮 -->
      <div class="toolbar-right">
        <!-- 用户自定义右按钮 -->
        <template v-for="item in userRightItems" :key="item.id">
          <el-dropdown trigger="click" v-if="item.type === 'dropdown'">
            <span class="toolbar-btn">
              <star-horse-icon
                v-if="item.icon"
                :icon-class="item.icon"
                size="15px"
              />
              <span v-if="item.label">{{ item.label }}</span>
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(child, ci) in item.children"
                  :key="ci"
                  @click="child.handler"
                >
                  {{ child.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip v-else :content="item.label || ''" placement="bottom">
            <span class="toolbar-btn" @click="item.handler">
              <star-horse-icon
                v-if="item.icon"
                :icon-class="item.icon"
                size="15px"
              />
              <span v-if="item.label && !item.icon">{{ item.label }}</span>
            </span>
          </el-tooltip>
        </template>

        <span class="toolbar-divider"></span>

        <!-- 语言选择（默认项） -->
        <el-dropdown trigger="click" v-if="!lang">
          <span class="toolbar-btn">
            {{ currentLangLabel }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="langInfo(item.value)"
                v-for="item in languages"
                :key="item.value"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 主题选择（默认项） -->
        <el-dropdown trigger="click">
          <span class="toolbar-btn">
            {{ currentThemeLabel }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="customerTheme(item.value)"
                v-for="item in themes"
                :key="item.value"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 字号选择（默认项） -->
        <el-dropdown trigger="click">
          <span class="toolbar-btn">
            {{ fontSize }}px
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeFontSize(12)"
                >12px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(14)"
                >14px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(16)"
                >16px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(17)"
                >17px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(18)"
                >18px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(20)"
                >20px</el-dropdown-item
              >
              <el-dropdown-item @click="changeFontSize(24)"
                >24px</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- Minimap 开关（默认项） -->
        <el-tooltip
          :content="showMinimapEnabled ? 'Hide Minimap' : 'Show Minimap'"
          placement="bottom"
        >
          <span class="toolbar-btn" @click="toggleMinimap">
            <star-horse-icon
              :icon-class="showMinimapEnabled ? 'eye-open' : 'eye-close'"
              size="15px"
            />
          </span>
        </el-tooltip>

        <!-- 帮助 -->
        <help :message="helpMsg" v-if="helpMsg" />
      </div>
    </div>

    <!-- 编辑器区域 -->
    <div ref="codemirror" class="editor-area"></div>
  </div>
</template>
<style lang="scss" scoped>
.star-horse-editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}

// 工具栏
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  min-height: 34px;
  flex-shrink: 0;

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 4px 8px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.15s;
    white-space: nowrap;
    user-select: none;

    &:hover {
      background-color: #e8e8e8;
      color: #333;
    }

    :deep(.el-icon) {
      font-size: 11px;
      margin-left: 1px;
    }
  }

  .toolbar-divider {
    display: inline-block;
    width: 1px;
    height: 16px;
    background-color: #dcdcdc;
    margin: 0 4px;
  }
}

// 编辑器区域
.editor-area {
  flex: 1;
  width: 100%;
  overflow: hidden;

  :deep(.cm-editor) {
    height: 100%;
    line-height: 1.6;

    .cm-content {
      padding: 8px 0;
      caret-color: #4a9eff;
    }

    .cm-activeLine {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .cm-selectionBackground {
      background-color: rgba(74, 158, 255, 0.3) !important;
    }

    .cm-matchingBracket {
      background-color: rgba(74, 158, 255, 0.3);
      border: 1px solid rgba(74, 158, 255, 0.6);
    }

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(128, 128, 128, 0.4);
      border-radius: 5px;

      &:hover {
        background: rgba(128, 128, 128, 0.6);
      }
    }
  }

  :deep(.cm-minimap) {
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

// 侧边栏菜单
.sidebar-menu {
  border-right: none;

  .el-menu-item {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
}

.sidebar-btn-list {
  padding: 12px 0;
}
</style>
