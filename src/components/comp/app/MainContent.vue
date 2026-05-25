<script setup lang="ts" name="MainContent">
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {i18n} from "@/lang";

interface MainBarItem {
  id: string;
  name: string;
  icon: string;
  route: string;
}

const props = defineProps<{
  categories: Array<{
    component: any;
    name: string;
    menuIcon?: string;
    path?: string;
    meta?: Record<string, any>;
  }>;
  systemConfigName?: string;
  position?: "top" | "bottom" | "left" | "right";
}>();

const emits = defineEmits<{
  (e: "select", item: MainBarItem): void;
  (e: "system-config"): void;
}>();

const router = useRouter();
const route = useRoute();

const computedCategories = computed(() => {
  const systemConfigItem = {
    id: "system-config",
    name: props.systemConfigName || i18n("item.systemConfig"),
    icon: "setting",
    route: "system-config",
  };
  return [...props.categories, systemConfigItem];
});

const handleSelect = (item: MainBarItem) => {
  emits("select", item);
  if (item.route) {
    router.push(item.route);
  }
};

const handleSystemConfig = () => {
  emits("system-config");
  router.push("system-config");
};

const isActive = (item: MainBarItem) => {
  if (item.id === "system-config") {
    return route.name === "system-config" || route.path.includes("system-config");
  }
  return route.path === item.route || route.name === item.id;
};

</script>

<template>
  <div class="flex flex-col w-full h-full overflow-hidden">
    <div v-if="position=='top'" style="height:60px;width:100%"></div>
    <div class="main-content flex-1 relative">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
    <div v-if="position=='bottom'" style="height:60px;width:100%"></div>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  flex: 1;
  overflow: auto;
  background-color: #fff;
  padding: 5px 10px;
}
</style>
