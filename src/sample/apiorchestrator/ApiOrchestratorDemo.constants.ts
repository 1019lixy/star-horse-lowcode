import { Check, Delete, Download, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import { SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS } from "@/components/apiorchestrator";
import type { ApiChain, ApiEndpoint, MockResponse } from "@/components/apiorchestrator";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 重新导出底层组件的示例数据，供 Demo 使用
 *
 * ApiOrchestrator 组件已内置 SAMPLE_CHAIN/SAMPLE_ENDPOINTS/SAMPLE_MOCKS，
 * 这里重新导出是为了在 constants.ts 中集中管理（与其他 Demo 保持一致）。
 */
export { SAMPLE_CHAIN, SAMPLE_ENDPOINTS, SAMPLE_MOCKS };
export type { ApiChain, ApiEndpoint, MockResponse };

/**
 * 创建空数据（clear 操作）
 */
export function createEmptyData(): {
    endpoints: ApiEndpoint[];
    mocks: MockResponse[];
    chain: ApiChain;
} {
    return {
        endpoints: [],
        mocks: [],
        chain: {
            ...SAMPLE_CHAIN,
            id: "empty_chain",
            name: "空编排",
            steps: [],
        },
    };
}

/**
 * ApiOrchestratorDemo 主操作（左侧）
 *
 * demo 级操作，不重复底层 ApiToolbar 的运行/测试等功能。
 */
export const API_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.api.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.api.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.api.toolbar.exportJson", iconOnly: true, group: "data" },
    { key: "save", icon: Check, labelKey: "advanced.api.toolbar.save", type: "primary" },
];

/**
 * ApiOrchestratorDemo 次要操作（右侧）
 */
export const API_SECONDARY: ShDemoAction[] = [
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.api.toolbar.help", iconOnly: true },
];
