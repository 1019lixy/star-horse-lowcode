<script setup lang="ts" name="MainBar">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
  systemConfigName?: string;
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
      return { top: 0, bottom: "auto" };
    case "bottom":
      return { bottom: 0, top: "auto" };
    case "left":
      return { left: 0, right: "auto" };
    case "right":
      return { right: 0, left: "auto" };
  }
};

const getSubmenuPosition = () => {
  switch (props.position) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
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
</script>

<template>
  <div class="main-bar" :class="getPositionClass()" :style="getPositionStyle()">
    <template v-for="item in computedCategories" :key="item.meta?.menuId">
      <div
        class="category-item"
        :class="{ active: isActive(item) }"
        @click="handleSelect(item)"
      >
        <div class="category-content relative">
          <div class="flex flex-col items-center justify-center">
            <star-horse-icon
              v-if="item.meta?.menuIcon"
              :icon-class="item.meta?.menuIcon"
              class="category-icon"
            />
            <span class="category-name">{{ item.meta?.title }}</span>
          </div>
          <star-horse-icon
            v-if="hasChildren(item)"
            icon-class="right"
            class="arrow-icon"
          />
        </div>
        <!--        <div v-if="hasChildren(item)">
                  <MainSubBar
                    :categories="item.children || []"
                    :position="getSubmenuPosition()"
                    class="submenu-bar"
                  />
                </div>-->
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
