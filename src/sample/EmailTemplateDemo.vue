<script setup lang="ts">
import {ref} from "vue";
import type {EmailTemplate} from "@/components/emailtemplate";
import {EmailTemplateDesigner} from "@/components/emailtemplate";

const emailTemplate = ref<EmailTemplate>({
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
      '<ul>' +
      '<li>个人中心管理</li>' +
      '<li>在线数据看板</li>' +
      '<li>团队协作空间</li>' +
      '</ul>' +
      '<p style="margin:24px 0;">' +
      '<a href="${verifyUrl}" style="display:inline-block;padding:10px 24px;background:#409EFF;color:#fff;text-decoration:none;border-radius:4px;">立即验证邮箱</a>' +
      '</p>' +
      '<p>如有任何问题，请随时回复本邮件或联系客服。</p>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>' +
      '<p style="color:#999;font-size:12px;">这是一封系统自动发送的邮件，请勿直接回复。</p>' +
      '</div>',
  textContent: "",
  variables: [
    {
      id: "var_appName",
      name: "appName",
      label: "应用名称",
      defaultValue: "星马平台",
      description: "当前应用或产品名称",
    },
    {
      id: "var_userName",
      name: "userName",
      label: "用户昵称",
      defaultValue: "",
      description: "注册用户的昵称",
    },
    {
      id: "var_account",
      name: "account",
      label: "账号",
      defaultValue: "",
      description: "用户登录账号",
    },
    {
      id: "var_verifyUrl",
      name: "verifyUrl",
      label: "验证链接",
      defaultValue: "",
      description: "邮箱验证跳转地址",
    },
  ],
  attachments: [
    {
      id: "att_1",
      name: "新用户使用指南.pdf",
      url: "https://example.com/files/user-guide.pdf",
      size: 1024000,
    },
  ],
  createdAt: "2026-07-18T08:00:00Z",
  updatedAt: "2026-07-18T08:00:00Z",
});
</script>

<template>
  <div class="demo-container">
    <h3>邮件模板设计器 EmailTemplateDesigner</h3>
    <p>邮件模板设计器，支持主题、发件人、抄送/密送配置，富文本正文编辑，变量占位符插入与附件管理，可预览与发送测试。示例初始化了“欢迎注册邮件”模板，含
      appName、userName、account、verifyUrl 四个变量。</p>
    <div class="demo-canvas">
      <EmailTemplateDesigner :initial-template="emailTemplate"/>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.demo-canvas {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  height: 620px;
}
</style>
