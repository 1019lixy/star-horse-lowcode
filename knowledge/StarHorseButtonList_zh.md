# StarHorseButtonList 按钮列表组件

## 概述
StarHorseButtonList 是一个按钮列表组件，用于显示一组操作按钮，支持权限控制、自定义按钮和文件上传功能。

## Props

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| dialogProps | DialogProps | 是 | - | 对话框属性配置 |
| compUrl | ApiUrls | 是 | - | 组件API地址配置 |
| viewFlag | Boolean | 否 | false | 查看模式标识 |
| extendBtns | UserFuncInfo[] | 否 | - | 扩展按钮配置 |
| preValidFunc | PreValid[] | 否 | - | 预验证函数数组 |
| btnPermissions | Object | 否 | - | 按钮权限配置 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| upload | file, fileList | 文件上传时触发 |
| uploadProcess | event, file, fileList | 上传过程中触发 |
| uploadError | err, file, fileList | 上传失败时触发 |
| uploadSuccess | response, file, fileList | 上传成功时触发 |
| btnOperation | funcName | 按钮操作时触发 |
| tableCompFunc | funcName | 表格组件函数调用时触发 |

## 数据结构

### DialogProps 对话框属性
```typescript
{
  ids: number; // 数据ID
  editVisible: boolean; // 编辑对话框可见性
  dialogTitle: string; // 对话框标题
  batchEditVisible: boolean; // 批量编辑对话框可见性
  batchDialogTitle: string; // 批量编辑对话框标题
}
```

### ApiUrls API地址配置
```typescript
{
  downloadTemplateUrl: string; // 下载模板地址
  // 其他API地址...
}
```

### UserFuncInfo 用户功能信息
```typescript
{
  btnName: string; // 按钮名称
  icon: string; // 图标类名
  authority: string; // 权限标识
  priority: number; // 优先级
  funcName: Function; // 功能函数
  position: string; // 位置 ('toolbar')
  helpMsg: string; // 帮助信息
}
```

### PreValid 预验证配置
```typescript
{
  authority: string; // 权限标识
  valid: Function; // 验证函数
  msg: string; // 验证失败消息
}
```

## 使用示例

```vue
<template>
  <star-horse-button-list
    :dialog-props="dialogProps"
    :comp-url="compUrl"
    :extend-btns="extendBtns"
    :pre-valid-func="preValidFunc"
    :btn-permissions="btnPermissions"
    @btn-operation="handleBtnOperation"
    @table-comp-func="handleTableCompFunc"
  />
</template>

<script setup>
import { ref } from 'vue'
import StarHorseButtonList from '@/components/system/StarHorseButtonList.vue'

const dialogProps = ref({
  ids: -1,
  editVisible: false,
  dialogTitle: '新增数据',
  batchEditVisible: false,
  batchDialogTitle: '批量新增数据'
})

const compUrl = ref({
  downloadTemplateUrl: '/api/download/template'
})

const extendBtns = ref([
  {
    btnName: '自定义按钮',
    icon: 'custom',
    authority: 'custom',
    priority: 200,
    position: 'toolbar',
    funcName: (actionName) => console.log('自定义操作:', actionName)
  }
])

const preValidFunc = ref([
  {
    authority: 'delete',
    valid: () => confirm('确定要删除吗？'),
    msg: '删除操作已取消'
  }
])

const btnPermissions = ref({
  add: true,
  delete: false
})

const handleBtnOperation = (funcName) => {
  console.log('按钮操作:', funcName)
}

const handleTableCompFunc = (funcName) => {
  console.log('表格组件函数:', funcName)
}
</script>
```