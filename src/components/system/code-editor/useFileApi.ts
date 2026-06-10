import { ref } from "vue";
import type { FileNode } from "./types";
import { postRequest, getRequest } from "@/api/star_horse_apis";

/**
 * 文件树后端API集成
 *
 * 用法:
 *   const api = useFileApi(loadUrl, saveUrl);
 *   await api.loadFromServer();                              // GET 加载
 *   await api.loadFromServer({ moduleId: "xxx" });           // POST 带参数加载
 *   await api.saveToServer(tree);                            // POST 保存
 *   await api.saveToServer(tree, { moduleId: "xxx" });       // POST 带参数保存
 *
 * 后端接口约定:
 *   无参加载: GET  loadUrl                       → { code: 0, data: FileNode[] }
 *   带参加载: POST loadUrl  body: params          → { code: 0, data: FileNode[] }
 *   保存:     POST saveUrl  body: { files, ...params } → { code: 0, cnMessage: "success" }
 */
export function useFileApi(
  loadUrl: string,
  saveUrl: string,
) {
  const loading = ref(false);
  const saving = ref(false);
  const lastError = ref("");

  /**
   * 从后端加载文件树
   * @param params 可选参数，如 { moduleId: "xxx" }
   *               传参时用 POST，不传时用 GET
   */
  const loadFromServer = async (params?: Record<string, any>): Promise<FileNode[]> => {
    if (!loadUrl) return [];
    loading.value = true;
    lastError.value = "";
    try {
      const res: any = params && Object.keys(params).length > 0
        ? await postRequest(loadUrl, params)
        : await getRequest(loadUrl);
      const data = res?.data;
      if (data?.code === 0 && data?.data) {
        return data.data as FileNode[];
      }
      // 兼容直接返回数组
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      lastError.value = data?.cnMessage || "加载数据格式异常";
      return [];
    } catch (err: any) {
      lastError.value = err?.message || "加载失败";
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * 保存文件树到后端
   * @param tree   文件树数据
   * @param params 可选附加参数，如 { moduleId: "xxx" }
   *               传参时 body = { files: tree, ...params }
   *               不传参时 body = tree
   */
  const saveToServer = async (tree: FileNode[], params?: Record<string, any>): Promise<boolean> => {
    if (!saveUrl) return false;
    saving.value = true;
    lastError.value = "";
    try {
      const body = params && Object.keys(params).length > 0
        ? { files: tree, ...params }
        : tree;
      const res: any = await postRequest(saveUrl, body);
      const data = res?.data;
      if (data?.code === 0) return true;
      lastError.value = data?.cnMessage || "保存失败";
      return false;
    } catch (err: any) {
      lastError.value = err?.message || "保存请求异常";
      return false;
    } finally {
      saving.value = false;
    }
  };

  /**
   * 加载单个文件内容
   */
  const loadFileContent = async (fileId: string, url: string): Promise<string | null> => {
    try {
      const res: any = await postRequest(url, { fileId });
      const data = res?.data;
      if (data?.code === 0 && data?.data != null) return data.data;
      return null;
    } catch {
      return null;
    }
  };

  return {
    loading,
    saving,
    lastError,
    loadFromServer,
    saveToServer,
    loadFileContent,
  };
}
