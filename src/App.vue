<template>
 <star-horse-icon icon-class="add" />
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import StarHorseJsonEditor from '@/components/comp/StarHorseJsonEditor.vue';
import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
const val=ref<string>('{}');
const currentPage4 = ref(4);

const pageSize4 = ref(100);
const size = ref<string>('default');
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
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
