<script setup lang="ts" name="StarHorsePanel">
import { computed } from "vue";
import StarHorseDialog from "./StarHorseDialog.vue";
import StarHorseDrawer from "./StarHorseDrawer.vue";
import { getGlobalConfigStore } from "@/store/StoreManager";
import {
  panelModalProps,
  type StarHorseModalMode,
} from "./starHorseModal";

defineOptions({ name: "StarHorsePanel", inheritAttrs: false });

// 参数对齐：Panel 声明 StarHorseModal 全部参数（类型提示完整），另加 Panel 专属 type 做动态选型
const props = defineProps({
  /**
   * 弹层类型：dialog(对话框) | drawer(抽屉)
   * 父组件可通过条件动态切换：:type="isWide ? 'dialog' : 'drawer'"
   */
  type: { type: String as () => StarHorseModalMode },
  ...panelModalProps,
});

const configInfo = computed(() => getGlobalConfigStore().configFormInfo);
const currentComponent = computed(() => {
  let dialogType: string = props.type;
  if (configInfo.value?.dialogType) {
    dialogType = configInfo.value.dialogType;
  }
  return dialogType === "drawer" ? StarHorseDrawer : StarHorseDialog;
});

// 透传给薄壳的 Modal 参数（排除 Panel 专属 type；mode 已在定义层剔除）
const modalProps = computed(() => {
  const { type: _type, ...rest } = props;
  return rest;
});
</script>

<template>
  <component :is="currentComponent" v-bind="{ ...modalProps, ...$attrs }">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </component>
</template>
