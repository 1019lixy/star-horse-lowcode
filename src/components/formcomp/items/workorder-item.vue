<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from "vue";
import {allAction, checkIsDisabled, prepsFilter,} from "@/components/formcomp/utils/ItemRelationEventUtils";
import {ItemPreps} from "@/components/types/ItemPreps";
import {i18n} from "@/lang";
import {copyText} from "@/api/system";
import {postRequest} from "@/api/star_horse_apis";
import {getUserInfo} from "@/utils/auth";
import {error, warning} from "@/utils/message";
import type {
  WorkorderConfig,
  WorkorderFillSide,
  WorkorderLengthMismatchStrategy,
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
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

interface WorkorderBackendParam {
  paramName: string;
  paramValue: string;
  valueType: "static" | "form";
}

const generating = ref<boolean>(false);
const seqStorage: WorkorderSeqStorage = new LocalSeqStorage();

const preps = computed<any>(() => props.field?.preps || {});

const generateMode = computed<"frontend" | "backend">(() =>
    preps.value.generateMode === "backend" ? "backend" : "frontend",
);
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
    () => preps.value.cacheKey || props.field?.fieldName || "workorder",
);
const expectedLength = computed<number | undefined>(() => {
  const n = Number(preps.value.expectedLength);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
});
const lengthMismatchStrategy = computed<WorkorderLengthMismatchStrategy>(() => {
  const s = preps.value.lengthMismatchStrategy;
  return s === "truncate" || s === "pad" ? s : "error";
});
const lengthAdjustSide = computed<WorkorderFillSide>(() =>
    preps.value.lengthAdjustSide === "left" ? "left" : "right",
);
const lengthAdjustChar = computed<string>(() => {
  const c = preps.value.lengthAdjustChar;
  return c && String(c).length > 0 ? String(c)[0] : "0";
});
const backendUrl = computed<string>(() => preps.value.backendUrl || "");
const backendParams = computed<WorkorderBackendParam[]>(
    () => preps.value.backendParams || [],
);
const backendDataPath = computed<string>(
    () => preps.value.backendDataPath || "data",
);
const fallbackToFrontend = computed<boolean>(
    () => preps.value.fallbackToFrontend !== false,
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
  let segments: WorkorderSegment[] = [];
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
  return {
    segments,
    expectedLength: expectedLength.value,
    lengthMismatchStrategy: lengthMismatchStrategy.value,
    lengthAdjustSide: lengthAdjustSide.value,
    lengthAdjustChar: lengthAdjustChar.value,
  };
};

const generateFrontend = (): string => {
  if (props.source != 1) {
    return;
  }
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

const resolveDataPath = (data: any, path: string): any => {
  if (data == null) return undefined;
  if (!path) return data;
  const segments = path.split(".");
  let cur: any = data;
  for (const seg of segments) {
    if (cur == null) return undefined;
    cur = cur[seg];
  }
  return cur;
};

const buildBackendRequestParams = (): Record<string, any> => {
  const params: Record<string, any> = {};
  for (const item of backendParams.value) {
    if (!item || !item.paramName) continue;
    if (item.valueType === "form") {
      params[item.paramName] = formData.value?.[item.paramValue];
    } else {
      params[item.paramName] = item.paramValue;
    }
  }
  return params;
};

const generateBackend = async (): Promise<string> => {
  if (!backendUrl.value) {
    throw new Error("backendUrl is empty");
  }
  const params = buildBackendRequestParams();
  const res: any = await postRequest(backendUrl.value, params);
  const code = resolveDataPath(res?.data, backendDataPath.value);
  if (code == null || String(code).length === 0) {
    throw new Error("backend response empty");
  }
  return String(code);
};

const ensureWorkorder = async () => {
  if (props.isDesign || generating.value) return;
  const fieldName = props.field?.fieldName;
  if (!fieldName) return;
  const existing = formData.value?.[fieldName];
  if (existing != null && String(existing).length > 0) return;
  generating.value = true;
  try {
    let code = "";
    if (generateMode.value === "backend") {
      try {
        code = await generateBackend();
      } catch (e) {
        if (fallbackToFrontend.value) {
          warning(
              i18n("item.workorderBackendFail") + i18n("item.workorderFallback"),
          );
          code = generateFrontend();
        } else {
          error(i18n("item.workorderGenerateFailed"));
          return;
        }
      }
    } else {
      code = generateFrontend();
    }
    if (code) {
      formData.value[fieldName] = code;
      allAction(props, emits, formData, "change");
    }
  } catch (e) {
    error(i18n("item.workorderGenerateFailed"));
  } finally {
    generating.value = false;
  }
};

const displayValue = computed<string>(() => {
  const val = formData.value?.[props.field?.fieldName];
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

const handleCopy = async () => {
  if (!copyable.value) return;
  const val = formData.value?.[props.field?.fieldName];
  if (val == null || String(val).length === 0) return;
  await copyText(val);
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

onMounted(async () => {
  await nextTick();
  await ensureWorkorder();
});
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
    <el-tag
        v-bind="prepsFilter(field.preps)"
        :type="tagType(formData[field.fieldName])"
        :effect="field.preps?.tagEffect || 'light'"
        :size="field.preps?.tagSize || 'default'"
        :disabled="checkIsDisabled(props)"
        :class="['workorder-tag', { 'workorder-tag--copyable': copyable }]"
        @click="handleCopy(); itemAction('click')"
    >
      {{ displayValue }}
    </el-tag>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.workorder-tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workorder-tag--copyable {
  cursor: pointer;
}
</style>
