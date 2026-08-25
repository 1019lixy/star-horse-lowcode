# 规则引擎

组件库内置**前端本地执行的规则引擎**：规则以可视化流程（flowContent JSON）形式从后端拉取并缓存到浏览器内存，字段变更 / 按钮点击时本地零网络开销执行，实现对表单字段的显隐、必填、禁用、赋值、选项覆盖等控制。

## 架构总览

```
┌─────────────────────────── 业务应用层 ───────────────────────────┐
│  configureRuleEngine({ fetchRulesHandler, httpCallHandler })     │
│  （业务层实现接口调用，核心库不写死任何接口地址）                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ 注入
┌──────────────────────────────▼───────────────────────────────────┐
│                     核心库（star-horse-lowcode）                   │
│                                                                    │
│  ON_LOAD 表单挂载          ON_CHANGE 字段变更       ON_BUTTON_CLICK │
│      │ initRuleEvent          │ ruleEventDispatcher    │ ruleButtonAction
│      ▼                        ▼ (300ms 防抖)           ▼              │
│  fetchAndCacheRules ──► ruleCache（内存缓存，按 formId）           │
│                               │                                    │
│                               ▼                                    │
│                    RuleFlowExecutor.executeFlows                   │
│                    （本地执行 flowContent 流程）                    │
│                    http-call 节点 ──► httpCallHandler              │
│                               │                                    │
│                               ▼ delta                              │
│                    parseRuleEngineActions（解析控制指令）           │
│                               ▼                                    │
│                applyRuleEngineActionsToFields                      │
│                ├─ formVisible / required / disabled / readonly     │
│                ├─ formData[field] 赋值                             │
│                └─ optionsOverrideStore.set()（响应式选项覆盖）      │
└────────────────────────────────────────────────────────────────────┘
```

核心设计原则：

1. **核心库无状态**：所有后端交互通过 `configureRuleEngine` 从外部注入，核心库不感知接口地址与 HTTP 实现
2. **一次拉取，本地执行**：规则仅在 ON_LOAD 时拉取一次并缓存；ON_CHANGE / ON_BUTTON_CLICK 直接读缓存执行，零网络开销
3. **与联动策略独立**：联动（dataRelation）是声明式配置，规则引擎是流程编排，二者各行其是、可叠加使用

## 快速接入

### 第一步：注入配置

```ts
import { configureRuleEngine } from "star-horse-lowcode";

configureRuleEngine({
  // 规则拉取处理器：接收 formId，返回 { triggerEvent → flowContent[] }
  // 后端应将规则集、规则定义、规则集项合并为单接口返回
  fetchRulesHandler: async (formId) => {
    const res = await postRequest(`/userdb/ruleEngine/fetchRules/${formId}`, {});
    return res?.data?.data ?? {};
  },
  // http-call 节点的 HTTP 执行器
  httpCallHandler: async (url, method, body) => {
    const res =
      method.toUpperCase() === "GET"
        ? await getRequest(url, { params: body })
        : await postRequest(url, body);
    return res?.data?.data ?? res?.data;
  },
});
```

> demo 场景可跳过后端，用 `injectRuleCache(formId, rules)` 直接注入规则缓存。

#### 与上层 star-horse-form 包 configureRuleEngine 的关系

存在**两个同名但职责不同**的 `configureRuleEngine`，按 import 路径区分：

| 来源 | 关注点 | 配置内容 |
| --- | --- | --- |
| `star-horse-lowcode`（本核心库） | **运行时行为注入** | `fetchRulesHandler`（规则拉取）、`httpCallHandler`（HTTP 执行器）等处理器 |
| `star-horse-form`（上层组件包） | **API 端点配置** | 规则 CRUD 9 组接口的 `serviceName` + 路径、WebSocket/代理/网关等全局端点 |

典型分层用法：宿主应用先用 star-horse-form 的 `configureRuleEngine` / `configureAppEndpoints` 声明后端端点，再基于这些端点实现 fetchRulesHandler / httpCallHandler，最后通过本核心库的 `configureRuleEngine` 注入处理器：

```ts
import {
  configureRuleEngine as configureFormRuleApi,
  configureAppEndpoints,
} from "star-horse-form";
import { configureRuleEngine } from "star-horse-lowcode";

// 第一层：声明端点（star-horse-form）
configureAppEndpoints({ gatewayPrefix: "/my-gateway" });
configureFormRuleApi({ serviceName: "my-service" });

// 第二层：注入运行时处理器（star-horse-lowcode），内部复用上述端点
configureRuleEngine({
  fetchRulesHandler: async (formId) => { /* 调用 /my-service/... */ },
  httpCallHandler: async (url, method, body) => { /* ... */ },
});
```

### 第二步：字段关联规则表单

在需要启用规则的表单字段上配置 formId（任一位置即可）：

```ts
{
  fieldName: 'status',
  type: 'select',
  preps: {
    values: [/* 静态兜底选项 */],
    ruleEngineConfig: { formId: 'orderForm' },  // 方式一（推荐）
    // formId: 'orderForm',                      // 方式二
  }
}
```

## 触发事件

| 触发事件 | 入口函数 | 触发时机 | 特性 |
|---|---|---|---|
| `ON_LOAD` | `initRuleEvent(props, formData)` | 表单挂载 | 每个 formId 仅执行一次 |
| `ON_CHANGE` | `ruleEventDispatcher(props, e, formData, triggerField)` | 字段值变化 | **300ms 防抖**（同一 formId 连续变更合并），避免输入框逐字触发 |
| `ON_BUTTON_CLICK` | `ruleButtonAction(props, formData, evtName)` | button-item 点击 | context 注入 `__buttonKey`（按钮 fieldName）、`__buttonEvent` |

以上入口由 StarHorseForm / StarHorseItem 内部自动接线，无需手动调用。

### 拉取与缓存机制

- **并发保护**：同 formId 的并发拉取合并为同一个 Promise（loadingPromises），不会重复请求
- **失败降级**：拉取失败时缓存空对象，不阻塞表单渲染
- **未配置处理器**：fetchRulesHandler 未注入时缓存空规则，引擎静默不工作
- **手动清除**：`clearRuleCache(formId?)` 清除指定/全部缓存（含防抖定时器与选项覆盖）

### 多用户并发

- 缓存位于各浏览器会话内存中，天然按用户隔离，无共享状态冲突
- 后端只需保证 fetchRules 接口幂等；规则版本更新后，用户重新打开表单即加载最新规则
- 同表单多实例（如主子表）通过 `${formId}:${fieldName}` 维度的选项覆盖存储互不干扰

## flowContent 规则流格式

`flowContent` 为 JSON 字符串：`{ nodes: FlowNode[], edges: FlowEdge[] }`。引擎从 start 节点沿边顺序执行至 end，最多 100 步（防死循环）。

```jsonc
{
  "nodes": [
    { "id": "n1", "type": "start", "data": {} },
    {
      "id": "n2", "type": "condition",
      "data": {
        "logic": "AND",
        "conditions": [{ "fieldName": "amount", "operator": "GT", "value": "10000" }]
      }
    },
    {
      "id": "n3", "type": "action",
      "data": { "actions": [
        { "targetField": "approver", "actionType": "SET_REQUIRED" },
        { "targetField": "remark", "actionType": "SET_VALUE", "actionValueType": "EXPRESSION", "actionValue": "'金额:' + ${amount}" }
      ]}
    },
    { "id": "n4", "type": "end", "data": {} }
  ],
  "edges": [
    { "source": "n1", "target": "n2" },
    { "source": "n2", "target": "n3", "label": "是" },
    { "source": "n2", "target": "n4", "label": "否" },
    { "source": "n3", "target": "n4" }
  ]
}
```

### 节点类型

| 类型 | data 关键属性 | 行为 |
|---|---|---|
| `start` / `end` | — | 流程起止 |
| `condition` | `conditions[]`、`logic`(AND/OR) | 条件满足走"是"分支边（label 匹配 是/true/y/✓/yes/满足），否则走"否"分支 |
| `action` | `actions[]` | 顺序执行动作列表（见下表） |
| `exclusive-gateway` | `branches[]` | 多分支网关：按边 label 匹配 branch，branch 支持 `conditions[]` 或表达式 `condition`，`condition:"default"` 为默认分支 |
| `variable-assign` | `assignments[]` | 批量变量赋值：`{variableName, value, valueType}` |
| `script` | — | 占位节点，当前直接通过 |
| `http-call` | `url`、`method`、`body`、`responseVar`、`autoLoad` | 经注入的 httpCallHandler 发起请求；url/body 中 `${field}` 占位符自动替换；响应存入 `context[responseVar]`；`autoLoad:false` 时 ON_LOAD 阶段跳过该节点 |

### 条件操作符

`EQ` `NEQ` `GT` `GTE` `LT` `LTE` `CONTAINS` `NOT_CONTAINS` `IN` `NOT_IN` `IS_NULL` `IS_NOT_NULL` `STARTS_WITH` `ENDS_WITH` `BETWEEN`（数值比较自动转数字，IN 支持 `"a,b,c"` 逗号分隔字符串）。

### 动作类型（action.actions[]）

| actionType | 说明 |
|---|---|
| SET_VALUE | 赋值；`actionValueType`: CONSTANT（自动解析 JSON/数字/布尔）/ VARIABLE（取 context 路径）/ EXPRESSION（`${field}` 插值 + JS 表达式求值） |
| CLEAR_VALUE | 清空目标字段 |
| SHOW_FIELD / HIDE_FIELD | 显示 / 隐藏 |
| SET_ENABLED / SET_DISABLED | 启用 / 禁用 |
| SET_REQUIRED / SET_OPTIONAL | 必填 / 非必填 |
| SET_READONLY / SET_EDITABLE | 只读 / 可编辑 |

## 结果应用（控制指令协议）

流程输出的 delta 中，**`__` 前缀键为控制指令，其余键视为字段赋值**：

| delta 键 | 应用效果 |
|---|---|
| `__visible_<field>` = true/false | 字段显示 / 隐藏（写 field.formVisible） |
| `__required_<field>` | 必填 / 非必填（写 field.required） |
| `__readonly_<field>` | 只读 / 可编辑（写 field.preps.readonly） |
| `__disabled_<field>` | 禁用 / 启用（写 field.preps.disabled） |
| `__options_<field>` = [...] | **覆盖目标组件选项列表**（见下一节） |
| `<field>` = any（无前缀） | 赋值 `formData[field]`（SET_VALUE 的最终体现） |

目标字段在全字段树中递归查找（含 children / containerFields / appList），支持子表与容器内字段。

## 选项覆盖（optionsOverride）

6 个选项类组件（select / radio / checkbox / tselect / transfer / cascade）的选项 computed 统一接入覆盖机制：

```ts
// 组件内部（以 select-item 为例）
const selectOptions = computed(() => {
  const ruleFormId = props.field.preps?.ruleEngineConfig?.formId || props.field.preps?.formId;
  if (ruleFormId) {
    const override = getOptionsOverride(ruleFormId, props.field.fieldName);
    if (override) return override;   // 规则下发的选项优先生效
  }
  return props.field.preps?.values || [];   // 静态兜底
});
```

规则流设置选项时（SET_VALUE 到 `__options_` 前缀或直接下发 options）：

1. 写入响应式存储 `optionsOverrideStore`（reactive Map，key 为 `${formId}:${fieldName}`）→ 组件 computed 自动重算，**无需 triggerRef**
2. 同时按组件类型落到对应 preps 属性：`values`（select/radio/checkbox 等）/ `data`（tselect/transfer）/ `options`（cascade）
3. 读取入口 `getOptionsOverride(formId, fieldName)`，返回 undefined 表示无覆盖

## 与后端对接

### fetchRules 单接口规范

后端将「规则集 → 规则定义 → 规则集项」聚合为一个接口，按触发事件分组返回：

```
POST /userdb/ruleEngine/fetchRules/{formId}
Response:
{
  "code": "200",
  "data": {
    "formId": "orderForm",
    "rules": [
      {
        "idRuleDefinition": "...",
        "ruleCode": "amount_check",
        "ruleName": "大额审批校验",
        "triggerEvent": "ON_CHANGE",      // ON_LOAD | ON_CHANGE | ON_BUTTON_CLICK
        "priority": 1,
        "itemIndex": 0,
        "flowContent": "{\"nodes\":[...],\"edges\":[...]}"
      }
    ]
  }
}
```

fetchRulesHandler 将其归一化为缓存格式：

```ts
// { "ON_CHANGE": ["<flowContent1>", "<flowContent2>"], "ON_LOAD": ["..."] }
const grouped: Record<string, string[]> = {};
for (const r of res.rules) {
  (grouped[r.triggerEvent] ||= []).push(r.flowContent);
}
return grouped;
```

参考实现见 `src/sample/RuleEngineDemo.vue` 与 `src/sample/demo-rule-flows.ts`。

## API 参考

均从 `star-horse-lowcode` 导出（实现在 `src/components/formcomp/utils/ItemRuleEventUtils.ts` 与 `RuleFlowExecutor.ts`）：

| 函数 | 签名 | 说明 |
|---|---|---|
| configureRuleEngine | `(config: RuleEngineConfig) => void` | 注入 fetchRulesHandler / httpCallHandler（可多次调用增量合并） |
| initRuleEvent | `(props, formData) => Promise<void>` | ON_LOAD 入口（内部自动调用） |
| ruleEventDispatcher | `(props, e, formData, triggerField?) => Promise<void>` | ON_CHANGE 入口（300ms 防抖，内部自动调用） |
| ruleButtonAction | `(props, formData, evtName?) => Promise<void>` | ON_BUTTON_CLICK 入口（内部自动调用） |
| getOptionsOverride | `(formId, fieldName) => any[] \| undefined` | 读取选项覆盖值（组件 computed 订阅） |
| clearRuleCache | `(formId?) => void` | 清除规则缓存 / 防抖定时器 / 选项覆盖 |
| injectRuleCache | `(formId, rules) => void` | 直注规则缓存（demo / 测试用） |
| setFormFieldsRef / registerFormFieldsRef | `(formId, ref)` / `(fields, ref)` | 注册 formFields 引用（选项覆盖后 triggerRef 用） |
| parseRuleEngineActions | `(delta) => FieldAction[]` | delta → 字段控制指令数组 |
| applyRuleEngineActionsToFields | `(props, actions, formData, formId?) => void` | 应用控制指令到字段树 |
| executeFlow / executeFlows | `(flowContent, context, handler?) => Promise<context>` | 底层流程执行器（可独立使用） |