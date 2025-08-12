import { ApiUrls } from "@/components/types/ApiUrls";
import { SearchParams } from "@/components/types/Params";
import { RuleType } from "@/components/types/RuleType";
import { SearchFields } from "@/components/types/SearchProps";
import { Ref } from "vue";

/**
 * Tab 表单数据
 */
export declare interface TabFieldInfo {
  /**
   * 标题,显示名称
   */
  title: string;
  /**
   * TabName 定义每个Tab 的名字
   */
  tabName: string;
  /**
   * 是否默认禁用
   */
  disabled: string;
  /**
   * fieldList 是否是子表单
   */
  subFormFlag: string;
  /**
   * 如果要列表显示则该属性需要设置为Y
   */
  tableFlag: string;
  /**
   * 子集合Key 名称，如果配置了此名字，所有tab 下组件的数据将存入该名字下
   * 该属性的使用场景是 1对1 或者1 对多关系时，tab里组件是另外一个表的情况
   * eg:{
   *  objectName:{
   *     xx:[]
   *     yy:{}
   * }}
   */
  objectName?: string;
  /**
   * 主键
   */
  primaryKey: string | Array<any>;
  /**
   * 属性名
   */
  fieldList: Array<FieldInfo>;
  /**
   * 批量表单属性,该属性对应的数据默认是其它表的数据，
   */
  batchFieldList?: Array<BatchFieldInfo>;
}

/**
 * Card 容器信息
 */
export declare interface CardFieldInfo extends TabFieldInfo {
  /**
   * 头部右侧组件信息
   */
  headerFieldList?: FieldInfo[];
}

/**
 * Collapse 容器信息
 */
export declare interface CollapseList extends TabFieldInfo {}

/**
 * 表单属性
 */
export declare interface FieldInfo {
  /**
   * 标签名称
   */
  label?: string;
  /**
   * 属性名称
   */
  fieldName: string;
  /**
   * 隐藏属性名称
   */
  hideFieldName?: string;
  /**
   * 属性别名
   */
  aliasName?: string;
  /**
   * 帮助信息
   */
  helpMsg?: string;
  /**
   * 类型名称,支持
   * date 日期,
   * daterange 日期范围,
   * icon 图标,
   * select 下拉菜单（一级），
   * number 数字，
   * textrarea 文本域,
   * password 密码,
   * 非以上类型全部按照input处理
   */
  type?: string;
  /**
   * 以组件形式展示,如果是指定的组件，将以指定组件形式展示
   */
  listPrototypeDisplay?: boolean;
  /**
   * 是否必须项
   */
  required?: boolean | Ref<boolean>;
  /**
   * 表单是否显示该属性
   */
  formVisible?: boolean | Ref<boolean>;
  /**
   * 列表是否显示该属性
   */
  listVisible?: boolean | Ref<boolean>;
  /**
   * 查看页面是否显示该属性
   */
  viewVisible?: boolean | Ref<boolean>;

  /**
   * 列表所在列最小宽度
   */
  minWidth?: number;

  /**
   * 是否禁用,true 禁用 false 非禁用
   */
  disabled?: boolean | Ref<boolean>;
  /**
   * 编辑时禁用，true 禁用 false 非禁用
   */
  editDisabled?: boolean | Ref<boolean>;
  /**
   * Tab容器数据
   */
  tabList?: TabFieldInfo[];
  /**
   * Card 容器数据
   */
  cardList?: CardFieldInfo[];
  /**
   * 折叠容器(collapse)数据
   */
  collapseList?: CollapseList[];
  /**
   * 传统table布局表单，对应动态表格(dytable)容器
   */
  dytableList?: FieldInfo[];
  /**
   * 列表属性，对应动态列表（table) 容器
   */
  batchFieldList?: BatchFieldInfo[];
  /**
   * 默认值，在重置表单时，自动填充默认值，自定义重置表单时失效
   */
  defaultValue?: any;
  /**
   * 事件内容
   */
  actions?: Function | Record<string, Function>;
  /**
   * 小数点精度
   */
  precision?: number;

  /**
   * 组件个性化属性
   */
  preps?: Record<string, any | CompParams>;
  /**
   * 查询表前缀
   */
  prefix?: string;
  /**
   * 默认值匹配类型
   */
  matchType?: string;
  /**
   *  多数据显示风格，支持tab ,list  默认tab
   */
  displayStyle?: string;
  /**
   * 相邻的兄弟节点
   */
  brotherNodes?: FieldInfo[];
  /**
   * 优先级，数字越小，组件越靠前
   */
  priority?: number;
  /**
   * 列表搜索时是否显示该属性
   */
  searchVisible?: boolean;
  /**
   * 校验规则，废弃 在2.8.0 版本中删除 请在preps 中配置rules
   */
  rules?: RuleType[] | any;
  /**
   * 添加事件
   */
  addActions?: Function | string;
  /**
   * 编辑事件
   */
  editActions?: Function | string;

  /**
   * 删除事件
   */
  removeActions?: Function | string;
}

/**
 * 属性映射
 *
 */
export declare interface FieldMapping {
  /**
   * 列表属性
   */
  sourceField: string;
  /**
   * 需要赋值的属性
   */
  distField: string;
}

/**
 * 动态组件的参数对象
 */
export declare interface CompParams {
  /**
   * 选中数据时需要的字段
   */
  needField: Array<FieldMapping>;
  /**
   * 回调函数
   */
  recall?: Function;
  /**
   * 主键名称
   */
  primaryKey: string | Array<any>;
  /**
   * 接口地址
   */
  dataUrl: ApiUrls;
  /**
   * 字段信息
   */
  fieldList: Array<FieldInfo>;
  /**
   * 接口过滤条件
   */
  condition?: Array<SearchParams>;
  /**
   * 列表数据排序
   */
  orderBy?: Array<OrderByInfo>;
  /**
   * 格式化方法
   */
  dataFormat?: Function;
  /**
   * 查询字段
   */
  searchFieldList?: Array<SearchFields>;
  /**
   * 是否只读
   */
  readonly?: string;
}

/**
 * 用户自定义方法信息
 */
export declare interface UserFuncInfo {
  /**
   * 权限编码
   */
  authority?: string;
  /**
   * 方法名称
   */
  funcName?: string | Function;
  /**
   * 按钮显示文字名称
   */
  btnName?: string;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 优先级
   */
  priority?: number;
  /**
   * 帮助提示
   */
  helpMsg?: string;
  /**
   * 是否禁用 Y 是 N 否
   */
  disabled?: string;
  /**
   * 按钮显示位置，默认在列表的右侧
   */
  position?: "table" | "toolbar";
  /**
   * 子节点
   */
  children?: UserFuncInfo[];
}

/**
 * 列表排序
 */
export declare interface OrderByInfo {
  /**
   * 排序属性名称，如果关联表，请带上表别名前置
   */
  fieldName: string;
  /**
   * 升降序 asc 升序 desc 降序
   */
  ascOrDesc: string;
}

/**
 * 批量添加时的导入信息
 */
export declare interface ImportInfo {
  /**
   * 下载模板地址，在新增时下载对应的模板
   */
  downloadTemplateUrl?: string;
  /**
   * 导入数据地址，新增或者编辑时将数据导入
   */
  importDataUrl?: string;
  /**
   * 默认查询条件
   */
  conditions?: Array<SearchParams>;
}

/**
 * 子表单信息
 */
export declare interface SubFieldInfo {
  /**
   * 对应后端dto 里的Object/Map属性名称
   */
  objectName: string;
  /**
   * 主键名称，对应后端dto Object/Map泛型对象的主键名称
   */
  primaryKey?: string | Array<any>;
  /**
   * 字段属性
   */
  fieldList: Array<FieldInfo> | any;
  /**
   * fieldName和fieldList 是否同一个表，组件会根据这个字段校验数据是一对多关系
   * 还是单表的批量处理
   */
  subFormFlag?: string;
}

/**
 * 批量表单
 */
export declare interface BatchFieldInfo {
  /**
   * 对应后端dto 里的List属性名称
   */
  batchName: string;
  /**
   * 是否禁用
   */
  disabled?: string;
  /**
   * 禁止显示
   */
  disVisible?: boolean;
  /**
   * 列表标题
   */
  title?: string;
  /**
   * 帮助提示
   */
  helpMsg?: string;
  /**
   * 默认初始化行数
   */
  initRows?: number;
  /**
   * 主键名称，对应后端dto List泛型对象的主键名称
   */
  primaryKey?: string;
  /**
   * 新增行时默认添加的属性
   */
  batchDefaultData?: any;
  /**
   * 字段属性
   */
  fieldList: Array<FieldInfo> | any;
  /**
   * 当前组件接口
   */
  compUrl?: ApiUrls;
  /**
   * 导入数据
   */
  importInfo?: ImportInfo;
  /**
   * 是否静态数据 Y 是 N 否
   */
  staticData?: string;
  /**
   * batchFieldList 和fieldList 是否同一个表，组件会根据这个字段校验数据是一对多关系
   * 还是单表的批量处理
   */
  subFormFlag?: string | boolean;
  /**
   * 表单标识，如果需要作为form表单显示，则需要将该属性设置为Y
   */
  formFlag?: string;
}

/**
 * 页面属性信息
 */
export declare interface PageFieldInfo {
  /**
   * 表单属性
   */
  fieldList?: Array<FieldInfo> | any;
  /**
   * 批量表单属性
   * 对象格式的数据{} 数据格式为{
   * tb1:{title:"xx",primaryKey:"xx",fieldList:[]},
   * tb2:{title:"xx2",primaryKey:"xx2",fieldList:[]}
   * }
   * tb1 对应后端dto 里的List属性名称
   * primaryKey 对应后端dto List泛型对象的主键名称
   * fieldList 对应后端dto List泛型对象的属性
   * 后面将废弃这种用法,此种用户没法保证动态表单设置的数据位置
   */
  batchFieldList?: Array<BatchFieldInfo>;
  /**
   * 表格自定义方法
   */
  userTableFuncs?: Array<UserFuncInfo>;
  /**
   * 是否阻止自动加载列表数据
   */
  stopAutoLoad?: boolean;
  /**
   * 是否允许列表单元格可以编辑
   */
  cellEditable?: boolean;
  /**
   * 列表数据排序
   */
  orderBy?: Array<OrderByInfo>;
  /**
   * 默认查询条件
   */
  conditions?: Array<SearchParams>;
  /**
   * 表单有列表数据时,在提交后端是批量数据的Key名称
   */
  batchName?: string;
  /**
   * batchFieldList 和fieldList 是否同一个表，组件会根据这个字段校验数据是一对多关系
   * 还是单表的批量处理
   */
  sameTable?: boolean;
  /**
   * 主键
   */
  primaryKey?: string | Array<any>;
  /**
   * 优先级
   */
  priority?: number;
}

/**
 * 嵌套表结构
 */
export declare interface ExpandTable {
  /**
   * 列表数据字段
   */
  dataField: string;
  /**
   * 列表标题
   */
  title?: string;
  /**
   * 是否显示操作按钮
   */
  showButton?: boolean;
  /**
   * 扩展表主键
   */
  primaryKey?: string | Array<any>;
  /**
   * 扩展按钮方法
   */
  extendFuncs?: UserFuncInfo[];
  /**
   * 扩展方法API接口
   */
  expandUrls?: ApiUrls;
  /**
   * 列表字段
   */
  fieldList: FieldInfo[];
}
