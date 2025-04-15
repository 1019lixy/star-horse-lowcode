<template>
  <el-pagination
      :page-size="20"
      :pager-count="11"
      layout="prev, pager, next"
      :total="1000"
  />
  <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
<StarHorseJsonEditor :modelValue="val"/>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import StarHorseJsonEditor from "@/components/comp/StarHorseJsonEditor.vue";
const val=ref<string>("{}");
const currentPage4 = ref(4)

const pageSize4 = ref(100)
const size = ref<string>('default')
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
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
