<template>
  <div class="barcode-box">
    <!-- 唯一svg容器，只渲染1个条码 -->
    <barcode-item
      :field="{
        fieldName: 'testBarcode',
        preps: {},
      }"
      v-model:form-data="formData"
    />
    <svg ref="barCodeRef"></svg>

    <!-- 输入框动态修改条码内容 -->
    <input v-model="codeVal" placeholder="输入条码内容" />
    <!-- 下载按钮 -->
    <button @click="downloadBar">下载条码PNG</button>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import JsBarcode from "jsbarcode";
import BarcodeItem from "@/components/formcomp/items/barcode-item.vue";

// 条码值
const codeVal = ref("SN20260727001");
const barCodeRef = ref(null);
const formData = ref({
  testBarcode: "SN20260727005",
});
// 渲染条码通用方法
const drawBarcode = () => {
  JsBarcode(barCodeRef.value, codeVal.value, {
    format: "CODE128",
    width: 2,
    height: 80,
    displayValue: true,
    fontSize: 14,
    textMargin: 6,
    margin: 10,
    background: "#fff",
    lineColor: "#000",
  });
};

// 页面加载渲染
onMounted(() => {
  nextTick(drawBarcode);
});

// 输入内容变化自动刷新条码
watch(codeVal, () => {
  nextTick(drawBarcode);
});

// 下载条码图片
const downloadBar = () => {
  const svgEl = document.getElementById("barcode") as SVGSVGElement;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `条码_${codeVal.value}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
</script>

<style scoped>
.barcode-box {
  padding: 20px;
}

input {
  width: 320px;
  padding: 6px 10px;
  margin: 10px 0;
}

button {
  padding: 7px 16px;
  cursor: pointer;
}
</style>
