/**
 * 透视分析状态管理
 */
import { computed, reactive, ref } from "vue";
import { createField, DEFAULT_PIVOT_CONFIG } from "../constants";
import type { PivotConfig, PivotData, PivotField } from "../types";

export const usePivotDesigner = (initial?: Partial<PivotData>) => {
    const state = reactive<PivotData>({
        records: initial?.records ?? [],
        fields: initial?.fields ?? [],
        config: { ...DEFAULT_PIVOT_CONFIG, ...(initial?.config ?? {}) },
        name: initial?.name ?? "",
    });

    const selectedChartType = ref<PivotData["config"] extends never ? never : "bar" | "line" | "area" | "pie" | "radar" | "scatter">("bar");
    const showChart = ref(false);

    /** 已用字段集合 */
    const usedFieldNames = computed(() => {
        const set = new Set<string>();
        state.config.rows.forEach((n) => set.add(n));
        state.config.columns.forEach((n) => set.add(n));
        state.config.values.forEach((n) => set.add(n));
        state.config.filters.forEach((f) => set.add(f.field));
        return set;
    });

    /** 未使用字段 */
    const unusedFields = computed(() =>
        state.fields.filter((f) => !usedFieldNames.value.has(f.name)),
    );

    /** 添加字段 */
    const addField = (overrides: Partial<PivotField> = {}): PivotField => {
        const field = createField(overrides);
        state.fields.push(field);
        return field;
    };

    /** 更新字段 */
    const updateField = (name: string, updates: Partial<PivotField>) => {
        const field = state.fields.find((f) => f.name === name);
        if (!field) return;
        Object.assign(field, updates);
    };

    /** 删除字段 */
    const removeField = (name: string) => {
        state.fields = state.fields.filter((f) => f.name !== name);
        state.config.rows = state.config.rows.filter((n) => n !== name);
        state.config.columns = state.config.columns.filter((n) => n !== name);
        state.config.values = state.config.values.filter((n) => n !== name);
        state.config.filters = state.config.filters.filter((f) => f.field !== name);
    };

    /** 字段放入行 */
    const addToRow = (fieldName: string) => {
        if (!state.fields.find((f) => f.name === fieldName)) return;
        if (!state.config.rows.includes(fieldName)) state.config.rows.push(fieldName);
    };

    /** 字段放入列 */
    const addToColumn = (fieldName: string) => {
        if (!state.fields.find((f) => f.name === fieldName)) return;
        if (!state.config.columns.includes(fieldName)) state.config.columns.push(fieldName);
    };

    /** 字段放入值 */
    const addToValue = (fieldName: string) => {
        if (!state.fields.find((f) => f.name === fieldName)) return;
        if (!state.config.values.includes(fieldName)) state.config.values.push(fieldName);
    };

    /** 从行删除 */
    const removeFromRow = (fieldName: string) => {
        state.config.rows = state.config.rows.filter((n) => n !== fieldName);
    };

    /** 从列删除 */
    const removeFromColumn = (fieldName: string) => {
        state.config.columns = state.config.columns.filter((n) => n !== fieldName);
    };

    /** 从值删除 */
    const removeFromValue = (fieldName: string) => {
        state.config.values = state.config.values.filter((n) => n !== fieldName);
    };

    /** 更新配置 */
    const updateConfig = (updates: Partial<PivotConfig>) => {
        Object.assign(state.config, updates);
    };

    /** 设置图表类型 */
    const setChartType = (type: typeof selectedChartType.value) => {
        selectedChartType.value = type;
    };

    /** 切换图表显示 */
    const toggleChart = () => {
        showChart.value = !showChart.value;
    };

    /** 加载数据 */
    const loadData = (data: PivotData) => {
        Object.assign(state, JSON.parse(JSON.stringify(data)));
    };

    /** 获取数据 */
    const getData = (): PivotData => JSON.parse(JSON.stringify(state));

    return {
        state,
        selectedChartType,
        showChart,
        usedFieldNames,
        unusedFields,
        addField,
        updateField,
        removeField,
        addToRow,
        addToColumn,
        addToValue,
        removeFromRow,
        removeFromColumn,
        removeFromValue,
        updateConfig,
        setChartType,
        toggleChart,
        loadData,
        getData,
    };
};

export type PivotDesigner = ReturnType<typeof usePivotDesigner>;
