import { getFingerId } from "@/api/finger_utils";
import piniaInstance from "@/store";
import { useUserInfoStore } from "@/store/UserInfo";
import { getToken } from "@/utils/auth";
import { error } from "@/utils/message";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const userStore = useUserInfoStore(piniaInstance);
const service = axios.create({
  baseURL: "/",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
// 添加请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    const fingerToken = getFingerId();
    // 请求头带上token
    if (token && config.headers) {
      config.headers.token = token;
      config.headers["Finger-Token"] = fingerToken;
      config.headers["menuPosition"] = getMenuId();
    }
    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

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
  userStore.showLoginDialog();
};
// 添加响应拦截器
service.interceptors.response.use(
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
      error("服务接口异常，请联系管理员");
      return Promise.reject(err);
    } else {
      console.log(err);
      // 对响应错误做点什么
      return Promise.reject(err);
    }
  },
);

/**
 * 下载文件,
 * @param url 路径
 * @param param 参数
 */
export function download(url: string, param: any) {
  return new Promise((resolve, reject) => {
    service
      .post(url, param, { responseType: "blob" })
      .then((res) => {
        downloadData(
          res.data,
          decodeURI(res.headers["content-disposition"]?.split("=")[1]),
        );
        resolve(null);
      })
      .catch((err) => {
        console.log(err);
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
    await service.get(url, { responseType: "blob" }).then((res) => {
      redata = new Blob([res.data]);
    });
  } else {
    await service.post(url, [], { responseType: "blob" }).then((res) => {
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
  return service.post(url, data);
}

/**
 * Get请求
 * @param url
 */
export function getRequest(url: string) {
  return service.get(url);
}

/**
 * Request 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param method 请求方法
 */
export function httpRequest(url: string, method: string, data: any) {
  return service.request({
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
export function uploadRequest(url: string, data: Array<any>) {
  return service.post(url, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * 去除空格
 * @param data
 */
export function trim(data: string) {
  if (!data) {
    return data;
  }
  return data.replace(/(^\s*)|(\s*$)/g, "");
}
