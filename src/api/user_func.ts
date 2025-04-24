import {useSelfOperationStore} from '@/store/SelfOperation.ts';
import piniaInstance from '@/store';
import {download, getRequest, postRequest, uploadRequest} from '@/api/star_horse_apis.ts';
import {getUserInfo} from '@/utils/auth.ts';
import {Ref} from 'vue';
import {createCondition} from '@/api/star_horse_utils.ts';
import {success, warning} from '@/utils/message.ts';
import {UserFuncInfo} from '@/components/types/PageFieldInfo';
import {useRouter} from 'vue-router';

/**
 * 动态表单用户自定义驱动
 */
const userOperation = useSelfOperationStore(piniaInstance);
/**
 * 用户自定义事件对接接口
 * @param code 需要执行的代码
 * @param context 组件上下文信息
 */
export const userFunction = (code: string, context: any) => {
    if (!code) {
        return;
    }
    //表单元素
    const formFields: any = userOperation.fieldItemList;
    //表单数据
    // let formData: any = userOperation.formData;
    //表单实例
    const formInstance: any = userOperation.formInstance;
    /**
     * currentField 当前组件信息
     * formData 表单数据
     * formFields 表单所有属性
     * formInstance 表单实例
     * userInfo 当前登录信息
     * postRequest Post 请求接口
     * getRequest Get 请求接口
     * download 下载数据接口
     * upload 上传数据接口
     */
    const fun = new Function(
        'currentField',
        'formData',
        'formFields',
        'formInstance',
        'userInfo',
        'postRequest',
        'getRequest',
        'download',
        'upload',
        code
    );
    fun.call(
        this,
        context.attrs['formInfo'],
        context.attrs['formData'],
        formFields,
        formInstance,
        getUserInfo(),
        postRequest,
        getRequest,
        download,
        uploadRequest
    );
};


/**
 * 用户自定义按钮
 * @param tableRef 表格实例
 * @param primaryKey 主键名称
 * @param datas 按钮信息
 */
export function userAction(tableRef: Ref, primaryKey: string, datas: Array<any>): Array<UserFuncInfo> {
    const btnList: Array<UserFuncInfo> = [];
    if (datas && datas.length > 0) {
        datas.forEach((item: any) => {
            const content = item['funcName'];
            if (item['eventType'] == 'interface') {
                if (item['authority'] == 'download') {
                    item['funcName'] = (row: any) => {
                        const fieldList: any = [];
                        fieldList.push(createCondition(primaryKey, row[primaryKey]));
                        download(content, {
                            fieldList: fieldList
                        }).catch((e) => {
                            warning(e.message);
                        });
                    };
                } else {
                    item['funcName'] = (row: any) => {
                        const fieldList: any = [];
                        fieldList.push(createCondition(primaryKey, row[primaryKey]));
                        postRequest(content, {
                            fieldList: fieldList
                        }).then((res) => {
                            if (res.data.code) {
                                warning(res.data.cnMessage);
                                return;
                            }
                            success('操作成功');
                            tableRef.value?.loadByPage();
                        });
                    };
                }
            } else if (item['eventType'] == 'dialog') {
                //弹出对话框
                warning('暂未实现');
            } else if (item['eventType'] == 'page') {
                //打开页面
                item['funcName'] = (row: any) => {
                    let router= useRouter()&&window.__hostRouter__;
                    router.push({
                        path: content,
                        query: {
                            param: JSON.stringify(row)
                        }
                    });
                };
            }
            btnList.push(item);
        });
    }
    return btnList;
}

/**
 * 判断是否是Promise
 * @param obj
 */
export function isPromise<T = any>(obj: any): obj is Promise<T> {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function' &&
        typeof obj.catch === 'function'
    );
}

