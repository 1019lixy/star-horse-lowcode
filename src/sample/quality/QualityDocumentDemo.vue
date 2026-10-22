<script setup lang="ts" name="QualityDocumentDemo">
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import InspectionToolbar from "@/sample/quality/components/InspectionToolbar.vue";
import {documentForms} from "@/sample/quality/data/documentForms";
import type {InspectionFormDef} from "@/sample/quality/data/inspectionForms";

const currentKey = ref(documentForms[0].key);
const currentFormDef = computed<InspectionFormDef>(
    () =>
        documentForms.find((form) => form.key === currentKey.value) ||
        documentForms[0],
);
const formRef = ref<any>(null);
const liveForm = ref<any>(null);
const saving = ref(false);

const onFormInited = () => {
    liveForm.value = formRef.value?.getFormData?.()?.value || null;
};

const onSave = async () => {
    saving.value = true;
    try {
        const valid = await formRef.value?.validate?.();
        if (!valid) {
            ElMessage.error("必填项校验未通过");
            return;
        }
        console.log("单据提交载荷:", {...(liveForm.value || {})});
        ElMessage.success("校验通过,已保存(提交载荷见控制台)");
    } finally {
        saving.value = false;
    }
};

const formOptions = documentForms.map((form) => ({
    key: form.key,
    title: form.title,
}));
</script>

<template>
  <div class="quality-demo">
    <inspection-toolbar
        :title="currentFormDef.title"
        :stats="{byOption: [], empty: 0, total: 0}"
        kind="rowEdit"
        :form-options="formOptions"
        :current-key="currentKey"
        :saving="saving"
        @update:current-key="currentKey = $event"
        @save="onSave"
    />
    <star-horse-form
        :key="currentFormDef.key"
        ref="formRef"
        :fieldList="currentFormDef.fieldList"
        :outerFormData="currentFormDef.dataForm"
        label-position="top"
        @inited="onFormInited"
    />
  </div>
</template>

<style scoped lang="scss">
.quality-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 14px 40px;
  background: #f4f5f7;
  min-height: 100%;

  :deep(.el-form) {
    background: transparent;
  }
}
</style>