/**
 * 缓存数据
 * @param key
 * @param data
 */
const setCacheData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};
/**
 * 获取缓存数据
 * @param key
 */
const getCacheData = (key: string) => {
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    return null;
};
/**
 * 获取并删除缓存数据
 * @param key
 */
const getAndDelCacheData = (key: string) => {
    const data = getCacheData(key);
    delCacheData(key);
    return data;
};
/**
 * 删除缓存数据
 * @param key
 */
const delCacheData = (key: string) => {
    localStorage.removeItem(key);
};
export {setCacheData, getCacheData, getAndDelCacheData, delCacheData};
