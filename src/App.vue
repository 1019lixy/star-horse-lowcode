<template>
  <main-container :categories="categories" :position="'bottom'" system-config-name="系统配置"/>
</template>

<script lang="ts" setup>
import MainContainer from "@/components/comp/app/MainContainer.vue";

const categories = [
  {id: "dashboard", name: "首页", icon: "document", route: "/dashboard"},
  {
    id: "production", name: "表单验证", icon: "document", route: "/complex-form-analysis",
    children: [
      {
        id: "work-order",
        name: "工单管理",
        route: "/work-order",
        icon: "document",
        children: [
          {
            id: "work-order-list",
            name: "工单列表",
            icon: "document",
            route: "/work-order/list"
          }
        ]
      }
    ]
  },
  {
    id: "quality", name: "动态表格", icon: "document", route: "/dytable-container-instance-valid",
   /* children: [{id: "equipment", name: "复杂表单", icon: "document", route: "/complex-form-analysis"},
      {id: "material", name: "容器视图", icon: "document", route: "/dytable-container-view-valid"},]*/
  },
  {id: "config", name: "配置配置", icon: "config", route: "/config"},
];

</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
