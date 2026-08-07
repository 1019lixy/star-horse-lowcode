<script setup lang="ts" name="WbLayerPanel">
import {i18n} from "@/lang";
import type {UseWhiteboardDesignerReturn} from "../composables/useWhiteboardDesigner";
import type {WhiteboardElement} from "../types";

const props = defineProps<{
  designer: UseWhiteboardDesignerReturn;
  readonly?: boolean;
}>();

/** 元素名称（用于图层显示） */
const elementName = (el: WhiteboardElement): string => {
  if (el.name) return el.name;
  switch (el.type) {
    case "pen":
      return i18n("whiteboard.tool.pen" as any);
    case "shape":
      return i18n("whiteboard.tool." + (el as any).shape as any);
    case "line":
      return (el as any).arrow ? i18n("whiteboard.tool.arrow" as any) : i18n("whiteboard.tool.line" as any);
    case "text":
      return (el as any).text?.slice(0, 12) || i18n("whiteboard.tool.text" as any);
    default:
      return "element";
  }
};

/** 元素类型图标 */
const elementIcon = (el: WhiteboardElement): string => {
  switch (el.type) {
    case "pen":
      return "edit";
    case "shape":
      return "rectangle";
    case "line":
      return (el as any).arrow ? "line_arrow" : "line_arrow";
    case "text":
      return "text";
    default:
      return "select";
  }
};

const handleClick = (el: WhiteboardElement, e: MouseEvent) => {
  props.designer.selectElement(el.id, e.shiftKey);
};

const handleDoubleClick = (el: WhiteboardElement) => {
  props.designer.duplicateElement(el.id);
};

const handleVisibleToggle = (e: MouseEvent, id: string) => {
  e.stopPropagation();
  props.designer.toggleVisible(id);
};
</script>

<template>
  <div class="wb-layer-panel">
    <div class="panel-header">
      <span class="panel-title">{{ i18n("whiteboard.layer.title") }}</span>
      <el-button
          v-if="designer.selectedElement.value"

          link
          @click="designer.duplicateElement(designer.state.selectedIds[0])"
          :title="i18n('whiteboard.layer.duplicate')"
      >
        <star-horse-icon icon-class="copy" cursor="pointer"/>
      </el-button>
    </div>
    <div class="panel-body">
      <div v-if="designer.elementCount.value === 0" class="empty-tip">
        {{ i18n("whiteboard.layer.empty") }}
      </div>
      <div
          v-for="el in designer.reversedElements.value"
          :key="el.id"
          class="layer-item"
          :class="{ 'layer-selected': designer.isSelected(el.id), 'layer-hidden': el.visible === false }"
          @click="(e) => handleClick(el, e)"
          @dblclick="handleDoubleClick(el)"
      >
        <star-horse-icon
            :icon-class="elementIcon(el)"
            cursor="pointer"
            class="layer-icon"
        />
        <span class="layer-name">{{ elementName(el) }}</span>
        <div class="layer-actions">
          <el-button

              link
              :title="el.visible === false ? i18n('whiteboard.layer.hidden') : i18n('whiteboard.layer.visible')"
              @click="(e) => handleVisibleToggle(e, el.id)"
          >
            <star-horse-icon
                :icon-class="el.visible === false ? 'eye-close' : 'eye'"
                cursor="pointer"
            />
          </el-button>
        </div>
      </div>
    </div>

    <!-- 层级操作 -->
    <div class="layer-ops" v-if="designer.selectedElement.value">
      <el-button-group>
        <el-button

            :disabled="readonly"
            @click="designer.bringToFront(designer.state.selectedIds[0])"
            :title="i18n('whiteboard.layer.bringToFront')"
        >
          <star-horse-icon icon-class="up-layer" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.bringForward(designer.state.selectedIds[0])"
            :title="i18n('whiteboard.layer.bringForward')"
        >
          <star-horse-icon icon-class="move-up" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.sendBackward(designer.state.selectedIds[0])"
            :title="i18n('whiteboard.layer.sendBackward')"
        >
          <star-horse-icon icon-class="move-down" cursor="pointer"/>
        </el-button>
        <el-button

            :disabled="readonly"
            @click="designer.sendToBack(designer.state.selectedIds[0])"
            :title="i18n('whiteboard.layer.sendToBack')"
        >
          <star-horse-icon icon-class="down-layer" cursor="pointer"/>
        </el-button>
      </el-button-group>
      <el-button

          type="danger"
          :disabled="readonly"
          @click="designer.deleteElements()"
          :title="i18n('whiteboard.layer.delete')"
      >
        <star-horse-icon icon-class="delete" cursor="pointer"/>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "WbLayerPanel",
};
</script>

<style lang="scss" scoped>
.wb-layer-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    font-weight: 600;
    font-size: 13px;

    .panel-title {
      color: var(--el-text-color-primary);
    }
  }

  .panel-body {
    flex: 1;
    overflow: auto;
    padding: 4px 0;

    .empty-tip {
      padding: 16px;
      text-align: center;
      color: var(--el-text-color-placeholder);
      font-size: 12px;
    }

    .layer-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.15s;

      &:hover {
        background: var(--el-fill-color-light);
      }

      &.layer-selected {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }

      &.layer-hidden {
        opacity: 0.5;
      }

      .layer-icon {
        font-size: 14px;
        flex-shrink: 0;
      }

      .layer-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .layer-actions {
        opacity: 0;
        transition: opacity 0.15s;
      }

      &:hover .layer-actions {
        opacity: 1;
      }
    }
  }

  .layer-ops {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>
