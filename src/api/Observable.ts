import {Ref, ref} from 'vue';

// 观察者模式基类
class Observable<T> {
    private subscribers: ((value: T) => void)[] = [];

    // 订阅变更
    subscribe(callback: (value: T) => void) {
        this.subscribers.push(callback);
        return () => this.unsubscribe(callback);
    }

    // 取消订阅
    unsubscribe(callback: (value: T) => void) {
        this.subscribers = this.subscribers.filter(fn => fn !== callback);
    }

    // 通知所有订阅者
    notify(value: T) {
        this.subscribers.forEach(callback => callback(value));
    }
}

// 创建响应式观察者对象
export function createObservable<T>(initialValue: T) {
    const obs = new Observable<T>();
    const reactiveValue = ref(initialValue) as Ref<T>;

    return {
        get value() {
            return reactiveValue.value;
        },
        set value(newVal: T) {
            reactiveValue.value = newVal;
            obs.notify(newVal);
        },
        subscribe: obs.subscribe.bind(obs)
    };
}
