import { SearchParams } from "@/components/types/Params";

/**
 * 解析查询字段类型
 * @param searchForm
 * @param searchFormData
 */
export function analysisSearchData(searchForm: any, searchFormData: any) {
  const searchFields = [];
  for (const key in searchForm) {
    let val = searchForm[key];
    const temp = searchFormData.find((item: any) => item.fieldName == key);
    if (val) {
      if (temp?.type == "datarange") {
        val = [val[0] + " 00:00:00", val[1] + " 23:59:59"];
      } else if (temp?.type == "date") {
        val = [val + " 00:00:00", val + " 23:59:59"];
      }
      const param: SearchParams = {
        propertyName: key,
        operation: temp?.matchType || "eq",
        value: val,
      };
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
      tabNames.push(temp.tabName);
      objectNames.push(temp.objectName);
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
        if (itempType == "box" || itempType == "dytable") {
          loopAnalysis(temp.preps.elements);
        } else if (
          itempType == "tab" ||
          itempType == "card" ||
          itempType == "collapse"
        ) {
          tabListAnalysis(temp.preps.elements);
        } else if (itempType == "table") {
          tableListAnalysis(temp.preps);
        } else {
          if (Object.keys(temp).length > 0) {
            if (Array.isArray(temp)) {
              temp.forEach((item) => {
                item.priority = priority++;
                fieldList.push(item);
              });
            } else if (temp.batchFieldList) {
              temp.batchFieldList.forEach((item: any) => {
                item.fieldList.forEach((sitem: any) => {
                  sitem.priority = priority++;
                  fieldList.push(sitem);
                });
              });
            } else {
              temp.priority = priority++;
              fieldList.push(temp);
            }
          }
        }
      }
    }
  };
  normalAnalysis(compList);
  return { fieldList, tabNames, objectNames, batchNames };
}
