# 修复 PdfSigner 导出错误

## 问题
`PdfDemo.vue:3` 导入 `PdfSigner`，但 `index.ts` 导出的组件名为 `PdfSignerVue`。
虽然 `index.ts` 有 `export type { PdfSigner }`，但运行时无法导入 type，导致 SyntaxError。

## 修复方案

### 文件 1: `src/components/pdf/index.ts` (第5行)
将 `PdfSignerVue` 导出别名改为 `PdfSigner`，同时把原类型导出改名避免冲突：
```ts
// 之前:
export { default as PdfSignerVue } from "./PdfSigner.vue";
export type { PdfSigner } from "./composables/usePdfSigner";

// 之后:
export { default as PdfSigner } from "./PdfSigner.vue";
export type { PdfSignerState } from "./composables/usePdfSigner";
```

### 文件 2: 检查是否有其他文件引用 `PdfSignerVue` 或 `PdfSigner` 类型
需要搜索确认无其他引用受影响。

### 验证
- Vite dev server 不再报 SyntaxError
- PdfDemo.vue 正常加载
