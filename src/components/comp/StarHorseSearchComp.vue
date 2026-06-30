<script setup lang="ts" name="StarHorseSearchComp">
import { isMobile } from "@/api/device";
import StarHorseSearchForm from "@/components/comp/StarHorseSearchForm.vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import MenuShot from "@/components/comp/app/MenuShot.vue";
import StarHorseQueryBuilder from "@/components/system/StarHorseQueryBuilder.vue";
import { i18n } from "@/lang";
import {
  PropType,
  computed,
  defineComponent,
  h,
  reactive,
  ref,
  watch,
} from "vue";
import { Filter } from "@element-plus/icons-vue";
import StarHorseItem from "@/components/comp/StarHorseItem.vue";
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

/** 字段名 → 字段元数据映射，用于按类型驱动值输入控件 */
const fieldMetaMap = computed<Map<string, any>>(() => {
  const m = new Map<string, any>();
  for (const f of props.formData?.fieldList || []) {
    if (f?.fieldName) m.set(f.fieldName, f);
  }
  return m;
});

/**
 * 高级查询值输入控件：复用 star-horse-item 的 <component :is> 分发机制，
 * 自动兼容所有字段类型（select/number/date/...），无需在通用组件内堆 if-else。
 * 通过代理 formData/field 适配 QueryBuilder 的单值模型（item[valueKey]）。
 */
const AdvancedValueInput = defineComponent({
  name: "AdvancedValueInput",
  props: {
    item: { type: Object, required: true },
    valueKey: { type: String, required: true },
    prop: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
  setup(p) {
    // -item 组件通过 formData[field.fieldName] 读写值；
    // proxyForm 以 valueKey 为 key 承载单值，与 item[valueKey] 双向同步
    const proxyForm = reactive<any>({ [p.valueKey]: p.item?.[p.valueKey] ?? "" });

    // 每次字段切换创建全新 field 对象，不复用 reactive，
    // 避免 -item 组件 onMounted mutate 的内部状态（id/actions/step）被破坏导致白屏
    const buildField = () => {
      const meta: any = fieldMetaMap.value.get(p.prop) || {};
      // 去掉 defaultValue 避免预填干扰空条件；preps 单独克隆防止 -item mutate 污染原元数据
      const { defaultValue, preps, ...rest } = meta;
      void defaultValue;
      return reactive({
        ...rest,
        fieldName: p.valueKey,
        preps: { ...(preps || {}) },
      });
    };
    const fieldRef = ref<any>(buildField());
    watch(() => p.prop, () => { fieldRef.value = buildField(); }, { immediate: false });
    watch(fieldMetaMap, () => { fieldRef.value = buildField(); });

    // 双向同步 proxyForm[valueKey] <-> item[valueKey]
    watch(
      () => proxyForm[p.valueKey],
      (v) => {
        if (p.item?.[p.valueKey] !== v) p.item[p.valueKey] = v;
      },
    );
    watch(
      () => p.item?.[p.valueKey],
      (v) => {
        if (proxyForm[p.valueKey] !== v) proxyForm[p.valueKey] = v ?? "";
      },
    );

    return () =>
      h(
        "div",
        { class: "advanced-value-input" },
        h(StarHorseItem, {
          dataForm: proxyForm,
          "onUpdate:dataForm": (v: any) => Object.assign(proxyForm, v),
          item: fieldRef.value,
          source: 4,
          compSize: "small",
          bareFlag: true,
          // 切换字段时强制重建 -item，配合 fieldRef 换新对象，彻底隔离状态
          key: p.prop,
        }),
      );
  },
});

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
      >
        <template #value-input="{ item, valueKey, prop, disabled }">
          <advanced-value-input
            :item="item"
            :value-key="valueKey"
            :prop="prop"
            :disabled="disabled"
          />
        </template>
      </StarHorseQueryBuilder>
      <div class="advanced-footer mobile-advanced-footer">
        <div class="advanced-footer__secondary">
          <el-button link @click="resetAdvanced">
            {{ i18n("search.reset") }}
          </el-button>
        </div>
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
    >
      <template #value-input="{ item, valueKey, prop, disabled }">
        <advanced-value-input
          :item="item"
          :value-key="valueKey"
          :prop="prop"
          :disabled="disabled"
        />
      </template>
    </StarHorseQueryBuilder>
    <template #footer>
      <div class="advanced-footer">
        <div class="advanced-footer__secondary">
          <el-button link @click="resetAdvanced">
            {{ i18n("search.reset") }}
          </el-button>
          <el-button link @click="handleAdvancedClose">
            {{ i18n("search.cancel") }}
          </el-button>
        </div>
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
/* 高级查询弹窗底部操作区：主次分组 + 顶部细分割，避免紧贴边缘的廉价感 */
.advanced-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--el-border-color-lighter);

  &__secondary {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

/* 主按钮：略宽、字重正常、hover 微抬 */
.advanced-submit {
  min-width: 88px;
  background: var(--star-horse-style);
  color: var(--star-horse-white);
  border-color: var(--star-horse-style);

  &:hover {
    opacity: 0.9;
  }
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

/* 移动端 footer：居中、贴近底，按钮间距更大便于触控 */
.mobile-advanced-footer {
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px 0 4px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 高级查询值输入：复用 star-horse-item，但隐藏其搜索态拖拽 handle 并取消最小宽度限制 */
.advanced-value-input {
  width: 100%;

  :deep(.drag-handle) {
    display: none;
  }

  :deep(.comp-info),
  :deep(.bare-comp) {
    width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
  }
}
</style>
