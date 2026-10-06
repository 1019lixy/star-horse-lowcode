/**
 * 第三方接口配置组件 —— 数据模型
 *
 * 从 dynamicform/DataSourceComp 的第三方接口配置抽离，精简掉编排器不消费的
 * conditionFields / pageSize / responseMode / 隔离配置，保留接口调用与返回解析
 * 的核心字段，并增强参数传递（dynamic 绑定运行时变量）与返回数据解析能力。
 *
 * 字段命名与 apiconfig 保持一致，便于 bridge 复用。
 */

/** 参数取值方式：static 字面值 / dynamic 绑定运行时变量 */
export type ApiSourceValueType = "static" | "dynamic";

/** 接口类型：systemApi 走服务/接口选择器 / thirdApi 直连 */
export type ApiSourceApiType = "systemApi" | "thirdApi";

/** 生成模式：dataSource 选项数据源 / linkage 联动（编排出参映射） */
export type ApiSourceMode = "dataSource" | "linkage";

/** 请求头行 */
export interface ApiSourceHeaderRow {
  paramName: string;
  paramValue: string;
  valueType?: ApiSourceValueType;
}

/** 请求参数行 */
export interface ApiSourceParamRow {
  paramName: string;
  paramValue?: string;
  /** valueType=dynamic 时绑定的运行时变量名 */
  paramValueField?: string;
  valueType?: ApiSourceValueType;
  /** 匹配方式（eq/neq/like/gt/lt/gte/lte/isnull/notnull/in/between） */
  matchType?: string;
}

/**
 * 出参字段映射（linkage 模式）。
 * 把响应字段抓取为运行时变量，该变量对编排内后续所有步骤可见，
 * 实现「上一接口结果 → 后面所有接口入参」。
 */
export interface ApiSourceFieldMapping {
  /** 响应字段路径（相对 dataPath 节点，如 "token" / "list.0.id"） */
  sourceField: string;
  /** 目标变量名（抓取后存为此变量，对后续所有步骤可见） */
  distField: string;
  /** 类型转换：string/number/boolean/array */
  typeConvert?: string;
  /** 转换表达式（预留） */
  transform?: string;
}

/** 返回数据解析配置 */
export interface ApiSourceResponseParsing {
  /** 响应模板：string/number/result_data/result_data_list/result_data_map/map/list */
  responseTemplate: string;
  /** 成功码：codePath 处的值等于它视为业务成功；空表示不校验业务码 */
  successCode: string;
  /** 状态码路径（如 "code"、"status.code"） */
  codePath: string;
  /** 数据路径（如 "data"、"result.records"），空表示整个响应体 */
  dataPath: string;
}

/**
 * apiInfo / authInfo 嵌套段（schema 中 subFormFlag="Y" 的 tab 段）。
 * 与 ApiLinkageDetail.apiInfo 对齐：url/httpMethod/dataType 等接口主体信息在此层，
 * 表单 getFormData 输出的 dataForm.apiInfo.url 即接口地址，不在顶层。
 */
export interface ApiSourceApiInfo {
  /** 接口类型 */
  apiType?: ApiSourceApiType;
  serviceName?: string;
  interfaceName?: string;
  /** systemApi 下选择的具体方法名（回填 httpMethod + url） */
  method?: string;
  /** 是否网关转发 */
  redirect?: boolean;
  /** HTTP 方法 */
  httpMethod: string;
  /** http / https */
  protocol: string;
  /** 请求地址 */
  url: string;
  /** 请求数据格式：FORM / JSON / BINARY */
  dataType: string;
  /** 返回值解析 */
  responseTemplate?: string;
  successCode?: string;
  codePath?: string;
  dataPath?: string;
}

/**
 * 完整接口配置模型 —— 与弹窗表单 getFormData 输出结构严格一致
 * （ApiLinkageDetail 形态：apiInfo 嵌套段 + 顶层 headers/requestParams/fieldMappings）。
 * 编辑层与存储层共用此结构，无需任何桥接转换。
 */
export interface ApiSourceConfigModel {
  /** 接口唯一标识（编排器用作 endpoint id） */
  id?: string;
  /** 元信息（schema 顶部一行渲染） */
  name?: string;
  description?: string;

  /** 是否走代理后端；控制 proxyUrl / 认证 tab 显隐 */
  proxy?: boolean;
  /** 代理接口地址 */
  proxyUrl?: string;

  /** 接口主体配置（url/httpMethod 在此层） */
  apiInfo: ApiSourceApiInfo;
  /** 认证接口信息（proxy=true 时认证 tab 可配置） */
  authInfo?: Partial<ApiSourceApiInfo>;

  /** 请求头 */
  headers: ApiSourceHeaderRow[];
  /** 请求参数 */
  requestParams: ApiSourceParamRow[];

  /** dataSource 模式响应字段（optionField 段） */
  labelField?: string;
  valueField?: string;
  hasChildren?: boolean;
  childrenField?: string;
  onlyParseConfigured?: boolean;

  /** linkage 模式出参映射（响应字段 → 运行时变量） */
  fieldMappings?: ApiSourceFieldMapping[];
}

/** 系统接口三级联动工具（systemApi 模式下加载服务/接口/方法列表） */
export interface ApiSourceInterfaceUtils {
  methodList?: any[];
  interfaceList?: any[];
  loadInterface?: (serviceName: string) => void;
  loadMethods?: (interfaceName: string) => void;
}

/** schema 生成器选项 */
export interface ApiSourceSchemaOptions {
  /** 生成模式：dataSource 或 linkage，默认 linkage */
  mode?: ApiSourceMode;
  /** 可绑定变量候选（入口参数 + 全局变量 + 上游步骤提取变量） */
  formFields?: { name: string; value: string; helpMsg?: string }[];
  /** 顶层默认条件字段 */
  currentField?: string;
  /** systemApi 三级联动工具 */
  interfaceUtils?: ApiSourceInterfaceUtils;
  /** 校验接口 URL（内置"校验"按钮用），缺省关闭 */
  apiValidUrl?: string;
  /** 服务列表接口（serviceName 的 dataSource=url） */
  serviceListUrl?: string;
  /** proxyUrl 默认值 */
  proxyUrlDefault?: string;
  /** 默认 HTTP 方法；dataSource→GET，linkage→POST */
  defaultMethod?: string;
  /** 是否显示 name/description 元信息行 */
  showMeta?: boolean;
  /** 是否显示认证 tab（仅 proxy=true 时才有意义），默认 true */
  showAuth?: boolean;
  /**
   * 简版模式：只配置接口地址（url）与请求方式（httpMethod），
   * 隐藏代理/入参/出参解析/响应映射/认证等全部高级配置。
   * 配合组件的「高级配置」开关可一键切换到完整版。
   */
  simple?: boolean;
}