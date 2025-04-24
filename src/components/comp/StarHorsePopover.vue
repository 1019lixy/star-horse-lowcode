<script lang="ts" setup name="StarHorsePopover">
import {onMounted, ref} from 'vue';
import icon from '@/assets/icon';

defineProps({
  menuIcon: {type: String}
});
let iconList = ref<Array<any>>(icon);
const menuIconSelect = (corn: any) => {
  console.log(corn);
};
onMounted(() => {

});
</script>
<template>
  <el-popover placement="bottom" :popper-style="{ width: 'unset !important' }" trigger="click">
    <template #reference>
      <slot></slot>
    </template>
    <ul class="system-icon">
      <li
          v-for="sdata in iconList"
          @click="menuIconSelect(sdata.menuIcon)"
          :class="menuIcon == sdata.menuIcon ? 'icon-active' : ''"
      >
        <el-tooltip :content="sdata.label">
          <star-horse-icon
              :icon-class="sdata.menuIcon"
              style="color: var(--star-horse-style); vertical-align: middle; font-size: 48px"
          />
        </el-tooltip>
      </li>
    </ul>
  </el-popover>
</template>
<style scoped></style>
