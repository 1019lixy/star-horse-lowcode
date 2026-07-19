<script setup lang="ts" name="ApiMockConfig">
import { computed } from "vue";
import { i18n } from "@/lang";
import { STATUS_CODES } from "../constants";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";
import type { MockResponse } from "../types";

const props = defineProps<{
    state: ApiOrchestratorState;
}>();

/** 当前选中接口对应的活跃 mock */
const mock = computed<MockResponse | null>(() => {
    const epId = props.state.selectedEndpointId.value;
    if (!epId) return null;
    return props.state.mocks.find((m) => m.endpointId === epId && m.isActive) ?? null;
});

const update = (key: keyof MockResponse, value: any) => {
    if (!mock.value) return;
    props.state.updateMock(mock.value.id, { [key]: value } as any);
};

/** 响应头操作 */
const addHeader = () => {
    if (!mock.value) return;
    const headers = { ...mock.value.headers, "": "" };
    update("headers", headers);
};
const updateHeaderKey = (oldKey: string, newKey: string) => {
    if (!mock.value) return;
    const headers = { ...mock.value.headers };
    const val = headers[oldKey];
    delete headers[oldKey];
    headers[newKey] = val;
    update("headers", headers);
};
const updateHeaderValue = (key: string, value: string) => {
    if (!mock.value) return;
    const headers = { ...mock.value.headers, [key]: value };
    update("headers", headers);
};
const removeHeader = (key: string) => {
    if (!mock.value) return;
    const headers = { ...mock.value.headers };
    delete headers[key];
    update("headers", headers);
};
const headerEntries = computed(() => Object.entries(mock.value?.headers ?? {}));

/** 内联 SVG 图标（替代 Element Plus 图标，减少依赖） */
const icons: Record<string, string> = {
    delete: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M10 11v6M14 11v6"/></svg>'
};
</script>

<template>
    <div class="api-mock-config">
        <div class="section-title">{{ i18n("api.mock.title") }}</div>
        <div v-if="!mock" class="empty-tip">{{ i18n("api.mock.empty") }}</div>
        <el-form v-else  label-width="80px" class="mock-form">
            <el-form-item :label="i18n('api.mock.status')">
                <el-select :model-value="mock.status" @change="(v) => update('status', Number(v))" style="width: 100%">
                    <el-option v-for="s in STATUS_CODES" :key="s.value" :label="s.label" :value="s.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="i18n('api.mock.statusText')">
                <el-input :model-value="mock.statusText" @change="(v) => update('statusText', String(v))" />
            </el-form-item>
            <el-form-item :label="i18n('api.mock.delay')">
                <el-input-number
                    :model-value="mock.delay"
                    :min="0"
                    :step="50"
                    @change="(v) => update('delay', Number(v ?? 0))"
                    style="width: 100%"
                />
            </el-form-item>
            <el-form-item :label="i18n('api.mock.active')">
                <el-switch :model-value="mock.isActive" @change="(v) => update('isActive', !!v)" />
            </el-form-item>

            <el-divider content-position="left">{{ i18n("api.mock.headers") }}</el-divider>
            <div class="list-editor">
                <div v-for="([key, val], idx) in headerEntries" :key="idx" class="list-row kv-row">
                    <el-input
                        :model-value="key"

                        placeholder="Header"
                        @change="(v) => updateHeaderKey(key, String(v))"
                    />
                    <el-input
                        :model-value="val"

                        placeholder="Value"
                        @change="(v) => updateHeaderValue(key, String(v))"
                    />
                    <el-button text type="danger"  @click="removeHeader(key)">
                        <span class="svg-icon" v-html="icons.delete"></span>
                    </el-button>
                </div>
                <el-button  @click="addHeader">+ {{ i18n("api.mock.headers") }}</el-button>
            </div>

            <el-divider content-position="left">{{ i18n("api.mock.body") }}</el-divider>
            <el-input
                :model-value="mock.body"
                type="textarea"
                :rows="10"
                @change="(v) => update('body', String(v))"
            />
        </el-form>
    </div>
</template>


<style lang="scss" scoped>
.api-mock-config {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .section-title {
        padding: 6px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-fill-color-light);
        flex-shrink: 0;
    }

    .empty-tip {
        padding: 40px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }

    .mock-form {
        flex: 1;
        overflow: auto;
        padding: 8px 12px;
    }

    .list-editor {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .list-row.kv-row {
            display: flex;
            align-items: center;
            gap: 4px;

            :deep(.el-input) {
                flex: 1;
            }
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
