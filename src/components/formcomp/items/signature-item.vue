<script setup lang="ts">
import {computed, nextTick, ref, watch} from "vue";
import SmoothSignature from "smooth-signature";
import {warning} from "@/utils/message";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";
import {ItemPreps} from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import {i18n} from "@/lang";
import {isMobile} from "@/api/device";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");

// 弹窗控制：签名编辑弹窗
const signDialogVisible = ref(false);
// 大图预览弹窗（保留原有预览功能）
const previewDialog = ref(false);

// 签名实例
type SignatureInstance = SmoothSignature & { destroy?: () => void; fromDataURL?: (data: string) => void };
let signature = ref<SignatureInstance | null>(null);
const signatureCanvas = ref<HTMLCanvasElement | null>(null);

// 签名配置
const getSignatureOptions = () => {
  return {
    // 固定宽高，保证签名图片尺寸一致，不受弹窗大小影响
    width: 500,
    height: 200,
    minWidth: 2,
    maxWidth: 6,
    bgColor: "#f6f6f6",
    ...props.field?.preps,
  };
};

// 初始化签名画布（弹窗打开后执行）
const initSignature = async () => {
  await nextTick();
  if (signatureCanvas.value) {
    // 销毁旧实例防止重复创建
    if (signature.value) {
      signature.value.destroy?.();
      signature.value = null;
    }
    signature.value = new SmoothSignature(signatureCanvas.value, getSignatureOptions());

    // 如果已有历史签名base64，回填画布
    const base64 = formData.value[props.field.fieldName];
    if (base64) {
      signature.value.fromDataURL(base64);
    }
  }
};

// 清空画布
const clear = () => {
  signature.value && signature.value.clear();
};

// 撤销
const undo = () => {
  signature.value && signature.value.undo();
};

// 确认签名
const confirmSign = () => {
  if (!signature.value) return;
  const isEmpty = signature.value.isEmpty();
  if (isEmpty) {
    warning(i18n("item.pleaseSignFirst"));
    return;
  }
  // 赋值到表单字段
  formData.value[props.field.fieldName] =
      props.field.preps?.imageType == "jpg"
          ? signature.value.getJPG()
          : signature.value.getPNG();

  signDialogVisible.value = false;
};

// 打开签名弹窗
const openSignDialog = () => {
  if (props.disabled) return;
  signDialogVisible.value = true;
};

// 大图预览
const handlePreview = () => {
  const base64 = formData.value[props.field.fieldName];
  if (!base64) {
    warning(i18n("item.pleaseSignFirst"));
    return;
  }
  previewDialog.value = true;
};

// 弹窗打开后初始化
watch(signDialogVisible, (val) => {
  if (val) {
    nextTick(initSignature);
  } else {
    // 关闭弹窗销毁实例释放内存
    if (signature.value) {
      signature.value.destroy?.();
      signature.value = null;
    }
  }
});

// 获取当前签名图片base64
const signImage = computed(() => {
  return formData.value?.[props.field.fieldName] || "";
});
</script>

<template>
  <!-- 大图预览弹窗（原有功能保留） -->
  <star-horse-dialog
      v-model="previewDialog"
      :source="3"
      :self-func="true"
      @closeAction="previewDialog = false"
  >
    <el-image :src="signImage" fit="contain" style="width:100%"/>
  </star-horse-dialog>

  <!-- 签名编辑弹窗【核心】画布只在这里 -->
  <star-horse-dialog
      v-model="signDialogVisible"
      title="手写签名"
      @merge="confirmSign"
      width="600px"
      :self-func="true"
  >
    <div class="signature-wrapper">
      <div class="sign-toolbar">
        <el-button size="small" @click="clear">
          <star-horse-icon icon-class="reset"/>
          清空
        </el-button>
        <el-button size="small" @click="undo">
          <star-horse-icon icon-class="undo"/>
          撤销
        </el-button>
      </div>
      <div class="sign-canvas-wrap">
        <canvas ref="signatureCanvas" class="sign-canvas"/>
      </div>
    </div>
  </star-horse-dialog>

  <starhorse-form-item
      :showFormItem="showFormItem"
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :field="field"
      :parentField="parentField"
  >
    <div class="signature-container">
      <!-- 无签名：显示按钮 -->
      <el-button
          v-if="!signImage&&source!=3"
          type="primary"
          @click="openSignDialog"
          :disabled="disabled"
      >
        <star-horse-icon icon-class="edit" color="var(--star-horse-white)"/>
        点击进行签名
      </el-button>

      <!-- 已有签名：固定宽高展示图片，点击可重新编辑 -->
      <div
          v-else
          class="sign-preview-box"
          :class="{ disabled: disabled }"
      >
        <el-image
            :src="signImage"
            fit="contain"
            class="sign-preview-img"
            @click="openSignDialog"
        />
        <div class="sign-preview-actions" v-if="source!=3">
          <el-tooltip :content="i18n('item.editSignature')" :trigger="isMobile ? 'click' : 'hover'">
            <star-horse-icon
                icon-class="edit"
                class="sign-action-icon"
                @click.stop="openSignDialog"
            />
          </el-tooltip>
          <el-tooltip :content="i18n('item.previewSignature')" :trigger="isMobile ? 'click' : 'hover'">
            <star-horse-icon
                icon-class="data-view"
                class="sign-action-icon"
                @click.stop="handlePreview"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </starhorse-form-item>
</template>

<style lang="scss" scoped>
.signature-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .sign-toolbar {
    display: flex;
    gap: 8px;
  }

  .sign-canvas-wrap {
    /* 容器居中显示固定尺寸的 canvas */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sign-canvas {
    /* 固定宽高，与 SmoothSignature 配置一致 */
    width: 500px;
    height: 200px;
    border: 2px dashed #ccc;
    cursor: crosshair;
    background: #f6f6f6;
    display: block;
  }

  .sign-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.signature-container {
  .sign-preview-box {
    /* 固定宽高容器，防止图片按原始尺寸拉伸 */
    width: 250px;
    height: 100px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 4px;
    transition: 0.2s;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;

      .sign-preview-actions {
        opacity: 1;
      }
    }

    .sign-preview-img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    /* 操作图标悬浮在右上角，鼠标移入显示 */
    .sign-preview-actions {
      position: absolute;
      top: 4px;
      right: 4px;
      display: flex;
      gap: 4px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 4px;
      padding: 2px 4px;
      opacity: 0;
      transition: opacity 0.2s;

      .sign-action-icon {
        cursor: pointer;
        font-size: 16px;
        color: var(--el-text-color-regular, #606266);

        &:hover {
          color: var(--el-color-primary, #409eff);
        }
      }
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.7;

      .sign-preview-actions {
        display: none;
      }
    }
  }
}
</style>
