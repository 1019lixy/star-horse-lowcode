<template>
  <RouterView/>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";

const closeAction = () => {
  //关闭浏览器清空数据
  window.onbeforeunload = async (evt) => {
    evt.preventDefault();
    // userInfoStore.logout();
    // await userLogout(userInfo || {});
  };
};
onMounted(() => {
  closeAction();
});

</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
