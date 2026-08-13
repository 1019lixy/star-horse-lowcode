<script setup lang="ts" name="WbCanvas">
/**
 * 白板画布 - 核心交互组件
 *
 * 职责：SVG 渲染 / 绘制 / 选择 / 拖拽 / 框选 / 缩放 / 平移 / 文本编辑
 * 注：本组件承担多种交互逻辑，行数较多（合理超 350 行）
 */
import {
  computed,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { i18n } from "@/lang";
import type { UseWhiteboardDesignerReturn } from "../composables/useWhiteboardDesigner";
import {
  createWbLineElement,
  createWbPenElement,
  createWbShapeElement,
  createWbTextElement,
} from "../constants";
import type {
  PenElement,
  ShapeElement,
  TextElement,
  WhiteboardElement,
} from "../types";
import {
  wbArrowPath,
  wbElementIntersectsRect,
  wbGetBoundingBox,
  wbHitTest,
  wbPointsToPath,
  wbShapePath,
} from "../utils/WbGeometryUtils";

const props = defineProps<{
  designer: UseWhiteboardDesignerReturn;
}>();

const wrapperRef = ref<HTMLElement>();
const svgWidth = ref(1000);
const svgHeight = ref(700);

const designer = props.designer;
const state = designer.state;

// ============== 视口尺寸 ==============
const updateSize = () => {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  svgWidth.value = rect.width;
  svgHeight.value = rect.height;
};

let resizeObserver: ResizeObserver | null = null;
const setupObserver = () => {
  if (!wrapperRef.value) return;
  resizeObserver = new ResizeObserver(() => updateSize());
  resizeObserver.observe(wrapperRef.value);
};
onMounted(() => {
  updateSize();
  setupObserver();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
});
onActivated(() => updateSize());
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  resizeObserver?.disconnect();
  removeWindowDragListeners();
});

// ============== 坐标转换：屏幕 -> 画布逻辑坐标 ==============
const toCanvasPoint = (clientX: number, clientY: number) => {
  const rect = wrapperRef.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: (clientX - rect.left - state.canvas.panX) / state.canvas.zoom,
    y: (clientY - rect.top - state.canvas.panY) / state.canvas.zoom,
  };
};

// ============== 空格平移模式 ==============
const spacePressed = ref(false);
const isPanning = ref(false);

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Space" && !isEditableTarget(e.target)) {
    spacePressed.value = true;
    if (state.tool !== "pan") {
      // 不切换工具，只在 mousedown 时进入 pan
    }
  }
  if (e.code === "Escape") {
    designer.clearSelection();
    designer.cancelDrafting();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault();
    designer.undo();
  } else if (
    (e.ctrlKey || e.metaKey) &&
    (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
  ) {
    e.preventDefault();
    designer.redo();
  }
};
const onKeyUp = (e: KeyboardEvent) => {
  if (e.code === "Space") spacePressed.value = false;
};
const isEditableTarget = (t: EventTarget | null): boolean => {
  if (!t) return false;
  const tag = (t as HTMLElement).tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    (t as HTMLElement).isContentEditable
  );
};

// ============== 工具光标 ==============
const canvasCursor = computed(() => {
  if (isPanning.value) return "grabbing";
  if (spacePressed.value) return "grab";
  if (state.tool === "select") return "default";
  if (state.tool === "text") return "text";
  return "crosshair";
});

// ============== 渲染辅助 ==============
const visibleElements = computed(() =>
  state.elements.filter((e) => e.visible !== false),
);

const draftingElement = computed(() => designer.drafting.value);

const isSelected = (id: string) => state.selectedIds.includes(id);

const penPath = (el: PenElement): string => wbPointsToPath(el.points);

const shapePathOf = (el: ShapeElement): string =>
  wbShapePath(el.shape, el.width, el.height);

const arrowPathOf = (el: any): string =>
  wbArrowPath(el.x1, el.y1, el.x2, el.y2);

const selectionBox = (el: WhiteboardElement) => wbGetBoundingBox(el);

// 选中元素的控制点（4 角 + 4 边中点）
const handlePositions = (box: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const { x, y, width, height } = box;
  return [
    { name: "nw", x, y },
    { name: "n", x: x + width / 2, y },
    { name: "ne", x: x + width, y },
    { name: "e", x: x + width, y: y + height / 2 },
    { name: "se", x: x + width, y: y + height },
    { name: "s", x: x + width / 2, y: y + height },
    { name: "sw", x: x, y: y + height },
    { name: "w", x: x, y: y + height / 2 },
  ];
};

// ============== 交互状态 ==============
type DragMode =
  | { type: "none" }
  | { type: "draw"; startPoint: { x: number; y: number } }
  | {
      type: "move";
      startClient: { x: number; y: number };
      lastClient: { x: number; y: number };
    }
  | { type: "marquee"; startPoint: { x: number; y: number } }
  | {
      type: "pan";
      startClient: { x: number; y: number };
      origPan: { x: number; y: number };
    };

const drag = ref<DragMode>({ type: "none" });
const marqueeRect = ref<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null>(null);

// ============== 鼠标事件 ==============
const onMouseDown = (e: MouseEvent) => {
  if (e.button === 1 || (spacePressed.value && e.button === 0)) {
    // 中键 或 空格+左键 -> 平移
    isPanning.value = true;
    drag.value = {
      type: "pan",
      startClient: { x: e.clientX, y: e.clientY },
      origPan: { x: state.canvas.panX, y: state.canvas.panY },
    };
    addWindowDragListeners();
    e.preventDefault();
    return;
  }
  if (e.button !== 0) return;

  const pt = toCanvasPoint(e.clientX, e.clientY);
  const tool = state.tool;

  if (tool === "select") {
    // 命中检测（从上层到下层）
    let hit: WhiteboardElement | null = null;
    for (let i = state.elements.length - 1; i >= 0; i--) {
      const el = state.elements[i];
      if (el.visible === false) continue;
      if (wbHitTest(el, pt.x, pt.y, 6 / state.canvas.zoom)) {
        hit = el;
        break;
      }
    }
    if (hit) {
      if (!isSelected(hit.id)) {
        designer.selectElement(hit.id, e.shiftKey);
      } else if (e.shiftKey) {
        designer.selectElement(hit.id, true); // 取消选择
      }
      drag.value = {
        type: "move",
        startClient: { x: e.clientX, y: e.clientY },
        lastClient: { x: e.clientX, y: e.clientY },
      };
    } else {
      if (!e.shiftKey) designer.clearSelection();
      drag.value = { type: "marquee", startPoint: pt };
      marqueeRect.value = { x: pt.x, y: pt.y, width: 0, height: 0 };
    }
    addWindowDragListeners();
    return;
  }

  if (tool === "text") {
    const el = createWbTextElement({
      x: pt.x,
      y: pt.y,
      text: i18n("whiteboard.text.default"),
      color: state.stroke,
      fontSize: state.fontSize,
      opacity: state.opacity,
    });
    designer.addElement(el);
    return;
  }

  if (tool === "pen") {
    const el = createWbPenElement({
      points: [{ x: pt.x, y: pt.y }],
      stroke: state.stroke,
      strokeWidth: state.strokeWidth,
      opacity: state.opacity,
    });
    designer.setDrafting(el);
    drag.value = { type: "draw", startPoint: pt };
    addWindowDragListeners();
    return;
  }

  if (tool === "line") {
    const el = createWbLineElement({
      x1: pt.x,
      y1: pt.y,
      x2: pt.x,
      y2: pt.y,
      stroke: state.stroke,
      strokeWidth: state.strokeWidth,
      opacity: state.opacity,
      arrow: false,
    });
    designer.setDrafting(el);
    drag.value = { type: "draw", startPoint: pt };
    addWindowDragListeners();
    return;
  }

  if (tool === "arrow") {
    const el = createWbLineElement({
      x1: pt.x,
      y1: pt.y,
      x2: pt.x,
      y2: pt.y,
      stroke: state.stroke,
      strokeWidth: state.strokeWidth,
      opacity: state.opacity,
      arrow: true,
    });
    designer.setDrafting(el);
    drag.value = { type: "draw", startPoint: pt };
    addWindowDragListeners();
    return;
  }

  if (
    tool === "rect" ||
    tool === "circle" ||
    tool === "triangle" ||
    tool === "diamond"
  ) {
    const el = createWbShapeElement({
      shape: tool,
      x: pt.x,
      y: pt.y,
      width: 1,
      height: 1,
      stroke: state.stroke,
      fill: state.fill,
      strokeWidth: state.strokeWidth,
      opacity: state.opacity,
    });
    designer.setDrafting(el);
    drag.value = { type: "draw", startPoint: pt };
    addWindowDragListeners();
    return;
  }
};

const onMouseMove = (e: MouseEvent) => {
  if (drag.value.type === "none") return;
  const pt = toCanvasPoint(e.clientX, e.clientY);

  if (drag.value.type === "pan") {
    const dx = e.clientX - drag.value.startClient.x;
    const dy = e.clientY - drag.value.startClient.y;
    designer.setPan(drag.value.origPan.x + dx, drag.value.origPan.y + dy);
    return;
  }

  if (drag.value.type === "draw") {
    const drafting = designer.drafting.value;
    if (!drafting) return;
    const sp = drag.value.startPoint;
    if (drafting.type === "pen") {
      (drafting as PenElement).points.push({ x: pt.x, y: pt.y });
    } else if (drafting.type === "line") {
      const l = drafting as any;
      l.x2 = pt.x;
      l.y2 = pt.y;
    } else if (drafting.type === "shape") {
      const s = drafting as ShapeElement;
      const nx = Math.min(sp.x, pt.x);
      const ny = Math.min(sp.y, pt.y);
      const nw = Math.max(1, Math.abs(pt.x - sp.x));
      const nh = Math.max(1, Math.abs(pt.y - sp.y));
      s.x = nx;
      s.y = ny;
      s.width = nw;
      s.height = nh;
    }
    return;
  }

  if (drag.value.type === "move") {
    const dx = (e.clientX - drag.value.lastClient.x) / state.canvas.zoom;
    const dy = (e.clientY - drag.value.lastClient.y) / state.canvas.zoom;
    drag.value.lastClient = { x: e.clientX, y: e.clientY };
    state.selectedIds.forEach((id) => designer.moveElement(id, dx, dy));
    return;
  }

  if (drag.value.type === "marquee") {
    const sp = drag.value.startPoint;
    const x = Math.min(sp.x, pt.x);
    const y = Math.min(sp.y, pt.y);
    const w = Math.abs(pt.x - sp.x);
    const h = Math.abs(pt.y - sp.y);
    marqueeRect.value = { x, y, width: w, height: h };
    return;
  }
};

const onMouseUp = () => {
  removeWindowDragListeners();
  if (drag.value.type === "pan") {
    isPanning.value = false;
  }
  if (drag.value.type === "draw") {
    // 校验最小尺寸，过小则取消
    const drafting = designer.drafting.value;
    if (drafting) {
      const box = wbGetBoundingBox(drafting);
      if (box.width < 2 && box.height < 2) {
        designer.cancelDrafting();
      } else {
        designer.commitDrafting();
      }
    }
  }
  if (drag.value.type === "move") {
    if (state.selectedIds.length > 0) designer.pushHistory();
  }
  if (drag.value.type === "marquee" && marqueeRect.value) {
    const rect = marqueeRect.value;
    if (rect.width > 3 || rect.height > 3) {
      const ids = visibleElements.value
        .filter((el) => wbElementIntersectsRect(el, rect))
        .map((el) => el.id);
      if (ids.length > 0) designer.selectMany(ids);
    }
  }
  marqueeRect.value = null;
  drag.value = { type: "none" };
};

const addWindowDragListeners = () => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};
const removeWindowDragListeners = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

// ============== 滚轮缩放 ==============
const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  const rect = wrapperRef.value?.getBoundingClientRect();
  if (!rect) return;
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  const delta = e.deltaY < 0 ? 1.1 : 1 / 1.1;
  const newZoom = Math.max(0.2, Math.min(4, state.canvas.zoom * delta));
  // 以鼠标位置为中心缩放
  const ratio = newZoom / state.canvas.zoom;
  state.canvas.panX = cx - (cx - state.canvas.panX) * ratio;
  state.canvas.panY = cy - (cy - state.canvas.panY) * ratio;
  state.canvas.zoom = newZoom;
};

// ============== 文本双击编辑 ==============
const editingTextId = ref<string | null>(null);
const editingTextValue = ref("");

const onTextDblClick = (e: MouseEvent, el: TextElement) => {
  e.stopPropagation();
  if (state.readonly) return;
  editingTextId.value = el.id;
  editingTextValue.value = el.text;
  designer.selectElement(el.id);
};

const finishTextEdit = () => {
  if (!editingTextId.value) return;
  const el = state.elements.find((x) => x.id === editingTextId.value);
  if (el && el.type === "text") {
    (el as TextElement).text = editingTextValue.value;
    designer.pushHistory();
  }
  editingTextId.value = null;
  editingTextValue.value = "";
};

// ============== 单个元素选中处理 ==============
const onElementClick = (e: MouseEvent, id: string) => {
  if (state.tool !== "select") return;
  e.stopPropagation();
};

// viewBox 用于 svg 坐标系（这里使用 1:1 屏幕，靠 transform 缩放）
const canvasTransform = computed(
  () =>
    `translate(${state.canvas.panX},${state.canvas.panY}) scale(${state.canvas.zoom})`,
);

const gridSize = computed(() => state.canvas.gridSize);

// 当切换工具时关闭文本编辑
watch(
  () => state.tool,
  () => {
    if (editingTextId.value) finishTextEdit();
  },
);
</script>

<template>
  <div
    class="wb-canvas-wrapper"
    ref="wrapperRef"
    :style="{ cursor: canvasCursor, background: state.canvas.backgroundColor }"
    @mousedown="onMouseDown"
    @wheel="onWheel"
  >
    <svg :width="svgWidth" :height="svgHeight" class="wb-svg">
      <defs>
        <pattern
          v-if="state.canvas.showGrid"
          id="wb-grid"
          :width="gridSize"
          :height="gridSize"
          patternUnits="userSpaceOnUse"
        >
          <path
            :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
            fill="none"
            stroke="#E8E8E8"
            stroke-width="0.5"
          />
        </pattern>
      </defs>

      <g :transform="canvasTransform">
        <!-- 网格背景（覆盖整个画布范围） -->
        <rect
          v-if="state.canvas.showGrid"
          x="-100000"
          y="-100000"
          width="200000"
          height="200000"
          fill="url(#wb-grid)"
        />

        <!-- 元素层 -->
        <g
          v-for="el in visibleElements"
          :key="el.id"
          :class="{ 'wb-el-selected': isSelected(el.id) }"
          @click="(e) => onElementClick(e, el.id)"
        >
          <!-- pen -->
          <path
            v-if="el.type === 'pen'"
            :d="penPath(el as PenElement)"
            :stroke="(el as PenElement).stroke"
            :stroke-width="(el as PenElement).strokeWidth"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            :opacity="el.opacity ?? 1"
          />
          <!-- shape -->
          <g
            v-else-if="el.type === 'shape'"
            :transform="`translate(${(el as ShapeElement).x},${(el as ShapeElement).y}) rotate(${el.rotation ?? 0} ${(el as ShapeElement).width / 2} ${(el as ShapeElement).height / 2})`"
          >
            <path
              :d="shapePathOf(el as ShapeElement)"
              :stroke="(el as ShapeElement).stroke"
              :stroke-width="(el as ShapeElement).strokeWidth"
              :fill="
                (el as ShapeElement).fill === 'transparent'
                  ? 'none'
                  : (el as ShapeElement).fill
              "
              :opacity="el.opacity ?? 1"
            />
          </g>
          <!-- line / arrow -->
          <g v-else-if="el.type === 'line'">
            <path
              v-if="(el as any).arrow"
              :d="arrowPathOf(el)"
              :stroke="(el as any).stroke"
              :stroke-width="(el as any).strokeWidth"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              :opacity="el.opacity ?? 1"
            />
            <line
              v-else
              :x1="(el as any).x1"
              :y1="(el as any).y1"
              :x2="(el as any).x2"
              :y2="(el as any).y2"
              :stroke="(el as any).stroke"
              :stroke-width="(el as any).strokeWidth"
              :opacity="el.opacity ?? 1"
            />
          </g>
          <!-- text -->
          <g
            v-else-if="el.type === 'text'"
            :transform="`translate(${(el as TextElement).x},${(el as TextElement).y})`"
            @dblclick="(e) => onTextDblClick(e, el as TextElement)"
          >
            <rect
              :width="(el as TextElement).width"
              :height="(el as TextElement).height"
              fill="transparent"
            />
            <text
              v-if="editingTextId !== el.id"
              :x="0"
              :y="(el as TextElement).fontSize"
              :font-size="(el as TextElement).fontSize"
              :fill="(el as TextElement).color"
              :font-weight="(el as TextElement).fontWeight || 'normal'"
            >
              {{ (el as TextElement).text }}
            </text>
            <foreignObject
              v-else
              :width="(el as TextElement).width"
              :height="(el as TextElement).height"
            >
              <textarea
                v-model="editingTextValue"
                class="wb-text-editor"
                :style="{
                  fontSize: (el as TextElement).fontSize + 'px',
                  color: (el as TextElement).color,
                  fontWeight: (el as TextElement).fontWeight || 'normal',
                }"
                @blur="finishTextEdit"
                @keydown.enter.exact.prevent="finishTextEdit"
              />
            </foreignObject>
          </g>
        </g>

        <!-- 选中元素的控制点 -->
        <template
          v-if="designer.selectedElement.value && state.tool === 'select'"
        >
          <g
            v-for="sel in designer.selectedElements.value"
            :key="'sel-' + sel.id"
          >
            <rect
              v-if="selectionBox(sel)"
              :x="selectionBox(sel).x - 2"
              :y="selectionBox(sel).y - 2"
              :width="selectionBox(sel).width + 4"
              :height="selectionBox(sel).height + 4"
              fill="none"
              stroke="#1890FF"
              stroke-width="1"
              stroke-dasharray="3,3"
            />
            <circle
              v-for="h in handlePositions(selectionBox(sel))"
              :key="'h-' + sel.id + '-' + h.name"
              :cx="h.x"
              :cy="h.y"
              :r="4"
              fill="#FFFFFF"
              stroke="#1890FF"
              stroke-width="1.5"
              class="wb-handle"
            />
          </g>
        </template>

        <!-- drafting 预览 -->
        <g v-if="draftingElement">
          <path
            v-if="draftingElement.type === 'pen'"
            :d="penPath(draftingElement as PenElement)"
            :stroke="(draftingElement as PenElement).stroke"
            :stroke-width="(draftingElement as PenElement).strokeWidth"
            fill="none"
            stroke-linecap="round"
            opacity="0.9"
          />
          <g
            v-else-if="draftingElement.type === 'shape'"
            :transform="`translate(${(draftingElement as ShapeElement).x},${(draftingElement as ShapeElement).y})`"
          >
            <path
              :d="shapePathOf(draftingElement as ShapeElement)"
              :stroke="(draftingElement as ShapeElement).stroke"
              :stroke-width="(draftingElement as ShapeElement).strokeWidth"
              :fill="
                (draftingElement as ShapeElement).fill === 'transparent'
                  ? 'none'
                  : (draftingElement as ShapeElement).fill
              "
              opacity="0.9"
            />
          </g>
          <path
            v-else-if="
              draftingElement.type === 'line' && (draftingElement as any).arrow
            "
            :d="arrowPathOf(draftingElement)"
            :stroke="(draftingElement as any).stroke"
            :stroke-width="(draftingElement as any).strokeWidth"
            fill="none"
            stroke-linecap="round"
            opacity="0.9"
          />
          <line
            v-else-if="draftingElement.type === 'line'"
            :x1="(draftingElement as any).x1"
            :y1="(draftingElement as any).y1"
            :x2="(draftingElement as any).x2"
            :y2="(draftingElement as any).y2"
            :stroke="(draftingElement as any).stroke"
            :stroke-width="(draftingElement as any).strokeWidth"
            opacity="0.9"
          />
        </g>

        <!-- 框选矩形 -->
        <rect
          v-if="marqueeRect"
          :x="marqueeRect.x"
          :y="marqueeRect.y"
          :width="marqueeRect.width"
          :height="marqueeRect.height"
          fill="rgba(24,144,255,0.1)"
          stroke="#1890FF"
          stroke-width="1"
          stroke-dasharray="4,4"
        />
      </g>
    </svg>

    <!-- 提示信息 -->
    <div class="wb-hint" v-if="state.tool !== 'select' && state.tool !== 'pan'">
      <span v-if="state.tool === 'text'">{{
        i18n("whiteboard.hint.doubleClickToEdit")
      }}</span>
      <span v-else>{{ i18n("whiteboard.hint.dragToDraw") }}</span>
    </div>
    <div class="wb-hint wb-hint-tip" v-else>
      <span>{{ i18n("whiteboard.hint.dragToMove") }}</span>
      <span class="wb-hint-sep">·</span>
      <span>{{ i18n("whiteboard.hint.spaceToPan") }}</span>
      <span class="wb-hint-sep">·</span>
      <span>{{ i18n("whiteboard.hint.wheelToZoom") }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "WbCanvas",
};
</script>

<style lang="scss" scoped>
.wb-canvas-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .wb-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .wb-el-selected {
    // 选中时增加轻微阴影
    filter: drop-shadow(0 0 2px rgba(24, 144, 255, 0.4));
  }

  .wb-handle {
    cursor: pointer;
  }

  .wb-hint {
    position: absolute;
    bottom: 10px;
    left: 12px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    background: rgba(255, 255, 255, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    pointer-events: none;

    .wb-hint-sep {
      margin: 0 4px;
      opacity: 0.5;
    }
  }

  .wb-text-editor {
    width: 100%;
    height: 100%;
    border: 1px solid #1890ff;
    outline: none;
    padding: 0;
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
    resize: none;
    font-family: inherit;
    line-height: 1.2;
  }
}
</style>
