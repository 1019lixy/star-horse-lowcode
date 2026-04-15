<template>
  <main-container :categories="categories" :position="'bottom'" iconType="ele" system-config-name="系统配置"/>
</template>

<script lang="ts" setup>
import MainContainer from "@/components/comp/app/MainContainer.vue";

const categories = [
  {id: "dashboard", meta:{
      title: "首页",
      menuIcon: "document",
    },  path: "/complex-form-valid"},
  {
    id: "production",meta:{
      title: "表单验证",
      menuIcon: "document",
    },  path: "/complex-form-analysis",
    children: [
      {
        id: "work-order",
        name: "工单管理",
        path: "/work-order",
        menuIcon: "document",
        children: [
          {
            id: "work-order-list",
            name: "工单列表",
            menuIcon: "document",
            path: "/work-order/list"
          }
        ]
      }
    ]
  },
  {
    id: "quality",meta:{
      title: "动态表格",
      menuIcon: "document",
    },   path: "/dytable-container-instance-valid",
   /* children: [{id: "equipment", name: "复杂表单", menuIcon: "document", path: "/complex-form-analysis"},
      {id: "material", name: "容器视图", menuIcon: "document", path: "/dytable-container-view-valid"},]*/
  },
  {id: "config", meta:{
      title: "配置配置",
      menuIcon: "config",
    },  path: "/dytable-container-view-valid"},
];

</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
