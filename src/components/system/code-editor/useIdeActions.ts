import {type Ref} from "vue";
import {getRequest, postRequest} from "@/api/star_horse_apis";
import {warning} from "@/utils/message";
import {i18n} from "@/lang/index";
import type {IdeApiConfig} from "./constants";
import type {FileNode} from "./types";

export interface IdeActionsDeps {
    resolvedApi: Ref<IdeApiConfig>;
    activeTabId: Ref<string>;
    consoleVisible: Ref<boolean>;
    consoleBusy: Ref<boolean>;
    appendConsole: (
        type: "info" | "success" | "warning" | "error",
        text: string,
    ) => void;
    getFileContent: (id: string) => string;
    findNode: (id: string) => FileNode | null;
    detectLanguage: (name: string) => string;
}

export function useIdeActions(deps: IdeActionsDeps) {
    const {
        resolvedApi,
        activeTabId,
        consoleVisible,
        consoleBusy,
        appendConsole,
        getFileContent,
        findNode,
        detectLanguage,
    } = deps;

    const getActiveSourceCode = (): string | null => {
        if (!activeTabId.value) return null;
        return getFileContent(activeTabId.value) || null;
    };

    const getActiveLanguage = (): string => {
        if (!activeTabId.value) return "";
        const node = findNode(activeTabId.value);
        return node?.language || detectLanguage(node?.name || "");
    };

    const getActiveFileName = (): string => {
        if (!activeTabId.value) return "";
        const node = findNode(activeTabId.value);
        return node?.name || "";
    };

    /** 编译 */
    const doCompile = async () => {
        const url = resolvedApi.value.compileUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        const sourceCode = getActiveSourceCode();
        if (!sourceCode) {
            warning(i18n("ide.console.noActiveFile"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        appendConsole(
            "info",
            i18n("ide.console.compileStart", getActiveFileName()),
        );
        try {
            const res = await postRequest(url, {
                sourceCode,
                language: getActiveLanguage(),
                fileName: getActiveFileName(),
            });
            const respData = res?.data;
            if (respData?.code === 0 && respData?.data) {
                const result = respData.data;
                if (result.success) {
                    appendConsole("success", i18n("ide.console.compileSuccess"));
                    if (result.fullClassName)
                        appendConsole("info", `  class: ${result.fullClassName}`);
                    if (result.beanName)
                        appendConsole("info", `  bean: ${result.beanName}`);
                } else {
                    appendConsole(
                        "error",
                        result.errorMessage || i18n("ide.console.compileFail"),
                    );
                }
            } else {
                const msg =
                    respData?.cnMessage ||
                    respData?.message ||
                    i18n("ide.console.compileFail");
                appendConsole("error", msg);
            }
        } catch (e: any) {
            appendConsole(
                "error",
                `${i18n("ide.console.compileFail")}: ${e.message || e}`,
            );
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 运行（编译并执行 main 方法） */
    const doRun = async () => {
        const url = resolvedApi.value.runUrl;
        if (!url) {
            warning(i18n("ide.console.noRunUrl"));
            return;
        }
        const sourceCode = getActiveSourceCode();
        if (!sourceCode) {
            warning(i18n("ide.console.noActiveFile"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        appendConsole("info", i18n("ide.console.runStart", getActiveFileName()));
        try {
            const res = await postRequest(url, {
                sourceCode,
                language: getActiveLanguage(),
                fileName: getActiveFileName(),
                codeId: activeTabId.value,
            });
            const respData = res?.data;
            if (respData?.code === 0 && respData?.data) {
                const result = respData.data;
                // 逐行输出捕获的 stdout
                if (result.output) {
                    result.output.split("\n").forEach((line: string) => {
                        if (line.length > 0) appendConsole("info", `  ${line}`);
                    });
                }
                if (result.success) {
                    const duration =
                        result.durationMs != null ? ` (${result.durationMs}ms)` : "";
                    appendConsole("success", i18n("ide.console.runSuccess") + duration);
                } else {
                    appendConsole(
                        "error",
                        result.errorMessage || i18n("ide.console.runFail"),
                    );
                }
            } else {
                const msg =
                    respData?.cnMessage ||
                    respData?.message ||
                    i18n("ide.console.runFail");
                appendConsole("error", msg);
            }
        } catch (e: any) {
            appendConsole(
                "error",
                `${i18n("ide.console.runFail")}: ${e.message || e}`,
            );
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 编译并注册为Spring Bean */
    const doCompileRegister = async () => {
        const url = resolvedApi.value.compileRegisterUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        const sourceCode = getActiveSourceCode();
        if (!sourceCode) {
            warning(i18n("ide.console.noActiveFile"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        appendConsole(
            "info",
            i18n("ide.console.compileRegisterStart", getActiveFileName()),
        );
        try {
            const res = await postRequest(url, {content: sourceCode});
            const result = res?.data;
            if (result?.code === 0 || result?.code === 200) {
                const data = result.data;
                if (data?.success) {
                    appendConsole("success", i18n("ide.console.compileRegisterSuccess"));
                    if (data.fullClassName)
                        appendConsole("info", `  class: ${data.fullClassName}`);
                    if (data.beanName) appendConsole("info", `  bean: ${data.beanName}`);
                } else {
                    appendConsole(
                        "error",
                        data?.errorMessage || i18n("ide.console.compileFail"),
                    );
                }
            } else {
                appendConsole(
                    "error",
                    result?.cnMessage || i18n("ide.console.compileFail"),
                );
            }
        } catch (e: any) {
            appendConsole(
                "error",
                `${i18n("ide.console.compileFail")}: ${e.message || e}`,
            );
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 注销指定Bean */
    const doUnregister = async (beanName: string) => {
        const url = resolvedApi.value.unregisterUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        consoleBusy.value = true;
        try {
            const res = await postRequest(url.replace("{beanName}", beanName), {});
            const result = res?.data;
            if (result?.code === 0 || result?.code === 200) {
                appendConsole(
                    "success",
                    i18n("ide.console.unregisterSuccess", beanName),
                );
            } else {
                appendConsole("error", result?.cnMessage || "注销失败");
            }
        } catch (e: any) {
            appendConsole("error", `注销异常: ${e.message || e}`);
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 注销全部Bean */
    const doUnregisterAll = async () => {
        const url = resolvedApi.value.unregisterAllUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        try {
            const res = await postRequest(url, {});
            const result = res?.data;
            if (result?.code === 0 || result?.code === 200) {
                appendConsole("success", i18n("ide.console.unregisterAllSuccess"));
            } else {
                appendConsole("error", result?.cnMessage || "注销失败");
            }
        } catch (e: any) {
            appendConsole("error", `注销异常: ${e.message || e}`);
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 保存草稿 */
    const doSaveDraft = async () => {
        const url = resolvedApi.value.draftSaveUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        const sourceCode = getActiveSourceCode();
        if (!sourceCode) {
            warning(i18n("ide.console.noActiveFile"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        try {
            const res = await postRequest(url, {content: sourceCode});
            const result = res?.data;
            if (result?.code === 0 || result?.code === 200) {
                appendConsole("success", i18n("ide.console.draftSaveSuccess"));
            } else {
                appendConsole("error", result?.cnMessage || "草稿保存失败");
            }
        } catch (e: any) {
            appendConsole("error", `保存草稿异常: ${e.message || e}`);
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 健康检查 */
    const doHealthCheck = async () => {
        const url = resolvedApi.value.healthCheckUrl;
        if (!url) {
            warning(i18n("ide.console.noCompileUrl"));
            return;
        }
        consoleVisible.value = true;
        consoleBusy.value = true;
        try {
            const res = await getRequest(url);
            const result = res?.data;
            if (result?.code === 0 || result?.code === 200) {
                const data = result.data;
                if (data.recovered > 0) {
                    appendConsole(
                        "warning",
                        i18n("ide.console.healthCheckRecovered", data.recovered),
                    );
                } else {
                    appendConsole(
                        "success",
                        i18n("ide.console.healthCheckOk", data.registeredCount || 0),
                    );
                }
            } else {
                appendConsole("error", result?.cnMessage || "健康检查失败");
            }
        } catch (e: any) {
            appendConsole("error", `健康检查异常: ${e.message || e}`);
        } finally {
            consoleBusy.value = false;
        }
    };

    /** 加载模板列表 */
    const loadTemplateList = async (): Promise<
        { key: string; name: string }[]
    > => {
        const url = resolvedApi.value.templateUrl;
        if (!url) return [];
        try {
            const res = await postRequest(url, {});
            const data = res?.data;
            if (data?.code === 0 && data?.data) {
                return Object.entries(data.data).map(([key, name]) => ({
                    key,
                    name: name as string,
                }));
            }
            return [];
        } catch {
            return [];
        }
    };

    /** 加载模板代码 */
    const loadTemplateCode = async (
        templateCode: string,
        packageName: string,
        className: string,
    ): Promise<string | null> => {
        const url = resolvedApi.value.templateLoadUrl;
        if (!url) {
            warning(i18n("ide.template.noTemplateUrl"));
            return null;
        }
        try {
            const res = await postRequest(url, {
                templateCode,
                packageName,
                className,
            });
            const data = res?.data;
            if (data?.code === 0 && data?.data != null) return data.data;
            warning(data?.cnMessage || i18n("ide.template.loadFailed"));
            return null;
        } catch (e: any) {
            warning(i18n("ide.template.loadFailed"));
            return null;
        }
    };

    return {
        doCompile,
        doRun,
        doCompileRegister,
        doUnregister,
        doUnregisterAll,
        doSaveDraft,
        doHealthCheck,
        loadTemplateList,
        loadTemplateCode,
    };
}
