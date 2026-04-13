<script setup lang="ts" name="MainBar">
import {computed, ref} from "vue";
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
import {useRoute, useRouter} from "vue-router";
import MainBar from "./MainBar.vue";

interface MenuItem {
  id: string;
  name: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

const props = defineProps<{
  categories: MenuItem[];
  systemConfigName?: string;
  position?: "top" | "bottom" | "left" | "right";
}>();

const emits = defineEmits<{
  (e: "select", item: MenuItem): void;
}>();

const router = useRouter();
const route = useRoute();

const expandedItem = ref<string | null>(null);
const computedCategories = computed(() => {
  if (props.categories?.length > 4) {
    return props.categories.slice(0, 4);
  }
  return props.categories;
});

const handleSelect = (item: MenuItem) => {
  if (hasChildren(item)) {
    expandedItem.value = expandedItem.value === item.id ? null : item.id;
  } else {
    emits("select", item);
    if (item.route) {
      router.push(item.route);
    }
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
      return {bottom: 0, top: "auto"};
    case "left":
      return {left: 0, right: "auto"};
    case "right":
      return {right: 0, left: "auto"};
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

  return route.path === item.route || route.name === item.id;
};

const hasChildren = (item: MenuItem) => {
  return item.children && item.children.length > 0;
};

const isExpanded = (item: MenuItem) => {
  return expandedItem.value === item.id;
};
</script>

<template>
  <div class="main-bar" :class="getPositionClass()" :style="getPositionStyle()">
    <template v-for="item in computedCategories" :key="item.id">
      <div
          class="category-item"
          :class="{active: isActive(item)}"
          @click="handleSelect(item)"
      >
        <div class="category-content">
          <div class="flex flex-col items-center justify-center">
            <star-horse-icon
                v-if="item.icon"
                :icon-class="item.icon"
                class="category-icon"
            />
            <span class="category-name">{{ item.name }}</span>
          </div>
          <star-horse-icon
              v-if="hasChildren(item)"
              icon-class="right"
              class="arrow-icon"
          />
        </div>
        <div
            v-if="hasChildren(item)"
            class="submenu"
            :class="getPositionClass() + '-submenu'"
            :style="{display: isExpanded(item) ? 'block' : 'none'}"
        >
          <MainBar
              :categories="item.children || []"
              :position="getSubmenuPosition()"
              class="submenu-bar"
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
  z-index: 999999;
  &.position-top,
  &.position-bottom {
    display: flex;
    flex-direction: row;
    height: 60px;
    width: 100%;
    padding: 0;
  }

  &.position-top {
    border-bottom: 1px solid #e6e6e6;
  }

  &.position-bottom {
    border-top: 1px solid #e6e6e6;
  }

  &.position-left,
  &.position-right {
    display: flex;
    flex-direction: column;
    width: 60px;
    height: 100%;

    .category-item {
      flex: 1;
      flex-direction: column;
    }

    .category-content {
      flex-direction: column;
      margin-top: 8px;

      .category-icon {
        margin-bottom: 0;
        margin-right: 0;
        flex-shrink: 0;
      }

      .category-name {
        margin-top: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        flex: 1;
        min-width: 0;
      }
    }
  }

  &.position-left {
    border-right: 1px solid #e6e6e6;
  }

  &.position-right {
    border-left: 1px solid #e6e6e6;
  }

  .category-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
    flex: 1;
    overflow: hidden;

    &.position-left,
    &.position-right {
      flex-direction: column;
      flex: 1;
    }

    &:hover {
      background-color: #f5f7fa;
    }

    .category-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      overflow: hidden;

      .position-left &,
      .position-right & {
        flex-direction: column;
        margin-top: 8px;

        .category-icon {
          margin-bottom: 0;
          margin-right: 0;
          flex-shrink: 0;
        }

        .category-name {
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          flex: 1;
          min-width: 0;
        }
      }

      .position-top &,
      .position-bottom & {
        flex-direction: column;
        margin-top: 0;

        .category-icon {
          margin-bottom: 4px;
          margin-right: 0;
        }

        .category-name {
          margin-top: 0;
        }
      }

      .category-icon {
        font-size: 20px;
        color: #606266;
        flex-shrink: 0;
      }

      .category-name {
        font-size: 12px;
        color: #606266;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        flex: 1;
        min-width: 0;
      }

      .arrow-icon {
        font-size: 12px;
        color: #999;
        margin-left: 4px;
        flex-shrink: 0;
      }
    }

    &.active {
      background-color: var(--star-horse-style);
      border-color: var(--star-horse-style);

      .category-content {
        .category-icon {
          color: #fff;
        }

        .category-name {
          color: #fff;
        }

        .arrow-icon {
          color: #fff;
        }
      }
    }

    .submenu {
      position: absolute;
      z-index: 1001;

      &.position-top-submenu,
      &.position-bottom-submenu {
        top: 100%;
        left: 0;
        min-width: 150px;
      }

      &.position-bottom-submenu {
        top: auto;
        bottom: 100%;
      }

      &.position-left-submenu,
      &.position-right-submenu {
        left: 100%;
        top: 0;
        min-height: 100%;
      }

      &.position-right-submenu {
        left: auto;
        right: 100%;
      }

      .submenu-bar {
        position: relative;
      }
    }
  }
}
</style>
