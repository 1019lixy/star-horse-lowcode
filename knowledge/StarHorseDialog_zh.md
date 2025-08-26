# StarHorseDialog 对话框组件

## 概述
StarHorseDialog组件是基于Element Plus的el-dialog组件封装的对话框组件。它提供了丰富的功能，包括全屏切换、拖拽、自定义按钮、多种操作类型等，适用于各种弹窗场景。

## 属性(Props)
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| dialogVisible | Boolean | false | 对话框是否可见 |
| dialogProps | DialogProps | {} | 对话框属性配置 |
| isShowReset | Boolean | true | 是否显示重置按钮 |
| isShowSave | Boolean | false | 是否显示保存按钮 |
| isShowBtnContinue | Boolean | false | 是否显示继续按钮 |
| source | Number | 1 | 数据源类型 |
| draggable | Boolean | true | 是否可拖拽 |
| boxHeight | String | "auto" | 对话框高度 |
| boxWidth | String | "60%" | 对话框宽度 |
| isBatch | Boolean | false | 是否为批量操作 |
| fullScreen | Boolean | false | 是否全屏显示 |
| hideFullScreenIcon | Boolean | false | 是否隐藏全屏图标 |
| selfFunc | Boolean | false | 是否自定义功能 |
| selfClose | Boolean | false | 是否自定义关闭 |
| btnText | String | undefined | 按钮文本 |
| userBtn | Array<UserFuncInfo> | [] | 用户自定义按钮 |
| btnTextContinue | String | "提交并继续" | 继续按钮文本 |
| title | String | "" | 对话框标题 |
| compSize | String | Config.compSize | 组件大小 |

## 事件(Events)
| 事件名 | 参数 | 描述 |
|--------|------|------|
| merge | type: string | 合并事件 |
| mergeDraft | type: string | 合并草稿事件 |
| resetForm | none | 重置表单事件 |
| open | none | 打开对话框事件 |
| closeAction | none | 关闭动作事件 |

## 插槽(Slots)
| 插槽名 | 描述 |
|--------|------|
| header | 头部插槽 |
| default | 默认插槽（对话框内容） |
| extend | 扩展按钮插槽 |
| footer | 底部插槽 |

## 方法(Methods)
| 方法名 | 参数 | 返回类型 | 描述 |
|--------|------|----------|------|
| beforeClose | none | void | 关闭前的处理 |
| callFunc | func: any | void | 安全调用函数 |
| open | none | void | 打开对话框 |
| fullScreen | none | void | 全屏切换 |
| operation | funcName: any, type: string | void | 操作处理 |

## 数据结构

### DialogProps
```typescript
type DialogProps = {
  batchDialogTitle?: string;
  dialogTitle?: string;
  batchEditVisible?: boolean;
  editVisible?: boolean;
  uploadVisible?: boolean;
  viewVisible?: boolean;
  bakeVisible1?: boolean;
  bakeVisible2?: boolean;
  bakeVisible3?: boolean;
  ids?: number | string | undefined | null;
  isExpand?: boolean;
  expandUrl?: ApiUrls;
}
```

### UserFuncInfo
```typescript
interface UserFuncInfo {
  authority?: string;
  funcName?: string | Function;
  btnName?: string;
  icon?: string;
  priority?: number;
  helpMsg?: string;
  disabled?: string;
  position?: "table" | "toolbar";
  children?: UserFuncInfo[];
}
```

## 使用示例
```vue
<template>
  <star-horse-dialog
    v-model:dialog-visible="dialogVisible"
    :dialog-props="dialogProps"
    :title="dialogTitle"
    @merge="handleMerge"
    @close-action="handleClose"
  >
    <template #default>
      <!-- 对话框内容 -->
      <star-horse-form
        :comp-url="compUrl"
        :field-list="fieldList"
      />
    </template>
  </star-horse-dialog>
</template>

<script setup>
import { ref } from 'vue'
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue'
import StarHorseForm from '@/components/comp/StarHorseForm.vue'

const dialogVisible = ref(false)
const dialogTitle = ref('编辑信息')

const dialogProps = {
  editVisible: true,
  ids: null
}

const compUrl = {
  mergeUrl: '/api/data/merge',
  loadByIdUrl: '/api/data/loadById'
}

const fieldList = {
  fieldList: [
    {
      fieldName: 'name',
      label: '姓名',
      type: 'input',
      required: true
    }
  ]
}

const handleMerge = (type) => {
  console.log('合并操作:', type)
}

const handleClose = () => {
  dialogVisible.value = false
  console.log('对话框关闭')
}
</script>
```