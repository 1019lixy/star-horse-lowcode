<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from "vue";
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

const preps = computed<any>(() => props.field?.preps || {});

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
    () => preps.value.cacheKey || props.field?.fieldName || "workorder",
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

  };
};

const generateFrontend = (): string => {
  if (props.source != 1) {
    console.log("[WORKORDER] source != 1, skip. source =", props.source);
    return;
  }
  const config = buildWorkorderConfig();
  console.log("[WORKORDER] config:", JSON.stringify(config));
  console.log("[WORKORDER] preps:", JSON.stringify(preps.value));
  const result = generateWorkorder(config, {
    fields: formData.value || {},
    storage: seqStorage,
  });
  console.log("[WORKORDER] result:", {
    success: result.success,
    value: result.value,
    error: result.error,
    warnings: result.warnings,
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
  if (!code) {
    throw new Error("backend response empty");
  }
  return code;
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
    if (isBackendMode.value) {
      try {
        code = await generateBackend();
      } catch (e) {
        warning(
            i18n("item.workorderBackendFail") + i18n("item.workorderFallback"),
        );
        code = generateFrontend();
      }
    } else {
      code = generateFrontend();
    }
    if (code) {
      formData.value[fieldName] = code;
      console.log("[WORKORDER] wrote to formData:", fieldName, "=", code);
      allAction(props, emits, formData, "change");
    } else {
      console.log("[WORKORDER] code is empty, not writing to formData");
    }
  } catch (e) {
    console.error("[WORKORDER] ensureWorkorder error:", e);
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
        v-bind="prepsFilter({...field.preps})"
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
