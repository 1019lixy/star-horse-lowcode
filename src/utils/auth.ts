import { Config } from "@/api/settings";
import { SearchParams } from "@/components/types/Params";
import JSON5 from "json5";

export function getToken() {
  return sessionStorage.getItem(Config.TokenKey);
}

export function setUserInfo(userInfo: any) {
  const s = JSON5.stringify(userInfo);
  sessionStorage.setItem(Config.loginInfo, s);
}

export function setPublicKey(publicKey: string) {
  sessionStorage.setItem(Config.publicKey, publicKey);
}

export function getPublicKey() {
  return sessionStorage.getItem(Config.publicKey);
}

/**
 * 设置客户信息
 * @param customerInfo
 */
export function setCustomerInfo(customerInfo: any) {
  const s = JSON5.stringify(customerInfo);
  sessionStorage.setItem(Config.customerInfo, s);
}

/**
 * 获取客户信息
 */
export function getCustomerInfo() {
  const str = sessionStorage.getItem(Config.customerInfo);
  //未找到客户编码
  if (!str || str == "undefined") {
    return null;
  }
  return JSON5.parse(str);
}

/**
 * 获取查询对象
 */
export function getCustomerParam(
  propertyName: string = "",
): SearchParams | null {
  const customerInfo = getCustomerInfo();
  if (!customerInfo || !propertyName) {
    return null;
  }
  return { propertyName: propertyName, value: customerInfo.dataNo };
}

export function getUserInfo() {
  const userInfo = sessionStorage.getItem(Config.loginInfo);
  //未找到用户信息
  if (!userInfo) {
    return null;
  }
  return JSON5.parse(userInfo);
}

/**
 * 检测是否系统管理员
 */
export function isSystemManage(): boolean {
  const roleList = getUserInfo()?.rolesList?.filter(
    (item: any) => item.roleType == 3,
  );
  return roleList && roleList.length > 0;
}

export function setToken(token: string, rememberMe: any) {
  if (rememberMe) {
    localStorage.setItem(Config.TokenKey, token);
  } else {
    sessionStorage.setItem(Config.TokenKey, token);
  }
}

export function removeToken() {
  sessionStorage.removeItem(Config.TokenKey);
  localStorage.removeItem(Config.TokenKey);
}
