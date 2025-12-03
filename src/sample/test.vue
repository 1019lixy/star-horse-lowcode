<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import LangTest from "@/sample/LangTest.vue";
import FormRelationOperation from "@/sample/FormRelationOperation.vue";
import StarHorseDraggableValid from "@/sample/StarHorseDraggableValid.vue";
import TransferItem from "@/sample/TransferItem.vue";

const initData = async () => {
};
onMounted(() => {
  initData();
});

</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!--    <FormValid/>-->
<!--        <StarHorseDraggableValid/>-->
    <TransferItem/>
    <!--    <dialog-valid/>-->
<!--    <FormRelationOperation/>-->
  </div>
</template>
<style lang="scss" scoped></style>
