<script setup lang="ts" name="PdfSigner">
import {computed, onBeforeUnmount, ref} from "vue";
import {ElMessage} from "element-plus";
import {i18n} from "@/lang";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import {usePdfSigner} from "./composables/usePdfSigner";
import type {PdfSignatureInfo} from "./types";

const props = defineProps<{
  sourceUrl?: string;
  signatures?: PdfSignatureInfo[];
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "save", signatures: PdfSignatureInfo[]): void;
}>();

const signer = usePdfSigner({signatures: props.signatures});

/** 签名采集弹窗 */
const signDialogVisible = ref(false);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const lastPoint = ref<{ x: number; y: number } | null>(null);

/** 初始化画布 */
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = signer.penColor.value;
  ctx.lineWidth = signer.penWidth.value;
};

const handleOpenSignDialog = () => {
  signDialogVisible.value = true;
  setTimeout(initCanvas, 100);
};

/** 鼠标按下 */
const handleMouseDown = (e: MouseEvent) => {
  if (props.readonly) return;
  isDrawing.value = true;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  lastPoint.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

/** 鼠标移动 */
const handleMouseMove = (e: MouseEvent) => {
  if (!isDrawing.value || !lastPoint.value) return;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const current = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  ctx.beginPath();
  ctx.moveTo(lastPoint.value.x, lastPoint.value.y);
  ctx.lineTo(current.x, current.y);
  ctx.stroke();
  lastPoint.value = current;
};

/** 鼠标松开 */
const handleMouseUp = () => {
  isDrawing.value = false;
  lastPoint.value = null;
};

/** 触摸事件 */
const handleTouchStart = (e: TouchEvent) => {
  if (props.readonly) return;
  e.preventDefault();
  const touch = e.touches[0];
  if (!touch) return;
  isDrawing.value = true;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  lastPoint.value = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDrawing.value || !lastPoint.value) return;
  e.preventDefault();
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  if (!touch) return;
  const current = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
  ctx.beginPath();
  ctx.moveTo(lastPoint.value.x, lastPoint.value.y);
  ctx.lineTo(current.x, current.y);
  ctx.stroke();
  lastPoint.value = current;
};

/** 清空画布 */
const handleClear = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

/** 检查画布是否为空 */
const isCanvasEmpty = (): boolean => {
  const canvas = canvasRef.value;
  if (!canvas) return true;
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
      return false;
    }
  }
  return true;
};

/** 确认签名 */
const handleConfirmSign = () => {
  if (isCanvasEmpty()) {
    ElMessage.warning(i18n("pdf.signer.emptySignature"));
    return;
  }
  const canvas = canvasRef.value;
  if (!canvas) return;
  // 裁剪空白边缘（简化版）
  const dataUrl = canvas.toDataURL("image/png");
  signer.addSignature({
    signer: i18n("pdf.signer.currentSigner"),
    imageDataUrl: dataUrl,
    x: 20,
    y: 200,
    width: 100,
    height: 40,
    page: 1,
  });
  signDialogVisible.value = false;
  ElMessage.success(i18n("pdf.signer.signatureAdded"));
};

/** 移除签名 */
const handleRemove = (id: string) => {
  signer.removeSignature(id);
};

/** 保存 */
const handleSave = () => {
  emits("save", signer.getData().signatures);
};

const innerSignDialogVisible = computed({
  get: () => signDialogVisible.value,
  set: (v) => {
    signDialogVisible.value = v;
  },
});

onBeforeUnmount(() => {
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<template>
  <div class="pdf-signer">
    <div class="signer-toolbar">
      <el-button

          type="primary"
          :disabled="readonly"
          @click="handleOpenSignDialog"
      >
        <el-icon>
          <EditPen/>
        </el-icon>
        {{ i18n("pdf.signer.addSignature") }}
      </el-button>
      <el-button type="success" :disabled="readonly" @click="handleSave">
        <el-icon>
          <Check/>
        </el-icon>
        {{ i18n("dialog.save") }}
      </el-button>
    </div>

    <div class="signer-content">
      <div class="source-preview" v-if="sourceUrl">
        <iframe :src="sourceUrl" class="preview-iframe"/>
      </div>
      <div class="source-empty" v-else>
        <el-empty :description="i18n('pdf.signer.sourceEmpty')"/>
      </div>

      <!-- 签名列表覆盖层 -->
      <div class="signatures-overlay">
        <div
            v-for="sig in signer.signatures"
            :key="sig.id"
            class="signature-item"
            :style="{
                        left: `${sig.x}px`,
                        top: `${sig.y}px`,
                        width: `${sig.width}px`,
                        height: `${sig.height}px`
                    }"
            @click="signer.selectSignature(sig.id)"
        >
          <img v-if="sig.imageDataUrl" :src="sig.imageDataUrl" class="signature-image"/>
          <div class="signature-meta">
            <span class="signer-name">{{ sig.signer }}</span>
            <span class="signed-at">{{ sig.signedAt?.slice(0, 19).replace("T", " ") }}</span>
          </div>
          <el-button
              v-if="!readonly"

              text
              class="remove-btn"
              @click.stop="handleRemove(sig.id)"
          >
            <el-icon>
              <Close/>
            </el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 签名采集弹窗 -->
    <star-horse-dialog
        v-model="innerSignDialogVisible"
        :title="i18n('pdf.signer.dialog.title')"
        box-width="600px"
        :self-func="true"
        @merge="handleConfirmSign"
    >
      <div class="sign-dialog-content">
        <div class="canvas-toolbar">
          <span class="label">{{ i18n("pdf.signer.penColor") }}:</span>
          <el-color-picker v-model="signer.penColor.value"/>
          <span class="label">{{ i18n("pdf.signer.penWidth") }}:</span>
          <el-input-number v-model="signer.penWidth.value" :min="1" :max="10"/>
          <el-button @click="handleClear">
            <el-icon>
              <Delete/>
            </el-icon>
            {{ i18n("pdf.signer.clear") }}
          </el-button>
        </div>
        <canvas
            ref="canvasRef"
            width="500"
            height="240"
            class="sign-canvas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleMouseUp"
        />
        <div class="sign-tip">{{ i18n("pdf.signer.tip") }}</div>
      </div>
    </star-horse-dialog>
  </div>
</template>

<script lang="ts">
import {EditPen, Check, Close, Delete} from "@element-plus/icons-vue";

export default {components: {EditPen, Check, Close, Delete}};
</script>

<style lang="scss" scoped>
.pdf-signer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--el-bg-color-page);
  overflow: hidden;

  .signer-toolbar {
    display: flex;
    gap: 8px;
    padding: 6px 12px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);
  }

  .signer-content {
    flex: 1;
    position: relative;
    overflow: auto;

    .source-preview {
      width: 100%;
      height: 100%;

      .preview-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .source-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .signatures-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;

      .signature-item {
        position: absolute;
        border: 2px solid var(--el-color-primary);
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        pointer-events: auto;
        cursor: pointer;
        padding: 4px;

        .signature-image {
          max-width: 100%;
          max-height: 70%;
          object-fit: contain;
        }

        .signature-meta {
          display: flex;
          flex-direction: column;
          font-size: 10px;
          color: var(--el-text-color-secondary);
          text-align: center;
        }

        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: var(--el-color-danger);
          color: #FFFFFF;
          border-radius: 50%;
          padding: 2px;
        }
      }
    }
  }
}

.sign-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .canvas-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .sign-canvas {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    cursor: crosshair;
    background: #FFFFFF;
  }

  .sign-tip {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    text-align: center;
  }
}
</style>
