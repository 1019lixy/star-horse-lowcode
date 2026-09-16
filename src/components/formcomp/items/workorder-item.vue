<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {allAction, checkIsDisabled, prepsFilter,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";
import {copyText} from "@/api/system";
import {dynamicUrlOperation} from "@/api/star_horse_utils";
import {getUserInfo} from "@/utils/auth";
import {error, warning} from "@/utils/message";
import type {
  WorkorderConfig,
  WorkorderFillSide,
  WorkorderOverflowStrategy,
  WorkorderSegment,
  WorkorderSeqStorage,
} from "@/utils/workorder";
import {generateWorkorder, LocalSeqStorage, parseTemplateSegments,} from "@/utils/workorder";

defineOptions({name: "WorkorderItem"});

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");

const generating = ref<boolean>(false);
const seqStorage: WorkorderSeqStorage = new LocalSeqStorage();
// 手动编辑态
const editing = ref<boolean>(false);
const editInput = ref<string>("");

const preps = computed<any>(() => props.field?.preps || {});
const fieldName = computed<string>(() => props.field?.fieldName || "");
const isDisabled = computed<boolean>(() => checkIsDisabled(props));

const isBackendMode = computed<boolean>(() => {
  const ds = preps.value.dataSource;
  return ds === "url" || ds === "thirdParty" || !!preps.value.apiDataSource;
});
const prefix = computed<string>(() => preps.value.prefix ?? "NO");
const fixedPart = computed<string>(
    () => preps.value.fixedPart ?? "{{date:YYYYMMDD}}",
);
const fixedPartPosition = computed<"start" | "between" | "end">(() => {
  const p = preps.value.fixedPartPosition;
  return p === "start" || p === "end" ? p : "between";
});
const fillChar = computed<string>(() => {
  const c = preps.value.fillChar;
  return c && String(c).length > 0 ? String(c)[0] : "0";
});
const fillSide = computed<WorkorderFillSide>(() =>
    preps.value.fillSide === "right" ? "right" : "left",
);
const seqLength = computed<number>(() => {
  const n = Number(preps.value.seqLength);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 4;
});
const seqRadix = computed<number>(() => {
  const n = Number(preps.value.seqRadix);
  return Number.isFinite(n) && n >= 2 && n <= 62 ? Math.floor(n) : 10;
});
const seqStart = computed<number>(() => {
  const n = Number(preps.value.seqStart);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 1;
});
const overflowStrategy = computed<WorkorderOverflowStrategy>(() => {
  const s = preps.value.overflowStrategy;
  return s === "error" || s === "expand" ? s : "reset";
});
const cacheBizKey = computed<string>(
    () => preps.value.cacheKey || fieldName.value || "workorder",
);

// === 可配置行为（全部默认开启，向后兼容） ===
const refreshable = computed<boolean>(() => preps.value.refreshable !== false);
const editable = computed<boolean>(() => preps.value.editable === true);
const editTrigger = computed<"click" | "dblclick">(() =>
    preps.value.editTrigger === "click" ? "click" : "dblclick",
);
const copyable = computed<boolean>(() => preps.value.copyable !== false);

const buildSeqKey = (): string => {
  const userInfo = getUserInfo();
  const userKey = String(userInfo?.idUsersinfo ?? "anonymous");
  return `${cacheBizKey.value}:${userKey}`;
};

const buildWorkorderConfig = (): WorkorderConfig => {
  const prefixSeg: WorkorderSegment = {
    type: "static",
    value: prefix.value,
    name: "prefix",
  };
  const fixedSegments: WorkorderSegment[] = parseTemplateSegments(
      fixedPart.value,
  );
  fixedSegments.forEach((s, idx) => {
    if (!s.name) s.name = `fixedPart[${idx}]`;
  });
  const seqSeg: WorkorderSegment = {
    type: "sequence",
    length: seqLength.value,
    radix: seqRadix.value,
    fillChar: fillChar.value,
    fillSide: fillSide.value,
    start: seqStart.value,
    overflowStrategy: overflowStrategy.value,
    seqKey: buildSeqKey(),
    name: "sequence",
  };
  const segments: WorkorderSegment[] = [];
  if (fixedPartPosition.value === "start") {
    segments.push(...fixedSegments);
    if (prefix.value) segments.push(prefixSeg);
    segments.push(seqSeg);
  } else if (fixedPartPosition.value === "end") {
    if (prefix.value) segments.push(prefixSeg);
    segments.push(seqSeg);
    segments.push(...fixedSegments);
  } else {
    if (prefix.value) segments.push(prefixSeg);
    segments.push(...fixedSegments);
    segments.push(seqSeg);
  }
  return {segments};
};

const generateFrontend = (): string => {
  // 仅搜索场景(source=4)不生成工单号；新增(1)/编辑(2)等场景均允许生成，
  // 由 doGenerate 的 existing 判空控制是否覆盖已有值，避免自动重号
  if (props.source === 4) return "";
  const result = generateWorkorder(buildWorkorderConfig(), {
    fields: formData.value || {},
    storage: seqStorage,
  });
  if (!result.success) {
    warning(result.error || i18n("item.workorderGenerateFailed"));
    return "";
  }
  result.warnings.forEach((w) => warning(w));
  return result.value;
};

const extractCode = (data: any): string => {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (typeof data === "number") return String(data);
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    return extractCode(data[0]);
  }
  if (typeof data === "object") {
    const v = data.code ?? data.value ?? data.data ?? data.result;
    return v != null ? String(v) : "";
  }
  return "";
};

const generateBackend = async (): Promise<string> => {
  const result = await dynamicUrlOperation(props.field, []);
  const code = extractCode(result);
  if (!code) throw new Error("backend response empty");
  return code;
};

/** 统一生成入口：force=true 时不管有没有值都重新生成（用于刷新按钮） */
const doGenerate = async (force = false): Promise<string> => {
  if (props.isDesign || generating.value) return "";
  if (!fieldName.value) return "";
  const existing = formData.value?.[fieldName.value];
  if (!force && existing != null && String(existing).length > 0) {
    return String(existing);
  }
  generating.value = true;
  try {
    let code = "";
    if (isBackendMode.value) {
      try {
        code = await generateBackend();
      } catch {
        warning(
            i18n("item.workorderBackendFail") + i18n("item.workorderFallback"),
        );
        code = generateFrontend();
      }
    } else {
      code = generateFrontend();
    }
    if (code) {
      formData.value[fieldName.value] = code;
      allAction(props, emits, formData, "change");
    }
    return code;
  } catch (e) {
    console.error("[WORKORDER] generate error:", e);
    error(i18n("item.workorderGenerateFailed"));
    return "";
  } finally {
    generating.value = false;
  }
};

/** 自动填充（空才填） */
const ensureWorkorder = () => doGenerate(false);
/** 刷新按钮：强制重新生成，每次拿到新序列号 */
const refreshWorkorder = () => doGenerate(true);

// ===== 手动编辑 =====
const startEdit = () => {
  if (!editable.value || isDisabled.value || generating.value) return;
  editInput.value = String(formData.value?.[fieldName.value] ?? "");
  editing.value = true;
};
const commitEdit = () => {
  const v = editInput.value?.trim();
  if (v && fieldName.value) {
    formData.value[fieldName.value] = v;
    allAction(props, emits, formData, "change");
  }
  editing.value = false;
};
const cancelEdit = () => {
  editing.value = false;
};

// ===== 复制 & 展示 =====
const handleCopy = async () => {
  if (!copyable.value) return;
  const val = formData.value?.[fieldName.value];
  if (val == null || String(val).length === 0) return;
  await copyText(val);
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const displayValue = computed<string>(() => {
  const val = formData.value?.[fieldName.value];
  if (val != null && String(val).length > 0) return String(val);
  return preps.value.placeholder || i18n("item.workorderEmpty");
});

const tagType = (val: any): any => {
  const tagMap = preps.value.tagMap;
  if (tagMap && typeof tagMap === "object" && Object.keys(tagMap).length > 0) {
    return tagMap[val] || preps.value.tagType || "primary";
  }
  return preps.value.tagType || "primary";
};

// ===== 生命周期 =====
onMounted(async () => {
  await nextTick();
  await ensureWorkorder();
});

// 表单重置后字段值被清空 → 自动重新生成
watch(
    () => formData.value?.[fieldName.value],
    async (val) => {
      if (props.isDesign) return;
      if (val == null || String(val).length === 0) {
        await nextTick();
        await ensureWorkorder();
      }
    },
);
</script>

<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div class="workorder-wrapper">
      <!-- 编辑态：el-input 直接编辑 -->
      <el-input
          v-if="editing"
          v-model="editInput"
          size="small"
          :class="['workorder-input']"
          @blur="commitEdit"
          @keyup.enter.prevent="commitEdit"
          @keyup.esc.prevent="cancelEdit"
      />
      <!-- 展示态：tag + 刷新按钮 -->
      <template v-else>
        <el-tag
            v-bind="prepsFilter({...field.preps})"
            :type="tagType(formData[field.fieldName])"
            :effect="field.preps?.tagEffect || 'light'"
            :size="field.preps?.tagSize || 'default'"
            :disabled="isDisabled"
            :class="[
              'workorder-tag',
              {
                'workorder-tag--copyable': copyable,
                'workorder-tag--editable': editable,
                'workorder-tag--placeholder': !formData[field.fieldName],
              },
            ]"
            @click="editTrigger === 'click' ? startEdit() : handleCopy(); itemAction('click')"
            @dblclick="editTrigger === 'dblclick' ? startEdit() : undefined"
        >
          {{ displayValue }}
        </el-tag>
        <!-- 刷新按钮：禁用字段也可重号（系统级重新生成，非编辑数据） -->
        <button
            v-if="refreshable && !isDesign && (source==1||!formData?.[fieldName])"
            type="button"
            class="workorder-refresh"
            :class="{'is-loading': generating}"
            :disabled="generating"
            title="重新生成工单号"
            @click.stop="refreshWorkorder"
        >
          <svg
              v-if="!generating"
              class="workorder-refresh-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
          <svg
              v-else
              class="workorder-refresh-icon workorder-refresh-icon--spinning"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </button>
      </template>
    </div>
  </starhorse-form-item>
</template>

<style lang="scss" scoped>
.workorder-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
}

.workorder-tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--copyable {
    cursor: pointer;
  }

  &--editable {
    cursor: text;
  }

  &--placeholder {
    font-style: italic;
    opacity: 0.7;
  }
}

.workorder-input {
  max-width: 220px;
}

.workorder-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--el-text-color-secondary, #909399);
  cursor: pointer;
  transition: background 0.15s,
  color 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: var(--el-fill-color-light, #f5f7fa);
    color: var(--star-horse-style, #409eff);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.is-loading {
    color: var(--star-horse-style, #409eff);
  }
}

.workorder-refresh-icon {
  width: 14px;
  height: 14px;
  display: block;

  &--spinning {
    animation: workorder-spin 0.8s linear infinite;
    transform-origin: center;
  }
}

@keyframes workorder-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .workorder-refresh {
    width: 20px;
    height: 20px;
  }

  .workorder-refresh-icon {
    width: 12px;
    height: 12px;
  }
}
</style>
