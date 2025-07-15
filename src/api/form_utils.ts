import { getValidType } from '@/api/valid_utils';
import { unref } from "vue";

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
                    dataList.push({ ...item, ...dataForm });
                });
            } else {
                dataList = { ...dataList, ...data, ...dataForm };
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
    if (item.required && !item.disabled) {
        rules.push({ required: true, message: `${item.label}不能为空`, trigger: 'blur' });
    }
    if (item.type == 'number-range') {
        const splitName = item.preps?.splitName ?? '-';
        const escapedSplit = splitName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        rules.push({ pattern: new RegExp(`^\\d+${escapedSplit}\\d+$`), message: '格式应为"最小值-最大值"（如：2-3）', trigger: 'blur' });
        rules.push({
            validator: (rule: any, value: string, callback: any) => {
                const minName = item.preps?.minName ?? item.fieldName + 'Min';
                const maxName = item.preps?.maxName ?? item.fieldName + 'Max';
                // 从formData中获取min和max的实际数值（通过fieldName+Min/Max）
                const minValue = unref(dataForm)[`${minName}`];
                const maxValue = unref(dataForm)[`${maxName}`];

                if (minValue === undefined || maxValue === undefined) {
                    callback(); // 由required规则处理空值
                    return;
                }
                if (maxValue < minValue) {
                    callback(new Error('最大值不能小于最小值'));
                } else {
                    callback();
                }
            },
            trigger: 'blur' // 输入变化时触发验证
        });
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


export function getFormData(item: any, dataForm: any, prefix: string, parentIndex: any, index: any) {
    if (item.subFormFlag == 'Y') {
        if (item && item.objectName) {
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
export function getDataIndex(data: any, prefix: string, parentIndex: any, index: any) {
    let pronPrefix: number = 0;
    if (prefix?.length > 0) {
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
export function getPrefix(data: any, prefix: string, parentIndex: any, index: any) {
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
    return item.formVisible || dataForm['_' + item.fieldName + 'Visible'];
}

/**
 * 解析列表数据
 * @param item
 * @param val
 */
export function parseListData(item: any, val: any) {
    return unref(item.preps?.values)?.find((temp: any) => temp.value == val)?.name
        || unref(item.preps?.data)?.find((temp: any) => temp.value == val)?.name
        || unref(item.optionList)?.find((temp: any) => temp.value == val)?.name
        || val;
}

/**
 * 过滤对象属性
 * @param obj 要过滤的对象
 * @param keysToRemove 要移除的属性键数组
 */
export function filterProperties(obj: any, keysToRemove: string[]) {
    Object.keys(obj).forEach(key => {
        if (keysToRemove.includes(key)) {
            delete obj[key];
        }
    });

}