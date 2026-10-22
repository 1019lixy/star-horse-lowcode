<script setup lang="ts">
import {computed, watch} from "vue";
import {isMobile} from "@/api/device";
import {ItemPreps} from "@/components/types/ItemPreps";
import type {CheckMatrixValue} from "@/components/types";
import CheckMatrixTable from "@/components/comp/checkmatrix/CheckMatrixTable.vue";
import CheckMatrixMobile from "@/components/comp/checkmatrix/CheckMatrixMobile.vue";
import {
    buildRenderRows,
    ensureCheckValue,
} from "@/components/comp/checkmatrix/useCheckMatrixState";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const formData = defineModel("formData");

const preps = computed(() => props.field.preps || {});

/**
 * checkGroups 配置:数组直用;设计器 textarea 配置的 JSON 字符串自动解析
 */
const checkGroups = computed<any[]>(() => {
  const groups = preps.value.checkGroups;
  if (Array.isArray(groups)) return groups;
  if (typeof groups === "string" && groups.trim()) {
    try {
      const parsed = JSON.parse(groups);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
});

const renderRows = computed(() => buildRenderRows(checkGroups.value));

/**
 * 显式初始化 dataForm[fieldName] 值对象(而非 computed 副作用):
 * 保证 Table/Mobile 内 ensureCheckValue 的就地修改落到 dataForm 上
 */
const ensureField = () => {
  const fieldName = props.field.fieldName;
  if (!fieldName) return;
  if (!formData.value) {
    formData.value = {};
  }
  const current = formData.value[fieldName];
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    formData.value[fieldName] = {rows: {}};
  }
  ensureCheckValue(
      formData.value[fieldName],
      renderRows.value,
      preps.value,
  );
};
watch(
    () => [props.field.fieldName, checkGroups.value],
    ensureField,
    {immediate: true},
);

const checkValue = computed<CheckMatrixValue>(
    () => formData.value?.[props.field.fieldName] || {rows: {}},
);

const visible = computed(() => props.field.formVisible !== false);

const groupsCount = computed(
    () => checkGroups.value.length,
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
    <div v-if="visible" class="check-matrix-comp">
      <div
          v-if="isDesign"
          class="cm-comp-design-tip"
      >checkmatrix · {{ groupsCount }} 组 · {{ renderRows.length }} 项</div>
      <div
          v-if="preps.matrixTitle"
          class="cm-comp-title"
      >
        <span class="cm-comp-title-text">{{ preps.matrixTitle }}</span>
      </div>
      <template v-if="renderRows.length > 0">
        <check-matrix-table
            v-if="!isMobile"
            :rows="renderRows"
            :value="checkValue"
            :preps="preps"
            :disabled="disabled"
            :source="source"
        />
        <check-matrix-mobile
            v-else
            :rows="renderRows"
            :value="checkValue"
            :preps="preps"
            :disabled="disabled"
            :source="source"
        />
      </template>
      <div
          v-if="preps.noteText && isMobile"
          class="cm-comp-note"
      >{{ preps.noteText }}</div>
    </div>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.check-matrix-comp {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.cm-comp-design-tip {
  font-size: 12px;
  color: #98a1aa;
  border: 1px dashed #b6bcc4;
  border-radius: 6px;
  padding: 4px 8px;
}

.cm-comp-title {
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  padding: 8px 12px;
  font-size: 14px;
  color: #1f2329;
  border-bottom: none;

  .cm-comp-title-text {
    position: relative;
    padding-left: 10px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      bottom: 3px;
      width: 4px;
      border-radius: 2px;
      background: var(--sh-cm-accent, #2563eb);
    }
  }
}

.cm-comp-note {
  background: #fff;
  border: 1px solid var(--sh-cm-bd, #c9cdd3);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #57606a;
  line-height: 1.7;
  white-space: pre-line;
}
</style>