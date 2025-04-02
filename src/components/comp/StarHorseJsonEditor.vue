<script setup lang="ts">
import {markRaw, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import JsonEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";
import {ModelRef} from "vue";

const props = defineProps({
  options: {type: Object},
  currentMode: {
    type: String,
    default: "code"
  },
  modeList: {
    type: Array,
    default: () => ["tree", "code", "form", "text", "view"]
  },
  // en, es zh-CN, pt-BR, tr, ja, fr-FR, de, ru, ko
  language: {
    type: String,
    default: "zh-CN"
  }
});
const emits = defineEmits([
  "textSelectionChange",
  "selectionChange",
  "colorPicker",
  "focus",
  "blur",
  "validationError"
]);
const json: ModelRef<any> = defineModel("modelValue");
const jsonEditorRef = ref();
let expandedModes = ref<Array<string>>(["tree", "view", "form"]);
// 全屏处理
let isFullScreen = ref<boolean>(false);
let hasLogo = ref<boolean>(true);
let showFullScreen = ref<boolean>(false);
let editor = ref<JsonEditor>(null);
const toggleFullScreen = async () => {
  isFullScreen.value = !isFullScreen.value;
  await nextTick(() => {
    const event = new Event("resize");
    window.dispatchEvent(event);
  });
};
const expandAll = () => {
  if (expandedModes.value.includes(editor.value?.getMode())) {
    editor.value?.expandAll();
  }
};
const setEditorContent = (value) => {
  editor.value?.set(value);
};
const init = () => {
  const onChange = () => {
    const setJson = (data) => {
      json.value = data;
    };

    // 兼容一次性删除所有内容
    const text = editor.value.getText();
    if (!text) {
      setJson("");
      return;
    }
    try {
      const json = editor.value.get();
      setJson(json);
    } catch (error) {
    }
  };
  const onModeChange = () => {
    expandAll();
  };
  const onTextSelectionChange = (start, end, text) => {
    emits("textSelectionChange", editor.value, start, end, text);
  };
  const onSelectionChange = (start, end) => {
    emits("selectionChange", editor.value, start, end);
  };
  const onColorPicker = (parent, color, onChange) => {
    emits("colorPicker", editor.value, parent, color, onChange);
  };
  const onFocus = ({target}) => {
    emits("focus", editor.value, target);
  };
  const onBlur = ({target}) => {
    emits("blur", editor.value, target);
  };
  const onValidationError = (errors) => {
    emits("validationError", editor.value, errors);
  };
  const finalOptions = {
    ...props.options,
    indentation: 2,
    language: props.language,
    mode: props.currentMode,
    modes: props.modeList,
    onChange,
    onModeChange,
    onTextSelectionChange,
    onSelectionChange,
    onColorPicker,
    onFocus,
    onBlur,
    onValidationError
  };
  editor.value = markRaw(new JsonEditor(jsonEditorRef.value, finalOptions));
};
onMounted(() => {
  init();
  setEditorContent(json.value);
  $(".jsoneditor-poweredBy").remove();
});
onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = null;
});
defineExpose({
  editor,
  setEditorContent
});
</script>
<template>
  <div class="container" :class="{ 'full-screen-container': isFullScreen }">
    <div ref="jsonEditorRef" class="json-editor"/>
    <div
        class="full-screen"
        :class="{
        show: showFullScreen,
        right: !hasLogo
      }"
        @click="toggleFullScreen"
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
}

.full-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999999999;
  width: auto !important;
  height: auto !important;
}

.json-editor {
  width: 100%;
  height: 100%;
}

code {
  background-color: #f5f5f5;
}

.full-screen {
  position: absolute;
  display: none;
  top: 8px;
  right: 110px;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  cursor: pointer;
  background-size: cover;
  background-image: url("data:image/svg+xml,%3Csvg t='1635416254060' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='42247' width='128' height='128'%3E%3Cpath d='M240.8 196l178.4 178.4-45.6 45.6-177.6-179.2-68 68V128h180.8l-68 68z m133.6 408.8L196 783.2 128 715.2V896h180.8l-68-68 178.4-178.4-44.8-44.8zM715.2 128l68 68-178.4 178.4 45.6 45.6 178.4-178.4 68 68V128H715.2z m-65.6 476.8l-45.6 45.6 178.4 178.4-68 68H896V715.2l-68 68-178.4-178.4z' p-id='42248' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
}

.full-screen-container .full-screen {
  background-image: url("data:image/svg+xml,%3Csvg t='1635416420969' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='42490' width='128' height='128'%3E%3Cpath d='M142.4 96.8l-44.8 44.8 173.6 174.4-68 68H384V203.2l-67.2 67.2zM752.8 316l173.6-174.4-44.8-44.8-174.4 173.6-67.2-67.2V384h180.8zM270.4 707.2l-169.6 170.4 44.8 49.6 170.4-174.4 68 68V640H203.2zM820.8 640H640v180.8l68-68 170.4 174.4 44.8-49.6-169.6-170.4z' p-id='42491' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
}

.show {
  display: block;
}

.right {
  right: 15px;
}

.full-screen:hover {
  border: 1px solid #d7e6fe;
}
</style>
