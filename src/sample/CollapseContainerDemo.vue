<script setup lang="ts" name="CollapseContainerDemo">
import { nextTick, onMounted, provide, reactive, ref } from "vue";
import { dialogPreps } from "@/api/star_horse_utils";
import type { PageFieldInfo } from "@/components/types";
import { StarHorseDialog, StarHorseForm } from "@/components/comp";

/**
 * 验证场景：通过 configType 的 dataRelation 策略(controlTarget=container)
 * 控制 collapseList 容器中各 collapse item 的显隐
 * 切换下拉框,仅对应 collapse item 可见(其余隐藏),非 disabled
 * 不依赖后端,纯前端渲染验证
 */

const configTypeOptions = [
  { name: "基础配置", value: "basic" },
  { name: "高级配置", value: "advanced" },
  { name: "安全配置", value: "security" },
  { name: "网络配置", value: "network" },
];
const encryptModeOptions = [
  { name: "MD5", value: "md5" },
  { name: "SHA256", value: "sha256" },
  { name: "AES", value: "aes" },
];
const protocolOptions = [
  { name: "HTTP", value: "http" },
  { name: "HTTPS", value: "https" },
  { name: "TCP", value: "tcp" },
];

/**
 * 构造 configType 的 dataRelation 容器控制配置
 * relationFields 为各 collapse item 的 tabName,匹配后 eqVisible
 */
const buildConfigTypeContainerRelation = () => {
  const types = ["basic", "advanced", "security", "network"];
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
  fieldName: "basic", // 默认激活展开项
  label: "配置面板",
  type: "collapseList",
  formVisible: true,
  listVisible: false,
  collapseList: [
    // ========== basic 基础配置 ==========
    {
      title: "基础配置",
      tabName: "basic",
      objectName: "basicConfig",
      formVisible: true,
      fieldList: [
        {
          label: "配置名称",
          fieldName: "configName",
          required: true,
          formVisible: true,
          defaultValue: "default",
        },
        {
          label: "是否启用日志",
          fieldName: "enableLog",
          type: "switch",
          formVisible: true,
          defaultValue: "N",
          preps: {
            activeValue: "Y",
            inactiveValue: "N",
            activeText: "启用",
            inactiveText: "禁用",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: ["logPath"],
                  matchFieldValue: ["Y"],
                },
              ],
            },
          },
        },
        {
          label: "日志路径",
          fieldName: "logPath",
          formVisible: false,
          preps: { placeholder: "/var/log/app.log" },
        },
      ],
    },
    // ========== advanced 高级配置 ==========
    {
      title: "高级配置",
      tabName: "advanced",
      objectName: "advancedConfig",
      formVisible: false,
      fieldList: [
        {
          label: "最大重试次数",
          fieldName: "maxRetry",
          type: "number",
          formVisible: true,
          defaultValue: 3,
        },
        {
          label: "是否启用缓存",
          fieldName: "enableCache",
          type: "switch",
          formVisible: true,
          defaultValue: "N",
          preps: {
            activeValue: "Y",
            inactiveValue: "N",
            activeText: "启用",
            inactiveText: "禁用",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: ["cacheTtl"],
                  matchFieldValue: ["Y"],
                },
              ],
            },
          },
        },
        {
          label: "缓存时长(秒)",
          fieldName: "cacheTtl",
          type: "number",
          formVisible: false,
          defaultValue: 300,
        },
      ],
    },
    // ========== security 安全配置 ==========
    {
      title: "安全配置",
      tabName: "security",
      objectName: "securityConfig",
      formVisible: false,
      fieldList: [
        {
          label: "是否启用认证",
          fieldName: "enableAuth",
          type: "switch",
          formVisible: true,
          defaultValue: "N",
          preps: {
            activeValue: "Y",
            inactiveValue: "N",
            activeText: "启用",
            inactiveText: "禁用",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                {
                  matchType: "eq",
                  controlCondition: "eqVisible",
                  relationFields: ["authToken"],
                  matchFieldValue: ["Y"],
                },
              ],
            },
          },
        },
        {
          label: "认证令牌",
          fieldName: "authToken",
          type: "password",
          formVisible: false,
          preps: { placeholder: "Bearer Token" },
        },
        {
          label: "加密方式",
          fieldName: "encryptMode",
          type: "select",
          formVisible: true,
          defaultValue: "sha256",
          preps: { values: encryptModeOptions },
        },
      ],
    },
    // ========== network 网络配置 ==========
    {
      title: "网络配置",
      tabName: "network",
      objectName: "networkConfig",
      formVisible: false,
      fieldList: [
        {
          label: "协议",
          fieldName: "protocol",
          type: "select",
          required: true,
          formVisible: true,
          defaultValue: "https",
          preps: { values: protocolOptions },
        },
        {
          label: "主机地址",
          fieldName: "host",
          formVisible: true,
          defaultValue: "127.0.0.1",
        },
        {
          label: "端口",
          fieldName: "port",
          type: "number",
          formVisible: true,
          defaultValue: 8080,
        },
      ],
    },
  ],
});

const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    { label: "主键", fieldName: "id", formVisible: false },
    {
      label: "配置类型",
      fieldName: "configType",
      type: "select",
      required: true,
      formVisible: true,
      listVisible: true,
      defaultValue: "basic",
      preps: {
        values: configTypeOptions,
        // 通过 dataRelation 容器控制策略,声明式控制 collapseList 中各 collapse item 的显隐
        dataRelation: buildConfigTypeContainerRelation(),
      },
    },
    container,
  ],
});

const rules = {
  configType: [
    { required: true, message: "请选择配置类型", trigger: "change" },
  ],
};

const dialogProps = dialogPreps("配置面板");
provide("dialogProps", dialogProps);

// 直接打开编辑弹窗,验证表单渲染
const editVisible = ref(true);
const syncEditVisible = (val: boolean) => {
  editVisible.value = val;
};

const formRef = ref();
/**
 * 表单初始化完成后,调用 resetForm 应用默认值(如 configType=basic)
 * 触发 dataRelation 一次性 watch,根据默认值控制初始 collapse item 显隐
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
        切换「配置类型」下拉框,下方折叠面板应同步只显示对应配置项(其余隐藏,而非
        disabled)。 这是通过 configType 的 dataRelation 配置
        controlTarget="container" 实现的声明式 collapseList 容器控制。 每个
        collapse item 内部还有字段级联动(如启用日志→显示日志路径)。
      </template>
    </el-alert>
    <star-horse-dialog
      v-model="editVisible"
      :isShowBtnContinue="true"
      title="折叠面板容器控制验证"
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
