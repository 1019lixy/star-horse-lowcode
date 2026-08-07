<script setup lang="ts">
import {computed, ref, watch} from "vue";
import type {IdeApiConfig} from "./constants";
import {API_METHOD_MAP} from "./constants";

const props = defineProps<{
  visible: boolean;
  config: IdeApiConfig;
  resolvedConfig: IdeApiConfig;
  themeVars: Record<string, string>;
}>();

const emit = defineEmits<{
  "update:visible": [val: boolean];
  save: [config: IdeApiConfig];
  reset: [];
}>();

/** 分组定义 */
const API_GROUPS = [
  {
    title: "文件操作",
    icon: "📄",
    fields: [
      {
        key: "loadUrl" as keyof IdeApiConfig,
        label: "加载文件",
        desc: "从服务器加载代码文件",
      },
      {
        key: "saveUrl" as keyof IdeApiConfig,
        label: "保存文件",
        desc: "保存代码到服务器",
      },
      {
        key: "createModuleUrl" as keyof IdeApiConfig,
        label: "创建模块",
        desc: "创建新代码模块",
      },
    ],
  },
  {
    title: "编译运行",
    icon: "⚡",
    fields: [
      {
        key: "compileUrl" as keyof IdeApiConfig,
        label: "编译",
        desc: "编译代码",
      },
      {key: "runUrl" as keyof IdeApiConfig, label: "运行", desc: "运行代码"},
      {
        key: "compileRegisterUrl" as keyof IdeApiConfig,
        label: "编译注册",
        desc: "编译并注册为Spring Bean",
      },
      {
        key: "executeUrl" as keyof IdeApiConfig,
        label: "执行方法",
        desc: "执行指定Bean方法",
      },
    ],
  },
  {
    title: "动态Bean管理",
    icon: "🔧",
    fields: [
      {
        key: "unregisterUrl" as keyof IdeApiConfig,
        label: "注销Bean",
        desc: "注销指定动态Bean",
      },
      {
        key: "unregisterAllUrl" as keyof IdeApiConfig,
        label: "注销全部",
        desc: "注销所有动态Bean",
      },
      {
        key: "registeredListUrl" as keyof IdeApiConfig,
        label: "已注册列表",
        desc: "获取已注册Bean列表",
      },
      {
        key: "healthCheckUrl" as keyof IdeApiConfig,
        label: "健康检查",
        desc: "检查动态Bean健康状态",
      },
    ],
  },
  {
    title: "模板管理",
    icon: "📋",
    fields: [
      {
        key: "templateUrl" as keyof IdeApiConfig,
        label: "模板列表",
        desc: "获取代码模板列表",
      },
      {
        key: "templateLoadUrl" as keyof IdeApiConfig,
        label: "加载模板",
        desc: "加载指定模板代码",
      },
    ],
  },
  {
    title: "草稿管理",
    icon: "💾",
    fields: [
      {
        key: "draftSaveUrl" as keyof IdeApiConfig,
        label: "保存草稿",
        desc: "保存代码草稿",
      },
      {
        key: "draftListUrl" as keyof IdeApiConfig,
        label: "草稿列表",
        desc: "获取草稿列表",
      },
      {
        key: "draftSourceUrl" as keyof IdeApiConfig,
        label: "草稿源码",
        desc: "获取草稿源码",
      },
    ],
  },
  {
    title: "源码管理",
    icon: "📦",
    fields: [
      {
        key: "sourceCodeUrl" as keyof IdeApiConfig,
        label: "源码接口",
        desc: "获取/更新源码",
      },
    ],
  },
];

// 本地编辑的配置副本
const editConfig = ref<IdeApiConfig>({});

watch(
    () => props.visible,
    (v) => {
      if (v) editConfig.value = {...props.config};
    },
);

const handleSave = () => {
  emit("save", {...editConfig.value});
  emit("update:visible", false);
};

const handleReset = () => {
  emit("reset");
  editConfig.value = {...props.resolvedConfig};
};

const handleCancel = () => {
  emit("update:visible", false);
};

const hasChanged = () => {
  return JSON.stringify(editConfig.value) !== JSON.stringify(props.config);
};

// 将主题变量转为CSS style对象，挂到overlay上确保子元素继承
const overlayStyle = computed(() => {
  const s: Record<string, string> = {};
  for (const [k, v] of Object.entries(props.themeVars)) {
    s[k] = v;
  }
  return s;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="api-dialog-fade">
      <div
          v-if="visible"
          class="api-dialog-overlay"
          :style="overlayStyle"
          @click.self="handleCancel"
      >
        <div class="api-dialog">
          <!-- 头部 -->
          <div class="api-dialog-header">
            <div class="api-dialog-title">
              <svg
                  viewBox="0 0 16 16"
                  width="18"
                  height="18"
                  fill="currentColor"
                  style="opacity: 0.7"
              >
                <path
                    d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
                />
                <path
                    d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
                />
              </svg>
              <span>API 接口配置</span>
            </div>
            <button class="api-dialog-close" @click="handleCancel">
              <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
              >
                <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>

          <!-- 内容 -->
          <div class="api-dialog-body">
            <div
                v-for="group in API_GROUPS"
                :key="group.title"
                class="api-group"
            >
              <div class="api-group-header">
                <span class="api-group-icon">{{ group.icon }}</span>
                <span class="api-group-title">{{ group.title }}</span>
              </div>
              <div class="api-group-fields">
                <div
                    v-for="field in group.fields"
                    :key="field.key"
                    class="api-field"
                >
                  <div class="api-field-label-row">
                    <label class="api-field-label">{{ field.label }}</label>
                    <span
                        class="api-method-badge"
                        :class="
                        API_METHOD_MAP[field.key] === 'GET'
                          ? 'api-method-badge--get'
                          : 'api-method-badge--post'
                      "
                    >
                      {{ API_METHOD_MAP[field.key] || "POST" }}
                    </span>
                    <span class="api-field-desc">{{ field.desc }}</span>
                  </div>
                  <div class="api-field-input-wrap">
                    <input
                        class="api-field-input"
                        :value="editConfig[field.key] || ''"
                        :placeholder="resolvedConfig[field.key] || '未配置'"
                        @input="
                        editConfig[field.key] = (
                          $event.target as HTMLInputElement
                        ).value
                      "
                    />
                    <button
                        v-if="editConfig[field.key]"
                        class="api-field-clear"
                        title="清除"
                        @click="editConfig[field.key] = ''"
                    >
                      <svg
                          viewBox="0 0 16 16"
                          width="12"
                          height="12"
                          fill="currentColor"
                      >
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部 -->
          <div class="api-dialog-footer">
            <button class="api-btn api-btn-reset" @click="handleReset">
              <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
              >
                <path
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path
                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                />
              </svg>
              重置为默认
            </button>
            <div class="api-footer-right">
              <button class="api-btn api-btn-cancel" @click="handleCancel">
                取消
              </button>
              <button
                  class="api-btn api-btn-save"
                  :disabled="!hasChanged()"
                  @click="handleSave"
              >
                <svg
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    fill="currentColor"
                >
                  <path
                      d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.293l-.854-.853a.5.5 0 1 0-.707.707l1.5 1.5a.5.5 0 0 0 .707 0l1.5-1.5a.5.5 0 1 0-.707-.707L9.5 6.293V2H13v12H2V2h2.5v1.5a.5.5 0 0 0 1 0V2h1V1H2z"
                  />
                </svg>
                保存配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.api-dialog-fade-enter-active,
.api-dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.api-dialog-fade-enter-from,
.api-dialog-fade-leave-to {
  opacity: 0;
}

.api-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--ide-bg, #1e1e1e) 60%, transparent);
  backdrop-filter: blur(3px);
}

.api-dialog {
  width: 620px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  background: var(--ide-bg-secondary, #252526);
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.api-dialog-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--ide-bg-tertiary, #2d2d2d);
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
}

.api-dialog-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ide-fg-bright, #ffffff);
}

.api-dialog-close {
  background: none;
  border: none;
  color: var(--ide-fg-dim, #858585);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.api-dialog-close:hover {
  background: var(--ide-bg-hover, #2a2d2e);
  color: var(--ide-fg, #cccccc);
}

.api-dialog-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.api-dialog-body::-webkit-scrollbar {
  width: 6px;
}

.api-dialog-body::-webkit-scrollbar-track {
  background: transparent;
}

.api-dialog-body::-webkit-scrollbar-thumb {
  background: var(--ide-fg-dim, rgba(121, 121, 121, 0.4));
  border-radius: 3px;
}

.api-group {
  border-radius: 6px;
  background: var(--ide-bg, #1e1e1e);
  border: 1px solid var(--ide-border, #3c3c3c);
}

.api-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--ide-bg-tertiary, #2d2d2d);
  border-bottom: 1px solid var(--ide-border, #3c3c3c);
}

.api-group-icon {
  font-size: 14px;
}

.api-group-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--ide-fg, #cccccc);
  letter-spacing: 0.3px;
}

.api-group-fields {
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.api-field-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.api-method-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 1px 6px;
  border-radius: 3px;
  line-height: 1.4;
  flex-shrink: 0;

  &--get {
    background: rgba(97, 175, 254, 0.15);
    color: #61affe;
    border: 1px solid rgba(97, 175, 254, 0.3);
  }

  &--post {
    background: rgba(73, 204, 144, 0.15);
    color: #49cc90;
    border: 1px solid rgba(73, 204, 144, 0.3);
  }
}

.api-field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ide-fg, #cccccc);
  white-space: nowrap;
}

.api-field-desc {
  font-size: 11px;
  color: var(--ide-fg-dim, #666);
}

.api-field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.api-field-input {
  width: 100%;
  padding: 7px 28px 7px 10px;
  font-size: 12px;
  font-family: "Cascadia Code", "Fira Code", "Consolas", monospace;
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  background: var(--ide-bg-input, #3c3c3c);
  color: var(--ide-fg, #cccccc);
  outline: none;
  transition: border-color 0.15s,
  box-shadow 0.15s;
  box-sizing: border-box;
}

.api-field-input:focus {
  border-color: var(--ide-accent, #007acc);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ide-accent, #007acc) 25%, transparent);
}

.api-field-input::placeholder {
  color: var(--ide-fg-dim, #555);
  font-style: italic;
}

.api-field-clear {
  position: absolute;
  right: 6px;
  background: none;
  border: none;
  color: var(--ide-fg-dim, #666);
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.api-field-clear:hover {
  color: var(--ide-error, #f14c4c);
  background: rgba(241, 76, 76, 0.1);
}

.api-dialog-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--ide-bg-tertiary, #2d2d2d);
  border-top: 1px solid var(--ide-border, #3c3c3c);
}

.api-footer-right {
  display: flex;
  gap: 8px;
}

.api-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--ide-border, #3c3c3c);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  background: none;
  color: var(--ide-fg, #cccccc);
}

.api-btn-reset {
  color: var(--ide-fg-dim, #999);
}

.api-btn-reset:hover {
  background: var(--ide-bg-hover, #2a2d2e);
  color: var(--ide-fg, #cccccc);
}

.api-btn-cancel:hover {
  background: var(--ide-bg-hover, #2a2d2e);
}

.api-btn-save {
  background: var(--ide-accent, #007acc);
  border-color: var(--ide-accent, #007acc);
  color: #fff;
}

.api-btn-save:hover:not(:disabled) {
  background: var(--ide-accent-hover, #1a8ad4);
}

.api-btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
