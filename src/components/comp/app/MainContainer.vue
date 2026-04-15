<script setup lang="ts" name="MainContainer">
import MainBar from "@/components/comp/app/MainBar.vue";
import MainContent from "@/components/comp/app/MainContent.vue";

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

const handleSelect = (item: any) => {
  console.log("Selected:", item);
};

const handleSystemConfig = () => {
  console.log("System config clicked");
};
</script>

<template>
  <div class="main-container">
    <MainBar
        :categories="categories"
        :system-config-name="systemConfigName"
        :position="position"
        :preps="preps"
        @select="handleSelect"
        @system-config="handleSystemConfig"
    />
    <MainContent
        :categories="categories"
        :system-config-name="systemConfigName"
        :position="position"
        @select="handleSelect"
        @system-config="handleSystemConfig"
    />
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
