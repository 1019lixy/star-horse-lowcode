<script setup lang="ts" name="QualityInspectionDemo">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import {setTest} from "@/api/device";
import StarHorseForm from "@/components/comp/StarHorseForm.vue";
import InspectionToolbar from "@/sample/quality/components/InspectionToolbar.vue";
import type {ToolbarStats} from "@/sample/quality/components/InspectionToolbar.vue";
import {inspectionForms} from "@/sample/quality/data/inspectionForms";
import {firstArticleForms} from "@/sample/quality/data/firstArticleForms";
import type {InspectionFormDef} from "@/sample/quality/data/inspectionForms";
import {
    buildRenderRows,
    expandCheckRows,
    fillAllByOptionIndex,
    parseCheckGroups,
    fillAllResults,
    getCheckStats,
    restoreCheckData,
    snapshotCheckData,
    validateCoverage,
} from "@/components/comp/checkmatrix/useCheckMatrixState";

const route = useRoute();

// 调试入口:URL ?layout=mobile 在 PC 浏览器模拟 APP 端(device.setTest 官方能力),
// 用于实测 App 端分组卡片/抽屉渲染,非核心库行为
onMounted(() => {
  if (route.query.layout === "mobile") {
    setTest(true, "mobile");
  }
});

const allForms: InspectionFormDef[] = [...inspectionForms, ...firstArticleForms];
const currentKey = ref(allForms[0].key);
const currentFormDef = computed<InspectionFormDef>(
    () => allForms.find((form) => form.key === currentKey.value) || allForms[0],
);

const formRef = ref<any>(null);
const liveForm = ref<any>(null);
const saving = ref(false);

const matrixField = computed(() => {
    const field = (currentFormDef.value.fieldList?.fieldList || []).find(
        (item: any) => item.type === "checkmatrix",
    );
    return field || null;
});

const matrixPreps = computed(() => matrixField.value?.preps || {});

// demo 页统计与组件同源:preps.values 经 parseCheckGroups 解析(组件内部同样链路)
const renderRows = computed(() =>
    buildRenderRows(parseCheckGroups(matrixPreps.value.values || []), matrixPreps.value),
);

const matrixValue = computed(
    () => liveForm.value?.[currentFormDef.value.matrixFieldName] || null,
);

const onFormInited = () => {
    liveForm.value = formRef.value?.getFormData?.()?.value || null;
};

const rawStats = computed(() =>
    getCheckStats(matrixValue.value, renderRows.value, matrixPreps.value),
);

/** 前两个非空选项的显示名(按当前表配置,批量按钮文案用) */
const optionNames = computed(() => {
    const nonEmpty = (renderRows.value[0]?.options || []).filter(
        (opt) => opt.value !== "",
    );
    return {
        first: nonEmpty[0]?.name,
        second: nonEmpty[1]?.name,
    };
});

const stats = computed<ToolbarStats>(() => ({
    ...rawStats.value,
    firstOptionName: optionNames.value.first,
    secondOptionName: optionNames.value.second,
}));

const draftKey = computed(
    () => `sh_quality_demo_${currentFormDef.value.key}`,
);
const lastRecordKey = computed(
    () => `sh_quality_last_${currentFormDef.value.key}`,
);

const saveDraft = () => {
    if (!liveForm.value) return;
    localStorage.setItem(
        draftKey.value,
        JSON.stringify({
            formData: {...liveForm.value},
            check: snapshotCheckData(
                matrixValue.value,
                renderRows.value,
                matrixPreps.value,
            ),
        }),
    );
};
watch(currentKey, saveDraft);

const onFillOption = (optIndex: number) => {
    if (!matrixValue.value) return;
    fillAllByOptionIndex(
        matrixValue.value,
        renderRows.value,
        optIndex,
        matrixPreps.value,
    );
};
const onClear = () => {
    ElMessageBox.confirm("清空全部稽核结果?", "提示", {type: "warning"})
        .then(() => {
            if (!matrixValue.value) return;
            fillAllResults(
                matrixValue.value,
                renderRows.value,
                "",
                matrixPreps.value,
            );
        })
        .catch(() => undefined);
};
const onCopyLast = () => {
    const raw = localStorage.getItem(lastRecordKey.value);
    if (!raw) {
        ElMessage.warning("还没有上次保存记录,请先保存一次");
        return;
    }
    const record = JSON.parse(raw);
    if (matrixValue.value) {
        restoreCheckData(
            matrixValue.value,
            record.check || {},
            renderRows.value,
            matrixPreps.value,
        );
    }
    formRef.value?.updateFormData?.(record.formData || {});
    onFormInited();
    ElMessage.success("已带入上次稽核记录,请按本次实际情况修改 NG/NA");
};

const onSave = async () => {
    saving.value = true;
    try {
        const valid = await formRef.value?.validate?.();
        if (!valid) {
            ElMessage.error("头部必填项校验未通过");
            return;
        }
        if (currentFormDef.value.kind === "matrix") {
            const emptyCount = validateCoverage(
                matrixValue.value,
                renderRows.value,
                matrixPreps.value,
            );
            if (emptyCount > 0) {
                ElMessage.error(`稽核结果仍有 ${emptyCount} 格未填`);
                return;
            }
        }
        const detailRows = expandCheckRows(
            matrixValue.value,
            renderRows.value,
            matrixPreps.value,
        );
        localStorage.setItem(
            lastRecordKey.value,
            JSON.stringify({
                formData: {...(liveForm.value || {})},
                check: snapshotCheckData(
                    matrixValue.value,
                    renderRows.value,
                    matrixPreps.value,
                ),
            }),
        );
        const submitPayload = {
            mainTable: {...liveForm.value},
            detailTable: detailRows,
        };
        console.log("提交载荷(主表+明细子表):", submitPayload);
        ElMessage.success(
            `校验通过,已保存(${detailRows.length} 条检查明细,详见控制台提交载荷)`,
        );
    } finally {
        saving.value = false;
    }
};

const formOptions = allForms.map((form) => ({
    key: form.key,
    title: form.title,
}));
</script>

<template>
  <div class="quality-demo">
    <inspection-toolbar
        :title="currentFormDef.title"
        :stats="stats"
        :kind="currentFormDef.kind"
        :form-options="formOptions"
        :current-key="currentKey"
        :saving="saving"
        @update:current-key="currentKey = $event"
        @fill-option="onFillOption"
        @clear="onClear"
        @copy-last="onCopyLast"
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 12px 14px 40px;
  background: #f4f5f7;
  min-height: 100%;

  :deep(.el-form) {
    background: transparent;
  }
}
</style>