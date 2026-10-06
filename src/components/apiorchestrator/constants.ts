/**
 * API 编排器常量与预设（i18n 化）
 */
import { i18n } from "@/lang";
import type {
  ApiChain,
  ApiChainStep,
  ApiKeyValue,
  ChainInput,
  HttpMethod,
  MockResponse,
  ParamLocation,
  ParamValueType,
  RequestFormat,
  ResponseParsing,
} from "./types";
import type { ApiSourceConfigModel } from "@/components/system/ApiSourceConfig/types";

/** 生成简单唯一 id */
const genId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

/** HTTP 方法预设 */
export const API_HTTP_METHODS: { value: HttpMethod; label: string }[] = [
  { value: "GET", label: i18n("api.http.GET") },
  { value: "POST", label: i18n("api.http.POST") },
  { value: "PUT", label: i18n("api.http.PUT") },
  { value: "DELETE", label: i18n("api.http.DELETE") },
  { value: "PATCH", label: i18n("api.http.PATCH") },
];

/** HTTP 方法颜色（用于徽章） */
export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "#409EFF",
  POST: "#67C23A",
  PUT: "#E6A23C",
  DELETE: "#F56C6C",
  PATCH: "#909399",
};

/** HTTP 方法短标签（用于流程节点显示） */
export const METHOD_LABELS: Record<HttpMethod, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DEL",
  PATCH: "PTCH",
};

/** 常用状态码预设 */
export const STATUS_CODES: { value: number; label: string }[] = [
  { value: 200, label: i18n("api.statusCode.200") },
  { value: 201, label: i18n("api.statusCode.201") },
  { value: 400, label: i18n("api.statusCode.400") },
  { value: 401, label: i18n("api.statusCode.401") },
  { value: 403, label: i18n("api.statusCode.403") },
  { value: 404, label: i18n("api.statusCode.404") },
  { value: 500, label: i18n("api.statusCode.500") },
];

/** 常用 Content-Type */
export const CONTENT_TYPES: { value: string; label: string }[] = [
  { value: "application/json", label: "application/json" },
  {
    value: "application/x-www-form-urlencoded",
    label: "application/x-www-form-urlencoded",
  },
  { value: "multipart/form-data", label: "multipart/form-data" },
  { value: "text/plain", label: "text/plain" },
  { value: "text/html", label: "text/html" },
  { value: "application/xml", label: "application/xml" },
];

/** 参数位置预设 */
export const PARAM_LOCATIONS: { value: ParamLocation; label: string }[] = [
  { value: "query", label: i18n("api.paramLocation.query") },
  { value: "path", label: i18n("api.paramLocation.path") },
  { value: "header", label: i18n("api.paramLocation.header") },
];

/** 请求体格式预设 */
export const REQUEST_FORMATS: { value: RequestFormat; label: string }[] = [
  { value: "none", label: i18n("api.format.none") },
  { value: "json", label: i18n("api.format.json") },
  { value: "raw", label: i18n("api.format.raw") },
  { value: "form-data", label: i18n("api.format.formData") },
  { value: "x-www-form-urlencoded", label: i18n("api.format.urlencoded") },
];

/** 参数取值方式预设 */
export const PARAM_VALUE_TYPES: { value: ParamValueType; label: string }[] = [
  { value: "static", label: i18n("api.valueType.static") },
  { value: "dynamic", label: i18n("api.valueType.dynamic") },
];

/** 变量提取类型转换预设 */
export const TYPE_CONVERSIONS: { value: string; label: string }[] = [
  { value: "", label: i18n("api.convert.none") },
  { value: "string", label: i18n("api.convert.string") },
  { value: "number", label: i18n("api.convert.number") },
  { value: "boolean", label: i18n("api.convert.boolean") },
  { value: "array", label: i18n("api.convert.array") },
];

/** 编排入口参数取值类型预设 */
export const CHAIN_INPUT_TYPES: {
  value: ChainInput["type"];
  label: string;
}[] = [
  { value: "string", label: i18n("api.inputType.string") },
  { value: "number", label: i18n("api.inputType.number") },
  { value: "boolean", label: i18n("api.inputType.boolean") },
  { value: "object", label: i18n("api.inputType.object") },
  { value: "array", label: i18n("api.inputType.array") },
];

/** 创建通用键值对 */
export const createKeyValue = (
  overrides: Partial<ApiKeyValue> = {},
): ApiKeyValue => ({
  id: genId("kv"),
  name: "",
  value: "",
  enabled: true,
  description: "",
  ...overrides,
});

/** 默认响应解析：code/data 模板（successCode 留空 = 不校验业务码） */
export const DEFAULT_RESPONSE_PARSING: ResponseParsing = {
  responseTemplate: "result_data_list",
  successCode: "",
  codePath: "code",
  dataPath: "data",
};

/** 创建接口 —— 结构与弹窗表单 getFormData 输出严格一致（ApiLinkageDetail：apiInfo 嵌套段） */
export const createEndpoint = (
  overrides: Partial<ApiSourceConfigModel> = {},
): ApiSourceConfigModel => {
  const {apiInfo, ...rest} = overrides;
  return {
    id: genId("ep"),
    name: i18n("api.endpoint.title"),
    proxy: true,
    apiInfo: {
      apiType: "thirdApi",
      httpMethod: "GET",
      protocol: "http",
      url: "/api",
      dataType: "JSON",
      responseTemplate: "result_data_list",
      successCode: "",
      codePath: "code",
      dataPath: "data",
      ...(apiInfo ?? {}),
    },
    headers: [{paramName: "Content-Type", paramValue: "application/json", valueType: "static"}],
    requestParams: [],
    fieldMappings: [],
    description: "",
    ...rest,
  };
};

/** 创建 Mock 响应 */
export const createMockResponse = (
  endpointId: string,
  overrides: Partial<MockResponse> = {},
): MockResponse => ({
  id: genId("mock"),
  endpointId,
  status: 200,
  statusText: "OK",
  headers: { "Content-Type": "application/json" },
  body: '{\n  "code": 0,\n  "message": "success",\n  "data": {}\n}',
  delay: 0,
  isActive: true,
  ...overrides,
});

/** 创建编排步骤 */
export const createChainStep = (
  endpointId: string,
  overrides: Partial<ApiChainStep> = {},
): ApiChainStep => ({
  id: genId("step"),
  endpointId,
  stepName: i18n("api.chain.stepName"),
  variableExtractions: [],
  condition: "",
  ...overrides,
});

/** 创建编排入口参数 */
export const createChainInput = (
  overrides: Partial<ChainInput> = {},
): ChainInput => ({
  id: genId("input"),
  name: "",
  type: "string",
  required: false,
  defaultValue: "",
  description: "",
  ...overrides,
});

/** 创建编排链 */
export const createChain = (overrides: Partial<ApiChain> = {}): ApiChain => ({
  id: genId("chain"),
  name: i18n("api.chain.new"),
  description: "",
  steps: [],
  globalConfig: { headers: {}, query: {}, variables: {} },
  inputs: [],
  variables: {},
  ...overrides,
});

/** 示例接口统一响应解析：code=0 视为成功，数据在 data 节点 */
const SAMPLE_PARSING: ResponseParsing = {
  ...DEFAULT_RESPONSE_PARSING,
  successCode: "0",
};

/** 示例接口集合 */
export const SAMPLE_ENDPOINTS: ApiSourceConfigModel[] = [
  createEndpoint({
    name: "用户登录",
    apiInfo: {httpMethod: "POST", url: "/api/auth/login", successCode: "0"},
    requestParams: [
      {paramName: "username", paramValue: "${username}", paramValueField: "username", valueType: "dynamic"},
      {paramName: "password", paramValue: "${password}", paramValueField: "password", valueType: "dynamic"},
    ],
    description: "用户名密码登录（入口参数 username/password），返回 token",
  }),
  createEndpoint({
    name: "获取用户列表",
    apiInfo: {httpMethod: "GET", url: "/api/users", successCode: "0"},
    headers: [
      {paramName: "Content-Type", paramValue: "application/json", valueType: "static"},
      {paramName: "Authorization", paramValue: "Bearer ${token}", paramValueField: "token", valueType: "dynamic"},
    ],
    requestParams: [
      {paramName: "page", paramValue: "1", valueType: "static"},
      {paramName: "size", paramValue: "10", valueType: "static"},
    ],
    description: "分页查询用户列表",
  }),
  createEndpoint({
    name: "获取用户详情",
    apiInfo: {httpMethod: "GET", url: "/api/users/${userId}", successCode: "0"},
    headers: [
      {paramName: "Content-Type", paramValue: "application/json", valueType: "static"},
      {paramName: "Authorization", paramValue: "Bearer ${token}", paramValueField: "token", valueType: "dynamic"},
    ],
    requestParams: [
      {paramName: "X-Request-Source", paramValue: "api-orchestrator", valueType: "static"},
    ],
    description: "根据用户ID查询用户详情",
  }),
  createEndpoint({
    name: "创建订单",
    apiInfo: {httpMethod: "POST", url: "/api/orders", successCode: "0"},
    headers: [
      {paramName: "Content-Type", paramValue: "application/json", valueType: "static"},
      {paramName: "Authorization", paramValue: "Bearer ${token}", paramValueField: "token", valueType: "dynamic"},
    ],
    requestParams: [
      {paramName: "userId", paramValue: "${userId}", paramValueField: "userId", valueType: "dynamic"},
      {paramName: "product", paramValue: "会员套餐", valueType: "static"},
      {paramName: "amount", paramValue: "99.00", valueType: "static"},
    ],
    description: "创建新订单",
  }),
  createEndpoint({
    name: "更新用户资料",
    apiInfo: {httpMethod: "PUT", url: "/api/users/${userId}/profile", dataType: "FORM", successCode: "0"},
    headers: [
      {paramName: "Authorization", paramValue: "Bearer ${token}", paramValueField: "token", valueType: "dynamic"},
    ],
    requestParams: [
      {paramName: "nickname", paramValue: "张三", valueType: "static"},
      {paramName: "age", paramValue: "25", valueType: "static"},
      {paramName: "city", paramValue: "${city}", paramValueField: "city", valueType: "dynamic"},
    ],
    description: "表单方式更新资料，演示请求格式与参数传递",
  }),
];

/** 与示例接口匹配的 Mock 响应集合 */
export const SAMPLE_MOCKS: MockResponse[] = [
  createMockResponse(SAMPLE_ENDPOINTS[0].id, {
    status: 200,
    statusText: "OK",
    body: '{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "token": "mock-token-abc123",\n    "expiresIn": 3600\n  }\n}',
    delay: 100,
  }),
  createMockResponse(SAMPLE_ENDPOINTS[1].id, {
    status: 200,
    statusText: "OK",
    body: '{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "total": 2,\n    "list": [\n      { "id": 1, "name": "张三", "age": 25 },\n      { "id": 2, "name": "李四", "age": 30 }\n    ]\n  }\n}',
    delay: 80,
  }),
  createMockResponse(SAMPLE_ENDPOINTS[2].id, {
    status: 200,
    statusText: "OK",
    body: '{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "id": 1,\n    "name": "张三",\n    "age": 25,\n    "email": "zhangsan@example.com"\n  }\n}',
    delay: 60,
  }),
  createMockResponse(SAMPLE_ENDPOINTS[3].id, {
    status: 201,
    statusText: "Created",
    body: '{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "orderId": "ORD-20260718-0001",\n    "status": "created"\n  }\n}',
    delay: 120,
  }),
  createMockResponse(SAMPLE_ENDPOINTS[4].id, {
    status: 200,
    statusText: "OK",
    body: '{\n  "code": 0,\n  "message": "success",\n  "data": {\n    "userId": 1,\n    "updated": true\n  }\n}',
    delay: 70,
  }),
];

/** 示例编排链：登录 → 提取 token → 获取用户列表 → 提取首个 userId → 获取用户详情 */
export const SAMPLE_CHAIN: ApiChain = createChain({
  name: "用户登录并查询详情",
  description: "登录获取 token，查询用户列表，取第一个用户查询详情",
  globalConfig: {
    headers: { "X-Client": "sh-console" },
    query: { locale: "zh-CN" },
    variables: { city: "杭州" },
  },
  inputs: [
    createChainInput({
      name: "username",
      type: "string",
      required: true,
      defaultValue: "admin",
      description: "登录用户名（入口参数）",
    }),
    createChainInput({
      name: "password",
      type: "string",
      required: true,
      defaultValue: "123456",
      description: "登录密码（入口参数）",
    }),
    createChainInput({
      name: "pageNum",
      type: "number",
      required: false,
      defaultValue: "1",
      description: "查询页码，作为下游接口入参",
    }),
  ],
  steps: [
    createChainStep(SAMPLE_ENDPOINTS[0].id, {
      stepName: "1. 登录",
      variableExtractions: [
        { sourceVar: "token", targetVar: "token", typeConvert: "string" },
      ],
      condition: "",
    }),
    createChainStep(SAMPLE_ENDPOINTS[1].id, {
      stepName: "2. 查询用户列表",
      variableExtractions: [
        { sourceVar: "list.0.id", targetVar: "userId", typeConvert: "number" },
      ],
      condition: "",
    }),
    createChainStep(SAMPLE_ENDPOINTS[2].id, {
      stepName: "3. 查询用户详情",
      variableExtractions: [],
      condition: "",
    }),
    createChainStep(SAMPLE_ENDPOINTS[4].id, {
      stepName: "4. 更新用户资料",
      variableExtractions: [],
      condition: "token != null",
    }),
  ],
  variables: {},
});
