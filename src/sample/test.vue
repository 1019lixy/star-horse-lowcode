<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import LangTest from "@/sample/LangTest.vue";
import FormRelationOperation from "@/sample/FormRelationOperation.vue";

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
    <!--    <dialog-valid/>-->
    <FormRelationOperation/>
  </div>
</template>
<style lang="scss" scoped></style>
