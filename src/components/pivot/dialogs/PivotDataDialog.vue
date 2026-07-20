<script setup lang="ts" name="PivotDataDialog">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { i18n } from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import { ShSvgIcon } from "@/components/shared";
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

const activeTab = ref<"json" | "api">("json");
const jsonText = ref("");

/* -------------------- JSON 粘贴 -------------------- */
const handleImportJson = () => {
    try {
        const data = JSON.parse(jsonText.value);
        if (!Array.isArray(data)) {
            ElMessage.error(i18n("pivot.message.dataMustBeArray"));
            return;
        }
        props.designer.loadRecords(data as PivotRecord[]);
        ElMessage.success(i18n("pivot.message.importSuccess"));
        innerVisible.value = false;
    } catch (e: any) {
        ElMessage.error(i18n("pivot.message.jsonParseError") + ": " + e.message);
    }
};

/* -------------------- API 拉取 -------------------- */
const apiUrl = ref("");
const apiMethod = ref<"GET" | "POST">("GET");
const apiHeaders = ref("");
const apiBody = ref("");
const dataPath = ref("");
const apiLoading = ref(false);
const previewRecords = ref<PivotRecord[]>([]);
const previewColumns = ref<string[]>([]);

const handleFetchApi = async () => {
    if (!apiUrl.value.trim()) {
        ElMessage.warning(i18n("pivot.message.apiUrlRequired"));
        return;
    }
    apiLoading.value = true;
    previewRecords.value = [];
    previewColumns.value = [];
    try {
        let headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiHeaders.value.trim()) {
            try {
                headers = JSON.parse(apiHeaders.value);
            } catch {
                ElMessage.error(i18n("pivot.message.apiHeadersInvalid"));
                apiLoading.value = false;
                return;
            }
        }
        const res = await fetch(apiUrl.value, {
            method: apiMethod.value,
            headers,
            body: apiMethod.value === "POST" && apiBody.value.trim()
                ? apiBody.value
                : undefined,
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        const records = dataPath.value.trim()
            ? getPath(json, dataPath.value.trim())
            : json;
        if (!Array.isArray(records)) {
            ElMessage.error(i18n("pivot.message.apiResponseMustBeArray"));
            return;
        }
        previewRecords.value = (records as PivotRecord[]).slice(0, 10);
        previewColumns.value = previewRecords.value.length > 0
            ? Object.keys(previewRecords.value[0]).slice(0, 8)
            : [];
        ElMessage.success(`${i18n("pivot.message.apiFetchSuccess")} (${records.length})`);
    } catch (e: any) {
        ElMessage.error(i18n("pivot.message.apiFetchFailed") + ": " + e.message);
    } finally {
        apiLoading.value = false;
    }
};

const handleApplyApi = async () => {
    if (!apiUrl.value.trim()) {
        ElMessage.warning(i18n("pivot.message.apiUrlRequired"));
        return;
    }
    apiLoading.value = true;
    try {
        let headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiHeaders.value.trim()) {
            headers = JSON.parse(apiHeaders.value);
        }
        await props.designer.loadFromApi(apiUrl.value, {
            method: apiMethod.value,
            headers,
            body: apiMethod.value === "POST" && apiBody.value.trim()
                ? (() => { try { return JSON.parse(apiBody.value); } catch { return apiBody.value; } })()
                : undefined,
            dataPath: dataPath.value.trim() || undefined,
        });
        ElMessage.success(i18n("pivot.message.importSuccess"));
        innerVisible.value = false;
    } catch (e: any) {
        ElMessage.error(i18n("pivot.message.apiFetchFailed") + ": " + e.message);
    } finally {
        apiLoading.value = false;
    }
};

/** 通过点路径取值（如 "data.list" → obj.data.list） */
const getPath = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
};

/* -------------------- 导出 -------------------- */
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

/* -------------------- 重置 -------------------- */
const handleDialogOpen = () => {
    // 每次打开时重置预览状态
    previewRecords.value = [];
    previewColumns.value = [];
};
</script>

<template>
    <star-horse-dialog
        v-model="innerVisible"
        :title="i18n('pivot.dialog.dataManager')"
        box-width="760px"
        :self-func="true"
        @merge="activeTab === 'json' ? handleImportJson() : handleApplyApi()"
        @open="handleDialogOpen"
    >
        <div class="pivot-data-dialog">
            <div class="dialog-toolbar">
                <el-button @click="handleExport">
                    <ShSvgIcon name="download" size="14px"/>
                    {{ i18n("pivot.btn.exportData") }}
                </el-button>
                <span class="count-tip">
                    {{ i18n("pivot.label.currentRecords") }}: {{ designer.state.records.length }}
                    · {{ i18n("pivot.label.currentFields") }}: {{ designer.state.fields.length }}
                </span>
            </div>

            <el-tabs v-model="activeTab" type="border-card">
                <!-- JSON 粘贴 Tab -->
                <el-tab-pane name="json">
                    <template #label>
                        <span class="tab-label">
                            <ShSvgIcon name="json" size="12px"/>
                            {{ i18n("pivot.tab.jsonPaste") }}
                        </span>
                    </template>
                    <el-input
                        v-model="jsonText"
                        type="textarea"
                        :rows="14"
                        :placeholder="i18n('pivot.placeholder.jsonData')"
                    />
                    <div class="tab-footer">
                        <el-button type="primary" @click="handleImportJson">
                            <ShSvgIcon name="upload" size="14px"/>
                            {{ i18n("pivot.btn.importJson") }}
                        </el-button>
                    </div>
                </el-tab-pane>

                <!-- API 拉取 Tab -->
                <el-tab-pane name="api">
                    <template #label>
                        <span class="tab-label">
                            <ShSvgIcon name="api" size="12px"/>
                            {{ i18n("pivot.tab.apiPull") }}
                        </span>
                    </template>
                    <el-form label-width="100px" size="small">
                        <el-form-item :label="i18n('pivot.label.apiUrl')">
                            <el-input
                                v-model="apiUrl"
                                placeholder="https://api.example.com/data"
                                clearable
                            />
                        </el-form-item>
                        <el-form-item :label="i18n('pivot.label.apiMethod')">
                            <el-radio-group v-model="apiMethod">
                                <el-radio-button value="GET">GET</el-radio-button>
                                <el-radio-button value="POST">POST</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="i18n('pivot.label.dataPath')">
                            <el-input
                                v-model="dataPath"
                                placeholder="data.list （留空则根节点必须为数组）"
                                clearable
                            />
                        </el-form-item>
                        <el-form-item :label="i18n('pivot.label.apiHeaders')">
                            <el-input
                                v-model="apiHeaders"
                                type="textarea"
                                :rows="2"
                                placeholder='{"Authorization":"Bearer xxx"}'
                            />
                        </el-form-item>
                        <el-form-item v-if="apiMethod === 'POST'" :label="i18n('pivot.label.apiBody')">
                            <el-input
                                v-model="apiBody"
                                type="textarea"
                                :rows="3"
                                placeholder='{"page":1,"size":100}'
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button :loading="apiLoading" @click="handleFetchApi">
                                <ShSvgIcon name="search" size="14px"/>
                                {{ i18n("pivot.btn.fetchApi") }}
                            </el-button>
                            <el-button
                                type="primary"
                                :disabled="previewRecords.length === 0"
                                :loading="apiLoading"
                                @click="handleApplyApi"
                            >
                                <ShSvgIcon name="check" size="14px"/>
                                {{ i18n("pivot.btn.applyApi") }}
                            </el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 数据预览 -->
                    <div v-if="previewRecords.length > 0" class="preview-section">
                        <div class="preview-title">
                            <ShSvgIcon name="preview" size="14px"/>
                            {{ i18n("pivot.label.preview") }}
                            ({{ previewRecords.length }} / {{ previewColumns.length }} {{ i18n("pivot.label.columns") }})
                        </div>
                        <el-table :data="previewRecords" border size="small" max-height="240">
                            <el-table-column
                                v-for="col in previewColumns"
                                :key="col"
                                :prop="col"
                                :label="col"
                                min-width="100"
                                show-overflow-tooltip
                            />
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </star-horse-dialog>
</template>

<script lang="ts">
export default { components: {} };
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

    .tab-label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .tab-footer {
        margin-top: 8px;
        display: flex;
        justify-content: flex-end;
    }

    .preview-section {
        margin-top: 8px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 4px;
        padding: 8px;
        background: var(--el-fill-color-lighter);

        .preview-title {
            font-size: 12px;
            color: var(--el-text-color-primary);
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 600;
        }
    }
}
</style>
