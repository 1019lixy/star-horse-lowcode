import {ref} from "vue";
import type {FileNode} from "./types";
import {postRequest} from "@/api/star_horse_apis";
import {i18n} from "@/lang/index";

/**
 * Git 冲突检测结果（对应后端 GitConflictCheckResult）
 */
export interface ConflictFile {
    path: string;
    language: string;
    baseContent: string;
    myContent: string;
    theirContent: string;
    resolvedContent?: string;
    conflictType: "CONTENT" | "DELETE_BY_THEM" | "DELETE_BY_ME";
}

export interface ConflictCheckResult {
    hasConflict: boolean;
    currentHeadCommitId: string;
    baseCommitId: string;
    divergedCommits: number;
    conflictFiles: ConflictFile[];
    myOnlyFiles: string[];
    theirOnlyFiles: string[];
    suggestedAction: "MERGE" | "CONFLICT" | "FAST_FORWARD";
}

export interface SaveResult {
    success: boolean;
    hasConflict: boolean;
    conflictInfo?: ConflictCheckResult;
    error?: string;
}

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
 *   带参加载: POST loadUrl  body: params          → { code: 0, data: FileNode[] }
 *   保存:     POST saveUrl  body: { files, ...params } → { code: 0, cnMessage: "success" }
 *   冲突:     POST saveUrl  body: { files, baseCommitId } → { code: 0, data: { extra: { hasConflict: true, conflictInfo: {...} } } }
 */
export function useFileApi(
    loadUrl: string,
    saveUrl: string,
) {
    const loading = ref(false);
    const saving = ref(false);
    const lastError = ref("");
    /** 最近一次加载时后端返回的 commitId（用于后续冲突检测） */
    const baseCommitId = ref("");

    /**
     * 从后端加载文件树
     * @param params 可选参数，如 { item: "xxx" }
     */
    const loadFromServer = async (params?: Record<string, any>): Promise<FileNode[]> => {
        if (!loadUrl) return [];
        loading.value = true;
        lastError.value = "";
        try {
            const res: any = await postRequest(loadUrl, params || {});
            const data = res?.data;
            if (data?.code === 0 && data?.data) {
                // 保存 commitId（如果后端返回）
                if (data?.commitId) {
                    baseCommitId.value = data.commitId;
                }
                return data.data as FileNode[];
            }
            // code 4 = EMPTY（后端返回空列表时的正常状态）
            if (data?.code === 4) {
                return [];
            }
            // 兼容直接返回数组
            if (Array.isArray(data)) return data;
            if (Array.isArray(data?.data)) return data.data;
            lastError.value = data?.cnMessage || i18n("ide.load.dataFormatError");
            return [];
        } catch (err: any) {
            lastError.value = err?.message || i18n("ide.load.failed");
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
     * @returns SaveResult 包含 success、hasConflict、conflictInfo
     */
    const saveToServer = async (tree: FileNode[], params?: Record<string, any>): Promise<SaveResult> => {
        if (!saveUrl) return { success: false, hasConflict: false, error: i18n("ide.save.noUrl") };
        saving.value = true;
        lastError.value = "";
        try {
            const body = params && Object.keys(params).length > 0
                ? {files: tree, ...params}
                : tree;
            const res: any = await postRequest(saveUrl, body);
            const data = res?.data;

            // 检查是否返回冲突信息
            if (data?.code === 0 && data?.data) {
                const responseData = data.data;
                // 后端返回 CodeSavePo，检查 extra.hasConflict
                if (responseData?.extra?.hasConflict) {
                    const conflictInfo = responseData.extra.conflictInfo as ConflictCheckResult;
                    return {
                        success: false,
                        hasConflict: true,
                        conflictInfo,
                    };
                }
            }

            if (data?.code === 0) {
                return { success: true, hasConflict: false };
            }

            const errorMsg = data?.cnMessage || i18n("ide.save.failed");
            lastError.value = errorMsg;
            return { success: false, hasConflict: false, error: errorMsg };
        } catch (err: any) {
            const errorMsg = err?.message || i18n("ide.save.requestError");
            lastError.value = errorMsg;
            return { success: false, hasConflict: false, error: errorMsg };
        } finally {
            saving.value = false;
        }
    };

    /**
     * 拉取最新服务端版本（不影响当前 loading/baseCommitId 状态）
     * 用于"先拉取再提交"流程：提交前先获取服务端最新版本做对比
     */
    const fetchLatest = async (params?: Record<string, any>): Promise<{ tree: FileNode[]; commitId: string }> => {
        if (!loadUrl) return { tree: [], commitId: "" };
        try {
            const res: any = await postRequest(loadUrl, params || {});
            const data = res?.data;
            if (data?.code === 0 && data?.data) {
                const commitId = data?.commitId || "";
                return { tree: data.data as FileNode[], commitId };
            }
            if (data?.code === 4) return { tree: [], commitId: "" };
            if (Array.isArray(data)) return { tree: data, commitId: "" };
            if (Array.isArray(data?.data)) return { tree: data.data, commitId: "" };
            return { tree: [], commitId: "" };
        } catch {
            return { tree: [], commitId: "" };
        }
    };

    /**
     * 加载单个文件内容
     */
    const loadFileContent = async (fileId: string, url: string): Promise<string | null> => {
        try {
            const res: any = await postRequest(url, {fileId});
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
        baseCommitId,
        loadFromServer,
        saveToServer,
        fetchLatest,
        loadFileContent,
    };
}
