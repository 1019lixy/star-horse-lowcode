<script setup lang="ts" name="EtlPreviewDialog">
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import type { EtlPipeline, EtlPreviewData } from "../types";
import { findPreset } from "../constants";

const props = defineProps<{
    visible: boolean;
    pipeline: EtlPipeline;
}>();

const emit = defineEmits<{
    (e: "update:visible", v: boolean): void;
}>();

const innerVisible = computed({
    get: () => props.visible,
    set: (v) => emit("update:visible", v),
});

const selectedNodeId = ref<string>("");

watch(
    () => props.visible,
    (v) => {
        if (v && props.pipeline.nodes.length > 0 && !selectedNodeId.value) {
            selectedNodeId.value = props.pipeline.nodes[0].id;
        }
        if (!v) {
            // 关闭时不清空，便于再次打开保留选择
        }
    },
);

const nodeOptions = computed(() =>
    props.pipeline.nodes.map((n) => ({
        id: n.id,
        label: `${n.name} [${findPreset(n.type)?.label ?? n.type}]`,
    })),
);

/** 模拟生成节点预览数据 */
const previewData = computed<EtlPreviewData | null>(() => {
    if (!selectedNodeId.value) return null;
    const node = props.pipeline.nodes.find((n) => n.id === selectedNodeId.value);
    if (!node) return null;
    // 根据节点类型模拟字段与数据
    const fields = simulateFields(node);
    const rows = simulateRows(node, fields);
    return {
        nodeId: node.id,
        fields,
        rows,
        total: rows.length,
    };
});

function simulateFields(node: EtlPipeline["nodes"][number]) {
    if (node.type === "source.database") {
        return [
            { name: "id", type: "number" as const },
            { name: "name", type: "string" as const },
            { name: "amount", type: "number" as const },
            { name: "createdAt", type: "date" as const },
        ];
    }
    if (node.type === "source.api") {
        return [
            { name: "code", type: "number" as const },
            { name: "message", type: "string" as const },
            { name: "data", type: "object" as const },
        ];
    }
    return [
        { name: "id", type: "number" as const },
        { name: "value", type: "string" as const },
        { name: "ts", type: "date" as const },
    ];
}

function simulateRows(node: EtlPipeline["nodes"][number], fields: { name: string; type: string }[]) {
    const count = Math.min(20, Math.max(5, node.rowCount ?? 10));
    const rows: Record<string, any>[] = [];
    for (let i = 0; i < count; i++) {
        const row: Record<string, any> = {};
        for (const f of fields) {
            if (f.type === "number") row[f.name] = i + 1;
            else if (f.type === "date") row[f.name] = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
            else if (f.type === "object") row[f.name] = { foo: "bar", idx: i };
            else row[f.name] = `${f.name}_${i + 1}`;
        }
        rows.push(row);
    }
    return rows;
}

const handleExport = () => {
    if (!previewData.value) return;
    const blob = new Blob([JSON.stringify(previewData.value.rows, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `etl_preview_${selectedNodeId.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('etl.preview.title')"
        box-width="80%"
        box-height="70%"
        :is-show-reset="false"
        :is-show-save="false"
        :self-func="true"
    >
        <div class="etl-preview-dialog">
            <div class="preview-toolbar">
                <el-select v-model="selectedNodeId"  style="width: 280px" :placeholder="i18n('etl.preview.selectNode')">
                    <el-option v-for="opt in nodeOptions" :key="opt.id" :label="opt.label" :value="opt.id" />
                </el-select>
                <el-button  :disabled="!previewData" @click="handleExport">
                    <span class="svg-icon" v-html="icons.download"></span>
                    {{ i18n("etl.btn.export") }}
                </el-button>
            </div>
            <div class="preview-content">
                <div v-if="!previewData" class="empty-tip">{{ i18n("etl.preview.empty") }}</div>
                <template v-else>
                    <div class="preview-meta">
                        {{ i18n("etl.preview.total").replace("{n}", String(previewData.total)) }}
                        ·
                        {{ i18n("etl.preview.rowLimit").replace("{n}", "20") }}
                    </div>
                    <el-table :data="previewData.rows" border  height="100%">
                        <el-table-column v-for="f in previewData.fields" :key="f.name" :prop="f.name" :label="f.name" min-width="120">
                            <template #default="{ row }">
                                <template v-if="typeof row[f.name] === 'object'">{{ JSON.stringify(row[f.name]) }}</template>
                                <template v-else>{{ row[f.name] }}</template>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>
        <template #footer>
            <el-button @click="innerVisible = false">{{ i18n("dialog.close") }}</el-button>
        </template>
    </star-horse-dialog>
</template>

<style lang="scss" scoped>
.etl-preview-dialog {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;

    .preview-toolbar {
        display: flex;
        gap: 8px;
    }

    .preview-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .preview-meta {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }

        .empty-tip {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--el-text-color-placeholder);
            font-size: 14px;
            border: 1px dashed var(--el-border-color);
            border-radius: 4px;
        }
    }
}
.svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    margin-right: 4px;
}
.svg-icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>
