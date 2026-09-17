import { ref } from "vue";

export const Config: any = {
  /**
   * @description 网站标题
   */
  title: "StarHorseDevops",
  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,
  /**
   * @description 固定头部
   */
  fixedHeader: true,
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天s
   */
  passCookieExpires: 1,
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: "STAR-HORSE-TOKEN",
  /**
   * 用户登录信息
   */
  loginInfo: "userInfo",
  /**
   * 客户信息
   */
  customerInfo: "customerInfo",
  reportId: "reportId",
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,
  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 底部文字，支持html语法
   */
  footerTxt: `©Copyright2020-${new Date().getFullYear()} 星骁个人工作室`,
  /**
   * 备案号
   */
  caseNumber: "",
  /**
   * RSA 公钥
   */
  publicKey: "publicKey",
  /**
   * 文件扩展名
   */
  fileExt: ".vue",
  /**
   * 按钮风格
   */
  buttonStyle: ref("dropdown"),
  /**
   * 默认列表宽度
   */
  defaultColumnWidth: "120",
  /**
   * 组件大小
   */
  compSize: "default",
};
