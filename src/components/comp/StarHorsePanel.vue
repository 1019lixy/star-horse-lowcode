<script setup lang="ts" name="StarHorsePanel">
import { computed } from "vue";
import StarHorseDialog from "./StarHorseDialog.vue";
import StarHorseDrawer from "./StarHorseDrawer.vue";
import { getGlobalConfigStore } from "@/store/StoreManager";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  /**
   * 弹层类型：dialog(对话框) | drawer(抽屉)
   * 父组件可通过条件动态切换：:type="isWide ? 'dialog' : 'drawer'"
   */
  type: { type: String as () => "dialog" | "drawer" },
});
const configInfo = computed(() => getGlobalConfigStore().configFormInfo);
const currentComponent = computed(() => {
  let dialogType: string = props.type;
  if (configInfo.value?.dialogType) {
    dialogType = configInfo.value.dialogType;
  }
  return dialogType === "drawer" ? StarHorseDrawer : StarHorseDialog;
});
</script>

<template>
  <component :is="currentComponent" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </component>
</template>
