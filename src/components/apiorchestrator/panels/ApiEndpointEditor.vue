<script setup lang="ts" name="ApiEndpointEditor">
import { computed } from "vue";
import { i18n } from "@/lang";
import { API_HTTP_METHODS, METHOD_COLORS, PARAM_LOCATIONS } from "../constants";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";
import type { ApiEndpointParam } from "../types";

const props = defineProps<{
    state: ApiOrchestratorState;
}>();

const endpoint = computed(() => props.state.selectedEndpoint.value);

const update = (key: keyof NonNullable<typeof endpoint.value>, value: any) => {
    if (!endpoint.value) return;
    props.state.updateEndpoint(endpoint.value.id, { [key]: value } as any);
};

/** 请求头操作 */
const addHeader = () => {
    if (!endpoint.value) return;
    const headers = { ...endpoint.value.headers, "": "" };
    update("headers", headers);
};
const updateHeaderKey = (oldKey: string, newKey: string) => {
    if (!endpoint.value) return;
    const headers = { ...endpoint.value.headers };
    const val = headers[oldKey];
    delete headers[oldKey];
    headers[newKey] = val;
    update("headers", headers);
};
const updateHeaderValue = (key: string, value: string) => {
    if (!endpoint.value) return;
    const headers = { ...endpoint.value.headers, [key]: value };
    update("headers", headers);
};
const removeHeader = (key: string) => {
    if (!endpoint.value) return;
    const headers = { ...endpoint.value.headers };
    delete headers[key];
    update("headers", headers);
};
const headerEntries = computed(() => Object.entries(endpoint.value?.headers ?? {}));

/** 参数操作 */
const addParam = () => {
    if (!endpoint.value) return;
    const params: ApiEndpointParam[] = [
        ...endpoint.value.params,
        { name: "", location: "query", required: false, defaultValue: "", description: "" },
    ];
    update("params", params);
};
const updateParam = (index: number, key: keyof ApiEndpointParam, value: any) => {
    if (!endpoint.value) return;
    const params = [...endpoint.value.params];
    params[index] = { ...params[index], [key]: value };
    update("params", params);
};
const removeParam = (index: number) => {
    if (!endpoint.value) return;
    const params = [...endpoint.value.params];
    params.splice(index, 1);
    update("params", params);
};
</script>

<template>
    <div class="api-endpoint-editor">
        <div class="section-title">{{ i18n("api.endpoint.title") }}</div>
        <div v-if="!endpoint" class="empty-tip">{{ i18n("api.endpoint.empty") }}</div>
        <el-form v-else  label-width="80px" class="editor-form">
            <el-form-item :label="i18n('api.endpoint.name')">
                <el-input :model-value="endpoint.name" @change="(v) => update('name', String(v))" />
            </el-form-item>
            <el-form-item :label="i18n('api.endpoint.method')">
                <el-select
                    :model-value="endpoint.method"
                    @change="(v) => update('method', v)"
                    style="width: 140px"
                >
                    <el-option v-for="m in API_HTTP_METHODS" :key="m.value" :label="m.label" :value="m.value" />
                </el-select>
                <span class="method-preview" :style="{ color: METHOD_COLORS[endpoint.method] }">
                    {{ endpoint.method }}
                </span>
            </el-form-item>
            <el-form-item :label="i18n('api.endpoint.url')">
                <el-input :model-value="endpoint.url" @change="(v) => update('url', String(v))" placeholder="/api/users/{{id}}" />
            </el-form-item>
            <el-form-item :label="i18n('api.endpoint.description')">
                <el-input :model-value="endpoint.description" @change="(v) => update('description', String(v))" />
            </el-form-item>

            <el-divider content-position="left">{{ i18n("api.endpoint.headers") }}</el-divider>
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
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
                <el-button  @click="addHeader">+ {{ i18n("api.endpoint.headers") }}</el-button>
            </div>

            <el-divider content-position="left">{{ i18n("api.endpoint.params") }}</el-divider>
            <div class="list-editor">
                <div v-for="(p, idx) in endpoint.params" :key="idx" class="param-row">
                    <el-input
                        :model-value="p.name"

                        :placeholder="i18n('api.param.name')"
                        @change="(v) => updateParam(Number(idx), 'name', String(v))"
                    />
                    <el-select
                        :model-value="p.location"

                        style="width: 90px"
                        @change="(v) => updateParam(Number(idx), 'location', v)"
                    >
                        <el-option v-for="l in PARAM_LOCATIONS" :key="l.value" :label="l.label" :value="l.value" />
                    </el-select>
                    <el-checkbox
                        :model-value="p.required"
                        @change="(v) => updateParam(Number(idx), 'required', !!v)"
                    >
                        {{ i18n("api.param.required") }}
                    </el-checkbox>
                    <el-input
                        :model-value="p.defaultValue"

                        :placeholder="i18n('api.param.default')"
                        @change="(v) => updateParam(Number(idx), 'defaultValue', String(v))"
                    />
                    <el-button text type="danger"  @click="removeParam(Number(idx))">
                        <el-icon><Delete/></el-icon>
                    </el-button>
                </div>
                <el-button  @click="addParam">+ {{ i18n("api.endpoint.params") }}</el-button>
            </div>

            <el-divider content-position="left">{{ i18n("api.endpoint.body") }}</el-divider>
            <el-input
                :model-value="endpoint.body"
                type="textarea"
                :rows="5"
                @change="(v) => update('body', String(v))"
                placeholder='{"key":"value"}'
            />
        </el-form>
    </div>
</template>

<script lang="ts">
import { Delete } from "@element-plus/icons-vue";
export default { components: { Delete } };
</script>

<style lang="scss" scoped>
.api-endpoint-editor {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .section-title {
        padding: 6px 12px;
        font-weight: 600;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-fill-color-light);
    }

    .empty-tip {
        padding: 40px 12px;
        text-align: center;
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }

    .editor-form {
        flex: 1;
        overflow: auto;
        padding: 8px 12px;
    }

    .method-preview {
        margin-left: 8px;
        font-weight: 600;
        font-size: 12px;
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

        .param-row {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;

            :deep(.el-input) {
                flex: 1;
                min-width: 80px;
            }
        }
    }
}
</style>
