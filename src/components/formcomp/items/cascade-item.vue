<template>
  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <!-- PC 端：保持原逻辑 -->
    <el-cascader
        v-if="!isSeparate"
        :fid="field.fieldName"
        v-bind="prepsFilter(field.preps)"
        :options="field.preps?.options ?? areaData"
        :disabled="checkIsDisabled(props)"
        v-on="getDynamicEvents(props, itemAction, formData)"
        v-model="formData[field.fieldName]"
    />

    <!-- APP 端分离模式：只读输入框 + 抽屉内 el-cascader-panel -->
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
          :show-footer="false"
          @confirm="handleConfirm"
          @cancel="handleCancel"
      >
        <div class="cascade-mobile-panel">
          <!-- 搜索框 -->
          <div class="cascade-mobile-panel__search">
            <el-input
                v-model="searchKeyword"
                :placeholder="i18n('datapicker.enterKeywords')"
                clearable
                size="default"
            >
              <template #suffix>
                <star-horse-icon icon-class="search" />
              </template>
            </el-input>
          </div>

          <!-- 搜索结果列表 -->
          <div v-if="searchKeyword && searchResults.length > 0" class="cascade-mobile-panel__results">
            <div
                v-for="(item, idx) in searchResults"
                :key="idx"
                class="cascade-mobile-panel__result-item"
                @click="selectSearchResult(item)"
            >
              <span class="cascade-mobile-panel__result-path">{{ item.pathLabels.join(' / ') }}</span>
              <el-icon v-if="item.checked" class="cascade-mobile-panel__result-check"><Check /></el-icon>
            </div>
          </div>
          <div v-else-if="searchKeyword && searchResults.length === 0" class="cascade-mobile-panel__empty">
            {{ i18n('pivot.empty.noData') || '暂无数据' }}
          </div>

          <!-- 级联面板 -->
          <el-cascader-panel
              v-show="!searchKeyword"
              ref="cascaderPanelRef"
              :key="panelKey"
              v-bind="cascaderPanelProps"
              v-model="panelValue"
              :options="field.preps?.options ?? areaData"
          />
        </div>
      </ShMobilePicker>
    </template>
  </starhorse-form-item>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { Check } from "@element-plus/icons-vue";
import { compDynamicData } from "@/api/star_horse_utils";
import { getDynamicEvents } from "@/api/system";
import {
  allAction,
  checkIsDisabled,
  initCompCallEvent,
  prepsFilter,
} from "@/components/formcomp/utils/ItemRelationEventUtils";
import { ItemPreps } from "@/components/types/ItemPreps";
import { i18n } from "@/lang";
import { useMobilePicker } from "@/components/formcomp/utils/useMobilePicker";
import ShMobilePicker from "@/components/formcomp/utils/ShMobilePicker.vue";
defineOptions({
  name: "cascadeItem",
});
const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
const itemAction = (prep: any) => {
  allAction(props, emits, formData, prep);
};

const areaData = ref<any[]>([]);
const cascaderPanelRef = ref<InstanceType<any>>();
// 强制重建 panel 的 key，避免回显污染内部状态
const panelKey = ref(0);

// APP 端分离逻辑
const {
  isSeparate,
  pickerVisible,
  placement,
  size,
  title,
  openPicker,
  closePicker,
} = useMobilePicker(() => props.field);

// 面板选中值（与 el-cascader-panel 同步）
const panelValue = ref<any[]>([]);
// 缓存的 label 路径，用于显示
const cachedLabels = ref<string>("");

// ===== 搜索功能 =====
const searchKeyword = ref("");

// 字段名配置
const fieldConfig = computed(() => ({
  label: props.field.preps?.props?.label || props.field.preps?.displayName || "label",
  value: props.field.preps?.props?.value || props.field.preps?.displayValue || "value",
  children: props.field.preps?.props?.children || "children",
}));

interface FlatNode {
  pathValues: any[];
  pathLabels: string[];
  pathNodes: any[];
  checked: boolean;
}

// 扁平化 options 树，构建搜索索引（叶子节点）
const flatNodes = computed<FlatNode[]>(() => {
  const { label: lf, value: vf, children: cf } = fieldConfig.value;
  const options = props.field.preps?.options ?? areaData.value ?? [];
  const result: FlatNode[] = [];

  const walk = (nodes: any[], parentValues: any[], parentLabels: string[], parentNodes: any[]) => {
    if (!nodes || !nodes.length) return;
    for (const node of nodes) {
      const curValues = [...parentValues, node[vf]];
      const curLabels = [...parentLabels, node[lf]];
      const curNodes = [...parentNodes, node];
      const children = node[cf];
      if (children && children.length > 0) {
        walk(children, curValues, curLabels, curNodes);
      } else {
        // 叶子节点
        result.push({
          pathValues: curValues,
          pathLabels: curLabels,
          pathNodes: curNodes,
          checked: false,
        });
      }
    }
  };
  walk(options, [], [], []);
  return result;
});

// 搜索结果
const searchResults = computed<FlatNode[]>(() => {
  const kw = searchKeyword.value.trim().toLowerCase();
  if (!kw) return [];
  return flatNodes.value
    .filter((n) => {
      // 任意一级 label 命中即可
      return n.pathLabels.some((l) => String(l).toLowerCase().includes(kw));
    })
    .map((n) => ({
      ...n,
      checked:
        panelValue.value.length === n.pathValues.length &&
        n.pathValues.every((v, i) => panelValue.value[i] === v),
    }));
});

// 点击搜索结果：直接写入并关闭抽屉
function selectSearchResult(item: FlatNode) {
  panelValue.value = [...item.pathValues];
  cachedLabels.value = item.pathLabels.join(" / ");
  formData.value[props.field.fieldName] = [...item.pathValues];
  itemAction("change");
  searchKeyword.value = "";
  closePicker();
}

// 传递给 el-cascader-panel 的 props（排除非 panel 属性）
const cascaderPanelProps = computed(() => {
  const preps = prepsFilter(props.field.preps);
  // 只保留 el-cascader-panel 支持的属性
  const {
    options,
    placeholder,
    disabled,
    clearable,
    filterable,
    ...panelProps
  } = preps || {};
  return panelProps;
});

// 将任意路径（label 或 value 混合）规范化为 el-cascader-panel 期望的 value 路径
function normalizeToValuePath(savedVal: any[]): any[] {
  if (!savedVal.length) return [];
  const valueField =
      props.field.preps?.props?.value ||
      props.field.preps?.displayValue ||
      "value";
  const displayField =
      props.field.preps?.props?.label ||
      props.field.preps?.displayName ||
      "label";
  const childrenField = props.field.preps?.props?.children || "children";
  const options = props.field.preps?.options ?? areaData.value ?? [];

  // 先尝试按 value 匹配
  let currentLevel: any[] = options;
  const result: any[] = [];
  let allMatchedAsValue = true;
  for (const v of savedVal) {
    const byValue = currentLevel.find((n: any) => n[valueField] === v);
    if (byValue) {
      result.push(byValue[valueField]);
      currentLevel = byValue[childrenField] || [];
    } else {
      allMatchedAsValue = false;
      break;
    }
  }
  if (allMatchedAsValue && result.length === savedVal.length) {
    return result;
  }

  // 否则尝试按 label 匹配并转换为 value
  currentLevel = options;
  const labelResult: any[] = [];
  let allMatchedAsLabel = true;
  for (const v of savedVal) {
    const byLabel = currentLevel.find(
        (n: any) => n[displayField] === v || n[valueField] === v,
    );
    if (byLabel) {
      labelResult.push(byLabel[valueField]);
      currentLevel = byLabel[childrenField] || [];
    } else {
      allMatchedAsLabel = false;
      break;
    }
  }
  return allMatchedAsLabel ? labelResult : [];
}

// 显示文本：优先用缓存的 label，否则反查 options 树
const displayText = computed(() => {
  // 优先用确认时缓存的 label
  if (cachedLabels.value) return cachedLabels.value;

  const val = formData.value?.[props.field.fieldName];
  if (!val) return "";

  let paths: any[][] = [];
  if (Array.isArray(val)) {
    if (val.length > 0 && Array.isArray(val[0])) {
      paths = val as any[][];
    } else {
      paths = [val as any[]];
    }
  } else if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && Array.isArray(parsed[0])) {
          paths = parsed;
        } else {
          paths = [parsed];
        }
      } else {
        return String(val);
      }
    } catch {
      return val;
    }
  } else {
    return String(val);
  }

  const displayField =
      props.field.preps?.props?.label ||
      props.field.preps?.displayName ||
      "label";
  const valueField =
      props.field.preps?.props?.value ||
      props.field.preps?.displayValue ||
      "value";
  const childrenField = props.field.preps?.props?.children || "children";
  const options = props.field.preps?.options ?? areaData.value ?? [];

  const findLabels = (path: any[]): string[] => {
    const labels: string[] = [];
    let currentLevel: any[] = options;
    for (const v of path) {
      const found = currentLevel.find(
          (node: any) => node[valueField] === v || node[displayField] === v,
      );
      if (found) {
        labels.push(found[displayField]);
        currentLevel = found[childrenField] || [];
      } else {
        labels.push(String(v));
        break;
      }
    }
    return labels;
  };

  return paths
      .map((path) => findLabels(path).join(" / "))
      .join(", ");
});

// 确认：通过 ref 调用 getCheckedNodes() 直接获取选中的 value 和 label 路径
function handleConfirm() {
  const panel = cascaderPanelRef.value;
  let values: any[] = [];
  let labels: string[] = [];

  if (panel && typeof panel.getCheckedNodes === "function") {
    const nodes = panel.getCheckedNodes();
    if (nodes.length > 0) {
      const node = nodes[0];
      values = node.pathValues ? [...node.pathValues] : [];
      labels = node.pathLabels ? [...node.pathLabels] : [];
    }
  }

  // 兜底
  if (values.length === 0) {
    values = panelValue.value;
  }

  if (values.length > 0) {
    formData.value[props.field.fieldName] = [...values];
    // 缓存 label 用于显示
    cachedLabels.value = labels.length > 0 ? labels.join(" / ") : "";
    itemAction("change");
  }
  closePicker();
}

// 取消
function handleCancel() {
  closePicker();
}

// 打开时回显：规范化为 value 路径，并强制重建 panel
watch(pickerVisible, async (val) => {
  if (val) {
    searchKeyword.value = "";
    const savedVal = formData.value?.[props.field.fieldName];
    let arr: any[] = [];
    if (Array.isArray(savedVal)) {
      arr = savedVal;
    } else if (typeof savedVal === "string") {
      try {
        const parsed = JSON.parse(savedVal);
        if (Array.isArray(parsed)) arr = parsed;
      } catch {
        // ignore
      }
    }
    // 规范化为 value 路径
    panelValue.value = normalizeToValuePath(arr);
    // 强制重建 panel，确保初始选中状态正确
    panelKey.value++;
    await nextTick();
  }
});

// 初始化数据
const initData = async () => {
  if (!props.field.preps) {
    props.field.preps = {};
  }
  const optionsDatas = await compDynamicData(props.field);
  if (optionsDatas?.length) {
    props.field.preps["options"] = optionsDatas;
  }
  areaData.value = props.field.preps?.options || [];

  await nextTick();
  let data: any = formData.value[props.field.fieldName];
  if (data) {
    if (typeof data === "string") {
      try {
        formData.value[props.field.fieldName] = JSON.parse(data);
      } catch {
        // 保持原值
      }
    }
  } else {
    setTimeout(() => {
      let data: any = formData.value[props.field.fieldName];
      if (typeof data === "string") {
        try {
          formData.value[props.field.fieldName] = JSON.parse(data);
        } catch {
          // 保持原值
        }
      }
    }, 200);
  }
};

onMounted(() => {
  initData();
  initCompCallEvent(props, emits, formData);
});
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}

/* APP 端容器 */
.cascade-mobile-panel {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__search {
    flex-shrink: 0;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
  }

  &__results {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 14px;
    color: var(--el-text-color-regular, #606266);
    border-bottom: 1px solid var(--el-border-color-extra-light, #f5f5f5);
    cursor: pointer;
    transition: background 0.15s;

    &:active {
      background: var(--el-fill-color, #f0f2f5);
    }
  }

  &__result-path {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__result-check {
    color: var(--el-color-primary, #409eff);
    font-size: 16px;
    margin-left: 8px;
    flex-shrink: 0;
  }

  &__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--el-text-color-secondary, #909399);
    font-size: 14px;
  }
}

/* APP 端：el-cascader-panel 在抽屉内自适应，支持横向滚动多级 */
:deep(.el-cascader-panel) {
  width: 100%;
  flex: 1;
  border: none;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  .el-cascader-menu {
    flex: 0 0 auto;
    width: 120px;
    min-width: 120px;
    border-right: 1px solid var(--el-border-color-lighter, #ebeef5);

    &:last-child {
      border-right: none;
    }
  }

  .el-cascader-menu__wrap {
    height: 100%;
  }

  .el-cascader-node {
    padding: 0 12px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;

    .el-cascader-node__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
