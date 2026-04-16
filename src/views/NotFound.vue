<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <el-button @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  h1 {
    font-size: 72px;
    color: #42b983;
  }

  p {
    font-size: 24px;
    color: #666;
  }
}
</style>
