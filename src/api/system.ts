import {SearchParams} from '@/components/types/Params';
import {isJson} from '@/api/star_horse_utils';
import {useDark, useToggle} from '@vueuse/core';
import {v4 as uuidv4} from 'uuid';
import {DyCompField} from '@/components/types/DyCompField';
import {computed, Ref, ref, unref} from 'vue';
import {error, success} from "@/utils/message";

/**
 * UUID
 */
export function uuid() {
    return 'sh' + uuidv4();
}

export async function copyText(text: any) {
    try {
        await navigator.clipboard.writeText(text);
        success('复制成功');
    } catch (err) {
        error('复制失败:' + err);
    }
}

/**
 * 调用Table组件查询数据
 * @param tableComp
 * @param data
 */
export function searchData(tableComp: any, data: SearchParams[]) {
    tableComp.createSearchParams(data);
}

export const isDark = useDark();
isDark.value = false;
export const toggle = useToggle(isDark);

const exclusionItems: Array<any> = [
    'number',
    'switch',
    'rate',
    'slider',
    'datetime',
    'time',
    'time-picker',
    'number-range',
    'textarea',
    'htmleditor',
    'json',
    'json-array',
    'html',
    'signature',
    'markdown'
];
/**
 * 批量修改公共属性
 * @param items
 * @param val
 * @param fieldName
 */
export const batchModifyAction = (items: Array<any>, val: any, fieldName: string) => {
    for (const index in items) {
        const item = items[index];
        if (item.compType == 'container') {
            const sitems = item.preps.elements;
            for (const sindex in sitems) {
                const col = sitems[sindex];
                if (col.columns) {
                    col.columns.forEach((temp: any) => {
                        batchModifyAction(temp.items, val, fieldName);
                    });
                } else {
                    batchModifyAction(col.items, val, fieldName);
                }
            }
        } else {
            // 排除数字类型
            if (!exclusionItems.includes(item.itemType) || fieldName == 'precision') {
                item.preps[fieldName] = val;
            }
        }
    }
};

const inputType = ["input", "textarea", "password", "number", "view-markdown", "json", "json-array"];
const selectType = ["select", "tselect", "cascader", "autocomplete", "area", "cron", "transfer", "dialog-input", "page-select"];

/**
 * 给组件添加placeholder属性
 * @param item
 * @param itemType
 */
export function fieldPlaceholder(item: any, itemType: string) {
    if (!item.preps) {
        item.preps = {};
    }
    if (inputType.includes(itemType)) {
        item.preps['placeholder'] = item.preps['placeholder'] || ("请输入" + item.label);
    } else if (selectType.includes(itemType)) {
        item.preps['placeholder'] = item.preps['placeholder'] || ("请选择" + item.label);
    }
    if (itemType == 'datetime') {
        if (item?.type?.includes("range")) {
            item.preps['startPlaceholder'] = item.preps['startPlaceholder'] || "请选择开始日期";
            item.preps['endPlaceholder'] = item.preps['endPlaceholder'] || "请选择结束日期";
        } else {
            item.preps['placeholder'] = item.preps['placeholder'] || ("请选择" + item.label);
        }
    } else if (itemType == "number-range") {
        item.preps['minPlaceholder'] = item.preps['minPlaceholder'] || ("请输入最小值");
        item.preps['maxPlaceholder'] = item.preps['maxPlaceholder'] || ("请输入最大值");
    }
}

/**
 * 校验组件
 * @param item
 */
export function itemCheck(item: any) {
    //如果不是容器
    if (item?.compType == "formItem") {
        item.label = item.label || item.preps?.label;
        item.fieldName = item.fieldName || item.preps?.fieldName;
        item.type = item.type || item.preps?.itemType;
        item.actionName = item.actionName || item.preps?.actionName;
        item.actions = item.actions || item.preps?.actions;
        fieldPlaceholder(item, item.type);
        // 新增：字符串转函数逻辑
        if (typeof item.actions === 'string') {
            try {
                // 将字符串转换为函数（假设函数需要访问当前 item 上下文，可根据实际参数调整）
                // item.actions = new Function('item', `return ${item.actions}`)(item);
                // 或直接转换为函数体（无参数时）：
                item.actions = new Function(item.actions);
            } catch (e) {
                console.error('actions 字符串转函数失败:', e);
                item.actions = null; // 转换失败时置空避免错误
            }
        }
    }
    return item?.itemType + (item?.compType === 'container' ? '-container' : '-item');
}

/**
 * 动态创建组件
 * @param compInfo 组件信息
 */
export function createComponent(compInfo: DyCompField) {
    const app = __starHorseHostApp__;
    !app && console.log('app is null,please define __starHorseHostApp__');
    // 检查是否已存在同名组件
    const existingComponent = app.component(compInfo.name);
    if (existingComponent) {
        return compInfo.name; // 存在同名组件，返回名称
    }
    app?.component(compInfo.name, {
        components: compInfo.components || {},
        template: compInfo.template,
        data: () => compInfo.data || {},
        props: compInfo.props || {},
        methods: compInfo.methods,
        onMounted: compInfo.onMounted,
        emits: compInfo.emits,
        computed: compInfo.computed,
        watch: compInfo.watch,
        onActivated: compInfo.onActivated,
        onDeactivated: compInfo.onDeactivated
    });
    return compInfo.name;
}

/**
 * 删除查询条件中出现的空值和空对象
 * @param condition
 */
export function removeEmptyCondition(condition: SearchParams[]): SearchParams[] {
    const params: SearchParams[] = [];
    if (!condition || condition.length == 0) {
        return params;
    }
    for (const a in condition) {
        const temp = condition[a];
        if (temp && isJson(temp) && Object.keys(temp).length > 0) {
            params.push(temp);
        }
    }
    return params;
}

/**
 * 组件key
 * @param item
 * @param key
 * @param isComp 是否组件
 * @param prefix 前缀
 * @param suffix 后缀
 */
export function compKey(item: any, key: number | string, isComp?: boolean, prefix?: string, suffix?: string) {
    let name = "";
    if (item) {
        name = item.id || item._uuid || item.fieldName || item.tabName;
    }
    return (prefix ?? "") + name + "_" + (isComp ? 'comp_' : 'temp_') + key + (suffix ?? '');

}

const zIndex = ref(0);
export const DEFAULT_INITIAL_Z_INDEX = 2000;
export const useZIndex = (zIndexOverrides?: Ref<number>) => {
    const zIndexInjection = zIndexOverrides;
    const initialZIndex = computed(() => {
        const zIndexFromInjection = unref(zIndexInjection);
        return zIndexFromInjection ?? DEFAULT_INITIAL_Z_INDEX;
    });
    const currentZIndex = computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
        zIndex.value += 1;
        return currentZIndex.value;
    };

    return {
        initialZIndex,
        currentZIndex,
        nextZIndex
    };
};
