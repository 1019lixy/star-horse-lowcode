/**
 * API 编排器常量与预设（i18n 化）
 */
import { i18n } from "@/lang";
import type {
    ApiChain,
    ApiChainStep,
    ApiEndpoint,
    HttpMethod,
    MockResponse,
    ParamLocation,
} from "./types";

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
    { value: "application/x-www-form-urlencoded", label: "application/x-www-form-urlencoded" },
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

/** 创建接口 */
export const createEndpoint = (overrides: Partial<ApiEndpoint> = {}): ApiEndpoint => ({
    id: genId("ep"),
    name: i18n("api.endpoint.title"),
    method: "GET",
    url: "/api",
    headers: { "Content-Type": "application/json" },
    params: [],
    body: "",
    description: "",
    ...overrides,
});

/** 创建 Mock 响应 */
export const createMockResponse = (endpointId: string, overrides: Partial<MockResponse> = {}): MockResponse => ({
    id: genId("mock"),
    endpointId,
    status: 200,
    statusText: "OK",
    headers: { "Content-Type": "application/json" },
    body: "{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {}\n}",
    delay: 0,
    isActive: true,
    ...overrides,
});

/** 创建编排步骤 */
export const createChainStep = (endpointId: string, overrides: Partial<ApiChainStep> = {}): ApiChainStep => ({
    id: genId("step"),
    endpointId,
    stepName: i18n("api.chain.stepName"),
    variableExtractions: [],
    condition: "",
    ...overrides,
});

/** 创建编排链 */
export const createChain = (overrides: Partial<ApiChain> = {}): ApiChain => ({
    id: genId("chain"),
    name: i18n("api.chain.new"),
    description: "",
    steps: [],
    variables: {},
    ...overrides,
});

/** 示例接口集合 */
export const SAMPLE_ENDPOINTS: ApiEndpoint[] = [
    createEndpoint({
        name: "用户登录",
        method: "POST",
        url: "/api/auth/login",
        headers: { "Content-Type": "application/json" },
        params: [],
        body: '{\n  "username": "admin",\n  "password": "123456"\n}',
        description: "用户名密码登录，返回 token",
    }),
    createEndpoint({
        name: "获取用户列表",
        method: "GET",
        url: "/api/users",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer {{token}}" },
        params: [
            { name: "page", location: "query", required: false, defaultValue: "1", description: "页码" },
            { name: "size", location: "query", required: false, defaultValue: "10", description: "每页数量" },
        ],
        body: "",
        description: "分页查询用户列表",
    }),
    createEndpoint({
        name: "获取用户详情",
        method: "GET",
        url: "/api/users/{{userId}}",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer {{token}}" },
        params: [
            { name: "userId", location: "path", required: true, defaultValue: "", description: "用户ID" },
        ],
        body: "",
        description: "根据用户ID查询用户详情",
    }),
    createEndpoint({
        name: "创建订单",
        method: "POST",
        url: "/api/orders",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer {{token}}" },
        params: [],
        body: '{\n  "userId": "{{userId}}",\n  "product": "会员套餐",\n  "amount": 99.00\n}',
        description: "创建新订单",
    }),
];

/** 与示例接口匹配的 Mock 响应集合 */
export const SAMPLE_MOCKS: MockResponse[] = [
    createMockResponse(SAMPLE_ENDPOINTS[0].id, {
        status: 200,
        statusText: "OK",
        body: '{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {\n    \"token\": \"mock-token-abc123\",\n    \"expiresIn\": 3600\n  }\n}',
        delay: 100,
    }),
    createMockResponse(SAMPLE_ENDPOINTS[1].id, {
        status: 200,
        statusText: "OK",
        body: '{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {\n    \"total\": 2,\n    \"list\": [\n      { \"id\": 1, \"name\": \"张三\", \"age\": 25 },\n      { \"id\": 2, \"name\": \"李四\", \"age\": 30 }\n    ]\n  }\n}',
        delay: 80,
    }),
    createMockResponse(SAMPLE_ENDPOINTS[2].id, {
        status: 200,
        statusText: "OK",
        body: '{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {\n    \"id\": 1,\n    \"name\": \"张三\",\n    \"age\": 25,\n    \"email\": \"zhangsan@example.com\"\n  }\n}',
        delay: 60,
    }),
    createMockResponse(SAMPLE_ENDPOINTS[3].id, {
        status: 201,
        statusText: "Created",
        body: '{\n  \"code\": 0,\n  \"message\": \"success\",\n  \"data\": {\n    \"orderId\": \"ORD-20260718-0001\",\n    \"status\": \"created\"\n  }\n}',
        delay: 120,
    }),
];

/** 示例编排链：登录 → 提取 token → 获取用户列表 → 提取首个 userId → 获取用户详情 */
export const SAMPLE_CHAIN: ApiChain = createChain({
    name: "用户登录并查询详情",
    description: "登录获取 token，查询用户列表，取第一个用户查询详情",
    steps: [
        createChainStep(SAMPLE_ENDPOINTS[0].id, {
            stepName: "1. 登录",
            variableExtractions: [
                { sourceVar: "data.token", targetVar: "token" },
            ],
            condition: "",
        }),
        createChainStep(SAMPLE_ENDPOINTS[1].id, {
            stepName: "2. 查询用户列表",
            variableExtractions: [
                { sourceVar: "data.list.0.id", targetVar: "userId" },
            ],
            condition: "",
        }),
        createChainStep(SAMPLE_ENDPOINTS[2].id, {
            stepName: "3. 查询用户详情",
            variableExtractions: [],
            condition: "",
        }),
    ],
    variables: {},
});
