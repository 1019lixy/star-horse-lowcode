<script setup lang="ts" name="SampleLayout">
import { computed, ref } from "vue";
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import { isMobile } from "@/api/device";

const route = useRoute();
const router = useRouter();
const collapse = ref(isMobile);
const activeMenu = computed(() => route.path);
// 面包屑:从 matched 中提取标题
const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r) => ({ title: r.meta.title as string, path: r.path })),
);
// 菜单数据源:取根路由 "/" 下的 children(即各分组),过滤掉无标题和动态参数路由
const menuGroups = computed<RouteRecordRaw[]>(() => {
  const root = router.options.routes.find((r) => r.path === "/");
  return (root?.children || []).filter(
    (c) => c.meta?.title && !c.path.includes(":"),
  );
});
const toggleCollapse = () => {
  collapse.value = !collapse.value;
};
const handleSelect = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="sample-layout">
    <aside class="layout-sider" :class="{ collapsed: collapse }">
      <div class="logo">
        <span v-if="!collapse">Sample Demo</span>
        <span v-else>S</span>
      </div>
      <el-scrollbar class="menu-scroll">
        <el-menu
          :default-active="activeMenu"
          :collapse="collapse"
          :collapse-transition="false"
          background-color="#001529"
          text-color="#a6adb4"
          active-text-color="#fff"
          @select="handleSelect"
        >
          <template v-for="g in menuGroups" :key="g.path">
            <el-sub-menu
              v-if="g.children?.length"
              :index="g.path"
            >
              <template #title>
                <el-icon><component :is="g.meta.icon || 'menu'" /></el-icon>
                <span>{{ g.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="c in g.children.filter((c: any) => c.meta?.title)"
                :key="c.path"
                :index="c.path"
              >
                {{ c.meta?.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="g.path">
              <el-icon><component :is="g.meta.icon || 'menu'" /></el-icon>
              <template #title>{{ g.meta.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </aside>
    <section class="layout-main">
      <header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <fold v-if="!collapse" />
            <expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(b, i) in breadcrumbs"
              :key="i"
              :to="i < breadcrumbs.length - 1 ? b.path : undefined"
            >
              {{ b.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </header>
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.sample-layout {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.layout-sider {
  width: 220px;
  background: #001529;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  &.collapsed {
    width: 64px;
  }
}
.logo {
  height: 48px;
  line-height: 48px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #1f2d3d;
  overflow: hidden;
  white-space: nowrap;
}
.menu-scroll {
  flex: 1;
  overflow: hidden;
}
:deep(.el-menu) {
  border-right: none;
}
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
.layout-header {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.collapse-btn {
  font-size: 18px;
  cursor: pointer;
}
.layout-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background: #f5f7fa;
}
</style>
