<script setup lang="ts" name="StarHorseHmenu">
import { ModelRef, onMounted, PropType } from "vue";
import MenuItem from "@/components/menu/MenuItem.vue";
import { compKey } from "@/api/system";

defineProps({
  preps: {
    type: Object as PropType<any>,
    default: () => {
      return {
        id: "id",
        value: "value",
        icon: "icon",
        label: "name",
        children: "children",
      };
    },
  },
});
const emits = defineEmits(["selectItem"]);
let dataList: ModelRef<any> = defineModel("dataList");
const initData = async () => {};
const selectItem = (item: any) => {
  emits("selectItem", item);
};
onMounted(() => {
  initData();
});
</script>
<template>
  <el-menu class="system-menu" v-bind="$attrs">
    <MenuItem
      v-for="(sitem, key) in dataList"
      :key="compKey(sitem, key)"
      :item="sitem"
      @selectItem="selectItem"
      :preps="preps"
    />
  </el-menu>
</template>
<style lang="scss" scoped>
.el-menu--horizontal {
  .el-menu-item {
    height: inherit;
  }

  .el-menu-item.is-active,
  .el-menu-item:hover,
  .el-submenu__title:hover,
  .el-submenu__title.is-opened {
    background-color: unset !important;
  }
}

:deep(.el-submenu__title:hover),
:deep(.el-sub-menu:hover),
.el-tooltip__trigger:hover,
.el-submenu__title.is-opened {
  background-color: unset !important;
}

.sub-class:hover {
  background-color: unset !important;
}

.system-menu {
  --el-menu-bg-color: #fff;
  --el-menu-text-color: #eee;
  --el-menu-active-color: #ffd04b;
  --el-menu-hover-bg-color: rgb(245, 235, 255, 0.5);
  max-height: 50px;
  background-color: unset !important;
  width: 100% !important;
  border-bottom: unset !important;
  color: var(--star-horse-white);
  font-weight: bold;
  font-size: 16px;
  align-items: center;
}

:deep(.el-sub-menu) {
  box-sizing: border-box;
  background-color: unset !important;
}

.star-icon {
  font-size: 26px;
  color: var(--star-horse-white);
}

:deep(.el-icon) {
  svg {
    height: 1.5em;
    width: 1.5em;
    color: var(--star-horse-white) !important;
  }
}
</style>
