<script setup lang="ts" name="PrintElementPanel">
/**
 * 打印模板设计器 - 左侧元素面板
 * 职责：展示可拖入画布的元素分类
 */
import { i18n } from "@/lang";

const props = defineProps<{
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "add", type: string): void;
  (e: "drag-start", type: string): void;
}>();

interface ElementCategory {
  name: string;
  icon: string;
  type: string;
}

const categories: { title: string; items: ElementCategory[] }[] = [
  {
    title: i18n("print.category.basic"),
    items: [
      { name: i18n("print.element.text"), icon: "text", type: "text" },
      {
        name: i18n("print.element.datetime"),
        icon: "datetime",
        type: "datetime",
      },
      { name: i18n("print.element.counter"), icon: "number", type: "counter" },
    ],
  },
  {
    title: i18n("print.category barcode"),
    items: [
      { name: i18n("print.element.barcode"), icon: "qrcode", type: "barcode" },
      { name: i18n("print.element.qrcode"), icon: "qrcode", type: "qrcode" },
    ],
  },
  {
    title: i18n("print.category.graphic"),
    items: [
      { name: i18n("print.element.image"), icon: "image", type: "image" },
      { name: i18n("print.element.line"), icon: "divider", type: "line" },
      { name: i18n("print.element.rect"), icon: "rectangle", type: "rect" },
    ],
  },
  {
    title: i18n("print.category.data"),
    items: [
      { name: i18n("print.element.table"), icon: "table", type: "table" },
    ],
  },
];

const handleAdd = (type: string) => {
  if (props.readonly) return;
  emits("add", type);
};

const handleDragStart = (e: DragEvent, type: string) => {
  if (props.readonly) return;
  e.dataTransfer?.setData("print-element-type", type);
  emits("drag-start", type);
};
</script>

<template>
  <div class="print-element-panel">
    <div v-for="(cat, idx) in categories" :key="idx" class="element-category">
      <div class="category-title">{{ cat.title }}</div>
      <div class="category-items">
        <div
          v-for="item in cat.items"
          :key="item.type"
          class="element-item"
          :class="{ disabled: readonly }"
          :draggable="!readonly"
          @click="handleAdd(item.type)"
          @dragstart="handleDragStart($event, item.type)"
          :title="item.name"
        >
          <star-horse-icon :icon-class="item.icon" cursor="pointer" />
          <span class="element-name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.print-element-panel {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-lighter);
  padding: 8px;
  box-sizing: border-box;
  flex-shrink: 0;

  .element-category {
    margin-bottom: 12px;

    .category-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--el-text-color-secondary);
      padding: 4px 8px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .category-items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }

    .element-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 4px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 4px;
      cursor: grab;
      transition: all 0.15s;
      gap: 4px;
      min-height: 56px;

      &:hover {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
        transform: translateY(-1px);
      }

      &:active {
        cursor: grabbing;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .element-name {
        font-size: 11px;
        color: var(--el-text-color-regular);
        text-align: center;
        line-height: 1.2;
      }
    }
  }
}
</style>
