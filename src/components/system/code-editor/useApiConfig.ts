import {computed, ref, type Ref, watch} from "vue";
import type {IdeApiConfig} from "./constants";

const STORAGE_KEY = "sh-ide-api-config";

/**
 * API配置管理
 * - 首次使用props传入的api对象
 * - 用户修改后保存到localStorage
 * - 重置时用props覆盖localStorage
 */
export function useApiConfig(propsApi: Ref<IdeApiConfig>) {
    /** 从localStorage读取已保存的配置 */
    const loadFromStorage = (): IdeApiConfig | null => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch {
            /* ignore */
        }
        return null;
    };

    /** 保存配置到localStorage */
    const saveToStorage = (config: IdeApiConfig) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch {
            /* ignore */
        }
    };

    /** 从localStorage清除配置 */
    const clearStorage = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    };

    // 本地可编辑的配置（优先用localStorage的，没有则用props）
    const localConfig = ref<IdeApiConfig>(
        loadFromStorage() || {...propsApi.value},
    );

    // 当props变化时，如果localStorage没有配置，则同步props
    watch(
        propsApi,
        (newVal) => {
            if (!loadFromStorage()) {
                localConfig.value = {...newVal};
            }
        },
        {deep: true},
    );

    /** 最终生效的API配置：localConfig覆盖props（localConfig中非空字段优先） */
    const resolvedApi = computed<IdeApiConfig>(() => {
        const props = propsApi.value;
        const local = localConfig.value;
        return {
            loadUrl: local.loadUrl || props.loadUrl,
            saveUrl: local.saveUrl || props.saveUrl,
            compileUrl: local.compileUrl || props.compileUrl,
            runUrl: local.runUrl || props.runUrl,
            templateUrl: local.templateUrl || props.templateUrl,
            templateLoadUrl: local.templateLoadUrl || props.templateLoadUrl,
            compileRegisterUrl: local.compileRegisterUrl || props.compileRegisterUrl,
            unregisterUrl: local.unregisterUrl || props.unregisterUrl,
            unregisterAllUrl: local.unregisterAllUrl || props.unregisterAllUrl,
            registeredListUrl: local.registeredListUrl || props.registeredListUrl,
            sourceCodeUrl: local.sourceCodeUrl || props.sourceCodeUrl,
            draftSaveUrl: local.draftSaveUrl || props.draftSaveUrl,
            draftListUrl: local.draftListUrl || props.draftListUrl,
            draftSourceUrl: local.draftSourceUrl || props.draftSourceUrl,
            healthCheckUrl: local.healthCheckUrl || props.healthCheckUrl,
            executeUrl: local.executeUrl || props.executeUrl,
            createModuleUrl: local.createModuleUrl || props.createModuleUrl,
            moduleListUrl: local.moduleListUrl || props.moduleListUrl,
            lspServerUrl: local.lspServerUrl || props.lspServerUrl,
        };
    });

    /** 更新配置并保存到localStorage */
    const updateConfig = (config: IdeApiConfig) => {
        localConfig.value = {...config};
        saveToStorage(config);
    };

    /** 更新单个字段 */
    const updateField = (key: keyof IdeApiConfig, value: string) => {
        localConfig.value = {...localConfig.value, [key]: value};
        saveToStorage(localConfig.value);
    };

    /** 重置为props传入的配置，清除localStorage */
    const resetConfig = () => {
        localConfig.value = {...propsApi.value};
        clearStorage();
    };
    return {
        localConfig,
        resolvedApi,
        updateConfig,
        updateField,
        resetConfig,
    };
}
