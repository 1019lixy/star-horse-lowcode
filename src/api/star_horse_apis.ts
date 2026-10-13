import {getFingerId} from "@/api/finger_utils";
import {getUserStore} from "@/store/StoreManager";
import {getToken} from "@/utils/auth";
import {error, operationConfirm, success, warning} from "@/utils/message";
import {i18n} from "@/lang";
import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getLang} from "@/theme/localStorge";
import {SearchParams} from "@/components/types/Params";
import {OrderByInfo} from "@/components/types/PageFieldInfo";
import {closeLoad} from "./star_horse_utils";

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
            token = "2b77a102c77444afafeb0d0129f331f6";
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
export {starHorseAxios};

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
            .post(url, param, {responseType: "blob"})
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
            .get(url, {responseType: "blob"})
            .then((res) => {
                redata = new Blob([res.data]);
            });
    } else {
        await getAxiosInstance()
            .post(url, [], {responseType: "blob"})
            .then((res) => {
                redata = new Blob([res.data]);
            });
    }
    return redata;
}

// ==================== 请求去重（相同接口+相同条件只发一次） ====================
/**
 * 进行中请求去重表：key(url+稳定序列化data) → Promise。
 * 并发场景（如首屏多组件 onMounted 同时自动加载相同接口）合并为一次请求；
 * 请求完成后即移除，不缓存历史结果，保证操作后重新加载仍拿到新数据。
 */
const inflightPosts = new Map<string, Promise<any>>();

/** 稳定序列化：对象键递归排序，保证相同数据不同键顺序产生相同 key */
function stableStringify(value: any): string {
    if (value === null || value === undefined) return "null";
    if (typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) {
        return "[" + value.map((v) => stableStringify(v)).join(",") + "]";
    }
    const keys = Object.keys(value).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}

/**
 * Post 请求（自动去重：相同 url+data 的并发请求合并为一次）
 * @param url
 * @param data
 */
export function postRequest(url: string, data: Array<any> | any) {
    const key = url + "::" + stableStringify(data ?? null);
    const pending = inflightPosts.get(key);
    if (pending) {
        return pending;
    }
    const req = getAxiosInstance().post(url, data).finally(() => {
        inflightPosts.delete(key);
    });
    inflightPosts.set(key, req);
    return req;
}

/**
 * Get请求（自动去重：相同 url 的并发请求合并为一次）
 * @param url
 */
export function getRequest(url: string) {
    const key = "GET::" + url;
    const pending = inflightPosts.get(key);
    if (pending) {
        return pending;
    }
    const req = getAxiosInstance().get(url).finally(() => {
        inflightPosts.delete(key);
    });
    inflightPosts.set(key, req);
    return req;
}

/**
 * 通用请求封装
 * ✅ 普通POST/GET/PUT/DELETE JSON请求
 * ✅ FormData 文件上传
 * ✅ 文件下载（blob二进制）
 * @param url 请求地址
 * @param data 请求body / get参数 / FormData上传数据
 * @param method 请求方式 默认post
 * @param header 请求头
 * @param isDownload 是否下载模式(true 返回Blob)
 * @param onUploadProgress 上传进度回调
 * @param onDownloadProgress 下载进度回调
 * @param timeout
 */
export function request(
    url: string,
    data?: any,
    method: string = "post",
    header?: Record<string, any>,
    isDownload = false,
    onUploadProgress?: FetchProgressCallback,
    onDownloadProgress?: FetchProgressCallback,
    timeout = 15000,
): Promise<any> {
    return new Promise((resolve, reject) => {
        // 参数校验
        if (!url || typeof url !== "string") {
            const err = new Error("[request] url不能为空且必须为字符串");
            return reject(err);
        }
        const reqMethod = method.toUpperCase();

        if (
            ["POST", "PUT", "PATCH"].includes(reqMethod) &&
            (data === undefined || data === null)
        ) {
            console.warn("[request] POST/PUT/PATCH 请求建议传入data参数", {
                url,
                method,
            });
        }

        const xhr = new XMLHttpRequest();
        // 超时
        xhr.timeout = timeout;
        // -------- 上传进度（这里真正生效）--------
        if (onUploadProgress) {
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    onUploadProgress(e.loaded, e.total);
                }
            };
        }

        // -------- 下载进度 --------
        if (onDownloadProgress) {
            xhr.onprogress = (e) => {
                if (e.lengthComputable) {
                    onDownloadProgress(e.loaded, e.total);
                }
            };
        }

        let requestUrl = url;
        // GET / DELETE 参数拼 query
        if (["GET", "DELETE"].includes(reqMethod) && data != null) {
            const searchParams = new URLSearchParams();
            Object.entries(data).forEach(([k, v]) => {
                if (v !== undefined && v !== null) {
                    searchParams.append(k, String(v));
                }
            });
            const sep = requestUrl.includes("?") ? "&" : "?";
            requestUrl += sep + searchParams.toString();
        }

        xhr.open(reqMethod, requestUrl, true);

        // 请求头
        const defaultHeaders: Record<string, string> = {
            "Content-Type": "application/json",
        };
        const reqHeaders = {...defaultHeaders, ...(header ?? {})};

        // setRequestHeader
        Object.entries(reqHeaders).forEach(([k, v]) => {
            xhr.setRequestHeader(k, v);
        });

        // 响应类型：下载二进制blob
        if (isDownload) {
            xhr.responseType = "blob";
        }

        xhr.onload = () => {
            const status = xhr.status;
            // 2xx
            if (status >= 200 && status < 300) {
                if (isDownload) {
                    // 下载模式直接返回blob
                    resolve(xhr.response);
                } else {
                    // 普通接口解析json/text
                    const rawText = xhr.responseText;
                    let jsonData: any;
                    try {
                        jsonData = rawText ? JSON.parse(rawText) : null;
                    } catch {
                        jsonData = rawText;
                    }
                    resolve(jsonData);
                }
            } else {
                // http错误，组装错误对象
                let errData: any = null;
                try {
                    if (!isDownload) {
                        errData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                    }
                } catch {
                    /* */
                }

                const httpErr = new Error(`HTTP ${status}`);
                Object.assign(httpErr, {
                    status,
                    statusText: xhr.statusText,
                    data: errData,
                });
                reject(httpErr);
            }
        };

        xhr.onerror = () => {
            const netErr = new Error("[request] 网络错误");
            reject(netErr);
        };

        xhr.ontimeout = () => {
            const timeoutErr = new Error(`[request] 请求超时 ${timeout}ms`);
            reject(timeoutErr);
        };

        // -------- body处理 POST PUT PATCH --------
        let sendBody: any = null;
        if (["POST", "PUT", "PATCH"].includes(reqMethod) && data != null) {
            if (data instanceof FormData) {
                // FormData：删除Content‑Type，浏览器自动带boundary
                xhr.setRequestHeader("Content-Type", "");
                sendBody = data;
            } else {
                try {
                    sendBody = JSON.stringify(data);
                } catch (e) {
                    const parseErr = new Error("[request] data JSON序列化失败");
                    (parseErr as any).cause = e;
                    return reject(parseErr);
                }
            }
        }

        xhr.send(sendBody);
    });
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

type FetchProgressCallback = (loaded: number, total: number) => void;

/**
 * Post Upload 请求
 * @param url
 * @param data
 */
export function uploadRequest(url: string, data: any) {
    return getAxiosInstance().post(url, data, {
        headers: {"Content-Type": "multipart/form-data"},
    });
}


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
            if (redata?.code !== 200) {
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
            if (redata?.code != 200) {
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
            if (res?.data?.code == 200) {
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
