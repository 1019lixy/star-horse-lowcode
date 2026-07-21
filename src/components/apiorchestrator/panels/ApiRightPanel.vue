<script setup lang="ts" name="ApiRightPanel">
/**
 * API 编排 - 右侧属性面板
 *
 * 三 Tab 设计（始终注册，避免动态 v-if 导致 el-tabs 激活时序问题）：
 *  - 接口属性：选中接口时显示编辑表单，未选中时显示空提示
 *  - Mock 配置：按当前选中接口过滤
 *  - 测试结果：显示运行结果详情
 *
 * 取消 el-drawer，将接口编辑直接固定在右侧面板，避免遮挡流程图。
 */
import { ref, watch, nextTick } from "vue";
import { i18n } from "@/lang";
import { Close } from "@element-plus/icons-vue";
import ApiEndpointEditor from "./ApiEndpointEditor.vue";
import ApiMockConfig from "./ApiMockConfig.vue";
import ApiTestResults from "./ApiTestResults.vue";
import type { ApiOrchestratorState } from "../composables/useApiOrchestrator";

const props = defineProps<{
    state: ApiOrchestratorState;
}>();

const emit = defineEmits<{
    (e: "close-editor"): void;
}>();

const activeTab = ref<"endpoint" | "mock" | "test">("mock");

// 选中接口时自动切换到接口属性页签（nextTick 确保 el-tabs 已注册该页签）
watch(
    () => props.state.selectedEndpointId.value,
    (id) => {
        if (id) {
            nextTick(() => {
                activeTab.value = "endpoint";
            });
        }
    },
);

const handleCloseEditor = () => {
    activeTab.value = "mock";
    emit("close-editor");
};
</script>

<template>
    <div class="api-right-panel">
        <el-tabs v-model="activeTab" type="border-card" class="right-tabs">
            <el-tab-pane name="endpoint">
                <template #label>
                    <span class="tab-label">
                        {{ i18n("api.endpoint.editor") }}
                        <el-icon v-if="state.selectedEndpoint.value" class="tab-close" @click.stop="handleCloseEditor">
                            <Close />
                        </el-icon>
                    </span>
                </template>
                <ApiEndpointEditor :state="state" />
            </el-tab-pane>
            <el-tab-pane :label="i18n('api.mock.title')" name="mock">
                <ApiMockConfig :state="state" />
            </el-tab-pane>
            <el-tab-pane :label="i18n('api.test.title')" name="test">
                <ApiTestResults :state="state" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.api-right-panel {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--el-bg-color);
    border-left: 1px solid var(--el-border-color);

    .right-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__content) {
            flex: 1;
            overflow: hidden;
        }

        :deep(.el-tab-pane) {
            height: 100%;
            overflow: hidden;
        }
    }

    .tab-label {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        .tab-close {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            cursor: pointer;
            border-radius: 50%;
            padding: 1px;

            &:hover {
                color: var(--el-color-danger);
                background: var(--el-color-danger-light-9);
            }
        }
    }
}
</style>
