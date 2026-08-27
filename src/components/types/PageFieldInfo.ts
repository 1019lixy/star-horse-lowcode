import {ApiUrls} from "@/components/types/ApiUrls";
import {SearchParams} from "@/components/types/Params";
import {RuleType} from "@/components/types/RuleType";
import {SearchFields} from "@/components/types/SearchProps";

/**
 * Tab 表单数据
 */
export declare interface TabFieldInfo {
    /**
     * 标题,显示名称
     */
    title: string;
    /**
     * 是否默认禁用
     */
    disabled?: boolean;
    /**
     * 容器项本身是否显示,false 时该 tab/collapse/card 项不渲染
     * 与 dataRelation 的 eqVisible/eqHide 策略(controlTarget=container)联动
     */
    formVisible?: boolean;
    /**
     * fieldList 是否是子表单
     */
    subFormFlag: string;
    /**
     * 如果要列表显示则该属性需要设置为Y
     */
    tableFlag?: string;
    /**
     * 表单子对象数据在 dataForm 中的 key,所有 tab 下组件的数据将存入该名字下
     * 使用场景:1对1 或 1对多关系时,tab 里组件是另外一个表的情况
     * eg:{
     *  subTableName:{
     *     xx:[]
     *     yy:{}
     * }}
     * 仅用于前端数据嵌套,不参与后端关联表关系
     */
    /**
     * 子表主键名,后端关联表关系(RelationTablesPo.primaryKey)取此值
     * 与 subTableName 配合,用于 1对1/1对多子表单的关联关系
     */
    subTablePrimaryKey?: string;
    /**
     * 子表表名,后端关联表关系(RelationTablesPo.tableName)取此值
     * 与 subTablePrimaryKey 配合,用于 1对1/1对多子表单的关联关系
     */
    subTableName?: string;
    /**
     * 主键
     */
    primaryKey: string | Array<any>;
    /**
     * 属性名
     */
    fieldList: Array<FieldInfo>;
    /**

     * 统一容器字段(替代 batchFieldList),嵌套容器子项统一存于此
     */
    containerFields?: ContainerFieldInfo[];
    //属性
    preps?: Record<string, any>;
    /**
     * 当subFormFlag为Y是映射关系 1 表示1对一，n表示1 对多,默认1
     */
    mapping?: "1" | "n";
    /**
     * 头部右侧组件信息
     */
    headerFieldList?: FieldInfo[];
    /**
     * 是否静态数据,在列表添加数据时，Y 则通过弹窗添加数据，否则就在列表上直接显示表单属性
     */
    staticData?: string;
}

/**
 * 统一容器项结构(替代 TabFieldInfo/BatchFieldInfo 的容器场景)
 * 公共属性全部对齐到顶层,差异化属性全部下沉到 preps
 * containerType 标识容器类别,新增容器类型无需改本接口
 */
export declare interface ContainerFieldInfo extends Omit<
    TabFieldInfo,
    "title" | "subTablePrimaryKey" | "subFormFlag" | "primaryKey"
> {
    /**
     * 容器类型标识: tab|card|collapse|splitter|step|dialog|drawer|descriptions|fieldset|app|dytable|table|box|condition|anchor
     * 与 containerFields 配合,所有容器数据统一存于 containerFields
     * anchor 为锚点导航容器,支持 anchorItem 独立配置(anchorTitle/anchorHref/anchorIcon/anchorDisabled)
     */
    containerType?: string;
    title?: string;
    subTablePrimaryKey?: string;
    subFormFlag?: string;
    primaryKey?: string | Array<any>;
}

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
     * ID
     */
    id?: string;
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
    required?: boolean;
    /**
     * 表单是否显示该属性
     */
    formVisible?: boolean;
    /**
     * 列表是否显示该属性
     */
    listVisible?: boolean;
    /**
     * 查看页面是否显示该属性
     */
    viewVisible?: boolean;
    /**
     * app端是否可见
     */
    visiblePlatform?: string;

    /**
     * 列表所在列最小宽度
     */
    minWidth?: number;

    /**
     * 是否禁用,true 禁用 false 非禁用
     */
    disabled?: boolean;
    /**
     * 编辑时禁用，true 禁用 false 非禁用
     */
    editDisabled?: boolean;
    /**
     * 容器类型,标识该字段作为容器组件渲染时的类型
     * 取值如:tab/card/collapse/splitter/step/dialog/drawer/descriptions/fieldset/app 等
     * StarHorseItem 依据此属性解析对应容器组件,后续新增容器类型无需再修改 FieldInfo 定义
     */
    containerType?: string;
    /**
     * 统一容器字段(替代 dytableList/batchFieldList),与 containerType 配合
     * 所有容器(tab/card/collapse/splitter/step/dialog/drawer/descriptions/fieldset/app/dytable/table)数据统一存于此
     * 新增容器类型无需新增属性,差异化属性放 preps
     */
    containerFields?: ContainerFieldInfo[];
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
    /**
     * 子节点,在多级表头中使用，需考虑怎么在表单中正确渲染显示
     */
    children?: FieldInfo[];
    /**
     * 数据类型，静态文本，
     */
    staticData?: boolean;
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
    /**
     * 类型转换选项
     */
    typeConvert?: string;
    /**
     * 转换表达式
     */
    transform?: string;
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
     * 是否覆盖原来的方法
     */
    override?: boolean;
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
    orderBy: string;
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
    subTableName: string;
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

 * dytable 容器特有属性(存于 ContainerFieldInfo.preps,containerType='dytable')
 * 方便查看该容器支持的参数
 */
export declare interface DytablePreps {
    showLineNumber?: boolean;
    allowResize?: boolean;
    styles?: { width?: string; height?: string; overflow?: string };
}

/**
 * table 容器特有属性(存于 ContainerFieldInfo.preps,containerType='table')
 * 由原 BatchFieldInfo 差异属性迁移而来,方便查看该容器支持的参数
 */
export declare interface BatchTablePreps {
    initRows?: number;
    batchDefaultData?: any;
    compUrl?: ApiUrls;
    importInfo?: ImportInfo;
    staticData?: string;
    formFlag?: string;
    disVisible?: boolean;
    helpMsg?: string;
}

/**
 * 页面属性信息
 */
export declare interface PageFieldInfo {
    /**
     * 表单属性
     */
    fieldList?: FieldInfo[] | any;
    /**
     * 统一容器字段(替代 batchFieldList),顶层容器子项统一存于此
     */
    containerFields?: ContainerFieldInfo[];
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
    subTableName?: string;
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
