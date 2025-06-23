import {CompParams} from '@/components/types/PageFieldInfo';
import {Ref} from 'vue';

export type SelectOption = {
    name?: string,
    value?: string | number,
    disabled?: string,
    children?: SelectOption[] | Ref<SelectOption[]>
}
/**
 * 查询组件的属性
 */
export type SearchProps = {
    label?: string,
    fieldName?: string,
    type?: string,
    matchType?: string,
    disabled?: boolean | string,
    defaultValue?: any | null,
    defaultVisible?: boolean,
    helpMsg?: string,
    minWidth?: string,
    /**
     * 弹窗数据配置
     */
    params?: CompParams,
    preps?: any,
    /**
     * 废弃，请根据具体业务在preps 中添加 values 或者data
     */
    optionList?: SelectOption[] | Ref<SelectOption[]>,
}
/**
 * 查询属性
 */
export type SearchFields = {
    fieldList: SearchProps[]
}
