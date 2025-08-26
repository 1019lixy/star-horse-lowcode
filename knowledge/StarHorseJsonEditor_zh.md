# StarHorseJsonEditor JSON编辑器

## 概述
StarHorseJsonEditor组件是一个基于vue3-ts-jsoneditor的JSON编辑器，支持多种编辑模式（树形、代码、表单、文本、视图），提供了丰富的JSON数据编辑和查看功能。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| options | Object | undefined | 编辑器选项配置 |
| currentMode | String | "code" | 当前编辑模式 |
| modeList | Array | ["tree", "code", "form", "text", "view"] | 可用的编辑模式列表 |
| language | String | "zh-CN" | 编辑器语言 |
| modelValue | any | {} | 双向绑定的JSON数据值 |

## 事件(Events)
该组件使用v-model双向绑定，支持modelValue的更新。

## 插槽(Slots)
该组件不使用插槽。

## 方法(Methods) (通过defineExpose暴露)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| editor | none | Ref<any> | 编辑器实例引用 |
| setEditorContent | value: any | void | 设置编辑器内容 |

## 数据结构

### 编辑器选项配置
```typescript
interface JsonEditorOptions {
  // 编辑器的各种配置选项
  mode?: 'tree' | 'view' | 'form' | 'code' | 'text';
  modes?: Array<'tree' | 'view' | 'form' | 'code' | 'text'>;
  // 更多配置项...
}
```

### 支持的查询语言
```typescript
// 支持的查询语言列表
const queryLanguages: Array<string> = [
  "javascript",
  "lodash",
  "jmespath",
  "jsonquery",
  "jsonpath"
];
```

## 使用示例
```vue
<template>
  <div>
    <el-form-item label="JSON数据">
      <star-horse-json-editor
        v-model="jsonData"
        :current-mode="'code'"
        :mode-list="['tree', 'code', 'form']"
        language="zh-CN"
        style="height: 400px;"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StarHorseJsonEditor from '@/components/comp/StarHorseJsonEditor.vue'

const jsonData = ref({
  name: '示例数据',
  age: 18,
  hobbies: ['读书', '游泳'],
  address: {
    city: '北京',
    district: '朝阳区'
  }
})

const handleSave = () => {
  console.log('保存的数据:', jsonData.value)
}

const handleReset = () => {
  jsonData.value = {}
}
</script>
```

## 功能特性
1. **多种编辑模式**：
   - 树形模式：可视化树形结构编辑
   - 代码模式：JSON代码编辑
   - 表单模式：表单化编辑界面
   - 文本模式：纯文本编辑
   - 视图模式：只读查看模式

2. **多语言支持**：支持中文等多种语言界面

3. **查询功能**：支持多种JSON查询语言

4. **数据绑定**：支持v-model双向数据绑定

5. **自定义配置**：支持编辑器选项自定义配置