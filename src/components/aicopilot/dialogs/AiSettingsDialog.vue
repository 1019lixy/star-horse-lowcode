<script setup lang="ts" name="AiSettingsDialog">
/**
 * AI Copilot - 设置弹窗
 *
 * Provider 选择 / 模型参数 / 系统提示词编辑
 */
import {computed, ref, watch} from "vue";
import {i18n} from "@/lang";
import {AI_DEFAULT_SETTINGS, AI_DEFAULT_SYSTEM_PROMPT} from "../constants";
import type {AiProviderName, AiProviderSettings} from "../types";
import {success} from "@/utils/message";
import {StarHorsePanel} from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  settings: AiProviderSettings;
  dialogType?:"dialog"|"drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  (e: "save", settings: AiProviderSettings): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const form = ref<AiProviderSettings>({...props.settings});

watch(
    () => props.visible,
    (v) => {
      if (v) {
        form.value = {...props.settings};
      }
    },
);

const providerOptions: Array<{ label: string; value: AiProviderName }> = [
  {label: i18n("aicopilot.settings.provider.mock"), value: "mock"},
  {label: i18n("aicopilot.settings.provider.custom"), value: "custom"},
];

const handleSave = (): void => {
  emit("save", {...form.value});
  success(i18n("aicopilot.message.settingsSaved"));
  innerVisible.value = false;
};

const handleReset = (): void => {
  form.value = {
    ...AI_DEFAULT_SETTINGS,
    systemPrompt: AI_DEFAULT_SYSTEM_PROMPT,
  };
};
</script>

<template>
  <star-horse-panel
      :type="dialogType"
      v-model="innerVisible"
      :title="i18n('aicopilot.settings.title')"
      box-width="640px"
      :self-func="true"
      @merge="handleSave"
      @closeAction="innerVisible = false"
  >
    <div class="ai-settings-dialog">
      <el-form :model="form" label-width="120px" label-position="right">
        <el-form-item :label="i18n('aicopilot.settings.provider')">
          <el-select v-model="form.provider" style="width: 200px">
            <el-option
                v-for="opt in providerOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="i18n('aicopilot.settings.model')">
          <el-input
              v-model="form.model"
              placeholder="mock-1 / gpt-4 / claude-3"
              style="width: 240px"
          />
        </el-form-item>

        <el-form-item :label="i18n('aicopilot.settings.temperature')">
          <el-slider
              v-model="form.temperature"
              :min="0"
              :max="2"
              :step="0.1"
              style="width: 240px"
              show-input
              :show-input-controls="false"
          />
        </el-form-item>

        <el-form-item :label="i18n('aicopilot.settings.maxTokens')">
          <el-input-number
              v-model="form.maxTokens"
              :min="64"
              :max="8192"
              :step="64"
              style="width: 200px"
          />
        </el-form-item>

        <el-form-item :label="i18n('aicopilot.settings.systemPrompt')">
          <el-input
              v-model="form.systemPrompt"
              type="textarea"
              :rows="6"
              :placeholder="i18n('aicopilot.settings.systemPromptPlaceholder')"
          />
        </el-form-item>
      </el-form>
    </div>

  </star-horse-panel>
</template>

<style lang="scss" scoped>
.ai-settings-dialog {
  padding: 12px;
  max-height: 60vh;
  overflow: auto;
}
</style>
