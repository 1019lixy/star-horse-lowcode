<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {isMobile} from "@/api/device";
import {i18n} from "@/lang";
import {ItemPreps} from "@/components/types/ItemPreps";
import type {CheckMatrixValue} from "@/components/types";
import {compDynamicData} from "@/api/star_horse_utils";
import CheckMatrixTable from "@/components/comp/checkmatrix/CheckMatrixTable.vue";
import CheckMatrixMobile from "@/components/comp/checkmatrix/CheckMatrixMobile.vue";
import {
    buildRenderRows,
    ensureCheckValue,
    parseCheckGroups,
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
 * 检查分组数据源(与 select 等组件完全对齐):
 * - 静态: preps.values = [{name: 分组标题, value: 检查项数组|JSON字符串}]
 * - 动态: preps.apiDataSource(设计器 DataSourceConfigPanel 配置)
 * 静态同步解析(首帧即可见,不依赖异步时序),挂载后经 compDynamicData 统一拉取覆盖
 */
const groups = ref<any[]>(parseCheckGroups(props.field.preps?.values || []));
const groupsLoaded = ref(groups.value.length > 0);

const loadGroups = async () => {
  try {
    const data = await compDynamicData(props.field);
    const parsed = parseCheckGroups(data || []);
    if (parsed.length > 0) {
      groups.value = parsed;
    }
  } catch (e) {
    console.error("[checkmatrix-item] 检查项数据源加载失败:", e);
  } finally {
    groupsLoaded.value = true;
  }
};

onMounted(() => {
  loadGroups();
});

const renderRows = computed(() => buildRenderRows(groups.value, preps.value));

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
    () => [props.field.fieldName, groups.value],
    ensureField,
    {immediate: true},
);

const checkValue = computed<CheckMatrixValue>(
    () => formData.value?.[props.field.fieldName] || {rows: {}},
);

const visible = computed(() => props.field.formVisible !== false);

const groupsCount = computed(() => groups.value.length);
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
      >{{ i18n("checkmatrix.designTip", groupsCount, renderRows.length) }}</div>
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
          v-else-if="groupsLoaded"
          class="cm-comp-empty"
      >{{ i18n("checkmatrix.noGroups") }}</div>
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

.cm-comp-empty {
  font-size: 13px;
  color: #98a1aa;
  border: 1px dashed #b6bcc4;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
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