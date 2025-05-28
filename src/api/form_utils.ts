import {getValidType} from '@/api/valid_utils';

/**
 * 解析动态表单中的子节点数据是否需要合并到父节点中
 * @param props
 * @param dataForm
 */
export function dynamicFormAnalysis(props: any, dataForm: any) {
    //props.globalCondition 有属性不是子表，需要额外封装
    const globalCondition = props.globalCondition;
    let dataList: any = {};
    if (!globalCondition || globalCondition.length == 0) {
        return dataList;
    }
    for (const key in globalCondition) {
        const temp = globalCondition[key];
        //如果非子表
        if ('N' == temp.subFormFlag) {
            const data = dataForm[temp.tableName];
            delete dataForm[temp.tableName];
            if (Array.isArray(data)) {
                dataList = [];
                data.forEach((item) => {
                    dataList.push({...item, ...dataForm});
                });
            } else {
                dataList = {...dataList, ...data, ...dataForm};
            }
        }
    }
    return dataList;
}

/**
 * 创建验证规则
 * @param item
 * @param dataForm
 */
export function validMsg(item: any, dataForm: any) {
    const rules = [];
    if (item.required && item.disabled != 'Y') {
        rules.push({required: true, message: `${item.label}不能为空`, trigger: 'blur'});
        if (item.type == 'number-range') {
            rules.push({
                validator: (_rule: any, _value: any, callback: any) => {
                    const fieldName = item.fieldName;
                    if (dataForm[fieldName + 'Min'] + '' === '') {
                        callback(new Error('必填项小值不能为空'));
                    }
                    if (dataForm[fieldName + 'Max'] + '' === '') {
                        callback(new Error('必填项大值不能为空'));
                    }
                    if (dataForm[fieldName + 'Min'] > dataForm[fieldName + 'Max']) {
                        callback(new Error('小值不能大于大值'));
                    }
                },
                trigger: 'blur'
            });
        }
    } else {
        if (item.type == 'number-range') {
            rules.push({
                validator: (_rule: any, _value: any, callback: any) => {
                    const fieldName = item.fieldName;
                    if (parseFloat(dataForm[fieldName + 'Min']) > parseFloat(dataForm[fieldName + 'Max'])) {
                        callback(new Error('小值不能大于大值'));
                    }
                },
                trigger: 'blur'
            });
        }
    }
    const itemRules: any = item.rules || item.preps?.rules;
    const innerFun = (itemRules: any) => {
        if (itemRules?.length > 0) {
            if (Array.isArray(itemRules)) {
                itemRules?.forEach((rule: any) => {
                    if (rule?.name?.length > 0) {
                        rules.push(getValidType(rule.name, rule.options));
                    } else {
                        if (typeof rule == 'string') {
                            rules.push(getValidType(rule));
                        } else {
                            rules.push(rule);
                        }
                    }
                });
            } else {
                if (itemRules?.name?.length > 0) {
                    rules.push(getValidType(itemRules.name, itemRules.options));
                } else {
                    if (typeof itemRules == 'string') {
                        rules.push(getValidType(itemRules));
                    } else {
                        rules.push(itemRules);
                    }
                }
            }
        }
    };
    //解决某些非标准的规则
    innerFun(itemRules);
    return rules;
}

/**
 * 检查对象是否需要创建
 * @param dataForm 数据对象
 * @param item 表单属性
 * @param index 索引
 * @param parentIndex 父索引
 * @param prefix 前缀
 */
export function checkObject(dataForm: any, item: any, index: number, parentIndex: number, prefix: string) {
    return index + 1;
}


export function getFormData(item: any, dataForm: any, prefix: string, parentIndex: number, index: number) {
    if (item.subFormFlag == 'Y') {
        if (item && item.objectName) {
            console.log('checkObject', item.objectName);
            if (!Object.keys(dataForm).includes(item.objectName)) {
                dataForm[item.objectName] = [{}];
            }
        }
        let dataIndex = getDataIndex(item, prefix, parentIndex, index);
        let len = dataForm[item.objectName].length;
        if (dataIndex >= len) {
            dataForm[item.objectName].push({});
            dataIndex = len - 1;
        }
        return dataForm[item.objectName][dataIndex];
    }
    return dataForm;
}

/**
 * 获取表单数据索引
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getDataIndex(data: any, prefix: string, parentIndex: number, index: number) {
    let pronPrefix: number = 0;
    if (prefix && prefix.length > 0) {
        if (data.subFormFlag == 'Y') {
            pronPrefix = (parentIndex > -1 ? 0 : index);
        } else {
            pronPrefix = parentIndex;
        }
    } else if (data.subFormFlag == 'Y') {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix = parentIndex > 0 ? parentIndex : index;
    } else {
        pronPrefix = -1;
    }
    return pronPrefix;
}


/**
 * 生成验证属性
 * @param prefix 父表标识
 * @param fieldName 字段名称
 * @param parentIndex 父索引
 * @param currentIndex 当前索引
 */
export function loadProp(prefix: string, fieldName: string, parentIndex: number, currentIndex: number) {
    if (prefix && prefix.length > 0) {
        return prefix + '.' + fieldName + (currentIndex > -1 ? '.' + currentIndex : parentIndex > -1 ? '.' + parentIndex : '');
    } else if (parentIndex >= 0) {
        return fieldName + '.' + parentIndex;
    } else if (currentIndex >= 0) {
        return fieldName + '.' + currentIndex;
    } else {
        return fieldName;
    }

}

/**
 * 计算表单Pron
 * @param data
 * @param prefix
 * @param parentIndex
 * @param index
 */
export function getPrefix(data: any, prefix: string, parentIndex: number, index: number) {
    let pronPrefix = '';
    if (prefix && prefix.length > 0) {
        if (data.subFormFlag == 'Y') {
            pronPrefix = prefix + '.' + data.objectName + '.' + (parentIndex > -1 ? 0 : index);
        } else {
            pronPrefix = prefix;
        }
    } else if (data.subFormFlag == 'Y') {
        //如果父表大于0,说明当前是父表的子表，应该用父表的索引
        pronPrefix = data.objectName + '.' + (parentIndex > 0 ? parentIndex : index);
    } else {
        pronPrefix = '';
    }
    return pronPrefix;
}

/**
 * 检查是否可见
 * @param item
 * @param dataForm
 */
export function checkVisible(item: any, dataForm: any) {
    return item.formVisible || dataForm['_' + item.fieldName + 'Visible'] == 'Y';
}
