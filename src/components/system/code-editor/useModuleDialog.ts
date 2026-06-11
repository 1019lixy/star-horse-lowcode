import { computed, ref, type Ref } from "vue";
import { getRequest, postRequest } from "@/api/star_horse_apis";
import { error as errorMsg, success, warning } from "@/utils/message";
import { i18n } from "@/lang/index";
import type { IdeApiConfig } from "./constants";

interface ModuleItem {
  idCodeModule: string;
  name: string;
  description?: string;
  [key: string]: any;
}

type DialogMode = "load" | "save";

export function useModuleDialog(resolvedApi: Ref<IdeApiConfig>) {
  const moduleDialogVisible = ref(false);
  const moduleDialogMode = ref<DialogMode>("load");
  const moduleList = ref<ModuleItem[]>([]);
  const selectedModuleId = ref("");
  const moduleListLoading = ref(false);
  const moduleSearchKeyword = ref("");
  const moduleDialogLoading = ref(false);

  const showCreateForm = ref(false);
  const newModuleName = ref("");
  const newModuleDesc = ref("");

  const filteredModuleList = computed(() => {
    const kw = moduleSearchKeyword.value.trim().toLowerCase();
    if (!kw) return moduleList.value;
    return moduleList.value.filter(
      (m) => m.name.toLowerCase().includes(kw) || (m.description || "").toLowerCase().includes(kw),
    );
  });

  const moduleDialogTitle = computed(() => {
    return moduleDialogMode.value === "load" ? i18n("ide.module.selectLoad") : i18n("ide.module.selectSave");
  });

  const fetchModuleList = async (): Promise<ModuleItem[]> => {
    if (!resolvedApi.value.createModuleUrl && !resolvedApi.value.moduleListUrl) return [];
    moduleListLoading.value = true;
    try {
      const res: any = await getRequest(resolvedApi.value.moduleListUrl || resolvedApi.value.createModuleUrl!);
      const data = res?.data;
      if (data?.code === 0 && Array.isArray(data?.data)) return data.data as ModuleItem[];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      warning(data?.cnMessage || i18n("ide.module.fetchFailed"));
      return [];
    } catch (err: any) {
      errorMsg(err?.message || i18n("ide.load.requestError"));
      return [];
    } finally {
      moduleListLoading.value = false;
    }
  };

  const openModuleDialog = async (mode: DialogMode = "load") => {
    moduleDialogMode.value = mode;
    moduleSearchKeyword.value = "";
    selectedModuleId.value = "";
    showCreateForm.value = false;
    newModuleName.value = "";
    newModuleDesc.value = "";
    moduleList.value = await fetchModuleList();
    moduleDialogVisible.value = true;
  };

  const cancelModuleDialog = () => {
    moduleDialogVisible.value = false;
    selectedModuleId.value = "";
    showCreateForm.value = false;
  };

  const toggleCreateForm = () => {
    showCreateForm.value = !showCreateForm.value;
    if (showCreateForm.value) {
      newModuleName.value = "";
      newModuleDesc.value = "";
    }
  };

  const createModuleAndSave = async (): Promise<{ id: string; name: string } | null> => {
    if (!newModuleName.value.trim()) {
      warning(i18n("ide.module.enterName"));
      return null;
    }
    if (!resolvedApi.value.createModuleUrl) {
      warning(i18n("ide.module.noCreateUrl"));
      return null;
    }
    moduleDialogLoading.value = true;
    try {
      const res: any = await postRequest(resolvedApi.value.createModuleUrl!, {
        name: newModuleName.value.trim(),
        description: newModuleDesc.value.trim(),
      });
      const data = res?.data;
      if (data?.code === 0 && data?.data) {
        const newModule = data.data as ModuleItem;
        showCreateForm.value = false;
        moduleDialogVisible.value = false;
        success(i18n("ide.module.createSuccess"));
        return { id: newModule.idCodeModule, name: newModule.name };
      } else {
        warning(data?.cnMessage || i18n("ide.module.createFailed"));
        return null;
      }
    } catch (err: any) {
      errorMsg(err?.message || i18n("ide.save.requestError"));
      return null;
    } finally {
      moduleDialogLoading.value = false;
    }
  };

  return {
    moduleDialogVisible,
    moduleDialogMode,
    moduleList,
    selectedModuleId,
    moduleListLoading,
    moduleSearchKeyword,
    moduleDialogLoading,
    showCreateForm,
    newModuleName,
    newModuleDesc,
    filteredModuleList,
    moduleDialogTitle,
    fetchModuleList,
    openModuleDialog,
    cancelModuleDialog,
    toggleCreateForm,
    createModuleAndSave,
  };
}
