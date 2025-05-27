import {SearchParams} from '@/components/types/Params';
import {isJson} from '@/api/star_horse_utils';
import {useDark, useToggle} from '@vueuse/core';
import {v4 as uuidv4} from 'uuid';
import {DyCompField} from '@/components/types/DyCompField';
import {computed, createApp, Ref, ref, unref} from 'vue';
import App from '@/App.vue';

/**
 * UUID
 */
export function uuid() {
    return 'sh' + uuidv4();
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


/**
 * 动态创建组件
 * @param compInfo 组件信息
 */
export function createComponent(compInfo: DyCompField) {
    const app = createApp(App);
    return app.component(compInfo.name, {
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
