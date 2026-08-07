<script setup lang="ts" name="SlideEditor">
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import {ShSvgIcon} from "@/components/shared";
import {
  createSlide,
  createSlideElement,
  OFFICE_SHAPE_TYPE_PRESETS,
  OFFICE_SLIDE_CANVAS_HEIGHT,
  OFFICE_SLIDE_CANVAS_WIDTH,
} from "../constants";
import type {OfficeShapeType, Slide, SlideContent, SlideElement} from "../types";

const props = defineProps<{
  content: SlideContent;
}>();

const emit = defineEmits<{
  (e: "update", content: SlideContent): void;
}>();

/** 当前幻灯片索引 */
const currentIndex = ref(0);
/** 当前选中元素 ID */
const selectedElementId = ref<string | null>(null);
/** 图片对话框 */
const imageDialogVisible = ref(false);
const imageUrl = ref("");

/** 当前幻灯片 */
const currentSlide = computed<Slide | null>(() => {
  if (props.content.slides.length === 0) return null;
  const idx = Math.min(currentIndex.value, props.content.slides.length - 1);
  return props.content.slides[idx] ?? null;
});

/** 当前选中元素 */
const selectedElement = computed<SlideElement | null>(() => {
  if (!currentSlide.value || !selectedElementId.value) return null;
  return currentSlide.value.elements.find((e) => e.id === selectedElementId.value) ?? null;
});

/** 同步到父组件 */
const syncToParent = () => {
  emit("update", {...props.content, slides: [...props.content.slides]});
};

/** 添加幻灯片 */
const addSlide = () => {
  props.content.slides.push(createSlide());
  currentIndex.value = props.content.slides.length - 1;
  selectedElementId.value = null;
  syncToParent();
};

/** 删除幻灯片 */
const removeSlide = () => {
  if (props.content.slides.length <= 1) return;
  props.content.slides.splice(currentIndex.value, 1);
  currentIndex.value = Math.max(0, currentIndex.value - 1);
  selectedElementId.value = null;
  syncToParent();
};

/** 复制幻灯片 */
const duplicateSlide = () => {
  if (!currentSlide.value) return;
  const cloned: Slide = JSON.parse(JSON.stringify(currentSlide.value));
  cloned.id = `slide_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  cloned.elements = cloned.elements.map((e) => ({
    ...e,
    id: `elem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }));
  props.content.slides.splice(currentIndex.value + 1, 0, cloned);
  currentIndex.value += 1;
  syncToParent();
};

/** 添加文本元素 */
const addText = () => {
  if (!currentSlide.value) return;
  const el = createSlideElement("text", {
    text: i18n("office.slide.addText"),
    width: 240,
    height: 50,
    x: 100,
    y: 100,
  });
  currentSlide.value.elements.push(el);
  selectedElementId.value = el.id;
  syncToParent();
};

/** 添加形状元素 */
const addShape = (shape: OfficeShapeType) => {
  if (!currentSlide.value) return;
  const el = createSlideElement("shape", {
    shape,
    width: 120,
    height: 120,
    x: 200,
    y: 200,
    fill: "#409EFF",
  });
  currentSlide.value.elements.push(el);
  selectedElementId.value = el.id;
  syncToParent();
};

/** 添加图片元素 */
const addImage = () => {
  imageDialogVisible.value = true;
  imageUrl.value = "";
};

const confirmAddImage = () => {
  const url = imageUrl.value.trim();
  if (!url) {
    ElMessage.warning(i18n("office.slide.image.placeholder"));
    return;
  }
  if (!currentSlide.value) return;
  const el = createSlideElement("image", {
    src: url,
    width: 240,
    height: 180,
    x: 300,
    y: 200,
  });
  currentSlide.value.elements.push(el);
  selectedElementId.value = el.id;
  imageDialogVisible.value = false;
  syncToParent();
};

/** 删除选中元素 */
const deleteSelectedElement = () => {
  if (!currentSlide.value || !selectedElementId.value) {
    ElMessage.warning(i18n("office.slide.noElement"));
    return;
  }
  const idx = currentSlide.value.elements.findIndex((e) => e.id === selectedElementId.value);
  if (idx >= 0) currentSlide.value.elements.splice(idx, 1);
  selectedElementId.value = null;
  syncToParent();
};

/** 选中元素 */
const handleSelectElement = (id: string | null) => {
  selectedElementId.value = id;
};

/** 拖拽状态 */
const dragState = ref<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

/** 开始拖拽 */
const startDrag = (e: MouseEvent, el: SlideElement) => {
  e.stopPropagation();
  selectedElementId.value = el.id;
  dragState.value = {
    id: el.id,
    startX: e.clientX,
    startY: e.clientY,
    origX: el.x,
    origY: el.y,
  };
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);
};

/** 拖拽中 */
const onDragMove = (e: MouseEvent) => {
  if (!dragState.value || !currentSlide.value) return;
  const el = currentSlide.value.elements.find((x) => x.id === dragState.value!.id);
  if (!el) return;
  const dx = e.clientX - dragState.value.startX;
  const dy = e.clientY - dragState.value.startY;
  el.x = Math.max(0, dragState.value.origX + dx);
  el.y = Math.max(0, dragState.value.origY + dy);
};

/** 结束拖拽 */
const onDragEnd = () => {
  dragState.value = null;
  window.removeEventListener("mousemove", onDragMove);
  window.removeEventListener("mouseup", onDragEnd);
  syncToParent();
};

/** 更新选中元素属性 */
const updateElementProp = (key: keyof SlideElement, value: any) => {
  if (!selectedElement.value) return;
  (selectedElement.value as any)[key] = value;
  syncToParent();
};

/** 形状路径 */
const shapePath = (el: SlideElement): string => {
  const {x, y, width, height, shape} = el;
  switch (shape) {
    case "triangle":
      return `${x + width / 2},${y} ${x + width},${y + height} ${x},${y + height}`;
    case "arrow":
      return `${x},${y + height / 3} ${x + width * 0.6},${y + height / 3} ${x + width * 0.6},${y} ${x + width},${y + height / 2} ${x + width * 0.6},${y + height} ${x + width * 0.6},${y + (height * 2) / 3} ${x},${y + (height * 2) / 3}`;
    default:
      return "";
  }
};

/** 缩略图 SVG（迷你预览） */
const thumbElements = (slide: Slide): string => {
  return slide.elements
      .map((e) => {
        if (e.type === "text") return `<text x="${e.x / 4}" y="${e.y / 4 + 8}" font-size="${(e.fontSize ?? 14) / 4}" fill="${e.color ?? '#333'}">${e.text ?? ""}</text>`;
        if (e.type === "image") return `<image x="${e.x / 4}" y="${e.y / 4}" width="${e.width / 4}" height="${e.height / 4}" href="${e.src ?? ''}"/>`;
        return `<rect x="${e.x / 4}" y="${e.y / 4}" width="${e.width / 4}" height="${e.height / 4}" fill="${e.fill ?? '#409EFF'}"/>`;
      })
      .join("");
};

const thumbSvg = (slide: Slide): string =>
    `<svg viewBox="0 0 ${OFFICE_SLIDE_CANVAS_WIDTH / 4} ${OFFICE_SLIDE_CANVAS_HEIGHT / 4}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">${thumbElements(slide)}</svg>`;
</script>

<template>
  <div class="slide-editor">
    <div class="slide-toolbar">
      <el-tooltip :content="i18n('office.slide.addSlide')" :show-after="500">
        <el-button type="primary" @click="addSlide">
          <ShSvgIcon name="plus" size="14px"/>
          {{ i18n("office.slide.addSlide") }}
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.slide.duplicateSlide')" :show-after="500">
        <el-button @click="duplicateSlide">
          <ShSvgIcon name="duplicate" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-tooltip :content="i18n('office.slide.removeSlide')" :show-after="500">
        <el-button type="danger" :disabled="content.slides.length <= 1" @click="removeSlide">
          <ShSvgIcon name="delete" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-divider direction="vertical"/>
      <el-tooltip :content="i18n('office.slide.addText')" :show-after="500">
        <el-button @click="addText">
          <ShSvgIcon name="text" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-dropdown @command="(cmd: OfficeShapeType) => addShape(cmd)">
        <el-tooltip :content="i18n('office.slide.addShape')" :show-after="500">
          <el-button>
            <ShSvgIcon name="shape" size="14px"/>
          </el-button>
        </el-tooltip>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="s in OFFICE_SHAPE_TYPE_PRESETS" :key="s.type" :command="s.type">
              {{ s.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip :content="i18n('office.slide.addImage')" :show-after="500">
        <el-button @click="addImage">
          <ShSvgIcon name="image" size="14px"/>
        </el-button>
      </el-tooltip>
      <el-divider direction="vertical"/>
      <el-tooltip :content="i18n('office.slide.deleteElement')" :show-after="500">
        <el-button type="danger" :disabled="!selectedElement" @click="deleteSelectedElement">
          <ShSvgIcon name="delete" size="14px"/>
        </el-button>
      </el-tooltip>
    </div>
    <div class="slide-body">
      <!-- 左侧幻灯片列表 -->
      <div class="slide-list">
        <div
            v-for="(s, idx) in content.slides"
            :key="s.id"
            class="slide-thumb"
            :class="{ active: idx === currentIndex }"
            @click="currentIndex = idx; selectedElementId = null"
        >
          <div class="thumb-num">{{ idx + 1 }}</div>
          <div class="thumb-canvas" v-html="thumbSvg(s)"></div>
        </div>
      </div>
      <!-- 中央 SVG 画布 -->
      <div class="slide-canvas-area">
        <svg
            v-if="currentSlide"
            :viewBox="`0 0 ${OFFICE_SLIDE_CANVAS_WIDTH} ${OFFICE_SLIDE_CANVAS_HEIGHT}`"
            class="slide-canvas"
            :style="{ background: currentSlide.bg ?? '#fff' }"
            @mousedown="handleSelectElement(null)"
        >
          <g
              v-for="el in currentSlide.elements"
              :key="el.id"
              :class="{ selected: el.id === selectedElementId }"
              @mousedown="startDrag($event, el)"
          >
            <!-- 文本 -->
            <text
                v-if="el.type === 'text'"
                :x="el.x"
                :y="el.y + (el.fontSize ?? 18)"
                :font-size="el.fontSize ?? 18"
                :fill="el.color ?? '#333'"
            >{{ el.text }}
            </text>
            <!-- 图片 -->
            <image
                v-else-if="el.type === 'image'"
                :x="el.x"
                :y="el.y"
                :width="el.width"
                :height="el.height"
                :href="el.src"
            />
            <!-- 矩形 -->
            <rect
                v-else-if="el.shape === 'rect'"
                :x="el.x"
                :y="el.y"
                :width="el.width"
                :height="el.height"
                :fill="el.fill"
            />
            <!-- 圆形 -->
            <circle
                v-else-if="el.shape === 'circle'"
                :cx="el.x + el.width / 2"
                :cy="el.y + el.height / 2"
                :r="Math.min(el.width, el.height) / 2"
                :fill="el.fill"
            />
            <!-- 三角形/箭头 -->
            <polygon
                v-else
                :points="shapePath(el)"
                :fill="el.fill"
            />
            <!-- 选中边框 -->
            <rect
                v-if="el.id === selectedElementId"
                :x="el.x - 2"
                :y="el.y - 2"
                :width="el.width + 4"
                :height="el.height + 4"
                fill="none"
                stroke="#409EFF"
                stroke-width="2"
                stroke-dasharray="4 2"
            />
          </g>
        </svg>
      </div>
      <!-- 右侧属性面板 -->
      <div class="slide-property">
        <div class="prop-title">{{ i18n("office.property.title") }}</div>
        <div v-if="!selectedElement" class="prop-empty">{{ i18n("office.slide.noElement") }}</div>
        <el-form v-else label-width="60px">
          <el-form-item :label="i18n('office.slide.property.x')">
            <el-input-number :model-value="selectedElement.x" :min="0"
                             @change="(v: number) => updateElementProp('x', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('office.slide.property.y')">
            <el-input-number :model-value="selectedElement.y" :min="0"
                             @change="(v: number) => updateElementProp('y', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('office.slide.property.width')">
            <el-input-number :model-value="selectedElement.width" :min="10"
                             @change="(v: number) => updateElementProp('width', v)"/>
          </el-form-item>
          <el-form-item :label="i18n('office.slide.property.height')">
            <el-input-number :model-value="selectedElement.height" :min="10"
                             @change="(v: number) => updateElementProp('height', v)"/>
          </el-form-item>
          <el-form-item v-if="selectedElement.type === 'text'" :label="i18n('office.slide.property.text')">
            <el-input :model-value="selectedElement.text" @input="(v: string) => updateElementProp('text', v)"/>
          </el-form-item>
          <el-form-item v-if="selectedElement.type === 'text'" :label="i18n('office.slide.property.fontSize')">
            <el-input-number :model-value="selectedElement.fontSize" :min="8" :max="120"
                             @change="(v: number) => updateElementProp('fontSize', v)"/>
          </el-form-item>
          <el-form-item v-if="selectedElement.type === 'text'" :label="i18n('office.slide.property.color')">
            <el-color-picker :model-value="selectedElement.color"
                             @change="(v: string) => updateElementProp('color', v)"/>
          </el-form-item>
          <el-form-item v-if="selectedElement.type === 'shape'" :label="i18n('office.slide.property.fill')">
            <el-color-picker :model-value="selectedElement.fill" @change="(v: string) => updateElementProp('fill', v)"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 图片插入弹窗 -->
    <el-dialog v-model="imageDialogVisible" :title="i18n('office.slide.addImage')" width="420px" append-to-body>
      <el-form>
        <el-form-item :label="i18n('office.slide.image.url')">
          <el-input v-model="imageUrl" :placeholder="i18n('office.slide.image.placeholder')"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="imageDialogVisible = false">{{ i18n("dialog.close") }}</el-button>
        <el-button type="primary" @click="confirmAddImage">{{ i18n("office.word.table.confirm") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.slide-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .slide-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-wrap: wrap;
  }

  .slide-body {
    flex: 1;
    display: flex;
    overflow: hidden;

    .slide-list {
      width: 160px;
      overflow: auto;
      padding: 8px;
      border-right: 1px solid var(--el-border-color-lighter);
      background: var(--el-fill-color-lighter);

      .slide-thumb {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
        margin-bottom: 6px;
        background: #fff;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;

        &.active {
          border-color: var(--el-color-primary);
        }

        .thumb-num {
          font-size: 11px;
          color: var(--el-text-color-secondary);
          width: 14px;
          text-align: center;
        }

        .thumb-canvas {
          flex: 1;
          aspect-ratio: 16 / 9;
          background: #fff;
          border: 1px solid var(--el-border-color-lighter);
          overflow: hidden;
        }
      }
    }

    .slide-canvas-area {
      flex: 1;
      overflow: auto;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;

      .slide-canvas {
        width: 100%;
        max-width: 960px;
        aspect-ratio: 16 / 9;
        border: 1px solid var(--el-border-color);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        cursor: default;

        g {
          cursor: move;

          &.selected {
            outline: none;
          }
        }
      }
    }

    .slide-property {
      width: 240px;
      border-left: 1px solid var(--el-border-color-lighter);
      padding: 8px;
      overflow: auto;
      background: var(--el-fill-color-lighter);

      .prop-title {
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }

      .prop-empty {
        text-align: center;
        color: var(--el-text-color-placeholder);
        font-size: 12px;
        padding: 16px 0;
      }
    }
  }
}

/* end of styles */
</style>
