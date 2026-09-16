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
    <el-tree-select
      v-if="!isSeparate"
      :fid="field.fieldName"
      :disabled="checkIsDisabled(props)"
      :default-expand-all="true"
      v-bind="prepsFilter(field.preps)"
      :filter-node-method="filterNodeMethod"
      :placeholder="field.preps?.placeholder ?? ''"
      :render-content="renderContent"
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
              <el-button icon="cancel" @click="clear"
                >{{ i18n("form.cancel") }}
              </el-button>
            </div>
          </div>
        </template>
      </template>
    </el-tree-select>

    <!-- APP 端分离模式：只读输入框 + 抽屉内直接渲染树 -->
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
        v-if="isSeparate && pickerVisible"
        v-model="pickerVisible"
        :title="title"
        :placement="placement"
        :size="size"
        :show-footer="multiple"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <div class="sh-mobile-tree-panel">
          <!-- 搜索框（filterable / allowCreate 时显示） -->
          <el-input
            v-if="field.preps?.filterable || allowCreate"
            v-model="filterText"
            class="sh-mobile-tree-panel__search"
            :placeholder="i18n('starhorse.pleaseInput') || '搜索'"
            clearable
          >
            <template #prefix>
              <star-horse-icon icon-class="search" />
            </template>
          </el-input>

          <!-- 直接渲染树形列表 -->
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            :node-key="nodeKey"
            :show-checkbox="multiple"
            :default-expand-all="true"
            :default-checked-keys="multiple ? checkedKeys : undefined"
            :highlight-current="!multiple"
            :filter-node-method="filterNodeMethod"
            :expand-on-click-node="false"
            class="sh-mobile-tree-panel__tree"
            @node-click="handleNodeClick"
            @check="handleCheck"
          >
            <template #default="{ node, data }">
              <span class="sh-mobile-tree-panel__label">
                {{ renderNodeLabel(node, data) }}
              </span>
            </template>
          </el-tree>

          <div
            v-if="!treeData.length && !showTreeCreateRow"
            class="sh-mobile-tree-panel__empty"
          >
            {{ i18n("pivot.empty.noData") || "暂无数据" }}
          </div>
          <!-- allowCreate：创建新值 -->
          <div
            v-if="showTreeCreateRow"
            class="sh-mobile-tree-panel__create"
            @click="createTreeCustomValue"
          >
            <star-horse-icon icon-class="add" />
            <span>{{ i18n("form.add") }} "{{ filterText }}"</span>
          </div>
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { compDynamicData } from "@/api/star_horse_utils";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
  relationEventDispatcher,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { getDynamicEvents } from "@/api/system";
import { warning } from "@/utils/message";
import { i18n } from "@/lang";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
import { getOptionsOverride } from "@/components/formcomp/utils/ItemRuleEventUtils";

import { ItemPreps } from "@/components/types/ItemPreps";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["userAction", "selectItem"]);
const formData = defineModel("formData");
const checkAll = ref(false);
const indeterminate = ref(false);
const isAdding = ref(false);
const optionName = ref("");

const treeRef = ref();
const filterText = ref("");

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

const multiple = computed(() => !!props.field.preps?.multiple);
const allowCreate = computed(() => !!props.field.preps?.allowCreate);
const treeData = computed(() => {
  const formId =
    props.field.preps?.ruleEngineConfig?.formId || props.field.preps?.formId;
  if (formId) {
    const override = getOptionsOverride(formId, props.field.fieldName);
    if (override) return override;
  }
  return props.field.preps?.data || [];
});
const treeProps = computed(() => ({
  label: props.field.preps?.props?.label || "name",
  value: props.field.preps?.props?.value || "value",
  children: props.field.preps?.props?.children || "children",
}));
const nodeKey = computed(() => props.field.preps?.props?.value || "value");

const tempValue = ref<any>(multiple.value ? [] : undefined);
const checkedKeys = ref<any[]>([]);

/** 抽屉打开时初始化 */
watch(pickerVisible, async (val) => {
  if (val) {
    tempValue.value = multiple.value
      ? [...(formData.value?.[props.field.fieldName] || [])]
      : formData.value?.[props.field.fieldName];
    filterText.value = "";
    await nextTick();
    if (multiple.value && treeRef.value) {
      checkedKeys.value = Array.isArray(tempValue.value) ? tempValue.value : [];
      treeRef.value.setCheckedKeys(checkedKeys.value);
    } else if (!multiple.value && treeRef.value) {
      treeRef.value.setCurrentKey(tempValue.value);
    }
  }
});

/** 搜索过滤 */
watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

const filterNodeMethod = (value: any, data: any) => {
  if (!value) return true;
  let name: any = props.field.preps?.props?.label || "label";
  return String(data[name] ?? "").includes(value);
};

/** allowCreate：搜索关键字是否已存在于树中 */
const isKeywordExistsInTree = computed(() => {
  if (!filterText.value) return true;
  const kw = filterText.value.toLowerCase();
  const labelName = treeProps.value.label;
  const valueName = nodeKey.value;
  const check = (nodes: any[]): boolean => {
    for (const n of nodes) {
      if (
        String(n[labelName] ?? "").toLowerCase() === kw ||
        String(n[valueName] ?? "").toLowerCase() === kw
      )
        return true;
      if (
        n[treeProps.value.children]?.length &&
        check(n[treeProps.value.children])
      )
        return true;
    }
    return false;
  };
  return check(treeData.value);
});

/** allowCreate：是否显示"创建 xxx"行 */
const showTreeCreateRow = computed(
  () =>
    allowCreate.value &&
    filterText.value.trim() !== "" &&
    !isKeywordExistsInTree.value,
);

/** allowCreate：创建新值并加入选中 */
const createTreeCustomValue = () => {
  const val = filterText.value.trim();
  if (!val) return;
  if (multiple.value) {
    if (!Array.isArray(tempValue.value)) tempValue.value = [];
    if (!tempValue.value.includes(val)) tempValue.value.push(val);
    updateCheckAllState();
  } else {
    tempValue.value = val;
    handleConfirm();
  }
  filterText.value = "";
};

const renderNodeLabel = (node: any, data: any) => {
  let labelName = props.field.preps?.props?.label || "label";
  if (props.field.preps?.showCode) {
    let codeName =
      props.field.preps?.props?.code ||
      props.field.preps?.props?.value ||
      "value";
    return `${data[labelName]}(${data["code"] || data[codeName] || ""})`;
  }
  return data[labelName];
};

/** PC 端 el-tree-select 的 render-content 回调 */
const renderContent = (
  _h: Function,
  { node, data }: { node: any; data: any },
) => {
  return renderNodeLabel(node, data);
};

/** 单选：点击节点 */
const handleNodeClick = (data: any) => {
  if (multiple.value) return;
  tempValue.value = data[nodeKey.value];
  // 单选点选即确认
  handleConfirm();
};

/** 多选：勾选 */
const handleCheck = () => {
  if (!multiple.value) return;
  tempValue.value = treeRef.value?.getCheckedKeys() || [];
  updateCheckAllState();
};

const updateCheckAllState = () => {
  if (!multiple.value) return;
  const total = countLeafNodes(treeData.value);
  const selected = Array.isArray(tempValue.value) ? tempValue.value.length : 0;
  checkAll.value = total > 0 && selected === total;
  indeterminate.value = selected > 0 && selected < total;
};

const countLeafNodes = (nodes: any[]): number => {
  let count = 0;
  const childKey = treeProps.value.children;
  for (const n of nodes) {
    if (n[childKey]?.length) {
      count += countLeafNodes(n[childKey]);
    } else {
      count += 1;
    }
  }
  return count;
};

const handleCheckAll = (val: any) => {
  if (!multiple.value) return;
  if (val) {
    const collectValues = (nodes: any[]) => {
      let values: any[] = [];
      const key = nodeKey.value;
      const childKey = treeProps.value.children;
      nodes.forEach((node) => {
        values.push(node[key]);
        if (node[childKey]) {
          values = values.concat(collectValues(node[childKey]));
        }
      });
      return values;
    };
    tempValue.value = collectValues(treeData.value);
  } else {
    tempValue.value = [];
  }
  treeRef.value?.setCheckedKeys(tempValue.value);
  indeterminate.value = false;
};

/** 展示文本 */
const displayText = computed(() => {
  const val = formData.value?.[props.field.fieldName];
  if (val === undefined || val === null || val === "") return "";
  const data = treeData.value;
  const labelKey = treeProps.value.label;
  const valueKey = nodeKey.value;
  const childrenKey = treeProps.value.children;

  if (Array.isArray(val)) {
    return val
      .map((v) => findNodeLabel(v, data, labelKey, valueKey, childrenKey))
      .join(", ");
  }
  return findNodeLabel(val, data, labelKey, valueKey, childrenKey);
});

const findNodeLabel = (
  v: any,
  data: any[],
  labelKey: string,
  valueKey: string,
  childrenKey: string,
): string => {
  for (const node of data) {
    if (node[valueKey] === v) return String(node[labelKey] ?? v);
    if (node[childrenKey]?.length) {
      const found = findNodeLabel(
        v,
        node[childrenKey],
        labelKey,
        valueKey,
        childrenKey,
      );
      if (found !== String(v)) return found;
    }
  }
  return String(v);
};

const handleConfirm = () => {
  formData.value[props.field.fieldName] = tempValue.value;
  itemAction("change");
  // App 端抽屉化选择不经过 el-select 的 v-on(getDynamicEvents),
  // 需手动触发 dataRelation 联动(PC 端通过 getDynamicEvents 绑定的 change 事件触发)
  const dataRelation = props.field.preps?.dataRelation;
  if (dataRelation?.actionName) {
    relationEventDispatcher(
      props,
      dataRelation,
      tempValue.value,
      formData,
      dataRelation.actionName,
    );
  }
  closePicker();
};

const handleCancel = () => {
  tempValue.value = multiple.value ? [] : undefined;
  filterText.value = "";
  closePicker();
};

const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};
const onAddOption = () => {
  isAdding.value = true;
};
const onConfirm = () => {
  if (!optionName.value) {
    warning(i18n("form.enterOptionName"));
    return;
  }

  const labelName = props.field.preps?.props?.label || "label";
  const codeName =
    props.field.preps?.props?.code ||
    props.field.preps?.props?.value ||
    "value";
  if (
    props.field.preps.data.find(
      (item: any) => item[codeName] == optionName.value,
    )
  ) {
    warning(i18n("form.optionNameDuplicate"));
    return;
  }
  const temp = {};
  temp[labelName] = optionName.value;
  temp[codeName] = optionName.value;
  props.field.preps.data.push(temp);
  isAdding.value = false;
};
const clear = () => {
  optionName.value = "";
  isAdding.value = false;
};
const initData = async () => {
  const dataa = await compDynamicData(props.field);
  if (dataa?.length) {
    props.field.preps["data"] = dataa;
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
  props.field.preps["props"] = props.field.preps["props"] || {
    label: "name",
    value: "value",
  };
  initData();
  nextTick(() => {
    initCompCallEvent(props, emits, formData);
  });
});
</script>
<style lang="scss" scoped>
.sh-mobile-tree-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  &__search {
    flex-shrink: 0;
  }

  &__tree {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    :deep(.el-tree-node__content) {
      height: 40px;
    }
  }

  &__label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
