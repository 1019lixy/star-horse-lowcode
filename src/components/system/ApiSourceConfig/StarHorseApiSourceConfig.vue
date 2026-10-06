<script setup lang="ts" name="StarHorseApiSourceConfig">
/**
 * 第三方接口配置组件 —— <star-horse-api-source-config v-model="obj" />
 *
 * 抄 dynamicform/ApiConfigForm 的模式：createApiSourceSchema(...) 一次性
 * 创建 schema，<star-horse-form> 渲染。
 *
 * v-model 数据流（受控弹窗编辑模式）：
 * - model → form：modelValue 变化（或表单挂载完成 inited）→ setFormData 灌入，
 *   保证编辑必回显；inited 兜底解决弹窗惰性渲染下 formRef 未就绪导致首次灌入丢失
 * - form → model：submit() 时 getFormData 并 emit update:modelValue；
 *   父组件也可直接调 getFormData 取表单最新数据
 * - 灌入前做内容比较：表单与 model 内容一致则跳过，防冗余灌入
 */
import { nextTick, ref, unref, watch } from "vue";
import { createApiSourceSchema } from "./schema";
import type { ApiSourceConfigModel, ApiSourceSchemaOptions } from "./types";

const props = defineProps<{
  modelValue?: ApiSourceConfigModel;
  options?: ApiSourceSchemaOptions;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: ApiSourceConfigModel): void;
  (e: "change", v: ApiSourceConfigModel): void;
}>();

const formRef = ref<any>(null);
const schema = createApiSourceSchema(props.options ?? {});
/** 灌入前 bump 迫使表单重建：字段 init 时 dataForm 为空 → 联动走"watch 等值出现"分支，
 *  setFormData 灌入后按新值初始化显隐联动（dataRelation watch 是一次性的，
 *  组件不重建时二次灌入不会重算联动） */
const formKey = ref(0);

/** 表单挂载完成或 modelValue 变化时，把 model 灌入表单。
 *  rebuild=true（modelValue 变化）：先重建表单再灌入，保证联动按新数据初始化；
 *  inited 触发（rebuild 为空）：直接灌入，联动经"watch 等值出现"分支自然初始化 */
const syncFromModel = async (rebuild?: boolean) => {
  await nextTick();
  const f = formRef.value;
  if (!f) return;
  const model = unref(props.modelValue) ?? {};
  if (rebuild) {
    formKey.value++;
    await nextTick();
  }
  formRef.value?.setFormData?.(model);
};

watch(() => props.modelValue, () => syncFromModel(true), {immediate: true});

const getFormData = (): ApiSourceConfigModel =>
    (unref(formRef.value?.getFormData?.()) ?? {}) as ApiSourceConfigModel;

const setFormData = (d: any) => formRef.value?.setFormData?.(d);

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

const submit = (): ApiSourceConfigModel => {
    const data = getFormData();
    const snapshot = {...data};
    emit("update:modelValue", snapshot);
    emit("change", snapshot);
    return {...data};
};

defineExpose({getFormData, setFormData, submit, submitValid});
</script>

<template>
  <star-horse-form
      :key="formKey"
      ref="formRef"
      :fieldList="schema"
      @inited="syncFromModel"
  />
</template>
