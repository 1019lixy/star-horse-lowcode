<script setup lang="ts" name="MainBar">
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {StarHorseIcon} from "@/components/comp";

interface MenuItem {
  component: any;
  name: string;
  menuIcon?: string;
  path?: string;
  meta?: Record<string, any>;
  children?: MenuItem[];
}

const props = defineProps<{
  categories: MenuItem[];
  iconType?: "user" | "ele";

  position?: "top" | "bottom" | "left" | "right";
}>();

const emits = defineEmits<{
  (e: "select", isSubMenu: boolean, item: any): void;
}>();

const router = window.__hostRouter__ || useRouter();
const route = useRoute();

const expandedItem = ref<string | null>(null);
const computedCategories = computed(() => {
  if (props.categories?.length > 4) {
    return props.categories.slice(0, 4);
  }
  return props.categories;
});

const handleSelect = (item: MenuItem) => {
  if (item.path && item.path != "#") {
    router.push(item.path);
    emits("select", false, null);
  } else {
    emits("select", true, item.children);
  }
};

const getPositionClass = () => {
  switch (props.position) {
    case "top":
      return "position-top";
    case "left":
      return "position-left";
    case "right":
      return "position-right";
    case "bottom":
    default:
      return "position-bottom";
  }
};

const getPositionStyle = () => {
  switch (props.position) {
    case "top":
      return {top: 0, bottom: "auto"};
    case "bottom":
      return {bottom: "env(safe-area-inset-bottom)", top: "auto"};
    case "left":
      return {left: 0, right: "auto"};
    case "right":
      return {right: 0, left: "auto"};
  }
};




const isActive = (item: MenuItem) => {
  return route?.path === item.path;
};

const hasChildren = (item: MenuItem) => {
  return item.children && item.children.length > 0;
};

const isExpanded = (item: MenuItem) => {
  return expandedItem.value === item.meta?.menuId;
};
onMounted(() => {

});
</script>

<template>
  <div class="main-bar" :class="getPositionClass()" :style="getPositionStyle()">
    <template v-for="item in computedCategories" :key="item.meta?.menuId">
      <div
          class="category-item"
          :class="{ active: isActive(item) }"
          @click="handleSelect(item)"
      >
        <div class="category-content relative flex items-center justify-center">
          <div class="flex flex-col items-center justify-center">
            <template v-if="item.meta?.menuIcon">
              <el-icon class="star-icon" v-if="iconType=='ele'">
                <component :is="item.meta?.menuIcon || 'document'"/>
              </el-icon>
              <star-horse-icon
                  v-else
                  :icon-class="item.meta?.menuIcon|| 'document'"
                  class="category-icon"
              />
            </template>
            <span class="category-name">{{ item.meta?.title }}</span>
          </div>
          <star-horse-icon
              v-if="hasChildren(item)"
              icon-class="arrow-down"
              size="14"
              class="arrow-icon"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.main-bar {
  background-color: #fff;
  border: 1px solid #e6e6e6;
  position: fixed;
  width: 100%;
  display: flex;

  .category-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;
    position: relative;
    justify-content: center;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;

    .submenu {
      width: 100%;
      position: absolute;
      border: 1px solid #e6e6e6;
    }

    &:hover {
      background-color: #e6e6e6;
    }
  }
}
</style>
