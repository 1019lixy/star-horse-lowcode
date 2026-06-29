<script setup lang="ts">
const loadAppmenus = () => {
  const appMenuDatas = [
    {
      path: "#",
      name: "#",
      children: [
        {
          path: "/general/page/No1778743866732",
          name: "No1778743866732",
          children: [],
          meta: {
            menuIcon: "document",
            title: "异常反馈表",
            menuId: "2_385153626441517052",
            keepAlive: "Y",
          },
        },
        {
          path: "/general/page/No1778805248000",
          name: "No1778805248000",
          children: [],
          meta: {
            menuIcon: "document",
            title: "停线整改通知单",
            menuId: "2_385219533788414972",
            keepAlive: "Y",
          },
        },
        {
          path: "/general/page/No1778805772590",
          name: "No1778805772590",
          children: [],
          meta: {
            menuIcon: "document",
            title: "返工通知书",
            menuId: "2_385220096429131772",
            keepAlive: "Y",
          },
        },
        {
          path: "/general/page/No1778805966677",
          name: "No1778805966677",
          children: [],
          meta: {
            menuIcon: "document",
            title: "TEST点胶首件确认表",
            menuId: "2_385220304735045628",
            keepAlive: "Y",
          },
        },
        {
          path: "/general/page/No1778806122414",
          name: "No1778806122414",
          children: [],
          meta: {
            menuIcon: "document",
            title: "SMT首件确认表",
            menuId: "2_385220472238769148",
            keepAlive: "Y",
          },
        },
        {
          path: "/general/page/No1778806284129",
          name: "No1778806284129",
          children: [],
          meta: {
            menuIcon: "document",
            title: "IPQC稽核问题一览表",
            menuId: "2_385220646184944636",
            keepAlive: "Y",
          },
        },
      ],
      meta: { menuIcon: "document", title: "质量系统", menuId: "1_1" },
    },
  ];
  const appMenus: any = [
    {
      name: "Home",
      meta: {
        menuIcon: "home",
        title: "首页",
        menuId: "01",
      },
      path: "/home",
    },
  ];
  if (appMenuDatas?.length > 0) {
    appMenus.push(appMenuDatas[0]);
    if (appMenuDatas.length > 2) {
      appMenus.push({
        name: "Business",
        meta: {
          menuIcon: "document",
          title: "业务菜单",
          menuId: "02",
        },
        path: "#",
        children: appMenuDatas.slice(1),
      });
    } else if (appMenuDatas.length > 1) {
      appMenus.push(appMenuDatas[1]);
    }
  }
  appMenus.push({
    name: "User",
    meta: {
      menuIcon: "user",
      title: "我的",
      menuId: "03",
    },
    path: "/userCenter",
    children: [],
  });
  console.log(appMenus);
  return appMenus;
};
const cachedDatas = [];
</script>

<template>
  <MainContainer
    :categories="loadAppmenus()"
    iconType="ele"
    :cachedDatas="cachedDatas"
    position="bottom"
  />
</template>

<style scoped lang="scss"></style>
