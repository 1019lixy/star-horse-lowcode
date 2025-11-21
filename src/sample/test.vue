<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import DialogValid from "@/sample/DialogValid.vue";

const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!--    <FormValid/>-->
    <!--    <StarHorseDraggableValid/>-->
    <dialog-valid/>
  </div>
</template>
<style lang="scss" scoped></style>
