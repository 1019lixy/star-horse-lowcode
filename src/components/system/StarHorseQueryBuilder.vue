<script setup lang="ts">
import {computed, PropType, ref, watch} from "vue";
import {i18n} from "@/lang";
import {SelectOption} from "../types/SearchProps";
import {uuid} from "@/api/system";
import {searchMatchList} from "@/api/star_horse_utils";
import {StarHorseIcon} from "@/components/comp";

defineOptions({name: "StarHorseQueryBuilder"});

// ─── Props ───────────────────────────────────────────────────
const props = defineProps({
  /** Property name options for dropdown (SelectOption[] or string[]) */
  properties: {
    type: Array as PropType<SelectOption[] | string[]>,
    default: () => [],
  },
  /** Alias options for table alias dropdown (e.g., [{name:'t', value:'t'}]) */
  aliasOptions: {
    type: Array as PropType<SelectOption[] | string[]>,
    default: () => [],
  },
  /** Max nesting depth (default 3) */
  maxDepth: {type: Number, default: 3},
  /** Current depth (used internally for recursion) */
  depth: {type: Number, default: 0},
  /** Whether component is disabled */
  disabled: {type: Boolean, default: false},
  /** Max height before scrollbar appears (CSS value, e.g. '400px', '50vh') */
  maxHeight: {type: String, default: "400px"},
  /** Placeholder text for property name */
  propertyPlaceholder: {type: String, default: ""},
  /** Output key name for property field */
  propertyName: {type: String, default: "propertyName"},
  /** Output key name for value field */
  valueName: {type: String, default: "value"},
  /** Output key name for condition field */
  conditionName: {type: String, default: "condition"},
  /** Output key name for OR sub-list */
  orConditionName: {type: String, default: "orOperList"},
  /** Output key name for alias field */
  aliasName: {type: String, default: "alias"},
  /** Hide the alias column entirely (for single-table scenarios where alias is not part of the output format) */
  hideAlias: {type: Boolean, default: false},
  /** Which tabs to show: 'all' or array of 'conditions','sort','aggregate' */
  tabs: {
    type: [String, Array] as PropType<"all" | ("conditions" | "sort" | "aggregate")[]>,
    default: "all",
  },
  /** Output key name for sort field */
  sortName: {type: String, default: "sortField"},
  /** Output key name for aggregate field */
  aggName: {type: String, default: "aggField"},
  /** Sort items (use with v-model:sort-value or :sort-value) */
  sortValue: {type: Array as PropType<any[]>, default: undefined},
  /** Aggregate items (use with v-model:agg-value or :agg-value) */
  aggValue: {type: Array as PropType<any[]>, default: undefined},
  /** GroupBy items (part of aggregate query) */
  groupByValue: {type: Array as PropType<any[]>, default: undefined},
  /** Having items (part of aggregate query) */
  havingValue: {type: Array as PropType<any[]>, default: undefined},
});

const emit = defineEmits<{
  (e: "update:sortValue", val: any[]): void;
  (e: "update:aggValue", val: any[]): void;
  (e: "update:groupByValue", val: any[]): void;
  (e: "update:havingValue", val: any[]): void;
}>();

// Dynamic key shortcuts
const PK = computed(() => props.propertyName);
const VK = computed(() => props.valueName);
const CK = computed(() => props.conditionName);
const GK = computed(() => props.orConditionName);
const AK = computed(() => props.aliasName);

/** Normalize properties to SelectOption[] */
const propertyOptions = computed<SelectOption[]>(() =>
    (props.properties || []).map((p: any) =>
        typeof p === "string" ? {name: p, value: p} : p,
    ),
);

/** Normalize alias options to SelectOption[] */
const aliasOpts = computed<SelectOption[]>(() =>
    (props.aliasOptions || []).map((p: any) =>
        typeof p === "string" ? {name: p, value: p} : p,
    ),
);

/** Alias options exist → use dropdown; otherwise use free text input */
const hasAliasOpts = computed(() => aliasOpts.value.length > 0);

// ─── Models ──────────────────────────────────────────────────
const modelValue = defineModel<any[]>("modelValue", {default: () => []});

const localSort = ref<any[]>(props.sortValue || []);
const localAgg = ref<any[]>(props.aggValue || []);
const localGroupBy = ref<any[]>(props.groupByValue || []);
const localHaving = ref<any[]>(props.havingValue || []);

watch(() => props.sortValue, (v) => {
  if (v && Array.isArray(v)) localSort.value = v;
}, {deep: true});
watch(() => props.aggValue, (v) => {
  if (v && Array.isArray(v)) localAgg.value = v;
}, {deep: true});
watch(() => props.groupByValue, (v) => {
  if (v && Array.isArray(v)) localGroupBy.value = v;
}, {deep: true});
watch(() => props.havingValue, (v) => {
  if (v && Array.isArray(v)) localHaving.value = v;
}, {deep: true});

const activeTab = ref("conditions");

const effectivePlaceholder = computed(() =>
    props.propertyPlaceholder || i18n("queryBuilder.placeholder.property"),
);

// ─── Tab visibility ──────────────────────────────────────────
const showConditions = computed(() =>
    props.tabs === "all" || (Array.isArray(props.tabs) && props.tabs.includes("conditions")),
);
const showSort = computed(() =>
    props.tabs === "all" || (Array.isArray(props.tabs) && props.tabs.includes("sort")),
);
const showAggregate = computed(() =>
    props.tabs === "all" || (Array.isArray(props.tabs) && props.tabs.includes("aggregate")),
);

const visibleTabs = computed(() => {
  const t: { name: string; label: string }[] = [];
  if (showConditions.value) t.push({name: "conditions", label: i18n("queryBuilder.tab.conditions")});
  if (showSort.value) t.push({name: "sort", label: i18n("queryBuilder.tab.sort")});
  if (showAggregate.value) t.push({name: "aggregate", label: i18n("queryBuilder.tab.aggregate")});
  return t;
});

// ─── Factory ─────────────────────────────────────────────────
function createItem(): Record<string, any> {
  return {id: "qc_" + uuid().substring(0, 8), [AK.value]: "", [PK.value]: "", [CK.value]: "eq", [VK.value]: ""};
}

function createSortItem(): Record<string, any> {
  return {id: "qs_" + uuid().substring(0, 8), [AK.value]: "", [props.sortName]: "", sortDirection: "asc"};
}

function createAggItem(): Record<string, any> {
  return {id: "qa_" + uuid().substring(0, 8), [AK.value]: "", [props.aggName]: "", aggFunction: "COUNT"};
}

function createGroupByItem(): Record<string, any> {
  return {id: "qg_" + uuid().substring(0, 8), [AK.value]: "", [PK.value]: ""};
}

function createHavingItem(): Record<string, any> {
  return {
    id: "qh_" + uuid().substring(0, 8),
    [AK.value]: "",
    [props.aggName]: "",
    aggFunction: "COUNT",
    [CK.value]: "eq",
    [VK.value]: ""
  };
}

function normalizeItem(item: any) {
  if (!(PK.value in item)) item[PK.value] = "";
  if (!(CK.value in item)) item[CK.value] = "eq";
  if (!(VK.value in item)) item[VK.value] = "";
  if (!(AK.value in item)) item[AK.value] = "";
  return item;
}

watch(
    () => modelValue.value,
    (val) => {
      if (!val || !Array.isArray(val) || val.length === 0) {
        modelValue.value = [createItem()];
      } else {
        val.forEach(normalizeItem);
      }
    },
    {immediate: true, deep: true},
);

// ─── Constants ───────────────────────────────────────────────
const matchList = searchMatchList();
const NO_VALUE_CONDS = ["isnull", "notnull"];
const RANGE_CONDS = ["bt"];
const MULTI_CONDS = ["ini", "ins"];
const AGG_FUNCTIONS = ["COUNT", "SUM", "AVG", "MAX", "MIN"];

// ─── Helpers ─────────────────────────────────────────────────
const needsValue = (c: string) => !NO_VALUE_CONDS.includes(c);
const isRange = (c: string) => RANGE_CONDS.includes(c);
const isMulti = (c: string) => MULTI_CONDS.includes(c);

function onConditionChange(cond: Record<string, any>) {
  const vk = VK.value;
  const ck = CK.value;
  if (NO_VALUE_CONDS.includes(cond[ck])) cond[vk] = null;
  else if (RANGE_CONDS.includes(cond[ck])) cond[vk] = ["", ""];
  else if (MULTI_CONDS.includes(cond[ck])) cond[vk] = [];
  else cond[vk] = "";
}

// ─── Operations on conditions ────────────────────────────────
function addItem() {
  modelValue.value!.push(createItem());
}

function removeItem(i: number | string) {
  modelValue.value!.splice(i as number, 1);
  if (modelValue.value!.length === 0) modelValue.value!.push(createItem());
}

function addOrCondition(item: any) {
  const gk = GK.value;
  if (!item[gk]) item[gk] = [];
  item[gk].push(createItem());
}

function removeOrCondition(item: any, i: number | string) {
  const gk = GK.value;
  if (!item[gk]) return;
  item[gk].splice(i as number, 1);
  if (item[gk].length === 0) delete item[gk];
}

// ─── Operations on sort ──────────────────────────────────────
function addSort() {
  localSort.value = [...localSort.value, createSortItem()];
  emit("update:sortValue", localSort.value);
}

function removeSort(i: number | string) {
  localSort.value = localSort.value.filter((_, idx) => idx !== i);
  emit("update:sortValue", localSort.value);
}

// ─── Operations on aggregate ─────────────────────────────────
function addAgg() {
  localAgg.value = [...localAgg.value, createAggItem()];
  emit("update:aggValue", localAgg.value);
}

function removeAgg(i: number | string) {
  localAgg.value = localAgg.value.filter((_, idx) => idx !== i);
  emit("update:aggValue", localAgg.value);
}

// ─── Operations on groupBy ───────────────────────────────────
function addGroupBy() {
  localGroupBy.value = [...localGroupBy.value, createGroupByItem()];
  emit("update:groupByValue", localGroupBy.value);
}

function removeGroupBy(i: number | string) {
  localGroupBy.value = localGroupBy.value.filter((_, idx) => idx !== i);
  emit("update:groupByValue", localGroupBy.value);
}

// ─── Operations on having ────────────────────────────────────
function addHaving() {
  localHaving.value = [...localHaving.value, createHavingItem()];
  emit("update:havingValue", localHaving.value);
}

function removeHaving(i: number | string) {
  localHaving.value = localHaving.value.filter((_, idx) => idx !== i);
  emit("update:havingValue", localHaving.value);
}

function onHavingConditionChange(item: Record<string, any>) {
  onConditionChange(item);
}
</script>

<template>
  <div class="dqb" :class="{ 'dqb--hide-alias': hideAlias }">
    <el-tabs v-if="visibleTabs.length > 1" v-model="activeTab" class="dqb-tabs">
      <!-- ── Conditions Tab ───────────────────────────────── -->
      <el-tab-pane v-if="showConditions" :label="i18n('queryBuilder.tab.conditions')" name="conditions">
        <template v-if="modelValue">
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-prop">{{ i18n('queryBuilder.col.property') }}</span>
            <span class="dqb-col-cond">{{ i18n('queryBuilder.col.condition') }}</span>
            <span class="dqb-col-val">{{ i18n('queryBuilder.col.value') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(item, idx) in modelValue" :key="item.id" class="dqb-entry">
              <div class="dqb-item">
                <div class="dqb-item-alias">
                  <el-select v-if="hasAliasOpts" v-model="item[AK]"
                             :placeholder="i18n('queryBuilder.placeholder.alias')"
                             clearable filterable allow-create default-first-option :disabled="disabled" >
                    <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                  </el-select>
                  <el-input v-else v-model="item[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                            :disabled="disabled" />
                </div>
                <div class="dqb-item-prop">
                  <el-select v-if="propertyOptions.length" v-model="item[PK]" :placeholder="effectivePlaceholder"
                             filterable allow-create default-first-option :disabled="disabled">
                    <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                  </el-select>
                  <el-input v-else v-model="item[PK]" :placeholder="effectivePlaceholder" :disabled="disabled"/>
                </div>
                <div class="dqb-item-cond">
                  <el-select v-model="item[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                             :disabled="disabled" @change="onConditionChange(item)">
                    <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                  </el-select>
                </div>
                <div class="dqb-item-val">
                  <span v-if="!needsValue(item[CK])" class="dqb-val-empty">&mdash;</span>
                  <div v-else-if="isRange(item[CK])" class="dqb-range">
                    <el-input v-model="item[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                              :disabled="disabled"/>
                    <span class="dqb-range-sep">~</span>
                    <el-input v-model="item[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                              :disabled="disabled"/>
                  </div>
                  <el-select v-else-if="isMulti(item[CK])" v-model="item[VK]"
                             multiple filterable allow-create
                             :placeholder="i18n('queryBuilder.placeholder.multi')" :disabled="disabled"/>
                  <slot v-else name="value-input" :item="item" :value-key="VK" :prop="item[PK]" :condition="item[CK]"
                        :disabled="disabled">
                    <el-input v-model="item[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                              :disabled="disabled"/>
                  </slot>
                </div>
                <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                           @click="removeItem(idx)">
                  <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
                </el-button>
              </div>
              <div v-if="item[GK]?.length" class="dqb-or-list">
                <div v-for="(orCond, oi) in item[GK]" :key="orCond.id" class="dqb-item dqb-item--or">
                  <span class="dqb-or-tag">OR</span>
                  <div class="dqb-item-alias">
                    <el-select v-if="hasAliasOpts" v-model="orCond[AK]"
                               :placeholder="i18n('queryBuilder.placeholder.alias')" clearable filterable allow-create
                               default-first-option :disabled="disabled" >
                      <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                    </el-select>
                    <el-input v-else v-model="orCond[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                              :disabled="disabled" />
                  </div>
                  <div class="dqb-item-prop">
                    <el-select v-if="propertyOptions.length" v-model="orCond[PK]" :placeholder="effectivePlaceholder"
                               filterable allow-create default-first-option :disabled="disabled">
                      <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                    </el-select>
                    <el-input v-else v-model="orCond[PK]" :placeholder="effectivePlaceholder" :disabled="disabled"/>
                  </div>
                  <div class="dqb-item-cond">
                    <el-select v-model="orCond[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                               :disabled="disabled" @change="onConditionChange(orCond)">
                      <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                    </el-select>
                  </div>
                  <div class="dqb-item-val">
                    <span v-if="!needsValue(orCond[CK])" class="dqb-val-empty">&mdash;</span>
                    <div v-else-if="isRange(orCond[CK])" class="dqb-range">
                      <el-input v-model="orCond[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                                :disabled="disabled"/>
                      <span class="dqb-range-sep">~</span>
                      <el-input v-model="orCond[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                                :disabled="disabled"/>
                    </div>
                    <el-select v-else-if="isMulti(orCond[CK])" v-model="orCond[VK]" multiple filterable allow-create
                               default-first-option :placeholder="i18n('queryBuilder.placeholder.multi')"
                               :disabled="disabled"/>
                    <slot v-else name="value-input" :item="orCond" :value-key="VK" :prop="orCond[PK]"
                          :condition="orCond[CK]" :disabled="disabled">
                      <el-input v-model="orCond[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                                :disabled="disabled"/>
                    </slot>
                  </div>
                  <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                             @click="removeOrCondition(item, oi)">
                    <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
                  </el-button>
                </div>
              </div>
              <div v-if="!disabled && depth < maxDepth - 1" class="dqb-or-action">
                <el-button type="warning" text   @click="addOrCondition(item)">
                  <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addOr') }}
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addItem">
              <star-horse-icon icon-class="add" />{{ i18n('queryBuilder.action.addCondition') }}
            </el-button>
          </div>
        </template>
      </el-tab-pane>

      <!-- ── Sort Tab ─────────────────────────────────────── -->
      <el-tab-pane v-if="showSort" :label="i18n('queryBuilder.tab.sort')" name="sort">
        <div class="dqb-col-header">
          <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
          <span class="dqb-col-sort-field">{{ i18n('queryBuilder.sort.field') }}</span>
          <span class="dqb-col-sort-dir">{{ i18n('queryBuilder.sort.direction') }}</span>
          <span class="dqb-col-action"></span>
        </div>
        <div class="dqb-list">
          <div v-for="(s, si) in localSort" :key="s.id" class="dqb-item">
            <div class="dqb-item-alias">
              <el-select v-if="hasAliasOpts" v-model="s[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                         clearable filterable allow-create default-first-option :disabled="disabled" >
                <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
              </el-select>
              <el-input v-else v-model="s[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                        :disabled="disabled" />
            </div>
            <div class="dqb-sort-field">
              <el-select v-if="propertyOptions.length" v-model="s[sortName]"
                         :placeholder="i18n('queryBuilder.sort.selectField')"
                         filterable allow-create default-first-option :disabled="disabled">
                <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
              </el-select>
              <el-input v-else v-model="s[sortName]" :placeholder="i18n('queryBuilder.sort.selectField')"
                        :disabled="disabled"/>
            </div>
            <div class="dqb-sort-dir">
              <el-radio-group v-model="s.sortDirection" :disabled="disabled" size="default">
                <el-radio-button value="asc">{{ i18n('queryBuilder.sort.asc') }}</el-radio-button>
                <el-radio-button value="desc">{{ i18n('queryBuilder.sort.desc') }}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="dqb-item-val"></div>
            <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                       @click="removeSort(si)">
              <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
            </el-button>
          </div>
        </div>
        <div v-if="!disabled" class="dqb-actions">
          <el-button type="primary" text   @click="addSort">
            <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addSort') }}
          </el-button>
        </div>
      </el-tab-pane>

      <!-- ── Aggregate Tab (includes GROUP BY + HAVING) ──── -->
      <el-tab-pane v-if="showAggregate" :label="i18n('queryBuilder.tab.aggregate')" name="aggregate">

        <!-- Section 1: Aggregate Functions (SELECT) -->
        <div class="dqb-section">
          <div class="dqb-section-title">SELECT &mdash; {{ i18n('queryBuilder.agg.function') }}</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-agg-field">{{ i18n('queryBuilder.agg.field') }}</span>
            <span class="dqb-col-agg-func">{{ i18n('queryBuilder.agg.function') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(a, ai) in localAgg" :key="a.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="a[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a2 in aliasOpts" :key="a2.value" :label="a2.name" :value="a2.value"/>
                </el-select>
                <el-input v-else v-model="a[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-agg-field">
                <el-select v-if="propertyOptions.length" v-model="a[aggName]"
                           :placeholder="i18n('queryBuilder.agg.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="a[aggName]" :placeholder="i18n('queryBuilder.agg.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-agg-func">
                <el-select v-model="a.aggFunction" :placeholder="i18n('queryBuilder.agg.selectFunc')"
                           :disabled="disabled">
                  <el-option v-for="fn in AGG_FUNCTIONS" :key="fn" :label="fn" :value="fn"/>
                </el-select>
              </div>
              <div class="dqb-item-val"></div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeAgg(ai)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addAgg">
              <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addAggregate') }}
            </el-button>
          </div>
        </div>

        <!-- Section 2: GROUP BY -->
        <div class="dqb-section">
          <div class="dqb-section-title">GROUP BY</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-groupby-field">{{ i18n('queryBuilder.groupBy.field') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(g, gi) in localGroupBy" :key="g.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="g[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                </el-select>
                <el-input v-else v-model="g[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-groupby-field">
                <el-select v-if="propertyOptions.length" v-model="g[PK]"
                           :placeholder="i18n('queryBuilder.groupBy.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="g[PK]" :placeholder="i18n('queryBuilder.groupBy.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-item-val"></div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeGroupBy(gi)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addGroupBy">
              <star-horse-icon icon-class="add" />{{ i18n('queryBuilder.action.addGroupBy') }}
            </el-button>
          </div>
        </div>

        <!-- Section 3: HAVING -->
        <div class="dqb-section">
          <div class="dqb-section-title">HAVING</div>
          <div class="dqb-section-hint">{{ i18n('queryBuilder.having.hint') }}</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-having-func">{{ i18n('queryBuilder.agg.function') }}</span>
            <span class="dqb-col-having-field">{{ i18n('queryBuilder.agg.field') }}</span>
            <span class="dqb-col-having-cond">{{ i18n('queryBuilder.col.condition') }}</span>
            <span class="dqb-col-having-val">{{ i18n('queryBuilder.col.value') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(h, hi) in localHaving" :key="h.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="h[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                </el-select>
                <el-input v-else v-model="h[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-having-func">
                <el-select v-model="h.aggFunction" :placeholder="i18n('queryBuilder.agg.selectFunc')"
                           :disabled="disabled">
                  <el-option v-for="fn in AGG_FUNCTIONS" :key="fn" :label="fn" :value="fn"/>
                </el-select>
              </div>
              <div class="dqb-having-field">
                <el-select v-if="propertyOptions.length" v-model="h[aggName]"
                           :placeholder="i18n('queryBuilder.agg.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="h[aggName]" :placeholder="i18n('queryBuilder.agg.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-having-cond">
                <el-select v-model="h[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                           :disabled="disabled" @change="onHavingConditionChange(h)">
                  <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                </el-select>
              </div>
              <div class="dqb-having-val">
                <span v-if="!needsValue(h[CK])" class="dqb-val-empty">&mdash;</span>
                <div v-else-if="isRange(h[CK])" class="dqb-range">
                  <el-input v-model="h[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                            :disabled="disabled"/>
                  <span class="dqb-range-sep">~</span>
                  <el-input v-model="h[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                            :disabled="disabled"/>
                </div>
                <el-select v-else-if="isMulti(h[CK])" v-model="h[VK]" multiple filterable allow-create
                           default-first-option :placeholder="i18n('queryBuilder.placeholder.multi')"
                           :disabled="disabled"/>
                <el-input v-else v-model="h[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                          :disabled="disabled"/>
              </div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeHaving(hi)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addHaving">
              <star-horse-icon icon-class="add" />{{ i18n('queryBuilder.action.addHaving') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Single-tab mode (no tab wrapper) -->
    <div v-else-if="visibleTabs.length === 1" class="dqb-scroll">
      <!-- Conditions only -->
      <template v-if="visibleTabs[0].name === 'conditions' && modelValue">
        <div class="dqb-col-header">
          <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
          <span class="dqb-col-prop">{{ i18n('queryBuilder.col.property') }}</span>
          <span class="dqb-col-cond">{{ i18n('queryBuilder.col.condition') }}</span>
          <span class="dqb-col-val">{{ i18n('queryBuilder.col.value') }}</span>
          <span class="dqb-col-action"></span>
        </div>
        <div class="dqb-list">
          <div v-for="(item, idx) in modelValue" :key="item.id" class="dqb-entry">
            <div class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="item[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                </el-select>
                <el-input v-else v-model="item[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-item-prop">
                <el-select v-if="propertyOptions.length" v-model="item[PK]" :placeholder="effectivePlaceholder"
                           filterable allow-create default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="item[PK]" :placeholder="effectivePlaceholder" :disabled="disabled"/>
              </div>
              <div class="dqb-item-cond">
                <el-select v-model="item[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                           :disabled="disabled" @change="onConditionChange(item)">
                  <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                </el-select>
              </div>
              <div class="dqb-item-val">
                <span v-if="!needsValue(item[CK])" class="dqb-val-empty">&mdash;</span>
                <div v-else-if="isRange(item[CK])" class="dqb-range">
                  <el-input v-model="item[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                            :disabled="disabled"/>
                  <span class="dqb-range-sep">~</span>
                  <el-input v-model="item[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                            :disabled="disabled"/>
                </div>
                <el-select v-else-if="isMulti(item[CK])" v-model="item[VK]" multiple filterable allow-create
                           default-first-option :placeholder="i18n('queryBuilder.placeholder.multi')"
                           :disabled="disabled"/>
                <el-input v-else v-model="item[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                          :disabled="disabled"/>
              </div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeItem(idx)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
            <div v-if="item[GK]?.length" class="dqb-or-list">
              <div v-for="(orCond, oi) in item[GK]" :key="orCond.id" class="dqb-item dqb-item--or">
                <span class="dqb-or-tag">OR</span>
                <div class="dqb-item-alias">
                  <el-select v-if="hasAliasOpts" v-model="orCond[AK]"
                             :placeholder="i18n('queryBuilder.placeholder.alias')" clearable filterable allow-create
                             default-first-option :disabled="disabled" >
                    <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                  </el-select>
                  <el-input v-else v-model="orCond[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                            :disabled="disabled" />
                </div>
                <div class="dqb-item-prop">
                  <el-select v-if="propertyOptions.length" v-model="orCond[PK]" :placeholder="effectivePlaceholder"
                             filterable allow-create default-first-option :disabled="disabled">
                    <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                  </el-select>
                  <el-input v-else v-model="orCond[PK]" :placeholder="effectivePlaceholder" :disabled="disabled"/>
                </div>
                <div class="dqb-item-cond">
                  <el-select v-model="orCond[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                             :disabled="disabled" @change="onConditionChange(orCond)">
                    <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                  </el-select>
                </div>
                <div class="dqb-item-val">
                  <span v-if="!needsValue(orCond[CK])" class="dqb-val-empty">&mdash;</span>
                  <div v-else-if="isRange(orCond[CK])" class="dqb-range">
                    <el-input v-model="orCond[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                              :disabled="disabled"/>
                    <span class="dqb-range-sep">~</span>
                    <el-input v-model="orCond[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                              :disabled="disabled"/>
                  </div>
                  <el-select v-else-if="isMulti(orCond[CK])" v-model="orCond[VK]" multiple filterable allow-create
                             default-first-option :placeholder="i18n('queryBuilder.placeholder.multi')"
                             :disabled="disabled"/>
                  <el-input v-else v-model="orCond[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                            :disabled="disabled"/>
                </div>
                <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                           @click="removeOrCondition(item, oi)">
                  <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
                </el-button>
              </div>
            </div>
            <div v-if="!disabled && depth < maxDepth - 1" class="dqb-or-action">
              <el-button type="warning" text   @click="addOrCondition(item)">
                <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addOr') }}
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="!disabled" class="dqb-actions">
          <el-button type="primary" text   @click="addItem">
            <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addCondition') }}
          </el-button>
        </div>
      </template>

      <!-- Sort only -->
      <template v-if="visibleTabs[0].name === 'sort'">
        <div class="dqb-col-header">
          <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
          <span class="dqb-col-sort-field">{{ i18n('queryBuilder.sort.field') }}</span>
          <span class="dqb-col-sort-dir">{{ i18n('queryBuilder.sort.direction') }}</span>
          <span class="dqb-col-action"></span>
        </div>
        <div class="dqb-list">
          <div v-for="(s, si) in localSort" :key="s.id" class="dqb-item">
            <div class="dqb-item-alias">
              <el-select v-if="hasAliasOpts" v-model="s[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                         clearable filterable allow-create default-first-option :disabled="disabled" >
                <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
              </el-select>
              <el-input v-else v-model="s[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                        :disabled="disabled" />
            </div>
            <div class="dqb-sort-field">
              <el-select v-if="propertyOptions.length" v-model="s[sortName]"
                         :placeholder="i18n('queryBuilder.sort.selectField')" filterable allow-create
                         default-first-option :disabled="disabled">
                <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
              </el-select>
              <el-input v-else v-model="s[sortName]" :placeholder="i18n('queryBuilder.sort.selectField')"
                        :disabled="disabled"/>
            </div>
            <div class="dqb-sort-dir">
              <el-radio-group v-model="s.sortDirection" :disabled="disabled" size="default">
                <el-radio-button value="asc">{{ i18n('queryBuilder.sort.asc') }}</el-radio-button>
                <el-radio-button value="desc">{{ i18n('queryBuilder.sort.desc') }}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="dqb-item-val"></div>
            <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                       @click="removeSort(si)">
              <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
            </el-button>
          </div>
        </div>
        <div v-if="!disabled" class="dqb-actions">
          <el-button type="primary" text   @click="addSort">
            <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addSort') }}
          </el-button>
        </div>
      </template>

      <!-- Aggregate only (includes GROUP BY + HAVING) -->
      <template v-if="visibleTabs[0].name === 'aggregate'">
        <!-- Section 1: Aggregate Functions -->
        <div class="dqb-section">
          <div class="dqb-section-title">SELECT &mdash; {{ i18n('queryBuilder.agg.function') }}</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-agg-field">{{ i18n('queryBuilder.agg.field') }}</span>
            <span class="dqb-col-agg-func">{{ i18n('queryBuilder.agg.function') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(a, ai) in localAgg" :key="a.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="a[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a2 in aliasOpts" :key="a2.value" :label="a2.name" :value="a2.value"/>
                </el-select>
                <el-input v-else v-model="a[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-agg-field">
                <el-select v-if="propertyOptions.length" v-model="a[aggName]"
                           :placeholder="i18n('queryBuilder.agg.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="a[aggName]" :placeholder="i18n('queryBuilder.agg.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-agg-func">
                <el-select v-model="a.aggFunction" :placeholder="i18n('queryBuilder.agg.selectFunc')"
                           :disabled="disabled">
                  <el-option v-for="fn in AGG_FUNCTIONS" :key="fn" :label="fn" :value="fn"/>
                </el-select>
              </div>
              <div class="dqb-item-val"></div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeAgg(ai)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addAgg">
              <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addAggregate') }}
            </el-button>
          </div>
        </div>

        <!-- Section 2: GROUP BY -->
        <div class="dqb-section">
          <div class="dqb-section-title">GROUP BY</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-groupby-field">{{ i18n('queryBuilder.groupBy.field') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(g, gi) in localGroupBy" :key="g.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="g[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                </el-select>
                <el-input v-else v-model="g[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-groupby-field">
                <el-select v-if="propertyOptions.length" v-model="g[PK]"
                           :placeholder="i18n('queryBuilder.groupBy.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="g[PK]" :placeholder="i18n('queryBuilder.groupBy.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-item-val"></div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeGroupBy(gi)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addGroupBy">
              <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addGroupBy') }}
            </el-button>
          </div>
        </div>

        <!-- Section 3: HAVING -->
        <div class="dqb-section">
          <div class="dqb-section-title">HAVING</div>
          <div class="dqb-section-hint">{{ i18n('queryBuilder.having.hint') }}</div>
          <div class="dqb-col-header">
            <span class="dqb-col-alias">{{ i18n('queryBuilder.col.alias') }}</span>
            <span class="dqb-col-having-func">{{ i18n('queryBuilder.agg.function') }}</span>
            <span class="dqb-col-having-field">{{ i18n('queryBuilder.agg.field') }}</span>
            <span class="dqb-col-having-cond">{{ i18n('queryBuilder.col.condition') }}</span>
            <span class="dqb-col-having-val">{{ i18n('queryBuilder.col.value') }}</span>
            <span class="dqb-col-action"></span>
          </div>
          <div class="dqb-list">
            <div v-for="(h, hi) in localHaving" :key="h.id" class="dqb-item">
              <div class="dqb-item-alias">
                <el-select v-if="hasAliasOpts" v-model="h[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                           clearable filterable allow-create default-first-option :disabled="disabled" >
                  <el-option v-for="a in aliasOpts" :key="a.value" :label="a.name" :value="a.value"/>
                </el-select>
                <el-input v-else v-model="h[AK]" :placeholder="i18n('queryBuilder.placeholder.alias')"
                          :disabled="disabled" />
              </div>
              <div class="dqb-having-func">
                <el-select v-model="h.aggFunction" :placeholder="i18n('queryBuilder.agg.selectFunc')"
                           :disabled="disabled">
                  <el-option v-for="fn in AGG_FUNCTIONS" :key="fn" :label="fn" :value="fn"/>
                </el-select>
              </div>
              <div class="dqb-having-field">
                <el-select v-if="propertyOptions.length" v-model="h[aggName]"
                           :placeholder="i18n('queryBuilder.agg.selectField')" filterable allow-create
                           default-first-option :disabled="disabled">
                  <el-option v-for="p in propertyOptions" :key="p.value" :label="p.name" :value="p.value"/>
                </el-select>
                <el-input v-else v-model="h[aggName]" :placeholder="i18n('queryBuilder.agg.selectField')"
                          :disabled="disabled"/>
              </div>
              <div class="dqb-having-cond">
                <el-select v-model="h[CK]" :placeholder="i18n('queryBuilder.placeholder.condition')"
                           :disabled="disabled" @change="onHavingConditionChange(h)">
                  <el-option v-for="m in matchList" :key="m.value" :label="m.name" :value="m.value"/>
                </el-select>
              </div>
              <div class="dqb-having-val">
                <span v-if="!needsValue(h[CK])" class="dqb-val-empty">&mdash;</span>
                <div v-else-if="isRange(h[CK])" class="dqb-range">
                  <el-input v-model="h[VK][0]" :placeholder="i18n('queryBuilder.placeholder.min')"
                            :disabled="disabled"/>
                  <span class="dqb-range-sep">~</span>
                  <el-input v-model="h[VK][1]" :placeholder="i18n('queryBuilder.placeholder.max')"
                            :disabled="disabled"/>
                </div>
                <el-select v-else-if="isMulti(h[CK])" v-model="h[VK]" multiple filterable allow-create
                           default-first-option :placeholder="i18n('queryBuilder.placeholder.multi')"
                           :disabled="disabled"/>
                <el-input v-else v-model="h[VK]" :placeholder="i18n('queryBuilder.placeholder.value')"
                          :disabled="disabled"/>
              </div>
              <el-button v-if="!disabled" type="danger" text   class="dqb-item-del"
                         @click="removeHaving(hi)">
                <star-horse-icon icon-class="delete" color="var(--el-color-danger)"/>
              </el-button>
            </div>
          </div>
          <div v-if="!disabled" class="dqb-actions">
            <el-button type="primary" text   @click="addHaving">
              <star-horse-icon icon-class="add" /> {{ i18n('queryBuilder.action.addHaving') }}
            </el-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dqb {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 0;
  padding: 10px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

/* ── Hide alias column (single-table mode) ─────────────────── */
.dqb--hide-alias {
  .dqb-col-alias, .dqb-item-alias {
    display: none;
  }
}

/* ── Section (within aggregate tab) ────────────────────────── */
.dqb-section {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.dqb-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  padding: 4px 6px 8px;
  letter-spacing: 0.3px;
}

.dqb-section-hint {
  font-size: 12px;
  color: #909399;
  padding: 0 6px 8px;
  line-height: 1.5;
}

/* ── Column header ─────────────────────────────────────────── */
.dqb-col-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 6px 4px;
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.dqb-col-alias {
  width: 80px;
  flex-shrink: 0;
}

.dqb-col-prop {
  width: 22%;
  flex-shrink: 0;
}

.dqb-col-cond {
  width: 22%;
  flex-shrink: 0;
}

.dqb-col-val {
  flex: 1;
  min-width: 0;
}

.dqb-col-action {
  width: 28px;
  flex-shrink: 0;
}

/* ── Entry (item + its OR sub-list) ────────────────────────── */
.dqb-entry {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Condition list ────────────────────────────────────────── */
.dqb-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dqb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.15s;

  &:hover {
    border-color: #c0c4cc;
  }
}

/* alias: fixed width */
.dqb-item-alias {
  width: 80px;
  flex-shrink: 0;

  :deep(.el-select) {
    width: 100% !important;
  }
}

/* property: 22% */
.dqb-item-prop {
  width: 22%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-input), :deep(.el-select) {
    width: 100% !important;
  }
}

/* condition: 22% */
.dqb-item-cond {
  width: 22%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-select) {
    width: 100% !important;
  }
}

/* value: flex grow */
.dqb-item-val {
  flex: 1;
  min-width: 0;

  :deep(.el-select), :deep(.el-input) {
    width: 100% !important;
  }
}

.dqb-val-empty {
  width: 100%;
  text-align: center;
  color: #dcdfe6;
}

.dqb-range {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;

  :deep(.el-input) {
    flex: 1;
    min-width: 0;
  }
}

.dqb-range-sep {
  color: #c0c4cc;
  flex-shrink: 0;
  font-size: 12px;
}

.dqb-item-del {
  flex-shrink: 0;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.15s;

  .dqb-item:hover & {
    opacity: 1;
  }
}

/* ── OR sub-list ───────────────────────────────────────────── */
.dqb-or-list {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 10px;
  border-left: 2px solid #e6a23c;

  .dqb-item--or {
    background: #fffdf5;
    border-color: #f0e6c8;

    &:hover {
      border-color: #e6a23c;
    }
  }
}

.dqb-or-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #e6a23c;
  background: #fdf6ec;
  flex-shrink: 0;
  line-height: 18px;
}

.dqb-or-action {
  padding-left: 28px;
}

/* ── Actions ───────────────────────────────────────────────── */
.dqb-actions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #ebeef5;
}

/* ── Tabs ──────────────────────────────────────────────────── */
.dqb-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}

/* ── Single-tab scrollable wrapper ─────────────────────────── */
.dqb-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* ── Sort columns ──────────────────────────────────────────── */
.dqb-col-sort-field {
  width: 40%;
  flex-shrink: 0;
}

.dqb-col-sort-dir {
  width: 180px;
  flex-shrink: 0;
}

.dqb-sort-field {
  width: 40%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-input), :deep(.el-select) {
    width: 100% !important;
  }
}

.dqb-sort-dir {
  width: 180px;
  flex-shrink: 0;
}

/* ── Aggregate columns ────────────────────────────────────── */
.dqb-col-agg-field {
  width: 40%;
  flex-shrink: 0;
}

.dqb-col-agg-func {
  width: 160px;
  flex-shrink: 0;
}

.dqb-agg-field {
  width: 40%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-input), :deep(.el-select) {
    width: 100% !important;
  }
}

.dqb-agg-func {
  width: 160px;
  flex-shrink: 0;

  :deep(.el-select) {
    width: 100% !important;
  }
}

/* ── GroupBy columns ──────────────────────────────────────── */
.dqb-col-groupby-field {
  flex: 1;
  flex-shrink: 0;
}

.dqb-groupby-field {
  flex: 1;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-input), :deep(.el-select) {
    width: 100% !important;
  }
}

/* ── Having columns ───────────────────────────────────────── */
.dqb-col-having-func {
  width: 110px;
  flex-shrink: 0;
}

.dqb-col-having-field {
  width: 20%;
  flex-shrink: 0;
}

.dqb-col-having-cond {
  width: 18%;
  flex-shrink: 0;
}

.dqb-col-having-val {
  flex: 1;
  min-width: 0;
}

.dqb-having-func {
  width: 110px;
  flex-shrink: 0;

  :deep(.el-select) {
    width: 100% !important;
  }
}

.dqb-having-field {
  width: 20%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-input), :deep(.el-select) {
    width: 100% !important;
  }
}

.dqb-having-cond {
  width: 18%;
  min-width: 0;
  flex-shrink: 0;

  :deep(.el-select) {
    width: 100% !important;
  }
}

.dqb-having-val {
  flex: 1;
  min-width: 0;

  :deep(.el-select), :deep(.el-input) {
    width: 100% !important;
  }
}
</style>
