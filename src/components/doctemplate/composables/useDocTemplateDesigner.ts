/**
 * 文档模板状态管理
 */
import {reactive, ref} from "vue";
import {createTemplate, createVariable} from "../constants";
import type {DocTemplate, DocVariable} from "../types";

export const useDocTemplateDesigner = (initial?: Partial<DocTemplate>) => {
    const state = reactive<DocTemplate>(createTemplate(initial ?? {}));
    const selectedVariableId = ref<string | null>(null);

    const selectedVariable = ref<DocVariable | null>(null);

    /** 添加变量 */
    const addVariable = (overrides: Partial<DocVariable> = {}): DocVariable => {
        const v = createVariable(overrides);
        state.variables.push(v);
        selectedVariableId.value = v.id;
        selectedVariable.value = v;
        return v;
    };

    /** 更新变量 */
    const updateVariable = (id: string, updates: Partial<DocVariable>) => {
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

    /** 更新模板内容 */
    const setContent = (content: string) => {
        state.content = content;
        state.updatedAt = new Date().toISOString();
    };

    /** 插入变量到内容 */
    const insertVariableToContent = (varName: string): string => {
        return `\${${varName}}`;
    };

    /** 更新元信息 */
    const updateMeta = (updates: Partial<Pick<DocTemplate, "name" | "category" | "description">>) => {
        Object.assign(state, updates, {updatedAt: new Date().toISOString()});
    };

    /** 加载数据 */
    const loadData = (data: DocTemplate) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
        selectedVariableId.value = null;
        selectedVariable.value = null;
    };

    const getData = (): DocTemplate => JSON.parse(JSON.stringify(state));

    return reactive({
        state,
        selectedVariableId,
        selectedVariable,
        addVariable,
        updateVariable,
        removeVariable,
        selectVariable,
        setContent,
        insertVariableToContent,
        updateMeta,
        loadData,
        getData,
    });
};

export type DocTemplateDesigner = ReturnType<typeof useDocTemplateDesigner>;
