<script setup lang="ts">
import {computed, inject, PropType} from 'vue';
import {compKey} from "@/api/system";

const props = defineProps({
  item: {type: Object as PropType<any>, required: true},
  level: {type: Number, default: 1}
});
const loadMenuFun = inject('loadMenu') as Function;
let menuColor = computed(() => (props.level > 1 ? 'var(--star-horse-shadow)' : 'var(--star-horse-background)'));
</script>
<template>
  <el-sub-menu
      popper-class="popper-class"
      v-if="item.children?.length > 0"
      :index="item.idInformations"
      @click="loadMenuFun(item.idInformations)"
  >
    <template #title>
      <el-icon class="star-icon">
        <component :is="item.sysLogo || 'document'"/>
      </el-icon>
      <span>{{ item.sysName }} </span>
    </template>
    <template v-for="(sitem,key) in item.children" :key="compKey(sitem,key)">
      <SystemSubMenu :item="sitem" :level="level + 1"/>
    </template>
  </el-sub-menu>
  <el-menu-item
      popper-class="popper-class"
      v-else
      :index="item.idInformations"
      @click="loadMenuFun(item.idInformations)"
  >
    <el-icon class="star-icon">
      <component :is="item.sysLogo || 'document'"/>
    </el-icon>
    <template #title>
      <span>{{ item.sysName }} </span>
    </template>
  </el-menu-item>
</template>
<style lang="scss" scoped>
.star-icon {
  font-size: 22px;
}

.popper-class {
  background: var(--star-horse-white) !important;
}

.el-sub-menu {
  background: v-bind(menuColor);
  margin-top: 1px;
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

.popers {
  overflow: auto;
  height: 100% !important;
  z-index: 999999;
}
</style>
