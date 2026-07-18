<script setup lang="ts" name="PivotDataDialog">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { PivotDesigner } from "../composables/usePivotDesigner";
import type { PivotRecord } from "../types";

const props = defineProps<{
    visible: boolean;
    designer: PivotDesigner;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const jsonText = ref("");

const handleImport = () => {
    try {
        const data = JSON.parse(jsonText.value);
        if (!Array.isArray(data)) {
            ElMessage.error(i18n("pivot.message.dataMustBeArray"));
            return;
        }
        // 自动提取字段
        const fieldSet = new Set<string>();
        for (const rec of data) {
            if (typeof rec !== "object" || rec === null) continue;
            for (const k of Object.keys(rec)) fieldSet.add(k);
        }
        // 删除已不存在字段的引用
        const newFieldNames = Array.from(fieldSet);
        const oldFields = props.designer.state.fields.filter((f) => fieldSet.has(f.name));
        const newFields = newFieldNames
            .filter((n) => !oldFields.find((f) => f.name === n))
            .map((n) => {
                const sample = (data as PivotRecord[]).find((r) => r[n] !== undefined)?.[n];
                const type = typeof sample === "number" ? "number" :
                    /^\d{4}-\d{2}-\d{2}/.test(String(sample)) ? "date" : "string";
                return {
                    name: n,
                    label: n,
                    type: type as "string" | "number" | "date",
                    aggregation: (type === "number" ? "sum" : "count") as "sum" | "count",
                    format: "",
                };
            });
        props.designer.state.fields = [...oldFields, ...newFields];
        props.designer.state.records = data as PivotRecord[];
        ElMessage.success(i18n("pivot.message.importSuccess"));
        innerVisible.value = false;
    } catch (e: any) {
        ElMessage.error(i18n("pivot.message.jsonParseError") + ": " + e.message);
    }
};

const handleExport = () => {
    const data = JSON.stringify(props.designer.state.records, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pivot-data.json";
    a.click();
    URL.revokeObjectURL(url);
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('pivot.dialog.dataManager')"
        box-width="700px"
        :self-func="true"
        @merge="handleImport"
    >
        <div class="pivot-data-dialog">
            <div class="dialog-toolbar">
                <el-button  @click="handleExport">
                    <el-icon><Download/></el-icon>
                    {{ i18n("pivot.btn.exportData") }}
                </el-button>
                <span class="count-tip">
                    {{ i18n("pivot.label.currentRecords") }}: {{ designer.state.records.length }}
                </span>
            </div>
            <el-input
                v-model="jsonText"
                type="textarea"
                :rows="15"
                :placeholder="i18n('pivot.placeholder.jsonData')"
            />
        </div>
    </star-horse-dialog>
</template>

<script lang="ts">
import { Download } from "@element-plus/icons-vue";
export default { components: { Download } };
</script>

<style lang="scss" scoped>
.pivot-data-dialog {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .dialog-toolbar {
        display: flex;
        align-items: center;
        gap: 12px;

        .count-tip {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }
}
</style>
