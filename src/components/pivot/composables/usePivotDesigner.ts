/**
 * 透视分析状态管理
 */
import { computed, reactive, ref } from "vue";
import { createField, DEFAULT_PIVOT_CONFIG } from "../constants";
import type { PivotConfig, PivotData, PivotField, PivotRecord } from "../types";

/** 通过点路径取值（如 "data.list" → obj.data.list） */
const getPath = (obj: any, path: string): any => {
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
};

/** 从记录数组智能提取字段定义 */
const extractFields = (records: PivotRecord[]): PivotField[] => {
  const fieldSet = new Set<string>();
  for (const rec of records) {
    if (typeof rec !== "object" || rec === null) continue;
    for (const k of Object.keys(rec)) fieldSet.add(k);
  }
  return Array.from(fieldSet).map((n) => {
    const sample = records.find((r) => r[n] !== undefined)?.[n];
    const type =
      typeof sample === "number"
        ? "number"
        : /^\d{4}-\d{2}-\d{2}/.test(String(sample))
          ? "date"
          : "string";
    return {
      name: n,
      label: n,
      type: type as "string" | "number" | "date",
      aggregation: (type === "number" ? "sum" : "count") as "sum" | "count",
      format: "",
    };
  });
};

export const usePivotDesigner = (initial?: Partial<PivotData>) => {
  const state = reactive<PivotData>({
    records: initial?.records ?? [],
    fields: initial?.fields ?? [],
    config: { ...DEFAULT_PIVOT_CONFIG, ...(initial?.config ?? {}) },
    name: initial?.name ?? "",
  });

  const selectedChartType =
    ref<
      PivotData["config"] extends never
        ? never
        : "bar" | "line" | "area" | "pie" | "radar" | "scatter"
    >("bar");
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
    if (!state.config.rows.includes(fieldName))
      state.config.rows.push(fieldName);
  };

  /** 字段放入列 */
  const addToColumn = (fieldName: string) => {
    if (!state.fields.find((f) => f.name === fieldName)) return;
    if (!state.config.columns.includes(fieldName))
      state.config.columns.push(fieldName);
  };

  /** 字段放入值 */
  const addToValue = (fieldName: string) => {
    if (!state.fields.find((f) => f.name === fieldName)) return;
    if (!state.config.values.includes(fieldName))
      state.config.values.push(fieldName);
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

  /** 加载记录数组（自动合并字段，保留已有字段配置） */
  const loadRecords = (records: PivotRecord[]): void => {
    const newFieldNames = new Set(
      records.length > 0 ? Object.keys(records[0]) : [],
    );
    const oldFields = state.fields.filter((f) => newFieldNames.has(f.name));
    const newFields = extractFields(records).filter(
      (nf) => !oldFields.find((of) => of.name === nf.name),
    );
    state.fields = [...oldFields, ...newFields];
    state.records = records;
    // 清理已不存在字段的引用
    const validNames = new Set(state.fields.map((f) => f.name));
    state.config.rows = state.config.rows.filter((n) => validNames.has(n));
    state.config.columns = state.config.columns.filter((n) =>
      validNames.has(n),
    );
    state.config.values = state.config.values.filter((n) => validNames.has(n));
    state.config.filters = state.config.filters.filter((f) =>
      validNames.has(f.field),
    );
  };

  /** 从 API 拉取数据并加载 */
  const loadFromApi = async (
    url: string,
    opts?: {
      method?: "GET" | "POST";
      headers?: Record<string, string>;
      body?: any;
      dataPath?: string;
    },
  ): Promise<PivotRecord[]> => {
    const res = await fetch(url, {
      method: opts?.method ?? "GET",
      headers: opts?.headers ?? { "Content-Type": "application/json" },
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const json = await res.json();
    const records = opts?.dataPath ? getPath(json, opts.dataPath) : json;
    if (!Array.isArray(records)) {
      throw new Error(
        "API response must be an array (or dataPath must point to one)",
      );
    }
    loadRecords(records as PivotRecord[]);
    return records as PivotRecord[];
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
    loadRecords,
    loadFromApi,
    getData,
  };
};

export type PivotDesigner = ReturnType<typeof usePivotDesigner>;
