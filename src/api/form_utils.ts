import { getValidType } from "@/api/valid_utils";
import { unref } from "vue";
import { i18n } from "@/lang";
import { BatchFieldInfo, FieldInfo, SearchProps } from "@/components/types";
import { uuid } from "@/api/system";
// 定义已显式列出的属性
const listedFields: string[] = [
  "label",
  "name",
  "itemType",
  "formVisible",
  "listVisible",
  "viewVisible",
  "searchVisible",
  "required",
  "actions",
  "helpMsg",
  "listPrototypeDisplay",
  "defaultVisible",
  "defaultValue",
  "prefix",
  "disabled",
  "editDisabled",
  "id",
  "itemNameLabel",
];
const createContainer = (item: any, children: any) => {
  //构建当前层级容器信息
  return {
    name: item.label ?? item.preps?.label ?? item.preps?.itemNameLabel,
    value: item.preps?.name ?? item.tabName ?? item.objectName,
    id: item.id ?? item.preps?.id ?? uuid(),
    type: item.itemType,
    compType: "container",
    children: children,
  };
};
/**
 * 解析box和dytable 容器
 * @param item
 */
const boxDytableAnalysis = (item: any) => {
  const elements = item.preps.elements;
  let boxItems: Record<string, any> = {};
  const children: Array<any> = [];
  const fieldList: FieldInfo[] | any = [];
  const searchItemList: SearchProps[] | any = [];
  for (const sindex in elements) {
    //获取当前行的列数
    const columns = elements[sindex].columns;
    const columnItems: FieldInfo[] | any = [];
    for (const ssindex in columns) {
      //获取第几列
      const column = columns[ssindex];
      let colHeight = column.colHeight;
      let colWidth = column.colWidth;
      let colspan = column.colspan;
      let rowspan = column.rowspan;
      //判断当前列有没有组件,每列支持一个或者多个组件
      const currentColumnItems: FieldInfo[] | any = [];
      column?.items?.forEach((temp: any) => {
        let { item, fieldInfo, layerItem, searchItem } = itemAnalysis(temp);
        boxItems = { ...boxItems, ...item };
        children.push(layerItem);
        if (!fieldInfo.preps) {
          fieldInfo.preps = {};
        }
        fieldInfo.preps["colHeight"] = colHeight;
        fieldInfo.preps["colWidth"] = colWidth;
        fieldInfo.preps["colspan"] = colspan;
        fieldInfo.preps["rowspan"] = rowspan;
        currentColumnItems.push(fieldInfo);
        if (Object.keys(searchItem).length > 0) {
          searchItemList.push(searchItem);
        }
      });
      //如果当前列放了多个组件则按照数值的方式存入列元素
      const len = column?.items?.length;
      if (len > 1) {
        columnItems.push(currentColumnItems);
      } else if (len == 1) {
        columnItems.push(currentColumnItems[0]);
      } else {
        columnItems.push({
          preps: {
            colspan: colspan,
            rowspan: rowspan,
            colHeight: colHeight,
            colWidth: colWidth,
          },
        });
      }
    }
    fieldList.push(columnItems);
  }
  const currentLayerContainer = createContainer(item, children);
  boxItems[currentLayerContainer.id] = item;
  return { currentLayerContainer, boxItems, fieldList, searchItemList };
};
/**
 * 解析table 容器
 * @param item
 */
const tableAnalysis = (item: any) => {
  const elements = item.preps.elements;
  let boxItems: Record<string, any> = {};
  const children: Array<any> = [];
  const batchFieldInfos: BatchFieldInfo[] = [];
  const columnsList: FieldInfo[] | any = [];
  const searchItemList: SearchProps[] | any = [];
  for (const index in elements) {
    const element = elements[index];
    element?.items?.forEach((temp: any) => {
      let { item, fieldInfo, layerItem, searchItem } = itemAnalysis(temp);
      boxItems = { ...boxItems, ...item };
      children.push(layerItem);
      columnsList.push(fieldInfo);
      if (Object.keys(searchItem).length > 0) {
        searchItemList.push(searchItem);
      }
    });
  }
  batchFieldInfos.push({
    batchName: item.batchName,
    disabled: item.disabled,
    disVisible: item.disVisible,
    title: item.preps?.label ?? item.preps?.itemNameLabel,
    helpMsg: item.preps?.helpMsg,
    fieldList: columnsList,
  });
  const fieldList: FieldInfo | any = {
    batchFieldList: batchFieldInfos,
  };
  const currentLayerContainer = createContainer(item, children);
  boxItems[currentLayerContainer.id] = item;
  return { currentLayerContainer, boxItems, fieldList, searchItemList };
};
/**
 * 解析tab,collapse,card,splitter?
 * @param item
 */
const tabColapseCardAnalysis = (item: any) => {
  const elements = item.preps.elements;
  const currentLayerContainerList: Array<any> = [];
  let boxItems: Record<string, any> = {};
  let fieldInfo: FieldInfo | any = {};
  const searchItemList2: SearchProps[] | any = [];
  const dataList: Array<any> = [];
  for (const index in elements) {
    const element = elements[index];
    //层级关系，记录,数据列表
    let { selectList, compListResult, fieldList, searchItemList } =
      analysisCompDatas(element.items);
    boxItems = { ...boxItems, ...compListResult };
    const innerLayer = createContainer(element, selectList);
    boxItems[innerLayer.id] = element;
    currentLayerContainerList.push(innerLayer);
    dataList.push({
      tabName: element.tabName,
      objectName: element.objectName,
      subFormFlag: element.subFormFlag,
      title: element.label || element.title,
      id: element.id,
      height: element.height,
      fieldList: fieldList,
    });
    if (searchItemList?.length > 0) {
      searchItemList2.push(...searchItemList);
    }
  }
  if (item.itemType == "tab") {
    fieldInfo.tabList = dataList;
  } else if (item.itemType == "card") {
    fieldInfo.cardList = dataList;
  } else if (item.itemType == "collapse") {
    fieldInfo.collapseList = dataList;
  } else if (item.itemType == "splitter") {
    fieldInfo.splitterList = dataList;
  } else {
    console.error("Unknown itemType: ", item.itemType);
  }
  const currentLayerContainer = createContainer(
    item,
    currentLayerContainerList,
  );
  boxItems[currentLayerContainer.id] = item;
  return {
    currentLayerContainer,
    boxItems,
    fieldList: fieldInfo,
    searchItemList: searchItemList2,
  };
};
/**
 * 直接解析字段
 * @param item
 */
const itemAnalysis = (item: any) => {
  const preps = item.preps;
  const remainingPreps = Object.entries(preps).reduce((acc, [key, value]) => {
    //过滤掉空值
    if (!listedFields.includes(key) && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  const fieldInfo: FieldInfo = {
    label: preps.label,
    fieldName: preps.name,
    type: item.itemType,
    formVisible: preps.formVisible,
    listVisible: preps.listVisible,
    viewVisible: preps.viewVisible,
    required: preps.required,
    actions: preps.actions,
    helpMsg: preps.helpMsg,
    listPrototypeDisplay: preps.listPrototypeDisplay,
    defaultValue: preps.defaultValue,
    prefix: preps.prefix,
    disabled: preps.disabled,
    editDisabled: preps.editDisabled,
    id: preps.id,
    preps: remainingPreps,
  };
  const layerItem: any = {
    name: item.preps?.label,
    id: item.preps?.id,
    compType: "item",
    type: item.preps?.itemType,
    value: item.preps?.name,
  };
  let searchItem: SearchProps = {};
  if (preps.searchVisible) {
    searchItem = {
      fieldName: preps.name,
      label: preps.label,
      defaultValue: preps.defaultValue || "",
      defaultVisible: preps.defaultVisible || false,
      preps: remainingPreps,
    };
  }
  const record: Record<string, any> = {};
  record[item.preps?.id] = item;
  return { item: record, fieldInfo, layerItem, searchItem };
};
/**
 * 解析表单字段信息及层级
 */
export const analysisCompDatas = (dataList: any) => {
  const selectList: Array<any> = [];
  let compListResult: Record<string, any> = {};
  const compList = unref(dataList);
  const compFieldList: FieldInfo[] = [];
  const searchFieldList: SearchProps[] = [];
  //判断数据是否为空,
  if (!compList?.length) {
    return { selectList, compListResult, compFieldList };
  }
  for (const index in compList) {
    const comp = compList[index];
    if (comp.compType == "container") {
      let result: any = null;
      if (comp.itemType === "box" || comp.itemType === "dytable") {
        result = boxDytableAnalysis(comp);
      } else if (comp.itemType === "table") {
        result = tableAnalysis(comp);
      } else if (
        ["tab", "collapse", "card", "splitter"].includes(comp.itemType)
      ) {
        result = tabColapseCardAnalysis(comp);
      }
      let { currentLayerContainer, boxItems, fieldList, searchItemList } =
        result;
      if (Array.isArray(currentLayerContainer)) {
        selectList.push(...currentLayerContainer);
      } else {
        selectList.push(currentLayerContainer);
      }
      compListResult = { ...compListResult, ...boxItems };
      if (comp.itemType === "dytable") {
        compFieldList.push({
          fieldName: "",
          dytableList: fieldList,
        });
      } else {
        if (Array.isArray(fieldList)) {
          compFieldList.push(...fieldList);
        } else {
          compFieldList.push(fieldList);
        }
      }
      if (searchItemList.length > 0) {
        searchFieldList.push(...searchItemList);
      }
    } else {
      //没有容器,直接解析组件
      let { item, fieldInfo, layerItem, searchItem } = itemAnalysis(comp);
      compFieldList.push(fieldInfo);
      selectList.push(layerItem);
      compListResult = { ...compListResult, ...item };
      if (Object.keys(searchItem).length > 0) {
        searchFieldList.push(searchItem);
      }
    }
  }
  return {
    selectList,
    compListResult,
    fieldList: compFieldList,
    searchItemList: searchFieldList,
  };
};

/**
 * 解析动态表单中的子节点数据是否需要合并到父节点中
 * @param props
 * @param dataForm
 */
export function dynamicFormAnalysis(props: any, dataForm: any) {
  //props.globalCondition 有属性不是子表，需要额外封装
  const globalCondition = props.globalCondition;
  let dataList: any = {};
  if (!globalCondition || globalCondition.length == 0) {
    return dataList;
  }
  for (const key in globalCondition) {
    const temp = globalCondition[key];
    //如果非子表
    if ("N" == temp.subFormFlag) {
      const data = dataForm[temp.tableName];
      delete dataForm[temp.tableName];
      if (Array.isArray(data)) {
        dataList = [];
        data.forEach((item) => {
          dataList.push(Object.assign({}, item, dataForm));
        });
      } else {
        Object.assign(dataList, data, dataForm);
      }
    }
  }
  return dataList;
}

/**
 * 创建验证规则
 * @param item
 * @param dataForm
 */
export function validMsg(item: any, dataForm: any) {
  const rules = [];
  if (
    item.required &&
    (item.required === true || item.required == "true") &&
    !item.disabled
  ) {
    rules.push({
      required: true,
      message: `${item.label}${i18n("api.cannotBeEmpty")}`,
      trigger: "blur",
    });
  }
  if (item.type == "number-range") {
    const splitName = item.preps?.splitName ?? "-";
    const escapedSplit = splitName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rules.push({
      pattern: new RegExp(`^\\d+${escapedSplit}\\d+$`),
      message: i18n("api.numberRangeFormat"),
      trigger: "blur",
    });
    rules.push({
      validator: (rule: any, value: string, callback: any) => {
        const minName = item.preps?.minName ?? item.fieldName + "Min";
        const maxName = item.preps?.maxName ?? item.fieldName + "Max";
        // 从formData中获取min和max的实际数值（通过fieldName+Min/Max）
        const minValue = unref(dataForm)[`${minName}`];
        const maxValue = unref(dataForm)[`${maxName}`];
        if (minValue === undefined || maxValue === undefined) {
          callback(); // 由required规则处理空值
          return;
        }
        if (maxValue < minValue) {
          callback(new Error(i18n("api.maxValueCannotBeLessThanMinValue")));
        } else {
          callback();
        }
      },
      trigger: "blur", // 输入变化时触发验证
    });
  }

  const itemRules: any = item.rules || item.preps?.rules;
  const innerFun = (itemRules: any) => {
    if (itemRules?.length > 0) {
      if (Array.isArray(itemRules)) {
        itemRules?.forEach((rule: any) => {
          if (rule?.name?.length > 0) {
            rules.push(getValidType(rule.name, rule.options));
          } else {
            if (typeof rule == "string") {
              rules.push(getValidType(rule));
            } else {
              rules.push(rule);
            }
          }
        });
      } else {
        if (itemRules?.name?.length > 0) {
          rules.push(getValidType(itemRules.name, itemRules.options));
        } else {
          if (typeof itemRules == "string") {
            rules.push(getValidType(itemRules));
          } else {
            rules.push(itemRules);
          }
        }
      }
    }
  };
  //解决某些非标准的规则
  innerFun(itemRules);
  return rules;
}

/**
 * 检查对象是否需要创建
 * @param dataForm 数据对象
 * @param item 表单属性
 * @param index 索引
 * @param parentIndex 父索引
 * @param prefix 前缀
 */
export function checkObject(
  dataForm: any,
  item: any,
  index: number,
  parentIndex: number,
  prefix: string,
) {
  return index + 1;
}

export function getFormData(
  item: any,
  dataForm: any,
  prefix: string,
  parentIndex: any,
  index: any,
) {
  if (item.subFormFlag == "Y") {
    if (item && item.objectName) {
      if (!Object.keys(dataForm).includes(item.objectName)) {
        dataForm[item.objectName] = [{}];
      }
    }
    let dataIndex = getDataIndex(item, prefix, parentIndex, index);
    let len = dataForm[item.objectName].length;
    if (dataIndex >= len) {
      dataForm[item.objectName].push({});
      dataIndex = len - 1;
    }
    return dataForm[item.objectName][dataIndex];
  }
  return dataForm;
}

/**
 * 获取表单数据索引
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getDataIndex(
  data: any,
  prefix: string,
  parentIndex: any,
  index: any,
) {
  let pronPrefix: number = 0;
  if (prefix?.length > 0) {
    if (data.subFormFlag == "Y") {
      pronPrefix = parentIndex > -1 ? 0 : index;
    } else {
      pronPrefix = parentIndex;
    }
  } else if (data.subFormFlag == "Y") {
    //如果父表大于0,说明当前是父表的子表，应该用父表的索引
    pronPrefix = parentIndex > 0 ? parentIndex : index;
  } else {
    pronPrefix = -1;
  }
  return pronPrefix;
}

/**
 * 生成验证属性
 * @param prefix 父表标识
 * @param fieldName 字段名称
 * @param parentIndex 父索引
 * @param currentIndex 当前索引
 */
export function loadProp(
  prefix: string,
  fieldName: string,
  parentIndex: number,
  currentIndex: number,
) {
  if (prefix && prefix.length > 0) {
    return (
      prefix +
      "." +
      fieldName +
      (currentIndex > -1
        ? "." + currentIndex
        : parentIndex > -1
          ? "." + parentIndex
          : "")
    );
  } else if (parentIndex >= 0) {
    return fieldName + "." + parentIndex;
  } else if (currentIndex >= 0) {
    return fieldName + "." + currentIndex;
  } else {
    return fieldName;
  }
}

/**
 * 计算表单Pron
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getPrefix(
  data: any,
  prefix: string,
  parentIndex: any,
  index: any,
) {
  let pronPrefix:string = "";
  if (prefix && prefix.length > 0) {
    if (data.subFormFlag == "Y") {
      pronPrefix =
        prefix + "." + data.objectName + "." + (parentIndex > -1 ? 0 : index);
    } else {
      pronPrefix = prefix;
    }
  } else if (data.subFormFlag == "Y") {
    //如果父表大于0,说明当前是父表的子表，应该用父表的索引
    pronPrefix =
      data.objectName + "." + (parentIndex > 0 ? parentIndex : index);
  } else {
    pronPrefix = "";
  }
  return pronPrefix;
}

/**
 * 检查是否可见
 * @param item
 * @param dataForm
 */
export function checkVisible(item: any, dataForm: any) {
  //如果没有配置此属性，则默认显示
  item["formVisible"] = item.formVisible ?? true;
  return item.formVisible || dataForm["_" + item.fieldName + "Visible"];
}

/**
 * 解析列表数据
 * @param item
 * @param val
 */
export function parseListData(item: any, val: any) {
  return (
    unref(item.preps?.values)?.find((temp: any) => temp.value == val)?.name ||
    unref(item.preps?.data)?.find((temp: any) => temp.value == val)?.name ||
    unref(item.optionList)?.find((temp: any) => temp.value == val)?.name ||
    val
  );
}

/**
 * 过滤对象属性
 * @param obj 要过滤的对象
 * @param keysToRemove 要移除的属性键数组
 */
export function filterProperties(obj: any, keysToRemove: string[]) {
  Object.keys(obj).forEach((key) => {
    if (keysToRemove.includes(key)) {
      delete obj[key];
    }
  });
}
