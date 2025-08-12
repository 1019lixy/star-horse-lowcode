<script setup lang="ts">
import { computed, ModelRef } from "vue";
import { compKey } from "@/api/system";

const props = defineProps({
  level: { type: Number, default: 1 },
});
const dataList: ModelRef<any> = defineModel("dataList");
let menuColor = computed(() =>
  props.level > 1 ? "var(--star-horse-shadow)" : "var(--star-horse-background)",
);
</script>
<template>
  <div
    v-if="level > 1"
    style="height: 2px; background: var(--star-horse-white)"
  ></div>
  <template v-for="(item, key) in dataList" :key="compKey(item, key)">
    <el-sub-menu v-if="item.children?.length > 0" :index="item.meta.menuId">
      <template #title>
        <el-icon class="star-icon">
          <component :is="item.meta.menuIcon || 'document'" />
        </el-icon>
        <span>{{ item.meta.title }} </span>
      </template>
      <SubMenu v-model:dataList="item.children" :level="level + 1"></SubMenu>
    </el-sub-menu>
    <el-menu-item popper-class="popper-class" v-else :index="item.meta.menuId">
      <el-icon class="star-icon">
        <component :is="item.meta.menuIcon || 'document'" />
      </el-icon>
      <template #title>
        <router-link :to="{ path: item.path }"
          >{{ item.meta.title }}
        </router-link>
      </template>
    </el-menu-item>
  </template>
</template>
<style lang="scss" scoped>
.star-icon {
  font-size: 22px;
}

.popper-class {
  background: var(--star-horse-style);
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
