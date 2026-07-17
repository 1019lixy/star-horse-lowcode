<script setup lang="ts">
import { nextTick, onMounted, onUpdated, ref, shallowRef } from "vue";
import SmoothSignature from "smooth-signature";
import { warning } from "@/utils/message";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import StarHorseDialog from "@/components/comp/StarHorseDialog.vue";

import { ItemPreps } from "@/components/types/ItemPreps";
import StarhorseFormItem from "@/components/formcomp/items/starhorse-form-item.vue";
import { i18n } from "@/lang";

const props = withDefaults(defineProps<ItemPreps>(), {
  isDesign: false,
  disabled: false,
  showFormItem: false,
  bareFlag: false,
  isSearch: false,
});
const emits = defineEmits(["selfFunc", "selectItem"]);
const formData = defineModel("formData");
let previewDialog = shallowRef<boolean>(false);
let signature = ref<SmoothSignature>(null);
// 明确声明 ref 类型为 HTMLCanvasElement 或 null
const signatureCanvas = ref<any>(null);
let options = {
  width: Math.min(window.innerWidth, 350),
  height: 100,
  minWidth: 2,
  maxWidth: 6,
  bgColor: "#f6f6f6",
  onEnd: (val) => {
    formData.value[props.field.fieldName] =
      props.field.preps?.imageType == "jpg"
        ? signature.value?.getJPG()
        : signature.value?.getPNG();
  },
};
const init = async () => {
  options = { ...options, ...props.field?.preps };
  await nextTick(() => {
    if (!signature.value && signatureCanvas.value) {
      signature.value = new SmoothSignature(signatureCanvas.value, options);
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
const handlePreview = (evt: MouseEvent) => {
  evt && evt.defaultPrevented;
  const isEmpty = signature.value.isEmpty();
  if (isEmpty) {
    warning(i18n("item.pleaseSignFirst"));
    return;
  }
  previewDialog.value = true;
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
    v-model="previewDialog"
    :source="3"
    :self-func="true"
    @closeAction="previewDialog = false"
  >
    <el-image :src="signature?.getPNG()" />
  </star-horse-dialog>

  <starhorse-form-item
    :showFormItem="showFormItem"
    :isDesign="isDesign"
    :disabled="disabled"
    :bareFlag="bareFlag"
    :field="field"
    :parentField="parentField"
  >
    <div class="pcDemo">
      <div class="inner_button" v-if="source != 3">
        <el-menu mode="horizontal" style="height: inherit; width: 100%">
          <el-menu-item @click="clear">
            <el-tooltip :content="i18n('item.clear')">
              <star-horse-icon icon-class="reset" />
            </el-tooltip>
          </el-menu-item>
          <el-menu-item @click="undo">
            <el-tooltip :content="i18n('item.undo')">
              <star-horse-icon icon-class="undo" />
            </el-tooltip>
          </el-menu-item>
          <el-menu-item @click="handlePreview">
            <el-tooltip :content="i18n('item.preview')">
              <star-horse-icon icon-class="preview" />
            </el-tooltip>
          </el-menu-item>
        </el-menu>
      </div>
      <canvas ref="signatureCanvas" />
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
</style>
