<script setup lang="ts" name="QualityLedgerDemo">
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import InspectionToolbar from "@/sample/quality/components/InspectionToolbar.vue";
import {ledgerForms} from "@/sample/quality/data/ledgerData";
import type {InspectionFormDef} from "@/sample/quality/data/inspectionForms";

const currentKey = ref(ledgerForms[0].key);
const currentFormDef = computed<InspectionFormDef>(
    () =>
        (ledgerForms.find((form) => form.key === currentKey.value) ||
            ledgerForms[0]) as InspectionFormDef,
);

const formRef = ref<any>(null);
const liveForm = ref<any>(null);
const saving = ref(false);

const onFormInited = () => {
    liveForm.value = formRef.value?.getFormData?.()?.value || null;
};

/** 子表行数(公共主表下方的明细记录,增删由 table 容器/StarHorseFormList 提供) */
const rowCount = computed(() => {
    const subKey = Object.keys(currentFormDef.value.dataForm).find(
        (key) => Array.isArray(currentFormDef.value.dataForm[key]),
    );
    if (!subKey) return 0;
    return liveForm.value?.[subKey]?.length ?? 0;
});

const onSave = async () => {
    saving.value = true;
    try {
        const valid = await formRef.value?.validate?.();
        if (!valid) {
            ElMessage.error("必填项校验未通过");
            return;
        }
        console.log("台账提交载荷(主表 + 子表明细):", {
            mainTable: {...(liveForm.value || {})},
        });
        ElMessage.success("校验通过,已保存(主表+子表明细见控制台)");
    } finally {
        saving.value = false;
    }
};

const formOptions = ledgerForms.map((form) => ({
    key: form.key,
    title: form.title,
}));
</script>

<template>
  <div class="quality-demo">
    <inspection-toolbar
        :title="currentFormDef.title"
        :stats="{byOption: [], empty: 0, total: rowCount}"
        kind="rowEdit"
        :form-options="formOptions"
        :current-key="currentKey"
        :saving="saving"
        @update:current-key="currentKey = $event"
        @save="onSave"
    />
    <div class="ledger-tip">
      公共部分为主表字段(统计期间/部门/制表人),下方记录明细为子表(table 容器,
      由 StarHorseFormList 渲染,支持逐行新增/删除/编辑)
    </div>
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 14px 40px;
  background: #f4f5f7;
  min-height: 100%;

  :deep(.el-form) {
    background: transparent;
  }
}

.ledger-tip {
  font-size: 12px;
  color: #57606a;
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
}
</style>