import { ref, Ref, watch } from "vue";
import { i18n } from "@/lang";
import { warning } from "@/utils/message";
import { analysisPrimaryKeys } from "./tableKeyUtils";

/** useTableSelection 入参 */
export interface UseTableSelectionOptions {
  /** 组件 props(defineProps 返回的响应式 proxy) */
  props: any;
  /** el-table 实例 ref */
  starHorseTableCompRef: Ref<any>;
  /** 分页数据 ref（filterData 需读取 dataList） */
  pageInfo: Ref<any>;
  /** emits 函数 */
  emits: (event: string, ...args: any[]) => void;
}

/**
 * 表格选择管理 composable
 * 封装多选/单选、父子节点校验、选中行同步、弹窗模式数据过滤
 */
export function useTableSelection(opts: UseTableSelectionOptions) {
  const { props, starHorseTableCompRef, pageInfo, emits } = opts;

  const multipleSelection = ref<any>([]);
  const cardSelection = ref<any>([]);
  const inputFieldName = ref<string>("");
  const inputFieldVal = ref<any>();

  /**
   * 检查父节点是否可选中
   * @param val 选中行数组
   */
  const checkParent = (val: any) => {
    if (props.allowSelectParent) {
      return true;
    }
    let flag = false;
    for (const item of val) {
      if (item?.["children"]?.length > 0) {
        flag = true;
        starHorseTableCompRef.value?.toggleRowSelection(item, false);
      }
    }
    if (flag) {
      warning(i18n("comp.nonLeafNodeCannotBeSelected"));
      return false;
    }
    return true;
  };

  /** el-table selection-change 事件处理 */
  const handleSelectionChange = (val: any) => {
    if (!checkParent(val)) {
      return;
    }
    if (props.dialogInput && !props.multipleSelect) {
      if (val.length <= 1) {
        multipleSelection.value = val;
      } else {
        let keys: any = props.primaryKey;
        if (Array.isArray(keys)) {
          let arr: any = [];
          for (const temp of multipleSelection.value) {
            let temp1: any = {};
            for (let key of keys) {
              temp1[key] = temp?.[key];
            }
            arr.push(temp1);
          }
          let filters: Array<any> = [];
          for (const temp of val) {
            for (const stemp of arr) {
              let bflag: number = 0;
              for (const skey in stemp) {
                if (
                  Object.prototype.hasOwnProperty.call(temp, skey) &&
                  stemp[skey] == temp[skey]
                ) {
                  bflag++;
                }
              }
              if (bflag != Object.keys(stemp).length) {
                filters.push(temp);
              }
            }
          }
          multipleSelection.value = filters;
        } else {
          let ids = multipleSelection.value.map(
            (item: any) => item?.[keys],
          ) as Array<any>;
          multipleSelection.value = val.filter(
            (item: any) => !ids.includes(item?.[keys]),
          );
        }
        let data = multipleSelection.value[0];
        starHorseTableCompRef.value?.toggleRowSelection(data, true);
      }
    } else {
      multipleSelection.value = val;
    }
  };

  /** 获取行主键标识 */
  const getRowIdentity = (row: any) => {
    return analysisPrimaryKeys(props.primaryKey, row) || "";
  };

  /**
   * 弹窗多选模式：加载新数据后，将已选但未勾选的行重新选中
   */
  const filterData = () => {
    let name = inputFieldName.value as string;
    if (pageInfo.value.dataList && name && inputFieldVal.value) {
      const values = Array.isArray(inputFieldVal.value)
        ? inputFieldVal.value
        : [inputFieldVal.value];
      for (const val of values) {
        const exists = multipleSelection.value.some(
          (item: any) => item?.[name] == val,
        );
        if (exists) continue;
        let row = pageInfo.value.dataList.find(
          (item: any) => item?.[name] == val,
        );
        if (row) {
          multipleSelection.value.push(row);
          starHorseTableCompRef.value?.toggleRowSelection(row, true);
        }
      }
    }
  };

  /** 设置筛选字段名和值，并执行过滤 */
  const setDataInfo = (fieldName: string, val: any) => {
    multipleSelection.value = [];
    inputFieldName.value = fieldName;
    inputFieldVal.value = val;
    filterData();
  };

  /**
   * 点击行选中/取消（移动端卡片模式）
   * @param row 当前行
   * @param _column 列
   * @param evt 事件对象
   */
  const selectRow = (row: any, _column?: any, evt?: Event) => {
    if (!evt) {
      emits("selectItem", row);
      return;
    }
    evt.stopPropagation();
    if (!checkParent(row)) {
      return;
    }
    if (props.expandTable) {
      starHorseTableCompRef.value?.toggleRowExpansion(row);
    }
    if (multipleSelection.value?.length > 0) {
      for (let valueElement of multipleSelection.value) {
        starHorseTableCompRef.value?.toggleRowSelection(valueElement);
      }
    }
    const selected = multipleSelection.value?.some(
      (item: any) => item?.[props.primaryKey] === row?.[props.primaryKey],
    );
    if (!selected) {
      multipleSelection.value.push(row);
      starHorseTableCompRef.value?.toggleRowSelection(row, true);
    } else {
      multipleSelection.value = multipleSelection.value?.filter((item: any) => {
        return item?.[props.primaryKey] !== row?.[props.primaryKey];
      });
      starHorseTableCompRef.value?.toggleRowSelection(row, false);
    }
    emits("selectItem", row);
  };

  /** 获取已选数据 */
  const getSelectedDatas = () => {
    return multipleSelection.value;
  };

  /**
   * 从已选数据中移除指定行（弹窗多选模式"已选"tab 的删除操作）
   * 同步取消 el-table 的 checkbox 选中状态
   */
  const removeSelection = (row: any) => {
    starHorseTableCompRef.value?.toggleRowSelection(row, false);
    let keys: any = props.primaryKey;
    if (Array.isArray(keys)) {
      multipleSelection.value = multipleSelection.value.filter((item: any) =>
        keys.some((k: string) => item?.[k] !== row?.[k]),
      );
    } else {
      multipleSelection.value = multipleSelection.value.filter(
        (item: any) => item?.[keys] !== row?.[keys],
      );
    }
  };

  // 卡片选择同步到多选
  watch(
    () => cardSelection.value,
    (val) => {
      multipleSelection.value = Array.isArray(val) ? val : [val];
    },
    { immediate: false },
  );

  return {
    multipleSelection,
    cardSelection,
    inputFieldName,
    inputFieldVal,
    checkParent,
    handleSelectionChange,
    getRowIdentity,
    filterData,
    setDataInfo,
    selectRow,
    getSelectedDatas,
    removeSelection,
  };
}
