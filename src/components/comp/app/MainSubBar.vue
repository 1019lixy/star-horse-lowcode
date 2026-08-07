<script setup lang="ts">
import {computed, ModelRef} from "vue";
import {i18n} from "@/lang";

const props = defineProps({
  level: {type: Number, default: 1, required: true},
  menuType: {type: String, default: "url"},
});
const emits = defineEmits(["selectMenu"]);
const dataList: ModelRef<any> = defineModel("dataList");
let menuColor = computed(() =>
    props.level > 1 ? "var(--star-horse-shadow)" : "var(--star-horse-background)",
);
const selectMenu = (menu: any) => {
  emits("selectMenu", menu);
};
</script>
<template>
  <template v-for="(item, index) in dataList" :key="item.meta?.menuId">
    <template v-if="item.children?.length > 0">
      <div class="menu-item-wrapper">
        <div class="menu-item-content">
          <div class="flex flex-row items-center gap-3">
            <el-icon class="star-icon">
              <component :is="item.meta?.menuIcon || 'document'"/>
            </el-icon>
            <span @click="selectMenu(item)"
            >{{ item.meta?.title || i18n("item.unknown") }}
            </span>
          </div>
        </div>
        <div class="menu-children">
          <MainSubBar
              v-model:dataList="item.children"
              :level="level + 1"
              @selectMenu="selectMenu"
              :menuType="menuType"
          />
        </div>
      </div>
    </template>
    <div v-else class="menu-item leaf-menu-item">
      <div class="flex flex-row items-center h-[35px] gap-1 cursor-pointer">
        <el-icon class="star-icon">
          <component :is="item.meta?.menuIcon || 'document'"/>
        </el-icon>
        <span @click="selectMenu(item)"
        >{{ item.meta?.title || i18n("item.unknown") }}
        </span>
      </div>
    </div>
  </template>
</template>
<style lang="scss" scoped>
.star-icon {
  font-size: 22px;
}

.popper-class {
  background: var(--star-horse-style);
}

.menu-item-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .menu-item-content {
    position: relative;
    padding-left: 16px;
    z-index: 2;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 16px;
      height: 1px;
      background-color: #e6e6e6;
    }

    &::after {
      content: "";
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 100%;
      background-color: #e6e6e6;
    }
  }

  .menu-children {
    position: relative;
    padding-left: 24px;
    top: 0;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #e6e6e6;
    }
  }
}

.menu-item {
  position: relative;
  padding-left: 16px;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 16px;
    height: 1px;
    background-color: #e6e6e6;
  }
}

.leaf-menu-item {
  position: relative;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 50%;
    width: 8px;
    height: 1px;
    background-color: #e6e6e6;
  }
}
</style>
