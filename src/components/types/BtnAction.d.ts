import {SearchParams} from '@/components/types/Params';

export declare interface DynamicParamField {
    //参数名称
    paramName: string,
    //匹配类型
    matchType: string,
    //默认值
    defaultValue?: any,
}

/**
 * 按钮事件
 */
export declare interface BtnAction {
    //视图类型
    viewType: "inter" | "comp" | "code" | "method";
    //动态表单参数
    idDynamicForm?: string,
    //动态组件名称
    componentName?: string,
    //是否动态参数
    isDynamicParam?: string,
    //动态参数
    params?: SearchParams[] | DynamicParamField[],
    //接口地址
    url?: string,
    //请求方式
    method?: string,
    //是否需要确认
    needConfirm?: string,
    //确认提示信息
    confirmMsg?: string,
    //是否需要刷新
    needRefresh?: string,
    /**
     * 接口执行完成后的动作,
     * assignCurrentName 赋值当前名称
     * assignForm 赋值给表单
     */

    afterAction?: string,
    /**
     * 执行函数
     */
    actions?: Function,
    /**
     * js代码块
     */
    code?: string,

}
