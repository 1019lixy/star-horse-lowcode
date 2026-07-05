# ShForm 轻量表单

轻量表单包装组件，基于 el-form 的简单封装，提供基础的表单布局和校验功能。

## 基础用法

```vue
<template>
  <ShForm v-model:dataForm="formData" :needScroller="true">
    <template #default="{ form }">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
    </template>
  </ShForm>
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| needScroller | `boolean` | 否 | `true` | 是否需要滚动条 |

## v-model

| 名称 | 类型 | 说明 |
|---|---|---|
| dataForm | `any` | 双向绑定的表单数据 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| getFields | — | `any` | 获取 el-form 实例的 fields |
| validate | — | `Promise<any>` | 触发表单校验 |

## 插槽 (Slots)

| 插槽名 | 作用域参数 | 说明 |
|---|---|---|---|
| header | — | 表单头部区域 |
| default | `{ form }` | 表单内容区域 |
| empty | `{ form }` | 当默认插槽不存在时显示的空状态 |
| button | `{ form }` | 表单底部按钮区域 |

---

# ShDynamicForm 动态表单

动态表单组件，根据接口配置自动渲染表单。

## 基础用法

```vue
<template>
  <ShDynamicForm
    ref="formRef"
    :compUrl="apiUrls"
    :fieldList="pageFieldInfo"
    :formInfo="formInfo"
    @refresh="onRefresh"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| compUrl | `ApiUrls` | **是** | — | 接口地址配置 |
| fieldList | `object` | **是** | — | 字段配置 |
| formInfo | `object` | **是** | — | 表单信息 |
| rules | `object` | 否 | — | 校验规则 |
| typeModel | `string` | 否 | `'normal'` | 类型模型 |

## 事件 (Emits)

| 事件名 | 参数 | 说明 |
|---|---|---|
| refresh | — | 刷新事件 |

## 方法 (Expose)

| 方法名 | 参数 | 返回值 | 说明 |
|---|---|---|---|
| merge | `(type: string)` | `void` | 校验并提交数据 |
| mergeDraft | `(type: string)` | `void` | 跳过校验直接提交草稿 |
| resetForm | — | `void` | 重置表单 |
| assignDefault | — | `void` | 清空表单数据 |
