/**
 * 规则引擎 Demo 的 flow content 示例
 *
 * 可导入 dynamicform 的规则引擎设计器查看/编辑
 * 每个导出对应一个规则的 flow content（nodes + edges）
 */

// ==================== 动作工具 ====================
const act = {
  setValue: (field, value) => ({
    actionType: "SET_VALUE",
    targetField: field,
    actionValue: String(value),
    valueType: "CONSTANT",
  }),
  clearValue: (field) => ({ actionType: "CLEAR_VALUE", targetField: field }),
  show: (field) => ({ actionType: "SHOW_FIELD", targetField: field }),
  hide: (field) => ({ actionType: "HIDE_FIELD", targetField: field }),
  enable: (field) => ({ actionType: "SET_ENABLED", targetField: field }),
  disable: (field) => ({ actionType: "SET_DISABLED", targetField: field }),
  required: (field) => ({ actionType: "SET_REQUIRED", targetField: field }),
  optional: (field) => ({ actionType: "SET_OPTIONAL", targetField: field }),
  readonly: (field) => ({ actionType: "SET_READONLY", targetField: field }),
  editable: (field) => ({ actionType: "SET_EDITABLE", targetField: field }),
};

// ==================== flow 构建工具 ====================
let seq = 0;
const nid = (p = "n") => `${p}_${++seq}`;

function condFlow(fieldName, operator, value, trueActions, falseActions) {
  seq = 0;
  const s = nid("start"),
    c = nid("cond"),
    t = nid("act_t"),
    f = nid("act_f"),
    e = nid("end");
  return {
    nodes: [
      { id: s, type: "start", data: {} },
      {
        id: c,
        type: "condition",
        data: { conditions: [{ fieldName, operator, value }], logic: "AND" },
      },
      { id: t, type: "action", data: { actions: trueActions } },
      { id: f, type: "action", data: { actions: falseActions } },
      { id: e, type: "end", data: {} },
    ],
    edges: [
      { source: s, target: c },
      { source: c, target: t, label: "是" },
      { source: c, target: f, label: "否" },
      { source: t, target: e },
      { source: f, target: e },
    ],
  };
}

function actionFlow(actions) {
  seq = 0;
  const s = nid("start"),
    a = nid("act"),
    e = nid("end");
  return {
    nodes: [
      { id: s, type: "start", data: {} },
      { id: a, type: "action", data: { actions } },
      { id: e, type: "end", data: {} },
    ],
    edges: [
      { source: s, target: a },
      { source: a, target: e },
    ],
  };
}

function condOnlyFlow(fieldName, operator, value, trueActions) {
  seq = 0;
  const s = nid("start"),
    c = nid("cond"),
    t = nid("act_t"),
    e = nid("end");
  return {
    nodes: [
      { id: s, type: "start", data: {} },
      {
        id: c,
        type: "condition",
        data: { conditions: [{ fieldName, operator, value }], logic: "AND" },
      },
      { id: t, type: "action", data: { actions: trueActions } },
      { id: e, type: "end", data: {} },
    ],
    edges: [
      { source: s, target: c },
      { source: c, target: t, label: "是" },
      { source: c, target: e, label: "否" },
      { source: t, target: e },
    ],
  };
}

// ==================== ON_LOAD 规则 ====================

/** 根据客户类型设置字段显隐和必填 */
export const onLoadCustomerType = condFlow(
  "customerType",
  "EQ",
  "personal",
  [
    act.hide("companyName"),
    act.show("idCard"),
    act.required("idCard"),
    act.optional("companyName"),
  ],
  [
    act.show("companyName"),
    act.hide("idCard"),
    act.required("companyName"),
    act.optional("idCard"),
  ],
);

/** 根据 VIP 状态设置折扣率 */
export const onLoadVipDiscount = condFlow(
  "isVip",
  "EQ",
  "true",
  [act.enable("discount"), act.setValue("discount", "0.8")],
  [act.disable("discount"), act.setValue("discount", "1")],
);

/** 备注默认可编辑 */
export const onLoadRemark = actionFlow([act.editable("remark")]);

/** ON_LOAD 加载城市下拉数据（autoLoad=true，表单加载时自动调接口） */
export const onLoadCitySearch = (() => {
  seq = 0;
  const s = nid("start"),
    http = nid("http"),
    e = nid("end");
  return {
    nodes: [
      { id: s, type: "start", data: {} },
      {
        id: http,
        type: "http-call",
        data: {
          url: "/userdb-manage/userdb/ruleEngine/demoCitySearch",
          method: "POST",
          body: { keyword: "${keyword}", currentValue: "${citySelect}" },
          responseVar: "__options_citySelect",
          autoLoad: true,
        },
      },
      { id: e, type: "end", data: {} },
    ],
    edges: [
      { source: s, target: http },
      { source: http, target: e },
    ],
  };
})();

// ==================== ON_CHANGE 规则 ====================

/** 客户类型变更 → 字段显隐和必填 */
export const onChangeCustomerType = condFlow(
  "customerType",
  "EQ",
  "personal",
  [
    act.hide("companyName"),
    act.show("idCard"),
    act.required("idCard"),
    act.optional("companyName"),
  ],
  [
    act.show("companyName"),
    act.hide("idCard"),
    act.required("companyName"),
    act.optional("idCard"),
  ],
);

/** VIP 变更 → 折扣率 */
export const onChangeVipDiscount = condFlow(
  "isVip",
  "EQ",
  "true",
  [act.enable("discount"), act.setValue("discount", "0.8")],
  [act.disable("discount"), act.setValue("discount", "1")],
);

/** 企业客户 → 备注只读 */
export const onChangeRemarkReadonly = condFlow(
  "customerType",
  "EQ",
  "enterprise",
  [act.readonly("remark")],
  [act.editable("remark")],
);

/** keyword 变更时重新查询城市下拉数据（仅 keyword 触发，不含 citySelect） */
export const onChangeCitySearch = (() => {
  seq = 0;
  const s = nid("start"),
    cond = nid("cond"),
    http = nid("http"),
    e = nid("end");
  return {
    nodes: [
      { id: s, type: "start", data: {} },
      {
        id: cond,
        type: "condition",
        data: {
          conditions: [
            { fieldName: "__triggerField", operator: "IN", value: "keyword" },
          ],
          logic: "AND",
        },
      },
      {
        id: http,
        type: "http-call",
        data: {
          url: "/userdb-manage/userdb/ruleEngine/demoCitySearch",
          method: "POST",
          body: {
            keyword: "${keyword}",
            currentValue: "${citySelect}",
          },
          responseVar: "__options_citySelect",
        },
      },
      { id: e, type: "end", data: {} },
    ],
    edges: [
      { source: s, target: cond },
      { source: cond, target: http, label: "是" },
      { source: cond, target: e, label: "否" },
      { source: http, target: e },
    ],
  };
})();

// ==================== ON_BUTTON_CLICK 规则 ====================

/** 提交审批按钮 */
export const onSubmitBtn = condOnlyFlow("__buttonKey", "EQ", "submitBtn", [
  act.readonly("remark"),
  act.setValue("auditResult", "已提交审批"),
  act.setValue("auditStatus", "pending"),
]);

/** 重置按钮 */
export const onResetBtn = condOnlyFlow("__buttonKey", "EQ", "resetBtn", [
  act.clearValue("auditResult"),
  act.clearValue("auditStatus"),
  act.editable("remark"),
]);

// ==================== 全部导出 ====================
export const allFlows = {
  onLoadCustomerType,
  onLoadVipDiscount,
  onLoadRemark,
  onLoadCitySearch,
  onChangeCustomerType,
  onChangeVipDiscount,
  onChangeRemarkReadonly,
  onChangeCitySearch,
  onSubmitBtn,
  onResetBtn,
};
