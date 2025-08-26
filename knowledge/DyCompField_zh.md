# DyCompField 动态组件字段类型

## 概述
DyCompField 是一个 TypeScript 接口类型，用于定义动态组件的字段配置信息。

## 类型定义

```typescript
export interface DyCompField {
  name: string;              // 组件名称
  template: any;            // 模板名称
  data?: any;               // 数据定义
  props?: any;              // 参数
  methods?: any;            // 执行方法
  emits?: Array<string>;    // 向外传递的事件
  onMounted?: Function;     // 挂载方法
  computed?: any;           // 计算属性
  components?: any;         // 组件
  onActivated?: Function;   // 激活时执行的方法
  onDeactivated?: Function; // 失活时执行的方法
  watch?: any;              // 监听器
}
```

## 使用示例

```typescript
import { DyCompField } from '@/components/types/DyCompField'

// 动态组件字段示例
const dyCompField: DyCompField = {
  name: 'DynamicButton',
  template: `
    <button @click="handleClick" :disabled="disabled">
      {{ buttonText }}
    </button>
  `,
  data: {
    buttonText: '点击我',
    disabled: false,
    clickCount: 0
  },
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    handleClick() {
      this.clickCount++
      this.buttonText = `已点击 ${this.clickCount} 次`
      this.$emit('click', this.clickCount)
    }
  },
  emits: ['click'],
  onMounted() {
    console.log('动态组件已挂载')
  },
  computed: {
    buttonClass() {
      return `btn btn-${this.type}`
    }
  }
}
```

## 特性

1. 完整的动态组件配置
2. 支持模板定义
3. 支持数据和属性配置
4. 支持方法和计算属性
5. 支持事件传递
6. 支持生命周期钩子
7. 支持监听器配置
8. 支持组件嵌套