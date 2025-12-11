<script setup lang="ts" name="Areainfo">
import {onMounted} from 'vue';
import LangTest from "@/sample/LangTest.vue";
import FormRelationOperation from "@/sample/FormRelationOperation.vue";
import StarHorseDraggableValid from "@/sample/StarHorseDraggableValid.vue";
import TransferItem from "@/sample/TransferItem.vue";
import DialogItem from "@/sample/DialogItem.vue";

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
    <DialogItem/>
<!--    <TransferItem/>-->
    <!--    <dialog-valid/>-->
<!--    <FormRelationOperation/>-->
  </div>
</template>
<style lang="scss" scoped></style>
