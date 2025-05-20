export interface DyCompField {
    //组件名称
    name: string;
    //模板名称
    template: any;
    //数据定义
    data?: any;
    //参数
    props?: any;
    //执行方法
    methods?: any;
    //向外传递的事件
    emits?: Array<string>;
    //挂着方法
    onMounted?: Function;
    computed?: any;
    //组件
    components?: any;
    //
    onActivated?: Function;
    onDeactivated?: Function;
    watch?: any;
}
