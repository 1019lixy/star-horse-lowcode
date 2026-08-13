<script setup lang="ts">
/**
 * ShSvgIcon - 统一 SVG 图标组件
 *
 * 替代三种现有图标方案（Element Plus 组件图标、v-html 内联 SVG、字体图标），
 * 统一使用语义化 name 从注册表查找 SVG 内容渲染。
 *
 * - 支持 currentColor 继承，兼容暗色主题
 * - 不使用 v-html（更安全），直接渲染 <svg> 内部内容
 * - size 默认 "1em"，跟随父元素字体大小
 */
import { computed } from "vue";
import { getSvgIcon } from "./svgIconRegistry";

const props = withDefaults(
  defineProps<{
    /** 图标语义化名称（如 "undo"、"database"、"align-left"） */
    name: string;
    /** 图标大小，默认 1em（跟随字体大小） */
    size?: string;
    /** 额外 CSS class */
    class?: string;
  }>(),
  {
    size: "1em",
  },
);

const iconDef = computed(() => getSvgIcon(props.name));
const viewBox = computed(() => iconDef.value.viewBox ?? "0 0 24 24");
</script>

<template>
  <svg
    :class="['sh-svg-icon', $props.class]"
    :viewBox="viewBox"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    v-html="iconDef.content"
  />
</template>

<style scoped>
.sh-svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
