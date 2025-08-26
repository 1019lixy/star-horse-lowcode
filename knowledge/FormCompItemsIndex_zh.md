# FormComp Items Index 表单组件项导出索引

## 概述
FormComp Items Index 是一个 TypeScript 文件，用于统一导出 [formcomp/items](file:///e:/lixycode/testcode/src/components/formcomp/items) 目录下的所有表单组件项，方便其他模块按需导入。

## 导出的组件

```typescript
export { default as areaItem } from "./area-item.vue";
export { default as audioItem } from "./audio-item.vue";
export { default as autocompleteItem } from "./autocomplete-item.vue";
export { default as buttonItem } from "./button-item.vue";
export { default as cascadeItem } from "./cascade-item.vue";
export { default as checkboxItem } from "./checkbox-item.vue";
export { default as colorItem } from "./color-item.vue";
export { default as cronItem } from "./cron-item.vue";
export { default as datetimeItem } from "./datetime-item.vue";
export { default as departItem } from "./depart-item.vue";
export { default as dialogInputItem } from "./dialog-input-item.vue";
export { default as dividerItem } from "./divider-item.vue";
export { default as htmlItem } from "./html-item.vue";
export { default as htmleditorItem } from "./htmleditor-item.vue";
export { default as iconItem } from "./icon-item.vue";
export { default as imageItem } from "./image-item.vue";
export { default as inputItem } from "./input-item.vue";
export { default as jsonArrayItem } from "./json-array-item.vue";
export { default as jsonItem } from "./json-item.vue";
export { default as markdownItem } from "./markdown-item.vue";
export { default as numberItem } from "./number-item.vue";
export { default as numberRangeItem } from "./number-range-item.vue";
export { default as pageSelectItem } from "./page-select-item.vue";
export { default as passwordItem } from "./password-item.vue";
export { default as radioItem } from "./radio-item.vue";
export { default as rateItem } from "./rate-item.vue";
export { default as selectItem } from "./select-item.vue";
export { default as signatureItem } from "./signature-item.vue";
export { default as sliderItem } from "./slider-item.vue";
export { default as switchItem } from "./switch-item.vue";
export { default as tagItem } from "./tag-item.vue";
export { default as textItem } from "./text-item.vue";
export { default as textareaItem } from "./textarea-item.vue";
export { default as timeItem } from "./time-item.vue";
export { default as timePickerItem } from "./time-picker-item.vue";
export { default as transferItem } from "./transfer-item.vue";
export { default as tselectItem } from "./tselect-item.vue";
export { default as unknownItem } from "./unknown-item.vue";
export { default as uploadItem } from "./upload-item.vue";
export { default as userItem } from "./user-item.vue";
export { default as usercompItem } from "./usercomp-item.vue";
export { default as viewMarkdownItem } from "./view-markdown-item.vue";
export { default as qrcodeItem } from "./qrcode-item.vue";
export { default as barcodeItem } from "./barcode-item.vue";
```

## 组件分类

### 输入组件
- inputItem - 输入框
- textareaItem - 文本域
- passwordItem - 密码框
- numberItem - 数字输入框
- numberRangeItem - 数字范围输入框

### 选择组件
- selectItem - 下拉选择框
- checkboxItem - 复选框
- radioItem - 单选框
- switchItem - 开关
- transferItem - 穿梭框
- cascadeItem - 级联选择器
- tselectItem - 树形选择器

### 日期时间组件
- datetimeItem - 日期时间选择器
- timeItem - 时间选择器
- timePickerItem - 时间选择器

### 多媒体组件
- imageItem - 图片上传
- audioItem - 音频上传
- videoItem - 视频上传（未导出）

### 特殊组件
- buttonItem - 按钮
- dividerItem - 分割线
- htmlItem - HTML 内容
- htmleditorItem - HTML 编辑器
- markdownItem - Markdown 编辑器
- signatureItem - 签名板
- sliderItem - 滑块
- rateItem - 评分
- colorItem - 颜色选择器
- cronItem - Cron 表达式
- autocompleteItem - 自动完成
- pageSelectItem - 页面选择器
- dialogInputItem - 对话框输入
- userItem - 用户选择器
- departItem - 部门选择器
- usercompItem - 用户自定义组件
- uploadItem - 文件上传
- areaItem - 地区选择器
- qrcodeItem - 二维码生成器
- barcodeItem - 条形码生成器

### 数据组件
- jsonItem - JSON 编辑器
- jsonArrayItem - JSON 数组编辑器
- viewMarkdownItem - Markdown 查看器

### 未知组件
- unknownItem - 未知组件占位符

## 使用示例

```typescript
// 按需导入表单组件项
import { inputItem, selectItem, checkboxItem } from '@/components/formcomp/items'

// 在动态表单中使用
const formConfig = {
  fieldList: [
    {
      fieldName: 'name',
      type: 'input',
      component: inputItem
    },
    {
      fieldName: 'status',
      type: 'select',
      component: selectItem
    }
  ]
}
```

## 特性

1. **统一导出** - 集中管理表单组件项的导出
2. **按需导入** - 支持按需导入单个表单组件项
3. **命名规范** - 使用 camelCase 命名规范
4. **模块化** - 便于维护和扩展
5. **类型安全** - TypeScript 支持
6. **完整覆盖** - 包含所有表单组件类型