# StarHorseApiSourceConfig 第三方接口配置组件

> 从 dynamicform/DataSourceComp 的第三方接口配置抽离，发布为 `star-horse-lowcode` 库的独立组件，供编排器与任意需要接口配置的场景复用。弹窗模式下可被 `el-dialog` / `star-horse-panel` 内嵌。

## 一、组件用途

统一配置第三方接口的请求与返回解析：

- **请求配置**：接口类型（系统接口/第三方直连）、HTTP 方法、协议、URL、请求头、请求参数（query/path/body）、数据格式（JSON/FORM/BINARY）。
- **参数传递**：请求参数支持 `static`（字面值）与 `dynamic`（绑定运行时变量）两种取值方式；`dynamic` 时从可绑定变量候选（入口参数 + 全局变量 + 上游步骤提取变量）中选择，自动生成 `${field}` 占位符。
- **返回解析**：响应模板、成功码、状态码路径（codePath）、数据路径（dataPath），执行时按此校验业务码并定位数据节点。
- **出参映射**（linkage 模式）：把响应字段抓取为运行时变量，该变量对编排内后续所有步骤可见，实现「上一接口结果 → 后面所有接口入参」。
- **代理开关**：`proxy` 控制是否走代理后端；直连模式隐藏代理专属配置。

相比原 `apiconfig` 组件，精简掉编排器不消费的字段：`conditionFields` / `pageSize` / `responseMode` / 隔离配置（isolationType / isolationDetails）。

## 二、导出与注册

### 按需引入
```ts
import {
  StarHorseApiSourceConfig,
  createApiSourceSchema,
  toEndpointModel,
  fromEndpointModel,
  toExtractions,
  fromExtractions,
} from "star-horse-lowcode";
```

### 全局组件
`src/index.ts` 已通过 `import.meta.glob` 扫描 `@/components/system/ApiSourceConfig/*.vue` 自动注册为全局组件 `<star-horse-api-source-config>`。

### 模块导出
`src/components/system/index.ts` 已 `export * from "./ApiSourceConfig"`，经 `src/index.ts` 的 `export * from "@/components/system"` 透传到包根。

## 三、组件 API

### Props
| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `modelValue` | `ApiSourceConfigModel` | — | 初始值 / v-model 绑定；组件通过 `setFormData` 推送给内部 star-horse-form |
| `options` | `ApiSourceSchemaOptions` | `{}` | schema 生成器选项（见下） |
| `showVerifyButton` | `boolean` | — | 是否显示内置"校验"按钮（依赖 `options.apiValidUrl`）；传 `false` 显式关闭 |

### Emits
| 事件 | 参数 | 说明 |
|---|---|---|
| `update:modelValue` | `ApiSourceConfigModel` | v-model 同步 |
| `change` | `ApiSourceConfigModel` | 配置变化时触发 |

### defineExpose
| 方法 | 签名 | 说明 |
|---|---|---|
| `setFormData` | `(data: ApiSourceConfigModel) => void` | 推送表单数据到内部 star-horse-form |
| `getFormData` | `() => ApiSourceConfigModel` | 拉取当前表单数据（含默认值合并） |
| `submitValid` | `() => Promise<boolean>` | 表单内建校验 |
| `apiValid` | `() => Promise<boolean>` | 提交到代理后端做真实校验（需 `apiValidUrl`） |
| `sync` | `() => ApiSourceConfigModel` | 主动同步：把当前表单快照 emit 出去 |

### ApiSourceSchemaOptions
| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `mode` | `"dataSource" \| "linkage"` | `"linkage"` | 生成模式：dataSource 出 labelField/valueField；linkage 出 fieldMappings |
| `formFields` | `{name,value,helpMsg?}[]` | `[]` | 可绑定变量候选（入口参数+全局变量+上游提取变量），用于 dynamic 参数绑定与出参映射目标字段下拉 |
| `currentField` | `string` | — | 顶层默认条件字段（保留位） |
| `interfaceUtils` | `ApiSourceInterfaceUtils` | — | systemApi 三级联动工具（methodList/interfaceList/loadInterface/loadMethods） |
| `apiValidUrl` | `string` | `"/userdb-manage/redirect/apiValid"` | 校验接口 URL；传 `""` 关闭内置校验按钮 |
| `serviceListUrl` | `string` | — | 服务列表接口（serviceName 的 dataSource=url） |
| `proxyUrlDefault` | `string` | `"/userdb-manage/redirect/api"` | proxyUrl 默认值 |
| `defaultMethod` | `string` | dataSource→GET, linkage→POST | 默认 HTTP 方法 |
| `showMeta` | `boolean` | `false` | 是否显示 name/description 元信息行 |
| `showAuth` | `boolean` | `true` | 是否显示认证 tab（仅 proxy=true 才显示） |
| `simple` | `boolean` | `false` | 简版模式：只配置接口地址（url）与请求方式（httpMethod），隐藏全部高级配置；组件提供「高级配置」开关可一键切换完整版 |

## 四、配置字段详解

### 顶层
| 字段 | 控件 | 默认 | 说明 |
|---|---|---|---|
| `proxy` | switch | `true` | 是否走代理后端；控制 proxyUrl / 响应 tab / 认证 tab 显隐 |
| `proxyUrl` | input | `proxyUrlDefault` | 代理接口地址（proxy=true 才显示） |
| `apiInfo` | tab 容器(border-card) | — | 含请求 tab / 响应 tab / 认证 tab（可选） |

### 请求 tab（apiInfo）
- **apiType**（radio）：`systemApi`（走服务/接口选择器）/ `thirdApi`（直连）。systemApi 时显示 serviceName/interfaceName/method/redirect。
- **serviceName**（select）：服务名，change 触发 `loadInterface`。
- **interfaceName**（select）：接口名，change 触发 `loadMethods`。
- **method**（select）：方法名，change 自动回填 httpMethod + url。
- **redirect**（switch，默认 true）：是否网关转发。
- **httpMethod**（select）：HTTP 方法 GET/POST/PUT/DELETE/PATCH。
- **protocol**（select）：http / https。
- **url**（input）：请求地址。
- **dataType**（select）：JSON / FORM / BINARY。
- **headers** 子表：`paramName` / `paramValue` / `valueType`(static/dynamic)。
- **requestParams** 子表：`paramName` / `paramValue` / `paramValueField`(dynamic 时变量选择) / `matchType`(eq/neq/like/gt/lt/...) / `valueType`(static/dynamic)。
  - `valueType=dynamic` 时通过 `paramValueField` 从 `formFields` 选变量，自动生成 `${fieldName}` 写入 `paramValue`。
- **responseTemplate**（select）：string/number/result_data/result_data_list/result_data_map/map/list。
- **successCode**（input）：成功码（codePath 处的值等于它视为成功；空不校验）。
- **codePath**（input，默认 "code"）：状态码路径。
- **dataPath**（input，默认 "data"）：数据路径。

### 响应 tab
- **dataSource 模式**：`labelField` / `valueField` / `hasChildren`(switch) / `childrenField` / `onlyParseConfigured`(switch)。
- **linkage 模式**：`fieldMappings` 子表（`sourceField` / `distField` / `typeConvert` / `transform`）。
  - `sourceField`：响应字段路径（相对 dataPath 节点，如 "token" / "list.0.id"）。
  - `distField`：目标变量名（抓取后存为此变量，对后续所有步骤可见）。
  - `typeConvert`：string/number/boolean/array。
  - `transform`：转换表达式（预留）。

### 认证 tab（可选，proxy=true 才显示）
结构与请求 tab 相同，用于配置登录认证接口。

## 五、参数传递能力

编排器支持三层参数源，全部在编排内全局可见：

### 1. 入口参数（ChainInput）
整条链的基线变量。通过 `runChain({ inputs })` 外部传入，覆盖入口参数默认值：
```ts
await state.runChain({
  mode: "real",
  inputs: { username: "admin", password: "123456" },
});
```

### 2. 全局参数（GlobalConfig）
`chain.globalConfig`：
- `headers`：合并到每个接口请求头（接口同名头覆盖）。
- `query`：合并到每个接口查询参数（接口同名覆盖）。
- `variables`：基线变量，供 `{{var}}` 插值与条件求值。

### 3. 上游接口结果 → 下游入参
两种机制并存：

#### 变量提取（variableExtractions / fieldMappings）
步骤的 `variableExtractions` 从响应 dataPath 节点按 `sourceVar` 路径取值，存为 `targetVar`，回写运行时变量。该变量对**后续所有步骤**可见。

在接口配置弹窗的响应 tab（linkage 模式）配置 `fieldMappings`，经 `toExtractions` 转为 `variableExtractions`：
```ts
// bridge.ts
toExtractions(model.fieldMappings) // → VariableExtraction[]
```

#### 插值与 dynamic 绑定
- **插值**：URL / headers / body / paramValue 中的 `{{var}}` / `{{a.b.c}}` 在执行时替换为运行时变量值。
- **dynamic 绑定**：参数 `valueType="dynamic"` + `sourceVar` 显式绑定运行时变量，优先取绑定值，回退插值默认值。

### 运行时变量合并优先级
```
入口参数 → 外部传入参数(覆盖) → 全局变量 → 链累计变量 → 步骤提取结果(逐层覆盖)
```

## 六、返回数据解析能力

`ResponseParsing`（`responseTemplate` / `successCode` / `codePath` / `dataPath`）：

1. JSON.parse 响应体（失败不校验业务码，视为成功）。
2. `codePath` 处的值与 `successCode` 比较（`successCode` 为空不校验）。
3. `dataPath` 定位数据节点，作为变量提取根。
4. 业务码失败时自动探测 `message` / `msg` / `cnMessage` / `error` 字段作为错误消息。

`getByPath` 支持点号路径与数组下标（如 `list.0.id`、`data.records`）。

## 七、执行模式（runChain）

```ts
state.runChain(options?: { mode?: "mock" | "real"; inputs?: Record<string, any> })
```

| 参数 | 说明 |
|---|---|
| `mode` | `"mock"`（默认，用 Mock 响应）/ `"real"`（发真实 HTTP 请求，走 axios 实例） |
| `inputs` | 外部传入参数，覆盖入口参数默认值后注入运行时变量 |

- **mock 模式**：查找接口的活跃 Mock 响应，无 Mock 则失败。用于离线测试编排逻辑。
- **real 模式**：用 `getAxiosInstance()`（`window.__hostAxios__ ?? starHorseAxios`）发真实请求，支持代理/拦截器。

## 八、与编排器互转（bridge.ts）

| 函数 | 说明 |
|---|---|
| `toEndpointModel(model, meta)` | `ApiSourceConfigModel` → 编排器 `ApiEndpoint` |
| `fromEndpointModel(ep)` | 编排器 `ApiEndpoint` → `ApiSourceConfigModel` |
| `toExtractions(mappings)` | `fieldMappings` → `VariableExtraction[]` |
| `fromExtractions(extractions)` | `VariableExtraction[]` → `fieldMappings` |

映射约定：
- `dataType`(FORM/JSON/BINARY) ↔ `requestFormat`(x-www-form-urlencoded/json/raw)
- `valueType=dynamic` + `paramValueField` ↔ `valueType=dynamic` + `sourceVar`
- `paramValue` 里的 `${field}` ↔ 编排器里的 `{{field}}`
- GET/HEAD/OPTIONS 的 requestParams → query；FORM → bodyParams；JSON → body
- `headers` 数组 ↔ `Record<string,string>`
- `responseTemplate/successCode/codePath/dataPath` ↔ `ApiEndpoint.responseParsing`

## 九、使用示例

### 在编排器接口配置弹窗中
```vue
<el-dialog v-model="visible" title="接口配置" width="960px">
  <star-horse-api-source-config
    ref="apiCfgRef"
    :options="{
      mode: 'linkage',
      formFields: availableVars,
      showMeta: true,
      apiValidUrl: '',
    }"
    :show-verify-button="false"
  />
</el-dialog>
```

```ts
// 回填
apiCfgRef.value.setFormData(fromEndpointModel(endpoint));

// 提取
const model = apiCfgRef.value.getFormData();
const endpoint = toEndpointModel(model, { id, name });
const extractions = toExtractions(model.fieldMappings);
```

### 独立使用（数据源配置）
```vue
<star-horse-api-source-config
  ref="apiRef"
  :options="{ mode: 'dataSource', formFields: fieldList }"
  :show-verify-button="true"
/>
```

### 简版模式（只配接口与请求方式）
```vue
<star-horse-api-source-config
  ref="apiRef"
  :options="{ simple: true, showMeta: true }"
/>
```
简版只渲染 `name`（showMeta 时）/ `httpMethod` / `url` 三个字段，隐藏代理/入参/出参/响应/认证等全部高级配置。组件右上角提供「高级配置」按钮，点击一键展开完整版（已填的 url/httpMethod 保留），再点「简版配置」切回。适合只需快速配一个接口地址的轻量场景。

## 十、文件结构

```
src/components/system/ApiSourceConfig/
├── StarHorseApiSourceConfig.vue   # 主组件
├── types.ts                        # 类型定义
├── options.ts                      # 选项集
├── schema.ts                       # 字段定义（createApiSourceSchema）
├── bridge.ts                       # 与编排器双向转换
└── index.ts                        # 统一出口
```