<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import ComplexFormAnalysis from "@/sample/ComplexFormAnalysis.vue";

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
    <complex-form-analysis/>
  </div>
</template>
<style lang="scss" scoped></style>
