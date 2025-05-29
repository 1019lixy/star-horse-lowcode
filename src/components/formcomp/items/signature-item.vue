<script setup lang="ts">
import {nextTick, onMounted, onUpdated, ref, shallowRef} from 'vue';
import SmoothSignature from 'smooth-signature';
import {warning} from '@/utils/message';
import StarHorseIcon from '@/components/comp/StarHorseIcon.vue';
import StarHorseDialog from '@/components/comp/StarHorseDialog.vue';
defineProps({
  isDesign: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  bareFlag: {
    type: Boolean,
    default: false
  }, isSearch: {
    type: Boolean,
    default: false
  },
  field: {
    type: Object,
    default: {}
  },
  parentField: {
    type: Object,
    default: {}
  },
  formInfo: {
    type: Object,
    default: {}
  }
});
const emits = defineEmits(['selfFunc', 'selectItem']);
const formData = defineModel("formData");
let previewDialog = shallowRef<boolean>(false);
let signature = ref<SmoothSignature>(null);
let canvas = ref();
const options = {
  width: Math.min(window.innerWidth, 1000),
  height: 600,
  minWidth: 4,
  maxWidth: 12,
  // color: '#1890ff',
  bgColor: '#f6f6f6'
};
const init = async () => {
  await nextTick(() => {
    let singatureCanvas = document.getElementById('singatureCanvas');
    if (!signature.value && canvas.value && singatureCanvas) {
      signature.value = new SmoothSignature(singatureCanvas, options);
    }
  });
};
const clear = (evt: MouseEvent) => {
  evt && evt.defaultPrevented;
  signature.value && signature.value.clear();
};
const undo = (evt: MouseEvent) => {
  evt && evt.defaultPrevented;
  signature.value && signature.value.undo();
};

const handleColor = (evt: MouseEvent) => {
  evt && evt.defaultPrevented;
  signature.value.color = '#' + Math.random().toString(16).slice(-6);
};
const handlePreview = (evt: MouseEvent) => {
  evt && evt.defaultPrevented;
  const isEmpty = signature.value.isEmpty();
  if (isEmpty) {
    warning('请先签名');
    return;
  }
  previewDialog.value = true;
  // const pngUrl = signature.value.getPNG();
  // imagesPreview(pngUrl);
  // window.previewImage(pngUrl);
};
onMounted(() => {
  init();
});
onUpdated(() => {
  init();
});
</script>
<template>
  <star-horse-dialog
      :dialog-visible="previewDialog"
      :is-view="true"
      :self-func="true"
      @closeAction="previewDialog = false"
  >
    <el-image :src="signature.getPNG()"/>
  </star-horse-dialog>
  <starhorse-form-item
      :isDesign="isDesign"
      :disabled="disabled"
      :bareFlag="bareFlag"
      :formItem="field"
      :parentField="parentField"
  >
    <div class="pcDemo">
      <div class="inner_button">
        <el-menu mode="horizontal" style="height: inherit; width: 100%">
          <el-menu-item @click="clear">
            <el-tooltip content="清除">
              <star-horse-icon icon-class="reset"/>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item @click="undo">
            <el-tooltip content="后退">
              <star-horse-icon icon-class="undo"/>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item @click="handleColor">
            <el-tooltip content="修改颜色">
              <star-horse-icon icon-class="color"/>
            </el-tooltip>
          </el-menu-item>
          <el-menu-item @click="handlePreview">
            <el-tooltip content="预览">
              <star-horse-icon icon-class="preview"/>
            </el-tooltip>
          </el-menu-item>
        </el-menu>
      </div>
      <canvas ref="canvas" id="singatureCanvas"/>
    </div>
  </starhorse-form-item>
</template>
<style lang="scss" scoped>
.pcDemo {
  button {
    margin-right: 10px;
    font-size: 18px;
  }

  canvas {
    border: 2px dashed #ccc;
    cursor: crosshair;
  }

  .actions {
    margin: 30px 0;
  }

  .tip {
    color: #108eff;
  }
}

.mbDemo {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  button {
    font-size: 18px;
  }

  canvas {
    border-radius: 10px;
    border: 2px dashed #ccc;
  }

  .wrap1 {
    margin-top: 100px;

    .actions {
      margin-bottom: 20px;
    }
  }

  .wrap2 {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 15px;
    display: flex;
    justify-content: center;

    .actionsWrap {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .canvas {
      flex: 1;
    }

    .actions {
      margin-right: 10px;
      white-space: nowrap;
      transform: rotate(90deg);
    }
  }
}
</style>
