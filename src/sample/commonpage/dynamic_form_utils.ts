import { i18n } from "@/lang";
import { error } from "@/utils/message";
import { loadData, postRequest } from "@/api/star_horse_apis";
import { ApiUrls, SearchFields, PageFieldInfo } from "@/components/types";
import { apiInstance, closeLoad, load } from "@/api/star_horse_utils";
const serviceName = "quantity-manage";
export interface FormDataProp {
  /**
   * 主键
   */
  primaryKey: string;
  /**
   * 表单验证规则
   */
  rules: Record<string, any>;
  /**
   * 是否有数据
   */
  hasData: boolean;
  /**
   * 属性映射关系
   */
  fieldMappingList: Array<any>;
  /**
   * 数据源
   */
  dataSource: Record<string, any>;
  /**
   * 日期属性
   */
  dateFields: string[];
  /**
   * 关联表
   */
  relationTables: Record<string, any>;
  /**
   * 接口地址
   */
  dataUrl: ApiUrls | any;
  /**
   * 错误日志
   */
  errorMsg: string;
  /**
   * 搜索属性
   */
  searchFormData: SearchFields;
  /**
   * 表单属性
   */
  tableFieldList: PageFieldInfo;
  /**
   * 流程节点
   */
  processDefineNodes: Array<any>;
}

/**
 * 获取动态表单数据
 * @param formId
 */
export const loadDynamicFormData = async (
  formId: string,
  itemType?: string,
): Promise<FormDataProp> => {
  let primaryKey = "";
  let rules: Record<string, any> = {};
  let hasData = true;
  let fieldMappingList: any[] = [];
  let dataSource: Record<string, any> = {};
  let formInfo: Record<string, any> = {};
  let dateFields: Array<string> = [];
  let relationTables: Record<string, any> = {};
  let dataUrl: ApiUrls | undefined;
  let errorMsg = i18n("commonPage.dataLoading");
  let searchFormData: SearchFields | any = {};
  let tableFieldList: any = { fieldList: [] };
  let processDefineNodes: Array<any> = [];
  let bindWorkFlowId = "";
  try {
    if (!formId) {
      return Promise.reject();
    }
    let { data, error } = await loadData(
      `${serviceName}/userdb/dynamicFormInfo/getDynamicForm/${formId}`,
      {
        item: itemType || "",
      },
    );
    if (error) {
      errorMsg = error;
    } else {
      hasData = data && Object.keys(data).length > 0;
      dataUrl = apiInstance(
        data["dataUrl"]?.appName,
        data["dataUrl"]?.contextUrl,
      );
      searchFormData = data["searchFormData"] as SearchFields;
      primaryKey = data["primaryKey"];
      bindWorkFlowId = data["bindWorkFlowId"];
      tableFieldList = data["tableFieldList"];
      rules = data["rules"];
      dateFields = data["dateFields"];
      formInfo = data["formInfo"];
      fieldMappingList = data?.fieldMappingList;
      relationTables = data["relationTables"];
      dataSource = data["dataSource"];
      processDefineNodes = data["processDefineNodes"];
    }
  } catch (e) {
    errorMsg = i18n("commonPage.dataLoadError");
    console.error(e);
  }
  return {
    searchFormData,
    primaryKey,
    bindWorkFlowId,
    tableFieldList,
    rules,
    dateFields,
    formInfo,
    fieldMappingList,
    relationTables,
    dataSource,
    dataUrl,
    hasData,
    errorMsg,
    processDefineNodes,
  };
};

/**
 * 获取业务数据
 * @param url
 * @param businessKeyValue
 */
export async function loadBusinessData(
  url: ApiUrls,
  businessKeyValue: string,
): Promise<{ data: any; error: string }> {
  //如果没有值则不做处理
  if (!businessKeyValue || !url) {
    return Promise.reject();
  }
  const result = await postRequest(
    url?.loadByIdUrl + `/${businessKeyValue}`,
    [],
  );
  let error = "";
  if (result.data.code) {
    error = result.data.cnMessage;
  }
  let data = result.data.data;
  return { data, error };
}

/**
 * 获取视图属性
 * @param param 视图Token
 */
export async function viewColumns(param: string) {
  let formDatas: any = [],
    columns: any = [];
  await postRequest("${serviceName}/consumer/api/viewColumns", {
    viewToken: param,
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
          matchType: "lk",
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
export async function viewDataList(
  viewToken: string,
  currentPage: number,
  pageSize: number,
  conditions: any,
) {
  const dataPo = {
    viewToken: viewToken,
    searchPo: {
      fieldList: conditions,
      pageSize: pageSize || 20,
      currentPage: currentPage || 1,
    },
  };
  let viewDatas: any = [],
    error;
  load("数据加载中");
  await postRequest("${serviceName}/consumer/api/pageList", dataPo)
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
 * 将sql类型转换为组件
 * @param type
 */
export function sqlTypeConvertCompType(type: string) {
  if (type.includes("int") || type.includes("num")) {
    return "number";
  } else if (type.includes("date") || type.includes("time")) {
    return "datetime";
  } else {
    return "input";
  }
}
