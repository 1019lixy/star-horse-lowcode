<template>
  <EditDataDialog
    v-model="dialogInputVisible"
    :disabled="checkIsDisabled(props)"
    :initial-content="String(formData[field.fieldName])"
    @confirm="handleContentConfirm"
  />
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <!-- PC 端：完全保持原逻辑 -->
    <el-autocomplete
      v-if="!isSeparate"
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :fetch-suggestions="querySearch"
      v-bind="prepsFilter(field.preps)"
      v-on="getDynamicEvents(props, itemAction, formData)"
      @dblclick.stop="editContent"
      v-model="normalData"
    >
      <template #prefix>
        <star-horse-icon
          :icon-class="field.preps?.prefixIcon"
          v-if="field.preps?.prefixIcon"
        />
        <span v-if="field.preps?.prefix">{{ field.preps?.prefix }}</span>
      </template>
      <template #suffix>
        <star-horse-icon
          :icon-class="field.preps?.suffixIcon"
          v-if="field.preps?.suffixIcon"
        />
        <span v-if="field.preps?.suffix">{{ field.preps?.suffix }}</span>
      </template>
      <template #prepend v-if="field.preps?.prependText">
        {{ field.preps?.prependText }}
      </template>
      <template #prepend v-if="prependList?.length > 0">
        <el-select v-model="formData[preName]" style="width: 115px !important">
          <el-option
            v-for="item in prependList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #append v-if="field.preps?.appendText">
        {{ field.preps?.appendText }}
      </template>
      <template #append v-if="field.preps?.appendAction">
        <star-horse-icon
          :title="field.preps?.appendAction?.actionTitle"
          style="cursor: pointer"
          :icon-class="field.preps?.appendAction?.icon || 'document'"
          @click="field.preps?.appendAction?.actions?.(formData)"
        />
      </template>
      <template #append v-if="appendList?.length > 0">
        <el-select v-model="formData[appName]" style="width: 115px !important">
          <el-option
            v-for="item in appendList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-autocomplete>

    <!-- APP 端分离模式：输入框 + 抽屉式建议列表 -->
    <template v-else>
      <el-input
        :model-value="normalData"
        :placeholder="field.preps?.placeholder"
        :disabled="checkIsDisabled(props)"
        @dblclick.stop="editContent"
        @click="openPicker"
        readonly
      >
        <template v-if="field.preps?.prefixIcon" #prefix>
          <star-horse-icon :icon-class="field.preps?.prefixIcon" />
        </template>
        <template v-if="field.preps?.suffixIcon" #suffix>
          <star-horse-icon :icon-class="field.preps?.suffixIcon" />
        </template>
      </el-input>

      <ShMobilePicker
        v-model="pickerVisible"
        :title="title"
        :placement="placement"
        :size="size"
        :show-footer="showFooter"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <div class="sh-mobile-autocomplete">
          <el-input
            v-model="tempKeyword"
            :placeholder="i18n('starhorse.pleaseInput') || '请输入'"
            clearable
            class="sh-mobile-autocomplete__keyword"
          />
          <div class="sh-mobile-autocomplete__list">
            <div
              v-for="(item, idx) in suggestions"
              :key="idx"
              class="sh-mobile-autocomplete__item"
              :class="{ 'is-active': isSelected(item) }"
              @click="selectSuggestion(item)"
            >
              {{ item[field.preps?.props?.label || 'name'] || item.value || item }}
            </div>
            <div v-if="!suggestions.length && !showCreateRow" class="sh-mobile-autocomplete__empty">
              {{ i18n("pivot.empty.noData") || "暂无数据" }}
            </div>
          </div>
          <!-- allowCreate：创建新值 -->
          <div v-if="showCreateRow" class="sh-mobile-autocomplete__create" @click="createCustomValue">
            <star-horse-icon icon-class="add" />
            <span>{{ i18n("form.add") }} "{{ tempKeyword }}"</span>
          </div>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import {
  compDynamicData,
  createFilter,
  dynamicUrlOperation,
} from "@/api/star_horse_utils";
import { SearchParams } from "@/components/types/Params";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { StarHorseIcon } from "@/components/comp";
import { usePrefixSuffix } from "@/components/formcomp/utils/prefixSuffixUtils";
import {
  useMobilePicker,
} from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const dialogInputVisible = ref<boolean>(false);

const {
  preName,
  appName,
  prependList,
  appendList,
  normalData,
  mergeData,
  setupWatchers,
} = usePrefixSuffix({
  field: props.field,
  formData: formData as any,
});

// ============ APP 端分离逻辑 ============
const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  showFooter,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

/** 是否允许创建新值（allowCreate） */
const allowCreate = computed(() => !!props.field.preps?.allowCreate);

/** 临时关键字（用于抽屉内搜索） */
const tempKeyword = ref("");
/** 临时选中值：抽屉打开时拷贝，确认后写回 normalData */
const tempValue = ref<any>(undefined);
/** 当前建议列表 */
const suggestions = ref<any[]>([]);

/** 抽屉打开时初始化 */
watch(pickerVisible, async (val) => {
  if (val) {
    tempValue.value = normalData.value;
    tempKeyword.value = "";
    // 触发一次空查询，展示全部数据
    await fetchSuggestions("");
  }
});

/** 关键字变化时重新查询 */
watch(tempKeyword, (val) => {
  fetchSuggestions(val || "");
});

/** 获取建议数据 */
const fetchSuggestions = async (queryString: string) => {
  let temp = props.field.preps;
  let dataSource = temp["dataSource"];
  if (dataSource == "url") {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp["selectLabel"],
      value: queryString,
      operation: "lk",
    });
    const data = await dynamicUrlOperation(temp, searchParams);
    suggestions.value = data || [];
  } else {
    const allValues = temp["values"] || [];
    suggestions.value = queryString
      ? allValues.filter(createFilter(queryString))
      : allValues;
  }
};

/** 是否选中 */
const isSelected = (item: any) => {
  if (tempValue.value === undefined || tempValue.value === null) return false;
  const valueKey = props.field.preps?.props?.value || "value";
  return item[valueKey] === tempValue.value;
};

/** 选中某一项 */
const selectSuggestion = (item: any) => {
  const valueKey = props.field.preps?.props?.value || "value";
  tempValue.value = item[valueKey];
};

/** allowCreate：搜索关键字是否已存在于建议列表中 */
const isKeywordExists = computed(() => {
  if (!tempKeyword.value) return true;
  const kw = tempKeyword.value.toLowerCase();
  const valueKey = props.field.preps?.props?.value || "value";
  const labelKey = props.field.preps?.props?.label || "name";
  return suggestions.value.some((item: any) =>
    String(item[valueKey] ?? "").toLowerCase() === kw ||
    String(item[labelKey] ?? "").toLowerCase() === kw,
  );
});

/** allowCreate：是否显示"创建 xxx"行 */
const showCreateRow = computed(
  () => allowCreate.value && tempKeyword.value.trim() !== "" && !isKeywordExists.value,
);

/** allowCreate：创建新值并确认 */
const createCustomValue = () => {
  const val = tempKeyword.value.trim();
  if (!val) return;
  tempValue.value = val;
  handleConfirm();
};

/** 确认：写回 normalData 并触发联动 */
const handleConfirm = () => {
  normalData.value = tempValue.value;
  // 触发 change 联动事件
  itemAction("change");
  closePicker();
};

/** 取消：不写回 */
const handleCancel = () => {
  tempValue.value = undefined;
  tempKeyword.value = "";
  suggestions.value = [];
  closePicker();
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const handleContentConfirm = (newContent: string) => {
  normalData.value = newContent;
  dialogInputVisible.value = false;
};
const editContent = () => {
  if (
    !props.field.preps?.readonly &&
    !props.field.preps?.disabled &&
    !props.field.disabled
  ) {
    dialogInputVisible.value = true;
  }
};

/**
 * 动态获取数据
 */
const initData = async () => {
  const data = await compDynamicData(props.field);
  if (data?.length) {
    props.field.preps["values"] = data;
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
    mergeData(true);
  });
});
setupWatchers();

/** PC 端 fetch-suggestions 回调 */
const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  let temp = props.field.preps;
  let dataSource = temp["dataSource"];
  if (dataSource == "url") {
    let searchParams: SearchParams[] = [];
    searchParams.push({
      propertyName: temp["selectLabel"],
      value: queryString,
      operation: "lk",
    });
    temp["values"] = await dynamicUrlOperation(temp, searchParams);
    cb(temp["values"]);
  } else {
    const results = queryString
      ? temp["values"]?.filter(createFilter(queryString))
      : temp["values"];
    cb(results ?? []);
  }
};
</script>
<style lang="scss" scoped>
.sh-mobile-autocomplete {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  &__keyword {
    flex-shrink: 0;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__item {
    padding: 12px 14px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    cursor: pointer;
    transition: background-color 0.2s;

    &:active {
      background-color: var(--el-fill-color-light);
    }

    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }

  &__empty {
    padding: 24px;
    text-align: center;
    color: var(--el-text-color-secondary);
  }

  &__create {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 6px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;

    &:active {
      background: var(--el-color-primary-light-8);
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
