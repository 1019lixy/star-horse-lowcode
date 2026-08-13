<template>
  <div class="signature-app">
    <h2>电子签名板</h2>

    <div class="controls">
      <div class="control-group">
        <label>画笔颜色：</label>
        <input type="color" v-model="options.penColor" />
      </div>

      <div class="control-group">
        <label>背景颜色：</label>
        <input type="color" v-model="options.backgroundColor" />
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="isDisabled" />
          只读模式
        </label>
      </div>
    </div>

    <Vue3Signature
      ref="signature"
      :sigOption="options"
      :disabled="isDisabled"
      :w="'100%'"
      :h="'400px'"
      class="signature-pad"
    />

    <div class="button-group">
      <button @click="save('image/png')" class="btn btn-primary">
        💾 保存 PNG
      </button>
      <button @click="save('image/jpeg')" class="btn btn-primary">
        💾 保存 JPEG
      </button>
      <button @click="clear" class="btn btn-danger">🗑️ 清空</button>
      <button @click="undo" class="btn btn-secondary">↩️ 撤销</button>
      <button @click="addWatermark" class="btn btn-secondary">
        🔖 添加水印
      </button>
    </div>

    <div v-if="preview" class="preview">
      <h3>预览：</h3>
      <img :src="preview" alt="签名预览" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Vue3Signature from "vue3-signature";
import { warning } from "@/utils/message.js";

const signature = ref(null);
const preview = ref("");
const isDisabled = ref(false);
const value = ref("");

const endOperation = () => {
  preview.value = signature.value.save("image/png");
};
const options = ref({
  penColor: "rgb(0, 0, 0)",
  backgroundColor: "rgb(255, 255, 255)",
  onEndStroke: endOperation,
});
const save = (format) => {
  if (signature.value.isEmpty()) {
    warning("请先提供签名。");
    return;
  }

  const dataUrl = signature.value.save(format);
  preview.value = dataUrl;

  // 下载图片
  const link = document.createElement("a");
  const extension = format === "image/jpeg" ? "jpg" : "png";
  link.download = `signature.${extension}`;
  link.href = dataUrl;
  link.click();
};

const clear = () => {
  signature.value.clear();
  preview.value = "";
};

const undo = () => {
  signature.value.undo();
};

const addWatermark = () => {
  signature.value.addWaterMark({
    text: new Date().toLocaleDateString(),
    font: "16px Arial",
    fillStyle: "rgba(0, 0, 0, 0.3)",
    x: 10,
    y: 30,
  });
};
watch(
  () => signature.value?.save(),
  (val) => {
    console.log(val);
  },
);
</script>

<style scoped>
.signature-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signature-pad {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #da190b;
}

.btn-secondary {
  background-color: #2196f3;
  color: white;
}

.btn-secondary:hover {
  background-color: #0b7dda;
}

.preview {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.preview img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
