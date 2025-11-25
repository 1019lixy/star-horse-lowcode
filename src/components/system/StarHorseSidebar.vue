<template>
  <div
    class="gantt-sidebar"
    :class="{ 'sidebar-expanded': isHovered }"
    @mouseleave="isHovered = false"
  >
    <div class="sidebar-icon">
      <star-horse-icon
        iconClass="menu"
        cursor="pointer"
        @mouseenter="isHovered = true"
      />
    </div>
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3>工具面板</h3>
      </div>
      <div class="sidebar-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "StarHorseSidebar",
});

const isHovered = ref(false);
</script>

<style scoped lang="scss">
.gantt-sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s linear;
}

.sidebar-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s linear;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}

.sidebar-content {
  background-color: white;
  height: 30%;
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  //border: 1px solid #ebeef5;
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.sidebar-expanded {
  .sidebar-content {
    width: 300px;
  }
}
</style>
