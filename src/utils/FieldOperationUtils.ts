import { uuid } from '@/api/system';
import { computed } from 'vue';
import { useDesignFormStore } from '@/store/DesignForm';
import piniaInstance from '@/store';

const designForm = useDesignFormStore(piniaInstance);
const formData = computed(() => designForm.formData);
const numField: Array<string> = [
    'minlength',
    'maxLength',
    'step',
    'rows',
    'height',
    'width',
    'columns',
    'gutter',
    'limit',
    'precision',
    'min',
    'max',
    'highThreshold',
    'lowThreshold',
    'multipleLimit'
];

/**
 * 处理默认值
 * @param type
 */
const getDefaultVal = (type: string) => {
    if (type == 'number' || type == 'slider' || type == 'rate') {
        return undefined;
    } else if (type == 'checkbox' || type == 'transfer') {
        return [];
    } else {
        return '';
    }
};

/**
 * 复制字段
 * @param data
 * @param type
 */
export function fieldCopy(data: any, type: string) {
    const reData = JSON.parse(JSON.stringify(data));
    //如果数据没有索引，则初始化索引
    const ms = designForm.getFieldDataIndex();
    const mvData: any = {};
    mvData['id'] = 'Id' + uuid();
    // console.log(reData);
    /**
     * 处理preps
     */
    const preps = reData.preps;
    mvData['preps'] = {};
    for (const key in preps) {
        const temp = preps[key];
        if (numField.includes(temp.fieldName)) {
            try {
                mvData.preps[temp.fieldName] = parseInt(temp.defaultValues);
            } catch (e) {
                mvData.preps[temp.fieldName] = null;
            }
        } else {
            mvData.preps[temp.fieldName] = temp.defaultValues;
        }
    }
    mvData.preps['id'] = mvData['id'];
    mvData.preps['label'] = reData.itemName;
    mvData.preps['itemNameLabel'] = reData.itemName;
    mvData.preps['name'] = reData.itemType + ms;
    formData.value[reData.preps.fieldName] = getDefaultVal(reData.itemType);
    mvData['compType'] = type;
    mvData['itemType'] = reData.itemType;
    if (reData.itemType == 'box') {
        mvData.preps['elements'] = [{ rowIndex: 1, columns: [{ colIndex: 1, colspan: 24, items: [] }] }];
    } else if (reData.itemType == 'table') {
        mvData.preps['elements'] = [{ colIndex: 1, columns: 1, items: [] }];
    } else if (reData.itemType == 'dytable') {
        mvData.preps['elements'] = [{ colIndex: 1, columns: [{ colIndex: 1, colspan: 1, rowspan: 1, items: [] }] }];
    }
    return mvData;
}

