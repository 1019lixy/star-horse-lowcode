import type {NProgressOptions} from 'nprogress';
import NProgress from 'nprogress';
import '@/assets/css/nprogress.css';
//全局进度条的配置
export const starhorseProcess = () => {
    NProgress.configure({
        easing: 'ease', // 动画方式
        speed: 1000, // 递增进度条的速度
        showSpinner: true, // 是否显示加载ico
        trickleSpeed: 200, // 自动递增间隔
        // minimum: 0.5, // 更改启动时使用的最小百分比
        parent: 'body' //指定进度条的父容器
    } as NProgressOptions);
    // 打开进度条
    const start = () => {
        NProgress.start();
    };
    // 关闭进度条
    const done = () => {
        NProgress.done();
    };
    return {
        start,
        done
    };
};
