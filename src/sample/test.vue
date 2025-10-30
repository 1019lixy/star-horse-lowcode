<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import FormValid from "@/sample/FormValid.vue";
import StarHorseDraggableValid from "@/sample/StarHorseDraggableValid.vue";

const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
<!--    <FormValid/>-->
    <StarHorseDraggableValid/>
  </div>
</template>
<style lang="scss" scoped></style>
