<script setup lang="ts" name="StarHorseDialog">
import StarHorseModalBase from "./StarHorseModalBase.vue";
import { starHorseModalProps } from "./starHorseModal";

/**
 * StarHorseDialog：居中弹窗容器（StarHorseModalBase 的 dialog 形态薄壳）。
 * 全部逻辑/模板/样式收敛在 StarHorseModalBase，此处仅固定容器形态并透传；
 * 对外 props / emits / slots / v-model 与重构前完全一致。
 * inheritAttrs:false 禁用自动继承，避免 $attrs 显式透传后 onXxx 被重复绑定导致事件触发两次。
 */
defineOptions({ name: "StarHorseDialog", inheritAttrs: false });
const props = defineProps(starHorseModalProps);
</script>

<template>
  <StarHorseModalBase v-bind="{ ...props, mode: 'dialog', ...$attrs }">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </StarHorseModalBase>
</template>
