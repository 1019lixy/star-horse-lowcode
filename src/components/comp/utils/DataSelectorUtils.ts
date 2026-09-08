import { postRequest } from "@/api/star_horse_apis";
import { closeLoad, createCondition } from "@/api/star_horse_utils";
import { SearchParams } from "@/components/types";
import JSON5 from "json5";

/**
 * 数据选择器公共工具
 * 抽取 DataPicker 和 StarHorseDataSelector 的共享逻辑
 */

/** 选择器值类型：单选为原始值，多选为数组 */
export type ModelValueType = any;

/** DataPicker / StarHorseDataSelector 公共 props */
export interface DataPickerBaseProps {
  modelValue: ModelValueType;
  dataUrl?: string;
  proxy?: boolean;
  proxyUrl?: string;
  params?: SearchParams[];
  pageSize?: number;
  data?: Array<any>;
  title?: string;
  compSize?: string;
  displayName?: string;
  displayValue?: string;
  /** 显示模式：label 仅显示名称，label+code 显示 名称(编码) */
  displayMode?: "label" | "label+code";
  /** 编码字段名（displayMode=label+code 时使用） */
  displayCode?: string;
  multiple?: boolean;
  checkStrictly?: boolean;
  selectLeaf?: boolean;
  /** APP 端是否启用层级分类筛选 */
  enableHierarchy?: boolean;
}

/** 公共 props 默认值（两个组件 withDefaults 共用） */
export const dataPickerBaseDefaults = {
  compSize: "default",
  pageSize: 0,
  displayName: "name",
  displayValue: "value",
  displayMode: "label" as const,
  displayCode: "code",
  multiple: false,
  checkStrictly: true,
  selectLeaf: false,
  enableHierarchy: true,
};

/** 构建代理/直连请求参数 */
export const buildRequestParams = (
  dataUrl: string,
  baseParams: Record<string, any>,
  proxy?: boolean,
  proxyUrl?: string,
): { url: string; params: Record<string, any> } => {
  let tempUrl = dataUrl;
  let params: Record<string, any>;
  if (proxy) {
    tempUrl = proxyUrl ?? "/system-config/redirect/execute";
    params = {
      url: dataUrl,
      httpMethod: "POST",
      dataType: "JSON",
      searchInfo: baseParams,
    };
  } else {
    params = baseParams;
  }
  return { url: tempUrl, params };
};

/** 构建分页查询基础参数 */
export const buildPageParams = (
  queryParams: SearchParams[],
  extraParams?: SearchParams[],
  currentPage: number = 0,
  pageSize: number = 100,
): Record<string, any> => {
  const allParams = [...queryParams];
  if (extraParams && extraParams.length > 0) {
    allParams.push(...extraParams);
  }
  return {
    currentPage,
    pageSize,
    fieldList: allParams,
    orderBy: [],
  };
};

/** 递归查找树结构数据中匹配指定值的节点 */
export const findNodesInTree = (
  nodes: any[],
  targetValue: any,
  displayValue: string = "value",
): any[] => {
  const result: any[] = [];
  const walk = (items: any[]) => {
    for (const node of items) {
      const isMatch = Array.isArray(targetValue)
        ? targetValue.includes(node[displayValue])
        : node[displayValue] === targetValue;
      if (isMatch) {
        const temp = { ...node };
        delete temp.children;
        result.push(temp);
      }
      if (node.children) {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  // 按 targetValue 的原始顺序排列，保持选择顺序
  if (Array.isArray(targetValue)) {
    const orderMap = new Map(targetValue.map((v: any, i: number) => [v, i]));
    result.sort(
      (a, b) =>
        (orderMap.get(a[displayValue]) ?? 0) -
        (orderMap.get(b[displayValue]) ?? 0),
    );
  }
  return result;
};

/** 处理节点选择/取消选择逻辑 */
export const toggleNodeSelection = (
  node: any,
  currentSelection: any[],
  options: {
    multiple: boolean;
    checkStrictly: boolean;
    selectLeaf: boolean;
    displayValue: string;
  },
): any[] => {
  const { multiple, checkStrictly, selectLeaf, displayValue } = options;
  const data = JSON5.parse(JSON5.stringify(node));
  const selection = [...currentSelection];

  if (multiple) {
    const index = selection.findIndex(
      (e) => e[displayValue] === data[displayValue],
    );
    if (index === -1) {
      if (checkStrictly) {
        const temp = { ...data };
        delete temp.children;
        selection.push(temp);
      } else {
        // 非严格模式：处理子节点
        const processChildren = (n: any) => {
          if (n.children) {
            if (!selectLeaf) {
              const temp = { ...n };
              delete temp.children;
              selection.push(temp);
            }
            n.children.forEach((child: any) => processChildren(child));
          } else {
            const childIdx = selection.findIndex(
              (e) => e[displayValue] === n[displayValue],
            );
            if (childIdx === -1) {
              const temp = { ...n };
              delete temp.children;
              selection.push(temp);
            }
          }
        };
        processChildren(data);
      }
    } else {
      selection.splice(index, 1);
    }
  } else {
    const index = selection.findIndex(
      (e) => e[displayValue] === data[displayValue],
    );
    if (index === -1) {
      delete data.children;
      return [data];
    } else {
      selection.splice(index, 1);
    }
  }
  return selection;
};

/** 分页查询结果 */
export interface PageResult {
  list: any[];
  totalData: number;
  totalPage: number;
}

/**
 * 统一的数据源分页查询出口（唯一后台请求实现）：
 * - StarHorseDataSelector 回显已选数据（loadSelectedData 内部复用）
 * - DataPicker 加载待选列表
 */
export const loadPageData = async (options: {
  dataUrl: string;
  conditions?: SearchParams[];
  extraParams?: SearchParams[];
  currentPage?: number;
  pageSize?: number;
  proxy?: boolean;
  proxyUrl?: string;
}): Promise<PageResult> => {
  const {
    dataUrl,
    conditions = [],
    extraParams,
    currentPage = 0,
    pageSize = 0,
    proxy,
    proxyUrl,
  } = options;
  const baseParams = buildPageParams(
    conditions,
    extraParams,
    currentPage,
    pageSize,
  );
  const { url, params } = buildRequestParams(
    dataUrl,
    baseParams,
    proxy,
    proxyUrl,
  );
  try {
    const res = await postRequest(url, params);
    if (res?.data?.code != 200) {
      console.error(res?.data?.cnMessage);
      return { list: [], totalData: 0, totalPage: 0 };
    }
    const redata = res?.data?.data;
    return {
      list: redata?.dataList || redata || [],
      totalData: redata?.totalDatas ?? 0,
      totalPage: redata?.totalPages ?? 0,
    };
  } catch (err) {
    console.error("[DataSelectorUtils] loadPageData failed", err);
    return { list: [], totalData: 0, totalPage: 0 };
  } finally {
    closeLoad();
  }
};

/** 通过接口加载选中数据（用于初始化回显） */
export const loadSelectedData = async (
  dataUrl: string,
  value: any,
  displayValue: string = "value",
  extraParams?: SearchParams[],
  proxy?: boolean,
  proxyUrl?: string,
): Promise<any[]> => {
  if (!dataUrl || !value || (Array.isArray(value) && value.length === 0)) {
    return [];
  }
  const conditions: SearchParams[] = [
    createCondition(displayValue, Array.isArray(value) ? value : [value], "in"),
  ];
  if (extraParams && extraParams.length > 0) {
    conditions.push(...extraParams);
  }
  const { list } = await loadPageData({
    dataUrl,
    conditions,
    proxy,
    proxyUrl,
    pageSize: 100,
  });
  return findNodesInTree(list || [], value, displayValue);
};
