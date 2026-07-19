import { Delete, Download, FolderOpened, QuestionFilled } from "@element-plus/icons-vue";
import { SAMPLE_ALARMS, SAMPLE_DEVICES, SAMPLE_METRICS } from "@/components/iot";
import type { IotAlarm, IotDevice, IotMetric } from "@/components/iot";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 重新导出底层组件的示例数据
 */
export { SAMPLE_ALARMS, SAMPLE_DEVICES, SAMPLE_METRICS };
export type { IotAlarm, IotDevice, IotMetric };

/** 空数据（clear 操作） */
export const EMPTY_ALARMS: IotAlarm[] = [];
export const EMPTY_DEVICES: IotDevice[] = [];
export const EMPTY_METRICS: IotMetric[] = [];

/**
 * IotDemo 主操作（左侧）
 */
export const IOT_ACTIONS: ShDemoAction[] = [
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.iot.toolbar.loadSample", group: "data" },
    { key: "clear", icon: Delete, labelKey: "advanced.iot.toolbar.clear", type: "danger", group: "data" },
    { key: "exportJson", icon: Download, tooltipKey: "advanced.iot.toolbar.exportJson", iconOnly: true, group: "data" },
];

/**
 * IotDemo 次要操作（右侧）
 */
export const IOT_SECONDARY: ShDemoAction[] = [
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.iot.toolbar.help", iconOnly: true },
];
