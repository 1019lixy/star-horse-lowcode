<script setup lang="ts" name="MainContainer">
import MainBar from "@/components/comp/app/MainBar.vue";
import MainContent from "@/components/comp/app/MainContent.vue";
import { ref } from "vue";
import MainSubBar from "@/components/comp/app/MainSubBar.vue";
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
  preps?: Record<string, any>;
}>();
const subMenuFlag = ref<boolean>(false);
const menuList = ref<any>([]);
const router = window.__hostRouter__ || useRouter();
const route = useRoute();
const handleSelect = (item: any) => {
  console.log("Selected:", item);
};
const barHandleSelect = (isSubMenu: boolean, item?: any) => {
  subMenuFlag.value = isSubMenu;
  menuList.value = item;
};
const selectMenu = (item: any) => {
  subMenuFlag.value = false;
  router.push(item.path);
};
const handleSystemConfig = () => {
  console.log("System config clicked");
};
const getStyle = () => {
  const style: any = {};
  if (props.position == "bottom" || props.position == "top") {
    const key = `margin-${props.position}`;
    style[key] = "60px";
  }
  if (props.position == "bottom") {
    style["bottom"] = 0;
  }
  return style;
};
</script>

<template>
  <div class="main-container">
    <MainBar
      :categories="categories"
      :system-config-name="systemConfigName"
      :position="position"
      :preps="preps"
      @select="barHandleSelect"
      @system-config="handleSystemConfig"
    />
    <MainContent
      :categories="categories"
      v-if="!subMenuFlag"
      :system-config-name="systemConfigName"
      :position="position"
      @select="handleSelect"
      @system-config="handleSystemConfig"
    />
    <div
      v-else
      :style="getStyle()"
      class="w-[99%] justify-center mx-auto overflow-hidden relative"
    >
      <el-scrollbar>
        <MainSubBar
          v-model:dataList="menuList"
          :level="2"
          @selectMenu="selectMenu"
        />
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .main-bar {
    &.position-top {
      height: 60px;
      width: 100%;
    }

    &.position-bottom {
      height: 60px;
      width: 100%;
    }

    &.position-left {
      width: 60px;
      height: 100%;
    }

    &.position-right {
      width: 60px;
      height: 100%;
    }
  }

  .main-content {
    flex: 1;
    overflow: auto;
    background-color: #f5f7fa;
    padding: 20px;
  }

  &.position-top .main-content {
    padding-top: 80px;
  }

  &.position-bottom .main-content {
    padding-bottom: 80px;
  }
}
</style>
