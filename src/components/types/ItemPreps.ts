import { ApiUrls } from "./ApiUrls";
import { FieldInfo, PageFieldInfo } from "./PageFieldInfo";

export interface ItemPreps {
  /**
     * 是否是设计模式

     */
  isDesign?: boolean;
  /**
   * 是否禁用
   */

  disabled?: boolean;
  /**
   * 是否显示在表单中
   */

  showFormItem?: boolean;
  /**
   * 是否是基础组件
   */

  bareFlag?: boolean;
  /**
   * 是否是搜索组件
   */

  isSearch?: boolean;
  /**
   * 组件属性
   */

  field: FieldInfo|any; // 建议替换为实际的Field接口
  /**
   * 父组件属性
   */

  parentField?: any;
  /**
   * 表单信息
   */

  formInfo?: any;
  // 可扩展其他共享属性
  parentId?: string;
  /**
   * 回调函数
   */
  callBack?:Function;
}

export interface ContainerPreps {
  /**
   * 组件url
   */
  compUrl: ApiUrls;
  /**
   * 组件属性
   */
  fieldList?: PageFieldInfo|any;
  /**
   * 组件属性
   */
  item?: any;
  /**
   * 组件名称
   */
  objectName?: string;
  /**
   * 数据索引
   */
  dataIndex?: number;
  // 父节点名称
  propPrefix?: string;
  /**
   * 父组件属性
   */
  parentPreps?: any;
  /**
   * 子表单标识
   */
  subFormFlag?: string;
  /**
   * 批量操作名称
   */
  batchName?: string;
  /**
   * 批量操作字段名称
   */
  batchFieldName?: string;
  /**
   * 主键
   */
  primaryKey: string | any;
  /**
   * 校验规则
   */
  rules?: any;
  /**
   * 组件大小
   */
  compSize: string;
  /**
   * 组件来源
   */
  source: number;
}
