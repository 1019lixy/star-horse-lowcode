import {getSelfOperationStore} from "@/store/StoreManager";
import {download, getRequest, postRequest, uploadRequest,} from "@/api/star_horse_apis";
import {getUserInfo} from "@/utils/auth";
import {Ref} from "vue";
import {closeLoad, createCondition, load} from "@/api/star_horse_utils";
import {success, warning} from "@/utils/message";
import {i18n} from "@/lang";
import {UserFuncInfo} from "@/components/types/PageFieldInfo";
import JSON5 from "json5";

/**
 * 动态表单用户自定义驱动
 */
// const userOperation = getSelfOperationStore();
/**
 * 用户自定义事件对接接口
 * @param code 需要执行的代码
 * @param context 组件上下文信息
 * @param formData
 * @param formInfo
 */
export const userFunction = (code: string, context: any, formData: any) => {
    if (!code) {
        return;
    }
    //表单元素
    const formFields: any = getSelfOperationStore().fieldItemList;
    //表单数据
    // let formData: any = userOperation.formData;
    //表单实例
    const formInstance: any = getSelfOperationStore().formInstance;
    /**
     * currentField：Record<string,any> 当前组件信息
     * formData：Record<string,any>  表单数据
     * formFields:Array<FieldInfo> 表单所有属性
     * formInstance:Ref 表单实例
     * userInfo:Record<string,any> 当前登录信息
     * postRequest:Function Post 请求接口
     * getRequest:Function Get 请求接口
     * download:Function 下载数据接口
     * upload:Function 上传数据接口
     * load:Function 加载遮罩
     * closeLoad:Function 关闭加载遮罩
     */
    const fun = new Function(
        "currentField",
        "formData",
        "formFields",
        "formInstance",
        "userInfo",
        "postRequest",
        "getRequest",
        "download",
        "upload",
        "load",
        "closeLoad",
        code,
    );
    fun.call(
        this,
        context.formInfo,
        formData,
        formFields,
        formInstance,
        getUserInfo(),
        postRequest,
        getRequest,
        download,
        uploadRequest,
        load,
        closeLoad
    );
};

/**
 * 用户自定义按钮
 * @param tableRef 表格实例
 * @param primaryKey 主键名称
 * @param datas 按钮信息
 */
export function userAction(
    tableRef: Ref,
    primaryKey: string,
    datas: Array<any>,
): Array<UserFuncInfo> {
    const btnList: Array<UserFuncInfo> = [];
    if (datas && datas.length > 0) {
        datas.forEach((item: any) => {
            const content = item["funcName"];
            if (item["eventType"] == "interface") {
                if (item["authority"] == "download") {
                    item["funcName"] = (row: any) => {
                        const fieldList: any = [];
                        fieldList.push(createCondition(primaryKey, row[primaryKey]));
                        download(content, {
                            fieldList: fieldList,
                        }).catch((e) => {
                            warning(e.message);
                        });
                    };
                } else {
                    item["funcName"] = (row: any) => {
                        const fieldList: any = [];
                        fieldList.push(createCondition(primaryKey, row[primaryKey]));
                        postRequest(content, {
                            fieldList: fieldList,
                        }).then((res) => {
                            if (res?.data?.code!=200) {
                                warning(res?.data?.cnMessage);
                                return;
                            }
                            success(i18n("userFunc.operationSuccess"));
                            tableRef.value?.loadByPage();
                        });
                    };
                }
            } else if (item["eventType"] == "dialog") {
                //弹出对话框
                warning(i18n("userFunc.notImplemented"));
            } else if (item["eventType"] == "page") {
                //打开页面
                let router = window.__hostRouter__;
                item["funcName"] = (row: any) => {
                    router.push({
                        path: content,
                        query: {
                            param: JSON5.stringify(row),
                        },
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
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function" &&
        typeof obj.catch === "function"
    );
}
