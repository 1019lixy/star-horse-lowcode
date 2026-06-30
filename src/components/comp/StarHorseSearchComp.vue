<script setup lang="ts" name="StarHorseSearchComp">
import { isMobile } from "@/api/device";
import StarHorseSearchForm from "@/components/comp/StarHorseSearchForm.vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import MenuShot from "@/components/comp/app/MenuShot.vue";
import StarHorseQueryBuilder from "@/components/system/StarHorseQueryBuilder.vue";
import { i18n } from "@/lang";
import { PropType, computed, ref } from "vue";
import { Filter } from "@element-plus/icons-vue";
import type { SearchFields, SelectOption } from "@/components/types/SearchProps";
import type { SearchParams } from "@/components/types/Params";
import type { OrderByInfo } from "@/components/types/PageFieldInfo";

const searchFormRef = ref<InstanceType<typeof StarHorseSearchForm> | null>(
  null,
);
/** 移动端：简单 / 高级 查询弹窗 */
const dialogVisible = ref(false);
/** 桌面端：高级查询弹窗 */
const advancedVisible = ref(false);
/** 移动端弹窗内模式切换 */
const mobileMode = ref<"simple" | "advanced">("simple");

/** 高级查询条件数据 */
const advancedConditions = ref<any[]>([]);
/** 高级查询排序数据 */
const advancedSort = ref<any[]>([]);

const emits = defineEmits(["searchData", "searchOrderBy"]);
const props = defineProps({
  dialogInput: { type: Boolean, default: false },
  mutComp: { type: Boolean, default: false },
  compUrl: { type: Object },
  formData: { type: Object as PropType<SearchFields>, required: true },
  defaultCondition: { type: Array as PropType<SearchParams[]> },
  /** 是否展示「高级查询」入口，默认开启 */
  showAdvanced: { type: Boolean, default: true },
});

/** 从 formData.fieldList 派生 QueryBuilder 所需的字段下拉选项 */
const propertyOptions = computed<SelectOption[]>(() =>
  (props.formData?.fieldList || []).map((f: any) => ({
    name: f.label || f.fieldName,
    value: f.fieldName,
  })),
);

/**
 * 将 QueryBuilder 输出转换为 SearchParams[]，剥离 id / alias，
 * 与简单查询 analysisSearchData 的输出格式保持一致。
 */
function toSearchParams(items: any[]): SearchParams[] {
  const result: SearchParams[] = [];
  for (const it of items || []) {
    if (!it || it.propertyName == null || it.propertyName === "") continue;
    const param: SearchParams = {
      propertyName: it.propertyName,
      operation: it.operation,
      value: it.value,
    };
    if (Array.isArray(it.orOperList) && it.orOperList.length) {
      param.orOperList = toSearchParams(it.orOperList);
    }
    result.push(param);
  }
  return result;
}

/** 将 QueryBuilder 排序输出转换为 OrderByInfo[] */
function toOrderBy(items: any[]): OrderByInfo[] {
  const result: OrderByInfo[] = [];
  for (const s of items || []) {
    if (!s || !s.sortField) continue;
    result.push({
      fieldName: s.alias ? `${s.alias}.${s.sortField}` : s.sortField,
      orderBy: s.sortDirection || "asc",
    });
  }
  return result;
}

/** 执行高级查询：组装数据并抛出 */
function executeAdvancedSearch() {
  const conditions = toSearchParams(advancedConditions.value);
  if (props.defaultCondition?.length) {
    conditions.push(...props.defaultCondition);
  }
  emits("searchData", conditions);
  emits("searchOrderBy", toOrderBy(advancedSort.value));
  advancedVisible.value = false;
  if (isMobile) {
    dialogVisible.value = false;
  }
}

/** 重置高级查询条件与排序 */
function resetAdvanced() {
  advancedConditions.value = [];
  advancedSort.value = [];
}

/** 简单查询回调：保持原有行为，仅抛出 searchData */
const handleSearchData = (searchData: any) => {
  emits("searchData", searchData);
  if (isMobile) {
    handleClose();
  }
};

const handleMobileSearch = () => {
  mobileMode.value = "simple";
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const handleAdvancedClose = () => {
  advancedVisible.value = false;
};
</script>
<template>
  <!-- ── 桌面端：内联搜索表单 + 高级查询入口 ───────────────────── -->
  <div v-if="!isMobile">
    <StarHorseSearchForm
      ref="searchFormRef"
      v-bind="props"
      @searchData="handleSearchData"
    >
      <template v-if="showAdvanced" #action-append>
        <el-button
          :icon="Filter"
          text
          size="default"
          @click="advancedVisible = true"
        >
          {{ i18n("search.advancedQuery") }}
        </el-button>
      </template>
    </StarHorseSearchForm>
  </div>

  <!-- ── 移动端：悬浮入口按钮 ───────────────────────────────── -->
  <MenuShot
    v-if="isMobile"
    icon="search"
    :position="{
      top: '50px',
      right: '20px',
      bottom: 'unset',
    }"
    @change="handleMobileSearch"
  />

  <!-- ── 移动端：搜索弹窗（简单 / 高级 切换） ─────────────────── -->
  <star-horse-dialog
    :dialog-visible="dialogVisible"
    :title="i18n('search.query')"
    :full-screen="false"
    :source="3"
    :box-height="'100%'"
    :box-width="'100%'"
    :hide-full-screen-icon="true"
    @closeAction="handleClose"
  >
    <div v-if="showAdvanced" class="mobile-mode-switch">
      <el-radio-group v-model="mobileMode" size="default">
        <el-radio-button value="simple">
          {{ i18n("search.simple") }}
        </el-radio-button>
        <el-radio-button value="advanced">
          {{ i18n("search.advancedQuery") }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <StarHorseSearchForm
      v-if="mobileMode === 'simple'"
      ref="searchFormRef"
      v-bind="props"
      @searchData="handleSearchData"
    />

    <div v-else class="mobile-advanced-wrap">
      <StarHorseQueryBuilder
        v-model="advancedConditions"
        v-model:sort-value="advancedSort"
        :properties="propertyOptions"
        :hide-alias="true"
        :tabs="['conditions', 'sort']"
        condition-name="operation"
        property-name="propertyName"
        value-name="value"
        or-condition-name="orOperList"
        :max-height="'50vh'"
      />
      <div class="advanced-footer mobile-advanced-footer">
        <el-button link @click="resetAdvanced">
          {{ i18n("search.reset") }}
        </el-button>
        <el-button
          type="primary"
          class="advanced-submit"
          @click="executeAdvancedSearch"
        >
          {{ i18n("search.query") }}
        </el-button>
      </div>
    </div>
  </star-horse-dialog>

  <!-- ── 桌面端：高级查询弹窗 ───────────────────────────────── -->
  <star-horse-dialog
    :dialog-visible="advancedVisible"
    :title="i18n('search.advancedQuery')"
    :full-screen="false"
    :source="3"
    :box-height="'70vh'"
    :box-width="'760px'"
    :hide-full-screen-icon="false"
    @closeAction="handleAdvancedClose"
  >
    <StarHorseQueryBuilder
      v-model="advancedConditions"
      v-model:sort-value="advancedSort"
      :properties="propertyOptions"
      :hide-alias="true"
      :tabs="['conditions', 'sort']"
      condition-name="operation"
      property-name="propertyName"
      value-name="value"
      or-condition-name="orOperList"
      :max-height="'calc(70vh - 180px)'"
    />
    <template #footer>
      <div class="advanced-footer">
        <el-button link @click="resetAdvanced">
          {{ i18n("search.reset") }}
        </el-button>
        <el-button link @click="handleAdvancedClose">
          {{ i18n("search.cancel") }}
        </el-button>
        <el-button
          type="primary"
          class="advanced-submit"
          @click="executeAdvancedSearch"
        >
          {{ i18n("search.query") }}
        </el-button>
      </div>
    </template>
  </star-horse-dialog>
</template>
<style lang="scss" scoped>
/* 高级查询弹窗底部操作区 */
.advanced-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}

.advanced-submit {
  background: var(--star-horse-style);
  color: var(--star-horse-white);
  border-color: var(--star-horse-style);
}

/* 移动端：模式切换分段控件 */
.mobile-mode-switch {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.mobile-advanced-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-advanced-footer {
  justify-content: center;
  margin-top: 16px;
}
</style>
