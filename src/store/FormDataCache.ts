import { defineStore } from "pinia";
import { ref } from "vue";
import { FormDataProp } from "@/sample/commonpage/dynamic_form_utils";

export const useFormDataCacheStore = defineStore(
  "formDataCache",
  () => {
    // 缓存存储，key 为 param，value 为表单数据
    const cache = ref<Map<string, FormDataProp>>(new Map());
    // 最大缓存数量，防止内存泄漏
    const MAX_CACHE_SIZE = 10;
    // 缓存访问顺序队列，用于 LRU 淘汰
    const accessQueue = ref<string[]>([]);

    /**
     * 深拷贝获取缓存数据，避免引用问题导致缓存被修改
     * 使用 structuredClone 替代 JSON.parse(JSON.stringify)：
     * - 性能提升约 10 倍
     * - 支持 Date、Map、Set、ArrayBuffer 等类型
     * - 不会丢失 undefined / 函数之外的所有类型
     * @param param 表单参数
     * @returns 表单数据的深拷贝，如果不存在返回 undefined
     */
    const getFormData = (param: string): FormDataProp | undefined => {
      const data = cache.value.get(param);
      if (!data) return undefined;
      // 更新访问顺序
      updateAccessOrder(param);
      return structuredClone(data);
    };

    /**
     * 更新访问顺序，将访问的项移到队列末尾 (最新)
     */
    const updateAccessOrder = (param: string) => {
      const index = accessQueue.value.indexOf(param);
      if (index > -1) {
        accessQueue.value.splice(index, 1);
      }
      accessQueue.value.push(param);
    };

    /**
     * 设置表单数据到缓存 (存储深拷贝)
     * @param param 表单参数
     * @param data 表单数据
     */
    const setFormData = (param: string, data: FormDataProp) => {
      // 如果缓存已满且是新项，删除最久未使用的项
      if (!cache.value.has(param) && cache.value.size >= MAX_CACHE_SIZE) {
        const oldestParam = accessQueue.value.shift();
        if (oldestParam) {
          cache.value.delete(oldestParam);
          console.log(
            `[FormDataCache] 缓存已满，删除最久未使用的缓存：${oldestParam}`,
          );
        }
      }
      cache.value.set(param, structuredClone(data));
      updateAccessOrder(param);
    };

    /**
     * 检查缓存中是否存在指定参数的表单数据
     * @param param 表单参数
     * @returns 是否存在
     */
    const hasFormData = (param: string): boolean => {
      return cache.value.has(param);
    };

    /**
     * 删除指定参数的缓存
     * @param param 表单参数
     */
    const deleteFormData = (param: string) => {
      cache.value.delete(param);
      // 同时从访问队列中移除
      const index = accessQueue.value.indexOf(param);
      if (index > -1) {
        accessQueue.value.splice(index, 1);
      }
    };

    /**
     * 清空所有缓存
     */
    const clearAll = () => {
      cache.value.clear();
      accessQueue.value = [];
    };

    /**
     * 获取缓存数量
     * @returns 缓存条目数
     */
    const getCacheSize = (): number => {
      return cache.value.size;
    };

    return {
      cache,
      getFormData,
      setFormData,
      hasFormData,
      deleteFormData,
      clearAll,
      getCacheSize,
    };
  },
  {
    persist: false, // 不需要持久化，页面刷新后重新加载即可
  },
);
