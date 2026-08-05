<script setup lang="ts">
import {compKey} from "@/api/system";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import {ContainerPreps} from "@/components/types/ItemPreps";
import {ModelRef, computed, onMounted, ref, watch} from "vue";
import {getDataIndex, getFormData, getPrefix} from "@/api/form_utils";
import {i18n} from "@/lang";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  batchName: "batchDataList",
  batchFieldName: "batchFieldList",
  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");

/**
 * 列表添加行数据
 * @param row
 */
const addRow = (row: any) => {
  emits("addRow", row);
};
/**
 * 列表删除行数据
 * @param row
 */
const removeRow = (row: any) => {
  emits("removeRow", row);
};

// 当前激活步骤索引
const activeStepIndex = ref<number>(0);

// 步骤列表（运行时字段名 stepList，与设计时 preps.elements 对应）
const stepList = computed(() => props.item?.stepList || []);

// 是否同属一个表单
const sameForm = computed(() => {
  const val = props.item?.preps?.sameForm;
  return val === "Y" || val === undefined || val === null;
});

// 步骤风格：steps(头部步骤条) / pager(底部导航分页)
const stepStyle = computed(() => props.item?.preps?.stepStyle || "steps");

// 是否每步必须完成才能进入下一步
const mustCompleteStep = computed(() => props.item?.preps?.mustCompleteStep === "Y");

// 步骤条方向
const stepDirection = computed(() => props.item?.preps?.direction || "horizontal");

// 是否显示步骤条：pager 风格强制隐藏
const showStepBar = computed(() => {
  if (stepStyle.value === "pager") return false;
  return props.item?.preps?.showStepBar !== "N";
});

// 是否显示导航按钮
const showNavButtons = computed(() => props.item?.preps?.showNavButtons !== "N");

// 简洁模式
const stepSimple = computed(() => props.item?.preps?.simple === "Y");

// 完成状态
const finishStatus = computed(() => props.item?.preps?.finishStatus || "finish");

// 进行中状态
const processStatus = computed(() => props.item?.preps?.processStatus || "process");

// 居中对齐
const alignCenter = computed(() => props.item?.preps?.alignCenter === "Y");

// 步骤状态
type StepStatus = "finish" | "process" | "wait" | "error" | "success";
const getStepStatus = (idx: number): StepStatus => {
  if (idx === activeStepIndex.value) {
    return (processStatus.value as StepStatus) || "process";
  }
  if (idx < activeStepIndex.value) {
    return (finishStatus.value as StepStatus) || "finish";
  }
  return "wait";
};

// 容器类型集合（用于递归收集必填字段）
const containerTypeList: Array<string> = [
  "tab", "box", "table", "card", "dytable", "collapse", "splitter", "step", "condition",
];

// 递归收集必填字段
const collectRequiredFields = (items: any[], result: any[] = []): any[] => {
  if (!items || !items.length) return result;
  items.forEach((item: any) => {
    if (!item) return;
    if (containerTypeList.includes(item.itemType)) {
      if (item.itemType === "condition") {
        collectRequiredFields(item.items || item.preps?.items || [], result);
        const children = item.children || item.preps?.children || [];
        children.forEach((child: any) => collectRequiredFields([child], result));
      } else if (item.preps?.elements) {
        item.preps.elements.forEach((el: any) => {
          if (el.columns) {
            el.columns.forEach((col: any) => {
              collectRequiredFields(col.items || [], result);
            });
          }
          collectRequiredFields(el.items || [], result);
        });
      }
    } else if (item.compType === "formItem" || item.fieldName) {
      if (item.preps?.required === true && item.fieldName) {
        result.push({
          fieldName: item.fieldName,
          label: item.label || item.preps?.label || item.fieldName,
        });
      }
    }
  });
  return result;
};

const isEmptyValue = (val: any): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return val.trim() === "";
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
};

// 校验指定步骤
const validateStep = (stepIndex: number): { valid: boolean; missingFields: any[] } => {
  const step = stepList.value[stepIndex];
  if (!step) return {valid: true, missingFields: []};
  const requiredFields = collectRequiredFields(step.fieldList || step.items || []);
  const missing: any[] = [];
  requiredFields.forEach((f: any) => {
    const stepData = sameForm.value
      ? dataForm.value
      : dataForm.value?.[step.objectName];
    const val = stepData?.[f.fieldName];
    if (isEmptyValue(val)) {
      missing.push(f);
    }
  });
  return {valid: missing.length === 0, missingFields: missing};
};

const goPrev = () => {
  if (activeStepIndex.value > 0) {
    activeStepIndex.value--;
  }
};
const goNext = () => {
  if (activeStepIndex.value >= stepList.value.length - 1) return;
  if (mustCompleteStep.value) {
    const {valid, missingFields} = validateStep(activeStepIndex.value);
    if (!valid) {
      const names = missingFields.map((f: any) => f.label).join("、");
      console.warn("[stepItem] 当前步骤必填字段未完成:", names);
      return;
    }
  }
  activeStepIndex.value++;
};

const handleStepClick = (index: number) => {
  if (index === activeStepIndex.value) return;
  if (index > activeStepIndex.value && mustCompleteStep.value) {
    for (let i = activeStepIndex.value; i < index; i++) {
      const {valid} = validateStep(i);
      if (!valid) return;
    }
  }
  activeStepIndex.value = index;
};

// 初始化激活步骤
const init = () => {
  const activeName = props.item?.fieldName;
  if (activeName) {
    const idx = stepList.value.findIndex((s: any) => s.tabName === activeName);
    if (idx >= 0) activeStepIndex.value = idx;
  }
};
onMounted(() => {
  init();
});

// 同步 item.fieldName 为当前步骤 tabName
watch(activeStepIndex, (idx) => {
  const step = stepList.value[idx];
  if (step?.tabName) {
    props.item.fieldName = step.tabName;
  }
});
</script>

<template>
  <div v-if="stepList.length > 0" class="step-item-wrapper">
    <!-- 自定义专业步骤条 -->
    <div
        v-if="showStepBar"
        class="sh-step-bar"
        :class="[
          `sh-step-bar--${stepDirection}`,
          { 'sh-step-bar--simple': stepSimple, 'sh-step-bar--align-center': alignCenter }
        ]"
    >
      <div
          v-for="(stepItem, idx) in stepList"
          :key="compKey(stepItem, idx)"
          class="sh-step-item"
          :class="[`sh-step-item--${getStepStatus(Number(idx))}`]"
          @click="handleStepClick(Number(idx))"
      >
        <div class="sh-step-indicator">
          <div class="sh-step-circle">
            <span v-if="getStepStatus(Number(idx)) === 'finish' || getStepStatus(Number(idx)) === 'success'" class="sh-step-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span v-else-if="getStepStatus(Number(idx)) === 'error'" class="sh-step-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </span>
            <span v-else class="sh-step-number">{{ Number(idx) + 1 }}</span>
          </div>
          <span v-if="getStepStatus(Number(idx)) === 'process'" class="sh-step-pulse"></span>
        </div>
        <div class="sh-step-content">
          <span class="sh-step-title">{{ stepItem.title || stepItem.label }}</span>
          <span class="sh-step-index">{{ Number(idx) + 1 }} / {{ stepList.length }}</span>
        </div>
      </div>
    </div>

    <!-- 步骤内容区域 -->
    <div class="step-content-wrapper">
      <template v-for="(stepItem, idx) in stepList" :key="compKey(stepItem, idx)">
        <div v-show="Number(idx) === activeStepIndex" class="step-pane">
          <star-horse-form-item
              :source="source"
              :compUrl="compUrl"
              :compSize="compSize"
              :commonFormat="commonFormat"
              :dataForm="getFormData(stepItem, dataForm, propPrefix, dataIndex, idx)"
              :dataIndex="getDataIndex(stepItem, propPrefix, dataIndex, idx)"
              :propPrefix="getPrefix(stepItem, propPrefix, dataIndex, idx)"
              :objectName="stepItem.objectName"
              @addRow="addRow"
              @removeRow="removeRow"
              :fieldList="stepItem"
              :rules="rules"
              :subFormFlag="sameForm ? 'N' : 'Y'"
              :primaryKey="primaryKey"
          />
        </div>
      </template>
    </div>

    <!-- 导航按钮：首尾页隐藏对应按钮 -->
    <div v-if="showNavButtons" class="step-nav-bar">
      <el-button
          v-if="activeStepIndex > 0"
          size="default"
          @click="goPrev"
      >
        {{ i18n("dyform.step.prev") }}
      </el-button>
      <span class="step-indicator">{{ activeStepIndex + 1 }} / {{ stepList.length }}</span>
      <el-button
          v-if="activeStepIndex < stepList.length - 1"
          size="default"
          type="primary"
          @click="goNext"
      >
        {{ i18n("dyform.step.next") }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.step-item-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

// ==================== 自定义专业步骤条 ====================
.sh-step-bar {
  display: flex;
  width: 100%;
  padding: 16px 8px 8px;
  position: relative;

  // 横向布局
  &--horizontal {
    flex-direction: row;
    align-items: flex-start;
    .sh-step-item {
      flex: 1;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      &:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 17px;
        left: calc(50% + 22px);
        right: calc(-50% + 22px);
        height: 2px;
        background: #e4e7ed;
        transition: background 0.4s ease;
        z-index: 0;
      }
      &:not(:last-child).sh-step-item--finish::after,
      &:not(:last-child).sh-step-item--success::after {
        background: linear-gradient(90deg, #67c23a 0%, #95d475 100%);
      }
    }
  }

  // 纵向布局
  &--vertical {
    flex-direction: column;
    min-height: 200px;
    .sh-step-item {
      flex-direction: row;
      align-items: flex-start;
      min-height: 64px;
      padding: 0 0 24px 0;
      position: relative;
      cursor: pointer;
      &:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 36px;
        left: 17px;
        width: 2px;
        bottom: 4px;
        background: #e4e7ed;
        transition: background 0.4s ease;
        z-index: 0;
      }
      &:not(:last-child).sh-step-item--finish::after,
      &:not(:last-child).sh-step-item--success::after {
        background: linear-gradient(180deg, #67c23a 0%, #95d475 100%);
      }
      .sh-step-content {
        margin-left: 12px;
        padding-bottom: 4px;
        flex: 1;
      }
    }
  }

  // 简洁模式
  &--simple {
    padding: 6px 4px;
    .sh-step-item {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 16px;
      &::after { display: none !important; }
      .sh-step-indicator { width: auto; height: auto; }
      .sh-step-circle {
        width: 22px !important;
        height: 22px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
      }
      .sh-step-content { display: flex; align-items: center; gap: 6px; }
      .sh-step-index { font-size: 11px; }
      .sh-step-title { font-size: 13px; }
    }
  }

  &--align-center {
    .sh-step-item--horizontal .sh-step-content {
      align-items: center;
    }
  }
}

.sh-step-item {
  position: relative;
  display: flex;
  z-index: 1;
  transition: transform 0.2s ease;

  &:hover .sh-step-circle {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }

  .sh-step-indicator {
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    flex-shrink: 0;
  }

  .sh-step-circle {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    border: 2px solid #c0c4cc;
    background: #fff;
    color: #909399;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
  }

  .sh-step-number { line-height: 1; }
  .sh-step-icon { display: flex; align-items: center; justify-content: center; }

  .sh-step-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 8px;
    .sh-step-title {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      line-height: 1.4;
      transition: color 0.3s ease;
    }
    .sh-step-index {
      font-size: 11px;
      color: #c0c4cc;
      line-height: 1;
    }
  }

  &--wait {
    .sh-step-circle {
      border-color: #dcdfe6;
      background: #f9fafc;
      color: #a8abb2;
    }
    .sh-step-title { color: #a8abb2; }
  }

  &--process {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      color: #fff;
      box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.15);
    }
    .sh-step-title {
      color: #303133;
      font-weight: 600;
    }
    .sh-step-index { color: #409eff; }
  }

  &--finish {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
    }
    .sh-step-title { color: #606266; }
    .sh-step-index { color: #67c23a; }
  }

  &--success {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
    }
    .sh-step-title { color: #67c23a; }
    .sh-step-index { color: #67c23a; }
  }

  &--error {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
    }
    .sh-step-title { color: #f56c6c; }
    .sh-step-index { color: #f56c6c; }
  }
}

.sh-step-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid #409eff;
  animation: sh-step-pulse-anim 1.8s ease-out infinite;
  pointer-events: none;
}

@keyframes sh-step-pulse-anim {
  0% { transform: scale(1); opacity: 0.7; }
  70% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(1.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sh-step-pulse { animation: none; display: none; }
}

.step-content-wrapper {
  min-height: 80px;
  border: 1px dashed #d9ecff;
  border-radius: 6px;
  padding: 12px;
  background: #fafcff;
}

.step-pane {
  min-height: 60px;
}

.step-nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 16px;
  margin-top: 4px;
  border-top: 1px solid #ebeef5;
  background: linear-gradient(180deg, #fafcff 0%, #f5f7fa 100%);
  border-radius: 0 0 6px 6px;

  .step-indicator {
    font-size: 14px;
    color: #303133;
    font-weight: 600;
    min-width: 56px;
    text-align: center;
    padding: 4px 12px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  :deep(.el-button) {
    border-radius: 18px;
    padding: 8px 24px;
    transition: all 0.25s ease;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
    }
  }
}
</style>
