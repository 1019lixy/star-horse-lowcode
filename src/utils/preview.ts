import { postRequest } from "@/api/star_horse_apis.ts";
import { error } from "@/utils/message";
import { closeLoad, load } from "@/api/star_horse_utils.ts";
import { SearchParams } from "@/components/types/Params";
import { success } from "@/utils/message.ts";

/**
 * 获取视图属性
 * @param param 视图Token
 */
export async function viewColumns(param: string) {
  let formDatas: any = [],
    columns: any = [];
  await postRequest("/userdb-manage/consumer/api/viewColumns", {
    viewToken: param
  }).then((res) => {
    const redata = res.data;
    if (redata.code != 0) {
      error(redata.cnMessage);
      return;
    }
    columns = redata.data;
    for (const key in columns) {
      const temp = columns[key];
      for (const j in temp) {
        const stemp = temp[j];
        if (stemp.primaryKey == "Y") {
          continue;
        }
        formDatas.push({
          label: stemp.comment,
          fieldName: key + "&" + stemp.fieldName,
          type: convertType(stemp.type),
          defaultVisible: stemp.listVisible,
          matchType: "lk"
        });
      }
    }
  });
  return { formDatas, columns };
}
const convertType = (type: string) => {
  if (type.includes("int") || type.includes("num")) {
    return "number";
  } else if (type.includes("date") || type.includes("time")) {
    return "datetime";
  } else {
    return "input";
  }
};

/**
 * 获取视图列表
 * @param viewToken
 * @param currentPage
 * @param pageSize
 * @param conditions
 */
export async function viewDataList(viewToken: string, currentPage: number, pageSize: number, conditions: any) {
  const dataPo = {
    viewToken: viewToken,
    searchPo: {
      fieldList: conditions,
      pageSize: pageSize || 20,
      currentPage: currentPage || 1
    }
  };
  let viewDatas: any = [],
    error;
  load("数据加载中");
  await postRequest("/userdb-manage/consumer/api/pageList", dataPo)
    .then((res) => {
      const redata = res.data;
      if (redata.code != 0) {
        error = redata.cnMessage;
      } else {
        viewDatas = redata.data;
      }
    })
    .finally(() => {
      closeLoad();
    });
  return { viewDatas, error };
}

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
        value: val
      };
      //处理is查询
      if (temp?.matchType == "is") {
        if (val == "null") {
          param.orOperList = [
            {
              propertyName: key,
              operation: "eq",
              value: ""
            }
          ];
        } else if (val == "not null") {
          searchFields.push({
            propertyName: key,
            operation: "neq",
            value: ""
          });
        }
      }
      searchFields.push(param);
    }
  }
  return searchFields;
}

/**
 * 获取数组重复数据
 * @param arr
 */
export function arrayDuplicateDatas(arr: Array<any>) {
  return [...new Set(arr)].filter((item) => arr.indexOf(item) !== arr.lastIndexOf(item));
}

/**
 * 校验表单组件参数
 * @param compList
 */
export function validDynamicFormCompParams(compList: Array<any>, isSubmit: boolean = false) {
  let errorMsg = "";
  // console.log("校验表单组件参数完整性", compList);
  const { fieldList, tabNames, objectNames, batchNames } = analysisFields(compList);
  const dupTabNames = arrayDuplicateDatas(tabNames);
  const dupObjectNames = arrayDuplicateDatas(objectNames);
  const dupBatchNames = arrayDuplicateDatas(batchNames);
  if (dupTabNames.length > 0) {
    errorMsg = `Tab组件中tabName 名${dupTabNames.join(";")}重复，请在容器对应属性面板【基础属性->编辑容器属性】中检查所有Tab组件`;
  }
  if (dupObjectNames.length > 0) {
    errorMsg += `\nTab组件中objectName 名${dupObjectNames.join(";")}重复，请在容器对应属性面板【基础属性->编辑容器属性】中检查所有Tab组件`;
  }
  if (dupBatchNames.length > 0) {
    errorMsg += `\nTable组件中集合名称${dupBatchNames.join(";")}重复，请在容器对应属性面板【基础属性->集合名称】中检查所有Table组件`;
  }
  /**
   * 主要校验 参数是否重名，必须的参数是否赋值，参数数据合法性，此举旨在保证数据提交后可以正常运行，
   */
  // console.log(fieldList);
  // let fieldNames: Array<String> = [];
  for (const index in fieldList) {
    const temp = fieldList[index];
    console.log(temp);
    const preps = temp.preps;
    const name = preps.label;
    let msg = "";
    const itemType = temp.itemType;
    if (itemType == "dialog-input" || itemType == "page-select") {
      const temp = "\n" + name + "组件必须在【属性面板->基础属性->参数配置】中";
      if(!preps.dataUrl?.host) {
        msg += ",配置IP地址或服务名";
      }
      if (!preps.dataUrl?.pageListUrl) {
        msg += ",配置Url地址";
      }

      if (!preps.fieldLists || preps.fieldLists?.length == 0) {
        msg += ",配置显示属性";
      }
      if (!preps.needField || preps.needField?.length < 1) {
        msg += ",配置回调字段";
      }
      if (msg.length > 0) {
        msg = temp + msg;
      }
    } else if (itemType == "select" || itemType == "transfer" || itemType == "autocomplete" || itemType == "cascade") {
      console.log(preps);
      if ((!preps.values || preps.values?.length <= 0) && !preps.interfaceUrl && !preps.urlOrDictName) {
        msg = "\n" + name + "组件必须在【属性面板->基础属性->数据源】中配置数据源";
      }
    } else if (itemType == "checkbox" || itemType == "radio") {
      if (!preps.values || preps.values?.length <= 0) {
        msg = "\n" + name + "组件必须在【属性面板->基础属性】中配置候选项";
      }
    }
    if (msg.length > 0) {
      errorMsg += msg;
    }
  }
  if (!errorMsg && !isSubmit) {
    success("校验通过");
  }
  return errorMsg;
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
        } else if (itempType == "tab" || itempType == "card" || itempType == "collapse") {
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
              temp.batchFieldList.forEach((item) => {
                item.fieldList.forEach((sitem) => {
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
