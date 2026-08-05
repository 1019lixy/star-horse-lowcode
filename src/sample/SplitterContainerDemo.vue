<script setup lang="ts" name="SplitterContainerDemo">
import { nextTick, onMounted, provide, reactive, ref } from "vue";
import { dialogPreps } from "@/api/star_horse_utils";
import type { PageFieldInfo } from "@/components/types";
import { StarHorseForm, StarHorseDialog } from "@/components/comp";

/**
 * 验证场景：通过 editMode 的 dataRelation 策略(controlTarget=container)
 * 控制 splitterList 容器中各 splitter panel 的显隐
 * 切换下拉框,仅对应 panel 可见(其余隐藏)
 * 不依赖后端,纯前端渲染验证
 */

const editModeOptions = [
  { name: "可视化", value: "visual" },
  { name: "代码", value: "code" },
  { name: "预览", value: "preview" },
];
const canvasSizeOptions = [
  { name: "800 × 600", value: "800x600" },
  { name: "1024 × 768", value: "1024x768" },
  { name: "1920 × 1080", value: "1920x1080" },
];
const themeOptions = [
  { name: "明亮", value: "light" },
  { name: "暗黑", value: "dark" },
  { name: "跟随系统", value: "auto" },
];
const languageOptions = [
  { name: "JavaScript", value: "javascript" },
  { name: "TypeScript", value: "typescript" },
  { name: "Python", value: "python" },
];
const editorThemeOptions = [
  { name: "GitHub", value: "github" },
  { name: "Monokai", value: "monokai" },
  { name: "Dracula", value: "dracula" },
];

/**
 * 构造 editMode 的 dataRelation 容器控制配置
 * relationFields 为各 splitter panel 的 tabName,匹配后 eqVisible
 */
const buildEditModeContainerRelation = () => {
  const types = ["visual", "code", "preview"];
  return {
    actionName: "change",
    relationDetails: types.map((t) => ({
      matchType: "eq",
      controlCondition: "eqVisible",
      controlTarget: "container" as const,
      relationFields: [t],
      matchFieldValue: [t],
    })),
  };
};

const container = reactive<any>({
  fieldName: "editSplitter",
  label: "编辑器面板",
  type: "splitterList",
  formVisible: true,
  listVisible: false,
  splitterList: [
    // ========== visual 可视化 ==========
    {
      title: "可视化编辑",
      tabName: "visual",
      objectName: "visualConfig",
      formVisible: true,
      fieldList: [
        {
          label: "画布尺寸", fieldName: "canvasSize", type: "select", required: true,
          formVisible: true, defaultValue: "1024x768",
          preps: { values: canvasSizeOptions },
        },
        {
          label: "主题", fieldName: "theme", type: "select",
          formVisible: true, defaultValue: "light",
          preps: { values: themeOptions },
        },
      ],
    },
    // ========== code 代码 ==========
    {
      title: "代码编辑",
      tabName: "code",
      objectName: "codeConfig",
      formVisible: false,
      fieldList: [
        {
          label: "语言", fieldName: "language", type: "select", required: true,
          formVisible: true, defaultValue: "typescript",
          preps: { values: languageOptions },
        },
        {
          label: "编辑器主题", fieldName: "editorTheme", type: "select",
          formVisible: true, defaultValue: "monokai",
          preps: { values: editorThemeOptions },
        },
      ],
    },
    // ========== preview 预览 ==========
    {
      title: "预览",
      tabName: "preview",
      objectName: "previewConfig",
      formVisible: false,
      fieldList: [
        { label: "缩放比例(%)", fieldName: "zoomLevel", type: "number", formVisible: true, defaultValue: 100 },
        {
          label: "显示标尺", fieldName: "showRuler", type: "switch",
          formVisible: true, defaultValue: "N",
          preps: { activeValue: "Y", inactiveValue: "N", activeText: "是", inactiveText: "否" },
        },
      ],
    },
  ],
});

const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    { label: "主键", fieldName: "id", formVisible: false },
    {
      label: "编辑模式", fieldName: "editMode", type: "select", required: true,
      formVisible: true, listVisible: true, defaultValue: "visual",
      preps: {
        values: editModeOptions,
        // 通过 dataRelation 容器控制策略,声明式控制 splitterList 中各 panel 的显隐
        dataRelation: buildEditModeContainerRelation(),
      },
    },
    container,
  ],
});

const rules = {
  editMode: [{ required: true, message: "请选择编辑模式", trigger: "change" }],
};

const dialogProps = dialogPreps("编辑器配置");
provide("dialogProps", dialogProps);

// 直接打开编辑弹窗,验证表单渲染
const editVisible = ref(true);
const syncEditVisible = (val: boolean) => {
  editVisible.value = val;
};

const formRef = ref();
/**
 * 表单初始化完成后,调用 resetForm 应用默认值(如 editMode=visual)
 * 触发 dataRelation 一次性 watch,根据默认值控制初始 panel 显隐
 */
const onFormInited = () => {
  nextTick(() => {
    formRef.value?.resetForm?.();
  });
};

onMounted(() => {});
</script>

<template>
  <div class="flex flex-col h-full overflow-auto p-4">
    <el-alert
      title="验证说明"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
    >
      <template #default>
        切换「编辑模式」下拉框,下方分栏面板应同步只显示对应模式(其余隐藏)。
        这是通过 editMode 的 dataRelation 配置 controlTarget="container" 实现的声明式 splitterList 容器控制。
      </template>
    </el-alert>
    <star-horse-dialog
      v-model="editVisible"
      :isShowBtnContinue="true"
      title="分栏容器控制验证"
      @update:dialogVisible="syncEditVisible"
    >
      <star-horse-form
        ref="formRef"
        :fieldList="tableFieldList"
        :rules="rules"
        @inited="onFormInited"
      />
    </star-horse-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
