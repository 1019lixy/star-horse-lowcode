import {
    Plus,
    Check,
    FolderOpened,
    Download,
    View,
    Delete,
    Grid,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { DocTemplate } from "@/components/doctemplate";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 文档模板 Demo 示例数据
 *
 * 付款确认书模板，含 userName/amount/signDate 三个变量。
 */
export const SAMPLE_DOC_TEMPLATE: DocTemplate = {
    id: "tpl_demo_001",
    name: "付款确认书",
    category: "contract",
    description: "用于付款场景的标准确认书模板，包含客户姓名、金额、签署日期等变量",
    content:
        "<h1 style=\"text-align:center;\">付款确认书</h1>" +
        "<p>致：${userName} 先生/女士</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;感谢您选择我们的服务。本确认书旨在确认您本次的付款事宜：</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;1. 付款金额：<strong>人民币 ${amount} 元</strong>（大写：壹仟元整）。</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;2. 付款方式：银行转账。</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;3. 签署日期：<strong>${signDate}</strong>。</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;本确认书自签署之日起生效，如对内容有异议，请于 3 个工作日内联系我们。</p>" +
        "<p style=\"text-align:right;margin-top:60px;\">${userName}</p>" +
        "<p style=\"text-align:right;\">${signDate}</p>",
    variables: [
        { id: "var_userName", name: "userName", label: "客户姓名", type: "string", defaultValue: "", required: true, description: "客户的真实姓名" },
        { id: "var_amount", name: "amount", label: "付款金额", type: "number", defaultValue: 0, required: true, description: "本次付款金额（单位：元）" },
        { id: "var_signDate", name: "signDate", label: "签署日期", type: "date", defaultValue: "", required: true, description: "确认书签署日期" },
    ],
    createdAt: "2026-07-18T08:00:00Z",
    updatedAt: "2026-07-18T08:00:00Z",
};

/**
 * DocTemplateDemo 主操作（左侧）
 */
export const DOC_ACTIONS: ShDemoAction[] = [
    { key: "newTemplate", icon: Plus, labelKey: "advanced.doctemplate.toolbar.newTemplate", group: "data" },
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.doctemplate.toolbar.loadSample", group: "data" },
    { key: "saveTemplate", icon: Check, labelKey: "advanced.doctemplate.toolbar.saveTemplate", type: "primary" },
    { key: "preview", icon: View, labelKey: "advanced.doctemplate.toolbar.preview" },
    { key: "exportPdf", icon: Download, labelKey: "advanced.doctemplate.toolbar.exportPdf" },
    { key: "clear", icon: Delete, labelKey: "advanced.doctemplate.toolbar.clear", type: "danger" },
];

/**
 * DocTemplateDemo 次要操作（右侧）
 */
export const DOC_SECONDARY: ShDemoAction[] = [
    { key: "toggleField", icon: Grid, tooltipKey: "advanced.doctemplate.toolbar.toggleField", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.doctemplate.toolbar.help", iconOnly: true },
];
