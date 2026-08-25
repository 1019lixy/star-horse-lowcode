/**
 * 规则引擎 Demo 规则定义提交脚本
 *
 * 用法: node scripts/submit-demo-rules.mjs [baseUrl]
 * 默认 baseUrl: http://localhost:7758/
 *
 * 提交内容：
 * - 7 个规则定义（含 flow content）
 * - 3 个规则集（ON_LOAD / ON_CHANGE / ON_BUTTON_CLICK）
 * - 7 个规则集项（关联规则到规则集）
 */

const BASE_URL = process.argv[2] || "http://localhost:7758/userdb-manage";
const FORM_ID = "demo_rule_form_001";

// ==================== UUID 生成 ====================
const uuid = () => crypto.randomUUID();

// ==================== flow content 构建工具 ====================
let nodeSeq = 0;
const nid = (prefix = "n") => `${prefix}_${++nodeSeq}`;

function buildConditionFlow(fieldName, operator, value, trueActions, falseActions) {
  nodeSeq = 0;
  const start = nid("start");
  const cond = nid("cond");
  const trueAction = nid("act_t");
  const falseAction = nid("act_f");
  const end = nid("end");

  const nodes = [
    { id: start, type: "start", data: {} },
    { id: cond, type: "condition", data: { conditions: [{ fieldName, operator, value }], logic: "AND" } },
    { id: trueAction, type: "action", data: { actions: trueActions } },
    { id: falseAction, type: "action", data: { actions: falseActions } },
    { id: end, type: "end", data: {} },
  ];

  const edges = [
    { source: start, target: cond },
    { source: cond, target: trueAction, label: "是" },
    { source: cond, target: falseAction, label: "否" },
    { source: trueAction, target: end },
    { source: falseAction, target: end },
  ];

  return JSON.stringify({ nodes, edges });
}

function buildActionFlow(actions) {
  nodeSeq = 0;
  const start = nid("start");
  const act = nid("act");
  const end = nid("end");

  const nodes = [
    { id: start, type: "start", data: {} },
    { id: act, type: "action", data: { actions } },
    { id: end, type: "end", data: {} },
  ];

  const edges = [
    { source: start, target: act },
    { source: act, target: end },
  ];

  return JSON.stringify({ nodes, edges });
}

function buildConditionOnlyFlow(fieldName, operator, value, trueActions) {
  nodeSeq = 0;
  const start = nid("start");
  const cond = nid("cond");
  const trueAction = nid("act_t");
  const end = nid("end");

  const nodes = [
    { id: start, type: "start", data: {} },
    { id: cond, type: "condition", data: { conditions: [{ fieldName, operator, value }], logic: "AND" } },
    { id: trueAction, type: "action", data: { actions: trueActions } },
    { id: end, type: "end", data: {} },
  ];

  const edges = [
    { source: start, target: cond },
    { source: cond, target: trueAction, label: "是" },
    { source: cond, target: end, label: "否" },
    { source: trueAction, target: end },
  ];

  return JSON.stringify({ nodes, edges });
}

function buildHttpCallFlow(url, method, body, responseVar, triggerFields, autoLoad) {
  nodeSeq = 0;
  const start = nid("start");
  const end = nid("end");
  const httpData = { url, method, body, responseVar };
  if (autoLoad !== undefined) httpData.autoLoad = autoLoad;

  if (triggerFields) {
    const cond = nid("cond");
    const http = nid("http");
    return JSON.stringify({
      nodes: [
        { id: start, type: "start", data: {} },
        { id: cond, type: "condition", data: { conditions: [{ fieldName: "__triggerField", operator: "IN", value: triggerFields }], logic: "AND" } },
        { id: http, type: "http-call", data: httpData },
        { id: end, type: "end", data: {} },
      ],
      edges: [
        { source: start, target: cond },
        { source: cond, target: http, label: "是" },
        { source: cond, target: end, label: "否" },
        { source: http, target: end },
      ],
    });
  }

  const http = nid("http");
  return JSON.stringify({
    nodes: [
      { id: start, type: "start", data: {} },
      { id: http, type: "http-call", data: httpData },
      { id: end, type: "end", data: {} },
    ],
    edges: [
      { source: start, target: http },
      { source: http, target: end },
    ],
  });
}

// ==================== 动作构建工具 ====================
const act = {
  setValue: (field, value) => ({ actionType: "SET_VALUE", targetField: field, actionValue: String(value), valueType: "CONSTANT" }),
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

// ==================== 规则定义 ====================
const ruleDefs = [
  // --- ON_LOAD 规则 ---
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONLOAD_CUSTOMER_TYPE",
    ruleName: "初始化-客户类型字段显隐",
    ruleDesc: "根据客户类型设置企业名称/身份证号显隐和必填",
    ruleType: "FORM_LINKAGE",
    priority: 100,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionFlow(
      "customerType", "EQ", "personal",
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
    ),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONLOAD_VIP_DISCOUNT",
    ruleName: "初始化-VIP折扣率",
    ruleDesc: "根据VIP状态设置折扣率禁用和值",
    ruleType: "FORM_LINKAGE",
    priority: 90,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionFlow(
      "isVip", "EQ", "true",
      [
        act.enable("discount"),
        act.setValue("discount", "0.8"),
      ],
      [
        act.disable("discount"),
        act.setValue("discount", "1"),
      ],
    ),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONLOAD_REMARK",
    ruleName: "初始化-备注可编辑",
    ruleDesc: "加载时备注默认可编辑",
    ruleType: "FORM_LINKAGE",
    priority: 80,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildActionFlow([act.editable("remark")]),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONLOAD_CITY_SEARCH",
    ruleName: "初始化-城市下拉数据加载",
    ruleDesc: "表单加载时自动调接口加载城市选项（autoLoad=true）",
    ruleType: "FORM_LINKAGE",
    priority: 70,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildHttpCallFlow(
      "/userdb-manage/userdb/ruleEngine/demoCitySearch",
      "POST",
      { keyword: "${keyword}", currentValue: "${citySelect}" },
      "__options_citySelect",
      null,
      true,
    ),
  },

  // --- ON_CHANGE 规则 ---
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONCHANGE_CUSTOMER_TYPE",
    ruleName: "变更-客户类型字段显隐",
    ruleDesc: "客户类型变更时设置企业名称/身份证号显隐和必填",
    ruleType: "FORM_LINKAGE",
    priority: 100,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionFlow(
      "customerType", "EQ", "personal",
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
    ),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONCHANGE_VIP_DISCOUNT",
    ruleName: "变更-VIP折扣率",
    ruleDesc: "VIP状态变更时设置折扣率禁用和值",
    ruleType: "FORM_LINKAGE",
    priority: 90,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionFlow(
      "isVip", "EQ", "true",
      [
        act.enable("discount"),
        act.setValue("discount", "0.8"),
      ],
      [
        act.disable("discount"),
        act.setValue("discount", "1"),
      ],
    ),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONCHANGE_REMARK_READONLY",
    ruleName: "变更-企业客户备注只读",
    ruleDesc: "客户类型为企业时备注只读，个人时可编辑",
    ruleType: "FORM_LINKAGE",
    priority: 80,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionFlow(
      "customerType", "EQ", "enterprise",
      [act.readonly("remark")],
      [act.editable("remark")],
    ),
  },

  // --- ON_BUTTON_CLICK 规则 ---
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_BTN_SUBMIT",
    ruleName: "按钮-提交审批",
    ruleDesc: "提交审批按钮：设置审批结果/状态，备注只读",
    ruleType: "FORM_LINKAGE",
    priority: 100,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionOnlyFlow(
      "__buttonKey", "EQ", "submitBtn",
      [
        act.readonly("remark"),
        act.setValue("auditResult", "已提交审批"),
        act.setValue("auditStatus", "pending"),
      ],
    ),
  },
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_BTN_RESET",
    ruleName: "按钮-重置",
    ruleDesc: "重置按钮：清空审批结果/状态，备注可编辑",
    ruleType: "FORM_LINKAGE",
    priority: 90,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildConditionOnlyFlow(
      "__buttonKey", "EQ", "resetBtn",
      [
        act.clearValue("auditResult"),
        act.clearValue("auditStatus"),
        act.editable("remark"),
      ],
    ),
  },

  // --- ON_CHANGE http-call 规则 ---
  {
    idRuleDefinition: uuid(),
    ruleCode: "DEMO_ONCHANGE_CITY_SEARCH",
    ruleName: "变更-关键词搜索城市",
    ruleDesc: "keyword 变更时调后端接口重新加载城市选项",
    ruleType: "FORM_LINKAGE",
    priority: 70,
    enabled: "Y",
    status: "PUBLISHED",
    formId: FORM_ID,
    flowContent: buildHttpCallFlow(
      "/userdb-manage/userdb/ruleEngine/demoCitySearch",
      "POST",
      { keyword: "${keyword}", currentValue: "${citySelect}" },
      "__options_citySelect",
      "keyword",
    ),
  },
];

// ==================== 规则集 ====================
const ruleSets = [
  {
    idRuleSet: uuid(),
    setCode: "DEMO_RS_ON_LOAD",
    setName: "Demo-加载规则集",
    setDesc: "表单加载时初始化字段状态",
    setType: "FORM_LINKAGE",
    executionMode: "SEQUENTIAL",
    enabled: "Y",
    priority: 100,
    formId: FORM_ID,
    triggerEvent: "ON_LOAD",
    status: "PUBLISHED",
  },
  {
    idRuleSet: uuid(),
    setCode: "DEMO_RS_ON_CHANGE",
    setName: "Demo-变更规则集",
    setDesc: "字段变更时动态控制字段状态",
    setType: "FORM_LINKAGE",
    executionMode: "SEQUENTIAL",
    enabled: "Y",
    priority: 90,
    formId: FORM_ID,
    triggerEvent: "ON_CHANGE",
    status: "PUBLISHED",
  },
  {
    idRuleSet: uuid(),
    setCode: "DEMO_RS_ON_BUTTON_CLICK",
    setName: "Demo-按钮点击规则集",
    setDesc: "按钮点击时执行业务逻辑",
    setType: "FORM_LINKAGE",
    executionMode: "SEQUENTIAL",
    enabled: "Y",
    priority: 80,
    formId: FORM_ID,
    triggerEvent: "ON_BUTTON_CLICK",
    status: "PUBLISHED",
  },
];

// ==================== 规则集项 ====================
const ruleSetItems = [
  // ON_LOAD → 规则 0,1,2,3
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[0].idRuleSet, idRuleDefinition: ruleDefs[0].idRuleDefinition, itemIndex: 1, enabled: "Y", priority: 100 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[0].idRuleSet, idRuleDefinition: ruleDefs[1].idRuleDefinition, itemIndex: 2, enabled: "Y", priority: 90 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[0].idRuleSet, idRuleDefinition: ruleDefs[2].idRuleDefinition, itemIndex: 3, enabled: "Y", priority: 80 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[0].idRuleSet, idRuleDefinition: ruleDefs[3].idRuleDefinition, itemIndex: 4, enabled: "Y", priority: 70 },
  // ON_CHANGE → 规则 4,5,6,9
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[1].idRuleSet, idRuleDefinition: ruleDefs[4].idRuleDefinition, itemIndex: 1, enabled: "Y", priority: 100 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[1].idRuleSet, idRuleDefinition: ruleDefs[5].idRuleDefinition, itemIndex: 2, enabled: "Y", priority: 90 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[1].idRuleSet, idRuleDefinition: ruleDefs[6].idRuleDefinition, itemIndex: 3, enabled: "Y", priority: 80 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[1].idRuleSet, idRuleDefinition: ruleDefs[9].idRuleDefinition, itemIndex: 4, enabled: "Y", priority: 70 },
  // ON_BUTTON_CLICK → 规则 7,8
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[2].idRuleSet, idRuleDefinition: ruleDefs[7].idRuleDefinition, itemIndex: 1, enabled: "Y", priority: 100 },
  { idRuleSetItem: uuid(), idRuleSet: ruleSets[2].idRuleSet, idRuleDefinition: ruleDefs[8].idRuleDefinition, itemIndex: 2, enabled: "Y", priority: 90 },
];

// ==================== API 提交 ====================
async function postJson(path, body) {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token":"baff1d8378c7409697c865bb4c509d49",
    },
    body: JSON.stringify(body),
  });
  const text = await resp.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: resp.status, ok: resp.ok, data: json };
}

async function submitAll() {
  console.log(`\n========================================`);
  console.log(`  规则引擎 Demo 规则提交脚本`);
  console.log(`  后端地址: ${BASE_URL}`);
  console.log(`  表单ID:   ${FORM_ID}`);
  console.log(`========================================\n`);

  // 1. 提交规则定义
  console.log("--- 提交规则定义 ---");
  for (const rule of ruleDefs) {
    const res = await postJson("/userdb/ruleDefinition/merge", rule);
    const ok = res.ok && res.data?.code === 200;
    console.log(`  ${ok ? "OK" : "FAIL"} ${rule.ruleCode} (${rule.ruleName})`);
    if (!ok) console.log(`       响应:`, JSON.stringify(res.data).slice(0, 200));
  }

  // 2. 提交规则集
  console.log("\n--- 提交规则集 ---");
  for (const rs of ruleSets) {
    const res = await postJson("/userdb/ruleSet/merge", rs);
    const ok = res.ok && res.data?.code === 200;
    console.log(`  ${ok ? "OK" : "FAIL"} ${rs.setCode} (${rs.setName}) trigger=${rs.triggerEvent}`);
    if (!ok) console.log(`       响应:`, JSON.stringify(res.data).slice(0, 200));
  }

  // 3. 提交规则集项
  console.log("\n--- 提交规则集项 ---");
  for (const rsi of ruleSetItems) {
    const res = await postJson("/userdb/ruleSetItem/merge", rsi);
    const ok = res.ok && res.data?.code === 200;
    console.log(`  ${ok ? "OK" : "FAIL"} itemIndex=${rsi.itemIndex} ruleSet=${rsi.idRuleSet.slice(0, 8)}... rule=${rsi.idRuleDefinition.slice(0, 8)}...`);
    if (!ok) console.log(`       响应:`, JSON.stringify(res.data).slice(0, 200));
  }

  // 4. 验证：执行 ON_LOAD
  console.log("\n--- 验证: 执行 ON_LOAD ---");
  const verifyRes = await postJson("/userdb-manage/userdb/ruleEngine/executeByForm", {
    formId: FORM_ID,
    triggerEvent: "ON_LOAD",
    context: { customerType: "personal", isVip: false },
  });
  console.log("  响应:", JSON.stringify(verifyRes.data, null, 2).slice(0, 500));

  // 5. 验证：执行 ON_CHANGE (customerType=enterprise)
  console.log("\n--- 验证: 执行 ON_CHANGE (customerType=enterprise) ---");
  const verifyRes2 = await postJson("/userdb-manage/userdb/ruleEngine/executeByForm", {
    formId: FORM_ID,
    triggerEvent: "ON_CHANGE",
    context: { customerType: "enterprise", isVip: false, discount: 1 },
  });
  console.log("  响应:", JSON.stringify(verifyRes2.data, null, 2).slice(0, 500));

  // 6. 验证：执行 ON_BUTTON_CLICK (submitBtn)
  console.log("\n--- 验证: 执行 ON_BUTTON_CLICK (submitBtn) ---");
  const verifyRes3 = await postJson("/userdb-manage/userdb/ruleEngine/executeByForm", {
    formId: FORM_ID,
    triggerEvent: "ON_BUTTON_CLICK",
    context: { customerType: "personal", isVip: false, discount: 1, __buttonKey: "submitBtn" },
  });
  console.log("  响应:", JSON.stringify(verifyRes3.data, null, 2).slice(0, 500));

  console.log("\n========================================");
  console.log("  提交完成！");
  console.log("========================================\n");
}

submitAll().catch((err) => {
  console.error("提交失败:", err);
  process.exit(1);
});
