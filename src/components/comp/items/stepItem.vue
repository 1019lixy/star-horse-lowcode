<script setup lang="ts">
import { compKey } from "@/api/system";
import StarHorseFormItem from "@/components/comp/StarHorseFormItem.vue";
import { ContainerPreps } from "@/components/types/ItemPreps";
import { computed, inject, ModelRef, onMounted, ref, watch } from "vue";
import {
  collectFieldProps,
  getDataIndex,
  getFormData,
  getPrefix,
} from "@/api/form_utils";
import { i18n } from "@/lang";
import { warning } from "@/utils/message";

const props = withDefaults(defineProps<ContainerPreps>(), {
  // 数据索引
  dataIndex: -1,
  // 父节点名称
  propPrefix: "",
  parentPreps: {},
  subFormFlag: "N",
  subTableName: "subDataList",

  compSize: "default",
  source: 1,
});
const emits = defineEmits(["addRow", "removeRow"]);
const dataForm: ModelRef<any> = defineModel("dataForm");
// 注入 el-form 实例（由 StarHorseForm provide），用于调用 validateField / clearValidate
const starHorseFormRef = inject("starHorseFormRef", ref<any>(null));
// 注入表单信息（由 StarHorseForm provide），含流程上下文、分段流程配置等
const formInfo = inject("formInfo", ref<any>(null));

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
// 步骤校验状态：valid=通过(绿色打钩), invalid=失败(红色打叉), undefined=未校验
const stepValidationState = ref<Record<number, "valid" | "invalid">>({});
// 是否已完成所有步骤（最后一步通过校验后置为 true，用于显示全部完成）
const allStepsCompleted = ref<boolean>(false);

// 步骤列表(第三类容器统一字段 containerFields,与设计时 preps.elements 对应)
const stepList = computed(() => props.item?.containerFields || []);

// 是否同属一个表单：运行时由各步骤的 subFormFlag 决定（"Y"=分表单，"N"/缺省=同表单）
const sameForm = computed(() => {
  const steps = stepList.value;
  if (!steps.length) return true;
  return steps[0]?.subFormFlag !== "Y";
});

// 步骤风格：steps(头部步骤条) / pager(底部导航分页) / flat(平铺单页)
const stepStyle = computed(() => props.item?.preps?.stepStyle || "steps");
// 平铺单页模式：所有分段同页纵向展示
const flatMode = computed(() => stepStyle.value === "flat");

// 流程上下文：优先取容器自身 preps.flow，回退到 formInfo.flow（由后端注入）
const flow = computed(() => {
  const localFlow = props.item?.preps?.flow;
  if (localFlow?.enabled) return localFlow;
  const infoFlow = formInfo?.value?.flow;
  return infoFlow?.enabled ? infoFlow : null;
});

// 段级权限：editable 可编辑 / readonly 只读 / hidden 不渲染；无流程时按 source 降级（3=查看）
const segPermission = (key: string): "editable" | "readonly" | "hidden" => {
  if (flow.value?.segments?.[key]) return flow.value.segments[key];
  return props.source == 3 ? "readonly" : "editable";
};

// 段内组件渲染 source：只读段用查看模式(3)渲染，其余沿用当前 source
const segSource = (key: string): number =>
  flatMode.value && segPermission(key) === "readonly" ? 3 : props.source;

// 平铺状态文案：优先取 i18n，语言包未收录时回退默认文案
const flatText = (key: string, fallback: string): string => {
  const t = i18n(key);
  return t === key ? fallback : t;
};

// 平铺段折叠状态：显式操作记录在 map；未记录时默认已完成段折叠、其余展开
const flatCollapsed = ref<Record<string, boolean>>({});
const isFlatCollapsed = (step: any): boolean => {
  const key = step?.subTablePrimaryKey;
  if (key != null && key in flatCollapsed.value) {
    return !!flatCollapsed.value[key];
  }
  const st = flow.value?.nodeStates?.[key];
  return st?.status === "done";
};
const toggleFlatCollapse = (step: any) => {
  const key = step?.subTablePrimaryKey;
  if (key != null) flatCollapsed.value[key] = !isFlatCollapsed(step);
};

// 平铺段状态标签文案
const flatStatusText = (step: any): string => {
  const st = flow.value?.nodeStates?.[step?.subTablePrimaryKey];
  if (st?.status === "done") {
    return (
      flatText("dyform.step.flatFilled", "已填写") +
      (st.assignee?.name ? ` · ${st.assignee.name}` : "")
    );
  }
  if (st?.status === "active") {
    return flatText("dyform.step.flatCurrent", "待填写");
  }
  if (flow.value) return flatText("dyform.step.flatLocked", "未开始");
  return "";
};

// 平铺段状态标签样式类
const flatTagState = (step: any): string =>
  flow.value?.nodeStates?.[step?.subTablePrimaryKey]?.status || "";

// 平铺流转记录条节点（张三 → 李四(当前) → 待定）
const flowTrail = computed(() => {
  if (!flatMode.value || !flow.value?.nodeStates) return [];
  return Object.keys(flow.value.nodeStates).map((key) => {
    const step = stepList.value.find(
      (s: any) => s.subTablePrimaryKey === key,
    );
    return {
      key,
      label: step?.title || step?.label || key,
      status: flow.value.nodeStates[key]?.status,
      assignee: flow.value.nodeStates[key]?.assignee,
    };
  });
});
const trailAvatar = (node: any): string =>
  (node.assignee?.name || "?").charAt(0);

// 流程模式下初始定位到当前待办节点
watch(
  flow,
  (f) => {
    if (!f?.currentNode) return;
    const idx = stepList.value.findIndex(
      (s: any) => s.subTablePrimaryKey === f.currentNode,
    );
    if (idx >= 0) activeStepIndex.value = idx;
  },
  { immediate: true },
);
// 是否每步必须完成才能进入下一步（默认开启，设为 "N" 可关闭；source=3 查看模式自动关闭）
const mustCompleteStep = computed(() => {
  if (props.source == 3) return false;
  return !!props.item?.preps?.mustCompleteStep;
});

/**
 * 是否启用按需渲染(仅激活步骤才渲染子内容)
 * 默认启用,可通过 preps.lazy=false 回退为 v-show 全渲染行为
 * 启用后非激活步骤的字段组件不挂载,避免触发所有步骤的 actions/联动/规则事件
 */
const lazyRenderStep = computed(() => props.item?.preps?.lazy !== false);

/**
 * 已挂载过的步骤索引集合(仿 el-tabs lazy 的 loaded 标记机制)
 * 首次激活才挂载,之后保持挂载,避免反复切换重复触发子组件 onMounted 事件
 */
const loadedSteps = ref<Set<number>>(new Set());
const markStepLoaded = (idx: number) => {
  if (loadedSteps.value.has(idx)) return;
  const next = new Set(loadedSteps.value);
  next.add(idx);
  loadedSteps.value = next;
};

// 步骤条方向
const stepDirection = computed(
  () => props.item?.preps?.direction || "horizontal",
);

// 是否显示步骤条：pager/flat 风格强制隐藏
const showStepBar = computed(() => {
  if (stepStyle.value === "pager" || flatMode.value) return false;
  return props.item?.preps?.showStepBar !== "N";
});

// 是否显示导航按钮
const showNavButtons = computed(
  () => props.item?.preps?.showNavButtons !== "N",
);

// 平铺单页无上一步/下一步概念，隐藏导航栏
const showNavBar = computed(() => showNavButtons.value && !flatMode.value);

// 简洁模式
const stepSimple = computed(() => props.item?.preps?.simple === "Y");

/*// 完成状态
const finishStatus = computed(
  () => props.item?.preps?.finishStatus || "finish",
);

// 进行中状态
const processStatus = computed(
  () => props.item?.preps?.processStatus || "process",
);*/

// 居中对齐
const alignCenter = computed(() => props.item?.preps?.alignCenter === "Y");

// 步骤条间距（el-steps space 属性）
const stepSpace = computed(() => {
  const space = props.item?.preps?.space;
  if (space == null || space === "") return null;
  const num = Number(space);
  return isNaN(num) ? space : `${num}px`;
});

// 完成图标（el-steps finish-icon 属性）
const finishIcon = computed(() => props.item?.preps?.finishIcon || "");

// 步骤状态
type StepStatus = "finish" | "process" | "wait" | "error" | "success";
const getStepStatus = (idx: number): StepStatus => {
  if (stepValidationState.value[idx] === "invalid") return "error";
  if (allStepsCompleted.value || props.source == 3) return "finish";
  if (idx === activeStepIndex.value) return "process";
  if (idx < activeStepIndex.value) return "finish";
  return "wait";
};

// 校验指定步骤：调用 el-form 的 validateField 触发内联校验（红框 + 错误提示）
const validateStep = async (stepIndex: number): Promise<boolean> => {
  const step = stepList.value[stepIndex];
  if (!step) return true;
  const formRef = starHorseFormRef.value;
  if (!formRef?.validateField) return true;
  const stepPrefix = getPrefix(
    step,
    props.propPrefix,
    props.dataIndex,
    stepIndex,
  );
  const fieldProps = collectFieldProps(step.fieldList || [], stepPrefix);
  if (!fieldProps.length) return true;
  try {
    await formRef.validateField(fieldProps);
    return true;
  } catch {
    return false;
  }
};

// 清除指定步骤字段的校验状态（用于回退/切换时清除残留的红框）
const clearStepValidate = (stepIndex: number) => {
  const step = stepList.value[stepIndex];
  if (!step) return;
  const formRef = starHorseFormRef.value;
  if (!formRef?.clearValidate) return;
  const stepPrefix = getPrefix(
    step,
    props.propPrefix,
    props.dataIndex,
    stepIndex,
  );
  const fieldProps = collectFieldProps(step.fieldList || [], stepPrefix);
  if (fieldProps.length) formRef.clearValidate(fieldProps);
};

const goPrev = () => {
  if (activeStepIndex.value > 0) {
    clearStepValidate(activeStepIndex.value);
    delete stepValidationState.value[activeStepIndex.value];
    allStepsCompleted.value = false;
    activeStepIndex.value--;
  }
};
const goNext = async () => {
  if (activeStepIndex.value >= stepList.value.length - 1) {
    // 已是最后一步：校验通过则标记全部完成
    if (
      mustCompleteStep.value &&
      !(await validateStep(activeStepIndex.value))
    ) {
      stepValidationState.value[activeStepIndex.value] = "invalid";
      warning(i18n("dyform.step.stepIncomplete"));
      return;
    }
    stepValidationState.value[activeStepIndex.value] = "valid";
    allStepsCompleted.value = true;
    return;
  }
  if (mustCompleteStep.value && !(await validateStep(activeStepIndex.value))) {
    stepValidationState.value[activeStepIndex.value] = "invalid";
    warning(i18n("dyform.step.stepIncomplete"));
    return;
  }
  stepValidationState.value[activeStepIndex.value] = "valid";
  activeStepIndex.value++;
};

const handleStepClick = async (index: number) => {
  if (index === activeStepIndex.value) return;
  if (index > activeStepIndex.value && mustCompleteStep.value) {
    for (let i = activeStepIndex.value; i < index; i++) {
      if (!(await validateStep(i))) {
        stepValidationState.value[i] = "invalid";
        warning(i18n("dyform.step.stepIncomplete"));
        activeStepIndex.value = i;
        return;
      }
      stepValidationState.value[i] = "valid";
    }
  }
  clearStepValidate(index);
  delete stepValidationState.value[index];
  allStepsCompleted.value = false;
  activeStepIndex.value = index;
};

// 初始化激活步骤
const init = () => {
  const activeName = props.item?.fieldName;
  if (activeName) {
    const idx = stepList.value.findIndex(
      (s: any) => s.subTablePrimaryKey === activeName,
    );
    if (idx >= 0) activeStepIndex.value = idx;
  }
};
onMounted(() => {
  init();
  markStepLoaded(activeStepIndex.value);
});

// 同步 item.fieldName 为当前步骤 subTablePrimaryKey，并写入 __currentStepKey 供后端触发分段流程
watch(activeStepIndex, (idx) => {
  markStepLoaded(idx);
  if (stepValidationState.value[idx] === "invalid") {
    delete stepValidationState.value[idx];
  }
  const step = stepList.value[idx];
  if (step?.subTablePrimaryKey) {
    props.item.fieldName = step.subTablePrimaryKey;
    if (dataForm.value && typeof dataForm.value === "object") {
      dataForm.value.__currentStepKey = step.subTablePrimaryKey;
    }
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
        {
          'sh-step-bar--simple': stepSimple,
          'sh-step-bar--align-center': alignCenter,
        },
      ]"
      :style="stepSpace != null ? { gap: stepSpace } : {}"
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
            <span
              v-if="
                getStepStatus(Number(idx)) === 'finish' ||
                getStepStatus(Number(idx)) === 'success'
              "
              class="sh-step-icon"
            >
              <star-horse-icon
                v-if="finishIcon"
                :icon-class="finishIcon"
                size="20px"
              />
              <svg
                v-else
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span
              v-else-if="getStepStatus(Number(idx)) === 'error'"
              class="sh-step-icon"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            <span v-else class="sh-step-number">{{ Number(idx) + 1 }}</span>
          </div>
          <span
            v-if="getStepStatus(Number(idx)) === 'process'"
            class="sh-step-pulse"
          ></span>
        </div>
        <div class="sh-step-content">
          <span class="sh-step-title">{{
            stepItem.title || stepItem.label
          }}</span>
          <span class="sh-step-index"
            >{{ Number(idx) + 1 }} / {{ stepList.length }}</span
          >
        </div>
      </div>
    </div>

    <!-- 平铺单页模式：流转记录条（有流程上下文时显示） -->
    <div v-if="flatMode && flowTrail.length" class="flat-flow-trail">
      <template v-for="(node, nIdx) in flowTrail" :key="node.key">
        <svg
          v-if="nIdx > 0"
          class="trail-arrow"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        <span class="trail-node" :class="`is-${node.status || 'pending'}`">
          <span class="trail-avatar">{{ trailAvatar(node) }}</span>
          <span class="trail-info">
            <span class="trail-label">{{ node.label }}</span>
            <span class="trail-name">{{
              node.assignee?.name ||
                flatText("dyform.step.flatLocked", "未开始")
            }}</span>
          </span>
        </span>
      </template>
    </div>

    <!-- 步骤内容区域：steps/pager 单段切换；flat 全部已到段平铺 -->
    <div class="step-content-wrapper" :class="{ 'is-flat': flatMode }">
      <template
        v-for="(stepItem, idx) in stepList"
        :key="compKey(stepItem, idx)"
      >
        <!-- flat 段标题栏（hidden 段不渲染标题） -->
        <div
          v-if="
            flatMode &&
            segPermission(stepItem.subTablePrimaryKey) !== 'hidden'
          "
          class="flat-section-head"
          @click="toggleFlatCollapse(stepItem)"
        >
          <svg
            class="flat-caret"
            :class="{ 'is-collapsed': isFlatCollapsed(stepItem) }"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span class="flat-section-title">{{
            stepItem.title || stepItem.label
          }}</span>
          <span
            v-if="flatStatusText(stepItem)"
            class="flat-section-tag"
            :class="`is-${flatTagState(stepItem)}`"
            >{{ flatStatusText(stepItem) }}</span
          >
        </div>

        <!-- 段内容：flat 按权限+折叠控制，hidden 段不渲染（防数据泄露） -->
        <div
          v-if="
            !flatMode
              ? !lazyRenderStep || loadedSteps.has(Number(idx))
              : segPermission(stepItem.subTablePrimaryKey) !== 'hidden'
          "
          v-show="
            !flatMode
              ? !lazyRenderStep || Number(idx) === activeStepIndex
              : !isFlatCollapsed(stepItem)
          "
          class="step-pane"
          :class="
            flatMode
              ? [
                  'flat-section',
                  `flat-${segPermission(stepItem.subTablePrimaryKey)}`,
                ]
              : []
          "
        >
          <star-horse-form-item
            :source="segSource(stepItem.subTablePrimaryKey)"
            :compUrl="compUrl"
            :compSize="compSize"
            :commonFormat="commonFormat"
            :dataForm="
              getFormData(stepItem, dataForm, propPrefix, dataIndex, idx)
            "
            :dataIndex="getDataIndex(stepItem, propPrefix, dataIndex, idx)"
            :propPrefix="getPrefix(stepItem, propPrefix, dataIndex, idx)"
            :subTableName="stepItem.subTableName"
            @addRow="addRow"
            @removeRow="removeRow"
            :fieldList="stepItem"
            :rules="rules"
            :subFormFlag="sameForm ? 'N' : 'Y'"
            :primaryKey="primaryKey"
          />
        </div>

        <!-- flat 未开始段：仅锁定占位，不渲染任何字段 -->
        <div
          v-if="
            flatMode &&
            segPermission(stepItem.subTablePrimaryKey) === 'hidden'
          "
          class="flat-locked"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span
            >{{ stepItem.title || stepItem.label }}（{{
              flatText("dyform.step.flatLocked", "未开始")
            }}）</span
          >
        </div>
      </template>
    </div>

    <!-- 导航按钮：首尾页隐藏对应按钮（flat 模式无导航） -->
    <div v-if="showNavBar" class="step-nav-bar">
      <el-button v-if="activeStepIndex > 0" size="default" @click="goPrev">
        {{ i18n("dyform.step.prev") }}
      </el-button>
      <span class="step-indicator"
        >{{ activeStepIndex + 1 }} / {{ stepList.length }}</span
      >
      <el-button
        v-if="activeStepIndex < stepList.length - 1"
        size="default"
        type="primary"
        @click="goNext"
      >
        {{ i18n("dyform.step.next") }}
      </el-button>
      <el-button
        v-if="activeStepIndex === stepList.length - 1"
        size="default"
        type="success"
        @click="goNext"
      >
        {{ i18n("dyform.step.complete") }}
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

      &::after {
        display: none !important;
      }

      .sh-step-indicator {
        width: auto;
        height: auto;
      }

      .sh-step-circle {
        width: 22px !important;
        height: 22px !important;
        border-radius: 6px !important;
        font-size: 11px !important;
      }

      .sh-step-content {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .sh-step-index {
        font-size: 11px;
      }

      .sh-step-title {
        font-size: 13px;
      }
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

  .sh-step-number {
    line-height: 1;
  }

  .sh-step-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

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

    .sh-step-title {
      color: #a8abb2;
    }
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

    .sh-step-index {
      color: #409eff;
    }
  }

  &--finish {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
    }

    .sh-step-title {
      color: #606266;
    }

    .sh-step-index {
      color: #67c23a;
    }
  }

  &--success {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
    }

    .sh-step-title {
      color: #67c23a;
    }

    .sh-step-index {
      color: #67c23a;
    }
  }

  &--error {
    .sh-step-circle {
      border-color: transparent;
      background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
    }

    .sh-step-title {
      color: #f56c6c;
    }

    .sh-step-index {
      color: #f56c6c;
    }
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
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sh-step-pulse {
    animation: none;
    display: none;
  }
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

// ==================== 平铺单页（flat）模式 ====================
// 流转记录条：张三 → 李四(当前) → 待定
.flat-flow-trail {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  background: #fafcff;
  border: 1px solid #ebeef5;
  border-radius: 6px;

  .trail-arrow {
    color: #c0c4cc;
    flex-shrink: 0;
  }

  .trail-node {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 4px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #e4e7ed;
    transition: all 0.25s ease;

    .trail-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      background: #f4f4f5;
      color: #909399;
      flex-shrink: 0;
    }

    .trail-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;

      .trail-label {
        font-size: 12px;
        font-weight: 600;
        color: #606266;
      }

      .trail-name {
        font-size: 11px;
        color: #a8abb2;
      }
    }

    // 当前节点高亮
    &.is-active {
      border-color: #409eff;
      background: #ecf5ff;

      .trail-avatar {
        background: #409eff;
        color: #fff;
      }

      .trail-name {
        color: #409eff;
      }
    }

    // 已完成节点
    &.is-done {
      .trail-avatar {
        background: #f0f9eb;
        color: #67c23a;
      }
    }
  }
}

// flat 模式内容区：去掉内边距约束，改为分段卡片纵列
.step-content-wrapper.is-flat {
  padding: 0;
  background: transparent;
  border-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

// 段标题栏
.flat-section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: #ecf5ff;
  }

  .flat-caret {
    color: #909399;
    transition: transform 0.2s ease;
    flex-shrink: 0;

    &.is-collapsed {
      transform: rotate(-90deg);
    }
  }

  .flat-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .flat-section-tag {
    margin-left: auto;
    font-size: 12px;
    padding: 1px 10px;
    border-radius: 10px;
    white-space: nowrap;
    background: #f4f4f5;
    color: #909399;

    &.is-done {
      background: #f0f9eb;
      color: #67c23a;
    }

    &.is-active {
      background: #ecf5ff;
      color: #409eff;
    }

    &.is-pending {
      background: #f4f4f5;
      color: #c0c4cc;
    }
  }
}

// flat 段内容：与标题栏拼接成卡片
.step-pane.flat-section {
  border-radius: 0 0 6px 6px;

  // 当前可编辑段：左侧高亮边
  &.flat-editable {
    box-shadow: inset 3px 0 0 0 #409eff;
  }

  // 只读段：整体弱化
  &.flat-readonly {
    background: #fafafa;
  }
}

// flat 未开始段锁定占位
.flat-locked {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px dashed #e4e7ed;
  border-radius: 6px;
  font-size: 13px;
  color: #a8abb2;
  background: #fafafa;
}
</style>
