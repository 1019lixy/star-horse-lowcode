/**
 * 公共 API 接口配置组件 —— 数据模型
 * 字段名与 dynamicform/ApiSharedConfig 完全对齐，
 * 便于未来 dynamicform 直接切到本包引用。
 */

/** 参数取值方式（对齐参考 valueTypeList） */
export type ApiConfigValueType = "static" | "dynamic" | "isolation";

/** 接口类型（对齐参考 apiType radio） */
export type ApiConfigApiType = "systemApi" | "thirdApi";

/** 顶层响应模式（对齐参考 responseMode radio） */
export type ApiConfigResponseMode = "options" | "mapping" | "list";

/** 隔离类型 */
export type ApiConfigIsolationType = "ip" | "role";

/** 生成模式：数据源 vs 联动 */
export type ApiConfigMode = "dataSource" | "linkage";

/** 请求头行（对齐参考 headers 子表：paramName/paramValue/valueType） */
export interface ApiConfigHeaderRow {
  paramName: string;
  paramValue: string;
  valueType?: ApiConfigValueType;
}

/** 请求参数行（对齐参考 requestParams 子表：paramName/paramValue/paramValueField/matchType/valueType） */
export interface ApiConfigParamRow {
  paramName: string;
  paramValue?: string;
  paramValueField?: string;
  valueType?: ApiConfigValueType;
  matchType?: string;
}

/** 结果字段映射（linkage 响应 tab：sourceField/distField/typeConvert/transform） */
export interface ApiConfigFieldMapping {
  sourceField: string;
  distField: string;
  typeConvert?: string;
  transform?: string;
}

/** 隔离明细（isolationDetails 子表：isolationName/paramName/isolationCode） */
export interface ApiConfigIsolationDetail {
  isolationName: string;
  paramName: string;
  isolationCode: string;
}

/**
 * 完整接口配置模型（严格对应参考 createApiConfig 的输出字段）。
 */
export interface ApiConfigModel {
  // ── 顶层：是否代理 ──
  /** 是否走代理后端；控制 proxyUrl / 响应 tab / 认证 tab / 隔离 tab 显隐 */
  proxy: boolean;
  /** 代理接口地址（proxy=true 才显示；缺省由 options.proxyUrlDefault 提供） */
  proxyUrl?: string;
  /** 条件字段（multiple select，来源 formFields） */
  conditionFields?: string[];
  /** 分页大小（number） */
  pageSize?: number;
  /** 响应模式：options / mapping / list */
  responseMode?: ApiConfigResponseMode;

  // ── 请求配置：apiType 及 systemApi 联动 ──
  /** 接口类型：systemApi（走服务/接口选择器） / thirdApi（直连） */
  apiType?: ApiConfigApiType;
  serviceName?: string;
  interfaceName?: string;
  /** systemApi 下选择的具体方法名（回填 httpMethod + url） */
  method?: string;
  /** 是否重定向（proxy 场景），默认 true */
  redirect?: boolean;

  /** HTTP 方法 */
  httpMethod: string;
  /** http / https（参考里允许 allowCreate） */
  protocol: string;
  /** 请求地址 */
  url: string;
  /** 请求数据格式：FORM / JSON / BINARY */
  dataType: string;

  /** 请求头 */
  headers: ApiConfigHeaderRow[];
  /** 请求参数 */
  requestParams: ApiConfigParamRow[];

  /** 返回值解析 */
  responseTemplate?: string;
  successCode?: string;
  codePath?: string;
  dataPath?: string;

  // ── 响应 tab：dataSource 模式字段 ──
  labelField?: string;
  valueField?: string;
  hasChildren?: boolean;
  childrenField?: string;
  onlyParseConfigured?: boolean;

  // ── 响应 tab：linkage 模式字段 ──
  fieldMappings?: ApiConfigFieldMapping[];

  // ── 隔离配置 ──
  isolationType?: ApiConfigIsolationType;
  isolationDetails?: ApiConfigIsolationDetail[];

  // ── 扩展：宿主可用的元信息（不属于参考，但为了 star-horse-form 编排器场景保留） ──
  name?: string;
  description?: string;
}

/** interfaceUtils：参考里由 getInterfaceUtils() 提供，用于 systemApi 服务/接口/方法三级联动 */
export interface ApiConfigInterfaceUtils {
  methodList?: any[];
  interfaceList?: any[];
  loadInterface?: (serviceName: string) => void;
  loadMethods?: (interfaceName: string) => void;
}

/**
 * schema 生成器选项：与参考 createApiConfig 一一对应。
 */
export interface ApiConfigSchemaOptions {
  /** 生成模式：dataSource 或 linkage，默认 linkage */
  mode?: ApiConfigMode;
  /** 表单字段候选（linkage distField / paramValueField / conditionFields 都用它） */
  formFields?: { name: string; value: string; helpMsg?: string }[];
  /** 顶层 conditionFields 默认值：当前字段名 */
  currentField?: string;
  /** systemApi 三级联动工具（缺省则 serviceName/interfaceName/method 只是空下拉，不会自动加载） */
  interfaceUtils?: ApiConfigInterfaceUtils;
  /** 校验接口 URL（SFC apiValid 用），缺省 "/userdb-manage/redirect/apiValid" */
  apiValidUrl?: string;
  /** 服务列表接口（serviceName 的 dataSource=url） */
  serviceListUrl?: string;
  /** proxyUrl 字段的默认值（对齐 appEndpoints.apiLinkageProxyUrl） */
  proxyUrlDefault?: string;
  /** 默认 HTTP 方法；参考里 dataSource→GET，linkage→POST */
  defaultMethod?: string;
  /** 是否显示 apiInfo 段顶部 name/description 行（宿主想省掉外层表单时打开） */
  showMeta?: boolean;
}
