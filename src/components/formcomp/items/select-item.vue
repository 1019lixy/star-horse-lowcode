<template>
  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <!-- PC 端：完全保持原逻辑 -->
    <el-select
      v-if="!isSeparate"
      :fid="field.fieldName"
      :remote="remote"
      :disabled="checkIsDisabled(props)"
      v-bind="prepsFilter(field.preps)"
      :show-arrow="true"
      :remote-method="remoteMethod"
      v-on="getDynamicEvents(props, itemAction, formData)"
      v-model="formData[field.fieldName]"
    >
      <template v-if="field.preps?.multiple" #header>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          @change="handleCheckAll"
        >
          {{ i18n("common.selectAll") }}
        </el-checkbox>
      </template>
      <template
        v-for="item in field.preps?.values"
        :key="item[field.preps?.props?.value ?? 'value']"
      >
        <el-option
          :disabled="item['disabled']"
          :label="item[field.preps?.props?.label ?? 'name']"
          :value="item[field.preps?.props?.value ?? 'value']"
        />
      </template>
      <template v-if="field.preps?.showFooter" #footer>
        <el-button v-if="!isAdding" text bg @click="onAddOption">
          {{ i18n("form.addComponentOption") }}
        </el-button>
        <template v-else>
          <div class="flex-row flex w-full justify-between">
            <el-input
              v-model="optionName"
              class="option-input flex-1"
              :placeholder="i18n('form.enterOptionName')"
            />
            <div class="flex-row flex justify-center w-[35%] mx-auto my-0">
              <el-button type="primary" icon="add" @click="onConfirm">
                {{ i18n("form.add") }}
              </el-button>
              <el-button icon="cancel" @click="clear">
                {{ i18n("form.cancel") }}
              </el-button>
            </div>
          </div>
        </template>
      </template>
    </el-select>

    <!-- APP 端分离模式：只读输入框 + 抽屉式原生列表 -->
    <template v-else>
      <el-input
        :model-value="displayText"
        :placeholder="field.preps?.placeholder"
        :disabled="checkIsDisabled(props)"
        readonly
        @click="openPicker"
      >
        <template #suffix>
          <star-horse-icon icon-class="arrow-down" />
        </template>
      </el-input>

      <ShMobilePicker
        v-model="pickerVisible"
        :title="title"
        :placement="placement"
        :size="size"
        :show-footer="multiple"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <div class="sh-mobile-select-list">
          <!-- 搜索框 -->
          <el-input
            v-if="field.preps?.filterable || remote"
            v-model="searchKey"
            class="sh-mobile-select-list__search"
            :placeholder="i18n('starhorse.pleaseInput') || '搜索'"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <star-horse-icon icon-class="search" />
            </template>
          </el-input>

          <!-- 全选（多选时） -->
          <div v-if="multiple" class="sh-mobile-select-list__all">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="indeterminate"
              @change="handleCheckAll"
            >
              {{ i18n("common.selectAll") }}
            </el-checkbox>
          </div>

          <!-- 选项列表 -->
          <div class="sh-mobile-select-list__options">
            <div
              v-for="item in filteredOptions"
              :key="item[valueKey]"
              class="sh-mobile-select-list__item"
              :class="{ 'is-selected': isSelected(item) }"
              @click="toggleOption(item)"
            >
              <el-checkbox v-if="multiple" :model-value="isSelected(item)" @click.stop />
              <span class="sh-mobile-select-list__label">{{ item[labelKey] }}</span>
              <star-horse-icon
                v-if="!multiple && isSelected(item)"
                icon-class="check"
                class="sh-mobile-select-list__check"
              />
            </div>
            <div v-if="!filteredOptions.length" class="sh-mobile-select-list__empty">
              {{ i18n("pivot.empty.noData") || "暂无数据" }}
            </div>
          </div>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import {
  compDynamicData,
  createFilter,
  dynamicUrlOperation,
} from "@/api/star_horse_utils";
import { getDynamicEvents } from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { SearchParams } from "@/components/types/Params";
import { warning } from "@/utils/message";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { i18n } from "@/lang";
import {
  useMobilePicker,
} from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const checkAll = ref(false);
const indeterminate = ref(false);
const isAdding = ref(false);
const optionName = ref("");
const remote = computed(() => {
  let temp = props.field.preps?.remote;
  if (typeof temp == "string") {
    return ["true", "yes", "t"].includes(temp.toLowerCase());
  }
  return false;
});

// ============ APP 端分离逻辑 ============
const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

/** 是否多选 */
const multiple = computed(() => !!props.field.preps?.multiple);

/** label / value 字段名 */
const labelKey = computed(() => props.field.preps?.props?.label || "name");
const valueKey = computed(() => props.field.preps?.props?.value || "value");

/** 临时选中值：抽屉打开时拷贝，确认后才写回 formData */
const tempValue = ref<any>(multiple.value ? [] : undefined);

/** 搜索关键字 */
const searchKey = ref("");
/** 当前展示的选项列表（搜索 / 远程加载后更新） */
const displayOptions = ref<any[]>([]);

/** 抽屉打开时初始化 */
watch(pickerVisible, async (val) => {
  if (val) {
    tempValue.value = multiple.value
      ? [...(formData.value?.[props.field.fieldName] || [])]
      : formData.value?.[props.field.fieldName];
    searchKey.value = "";
    displayOptions.value = props.field.preps?.values || [];
    updateCheckAllState();
  }
});

/** 过滤后的选项 */
const filteredOptions = computed(() => {
  if (!searchKey.value) return displayOptions.value;
  return displayOptions.value.filter((item: any) =>
    String(item[labelKey.value] ?? "")
      .toLowerCase()
      .includes(searchKey.value.toLowerCase()),
  );
});

/** 是否选中 */
const isSelected = (item: any) => {
  const val = item[valueKey.value];
  if (multiple.value) {
    return Array.isArray(tempValue.value) && tempValue.value.includes(val);
  }
  return tempValue.value === val;
};

/** 切换选中：单选点选即确认，多选切换 */
const toggleOption = (item: any) => {
  const val = item[valueKey.value];
  if (multiple.value) {
    if (!Array.isArray(tempValue.value)) tempValue.value = [];
    const idx = tempValue.value.indexOf(val);
    if (idx >= 0) {
      tempValue.value.splice(idx, 1);
    } else {
      tempValue.value.push(val);
    }
    updateCheckAllState();
  } else {
    // 单选：点选即选中并确认
    tempValue.value = val;
    handleConfirm();
  }
};

/** 更新全选状态 */
const updateCheckAllState = () => {
  if (!multiple.value) return;
  const total = displayOptions.value.length;
  const selected = Array.isArray(tempValue.value) ? tempValue.value.length : 0;
  checkAll.value = total > 0 && selected === total;
  indeterminate.value = selected > 0 && selected < total;
};

/** 全选 / 取消全选 */
const handleCheckAll = (val: any) => {
  if (val) {
    tempValue.value = displayOptions.value.map((it: any) => it[valueKey.value]);
  } else {
    tempValue.value = [];
  }
  indeterminate.value = false;
};

/** 搜索处理：远程则调用 remoteMethod，本地则直接过滤 */
const handleSearch = async (queryString: string) => {
  if (remote.value) {
    await remoteMethod(queryString);
    displayOptions.value = props.field.preps?.values || [];
  }
};

/** 展示文本 */
const displayText = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") return "";
  const values = props.field.preps?.values || [];
  if (Array.isArray(val)) {
    return val
      .map((v) => {
        const item = values.find((it: any) => it[valueKey.value] === v);
        return item ? item[labelKey.value] : v;
      })
      .join(", ");
  }
  const item = values.find((it: any) => it[valueKey.value] === val);
  return item ? item[labelKey.value] : String(val);
});

/** 确认：写回 formData 并触发联动 */
const handleConfirm = () => {
  formData.value[props.field.fieldName] = tempValue.value;
  itemAction("change");
  closePicker();
};

const handleCancel = () => {
  tempValue.value = multiple.value ? [] : undefined;
  searchKey.value = "";
  closePicker();
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["values"] = dataa;
  }
};
const onAddOption = () => {
  isAdding.value = true;
};
const onConfirm = () => {
  if (!optionName.value) {
    warning(i18n("form.enterOptionName"));
    return;
  }
  if (props.field.preps.values.find((_) => _.value == optionName.value)) {
    warning(i18n("form.optionNameDuplicate"));
    return;
  }
  props.field.preps?.values.push({
    name: optionName.value,
    value: optionName.value,
  });
  isAdding.value = false;
};
const clear = () => {
  optionName.value = "";
  isAdding.value = false;
};
const remoteMethod = async (queryString: string) => {
  if (!remote.value) return;
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
  } else {
    temp["values"] = queryString
      ? temp["values"]?.filter(createFilter(queryString))
      : temp["values"];
  }
};
onMounted(() => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  props.field.preps["remote"] =
    props.field.preps["remote"] || props.field.preps["dataSource"] == "url";
  props.field.preps["filterable"] = true;
  props.field.preps["collapseTags"] = true;
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
