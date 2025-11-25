<script setup lang="ts" name="StarHorseEditor">
import {nextTick, onMounted, PropType, ref} from "vue";
import {basicSetup} from "codemirror";
import {EditorView, keymap} from "@codemirror/view";
import {Compartment} from "@codemirror/state";
import {historyKeymap, insertTab, standardKeymap} from "@codemirror/commands";
import {autocompletion, CompletionContext} from "@codemirror/autocomplete";
import {python} from "@codemirror/lang-python";
import {javascript, javascriptLanguage, scopeCompletionSource,} from "@codemirror/lang-javascript";
import {java} from "@codemirror/lang-java";
import {json} from "@codemirror/lang-json";
import {yaml} from "@codemirror/lang-yaml";
import {css} from "@codemirror/lang-css";
import {vue} from "@codemirror/lang-vue";
import {html} from "@codemirror/lang-html";
import {cpp} from "@codemirror/lang-cpp";
import {xml} from "@codemirror/lang-xml";
import {markdown} from "@codemirror/lang-markdown";
import {go} from "@codemirror/lang-go";
import {sql} from "@codemirror/lang-sql";
import {showMinimap} from "@replit/codemirror-minimap";
import {amy, ayuLight, barf, bespin, birdsOfParadise, boysAndGirls, clouds, dracula,} from "thememirror";
import StarHorseSidebar from "@/components/system/StarHorseSidebar.vue";

const model = defineModel("value", {default: ""});
const editorLang = ref<any>(javascript());
const editorTheme = ref<any>(dracula);
const props = defineProps({
  funcName: {type: String, default: ""},
  fieldName: {type: String, default: ""},
  lang: {type: String, default: null},
  theme: {type: String, default: "dracula"},
  boxHeight: {type: String, default: "95%"},
  btnList: {type: Object as PropType<Array<any>>, default: () => []},
  helpMsg: {type: String},
});
const languageConf = new Compartment();
const config = ref<any>({
  defaultSchema: "test",
  tables: [],
  defaultTable: "",
  schema: {},
});
const languages = ref<Array<any>>([
  {name: "Java", value: "java", obj: java(), icon: "setting"},
  {name: "Python", value: "python", obj: python(), icon: "setting"},
  {name: "JSON", value: "json", obj: json(), icon: "setting"},
  {name: "Sql", value: "sql", obj: sql(config.value), icon: "setting"},
  {
    name: "JavaScript",
    value: "javascript",
    obj: javascript(),
    icon: "setting",
  },
  {name: "Vue", value: "vue", obj: vue(), icon: "setting"},
  {name: "Css", value: "css", obj: css(), icon: "setting"},
  {name: "YAML", value: "yaml", obj: yaml(), icon: "setting"},
  {name: "XML", value: "xml", obj: xml(), icon: "setting"},
  {name: "Markdown", value: "markdown", obj: markdown(), icon: "setting"},
  {name: "Go", value: "go", obj: go(), icon: "setting"},
  {name: "C++", value: "cpp", obj: cpp(), icon: "setting"},
  {name: "Html", value: "html", obj: html(), icon: "setting"},
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
  {name: "Amy", value: "amy", obj: amy, icon: "setting"},
  {name: "AyuLight", value: "ayuLight", obj: ayuLight, icon: "setting"},
  {name: "Bespin", value: "bespin", obj: bespin, icon: "setting"},
  {name: "Clouds", value: "clouds", obj: clouds, icon: "setting"},
  {name: "Barf", value: "barf", obj: barf, icon: "setting"},
  {name: "Dracula", value: "dracula", obj: dracula, icon: "setting"},
]);
const editor = ref<EditorView>();
const codemirror = ref();
const customerTheme = (theme: string) => {
  let fdata = themes.value.find((item) => item.value == theme);
  editorTheme.value = fdata.obj;
  editor.value?.dispatch({
    effects: themesConf.reconfigure(editorTheme.value),
  });
};
const currentValFun = (_val: string) => {
  // console.log(val);
};
// 自定义自动完成函数
/*const javaHint = (context: CompletionContext) => {
  let word: any = context.matchBefore(/\w*!/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [...javaKeywords],
  };
};*/
// 自定义自动完成函数
const jsHint = (context: CompletionContext) => {
  let word: any = context.matchBefore(/\w*/);

  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      {
        label: "currentField",
        detail: "当前属性",
        apply: "currentField",
      },
      {
        label: "formInstance",
        detail: "表单实例",
        apply: "formInstance",
      },
      {
        label: "formData",
        detail: "表单数据",
        apply: "formData",
      },
      {
        label: "formFields",
        detail: "表单字段",
        apply: "formFields",
      },
      {
        label: "userInfo",
        detail: "用户信息",
        apply: "userInfo",
      },
      {
        label: "postRequest",
        detail: "PostRequest",
        apply: "postRequest(url,params)",
      },
      {
        label: "getRequest",
        detail: "GetRequest",
        apply: "getRequest(url)",
      },
      {
        label: "download",
        detail: "下载",
        apply: "download(url)",
      },
      {
        label: "upload",
        detail: "上传",
        apply: "upload(url,params)",
      },
    ],
  };
};
/**
 * Get language information
 * @param lang
 */
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
// const javaCompletions = javaLanguage.data.of({
//   autocomplete: javaHint,
// });
const windowCompletions = javascriptLanguage.data.of({
  autocomplete: scopeCompletionSource(window),
});
const jsCompletions = javascriptLanguage.data.of({
  autocomplete: jsHint,
});
/**
 * Initialize
 */
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
      return {dom};
    };
    editor.value = new EditorView({
      doc: model.value,
      extensions: [
        basicSetup,
        themesConf.of(editorTheme.value),
        //javaCompletions
        ...[windowCompletions, jsCompletions],
        keymap.of([
          ...standardKeymap,
          ...historyKeymap,
          {key: "Tab", run: insertTab},
        ]),
        languageConf.of(editorLang.value),
        autocompletion({activateOnTyping: true}),
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            model.value = v.state.doc.toString();
            currentValFun(model.value);
          }
        }),
        showMinimap.compute(["doc"], (_state: any) => {
          return {
            create,
            displayText: "blocks",
            showOverlay: "always",
            gutters: [{1: "#00FF00", 2: "#00FF00"}],
          };
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
/**
 * Generate different query tips based on different databases
 * @param dbName
 * @param datas
 */
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
    changes: {from: 0, to: editor.value.state.doc.length, insert: val},
  });
};
defineExpose({
  editor,
  setValue,
  setAutoCompletion,
});
</script>
<template>
  <div class="flex flex-col h-full">
    <div ref="codemirror" class="coder flex-1"></div>
    <StarHorseSidebar>
      <div class="flex flex-row items-center h-[40px] w-full">
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            v-if="btnList?.length > 0"
            style="height: 100%; flex: 1"
        >
          <template v-for="(item, index) in btnList">
            <template v-if="item.children?.length > 0">
              <el-sub-menu :index="'1_' + index">
                <template #title>
                  <el-tooltip
                      class="item"
                      :content="item.label"
                      effect="dark"
                      placement="bottom"
                  >
                    <star-horse-icon
                        :icon-class="item.icon"
                        size="24px"
                        style="color: var(--star-horse-style)"
                    />
                  </el-tooltip>
                </template>
                <el-menu-item
                    v-for="(sitem, sindex) in item.children"
                    :disabled="sitem.disabled?.value === true"
                    :index="'2_' + sindex"
                    @click="sitem.actions"
                >
                  <star-horse-icon
                      :icon-class="sitem.icon"
                      size="24px"
                      style="color: var(--star-horse-style)"
                  />
                  {{ sitem.label }}
                </el-menu-item>
              </el-sub-menu>
            </template>
            <el-menu-item
                v-else
                :disabled="item.disabled?.value === true"
                :index="'1_' + index"
                @click="item.actions"
            >
              <el-tooltip
                  class="item"
                  :content="item.label"
                  effect="dark"
                  placement="bottom"
              >
                <star-horse-icon
                    :icon-class="item.icon"
                    size="24px"
                    style="color: var(--star-horse-style)"
                />
              </el-tooltip>
            </el-menu-item>
          </template>
        </el-menu>
        <div class="w-[20%] h-full items-center">
          <el-dropdown>
            <span class="el-dropdown-link">
             主题
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    @click="customerTheme(item.value)"
                    v-for="item in themes"
                >
                  <star-horse-icon
                      :icon-class="item.icon"
                      color="gray"
                      size="14px"
                  />
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          &nbsp;&nbsp;
        </div>
        <div class="w-[20%] h-full items-center">
          <el-dropdown v-if="!lang">
            <span class="el-dropdown-link">
              语言
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    @click="langInfo(item.value)"
                    v-for="item in languages"
                >
                  <star-horse-icon
                      :icon-class="item.icon"
                      color="gray"
                      size="14px"
                  />
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <help :message="helpMsg" v-if="helpMsg"/>
      </div>
    </StarHorseSidebar>
  </div>
</template>
<style lang="scss" scoped>
.inner_button {
  margin-bottom: 10px;
}

.coder {
  font-size: 17px;
  width: 100%;
  height: v-bind(boxHeight);

  :deep(.cm-editor) {
    height: 100%;
  }
}
</style>
