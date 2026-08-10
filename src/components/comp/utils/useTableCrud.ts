import {computed, Ref} from "vue";
import {deleteByIds} from "@/api/star_horse_apis";
import {i18n} from "@/lang";
import {warning} from "@/utils/message";
import {UserFuncInfo} from "@/components/types/PageFieldInfo";
import {analysisPrimaryKeys} from "./tableKeyUtils";

/** useTableCrud 入参 */
export interface UseTableCrudOptions {
  /** 组件 props(defineProps 返回的响应式 proxy) */
  props: any;
  /** 注入的弹窗 props */
  dialogProps: any;
  /** 权限判断函数（覆盖原有逻辑） */
  overrideOperation: (authCode: string, params: any) => boolean;
  /** 搜索标记 ref（删除成功后重置） */
  searchFlag: Ref<boolean>;
  /** 重新加载数据函数 */
  loadByPage: (initPageInfo?: boolean) => void;
}

/**
 * 表格 CRUD composable
 * 封装查看/编辑/删除/导出单条、行操作按钮分发、操作按钮列表构建
 */
export function useTableCrud(opts: UseTableCrudOptions) {
  const {props, dialogProps, overrideOperation, searchFlag, loadByPage} = opts;

  /** 查看数据 */
  const viewById = (id: any, isExpand: boolean = false) => {
    if (overrideOperation("view", id)) {
      return;
    }
    if (dialogProps) {
      dialogProps.viewVisible = true;
      dialogProps.ids = id;
    }
    if (isExpand) {
      dialogProps.isExpand = isExpand;
      dialogProps.expandUrl = props.expandTable?.expandUrls;
    }
  };

  /** 编辑数据 */
  const editById = (id: any, isExpand: boolean = false) => {
    if (overrideOperation("edit", id)) {
      return;
    }
    if (dialogProps) {
      dialogProps.editVisible = true;
      dialogProps.ids = id;
    }
    if (isExpand) {
      dialogProps.isExpand = isExpand;
      dialogProps.expandUrl = props.expandTable?.expandUrls;
    }
  };

  /** 删除数据 */
  const deleteById = async (id: any, isExpand: boolean = false) => {
    if (overrideOperation("delete", id)) {
      return;
    }
    let deleteUrl = props.compUrl?.deleteUrl!;
    if (isExpand) {
      deleteUrl = props.expandTable?.expandUrls?.deleteUrl!;
    }
    let flag = await deleteByIds(deleteUrl, Array.isArray(id) ? id : [id]);
    if (flag) {
      searchFlag.value = true;
      loadByPage();
    }
  };

  /**
   * 导出单条数据
   * @param id 主键
   * @param type pdf / form
   */
  const exportSingleFile = async (id: any, type: string) => {
    if (overrideOperation(type, id)) {
      return;
    }
    let action = props.compUrl?.exportSingleDataAction;
    action &&
    action({
      id,
      type,
    });
  };

  /**
   * 行操作按钮分发
   * @param name 操作名: view / edit / delete / batchDelete / exportForm / exportPdf
   * @param row 当前行
   */
  const tbCommonFun = (name: string | undefined, row: any) => {
    let id = analysisPrimaryKeys(props.primaryKey, row);
    if (name == "view") {
      viewById(props.preview ? row : id);
    } else if (name == "edit") {
      editById(props.preview ? row : id);
    } else if (["delete", "batchDelete"].includes(name)) {
      deleteById(id);
    } else if (["exportForm", "exportPdf"].includes(name)) {
      exportSingleFile(id, name);
    } else {
      warning(i18n("comp.undefinedFunction") + name);
    }
    return false;
  };

  /**
   * 展开表操作分发
   * @param name 操作名
   * @param row 当前行
   * @param parentRow 父行
   */
  const expandCommonFun = (name: string, row: any, parentRow: any) => {
    let id = analysisPrimaryKeys(props.expandTable?.primaryKey, row);
    for (let key in id) {
      if (!id[key]) {
        id[key] = parentRow[key];
      }
    }
    if (name == "view") {
      viewById(id, true);
    } else if (name == "edit") {
      editById(id, true);
    } else if (name == "delete") {
      deleteById(id, true);
    }
  };

  /**
   * 构建行操作按钮列表
   * 合并 props.extendBtns、fieldList.userTableFuncs，并补充默认 edit/view/delete/exportForm/exportPdf
   */
  const extendBtnFunction = (): Array<UserFuncInfo> => {
    let arr: Array<UserFuncInfo> = [];
    const extendBtnsCopy: UserFuncInfo[] = props.extendBtns ?? [];

    extendBtnsCopy?.forEach((item: UserFuncInfo) => {
      if (item.position != "toolbar") {
        if (!item.funcName) {
          const auth = item.authority;
          item.funcName = (row: any) => tbCommonFun(auth, row);
        }
        arr.push(item);
      }
    });
    props.fieldList?.["userTableFuncs"]?.forEach((item: UserFuncInfo) => {
      if (item.position != "toolbar") {
        if (!item.funcName) {
          const auth = item.authority;
          item.funcName = (row: any) => tbCommonFun(auth, row);
        }
        arr.push(item);
      }
    });
    if (!props.disableAction) {
      let edit = arr.filter((item) => item.authority == "edit")?.length;
      if (!edit) {
        arr.push({
          authority: "edit",
          btnName: i18n("common.edit"),
          icon: "edit",
          priority: 10,
          funcName: (row: any) => tbCommonFun("edit", row),
        });
      }
      let view = arr.filter((item) => item.authority == "view")?.length;
      if (!view) {
        arr.push({
          authority: "view",
          btnName: i18n("common.view"),
          priority: 20,
          icon: "data-view",
          funcName: (row: any) => tbCommonFun("view", row),
        });
      }
      let del = arr.filter((item) => item.authority == "delete")?.length;
      if (!del) {
        arr.push({
          authority: "delete",
          btnName: i18n("common.delete"),
          priority: 30,
          icon: "delete",
          funcName: (row: any) => tbCommonFun("delete", row),
        });
      }
      let exportForm = arr.filter(
        (item) => item.authority == "exportForm",
      )?.length;
      if (!exportForm) {
        arr.push({
          authority: "exportForm",
          btnName: i18n("common.exportForm"),
          priority: 40,
          icon: "form",
          funcName: (row: any) => tbCommonFun("exportForm", row),
        });
      }
      let exportPdf = arr.filter(
        (item) => item.authority == "exportPdf",
      )?.length;
      if (!exportPdf) {
        arr.push({
          authority: "exportPdf",
          btnName: i18n("common.exportPdf"),
          priority: 50,
          icon: "pdf",
          funcName: (row: any) => tbCommonFun("exportPdf", row),
        });
      }
    }
    arr.sort(
      (a: UserFuncInfo, b: UserFuncInfo) =>
        (a.priority || 60) - (b.priority || 60),
    );
    return arr;
  };

  /** 行操作按钮列表（computed） */
  const buttonList = computed(() => extendBtnFunction());

  return {
    viewById,
    editById,
    deleteById,
    exportSingleFile,
    tbCommonFun,
    expandCommonFun,
    extendBtnFunction,
    buttonList,
  };
}
