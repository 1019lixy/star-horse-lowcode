import { SearchParams } from "@/components/types/Params";
import { SearchProps } from "@/components/types";

/** 日期类型集合（与 el-date-picker type 对齐，不含纯时间类型） */
const DATE_FIELD_TYPES = new Set([
  "year",
  "years",
  "month",
  "months",
  "date",
  "dates",
  "datetime",
  "datetimerange",
  "daterange",
  "monthrange",
  "yearrange",
  "week",
]);

/** 两位补零 */
const pad2 = (n: number) => String(n).padStart(2, "0");

/** 取某月最后一天 */
const lastDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

/** 格式化 Date 为 YYYY-MM-DD（本地时区） */
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/**
 * 根据日期类型和匹配方式构建查询值与操作符
 *
 * 值形态与 operation 必须匹配后端约定：
 * - eq/gt/gte/lt/lte/lk 等：单值
 * - bt(between)：[start, end] 数组
 * - in/nin：多值数组
 *
 * 规则：
 * - 范围选择器（daterange/datetimerange/monthrange/yearrange）：val 本身是 [start,end]，
 *   默认 operation 为 bt；按类型补全时间边界
 * - 单值类型 + bt：转 [start, end] 区间（date→当天, year→整年, month→整月, week→整周）
 * - 单值类型 + 其他（eq/gt/lt/lk...）：保持单值，不转数组
 */
function buildDateSearchValue(
  val: any,
  effectiveType: string,
  matchType: string | undefined,
): { value: any; operation: string } {
  if (val == null || val === "")
    return { value: val, operation: matchType || "eq" };

  // 范围选择器类型：val 是 [start, end]
  if (effectiveType?.includes("range")) {
    const op = matchType || "bt";
    if (!Array.isArray(val) || val.length < 2) {
      return { value: val, operation: op };
    }
    let [start, end] = val;
    const baseType = effectiveType.replace("range", "");
    if (baseType === "date") {
      // daterange: 值格式 YYYY-MM-DD
      start = start + " 00:00:00";
      end = end + " 23:59:59";
    } else if (baseType === "month") {
      // monthrange: 值格式 YYYY-MM
      const [ey, em] = String(end).split("-").map(Number);
      start = start + "-01 00:00:00";
      end = end + "-" + pad2(lastDayOfMonth(ey, em)) + " 23:59:59";
    } else if (baseType === "year") {
      // yearrange: 值格式 YYYY
      start = start + "-01-01 00:00:00";
      end = end + "-12-31 23:59:59";
    }
    // datetimerange: 值已带时间，保持原值
    return { value: [start, end], operation: op };
  }

  // 单值类型 + bt：转区间范围
  if ((matchType || "") === "bt") {
    switch (effectiveType) {
      case "date":
        return {
          value: [val + " 00:00:00", val + " 23:59:59"],
          operation: "bt",
        };
      case "year":
        return {
          value: [val + "-01-01 00:00:00", val + "-12-31 23:59:59"],
          operation: "bt",
        };
      case "month": {
        const [y, m] = String(val).split("-").map(Number);
        return {
          value: [
            val + "-01 00:00:00",
            val + "-" + pad2(lastDayOfMonth(y, m)) + " 23:59:59",
          ],
          operation: "bt",
        };
      }
      case "week": {
        // 周一 00:00:00 ~ 周日 23:59:59（val 格式 YYYY-MM-DD，为该周某天）
        const d = new Date(val);
        if (isNaN(d.getTime())) return { value: val, operation: "bt" };
        const day = d.getDay() || 7; // 周日 0 → 7
        const monday = new Date(d);
        monday.setDate(d.getDate() - day + 1);
        const sunday = new Date(d);
        sunday.setDate(d.getDate() - day + 7);
        return {
          value: [
            formatDate(monday) + " 00:00:00",
            formatDate(sunday) + " 23:59:59",
          ],
          operation: "bt",
        };
      }
      default:
        // datetime 等保持原值
        return { value: val, operation: "bt" };
    }
  }

  // 其他匹配方式（eq/gt/lt/lk/in 等）：保持原值形态
  return { value: val, operation: matchType || "eq" };
}

/**
 * 解析查询字段类型
 * @param searchForm
 * @param searchFormData
 */
export function analysisSearchData(
  searchForm: any,
  searchFormData: SearchProps[],
) {
  const searchFields = [];
  for (const key in searchForm) {
    let val = searchForm[key];
    const temp = searchFormData.find((item: any) => item.fieldName == key);
    if (val) {
      // 日期类型：取 effectiveType（preps.type 优先，兼容 field.type）
      const effectiveType = temp?.preps?.type || temp?.type;
      let operation = temp?.matchType || "eq";
      if (effectiveType && DATE_FIELD_TYPES.has(effectiveType)) {
        const result = buildDateSearchValue(
          val,
          effectiveType,
          temp?.matchType,
        );
        val = result.value;
        operation = result.operation;
      }
      const param: SearchParams = {
        propertyName: key,
        operation,
        value: val,
      };
      if (
        typeof param.value === "string" &&
        ["nin", "ins", "ini", "in"].includes(param.operation)
      ) {
        param.value = param.value.split(/[;\t\r\n]/);
      }
      //处理is查询
      if (temp?.matchType == "is") {
        if (val == "null") {
          param.orOperList = [
            {
              propertyName: key,
              operation: "eq",
              value: "",
            },
          ];
        } else if (val == "not null") {
          searchFields.push({
            propertyName: key,
            operation: "neq",
            value: "",
          });
        }
      }
      searchFields.push(param);
    }
  }
  return searchFields;
}

/**
 * 解析组件
 * @param compList
 */
export function analysisFields(compList: Array<any>) {
  const fieldList: Array<any> = [];
  const tabNames: Array<string> = [];
  const objectNames: Array<string> = [];
  const batchNames: Array<string> = [];
  let priority = 1;
  const loopAnalysis = (boxList: Array<any>) => {
    for (const index in boxList) {
      const columns = boxList[index].columns;
      for (const sindex in columns) {
        const items = columns[sindex].items;
        normalAnalysis(items);
      }
    }
  };
  const tabListAnalysis = (tabList: Array<any>) => {
    for (const index in tabList) {
      const temp = tabList[index];
      tabNames.push(temp.subTablePrimaryKey);
      objectNames.push(temp.subTableName);
      normalAnalysis(temp.items);
    }
  };
  const tableListAnalysis = (tableObject?: any) => {
    if (tableObject && Object.keys(tableObject).length > 0) {
      batchNames.push(tableObject.batchFieldName);
      const tableList = tableObject.elements;
      for (const index in tableList) {
        const temp = tableList[index];
        normalAnalysis(temp.items);
      }
    }
  };
  const normalAnalysis = (dataList: any) => {
    if (dataList?.length > 0) {
      for (const index in dataList) {
        const temp = dataList[index];
        const itempType = temp.itemType;
        if (["box", "dytable", "gridtable"].includes(itempType)) {
          loopAnalysis(temp.preps.elements);
        } else if (
          !["box", "dytable", "table", "gridtable"].includes(itempType)
        ) {
          tabListAnalysis(temp.preps.elements);
        } else if (itempType == "table") {
          tableListAnalysis(temp.preps);
        } else {
          if (Object.keys(temp).length > 0) {
            if (Array.isArray(temp)) {
              temp.forEach((item) => {
                item.dataIndex = priority++;
                fieldList.push(item);
              });
            } else {
              const batchList = Array.isArray(temp.containerFields)
                ? temp.containerFields.filter(
                    (c: any) => c?.containerType === "table",
                  )
                : [];
              if (batchList.length > 0) {
                batchList.forEach((item: any) => {
                  item.fieldList.forEach((sitem: any) => {
                    sitem.dataIndex = priority++;
                    fieldList.push(sitem);
                  });
                });
              } else {
                temp.dataIndex = priority++;
                fieldList.push(temp);
              }
            }
          }
        }
      }
    }
  };
  normalAnalysis(compList);
  return { fieldList, tabNames, objectNames, batchNames };
}
