<script setup lang="ts" name="CardContainerDemo">
import { nextTick, onMounted, provide, reactive, ref } from "vue";
import { dialogPreps } from "@/api/star_horse_utils";
import type { PageFieldInfo } from "@/components/types";
import { StarHorseForm, StarHorseDialog } from "@/components/comp";

/**
 * 验证场景：通过 module 的 dataRelation 策略(controlTarget=container)
 * 控制 cardList 容器中各 card 的显隐
 * 切换下拉框,仅对应 card 可见(其余隐藏),非 disabled
 * 不依赖后端,纯前端渲染验证
 */

const moduleOptions = [
  { name: "销售", value: "sales" },
  { name: "库存", value: "inventory" },
  { name: "财务", value: "finance" },
  { name: "人事", value: "hr" },
];
const regionOptions = [
  { name: "华东", value: "east" },
  { name: "华南", value: "south" },
  { name: "华北", value: "north" },
  { name: "西部", value: "west" },
];
const warehouseOptions = [
  { name: "中心仓", value: "central" },
  { name: "区域仓", value: "regional" },
];
const currencyOptions = [
  { name: "人民币 CNY", value: "CNY" },
  { name: "美元 USD", value: "USD" },
  { name: "欧元 EUR", value: "EUR" },
];
const periodOptions = [
  { name: "月度", value: "monthly" },
  { name: "季度", value: "quarterly" },
  { name: "年度", value: "yearly" },
];
const deptOptions = [
  { name: "技术部", value: "tech" },
  { name: "销售部", value: "sales" },
  { name: "人事部", value: "hr" },
  { name: "财务部", value: "finance" },
];
const reviewCycleOptions = [
  { name: "月度考核", value: "monthly" },
  { name: "季度考核", value: "quarterly" },
  { name: "年度考核", value: "yearly" },
];
const forecastModelOptions = [
  { name: "线性回归", value: "linear" },
  { name: "移动平均", value: "moving_avg" },
  { name: "ARIMA", value: "arima" },
];

/**
 * 构造 module 的 dataRelation 容器控制配置
 * relationFields 为各 card 的 tabName,匹配后 eqVisible
 */
const buildModuleContainerRelation = () => {
  const types = ["sales", "inventory", "finance", "hr"];
  return {
    actionName: "change",
    relationDetails: types.map((t) => ({
      matchType: "eq",
      controlCondition: "eqVisible",
      controlTarget: "container" as const,
      relationFields: [t],
      matchFieldValue: [t],
    })),
  };
};

const container = reactive<any>({
  fieldName: "moduleCards",
  label: "报表模块配置",
  type: "cardList",
  formVisible: true,
  listVisible: false,
  cardList: [
    // ========== sales 销售 ==========
    {
      title: "销售报表",
      tabName: "sales",
      objectName: "salesConfig",
      formVisible: true,
      fieldList: [
        {
          label: "销售区域", fieldName: "region", type: "select", required: true,
          formVisible: true, defaultValue: "east",
          preps: { values: regionOptions },
        },
        { label: "销售目标", fieldName: "target", type: "number", formVisible: true, defaultValue: 100000 },
        {
          label: "启用预测", fieldName: "enableForecast", type: "switch",
          formVisible: true, defaultValue: "N",
          preps: {
            activeValue: "Y", inactiveValue: "N", activeText: "是", inactiveText: "否",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                { matchType: "eq", controlCondition: "eqVisible", relationFields: ["forecastModel"], matchFieldValue: ["Y"] },
              ],
            },
          },
        },
        {
          label: "预测模型", fieldName: "forecastModel", type: "select",
          formVisible: false, defaultValue: "linear",
          preps: { values: forecastModelOptions },
        },
      ],
    },
    // ========== inventory 库存 ==========
    {
      title: "库存报表",
      tabName: "inventory",
      objectName: "inventoryConfig",
      formVisible: false,
      fieldList: [
        {
          label: "仓库类型", fieldName: "warehouse", type: "select", required: true,
          formVisible: true, defaultValue: "central",
          preps: { values: warehouseOptions },
        },
        { label: "最低库存", fieldName: "minStock", type: "number", formVisible: true, defaultValue: 100 },
        {
          label: "库存预警", fieldName: "enableAlert", type: "switch",
          formVisible: true, defaultValue: "N",
          preps: {
            activeValue: "Y", inactiveValue: "N", activeText: "是", inactiveText: "否",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                { matchType: "eq", controlCondition: "eqVisible", relationFields: ["alertThreshold"], matchFieldValue: ["Y"] },
              ],
            },
          },
        },
        { label: "预警阈值", fieldName: "alertThreshold", type: "number", formVisible: false, defaultValue: 50 },
      ],
    },
    // ========== finance 财务 ==========
    {
      title: "财务报表",
      tabName: "finance",
      objectName: "financeConfig",
      formVisible: false,
      fieldList: [
        {
          label: "币种", fieldName: "currency", type: "select", required: true,
          formVisible: true, defaultValue: "CNY",
          preps: { values: currencyOptions },
        },
        {
          label: "统计周期", fieldName: "period", type: "select",
          formVisible: true, defaultValue: "monthly",
          preps: { values: periodOptions },
        },
        {
          label: "启用预算", fieldName: "enableBudget", type: "switch",
          formVisible: true, defaultValue: "N",
          preps: {
            activeValue: "Y", inactiveValue: "N", activeText: "是", inactiveText: "否",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                { matchType: "eq", controlCondition: "eqVisible", relationFields: ["budgetAmount"], matchFieldValue: ["Y"] },
              ],
            },
          },
        },
        { label: "预算金额", fieldName: "budgetAmount", type: "number", formVisible: false, defaultValue: 500000 },
      ],
    },
    // ========== hr 人事 ==========
    {
      title: "人事报表",
      tabName: "hr",
      objectName: "hrConfig",
      formVisible: false,
      fieldList: [
        {
          label: "部门", fieldName: "dept", type: "select", required: true,
          formVisible: true, defaultValue: "tech",
          preps: { values: deptOptions },
        },
        { label: "编制人数", fieldName: "headcount", type: "number", formVisible: true, defaultValue: 50 },
        {
          label: "启用考核", fieldName: "enableReview", type: "switch",
          formVisible: true, defaultValue: "N",
          preps: {
            activeValue: "Y", inactiveValue: "N", activeText: "是", inactiveText: "否",
            dataRelation: {
              actionName: "change",
              relationDetails: [
                { matchType: "eq", controlCondition: "eqVisible", relationFields: ["reviewCycle"], matchFieldValue: ["Y"] },
              ],
            },
          },
        },
        {
          label: "考核周期", fieldName: "reviewCycle", type: "select",
          formVisible: false, defaultValue: "quarterly",
          preps: { values: reviewCycleOptions },
        },
      ],
    },
  ],
});

const tableFieldList = reactive<PageFieldInfo | any>({
  fieldList: [
    { label: "主键", fieldName: "id", formVisible: false },
    {
      label: "报表模块", fieldName: "module", type: "select", required: true,
      formVisible: true, listVisible: true, defaultValue: "sales",
      preps: {
        values: moduleOptions,
        // 通过 dataRelation 容器控制策略,声明式控制 cardList 中各 card 的显隐
        dataRelation: buildModuleContainerRelation(),
      },
    },
    container,
  ],
});

const rules = {
  module: [{ required: true, message: "请选择报表模块", trigger: "change" }],
};

const dialogProps = dialogPreps("报表模块配置");
provide("dialogProps", dialogProps);

// 直接打开编辑弹窗,验证表单渲染
const editVisible = ref(true);
const syncEditVisible = (val: boolean) => {
  editVisible.value = val;
};

const formRef = ref();
/**
 * 表单初始化完成后,调用 resetForm 应用默认值(如 module=sales)
 * 触发 dataRelation 一次性 watch,根据默认值控制初始 card 显隐
 */
const onFormInited = () => {
  nextTick(() => {
    formRef.value?.resetForm?.();
  });
};

onMounted(() => {});
</script>

<template>
  <div class="flex flex-col h-full overflow-auto p-4">
    <el-alert
      title="验证说明"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
    >
      <template #default>
        切换「报表模块」下拉框,下方卡片应同步只显示对应模块(其余隐藏,而非 disabled)。
        这是通过 module 的 dataRelation 配置 controlTarget="container" 实现的声明式 cardList 容器控制。
        每个 card 内部还有字段级联动(如启用预测→显示预测模型)。
      </template>
    </el-alert>
    <star-horse-dialog
      v-model="editVisible"
      :isShowBtnContinue="true"
      title="卡片容器控制验证"
      @update:dialogVisible="syncEditVisible"
    >
      <star-horse-form
        ref="formRef"
        :fieldList="tableFieldList"
        :rules="rules"
        @inited="onFormInited"
      />
    </star-horse-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
