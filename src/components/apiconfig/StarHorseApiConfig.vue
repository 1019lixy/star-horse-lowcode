<script setup lang="ts" name="StarHorseApiConfig">
/**
 * 公共接口配置组件 —— <star-horse-api-config>
 *
 * 用法：
 *  1) 直接挂载：
 *     <star-horse-api-config ref="apiRef" :options="{ formFields, mode:'linkage' }" />
 *     // 然后 apiRef.value.setFormData(model) / apiRef.value.getFormData()
 *
 *  2) 只要 schema（非 star-horse-form 环境也能拿同一份配置）：
 *     import { createApiConfigSchema } from "star-horse-lowcode";
 *     const { fieldList } = createApiConfigSchema({...});
 *
 *  3) 与编排器互通：
 *     import { toEndpointModel, fromEndpointModel } from "star-horse-lowcode";
 */
import { computed, nextTick, onMounted, ref } from "vue";
import { i18n } from "@/lang";
import { postRequest } from "@/api/star_horse_apis";
import { error, success, warning } from "@/utils/message";
import { createApiConfigSchema } from "./schema";
import type { ApiConfigModel, ApiConfigSchemaOptions } from "./types";

const props = defineProps<{
  /** 初始值 / v-model 绑定；组件通过 setFormData 推送给内部 star-horse-form */
  modelValue?: ApiConfigModel;
  /** schema 生成器选项 */
  options?: ApiConfigSchemaOptions;
  /** 是否显示内置的 "校验" 按钮（依赖 options.apiValidUrl） */
  showVerifyButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: ApiConfigModel): void;
  (e: "change", v: ApiConfigModel): void;
}>();

const formRef = ref<any>(null);

const resolvedOptions = computed<ApiConfigSchemaOptions>(
  () => props.options ?? {},
);
const schema = computed(() => createApiConfigSchema(resolvedOptions.value));

/** 推送表单数据到 star-horse-form */
const setFormData = (data: ApiConfigModel) => {
  nextTick(() => formRef.value?.setFormData?.(data));
};

/** 拉取当前表单数据 */
const getFormData = (): ApiConfigModel => {
  const raw = (formRef.value?.getFormData?.() ?? {}) as Partial<ApiConfigModel>;
  return {
    proxy: true,
    conditionFields: [],
    pageSize: 0,
    responseMode: "options",
    apiType: "thirdApi",
    redirect: true,
    httpMethod: "GET",
    protocol: "http",
    url: "",
    dataType: "JSON",
    headers: [],
    requestParams: [],
    responseTemplate: "result_data_list",
    codePath: "code",
    dataPath: "data",
    successCode: "",
    fieldMappings: [],
    isolationDetails: [],
    ...(props.modelValue ?? ({} as ApiConfigModel)),
    ...raw,
  } as ApiConfigModel;
};

/** 表单内建校验 */
const submitValid = async (): Promise<boolean> => {
  const inner = formRef.value?.$refs?.starHorseFormRef ?? formRef.value;
  if (inner && typeof inner.validate === "function") {
    let flag = false;
    await inner.validate((res: boolean) => {
      flag = res;
    });
    return !!flag;
  }
  return true;
};

/** 提交到代理后端做真实校验（可选） */
const apiValid = async (): Promise<boolean> => {
  if (!(await submitValid())) {
    warning(i18n("apiConfig.msg.incomplete"));
    return false;
  }
  const url = schema.value.apiValidUrl;
  if (!url) return true;
  const data = getFormData();
  try {
    const res: any = await postRequest(url, data);
    const code = res?.code ?? res?.data?.code;
    const msg = res?.cnMessage ?? res?.message ?? res?.data?.message;
    if (code === 200) {
      success(msg || i18n("apiConfig.msg.verifyOk"));
      emit("change", data);
      emit("update:modelValue", data);
      return true;
    }
    error(msg || i18n("apiConfig.msg.verifyFail"));
    return false;
  } catch (err: any) {
    error(err?.message ?? i18n("apiConfig.msg.network"));
    return false;
  }
};

/** 主动同步：由父组件调用，把当前表单快照 emit 出去 */
const sync = () => {
  const data = getFormData();
  emit("update:modelValue", data);
  emit("change", data);
  return data;
};

onMounted(() => {
  if (props.modelValue) setFormData(props.modelValue);
});

defineExpose({
  setFormData,
  getFormData,
  submitValid,
  apiValid,
  sync,
});
</script>

<template>
  <div class="star-horse-api-config">
    <div
      v-if="showVerifyButton !== false && resolvedOptions.apiValidUrl"
      class="shac-toolbar"
    >
      <el-button size="small" type="primary" plain @click="apiValid">
        {{ i18n("apiConfig.btn.verify") }}
      </el-button>
    </div>
    <star-horse-form ref="formRef" :fieldList="schema.fieldList" />
  </div>
</template>

<style scoped lang="scss">
.star-horse-api-config {
  width: 100%;

  .shac-toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin: 4px 0 6px;
  }
}
</style>
