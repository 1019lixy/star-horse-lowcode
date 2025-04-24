import {TreeNodeData} from 'element-plus/es/components/tree-v2/src/types';
import {SearchInfo, SearchParams} from '@/components/types/Params';
import {createCondition, isJson, loadData} from '@/api/star_horse_utils.ts';
import {SelectOption} from '@/components/types/SearchProps';
import {useDark, useToggle} from '@vueuse/core';
import {useGlobalConfigStore} from '@/store/GlobalConfig.ts';
import piniaInstance from '@/store';
import {v4 as uuidv4} from 'uuid';
import {FieldInfo} from '@/components/types/PageFieldInfo';
import {DyCompField} from '@/components/types/DyCompField';
import {computed, createApp, Ref, unref, ref} from 'vue';
import previewImage from 'preview-image-js';
import 'preview-image-js/icon.js';
import App from '@/App.vue';

const validUrl: string = '/userdb-manage/redirect/valid';
const redirectUrl: string = '/userdb-manage/redirect/valid';
const configStore = useGlobalConfigStore(piniaInstance);

/**
 * UUID
 */
export function uuid() {
    return 'sh' + uuidv4();
}

/**
 * 点击事件
 * @param treeComp 树组件对象
 * @param tableComp 表格组件对象
 * @param dataForm form表单数据
 * @param data 树节点
 * @param checked
 */
export function treeCheckChange(tableComp: any, data: TreeNodeData) {
    // const checkedNodes = treeComp.getCheckedNodes();
    // if (checkedNodes?.length > 0) {
    //     checkedNodes.forEach((item: any) => {
    //         treeComp.setChecked(item.value, false);
    //     });
    // }
    // dataForm["idInformations"] = data.value;
    // treeComp.setChecked(data.value, (checked instanceof Boolean) ? checked : true);
    // if (!checked) {
    //     return;
    // }
    const conditions: Array<SearchParams> = [];
    // if (checked) {
    conditions.push(createCondition('idInformations', data.value));
    // }
    tableComp.setDataInfo(conditions, null);
    searchData(tableComp, conditions);
}

/**
 * 调用Table组件查询数据
 * @param tableComp
 * @param data
 */
export function searchData(tableComp: any, data: SearchParams[]) {
    tableComp.createSearchParams(data);
}

/**
 * 解析属性
 * @param dataList
 * @param name
 */
export function parseFormData(dataList: any, name: string) {
    const filterRecursive = (node: any) => {
        // 如果节点是数组，则对每个元素应用过滤逻辑
        if (Array.isArray(node)) {
            const result: Array<any> = node.map((child) => filterRecursive(child)).filter((item) => item !== null);
            return result;
        }
        const containsData = node.preps.name == name;
        return containsData ? node : null;
    };
    const filterDatas = filterRecursive(dataList);
    return filterDatas.length > 0 ? filterDatas[0] : {};
}

/**
 * 获取打印机列表
 */
export async function printerList(): Promise<Array<SelectOption>> {
    const getData = {
        type: 'getPrinter'
    };
    const options: Array<SelectOption> = [];
    //创建一个实例
    const ws = new WebSocket(import.meta.env.VITE_PRINTER_URL);
    //用于指定连接成功后的回调函数
    ws.onopen = (_evt) => {
        console.log('Connection open ...');
        ws.send(JSON.stringify(getData));
    };
    //用于指定连接关闭后的回调函数
    ws.onclose = (_event) => {
        // let _code: number = event.code;
        // let _reason: string = event.reason;
        // let _wasClean: boolean = event.wasClean;
    };
    //
    return await new Promise((resolve, reject) => {
        //用于指定收到服务器数据后的回调函数
        ws.onmessage = (event) => {
            const data = event.data;
            const printers = JSON.parse(data)['data'];
            if (printers) {
                printers.forEach((item: any) => {
                    options.push({name: item, value: item});
                });
                resolve(options);
            } else {
                reject('获取打印机失败');
            }
        };
    });
}

/**
 * 升序或者降序
 */
export function ascOrDesc(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: 'Asc', value: 'asc'});
    options.push({name: 'Desc', value: 'desc'});
    return options;
}

/**
 * 请求方式
 */
export function httpMethod(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: 'GET', value: 'GET'});
    options.push({name: 'HEAD', value: 'HEAD'});
    options.push({name: 'POST', value: 'POST'});
    options.push({name: 'PUT', value: 'PUT'});
    options.push({name: 'PATCH', value: 'PATCH'});
    options.push({name: 'DELETE', value: 'DELETE'});
    options.push({name: 'OPTIONS', value: 'OPTIONS'});
    options.push({name: 'TRACE', value: 'TRACE'});
    return options;
}

/**
 * 数据格式
 */
export function dataType(): SelectOption[] {
    const options: SelectOption[] = [];
    options.push({name: 'FORM', value: 'FORM'});
    options.push({name: 'JSON', value: 'JSON'});
    options.push({name: 'BINARY', value: 'BINARY'});
    return options;
}

/**
 * 验证接口，并取回数据
 * @param url
 * @param params 参数
 * @param dataType 数据类型 FORM,JSON 默认JSON
 * @param httpMethod 接口请求方式 POST,GET,PUT,DELETE
 */
export async function validDataUrl(url: string, params?: any, dataType: string = 'JSON', httpMethod: string = 'POST') {
    const checkParams: any = {
        url,
        httpMethod: httpMethod.toUpperCase(),
        dataType,
        params: params
    };
    const data = await loadData(validUrl, checkParams);
    return {...data};
}

/**
 * 通过系统重定向接口
 * @param url 接口地址
 * @param params 参数
 * @param searchInfo 查询信息
 * @param dataType 请求数据类型
 * @param httpMethod 请求类型
 */
export async function redirectUrlOperation(
    url: string,
    searchInfo?: SearchInfo,
    params?: any,
    dataType: string = 'JSON',
    httpMethod: string = 'POST'
) {
    const checkParams: any = {
        url,
        httpMethod: httpMethod.toUpperCase(),
        dataType,
        params: params,
        searchInfo
    };
    const data = await loadData(redirectUrl, checkParams);
    return data;
}

export const isDark = useDark();
isDark.value = false;
export const toggle = useToggle(isDark);
export const toggleDark = (val: string) => {
    // event.stopPropagation();
    // event.preventDefault();
    //
    if (val == 'dark') {
        configStore.clearAll('Y');
        const dark = '#141414';
        document.documentElement.style.setProperty('--star-horse-style', dark);
        document.documentElement.style.setProperty('--el-color-primary', dark);
        document.documentElement.style.setProperty('--el-select-input-color', dark);
        document.documentElement.style.setProperty('--star-horse-shadow', dark);
        document.documentElement.style.setProperty('--star-horse-background', dark);
        document.documentElement.style.setProperty('--el-pagination-button-color', dark);
        document.documentElement.style.setProperty('--el-tree-expand-icon-color', dark);
    } else {
        document.documentElement.style.setProperty('--star-horse-background', '#fff');
        document.documentElement.style.setProperty('--star-horse-shadow', '#f7f7f9');
        configStore.clearAll();
    }
    toggle();
};

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
 * 公共字段
 */
export function commonField() {
    const fields: FieldInfo[] = [];
    fields.push({
        label: '创建人',
        fieldName: 'createdBy',
        type: 'input',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '创建日期',
        fieldName: 'createdDate',
        type: 'date',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '修改人',
        fieldName: 'updatedBy',
        type: 'input',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '修改日期',
        fieldName: 'updatedDate',
        type: 'date',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '备注',
        fieldName: 'remark',
        type: 'textarea',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '数据编号',
        fieldName: 'dataNo',
        type: 'input',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '数据版本号',
        fieldName: 'version',
        type: 'number',
        formVisible: false,
        listVisible: false
    });

    fields.push({
        label: '状态',
        fieldName: 'statusName',
        type: 'input',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '状态码',
        fieldName: 'statusCode',
        type: 'input',
        formVisible: false,
        listVisible: false
    });

    fields.push({
        label: '国际码',
        fieldName: 'local',
        type: 'input',
        formVisible: false,
        listVisible: false
    });
    fields.push({
        label: '是否已逻辑',
        fieldName: 'isDel',
        type: 'number',
        formVisible: false,
        listVisible: false
    });

    return fields;
}

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

/**
 * 根据值，遍历树，找到满足条件的数据
 * @param nodes
 * @param valueFieldName
 * @param value
 */
export function findNodesWithValue(nodes: Array<any>, valueFieldName: string, value: any) {
    const findDdatas: Array<any> = [];
    const traverse = (children: Array<any>) => {
        for (const i in children) {
            const node = children[i];
            if (node[valueFieldName] == value) {
                findDdatas.push(node);
            }
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            }
        }
    };
    traverse(nodes);
    return findDdatas;
}

/**
 * 预览图片
 * @param images
 */
export function imagesPreview(images: Array<string> | string) {
    const imagesUrl = Array.isArray(images) ? images : [images];
    previewImage({
        images: imagesUrl, // 该属性是必填项，其他属性都是非必填。images表示图片地址数组, 也可以是一个object[], object格式为{url: '', name: '', type: '', id: ''}
        index: 1, // 初始状态显示图片的索引，默认为0
        fileType: 'image', // 文件类型，默认为image，可选项为image, auto。image表示将所有文件都显示为图片；auto表示自动判断文件类型，图片用img标签展示，其他类型文件只展示图标和名称，图标类型有audio、video、word、ppt、excel、pdf、other
        loop: true, // 是否循环，默认为true
        thumbnail: true, // 是否显示缩略图预览，默认为true
        thumbnailDraggable: true, // 是否允许拖拽缩以更改略图位置，默认为true
        toolbar: true, // 是否显示工具栏，包括放大缩小、旋转、适应窗口、实际尺寸、删除、下载，默认为true
        delete: true, // 是否显示删除按钮，默认为false，当toolbar为true时生效
        onDelete: (_index: number, _url: string, _id: string | number) => {
            // 删除回调，默认为空函数，若不允许删除或者删除失败，返回Promise.reject即可（throw Error也可以）
            console.log('删除', _index);
            // return Promise.reject('无权限')
        },
        download: true, // 是否显示下载按钮，默认为false, 当toolbar为true时生效
        onDownload: (_index: number, _url: string, _id: any) => {
            // 下载回调，不传的话会用内置的下载方法来下载图片到本地
            console.log('下载', _index);
        },
        onClose: () => {
            // 关闭回调，默认为空，可以在此处做一些清理工作，比如在移动端解除对返回键的拦截
            console.log('关闭');
        },
        onFileClick: (_index: number, _url: string, _id: any) => {
            // 点击非图片格式文件的回调，可以在此处做跳转等操作
            window.open('preview url'); // 可以打开预览链接
        },
        clickableFileTypes: ['pdf'], // 点击非图片格式文件时，只允许点击这些文件类型，会设置hover样式，当onFileClick不为空时生效，默认为all，即所有类型都可以点击
        buttonTooltip: true, // 是否显示按钮提示，默认为true，若设为false，则不会显示按钮提示
        // 以下是语言配置，可以自定义，默认为中文
        thumbnailTitleText: 'overview', // 缩略图标题，默认为’缩略图‘
        maxZoomText: 'It\'s already the maximum size', // 放大到最大时提示，默认为’已放到最大‘
        minZoomText: 'It\'s already the smallest', // 缩小到最小时提示，默认为’已缩到最小‘
        fitText: 'fit to screen', // 适应屏幕提示，默认为’适应屏幕‘
        actualSizeText: 'actual size', // 实际尺寸提示，默认为’实际尺寸‘
        zoomInText: 'zoom in', // 放大提示，默认为’放大‘
        zoomOutText: 'zoom out', // 缩小提示，默认为’缩小‘
        rotateLeftText: 'rotate left', // 逆时针旋转提示，默认为’左转‘
        rotateRightText: 'rotate right', // 顺时针旋转提示，默认为’右转‘
        downloadText: 'download', // 下载提示，默认为’下载‘
        deleteText: 'delete', // 删除提示，默认为’删除‘
        nextText: 'next', // 下一张提示，默认为’下一张‘
        prevText: 'prev', // 上一张提示，默认为’上一张‘
        firstText: 'It\'s already the first one', // 第一张提示，默认为’已到第一个‘
        lastText: 'It\'s already the last one', // 最后一张提示，默认为’已到最后一个‘
        closeText: 'Close' // 关闭提示，默认为’关闭‘
    });

    // closeDialog() // 该方法可以关闭预览窗口，比如在移动端监听返回键，在返回键拦截的情况下，点击返回键可以调用该方法关闭预览窗口
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
