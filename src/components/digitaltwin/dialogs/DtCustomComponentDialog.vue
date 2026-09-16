<script setup lang="ts" name="DtCustomComponentDialog">
/**
 * 数字孪生 - 自定义组件弹窗
 *
 * 双 Tab：
 *  - 保存组件：将当前选中实体保存为自定义组件（DtModelPreset），持久化到 localStorage
 *  - 组件库：管理已保存的自定义组件（搜索/添加到场景/删除）
 *
 * 遵循 DtEntityDialog.vue 范式：StarHorseDialog + v-model:visible + @merge
 */
import { computed, ref, watch } from "vue";
import { i18n } from "@/lang";
import { ElMessage, ElMessageBox } from "element-plus";
import { ShSvgIcon } from "@/components/shared";
import { DT_MODEL_CATEGORIES } from "../modelLibrary";
import type {
  DtEntity,
  DtModelCategoryKey,
  DtModelPart,
  DtModelPartType,
  DtModelPreset,
} from "../types";
import { StarHorsePanel } from "@/components/comp";

const props = defineProps<{
  visible: boolean;
  /** 当前选中的实体（用于"保存组件"页签预填） */
  selectedEntity?: DtEntity | null;
  dialogType?: "dialog" | "drawer";
}>();

const emit = defineEmits<{
  (e: "update:visible", v: boolean): void;
  /** 从库中点击添加自定义组件到场景 */
  (e: "add-custom-component", preset: DtModelPreset): void;
}>();

const innerVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const activeTab = ref<"save" | "library">("save");

/* ----------------------- localStorage 持久化 ----------------------- */
const STORAGE_KEY = "dt_custom_components";

const loadFromStorage = (): DtModelPreset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (list: DtModelPreset[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

/* ----------------------- 保存组件 Tab ----------------------- */
const saveForm = ref({
  name: "",
  categoryKey: "digitaltwin.library.category.industrial" as DtModelCategoryKey,
  color: "#409EFF",
});

const canSave = computed(() => {
  return props.selectedEntity != null && saveForm.value.name.trim().length > 0;
});

/** 实体转 DtModelPreset（MVP：单实体 → 单部件） */
const entityToPreset = (
  entity: DtEntity,
  name: string,
  categoryKey: DtModelCategoryKey,
  color: string,
): DtModelPreset => {
  const part: DtModelPart = {
    id: `${entity.id}_part`,
    type: entity.type as DtModelPartType,
    offset: { x: 0, y: 0, z: 0 },
    size: { ...entity.size },
    color: entity.color,
  };
  return {
    type: `custom_${Date.now()}`,
    labelKey: "", // 自定义组件用 name 而非 i18n key
    categoryKey,
    parts: [part],
    parameters: [],
    defaultColor: color,
    defaultSize: { ...entity.size },
  };
};

const handleSave = (): void => {
  if (!props.selectedEntity) {
    ElMessage.warning(i18n("digitaltwin.customComponentDialog.empty"));
    return;
  }
  if (!saveForm.value.name.trim()) {
    ElMessage.warning(i18n("digitaltwin.message.nameRequired"));
    return;
  }
  const preset = entityToPreset(
    props.selectedEntity,
    saveForm.value.name.trim(),
    saveForm.value.categoryKey,
    saveForm.value.color,
  );
  // 保存 name 到 preset（labelKey 为空时 UI fallback 到 name）
  (preset as DtModelPreset & { name?: string }).name =
    saveForm.value.name.trim();
  const list = loadFromStorage();
  list.push(preset);
  saveToStorage(list);
  libraryList.value = list;
  ElMessage.success(i18n("digitaltwin.message.customComponentSaved"));
  // 重置表单 + 切换到库 Tab
  saveForm.value.name = "";
  activeTab.value = "library";
};

/* ----------------------- 组件库 Tab ----------------------- */
const libraryList = ref<DtModelPreset[]>([]);
const searchKeyword = ref("");

const filteredLibrary = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase();
  if (!kw) return libraryList.value;
  return libraryList.value.filter((p) => {
    const name = (p as DtModelPreset & { name?: string }).name || p.type;
    return name.toLowerCase().includes(kw);
  });
});

const handleAddFromLibrary = (preset: DtModelPreset): void => {
  emit("add-custom-component", preset);
  innerVisible.value = false;
};

const handleDeleteFromLibrary = (preset: DtModelPreset): void => {
  const name =
    (preset as DtModelPreset & { name?: string }).name || preset.type;
  ElMessageBox.confirm(
    i18n("digitaltwin.customComponentDialog.deleteConfirm").replace(
      "{0}",
      name,
    ),
    i18n("digitaltwin.customComponentDialog.title"),
    { type: "warning" },
  )
    .then(() => {
      const list = libraryList.value.filter((p) => p.type !== preset.type);
      saveToStorage(list);
      libraryList.value = list;
      ElMessage.success(i18n("digitaltwin.message.customComponentDeleted"));
    })
    .catch(() => {});
};

const getCategoryLabel = (key: DtModelCategoryKey): string => {
  const cat = DT_MODEL_CATEGORIES.find((c) => c.key === key);
  return cat ? i18n(cat.key as any) : key;
};

const getPresetName = (preset: DtModelPreset): string => {
  return (preset as DtModelPreset & { name?: string }).name || preset.type;
};

/* ----------------------- 生命周期 ----------------------- */
watch(
  () => props.visible,
  (v) => {
    if (v) {
      // 打开时重新加载库
      libraryList.value = loadFromStorage();
      // 预填名称
      if (props.selectedEntity) {
        saveForm.value.name = `${props.selectedEntity.name}_component`;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <star-horse-panel
    :type="dialogType"
    v-model="innerVisible"
    :title="i18n('digitaltwin.customComponentDialog.title')"
    box-width="640px"
    :userAction="true"
  >
    <el-tabs v-model="activeTab">
      <!-- 保存组件 Tab -->
      <el-tab-pane
        :label="i18n('digitaltwin.customComponentDialog.saveTab')"
        name="save"
      >
        <div v-if="!selectedEntity" class="empty-tip">
          <ShSvgIcon name="component" size="48px" />
          <p>{{ i18n("digitaltwin.customComponentDialog.empty") }}</p>
        </div>
        <el-form v-else :model="saveForm" label-width="100px" size="default">
          <el-form-item :label="i18n('digitaltwin.customComponentDialog.name')">
            <el-input v-model="saveForm.name" placeholder="..." />
          </el-form-item>
          <el-form-item
            :label="i18n('digitaltwin.customComponentDialog.category')"
          >
            <el-select v-model="saveForm.categoryKey" style="width: 100%">
              <el-option
                v-for="cat in DT_MODEL_CATEGORIES"
                :key="cat.key"
                :label="i18n(cat.key as any)"
                :value="cat.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="i18n('digitaltwin.customComponentDialog.color')"
          >
            <el-color-picker v-model="saveForm.color" />
          </el-form-item>
          <el-form-item
            :label="i18n('digitaltwin.customComponentDialog.parts')"
          >
            <div class="parts-preview">
              <div class="part-item">
                <span class="part-type">{{ selectedEntity.type }}</span>
                <span class="part-size">
                  {{ selectedEntity.size.width }}×{{
                    selectedEntity.size.height
                  }}×{{ selectedEntity.size.depth }}
                </span>
              </div>
              <div class="parts-count">
                {{
                  i18n("digitaltwin.customComponentDialog.partsCount").replace(
                    "{0}",
                    "1",
                  )
                }}
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!canSave" @click="handleSave">
              {{ i18n("digitaltwin.customComponentDialog.save") }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 组件库 Tab -->
      <el-tab-pane
        :label="i18n('digitaltwin.customComponentDialog.libraryTab')"
        name="library"
      >
        <el-input
          v-model="searchKeyword"
          :placeholder="i18n('digitaltwin.customComponentDialog.search')"
          clearable
          style="margin-bottom: 12px"
        />
        <div v-if="filteredLibrary.length === 0" class="empty-tip">
          <ShSvgIcon name="component" size="48px" />
          <p>{{ i18n("digitaltwin.customComponentDialog.libraryEmpty") }}</p>
        </div>
        <div v-else class="library-list">
          <div
            v-for="preset in filteredLibrary"
            :key="preset.type"
            class="library-card"
          >
            <div
              class="card-color"
              :style="{ background: preset.defaultColor }"
            />
            <div class="card-info">
              <div class="card-name">{{ getPresetName(preset) }}</div>
              <div class="card-meta">
                <span class="card-category">{{
                  getCategoryLabel(preset.categoryKey)
                }}</span>
                <span class="card-parts">
                  {{
                    i18n(
                      "digitaltwin.customComponentDialog.partsCount",
                    ).replace("{0}", String(preset.parts.length))
                  }}
                </span>
              </div>
            </div>
            <div class="card-actions">
              <el-button
                type="primary"
                size="small"
                @click="handleAddFromLibrary(preset)"
              >
                <ShSvgIcon name="plus" size="12px" />
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteFromLibrary(preset)"
              >
                <ShSvgIcon name="delete" size="12px" />
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </star-horse-panel>
</template>

<style lang="scss" scoped>
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--el-text-color-secondary);
  gap: 12px;

  p {
    margin: 0;
    font-size: 13px;
  }
}

.parts-preview {
  width: 100%;

  .part-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--el-fill-color-light);
    border-radius: 4px;
    font-size: 12px;

    .part-type {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .part-size {
      color: var(--el-text-color-secondary);
      font-family: monospace;
    }
  }

  .parts-count {
    margin-top: 6px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.library-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.library-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  .card-color {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .card-info {
    flex: 1;
    min-width: 0;

    .card-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-meta {
      margin-top: 2px;
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: var(--el-text-color-secondary);
    }
  }

  .card-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
}
</style>
