/**
 * 邮件模板状态管理
 */
import { reactive, ref } from "vue";
import { createEmailTemplate, createEmailVariable } from "../constants";
import type { EmailAttachment, EmailTemplate, EmailVariable } from "../types";

export const useEmailTemplateDesigner = (initial?: Partial<EmailTemplate>) => {
    const state = reactive<EmailTemplate>(createEmailTemplate(initial ?? {}));
    const selectedVariableId = ref<string | null>(null);
    const selectedVariable = ref<EmailVariable | null>(null);

    /** 添加变量 */
    const addVariable = (overrides: Partial<EmailVariable> = {}): EmailVariable => {
        const v = createEmailVariable(overrides);
        state.variables.push(v);
        selectedVariableId.value = v.id;
        selectedVariable.value = v;
        return v;
    };

    /** 更新变量 */
    const updateVariable = (id: string, updates: Partial<EmailVariable>) => {
        const v = state.variables.find((vv) => vv.id === id);
        if (!v) return;
        Object.assign(v, updates);
    };

    /** 删除变量 */
    const removeVariable = (id: string) => {
        const idx = state.variables.findIndex((v) => v.id === id);
        if (idx < 0) return;
        state.variables.splice(idx, 1);
        if (selectedVariableId.value === id) {
            selectedVariableId.value = null;
            selectedVariable.value = null;
        }
    };

    /** 选中变量 */
    const selectVariable = (id: string | null) => {
        selectedVariableId.value = id;
        selectedVariable.value = id ? state.variables.find((v) => v.id === id) ?? null : null;
    };

    /** 添加附件 */
    const addAttachment = (att: Omit<EmailAttachment, "id">): EmailAttachment => {
        const newAtt: EmailAttachment = {
            id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            ...att,
        };
        state.attachments.push(newAtt);
        return newAtt;
    };

    /** 删除附件 */
    const removeAttachment = (id: string) => {
        const idx = state.attachments.findIndex((a) => a.id === id);
        if (idx < 0) return;
        state.attachments.splice(idx, 1);
    };

    /** 更新元信息 */
    const updateMeta = (updates: Partial<EmailTemplate>) => {
        Object.assign(state, updates, { updatedAt: new Date().toISOString() });
    };

    /** 设置内容 */
    const setContent = (content: string) => {
        state.content = content;
        state.updatedAt = new Date().toISOString();
    };

    /** 加载数据 */
    const loadData = (data: EmailTemplate) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedVariableId.value = null;
        selectedVariable.value = null;
    };

    const getData = (): EmailTemplate => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedVariableId,
        selectedVariable,
        addVariable,
        updateVariable,
        removeVariable,
        selectVariable,
        addAttachment,
        removeAttachment,
        updateMeta,
        setContent,
        loadData,
        getData,
    };
};

export type EmailTemplateDesigner = ReturnType<typeof useEmailTemplateDesigner>;
