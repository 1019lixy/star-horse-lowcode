import {
    Plus,
    Check,
    FolderOpened,
    Download,
    View,
    Delete,
    Grid,
    Promotion,
    QuestionFilled,
} from "@element-plus/icons-vue";
import type { EmailTemplate } from "@/components/emailtemplate";
import type { ShDemoAction } from "../components/demoTypes";

/**
 * 邮件模板 Demo 示例数据
 *
 * 欢迎注册邮件模板，含 appName/userName/account/verifyUrl 四个变量 + 1 个附件。
 */
export const SAMPLE_EMAIL_TEMPLATE: EmailTemplate = {
    id: "email_demo_001",
    name: "欢迎注册邮件",
    category: "welcome",
    description: "新用户注册成功后发送的欢迎邮件模板",
    subject: "欢迎注册 ${appName}，${userName}！",
    fromName: "${appName} 团队",
    cc: "",
    bcc: "",
    content:
        '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
        '<h2 style="color:#409EFF;">欢迎加入 ${appName}！</h2>' +
        '<p>亲爱的 <strong>${userName}</strong>，</p>' +
        '<p>感谢您注册 ${appName}，您的账号 <strong>${account}</strong> 已成功创建。</p>' +
        '<p>您可以立即开始体验以下功能：</p>' +
        '<ul><li>个人中心管理</li><li>在线数据看板</li><li>团队协作空间</li></ul>' +
        '<p style="margin:24px 0;">' +
        '<a href="${verifyUrl}" style="display:inline-block;padding:10px 24px;background:#409EFF;color:#fff;text-decoration:none;border-radius:4px;">立即验证邮箱</a>' +
        '</p>' +
        '<p>如有任何问题，请随时回复本邮件或联系客服。</p>' +
        '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>' +
        '<p style="color:#999;font-size:12px;">这是一封系统自动发送的邮件，请勿直接回复。</p>' +
        '</div>',
    textContent: "",
    variables: [
        { id: "var_appName", name: "appName", label: "应用名称", defaultValue: "星马平台", description: "当前应用或产品名称" },
        { id: "var_userName", name: "userName", label: "用户昵称", defaultValue: "", description: "注册用户的昵称" },
        { id: "var_account", name: "account", label: "账号", defaultValue: "", description: "用户登录账号" },
        { id: "var_verifyUrl", name: "verifyUrl", label: "验证链接", defaultValue: "", description: "邮箱验证跳转地址" },
    ],
    attachments: [
        { id: "att_1", name: "新用户使用指南.pdf", url: "https://example.com/files/user-guide.pdf", size: 1024000 },
    ],
    createdAt: "2026-07-18T08:00:00Z",
    updatedAt: "2026-07-18T08:00:00Z",
};

/**
 * EmailTemplateDemo 主操作（左侧）
 */
export const EMAIL_ACTIONS: ShDemoAction[] = [
    { key: "newTemplate", icon: Plus, labelKey: "advanced.emailtemplate.toolbar.newTemplate", group: "data" },
    { key: "loadSample", icon: FolderOpened, labelKey: "advanced.emailtemplate.toolbar.loadSample", group: "data" },
    { key: "saveTemplate", icon: Check, labelKey: "advanced.emailtemplate.toolbar.saveTemplate", type: "primary" },
    { key: "preview", icon: View, labelKey: "advanced.emailtemplate.toolbar.preview" },
    { key: "sendTest", icon: Promotion, labelKey: "advanced.emailtemplate.toolbar.sendTest" },
    { key: "exportHtml", icon: Download, labelKey: "advanced.emailtemplate.toolbar.exportHtml" },
    { key: "clear", icon: Delete, labelKey: "advanced.emailtemplate.toolbar.clear", type: "danger" },
];

/**
 * EmailTemplateDemo 次要操作（右侧）
 */
export const EMAIL_SECONDARY: ShDemoAction[] = [
    { key: "toggleField", icon: Grid, tooltipKey: "advanced.emailtemplate.toolbar.toggleField", iconOnly: true, active: true },
    { key: "help", icon: QuestionFilled, tooltipKey: "advanced.emailtemplate.toolbar.help", iconOnly: true },
];
