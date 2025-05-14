import {JoinSearchParams, SearchInfo, SearchParams} from '@/components/types/Params';
import {reactive, ShallowRef, unref} from 'vue';
import {ElLoading} from 'element-plus';
import {download, getRequest, postRequest, uploadRequest} from '@/api/star_horse_apis';
import {error, operationConfirm, success, warning} from '@/utils/message';
import {SelectOption} from '@/components/types/SearchProps';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {MenusInfo} from '@/components/types/MenusInfo';
import {BatchFieldInfo, FieldInfo, OrderByInfo, PageFieldInfo, TabFieldInfo} from '@/components/types/PageFieldInfo';
import {ApiUrls} from '@/components/types/ApiUrls';
import {Reactive} from 'vue';
import {DialogProps} from '@/components/types/DialogProps';
import {createDatetime} from '@/api/date_utils';
import {pinyin} from 'pinyin-pro';
import {ServiceEnums} from '@/components/enums/ServiceEnums';

let loading: any = null;
/**
 * 系统接口
 */
const systemUrl: string = `${ServiceEnums.SYSTEM_PREFIX}informationsEntity/systemTree`;
/**
 * 字典接口
 */
const dictUrl: string = `${ServiceEnums.SYSTEM_PREFIX}dictinfoEntity/getAllByCondition`;
/**
 * 获取所有菜单
 */
const menuUrl: string = `${ServiceEnums.SYSTEM_PREFIX}menusinfoEntity/getAllTreeDataByCondition`;
/**
 * 归属主体
 */
const customerUrl: string = `${ServiceEnums.SYSTEM_PREFIX}customer/getAllByCondition`;

/**
 * 加载Post 数据
 * @param url 接口地址
 * @param params 参数
 * @param orderBy 排序
 */
export async function loadData(url: string, params: SearchParams[] | any, orderBy: OrderByInfo[] = []) {
    let data: any = null;
    let error = '';
    let cond = params;
    if (params instanceof Array) {
        cond = {
            fieldList: params,
            orderBy: orderBy
        };
    }
    await postRequest(url, cond)
        .then((res: any) => {
            const redata = res.data;
            if (redata.code) {
                error = redata.cnMessage;
            } else {
                //先去分页数据，没有再去非分页数据
                data = redata.data.dataList || redata.data;
            }
        })
        .catch((err) => {
            error = err;
        });
    return {
        data,
        error
    };
}

/**
 * 加载Get 数据
 * @param url 接口地址
 * @param params 参数
 */
export async function loadGetData(url: string) {
    let data = reactive<any>([]);
    let error: string = '';
    await getRequest(url)
        .then((res) => {
            const redata = res.data;
            if (redata.code != 0) {
                error = redata.cnMessage;
            } else {
                data = redata.data;
            }
        })
        .catch((err) => {
            error = err;
        });
    return {
        data,
        error
    };
}

/**
 * 加载所有系统信息
 * @param params 查询参数
 */
export async function loadSystemInfo(params: any) {
    let systemList: SelectOption[] = [];
    await postRequest(systemUrl, {
        fieldList: params
    })
        .then((res) => {
            const redata = res.data;
            if (redata.code == 0) {
                const data = redata.data;
                if (redata.data) {
                    systemList = createTree(data, 'idInformations', 'sysName', '');
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    return systemList;
}

/**
 * 加载所有主体信息
 * @param params 查询参数
 */
export async function loadCustomInfo(params: any) {
    const customerList: SelectOption[] = [];
    await postRequest(customerUrl, {
        fieldList: params
    })
        .then((res) => {
            const redata = res.data;
            if (redata.code == 0) {
                const data = redata.data;
                if (redata.data) {
                    data.forEach((item: any) => {
                        const temp: SelectOption = {name: item.customerName, value: item.idCustomer};
                        customerList.push(temp);
                    });
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    return customerList;
}

/**
 * 加载部门信息
 * @param param 查询参数
 */
export async function loadDepartmentInfo(param: any) {
    let deptData: any = [];
    await postRequest(`${ServiceEnums.SYSTEM_PREFIX}departmentEntity/deptTree`, {
        fieldList: param
    })
        .then((res) => {
            if (res.data.code != 0) {
                console.warn(res.data.cnMessage);
            } else {
                deptData = res.data.data;
            }
        })
        .catch((err) => console.error(err));
    return deptData;
}

/**
 * 获取角色信息
 * @param param
 */
export async function loadRolesInfo(param: any) {
    const roleData: SelectOption[] = [];
    await postRequest(`${ServiceEnums.SYSTEM_PREFIX}rolesinfoEntity/queryUserAllRoles`, {
        fieldList: param
    })
        .then((res) => {
            if (res.data.code) {
                console.warn(res.data.cnMessage);
            } else {
                const redata = res.data.data;
                redata.forEach((item: any) => {
                    roleData.push({name: item.roleName, value: item.idRolesinfo});
                });
            }
        })
        .catch((err) => console.error(err));
    return roleData;
}

/**
 * 加载菜单数据
 * @param direct
 * @param params
 * @param needSystem
 */
export async function loadMenusInfo(direct: boolean, params: any, needSystem: boolean) {
    let menuDatas: any = [];
    await postRequest(`${menuUrl}/${needSystem}`, {
        fieldList: params,
        orderBy: [{fieldName: 'idInformations'}]
    })
        .then((res) => {
            const redata = res.data;
            if (redata.code != 0) {
                console.warn(redata.cnMessage);
            } else {
                if (direct) {
                    menuDatas = redata.data;
                } else {
                    //构建菜单树
                    menuDatas = createTree(redata.data, 'idMenusinfo', 'menuName', '');
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    return menuDatas;
}

/**
 * 构建菜单树
 * @param data
 * @param valField 字符串值
 * @param name
 * @param val 数字值
 */
export function createTree(data: any, valField: string, name: string, val: string) {
    const list: SelectOption[] = [];
    data.forEach((item: any) => {
        const temp: any = {};
        temp['value'] = valField ? item[valField] : parseInt(item[val]);
        temp['name'] = item[name];
        if (item.children && item.children.length > 0) {
            temp['children'] = createTree(item.children, valField, name, val);
        }
        list.push(temp);
    });
    return list;
}

/**
 * 加载框
 * @param msg
 * @param defaultTarget
 */
export function load(msg: string, defaultTarget?: string) {
    closeLoad();
    loading = ElLoading.service({
        lock: true,
        target: defaultTarget ?? '#app',
        text: msg || 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)'
    });
}

/**
 * 关闭加载框
 */
export function closeLoad() {
    if (loading) {
        loading.close();
        loading = null;
        $('.el-loading-mask').remove();
    }
}

/**
 * 公共数据格式化
 * @param _row
 * @param column
 * @param cellValue
 * @param _index
 */
export function commonDataFormat(_row: any, column: any, cellValue: any, _index: number) {
    return commonParseCodeToName(column.property, cellValue);
}

/**
 * 下划线转驼峰
 * @param str
 */
export function convertToCamelCase(str: string) {
    if (!str) {
        return undefined;
    }
    str = str.toLowerCase();
    return str.replace(/_(\w)/g, (_match, p1) => {
        return p1.toUpperCase();
    });
}

/**
 * 驼峰转下划线
 * @param str
 */
export function camelCaseToUnderline(str: string) {
    if (!str) {
        return undefined;
    }
    return str.replace(/[A-Z]/g, (match, _p1) => {
        return '_' + match.toLowerCase();
    });
}

/**
 * 数据格式化
 * @param name
 * @param cellValue
 */
export function commonParseCodeToName(name: string, cellValue: any) {
    if (!cellValue && cellValue != 0) {
        return '-';
    }
    if (name == 'isDel' || name.includes('&isDel')) {
        return cellValue == 1 ? '是' : '否';
    }
    if (name == 'state' || name.includes('&state')) {
        return cellValue == 1 ? '正常' : '异常';
    }
    const preps: Array<string> = ['createdTime', 'updatedTime', 'createdDate', 'updatedDate', 'createTime', 'editTime'];
    const result = preps.find(
        (item) => name?.includes('&' + item) || convertToCamelCase(name)?.toLowerCase() === item.toLowerCase()
    );
    if (result) {
        return createDatetime(cellValue);
    } else {
        return cellValue;
    }
}

/**
 * 加载Id数据
 * @param url
 * @param id
 * @param params
 */
export async function loadById(url: string, id: any, params: any = {}) {
    if (!url || 'undefined' == id) {
        warning('请提供正确的数据');
        return;
    }
    let objData: any = {};
    const suffix: string = id ? '/' + id : '';
    await postRequest(url + suffix, params).then((res) => {
        const redata = res.data.data;
        if (!redata) {
            warning('未找到对应数据');
        } else {
            objData = redata;
        }
    });
    return objData;
}

/**
 * 根据Id删除数据
 * @param url
 * @param ids
 * @param msg 删除提示
 */
export async function deleteByIds(url: string, ids: any, msg: string = '确认需要删除选择的数据吗？') {
    if (!url) {
        warning('请提供正确的数据');
        return;
    }
    if (!ids || ids.length == 0) {
        warning('请选择要删除的数据');
        return;
    }
    let objData: boolean = false;
    const confirmFlag: boolean = await operationConfirm(msg);
    if (!confirmFlag) {
        return;
    }
    await postRequest(url, ids)
        .then((res) => {
            if (res.data.code == 0) {
                success(res.data.cnMessage);
            } else {
                warning(res.data.cnMessage);
            }
            closeLoad();
            objData = true;
        })
        .catch((err) => {
            error('接口不存在或网络异常:' + err);
            objData = false;
        })
        .finally(() => {
            closeLoad();
        });
    return objData;
}

/**
 * 根据字典类别获取字典数据
 * @param dictType 字典类别
 * @param exclusion 排除字典项
 */
export async function dictData(dictType: string, exclusion: Array<string> = []) {
    const query = [];
    query.push({
        propertyName: 'dictType',
        value: dictType
    });
    const dicts: SelectOption[] = [];
    await postRequest(dictUrl, {fieldList: query})
        .then((res) => {
            const redata = res.data;
            if (redata.code == 0) {
                redata.data?.forEach((item: any) => {
                    if (exclusion && exclusion.includes(item.dictCode)) {
                        return;
                    }
                    dicts.push({name: item.dictName, value: item.dictCode});
                });
            }
        })
        .catch((err: any) => {
            console.log('接口不存在或网络异常', err);
        });
    return dicts;
}

/**
 * 加载ElementPlus 提供的官方矢量图标
 */
export function loadElementPlusIcon() {
    const menuIconList = [];
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        menuIconList.push({name: key, value: component.name});
    }
    return menuIconList;
}

/**
 * 自定义的svg图标
 */
export function loadSvgIcons() {
    const items = import.meta.glob('/src/icons/*.svg');
    const menuIconList = [];
    for (const item of Object.entries(items)) {
        const key = item[0];
        const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
        menuIconList.push({name: name, value: name});
    }
    return menuIconList;
}

/**
 * 数据匹配方式
 */
export function searchMatchList(): SelectOption[] {
    const data: SelectOption[] = [];
    data.push({name: '等于', value: 'eq'});
    data.push({name: '不等于', value: 'ne'});
    data.push({name: '模糊', value: 'lk'});
    data.push({name: '为空', value: 'ul'});
    data.push({name: '不为空', value: 'nu'});
    data.push({name: '左模糊', value: 'llk'});
    data.push({name: '右模糊', value: 'rlk'});
    data.push({name: '不匹配', value: 'nlk'});
    data.push({name: '小于', value: 'lt'});
    data.push({name: '小于或等于', value: 'lte'});
    data.push({name: '大于', value: 'gt'});
    data.push({name: '大于或等于', value: 'gte'});
    data.push({name: '范围', value: 'bt'});
    return data;
}

/**
 * 复制数据
 * @param msg
 */
export function copy(msg: string) {
    navigator.clipboard
        .writeText(msg)
        .then(() => {
            success('已复制');
        })
        .catch(() => {
            error('复制失败');
        });
}

/**
 * 表格序号
 * @param row
 * @param rowIndex
 */
export function rowClassName({row, rowIndex}: any) {
    if (row) {
        row.xh = rowIndex + 1;
    }
}

/**
 * 创建条件
 */
export function createCondition(name: string, val: any, matchType: string = 'eq'): SearchParams {
    return {propertyName: name, value: val, operation: matchType};
}

/**
 * 创建关联条件
 * @param leftFieldName 左表字段名称
 * @param rightFieldName 右表字段名称
 * @param matchType 匹配方式
 */
export function createJoinCondition(
    leftFieldName: string,
    rightFieldName: string,
    matchType: string = 'eq'
): JoinSearchParams {
    return {leftFieldName, rightFieldName, operation: matchType};
}

/**
 * 解析已组装的条件
 * @param conditions
 * @param name
 */
export function analysisField(conditions: SearchParams[], name: string) {
    return conditions.find((item) => item.propertyName?.endsWith(name)) || {};
}

/**
 * 动态过滤数据
 * @param search
 * @param menusList
 */
export function filterTree(search: any, menusList: MenusInfo[]): MenusInfo[] {
    // let tempData = permissionMenuList.value;
    const filterRecursive = (node: any, parentInclude: any) => {
        // 如果节点是数组，则对每个元素应用过滤逻辑
        if (Array.isArray(node)) {
            const result: Array<any> = node
                .map((child) => filterRecursive(child, parentInclude))
                .filter((item) => item !== null);
            return result;
        }
        const containsData = !search || node.meta?.title.toLowerCase().includes(search?.toLowerCase());
        const includeNode = parentInclude || containsData;
        const filteredChildren: any =
            node.children && node.children.length > 0 ? filterRecursive(node.children, includeNode) : [];
        return includeNode || filteredChildren.length > 0 ? {...node, children: filteredChildren} : null;
    };
    const filteredTree = filterRecursive(menusList, false);
    return JSON.parse(JSON.stringify(filteredTree));
}

/**
 * 设置css 全局变量
 * @param name 变量名称
 * @param val 变量值
 * @param dom
 */
export function setCssVar(name: string, val: any, dom = document.documentElement) {
    dom.style.setProperty(name, val);
}

/**
 * 获取关联属性逻辑
 * @param formFields 表单属性
 * @param fieldName 属性名称
 * @param batchName 关联Key 如果有
 * @param xh 列序号
 */
export function relationFieldOperation(
    formFields: any,
    fieldName: string,
    batchName: string | null,
    xh: number | null
): any {
    if (batchName) {
        const tempList = formFields[batchName];
        for (const index in tempList) {
            const tmpIndex = +index;
            const item = tempList[index] as Array<ShallowRef>;
            //数组
            if (tmpIndex + 1 === xh) {
                for (const ind in item) {
                    const temp = item[ind].value;
                    if (temp.preps.name == fieldName) {
                        return temp;
                    }
                }
            }
        }
    } else {
        return formFields[fieldName].value;
    }
}

/**
 * 判断是不是Json
 * @param v
 */
export function isJson(v: any) {
    if (v && typeof v === 'string') {
        const start = v.substring(0, 1);
        const end = v.substring(v.length - 1, v.length);
        return (start == '{' && end == '}') || (start == '[' && end == ']');
    }
    if (typeof v === 'object' && Object.prototype.toString.call(v).toLowerCase() === '[object object]' && !v.length) {
        return true;
    }
    return false;
}

/**
 * 解析表单字段映射
 * @param fieldList
 */
export function formFieldMapping(fieldList: PageFieldInfo) {
    let defaultDatas: any = {};
    const actions: Array<any> = [];
    //解析出字段之间的映射关系
    const mappingFields: Array<any> = [];
    const tempList = fieldList?.fieldList;
    const batchDefaultValues: any = {};
    const tabOperation = (data: TabFieldInfo) => {
        const fieldList = data.fieldList as Array<FieldInfo>;
        if ('Y' == data.subFormFlag) {
            defaultDatas[data.tabName] = {};
            //如果是子表
            fieldsOperation(fieldList, defaultDatas[data.tabName]);
        } else {
            fieldsOperation(fieldList, defaultDatas);
        }
    };
    const tableOperation = (batchTempList: Array<BatchFieldInfo>) => {
        for (const key in batchTempList) {
            const temp = batchTempList[key];
            if (!defaultDatas[temp.batchName]) {
                defaultDatas[temp.batchName] = [];
            }
            if (!batchDefaultValues[temp.batchName + 'DefaultValue']) {
                batchDefaultValues[temp.batchName + 'DefaultValue'] = [];
            }
            const fieldList = temp.fieldList as Array<FieldInfo>;
            let tempData: any = {};
            fieldList?.forEach((item) => {
                if (item.defaultValue) {
                    if (isJson(item.defaultValue)) {
                        let subTemp = {...batchDefaultValues[temp.batchName], ...item.defaultValue};
                        Object.entries(subTemp).forEach(([key, value]) => {
                            tempData[key] = value;
                        });
                    } else {
                        tempData[item.fieldName] = item.defaultValue;
                    }
                }
                if (item.aliasName) {
                    mappingFields.push({name: item.fieldName, alias: item.aliasName});
                }
                if (item.actions) {
                    actions.push({
                        batchName: temp.batchName,
                        actionNames: item.actionName,
                        actions: item.actions,
                        fieldName: item.fieldName
                    });
                }
            });
            batchDefaultValues[temp.batchName + 'DefaultValue'].push(tempData);
        }
    };
    const fieldsOperation = (dataList: any, defaultData: any) => {
        for (const key in dataList) {
            const temp = dataList[key];
            if (temp instanceof Array) {
                temp.forEach((item: FieldInfo) => {
                    if (item.defaultValue) {
                        if (isJson(item.defaultValue)) {
                            for (const key in item.defaultValue) {
                                defaultData[key] = item.defaultValue[key];
                            }
                        } else {
                            defaultData[item.fieldName] = item.defaultValue;
                        }
                    }
                    if (item.aliasName) {
                        mappingFields.push({name: item.fieldName, alias: item.aliasName});
                    }
                    if (item.actions) {
                        actions.push({
                            actionNames: item.actionName,
                            actions: item.actions,
                            fieldName: item.fieldName
                        });
                    }
                });
            } else if (temp['tabList'] || temp['collapseList'] || temp['cardList']) {
                //如果是tabList
                const tabList = temp['tabList'] || temp['collapseList'] || temp['cardList'];
                for (const index in tabList) {
                    const temp = tabList[index];
                    tabOperation(temp);
                }
            } else if (temp['batchFieldList']) {
                //如果是tableList
                const tableList = temp['batchFieldList'] as Array<BatchFieldInfo>;
                tableOperation(tableList);
            } else {
                if (temp.defaultValue) {
                    if (isJson(temp.defaultValue)) {
                        for (const key in temp.defaultValue) {
                            defaultData[key] = temp.defaultValue[key];
                        }
                    } else {
                        defaultData[temp.fieldName] = temp.defaultValue;
                    }
                }
                if (temp.aliasName) {
                    mappingFields.push({name: temp.fieldName, alias: temp.aliasName});
                }
                if (temp.actions) {
                    actions.push({
                        actionNames: temp.actionName,
                        actions: temp.actions,
                        fieldName: temp.fieldName
                    });
                }
            }
        }
    };
    fieldsOperation(tempList, defaultDatas);
    const batchTempList = fieldList?.batchFieldList!;
    tableOperation(batchTempList);
    defaultDatas = {...defaultDatas, ...batchDefaultValues};
    // debugger;
    return {defaultDatas, mappingFields, batchDefaultValues, actions};
}

/**
 * 批量列表数据默认值
 * @param datas
 */
export function batchFieldDefaultValues(datas: BatchFieldInfo, dataForm: any) {
    let defaultValues: any = {};
    if (datas['batchDefaultData']) {
        defaultValues = {...datas['batchDefaultData']};
    }
    const fieldList = datas['fieldList'];
    for (const inde in fieldList) {
        const temp = fieldList[inde];
        if (temp.defaultValue) {
            if (isJson(temp.defaultValue)) {
                for (const key in temp.defaultValue) {
                    defaultValues[key] = temp.defaultValue[key];
                }
            } else {
                defaultValues[temp.fieldName] = temp.defaultValue;
            }
        }
    }
    if (dataForm) {
        let temp = unref(dataForm)[datas.batchName];
        if (temp) {
            defaultValues = {...temp, ...defaultValues};
        }
    }
    return defaultValues;
}

/**
 * 动态组件数据
 * @param preps 组件参数信息
 * @param prototype 数据原样返回
 */
export async function compDynamicData(preps: any) {
    const temp = preps;
    let reDataList: SelectOption[] = [];
    const dataSource = temp['dataSource'];
    const urlOrDictName = temp['urlOrDictName'];
    //如果已经有数据了，就不再请求
    if (preps['values'] && preps['values'].length > 0) {
        return preps['values'];
    }
    if (dataSource == 'url') {
        reDataList = await dynamicUrlOperation(preps);
    } else if (dataSource == 'dict') {
        const dicts = await dictData(urlOrDictName);
        if (Object.keys(dicts).length == 0) {
            error('数据字典可能未配置');
        } else {
            reDataList = dicts;
        }
    } else {
        reDataList = temp['values'];
    }
    return reDataList;
}

/**
 *
 * @param preps 组件参数信息
 * @param queryInfo 查询条件
 * @param prototype 数据原样返回
 */
export async function dynamicUrlOperation(preps: any, queryInfo?: SearchParams[]) {
    const temp = preps;
    const reDataList: SelectOption[] = [];
    const requestParams: any = [];
    const queryParams = temp['queryParams'];
    queryParams?.forEach((item: any) => {
        if (!item.name) {
            return;
        }
        requestParams.push({
            propertyName: item.name,
            value: item.value,
            operation: item.matchType
        });
    });
    //自定义查询
    if (queryInfo) {
        requestParams.push(...queryInfo);
    }
    let url = temp['preinterfaceUrl'] + temp['interfaceUrl'];
    const params = {
        url: temp['interfaceUrl'],
        host: temp['host'],
        port: temp['port'],
        protocol: temp['protocol'],
        env: temp['env'],
        httpMethod: temp.httpMethod || 'POST',
        dataType: temp.dataType || 'JSON',
        searchInfo: {
            fieldList: requestParams
        }
    };
    url = '/system-config/redirect/execute';
    const validResult = await loadData(url, params);
    if (validResult.error) {
        error(validResult.error);
    } else {
        const childrenOperation = (list: Array<any>) => {
            const options: SelectOption[] = [];
            list?.forEach((item: any) => {
                const option: SelectOption = {name: item[temp['selectLabel']], value: item[temp['selectValue']]};
                if (item.children && item.children.length > 0) {
                    option.children = childrenOperation(item.children);
                }
                options.push(option);
            });
            return options;
        };
        validResult.data.forEach((item: any) => {
            const option: SelectOption = {name: item[temp['selectLabel']], value: item[temp['selectValue']]};
            if (item.children && item.children.length > 0) {
                option.children = childrenOperation(item.children);
            }
            reDataList.push(option);
        });
    }
    return reDataList;
}

/**
 * 创建过滤器
 * @param queryString 查询参数
 */
export async function createFilter(queryString: string) {
    return (restaurant: SelectOption) => {
        return (
            restaurant?.name?.toLowerCase().search(queryString?.toLowerCase()) ||
            restaurant?.value?.toString()?.toLowerCase().search(queryString?.toLowerCase())
        );
    };
}


export async function dbConfigList(): Promise<SelectOption[]> {
    const {data, error} = await loadGetData('/userdb-manage/dbsearch/dbinfoEntity/getDbInfoByUser');
    if (error) {
        warning(error);
        return [];
    }
    return data?.map((item: any) => {
        return {
            name: item.name,
            value: item.configId + ''
        };
    });
}


/**
 * 公共Api接口
 * @param appName 应用名称
 * @param urlPrefix api接口前缀
 * @param condition 条件
 */
export function apiInstance(appName: string, urlPrefix: string, condition: Array<any> = []): ApiUrls {
    const prefix: string = `/${appName}/${urlPrefix}`;
    const apiUrls: ApiUrls = {
        basePrefix: prefix,
        appName: appName,
        pageListUrl: `${prefix}/pageList`,
        mergeUrl: `${prefix}/merge`,
        mergeDraftUrl: `${prefix}/mergeDraft`,
        batchMergeUrl: `${prefix}/mergeBatch`,
        batchMergeDraftUrl: `${prefix}/mergeBatchDraft`,
        loadByIdUrl: `${prefix}/getById`,
        loadByIdForViewUrl: `${prefix}/getByIdForView`,
        deleteUrl: `${prefix}/batchDeleteById`,
        deleteByConditionUrl: `${prefix}/deleteByCondition`,
        exportAllUrl: `${prefix}/exportData`,
        downloadTemplateUrl: `${prefix}/downloadTemplate`,
        listConditionUrl: `${prefix}/getAllByCondition`,
        oneConditionUrl: `${prefix}/getOneByCondition`,
        importUrl: `${prefix}/importData`,
        uploadUrl: `${appName}/annex/upload/common`,
        condition: condition
    };
    apiUrls.pageAction = (params: SearchInfo) => {
        return postRequest(apiUrls.pageListUrl!, params);
    };
    apiUrls.mergeAction = (param: any) => {
        return postRequest(apiUrls.mergeUrl!, param);
    };
    apiUrls.mergeDraftAction = (param: any) => {
        return postRequest(apiUrls.mergeDraftUrl!, param);
    };
    apiUrls.batchMergeAction = (param: any) => {
        return postRequest(apiUrls.batchMergeUrl!, param);
    };
    apiUrls.batchMergeDraftAction = (param: any) => {
        return postRequest(apiUrls.batchMergeDraftUrl!, param);
    };
    apiUrls.loadByIdAction = async (id: any, isView: boolean, params: any = {}) => {
        return await loadById(isView ? apiUrls.loadByIdForViewUrl! : apiUrls.loadByIdUrl!, id, params);
    };
    apiUrls.deleteAction = async (params: any) => {
        return await deleteByIds(apiUrls.deleteUrl!, params);
    };
    apiUrls.deleteByConditionAction = async (params: any) => {
        return await postRequest(apiUrls.deleteByConditionUrl!, params);
    };
    apiUrls.exportDataAction = async (param: any) => {
        return await download(apiUrls.exportAllUrl!, param);
    };
    apiUrls.downloadTemplateAction = async (param: any) => {
        return await download(apiUrls.downloadTemplateUrl!, param || {});
    };
    apiUrls.queryConditionAction = async (params: SearchParams[] | any, orderBy: OrderByInfo[] = []) => {
        return await loadData(apiUrls.listConditionUrl!, params, orderBy);
    };
    apiUrls.queryOneByConditionAction = async (params: SearchParams[] | any, orderBy: OrderByInfo[] = []) => {
        return await loadData(apiUrls.oneConditionUrl!, params, orderBy);
    };
    apiUrls.importAction = (param: any) => {
        return uploadRequest(apiUrls.importUrl!, param);
    };
    apiUrls.uploadAction = (param: any) => {
        return uploadRequest(apiUrls.uploadUrl!, param);
    };
    apiUrls.executeAction = async (param: any) => {
        return await postRequest(apiUrls.executeUrl!, param);
    };
    return apiUrls;
}

/**
 * 模态窗口相关属性
 */
export function dialogPreps(title: string = '编辑', batchTitle: string = '批量编辑'): Reactive<DialogProps> {
    return reactive<DialogProps>({
        bakeVisible1: false,
        bakeVisible2: false,
        bakeVisible3: false,
        ids: 0,
        batchDialogTitle: batchTitle,
        dialogTitle: title,
        batchEditVisible: false,
        editVisible: false,
        uploadVisible: false,
        viewVisible: false
    });
}

/**
 * 文本转拼音
 * @param text 文本
 * @param toCamel 是否驼峰
 */
export function textToPinYin(text: string, toCamel: boolean = true): string {
    const data = pinyin(text, {
        toneType: 'none'
    });
    if (toCamel) {
        const arr = data.split(' ');
        arr.forEach((item, index) => {
            if (index > 0) arr[index] = item.charAt(0).toUpperCase() + item.slice(1);
        });
        return arr.join('');
    }
    return data;
}
