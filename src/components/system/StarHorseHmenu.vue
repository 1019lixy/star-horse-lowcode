<script setup lang="ts" name="StarHorseHmenu">
import {inject, onMounted, ref} from 'vue';
import {postRequest} from '@/api/star_horse_apis';
import {getUserInfo} from '@/utils/auth';
import SystemSubMenu from '@/components/menu/SystemSubMenu.vue';

let dataList = ref([]);
  const loadMenuFun = inject('loadMenu') as Function;
  const handleSelect = (data: any) => {
    loadMenuFun(data);
  };

  const initData = async () => {
    let query = getUserInfo()?.idUsersinfo;
    await postRequest('/system-config/system/informationsEntity/getUserSystem/' + query, [])
      .then((res) => {
        dataList.value = res?.data?.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMounted(() => {
    initData();
  });
</script>
<template>
  <el-menu class="system-menu" mode="horizontal" :ellipsis="false">
    <SystemSubMenu :dataList="dataList" style="width: 100% !important" />
  </el-menu>
</template>
<style lang="scss" scoped>
  .el-menu--horizontal {
    .el-menu-item {
      height: inherit;
    }

    .el-menu-item.is-active,
    .el-menu-item:hover,
    .el-submenu__title:hover,
    .el-submenu__title.is-opened {
      background-color: unset !important;
    }
  }

  :deep(.el-submenu__title:hover),
  :deep(.el-sub-menu:hover),
  .el-tooltip__trigger:hover,
  .el-submenu__title.is-opened {
    background-color: unset !important;
  }

  .sub-class:hover {
    background-color: unset !important;
  }

  .system-menu {
    --el-menu-bg-color: #fff;
    --el-menu-text-color: #eee;
    --el-menu-active-color: #ffd04b;
    --el-menu-hover-bg-color: rgb(245, 235, 255, 0.5);
    max-height: 50px;
    background-color: unset !important;
    width: 100% !important;
    border-bottom: unset !important;
    color: var(--star-horse-white);
    font-weight: bold;
    font-size: 16px;
  }

  :deep(.el-sub-menu) {
    background-color: unset !important;
  }

  .star-icon {
    font-size: 26px;
    color: var(--star-horse-white);
  }

  :deep(.el-icon) {
    svg {
      height: 1.5em;
      width: 1.5em;
      color: var(--star-horse-white) !important;
    }
  }
</style>
