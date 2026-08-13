<template>
  <div class="skeleton-container">
    <!-- 搜索框骨架屏 -->
    <div
      v-if="showSearch"
      class="search-skeleton bg-gray-100 rounded-lg animate-pulse h-16 mb-4"
    ></div>

    <el-card class="inner_content skeleton-card">
      <!-- 卡片头部骨架屏 -->
      <div
        v-if="showHeader"
        class="card-header-skeleton bg-gray-100 rounded h-8 mb-4 animate-pulse"
      ></div>

      <!-- 标签页骨架屏 -->
      <div v-if="showTabs" class="tabs-skeleton">
        <div class="tab-header flex gap-2 mb-4">
          <div
            class="tab-item bg-gray-100 rounded animate-pulse h-8 w-20"
          ></div>
          <div
            class="tab-item bg-gray-100 rounded animate-pulse h-8 w-24"
          ></div>
        </div>
      </div>

      <!-- 表单骨架屏 -->
      <div v-if="showForm" class="form-skeleton">
        <div v-for="i in formRowCount" :key="i" class="form-row flex mb-4">
          <div
            class="form-label w-1/4 bg-gray-100 rounded animate-pulse h-8"
          ></div>
          <div
            class="form-control w-3/4 ml-2 bg-gray-100 rounded animate-pulse h-8"
          ></div>
        </div>
      </div>

      <!-- 表格骨架屏 -->
      <div v-if="showTable" class="table-skeleton">
        <!-- 表头骨架 -->
        <div class="table-header-skeleton flex mb-3">
          <div class="w-12 bg-gray-100 rounded animate-pulse h-6"></div>
          <div class="flex-1 bg-gray-100 rounded animate-pulse h-6 ml-2"></div>
        </div>

        <!-- 表格内容骨架 -->
        <div
          v-for="i in tableRowCount"
          :key="i"
          class="table-row-skeleton flex mb-3"
        >
          <div class="w-12 bg-gray-100 rounded animate-pulse h-10"></div>
          <div class="flex-1">
            <div class="flex flex-wrap gap-2">
              <div class="w-1/4 bg-gray-100 rounded animate-pulse h-8"></div>
              <div class="w-1/4 bg-gray-100 rounded animate-pulse h-8"></div>
              <div class="w-1/4 bg-gray-100 rounded animate-pulse h-8"></div>
              <div class="w-1/4 bg-gray-100 rounded animate-pulse h-8"></div>
            </div>
          </div>
        </div>

        <!-- 分页骨架 -->
        <div class="pagination-skeleton flex justify-between items-center mt-4">
          <div class="w-32 bg-gray-100 rounded animate-pulse h-8"></div>
          <div class="flex gap-2">
            <div class="w-8 bg-gray-100 rounded animate-pulse h-8"></div>
            <div class="w-8 bg-gray-100 rounded animate-pulse h-8"></div>
            <div class="w-8 bg-gray-100 rounded animate-pulse h-8"></div>
            <div class="w-8 bg-gray-100 rounded animate-pulse h-8"></div>
          </div>
        </div>
      </div>

      <!-- 预览数据骨架屏 -->
      <div v-if="showPreview" class="preview-skeleton">
        <div v-for="i in previewRowCount" :key="i" class="preview-row mb-4">
          <div
            class="preview-label bg-gray-100 rounded animate-pulse h-6 w-1/5 mb-2"
          ></div>
          <div
            class="preview-value bg-gray-100 rounded animate-pulse h-8 w-full"
          ></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

// 定义props，控制骨架屏各部分的显示
const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showTabs: {
    type: Boolean,
    default: false,
  },
  showForm: {
    type: Boolean,
    default: false,
  },
  showTable: {
    type: Boolean,
    default: false,
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
  formRowCount: {
    type: Number,
    default: 6,
  },
  tableRowCount: {
    type: Number,
    default: 5,
  },
  previewRowCount: {
    type: Number,
    default: 8,
  },
});
</script>

<style lang="scss" scoped>
/* 骨架屏基础样式 */
.skeleton-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.skeleton-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 骨架屏动画 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 各部分骨架屏样式 */
.search-skeleton {
  width: 100%;
}

.card-header-skeleton {
  width: 30%;
}

.tabs-skeleton {
  width: 100%;
}

.form-skeleton {
  width: 100%;
}

.table-skeleton {
  width: 100%;
}

.preview-skeleton {
  width: 100%;
}
</style>
