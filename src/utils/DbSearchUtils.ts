import { error, warning } from "@/utils/message.ts";
import { SelectOption } from "@/components/types/SearchProps";
import { closeLoad, load, loadGetData } from "@/api/star_horse_utils.ts";
import { getRequest } from "@/api/star_horse_apis.ts";
import piniaInstance from "@/store";
import { useConsumerViewStore } from "@/store/ConsumerView.ts";

const consumerView = useConsumerViewStore(piniaInstance);

/**
 * 打开数据库，并返回所以表信息
 * @param configId
 */
export function openDatabase(configId: any): Promise<any> | null {
  if (!configId) {
    return null;
  }
  load("数据加载中");
  return new Promise<any>((resolve, reject) => {
    getRequest(`/userdb-manage/dbsearch/dbinfoEntity/openConn/${configId}`)
      .then((res: any) => {
        if (res.data.code != 0) {
          error(res.data.cnMessage);
          return;
        }
        resolve(res.data.data);
      })
      .catch((err: any) => {
        reject(err);
      })
      .finally(() => {
        closeLoad();
      });
  });
}

/**
 * 初始化当前用户权限的数据库配置信息
 */
export async function initDbList(): Promise<Array<SelectOption>> {
  const { data, error } = await loadGetData("/userdb-manage/dbsearch/dbinfoEntity/getDbInfoByUser");
  if (error) {
    warning(error);
    return [];
  }
  const redata: Array<SelectOption> = [];
  data.forEach((item: any) => {
    redata.push({
      name: item.name,
      value: item.configId + ""
    });
  });
  return redata;
}

/**
 * 获取数据库所有表信息
 * @param configId
 */
export async function tableList(configId: number): Promise<Array<SelectOption>> {
  const { data, error } = await loadGetData(`/userdb-manage/dbsearch/dbinfoEntity/tableList/${configId}`);
  if (error) {
    warning(error);
    return [];
  }
  const redata: Array<SelectOption> = [];
  data.forEach((item: any) => {
    if (!item.tableName.includes("BIN$")) {
      redata.push({
        name: (item.comment || "") + `(${item.tableName})`,
        value: item.tableName
      });
    }
  });
  return redata;
}

/**
 * 获取指定表的所有字段信息
 * @param configId 数据库配置Id
 * @param tableName 表名
 */
export async function tableColumns(configId: any, tableName: string): Promise<Array<any>> {
  let redata: Array<any> = [];
  if (!tableName) {
    return redata;
  }
  // load("数据加载中");
  await getRequest(`/userdb-manage/dbsearch/dbinfoEntity/tableColumns/${configId}/${tableName}`)
    .then((res: any) => {
      if (res.data.code != 0) {
        warning(res.data.cnMessage);
        return;
      }
      redata = res.data.data;
      consumerView.addTableInfo(tableName, redata);
    })
    .finally(() => {
      closeLoad();
    });
  return redata;
}
