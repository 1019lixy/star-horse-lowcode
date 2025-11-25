<template>
  <div ref="svgContainer"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  path: { type: String, required: true },
  size: { type: String, default: "20px" },
  cursor: { type: String, default: "normal" },
  marginLeft: { type: String, default: "1px" },
  marginRight: { type: String, default: "1px" },
  color: { type: String, default: "var(--star-horse-style)" },
});
const svgContainer = ref(null);
const loadSvg = async () => {
  const path = props.path.endsWith(".svg") ? props.path : `${props.path}.svg`;
  let svgPath = path;
  // 修复路径：如果是public目录下的文件，需要正确构建URL
  if (!path.startsWith("http") && !path.startsWith("/")) {
    // 如果是相对路径，假设是public目录下的文件
    svgPath = `/${path}`;
  }
  const response = await fetch(svgPath);
  let svgText = await response.text();
  // console.log(svgText);
  // svgText = svgText.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  svgContainer.value.innerHTML = svgText;
};
onMounted(loadSvg);
watch(() => props.path, loadSvg);
</script>
<style scoped>
:deep(svg) {
  cursor: v-bind(cursor);
  width: v-bind(size) !important;
  height: v-bind(size) !important;
  color: v-bind(color);
  margin-left: v-bind(marginLeft);
  margin-right: v-bind(marginRight);
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: none;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
