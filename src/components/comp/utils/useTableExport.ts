import { computed, ref, Ref } from "vue";
import { download } from "@/api/star_horse_apis";
import { closeLoad, createCondition, load } from "@/api/star_horse_utils";
import { removeEmptyCondition } from "@/api/system";
import { error, warning } from "@/utils/message";
import { i18n } from "@/lang";
import { SearchParams } from "@/components/types/Params";
import { analysisPrimaryKeys } from "./tableKeyUtils";

/** 导出字段选项 */
export interface ExportFieldOption {
  fieldName: string;
  label: string;
  checked: boolean;
}

/** useTableExport 入参 */
export interface UseTableExportOptions {
  /** 组件 props(defineProps 返回的响应式 proxy) */
  props: any;
  /** 多选行数据 */
  multipleSelection: Ref<any[]>;
  /** 搜索条件 */
  searchFields: Ref<SearchParams[]>;
  /** 权限判断函数 */
  overrideOperation: (authCode: string, params: any) => boolean;
}

/**
 * 表格导出 composable
 * 封装导出字段选择状态、全选/恢复默认、导出数据请求
 */
export function useTableExport(opts: UseTableExportOptions) {
  const { props, multipleSelection, searchFields, overrideOperation } = opts;

  const exportOperationVisible = ref(false);
  const exportFieldOptions = ref<ExportFieldOption[]>([]);

  /** 已选字段数量 */
  const exportFieldSelectedCount = computed(
    () => exportFieldOptions.value.filter((f) => f.checked).length,
  );
  /** 全选状态(读写) */
  const exportFieldAllChecked = computed({
    get: () =>
      exportFieldOptions.value.length > 0 &&
      exportFieldOptions.value.every((f) => f.checked),
    set: (val: boolean) =>
      exportFieldOptions.value.forEach((f) => (f.checked = val)),
  });
  /** 半选状态 */
  const exportFieldIsIndeterminate = computed(
    () =>
      exportFieldSelectedCount.value > 0 &&
      exportFieldSelectedCount.value < exportFieldOptions.value.length,
  );
  /** el-checkbox-group v-model 桥接 */
  const exportFieldCheckedModel = computed({
    get: () =>
      exportFieldOptions.value.filter((f) => f.checked).map((f) => f.fieldName),
    set: (vals: string[]) => {
      const set = new Set(vals);
      exportFieldOptions.value.forEach(
        (f) => (f.checked = set.has(f.fieldName)),
      );
    },
  });

  /**
   * 计算单个字段的默认选中状态
   * 规则: listVisible === true 优先, 否则取 formVisible === true
   */
  const isDefaultChecked = (f: any): boolean =>
    f.listVisible === true ||
    (f.listVisible === undefined && f.formVisible === true);

  /**
   * 递归扁平化导出字段来源
   * 对齐 PC 端列解析逻辑(FieldVisibleControl.allColumns)与 APP 端(useTableFields.flattenFields)：
   * - 数组：逐项展开
   * - 容器节点(containerFields)：递归进入每个容器的 fieldList，容器本身不作为可导出列
   * - 分组节点(fieldList)：递归进入其 fieldList
   * - 叶子字段(含 fieldName)：收集
   * 之前仅读取 props.fieldList.fieldList 顶层数组，导致「容器内的字段」不会被解析进导出弹窗。
   * 按 fieldName 去重，保证导出弹窗 checkbox-group 的 value 唯一。
   */
  const collectExportFields = (): Array<any> => {
    const out: Array<any> = [];
    const seen = new Set<string>();
    const walk = (list: any) => {
      if (!Array.isArray(list)) return;
      for (const field of list) {
        if (Array.isArray(field)) {
          walk(field);
        } else if (field?.containerFields?.length) {
          for (const container of field.containerFields) {
            walk(container?.fieldList);
          }
        } else if (field?.fieldList?.length) {
          walk(field.fieldList);
        } else if (field?.fieldName && !seen.has(field.fieldName)) {
          seen.add(field.fieldName);
          out.push(field);
        }
      }
    };
    walk(props?.fieldList?.fieldList);
    return out;
  };

  /**
   * 初始化导出字段备选列表
   * 递归收集(含容器内)所有字段,按默认规则选中
   */
  const initExportFieldOptions = () => {
    exportFieldOptions.value = collectExportFields().map((f: any) => ({
      fieldName: f.fieldName,
      label: f.label || f.fieldName,
      checked: isDefaultChecked(f),
    }));
  };

  /**
   * 恢复默认选中状态
   */
  const resetExportFieldOptions = () => {
    const flat = collectExportFields();
    exportFieldOptions.value.forEach((f) => {
      const origin = flat.find((item: any) => item.fieldName === f.fieldName);
      f.checked = origin ? isDefaultChecked(origin) : false;
    });
  };

  /** 获取选中行主键 */
  const getIds = () => {
    const selectDatas = multipleSelection.value;
    const ids: any[] = [];
    for (const temp of selectDatas) {
      if (temp) {
        ids.push(analysisPrimaryKeys(props?.primaryKey, temp));
      }
    }
    return ids;
  };

  /**
   * 构建导出条件参数
   */
  const buildExportCondition = () => {
    const ids = getIds();
    let params: any[] = [];
    const keys: any = props?.primaryKey;
    if (ids.length > 0) {
      if (Array.isArray(keys)) {
        for (const key of keys) {
          let temp: any[] = [];
          for (const id of ids) {
            if (id[key]) temp.push(id[key]);
          }
          if (temp.length > 0) {
            params.push(createCondition(key, temp, "in"));
          }
        }
      } else {
        params.push(createCondition(keys, ids, "in"));
      }
    } else {
      params = [...searchFields.value];
    }
    if (params.length === 0) {
      params = [...searchFields.value];
    }
    const defaultCond: any = removeEmptyCondition(props?.apiEndpoints?.condition);
    if (defaultCond?.length > 0) {
      params.push(...defaultCond);
    }
    const condition: any = { fieldList: params };
    if (props?.fieldList?.orderBy) {
      condition["orderBy"] = props.fieldList.orderBy;
    }
    return condition;
  };

  /**
   * 执行导出请求
   */
  const exportData = (fields: string[] = []) => {
    const ids = getIds();
    if (overrideOperation("export", ids)) return;
    load(i18n("comp.dataProcessing"));
    const condition = buildExportCondition();
    download(props?.apiEndpoints?.exportAllUrl, { condition, fields })
      .catch((err: any) => {
        error(i18n("comp.interfaceNotFoundOrNetworkError") + err);
      })
      .finally(() => {
        closeLoad();
      });
  };

  /**
   * 确认导出:校验已选字段,执行导出
   */
  const selectedFields = () => {
    if (exportFieldSelectedCount.value === 0) {
      warning(i18n("comp.exportFieldEmpty"));
      return;
    }
    const fields = exportFieldOptions.value
      .filter((f) => f.checked)
      .map((f) => f.fieldName);
    exportData(fields);
    exportOperationVisible.value = false;
  };

  return {
    exportOperationVisible,
    exportFieldOptions,
    exportFieldAllChecked,
    exportFieldIsIndeterminate,
    exportFieldCheckedModel,
    exportFieldSelectedCount,
    initExportFieldOptions,
    resetExportFieldOptions,
    getIds,
    exportData,
    selectedFields,
  };
}
