import { getFingerId } from "@/api/finger_utils";
import { getUserStore } from "@/store/StoreManager";
import { getToken } from "@/utils/auth";
import { error, operationConfirm, success, warning } from "@/utils/message";
import { i18n } from "@/lang";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getLang } from "@/theme/localStorge";
import { SearchParams } from "@/components/types/Params";
import { OrderByInfo } from "@/components/types/PageFieldInfo";
import { SelectOption } from "@/components/types/SearchProps";
import { closeLoad } from "./star_horse_utils";
import { ServiceEnums } from "@/components/enums/ServiceEnums";

const starHorseAxios = axios.create({
  baseURL: "/",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
// 添加请求拦截器
starHorseAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = getToken();
    if (!token) {
      token = "7bbeb67b62fd449a85e0f8b0fa5816df";
    }
    const fingerToken = getFingerId();
    // 请求头带上token
    if (token && config.headers) {
      config.headers.token = token;
      config.headers["Finger-Token"] = fingerToken;
      config.headers["menuPosition"] = getMenuId();
      config.headers["lang"] = window.__starHorseHostLang__ || getLang();
    }
    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);
export { starHorseAxios };

export function getMenuId() {
  //@ts-ignore
  const router = window.__hostRouter__;
  const meta = router?.currentRoute?.value?.meta;
  let menuId = meta?.menuId as string;
  if (!menuId) {
    return "";
  }
  menuId = menuId.split("_")[1];
  return menuId;
}

const forceLoginOut = () => {
  getUserStore().showLoginDialog();
};
// 添加响应拦截器
starHorseAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    const code = response.data?.code;
    // 401 未登录
    if (code == 401) {
      forceLoginOut();
    } else {
      return response;
    }
  },
  (err) => {
    const data = err.toString().toLowerCase();
    if (data?.includes("status code 401")) {
      forceLoginOut();
    } else if (data?.includes("status code 500")) {
      error(i18n("api.serviceError"));
      return Promise.reject(err);
    } else {
      console.error(err);
      // 对响应错误做点什么
      return Promise.reject(err);
    }
  },
);

/**
 * 获取axios实例
 */
export function getAxiosInstance() {
  return window.__hostAxios__ ?? starHorseAxios;
}

/**
 * 下载文件,
 * @param url 路径
 * @param param 参数
 */
export function download(url: string, param: any) {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .post(url, param, { responseType: "blob" })
      .then((res) => {
        downloadData(
          res?.data,
          decodeURI(
            res?.headers?.["content-disposition"]?.split("=")?.[1] ||
              "download",
          ),
        );
        resolve(null);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

/**
 * 下载文件,
 * @param data 数据
 * @param name 文件名称
 */
export function downloadData(data: any, name: string) {
  const blob = new Blob([data]);
  const delement = document.createElement("a");
  const href = window.URL.createObjectURL(blob);
  delement.href = href;
  delement.download = name;
  document.body.appendChild(delement);
  delement.click();
  document.body.removeChild(delement);
  window.URL.revokeObjectURL(href); //释放URL 对象
}

/**
 * 加载资源文件
 * @param url
 * @param method
 */
export async function blobData(url: string, method: string = "post") {
  let redata: any = null;
  if (method == "get") {
    await getAxiosInstance()
      .get(url, { responseType: "blob" })
      .then((res) => {
        redata = new Blob([res.data]);
      });
  } else {
    await getAxiosInstance()
      .post(url, [], { responseType: "blob" })
      .then((res) => {
        redata = new Blob([res.data]);
      });
  }
  return redata;
}

/**
 * Post 请求
 * @param url
 * @param data
 */
export function postRequest(url: string, data: Array<any> | any) {
  return getAxiosInstance().post(url, data);
}

/**
 * Get请求
 * @param url
 */
export function getRequest(url: string) {
  return getAxiosInstance().get(url);
}

/**
 * Request 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param method 请求方法
 */
export function httpRequest(url: string, method: string, data: any) {
  return getAxiosInstance().request({
    url: url,
    method: method,
    data: data,
  });
}

/**
 * Post Upload 请求
 * @param url
 * @param data
 */
export function uploadRequest(url: string, data: any) {
  return getAxiosInstance().post(url, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 字典接口
 */
const dictUrl: string = `${ServiceEnums.SYSTEM_PREFIX}dictinfo/getAllByCondition`;

/**
 * 加载Post 数据
 * @param url 接口地址
 * @param params 参数
 * @param orderBy 排序
 */
export async function loadData(
  url: string,
  params: SearchParams[] | any,
  orderBy: OrderByInfo[] = [],
) {
  let data: any = null;
  let error = "";
  let cond = params;
  if (Array.isArray(params)) {
    cond = {
      fieldList: params,
      orderBy: orderBy,
    };
  }
  await postRequest(url, cond)
    .then((res: any) => {
      const redata = res?.data;
      if (redata?.code) {
        error = redata?.cnMessage;
      } else {
        //先去分页数据，没有再去非分页数据
        data = redata?.data?.dataList || redata?.data;
      }
    })
    .catch((err) => {
      error = err;
    });
  return {
    data,
    error,
  };
}

/**
 * 加载Get 数据
 * @param url 接口地址
 * @param params 参数
 */
export async function loadGetData(url: string) {
  let data: any = [];
  let error: string = "";
  await getRequest(url)
    .then((res) => {
      const redata = res?.data;
      if (redata?.code != 0) {
        error = redata?.cnMessage;
      } else {
        data = redata?.data;
      }
    })
    .catch((err) => {
      error = err;
    });
  return {
    data,
    error,
  };
}

/**
 * 加载Id数据
 * @param url
 * @param id
 * @param params
 */
export async function loadById(url: string, id: any, params: any = {}) {
  if (!url || "undefined" == id) {
    warning(i18n("utils.provideCorrectData"));
    return;
  }
  let objData: any = {};
  const suffix: string = id ? "/" + id : "";
  await postRequest(url + suffix, params).then((res) => {
    const redata = res?.data?.data;
    if (!redata) {
      warning(i18n("utils.dataNotFound"));
    } else {
      objData = redata;
    }
  });
  return objData;
}

/**
 * 根据Id删除数据
 * @param url
 * @param ids
 * @param msg 删除提示
 */
export async function deleteByIds(
  url: string,
  ids: any,
  msg: string = i18n("utils.confirmDelete"),
) {
  if (!url) {
    warning(i18n("utils.provideCorrectData"));
    return;
  }
  if (!ids || ids.length == 0) {
    warning(i18n("utils.selectDataToDelete"));
    return;
  }
  let objData: boolean = false;
  const confirmFlag: boolean = await operationConfirm(msg);
  if (!confirmFlag) {
    return;
  }
  await postRequest(url, ids)
    .then((res) => {
      if (res?.data?.code == 0) {
        success(res?.data?.cnMessage);
      } else {
        warning(res?.data?.cnMessage);
      }
      closeLoad();
      objData = true;
    })
    .catch((err) => {
      error(i18n("dialog.interfaceError") + err);
      objData = false;
    })
    .finally(() => {
      closeLoad();
    });
  return objData;
}

/**
 * 根据字典类别获取字典数据
 * @param dictType 字典类别
 * @param exclusion 排除字典项
 * @param userUrl 用户自定义接口
 */
export async function dictData(
  dictType: string,
  exclusion: Array<string> = [],
  userUrl?: string,
): Promise<SelectOption[]> {
  const query = [];
  query.push({
    propertyName: "dictType",
    value: dictType,
  });
  const dicts: SelectOption[] = [];
  await postRequest(userUrl ?? dictUrl, { fieldList: query })
    .then((res) => {
      const redata = res.data;
      if (redata.code == 0) {
        redata.data?.forEach((item: any) => {
          if (exclusion?.includes(item.dictCode)) {
            return;
          }
          dicts.push({ name: item.dictName, value: item.dictCode });
        });
      }
    })
    .catch((err: any) => {
      console.error("接口不存在或网络异常", err);
    });
  return dicts;
}
