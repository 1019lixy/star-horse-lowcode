import { isJson } from "@/api/star_horse_utils";
import { uuid } from "@/api/system";

/**
 * 按点号路径拆分取值:支持 "a.b.c" 形式的嵌套属性访问
 * @param key 属性路径
 * @param row 数据行
 * @returns 属性值,找不到时返回 uuid(保证行唯一性)
 */
export const splitKey = (key: string, row: any): any => {
  let arr = key?.split(".");
  if (arr?.length > 1) {
    let temp = row;
    for (const k of arr) {
      temp = temp?.[k];
    }
    return temp;
  } else {
    return row?.[key] ?? uuid();
  }
};
/**
 * 解析主键配置的字段名
 * 字符串主键直接返回;{source, dist} 别名对象返回 dist(后端识别字段)
 * @param key 主键配置项,字符串或 {source, dist} 对象
 */
export const resolveKeyName = (key: any): string =>
  isJson(key) ? key.dist : key;

/**
 * 解析主键:支持字符串/数组/对象别名形式
 * @param keys 主键,字符串或数组(支持 {source, dist} 别名)
 * @param row 数据行
 * @returns 单主键返回值,复合主键返回 {dist1:val1, dist2:val2}
 */
export const analysisPrimaryKeys = (keys: any, row: any): any => {
  if (Array.isArray(keys)) {
    let obj: any = {};
    for (let key of keys) {
      if (isJson(key)) {
        obj[key.dist] = splitKey(key.source, row);
      } else {
        obj[key] = splitKey(key, row);
      }
    }
    return obj;
  } else {
    return splitKey(keys, row);
  }
};
